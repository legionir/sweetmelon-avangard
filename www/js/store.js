(function (g) {
  'use strict';
  var N = function () { return g.NativeSDK; };

  // The bridge answers with the value, or { success, data } on some builds.
  function unwrap(r) { return r && typeof r === 'object' && 'success' in r && 'data' in r ? r.data : r; }

  async function load(key, fallback) {
    try {
      var v = unwrap(await N().storage.get(key));
      return v === null || v === undefined ? fallback : v;
    } catch (e) { return fallback; }
  }
  async function save(key, value) { try { await N().storage.set(key, value); } catch (e) { console.warn('save', key, e); } }
  // secureStorage.get answers { key, value, found }, not the bare value.
  async function secret(key) {
    try {
      var r = unwrap(await N().secureStorage.get(key));
      var v = r && typeof r === 'object' && 'value' in r ? r.value : r;
      if (v == null || typeof v === 'object') return '';
      v = String(v);
      return v === '[object Object]' ? '' : v; // written by an earlier build that read this wrongly
    } catch (e) { return ''; }
  }
  async function setSecret(key, v) { try { if (v) await N().secureStorage.set(key, v); else await N().secureStorage.remove(key); } catch (e) { console.warn('secret', e); } }

  var DEFAULTS = {
    lang: '', theme: 'dark', mode: 'vpn', activeId: '',
    remoteDns: true, dnsIpv4: '8.8.8.8', enableIpv6: false, blockIpv6: true, bypassLan: false, globalMode: true, tunnelMtu: 8500,
    killSwitch: true, splitMode: 'off', apps: [], excludeGoogleServices: false,
    warmPool: 2, idleMin: 15, connectTimeoutSec: 15, pingIntervalSec: 45, logLevel: 'warn',
    share: { enabled: false, port: 1080, bind: '0.0.0.0', authEnabled: true, username: 'avangard', password: '', allowPrivate: false }
  };

  function uid() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function randomPass(n) {
    var a = new Uint8Array(n), c = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
    (g.crypto || g.msCrypto).getRandomValues(a);
    for (var i = 0; i < n; i++) s += c[a[i] % c.length];
    return s;
  }

  var Store = {
    settings: null, profiles: [],
    async init() {
      var s = await load('settings', {});
      Store.settings = Object.assign({}, DEFAULTS, s, { share: Object.assign({}, DEFAULTS.share, s.share || {}) });
      Store.settings.share.password = await secret('share_password');
      if (!Store.settings.share.password) { Store.settings.share.password = randomPass(10); await setSecret('share_password', Store.settings.share.password); }
      Store.profiles = await load('profiles', []);
      for (var i = 0; i < Store.profiles.length; i++) Store.profiles[i].password = await secret('pwd_' + Store.profiles[i].id);
    },
    async saveSettings() {
      var s = JSON.parse(JSON.stringify(Store.settings));
      var pw = s.share.password; delete s.share.password;
      await save('settings', s);
      await setSecret('share_password', pw);
    },
    async saveProfile(p) {
      if (!p.id) p.id = uid();
      var i = Store.profiles.findIndex(function (x) { return x.id === p.id; });
      if (i >= 0) Store.profiles[i] = p; else Store.profiles.push(p);
      await setSecret('pwd_' + p.id, p.password);
      await Store.persistProfiles();
      if (!Store.settings.activeId) { Store.settings.activeId = p.id; await Store.saveSettings(); }
      return p;
    },
    async deleteProfile(id) {
      Store.profiles = Store.profiles.filter(function (x) { return x.id !== id; });
      await setSecret('pwd_' + id, '');
      if (Store.settings.activeId === id) Store.settings.activeId = Store.profiles[0] ? Store.profiles[0].id : '';
      await Store.persistProfiles(); await Store.saveSettings();
    },
    async persistProfiles() {
      await save('profiles', Store.profiles.map(function (p) { var c = Object.assign({}, p); delete c.password; return c; }));
    },
    active() { return Store.profiles.find(function (p) { return p.id === Store.settings.activeId; }) || Store.profiles[0] || null; },

    /** The configuration the native plugin takes. */
    buildConfig(p) {
      var s = Store.settings, sh = s.share;
      var c = {
        mode: s.mode, label: p.name,
        serverHost: p.host, serverPort: Number(p.port) || 443, useTls: p.useTls !== false, wsPath: p.path || '/', password: p.password,
        sni: p.sni || '', hostHeader: p.hostHeader || '', allowInsecure: !!p.allowInsecure,
        remoteDns: s.remoteDns, dnsIpv4: s.dnsIpv4, enableIpv6: s.enableIpv6, blockIpv6: s.blockIpv6, bypassLan: s.bypassLan,
        globalMode: s.globalMode, tunnelMtu: Number(s.tunnelMtu) || 8500, killSwitch: s.killSwitch,
        splitMode: s.splitMode, apps: s.apps, excludeGoogleServices: s.excludeGoogleServices,
        warmPool: Number(s.warmPool), idleTimeoutMs: Math.round(Number(s.idleMin) * 60000), connectTimeoutMs: Math.round(Number(s.connectTimeoutSec) * 1000),
        pingIntervalSec: Number(s.pingIntervalSec), logLevel: s.logLevel,
        notification: {
          connecting: I18n.t('connecting'), connected: I18n.t('connected'), reconnecting: I18n.t('reconnecting'),
          disconnect: I18n.t('disconnectBtn'), download: '↓', upload: '↑'
        }
      };
      if (sh.enabled || s.mode === 'proxy') {
        c.share = { enabled: true, bind: sh.bind, port: Number(sh.port) || 1080, authEnabled: !!sh.authEnabled, username: sh.username, password: sh.password, allowPrivate: !!sh.allowPrivate };
      }
      return c;
    },

    /** wss://host:port/path?x=1  ->  profile fields. Accepts a JSON profile too. */
    parseImport(text) {
      text = (text || '').trim();
      if (!text) throw new Error('empty');
      if (text[0] === '{' || text[0] === '[') {
        var j = JSON.parse(text);
        return (Array.isArray(j) ? j : [j]).map(function (x) { return Store.normalize(x); });
      }
      var u = new URL(text.replace(/^w2ray:/i, 'wss:'));
      var tls = u.protocol === 'wss:' || u.protocol === 'https:';
      var q = u.searchParams;
      return [Store.normalize({
        name: decodeURIComponent(u.hash.replace(/^#/, '')) || u.hostname,
        host: u.hostname, port: Number(u.port) || (tls ? 443 : 80), useTls: tls, path: u.pathname || '/',
        password: u.password ? decodeURIComponent(u.password) : (q.get('password') || q.get('pass') || ''),
        sni: q.get('sni') || '', allowInsecure: q.get('insecure') === '1' || q.get('allowInsecure') === '1'
      })];
    },
    normalize(x) {
      return {
        id: '', name: String(x.name || x.host || 'Server'), host: String(x.host || x.serverHost || '').trim(), port: Number(x.port || x.serverPort) || 443,
        useTls: x.useTls !== false && x.useSSL !== false, path: x.path || x.wsPath || '/', password: String(x.password || ''),
        sni: x.sni || '', hostHeader: x.hostHeader || '', allowInsecure: !!x.allowInsecure
      };
    },
    toLink(p) {
      var q = [];
      if (p.sni) q.push('sni=' + encodeURIComponent(p.sni));
      if (p.allowInsecure) q.push('insecure=1');
      return (p.useTls ? 'wss' : 'ws') + '://:' + encodeURIComponent(p.password) + '@' + p.host + ':' + p.port + (p.path || '/') + (q.length ? '?' + q.join('&') : '') + '#' + encodeURIComponent(p.name);
    },
    unwrap: unwrap, randomPass: randomPass, DEFAULTS: DEFAULTS
  };
  g.Store = Store;
})(window);
