(function (g) {
  'use strict';
  var t = I18n.t, $ = function (s, r) { return (r || document).querySelector(s); };
  var W = function () { return g.NativeSDK.w2rayTunnel; };

  var P = {
    hub: '<circle cx="12" cy="12" r="2.6"/><circle cx="5" cy="6" r="1.8"/><circle cx="19" cy="6" r="1.8"/><circle cx="12" cy="20" r="1.8"/><path d="M6.4 7.2l3.6 3M17.6 7.2l-3.6 3M12 14.6v3.6"/>',
    home: '<path d="M4 11.5L12 4l8 7.5M6 10.5V20h4.5v-5.5h3V20H18v-9.5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    share: '<path d="M17 7H6M9.5 3.5L6 7l3.5 3.5M7 17h11M14.5 13.5L18 17l-3.5 3.5"/>',
    term: '<path d="M3.5 5.5h17v13h-17zM7.5 10l3 2-3 2M12.5 14h4"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4"/>',
    power: '<path d="M12 3.5v8M7.2 6.8a7.5 7.5 0 1 0 9.6 0"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4.2h-4.2"/>',
    shield: '<path d="M12 3.2l7.5 2.8v5.6c0 4.4-3 7.9-7.5 9.2-4.5-1.3-7.5-4.8-7.5-9.2V6zM8.8 12l2.4 2.4 4-4.4"/>',
    down: '<path d="M12 5v14M6.5 13.5L12 19l5.5-5.5"/>', up: '<path d="M12 19V5M6.5 10.5L12 5l5.5 5.5"/>',
    bolt: '<path d="M13 3L5.5 13.5H11L10 21l7.5-10.5H12z"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', edit: '<path d="M4 20l1-4.5L16 4.5a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8L8.5 19z"/>',
    chev: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>', copy: '<path d="M8.5 8.5h10v11h-10zM5.5 15.5v-11h10"/>',
    phone: '<path d="M8 3.5h8A1.5 1.5 0 0 1 17.5 5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5zM11 17.5h2"/>',
    dns: '<path d="M4 6h16v5H4zM4 13h16v5H4zM7.5 8.5h.01M7.5 15.5h.01"/>',
    globe: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM3.5 12h17M12 3.5c2.5 2.6 3.5 5.5 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.5-3.5-8.5s1-5.9 3.5-8.5z"/>'
  };
  function ic(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + P[n] + '</svg>'; }

  var ui = { tab: 'home', status: { state: 'idle', share: { enabled: false } }, speeds: [], info: null, logs: [], sheet: null, stats: null };
  var TABS = [['home', 'home', 'home'], ['profiles', 'list', 'profiles'], ['share', 'share', 'share'], ['logs', 'term', 'logs'], ['settings', 'sliders', 'settings']];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtBytes(b) { b = Number(b) || 0; if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'; if (b < 1073741824) return (b / 1048576).toFixed(1) + ' MB'; return (b / 1073741824).toFixed(2) + ' GB'; }
  function fmtDur(ms) { var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); s = s % 60; return [h, m, s].map(function (x) { return String(x).padStart(2, '0'); }).join(':'); }
  function toast(msg) { var el = $('#toast'); el.textContent = msg; el.classList.remove('hidden'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.add('hidden'); }, 2600); }
  function errText(e) { return (e && (e.message || e.error || e.toString())) || String(e); }
  async function copy(text) { try { await g.NativeSDK.clipboard.writeText(text); } catch (e) { try { await navigator.clipboard.writeText(text); } catch (_) { } } toast(t('copied')); }
  function buzz() { try { g.NativeSDK.haptic.lightImpact(); } catch (e) { } }
  function sw(id, on) { return '<label class="sw"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><i></i></label>'; }
  function running() { return ['connecting', 'connected', 'reconnecting'].indexOf(ui.status.state) >= 0; }

  // ───────────── sheet
  function openSheet(html, mount) {
    var el = $('#sheet'); el.innerHTML = '<div class="box">' + html + '</div>'; el.classList.remove('hidden'); ui.sheet = true;
    el.onclick = function (e) { if (e.target === el) closeSheet(); };
    if (mount) mount(el);
  }
  function closeSheet() { $('#sheet').classList.add('hidden'); $('#sheet').innerHTML = ''; ui.sheet = false; }

  // ───────────── header / state
  var STATE_LABEL = { idle: 'idle', connecting: 'connecting', connected: 'connected', reconnecting: 'reconnecting', disconnecting: 'disconnecting', error: 'error' };
  function paintHeader() {
    var c = $('#stateChip'), st = ui.status.state;
    c.textContent = t(STATE_LABEL[st] || 'idle').replace('…', '');
    $('#app').className = 's-' + st;
  }

  // ───────────── tabs
  function paintTabs() {
    $('#tabs').innerHTML = TABS.map(function (x) { return '<button data-tab="' + x[0] + '" class="' + (ui.tab === x[0] ? 'on' : '') + '">' + ic(x[1]) + esc(t(x[2])) + '</button>'; }).join('');
    $('#tabs').onclick = function (e) { var b = e.target.closest('button'); if (b) { ui.tab = b.dataset.tab; paintTabs(); render(); } };
  }
  function render() {
    paintHeader();
    var v = $('#view');
    ({ home: viewHome, profiles: viewProfiles, share: viewShare, logs: viewLogs, settings: viewSettings })[ui.tab](v);
  }

  // ───────────── HOME
  function viewHome(v) {
    var p = Store.active(), st = ui.status, s = ui.stats || {};
    var info = ui.info || {}, busy = ['connecting', 'reconnecting', 'disconnecting'].indexOf(st.state) >= 0;
    var sub1 = { idle: 'sub_off', connecting: 'sub_connecting', reconnecting: 'sub_reconnecting', connected: 'sub_on', error: 'sub_error', disconnecting: 'sub_reconnecting' }[st.state];
    var hint = st.state === 'error' ? esc(st.message || '') : (running() ? t('tapDisconnect') : (p ? t('tapConnect') : t('noProfile')));
    var on = st.state === 'connected';
    v.innerHTML =
      '<div class="orbwrap"><div class="orb">' +
      '<svg class="arcs" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" stroke-dasharray="130 41"/></svg><div class="ring"></div>' +
      '<button class="power" id="power" aria-label="power">' + (busy ? '<div class="spin"></div>' : ic(on ? 'hub' : 'power')) + '</button>' +
      (on && (st.share && st.share.connections > 0 || s.connections > 0) ? '<span class="badge">' + (s.connections || 0) + '</span>' : '') + '</div>' +
      '<div class="title">' + esc(t(STATE_LABEL[st.state] || 'idle').replace('…', '')) + '</div>' +
      '<div class="sub1">' + esc(t(sub1)) + '</div>' +
      '<div class="sub2">' + (p ? '<b>' + esc(p.name) + '</b> · ' + esc(p.host) + '<br>' : '') + hint + '</div></div>' +
      '<div class="metrics">' +
      metric('down', 'download', 'sDown', fmtBytes(s.rx), 'var(--accent)', on, fmtBytes(s.rxRate) + '/s', 'sDownR') +
      metric('up', 'upload', 'sUp', fmtBytes(s.tx), 'var(--purple)', on, fmtBytes(s.txRate) + '/s', 'sUpR') +
      metric('bolt', 'connections', 'sConn', String(s.connections || 0), 'var(--amber)', on, fmtDur(s.uptime || 0), 'sDur') + '</div>' +
      '<div class="actions"><button class="btn big' + (running() ? ' danger' : '') + '" id="power2">' + t(running() ? 'disconnectBtn' : 'connectBtn') + '</button>' +
      '<button class="btn sec icon' + (running() ? '' : ' dis') + '" id="reconn" aria-label="reconnect">' + ic('refresh') + '</button>' +
      '<button class="btn sec icon" id="perm" aria-label="permissions">' + ic('shield') + '</button></div>' +
      (running() ? '<div class="card" style="margin-top:14px"><h3>' + t('speedChart') + '</h3><canvas id="chart" width="600" height="168"></canvas></div>' : '') +
      (st.state === 'connected' ? '<div class="card"><h3>' + t('server') + '</h3>' +
        row(t('ip'), info.ip || '—') + row(t('location'), [info.city, info.country].filter(Boolean).join(', ') || '—') + row(t('isp'), info.isp || '—') +
        row(t('ping'), info.serverMs > 0 ? info.serverMs + ' ms' : '—') + row(t('pingTarget'), info.targetMs > 0 ? info.targetMs + ' ms' : '—') +
        '<div class="btns" style="margin-top:10px"><button class="btn sec sm" id="refInfo">' + ic('refresh') + t('refresh') + '</button></div></div>' : '') +
      (running() && st.share && st.share.enabled ? '<div class="card"><h3>' + t('shareTitle') + '</h3><div class="row"><div class="grow">' + t('sharingNow', { p: st.share.port }) + '<div class="sub">' + t('clients') + ': ' + ((st.share.clients || []).length) + ' · ' + t('connections') + ': ' + (st.share.connections || 0) + '</div></div></div></div>' : '');
    $('#power', v).onclick = togglePower; $('#power2', v).onclick = togglePower;
    $('#reconn', v).onclick = async function () { if (!running()) return; buzz(); try { await W().stop(); } catch (e) { } setTimeout(connect, 900); };
    $('#perm', v).onclick = async function () { try { await g.NativeSDK.permission.request('notification'); var ok = await W().prepare(); toast(ok ? t('permOk') : t('vpnPermission')); } catch (e) { toast(errText(e)); } };
    var r = $('#refInfo', v); if (r) r.onclick = fetchInfo;
    drawChart();
  }
  function metric(icon, label, id, val, color, on, rate, rateId) {
    return '<div class="metric' + (on ? ' on' : '') + '" style="--c:' + color + '">' + ic(icon) + '<b id="' + id + '">' + esc(val) + '</b><span>' + esc(t(label)) + '</span><div class="rate" id="' + rateId + '">' + esc(rate) + '</div></div>';
  }
  function row(a, b) { return '<div class="row"><div class="grow">' + esc(a) + '</div><div>' + esc(b) + '</div></div>'; }
  function drawChart() {
    var cv = $('#chart'); if (!cv) return;
    var c = cv.getContext('2d'), w = cv.width, h = cv.height; c.clearRect(0, 0, w, h);
    var d = ui.speeds, max = Math.max.apply(null, [1024].concat(d.map(function (x) { return Math.max(x.d, x.u); })));
    function line(key, col) { c.beginPath(); c.strokeStyle = col; c.lineWidth = 3; d.forEach(function (x, i) { var X = i / 59 * w, Y = h - 6 - x[key] / max * (h - 14); i ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.stroke(); }
    var cs = getComputedStyle(document.documentElement); line('d', cs.getPropertyValue('--accent').trim() || '#00F5C4'); line('u', cs.getPropertyValue('--purple').trim() || '#7B61FF');
  }

  async function togglePower() {
    buzz();
    if (running()) { try { await W().stop(); } catch (e) { toast(errText(e)); } return; }
    await connect();
  }
  async function connect() {
    var p = Store.active();
    if (!p) { toast(t('noProfile')); ui.tab = 'profiles'; paintTabs(); render(); return; }
    if (!p.host || !p.password) { toast(t('needsServer')); return; }
    var s = Store.settings;
    if (s.mode === 'proxy' && !s.share.enabled) { toast(t('proxyOnlyNeedsShare')); ui.tab = 'share'; paintTabs(); render(); return; }
    try {
      try { await g.NativeSDK.permission.request('notification'); } catch (e) { }
      if (s.mode === 'vpn') {
        var ok = await W().prepare();
        if (!ok) { toast(t('vpnPermission')); return; }
      }
      ui.speeds = []; ui.info = null; ui.stats = null;
      await W().start(Store.buildConfig(p));
    } catch (e) { toast(errText(e)); ui.status = { state: 'error', message: errText(e), share: { enabled: false } }; render(); }
  }
  async function fetchInfo() {
    try { ui.info = await W().netInfo(); } catch (e) { ui.info = { ip: '', serverMs: -1, targetMs: -1 }; }
    if (ui.tab === 'home') render();
  }

  // ───────────── PROFILES
  function viewProfiles(v) {
    var list = Store.profiles, act = Store.active();
    v.innerHTML = '<div class="btns" style="margin:6px 0 14px"><button class="btn" id="addP">' + ic('plus') + t('addProfile') + '</button><button class="btn sec" id="impP">' + t('import') + '</button></div>' +
      (list.length ? list.map(function (p) {
        var cur = act && act.id === p.id;
        return '<div class="prof' + (cur ? ' act' : '') + '" data-id="' + p.id + '"><div class="dot">' + ic('dns') + '</div><div class="grow"><b>' + esc(p.name) + '</b>' + (cur ? '<span class="tag">' + t('active') + '</span>' : '') +
          '<div class="sub">' + esc(p.host) + ':' + p.port + esc(p.path) + (p.useTls ? ' · TLS' : '') + '</div></div>' +
          '<div class="btns" style="flex-wrap:nowrap;gap:8px"><button class="btn sec sm" data-a="use" aria-label="use">' + ic('check') + '</button><button class="btn sec sm" data-a="edit" aria-label="edit">' + ic('edit') + '</button></div></div>';
      }).join('') : '<div class="empty">' + t('noProfiles') + '</div>');
    $('#addP', v).onclick = function () { editProfile(null); };
    $('#impP', v).onclick = importSheet;
    v.onclick = async function (e) {
      var b = e.target.closest('button[data-a]'); if (!b) return; var id = b.closest('.prof').dataset.id;
      if (b.dataset.a === 'use') {
        if (running()) { toast(t('backgroundHint')); }
        Store.settings.activeId = id; await Store.saveSettings(); render();
      } else editProfile(Store.profiles.find(function (x) { return x.id === id; }));
    };
  }
  function editProfile(p) {
    var isNew = !p; p = p || Store.normalize({ name: '', host: '', port: 443, path: '/api/stream' });
    openSheet('<h2>' + t(isNew ? 'addProfile' : 'editProfile') + '</h2>' +
      '<label class="f">' + t('name') + '</label><input id="fName" value="' + esc(p.name) + '">' +
      '<label class="f">' + t('url') + ' (' + t('urlHint') + ')</label><input id="fUrl" dir="ltr" placeholder="' + t('urlHint') + '">' +
      '<div class="btns" style="gap:10px"><div style="flex:2"><label class="f">' + t('host') + '</label><input id="fHost" dir="ltr" value="' + esc(p.host) + '"></div><div style="flex:1"><label class="f">' + t('port') + '</label><input id="fPort" type="number" value="' + p.port + '"></div></div>' +
      '<label class="f">' + t('path') + '</label><input id="fPath" dir="ltr" value="' + esc(p.path) + '">' +
      '<label class="f">' + t('password') + '</label><input id="fPass" type="password" value="' + esc(p.password) + '">' +
      '<div class="row"><div class="grow">' + t('useTls') + '</div>' + sw('fTls', p.useTls) + '</div>' +
      '<details><summary class="sub" style="padding:8px 0">' + t('advancedServer') + '</summary>' +
      '<label class="f">' + t('sni') + '</label><input id="fSni" dir="ltr" value="' + esc(p.sni) + '">' +
      '<label class="f">' + t('hostHeader') + '</label><input id="fHostH" dir="ltr" value="' + esc(p.hostHeader) + '">' +
      '<div class="row"><div class="grow">' + t('allowInsecure') + '</div>' + sw('fIns', p.allowInsecure) + '</div></details>' +
      '<div id="fMsg" class="hint"></div>' +
      '<div class="btns" style="margin-top:12px"><button class="btn" id="fSave">' + t('save') + '</button><button class="btn sec" id="fTest">' + t('test') + '</button>' +
      (isNew ? '' : '<button class="btn sec" id="fDup">' + t('duplicate') + '</button><button class="btn sec" id="fLink">' + t('copy') + ' link</button><button class="btn danger" id="fDel">' + t('delete') + '</button>') + '<button class="btn sec" id="fCancel">' + t('cancel') + '</button></div>',
      function (el) {
        function read() {
          var u = $('#fUrl', el).value.trim(), base = { name: $('#fName', el).value.trim() };
          var q = { host: $('#fHost', el).value.trim(), port: Number($('#fPort', el).value) || 443, path: $('#fPath', el).value.trim() || '/', password: $('#fPass', el).value, useTls: $('#fTls', el).checked, sni: $('#fSni', el).value.trim(), hostHeader: $('#fHostH', el).value.trim(), allowInsecure: $('#fIns', el).checked };
          if (u) { var x = Store.parseImport(u)[0]; q = Object.assign(q, { host: x.host, port: x.port, path: x.path, useTls: x.useTls }); if (x.password) q.password = x.password; if (x.sni) q.sni = x.sni; if (x.allowInsecure) q.allowInsecure = true; if (!base.name) base.name = x.name; }
          var out = Object.assign({}, p, q, base); if (!out.name) out.name = out.host; return out;
        }
        $('#fCancel', el).onclick = closeSheet;
        $('#fSave', el).onclick = async function () {
          try { var o = read(); if (!o.host || !o.password) { $('#fMsg', el).innerHTML = '<span class="err">' + t('needsServer') + '</span>'; return; } await Store.saveProfile(o); closeSheet(); toast(t('saved')); render(); }
          catch (e) { $('#fMsg', el).innerHTML = '<span class="err">' + esc(errText(e)) + '</span>'; }
        };
        $('#fTest', el).onclick = async function () {
          var m = $('#fMsg', el); m.textContent = t('testing');
          try { var o = read(); var r = await W().test(Store.buildConfig(o), true); m.textContent = t('testOk', { ms: r.serverMs }) + (r.targetMs > 0 ? ' · ' + r.targetMs + ' ms' : ''); }
          catch (e) { m.innerHTML = '<span class="err">' + esc(t('testFail', { e: errText(e) })) + '</span>'; }
        };
        if (!isNew) {
          $('#fDel', el).onclick = async function () { if (confirm(t('confirmDelete'))) { await Store.deleteProfile(p.id); closeSheet(); toast(t('deleted')); render(); } };
          $('#fDup', el).onclick = async function () { var c = Object.assign({}, p, { id: '', name: p.name + ' 2' }); await Store.saveProfile(c); closeSheet(); render(); };
          $('#fLink', el).onclick = function () { copy(Store.toLink(p)); };
        }
      });
  }
  function importSheet() {
    openSheet('<h2>' + t('import') + '</h2><div class="sub">' + t('importHint') + '</div><textarea id="iTxt" rows="5" dir="ltr"></textarea><div id="iMsg" class="hint"></div>' +
      '<div class="btns" style="margin-top:10px"><button class="btn" id="iOk">' + t('import') + '</button><button class="btn sec" id="iPaste">Paste</button><button class="btn sec" id="iCancel">' + t('cancel') + '</button></div>', function (el) {
        $('#iCancel', el).onclick = closeSheet;
        $('#iPaste', el).onclick = async function () { try { $('#iTxt', el).value = Store.unwrap(await g.NativeSDK.clipboard.readText()).text || Store.unwrap(await g.NativeSDK.clipboard.readText()) || ''; } catch (e) { } };
        $('#iOk', el).onclick = async function () {
          try { var list = Store.parseImport($('#iTxt', el).value); for (var i = 0; i < list.length; i++) await Store.saveProfile(list[i]); closeSheet(); toast(t('saved')); render(); }
          catch (e) { $('#iMsg', el).innerHTML = '<span class="err">' + esc(errText(e)) + '</span>'; }
        };
      });
  }

  // ───────────── SHARE
  var addrCache = [];
  async function loadAddrs() { try { addrCache = await W().addresses(); } catch (e) { addrCache = []; } if (ui.tab === 'share') render(); }
  function shareUri(a) {
    var sh = Store.settings.share, host = a.ipv6 ? '[' + a.address + ']' : a.address;
    return 'socks5://' + (sh.authEnabled ? encodeURIComponent(sh.username) + ':' + encodeURIComponent(sh.password) + '@' : '') + host + ':' + sh.port;
  }
  function viewShare(v) {
    var s = Store.settings, sh = s.share, st = ui.status.share || { enabled: false };
    var live = running() && st.enabled;
    v.innerHTML = '<div class="card"><h3>' + t('shareTitle') + '</h3><div class="diagram"><div class="n">' + ic('phone') + 'Client</div><span class="ar">' + ic('chev') + '</span><div class="n">' + ic('hub') + 'This phone</div><span class="ar">' + ic('chev') + '</span><div class="n">' + ic('globe') + 'w2ray</div></div><div class="sub" style="margin-bottom:8px;color:var(--dim);font-size:12px">' + t('shareIntro') + '</div>' +
      '<div class="row"><div class="grow">' + t('shareEnable') + '</div>' + sw('shOn', sh.enabled) + '</div>' +
      '<label class="f">' + t('shareMode') + '</label><select id="shMode"><option value="vpn"' + (s.mode === 'vpn' ? ' selected' : '') + '>' + t('modeVpn') + '</option><option value="proxy"' + (s.mode === 'proxy' ? ' selected' : '') + '>' + t('modeProxy') + '</option></select>' +
      '<label class="f">' + t('sharePort') + '</label><input id="shPort" type="number" min="1" max="65535" value="' + sh.port + '">' +
      '<div class="row"><div class="grow">' + t('shareAuth') + '</div>' + sw('shAuth', sh.authEnabled) + '</div>' +
      (sh.authEnabled ? '<label class="f">' + t('shareUser') + '</label><input id="shUser" dir="ltr" value="' + esc(sh.username) + '"><label class="f">' + t('sharePass') + '</label><div class="btns" style="flex-wrap:nowrap"><input id="shPass" dir="ltr" value="' + esc(sh.password) + '"><button class="btn sec sm" id="shRand">' + t('randomize') + '</button></div>' : '') +
      '<label class="f">' + t('shareBind') + '</label><select id="shBind"><option value="0.0.0.0"' + (sh.bind === '0.0.0.0' ? ' selected' : '') + '>' + t('allInterfaces') + '</option>' + addrCache.filter(function (a) { return !a.ipv6; }).map(function (a) { return '<option value="' + a.address + '"' + (sh.bind === a.address ? ' selected' : '') + '>' + a.address + ' (' + a.kind + ')</option>'; }).join('') + '</select>' +
      '<div class="row"><div class="grow">' + t('allowPrivate') + '</div>' + sw('shPriv', sh.allowPrivate) + '</div>' +
      (sh.enabled && !sh.authEnabled ? '<div class="err">' + t('shareWarn') + '</div>' : '') +
      '<div class="btns" style="margin-top:14px">' +
      (running() ? '<button class="btn" id="shApply">' + t('save') + '</button>' + (live ? '<button class="btn danger" id="shStop">' + t('stopShare') + '</button>' : '') :
        '<button class="btn" id="shStart">' + t('startShare') + '</button><button class="btn sec" id="shSave">' + t('save') + '</button>') + '</div></div>' +
      '<div class="card"><h3>' + t('address') + '</h3>' + (addrCache.length ? addrCache.map(function (a) {
        return '<div class="row"><div class="grow"><code class="addr">' + esc(a.address) + ':' + sh.port + '</code><div class="sub">' + esc(a.interface) + ' · ' + esc(a.kind) + '</div></div><button class="btn sec sm" data-uri="' + esc(shareUri(a)) + '">' + ic('copy') + t('copy') + '</button></div>';
      }).join('') : '<div class="sub">—</div>') + '<div class="btns" style="margin-top:8px"><button class="btn sec sm" id="shRef">' + ic('refresh') + t('refresh') + '</button></div></div>' +
      (running() ? '<div class="card"><h3>' + t('clients') + '</h3>' + ((st.clients || []).length ? st.clients.map(function (c) { return '<div class="row"><code class="addr">' + esc(c) + '</code></div>'; }).join('') : '<div class="sub">' + t('noClients') + '</div>') +
        (live ? '<div class="row"><div class="grow">' + t('connections') + '</div><div>' + (st.connections || 0) + ' / ' + (st.totalConnections || 0) + '</div></div><div class="row"><div class="grow">↓ ' + t('download') + '</div><div>' + fmtBytes(st.rx) + '</div></div><div class="row"><div class="grow">↑ ' + t('upload') + '</div><div>' + fmtBytes(st.tx) + '</div></div>' : '') + '</div>' : '');
    function readForm() {
      sh.enabled = $('#shOn', v).checked; s.mode = $('#shMode', v).value; sh.port = Number($('#shPort', v).value) || 1080;
      sh.authEnabled = $('#shAuth', v).checked; if ($('#shUser', v)) { sh.username = $('#shUser', v).value.trim(); sh.password = $('#shPass', v).value; }
      sh.bind = $('#shBind', v).value; sh.allowPrivate = $('#shPriv', v).checked;
      if (s.mode === 'proxy' && !sh.enabled) { sh.enabled = true; }
    }
    ['shAuth', 'shOn'].forEach(function (id) { $('#' + id, v).onchange = function () { readForm(); render(); }; });
    var rr = $('#shRand', v); if (rr) rr.onclick = function () { $('#shPass', v).value = Store.randomPass(10); };
    $('#shRef', v).onclick = loadAddrs;
    v.querySelectorAll('[data-uri]').forEach(function (b) { b.onclick = function () { copy(b.dataset.uri); }; });
    var sv = $('#shSave', v); if (sv) sv.onclick = async function () { readForm(); await Store.saveSettings(); toast(t('saved')); render(); };
    var stt = $('#shStart', v); if (stt) stt.onclick = async function () { readForm(); sh.enabled = true; await Store.saveSettings(); await connect(); };
    var ap = $('#shApply', v); if (ap) ap.onclick = async function () {
      readForm(); await Store.saveSettings();
      try { ui.status = await W().setShare(sh.enabled ? { enabled: true, bind: sh.bind, port: sh.port, authEnabled: sh.authEnabled, username: sh.username, password: sh.password, allowPrivate: sh.allowPrivate } : { enabled: false }); toast(t('shareApplied')); } catch (e) { toast(errText(e)); }
      render();
    };
    var sp = $('#shStop', v); if (sp) sp.onclick = async function () {
      sh.enabled = false; await Store.saveSettings();
      try { if (s.mode === 'proxy') await W().stop(); else ui.status = await W().setShare({ enabled: false }); } catch (e) { toast(errText(e)); }
      render();
    };
  }

  // ───────────── LOGS
  var logLevel = 'I';
  function viewLogs(v) {
    var order = { D: 0, I: 1, W: 2, E: 3 }, names = { D: 'DBG', I: 'INFO', W: 'WARN', E: 'ERR' }, cols = { D: 'var(--purple)', I: 'var(--accent)', W: 'var(--amber)', E: 'var(--danger)' };
    v.innerHTML = '<div class="chips">' + ['D', 'I', 'W', 'E'].map(function (k) { return '<button class="chipb' + (logLevel === k ? ' on' : '') + '" data-l="' + k + '" style="--c:' + cols[k] + '">' + names[k] + '</button>'; }).join('') +
      '</div><div class="btns" style="margin-bottom:12px"><button class="btn sec sm" id="lClear">' + t('clearLogs') + '</button><button class="btn sec sm" id="lShare">' + ic('share') + t('exportLogs') + '</button></div><div class="log" id="lBody"></div>';
    function paint() {
      var rows = ui.logs.filter(function (l) { return order[l.level] >= order[logLevel]; });
      $('#lBody', v).innerHTML = rows.length ? rows.slice(-400).map(function (l) { return '<div class="' + l.level + '"><time>' + new Date(l.time).toLocaleTimeString() + '</time>' + esc(l.message) + '</div>'; }).join('') : '<div class="empty">' + t('noLogs') + '</div>';
    }
    v.querySelectorAll('.chipb').forEach(function (b) { b.onclick = function () { logLevel = b.dataset.l; v.querySelectorAll('.chipb').forEach(function (x) { x.classList.toggle('on', x === b); }); paint(); }; });
    $('#lClear', v).onclick = async function () { ui.logs = []; try { await W().clearLogs(); } catch (e) { } paint(); };
    $('#lShare', v).onclick = function () { var txt = ui.logs.map(function (l) { return new Date(l.time).toISOString() + ' [' + l.level + '] ' + l.message; }).join('\n'); g.NativeSDK.share.shareText(txt, 'AvanGard logs').catch(function () { copy(txt); }); };
    paint(); ui.paintLogs = paint;
  }

  // ───────────── SETTINGS
  function viewSettings(v) {
    var s = Store.settings;
    var splitDesc = { off: t('splitOff'), exclude: t('splitExclude'), include: t('splitInclude') }[s.splitMode];
    function tog(id, title, desc, on) { return '<div class="row"><div class="grow">' + title + (desc ? '<div class="sub">' + desc + '</div>' : '') + '</div>' + sw(id, on) + '</div>'; }
    function num(id, title, val, desc) { return '<div class="row"><div class="grow">' + title + (desc ? '<div class="sub">' + desc + '</div>' : '') + '</div><input id="' + id + '" type="number" value="' + val + '" style="width:92px"></div>'; }
    v.innerHTML =
      '<div class="card"><h3>' + t('appearance') + '</h3>' +
      '<div class="row"><div class="grow">' + t('language') + '</div><select id="sLang" style="width:auto">' + Object.keys(I18n.langs).map(function (k) { return '<option value="' + k + '"' + (I18n.get() === k ? ' selected' : '') + '>' + I18n.langs[k] + '</option>'; }).join('') + '</select></div>' +
      '<div class="row"><div class="grow">' + t('theme') + '</div><select id="sTheme" style="width:auto"><option value="dark"' + (s.theme === 'dark' ? ' selected' : '') + '>' + t('dark') + '</option><option value="light"' + (s.theme === 'light' ? ' selected' : '') + '>' + t('light') + '</option><option value="system"' + (s.theme === 'system' ? ' selected' : '') + '>' + t('system') + '</option></select></div></div>' +
      '<div class="card"><h3>' + t('vpn') + '</h3>' +
      tog('sKill', t('killSwitch'), t('killSwitchDesc'), s.killSwitch) +
      '<div class="row"><div class="grow">' + t('systemKill') + '<div class="sub">' + t('systemKillDesc') + '</div></div><button class="btn sec sm" id="sSys">' + ic('chev') + '</button></div>' +
      tog('sBypass', t('bypassLan'), t('bypassLanDesc'), s.bypassLan) + tog('sGlobal', t('globalMode'), '', s.globalMode) +
      tog('sV6', t('ipv6'), t('ipv6Desc'), s.enableIpv6) + tog('sBlock6', t('blockIpv6'), t('blockIpv6Desc'), s.blockIpv6) + num('sMtu', t('mtu'), s.tunnelMtu) + '</div>' +
      '<div class="card"><h3>' + t('dns') + '</h3>' + tog('sRDns', t('remoteDns'), t('remoteDnsDesc'), s.remoteDns) +
      '<div class="row"><div class="grow">' + t('dnsServer') + '</div><input id="sDns" dir="ltr" value="' + esc(s.dnsIpv4) + '" style="width:130px"></div></div>' +
      '<div class="card"><h3>' + t('splitTunnel') + '</h3><select id="sSplit"><option value="off"' + (s.splitMode === 'off' ? ' selected' : '') + '>' + t('splitOff') + '</option><option value="exclude"' + (s.splitMode === 'exclude' ? ' selected' : '') + '>' + t('splitExclude') + '</option><option value="include"' + (s.splitMode === 'include' ? ' selected' : '') + '>' + t('splitInclude') + '</option></select>' +
      (s.splitMode !== 'off' ? '<div class="row"><div class="grow">' + t('selectApps') + '<div class="sub">' + t('appsSelected', { n: s.apps.length }) + '</div></div><button class="btn sec sm" id="sApps">' + ic('chev') + '</button></div>' : '') +
      (s.splitMode !== 'include' ? tog('sGoogle', t('excludeGoogle'), t('excludeGoogleDesc'), s.excludeGoogleServices) : '') + '</div>' +
      '<div class="card"><h3>' + t('performance') + '</h3>' + num('sPool', t('warmPool'), s.warmPool, t('warmPoolDesc')) + num('sIdle', t('idleTimeout'), s.idleMin) + num('sConnT', t('connectTimeout'), s.connectTimeoutSec) + num('sPing', t('pingInterval'), s.pingIntervalSec) +
      '<div class="row"><div class="grow">' + t('logLevel') + '</div><select id="sLog" style="width:auto">' + ['debug', 'info', 'warn', 'error'].map(function (l) { return '<option' + (s.logLevel === l ? ' selected' : '') + '>' + l + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="card"><h3>' + t('backup') + '</h3><div class="btns"><button class="btn sec" id="sExp">' + t('exportAll') + '</button><button class="btn sec" id="sImp">' + t('importAll') + '</button></div></div>' +
      '<div class="card"><h3>' + t('about') + '</h3><div class="row"><div class="grow">AvanGard · Sweetmelon</div><div id="sVer"></div></div></div>';

    async function put() { await Store.saveSettings(); }
    function bindToggle(id, key) { $('#' + id, v).onchange = function () { s[key] = this.checked; put(); }; }
    function bindNum(id, key) { $('#' + id, v).onchange = function () { s[key] = Number(this.value) || 0; put(); }; }
    bindToggle('sKill', 'killSwitch'); bindToggle('sBypass', 'bypassLan'); bindToggle('sGlobal', 'globalMode'); bindToggle('sV6', 'enableIpv6'); bindToggle('sBlock6', 'blockIpv6'); bindToggle('sRDns', 'remoteDns');
    var gg = $('#sGoogle', v); if (gg) gg.onchange = function () { s.excludeGoogleServices = this.checked; put(); };
    bindNum('sMtu', 'tunnelMtu'); bindNum('sPool', 'warmPool'); bindNum('sIdle', 'idleMin'); bindNum('sConnT', 'connectTimeoutSec'); bindNum('sPing', 'pingIntervalSec');
    $('#sDns', v).onchange = function () { s.dnsIpv4 = this.value.trim(); put(); };
    $('#sLog', v).onchange = function () { s.logLevel = this.value; put(); };
    $('#sSplit', v).onchange = function () { s.splitMode = this.value; put(); render(); };
    var ap = $('#sApps', v); if (ap) ap.onclick = appsSheet;
    $('#sSys', v).onclick = function () { W().openVpnSettings().catch(function (e) { toast(errText(e)); }); };
    $('#sLang', v).onchange = function () { s.lang = this.value; I18n.set(s.lang); put(); paintTabs(); render(); };
    $('#sTheme', v).onchange = function () { s.theme = this.value; applyTheme(); put(); };
    $('#sExp', v).onclick = function () { copy(JSON.stringify(Store.profiles)); };
    $('#sImp', v).onclick = importSheet;
    W().getInfo().then(function (i) { $('#sVer', v).textContent = (i && i.native && i.native.version) || ''; }).catch(function () { });
  }
  async function appsSheet() {
    var s = Store.settings, sel = new Set(s.apps), apps = null, showSys = false, q = '';
    openSheet('<h2>' + t('selectApps') + '</h2><input id="aQ" placeholder="' + t('searchApps') + '"><div class="row"><div class="grow">' + t('systemApps') + '</div>' + sw('aSys', false) + '</div><div id="aList" class="hint">' + t('loadingApps') + '</div><div class="btns" style="margin-top:10px"><button class="btn" id="aOk">' + t('save') + '</button></div>', async function (el) {
      var io = 'IntersectionObserver' in g ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); var img = e.target; W().appIcon(img.dataset.pkg, 48).then(function (b) { if (b) img.src = 'data:image/png;base64,' + b; }).catch(function () { }); } }); }) : null;
      function paint() {
        var rows = apps.filter(function (a) { return (showSys || !a.isSystem || sel.has(a.packageName)) && (!q || (a.appName + a.packageName).toLowerCase().indexOf(q) >= 0); });
        $('#aList', el).className = ''; $('#aList', el).innerHTML = rows.map(function (a) {
          return '<div class="row"><div class="app grow"><img data-pkg="' + a.packageName + '" alt=""><div><div>' + esc(a.appName) + '</div><div class="sub">' + esc(a.packageName) + '</div></div></div>' + sw('c_' + a.packageName.replace(/\./g, '_'), sel.has(a.packageName)).replace('<input', '<input data-pkg="' + a.packageName + '"') + '</div>';
        }).join('');
        $('#aList', el).querySelectorAll('img').forEach(function (i) { io ? io.observe(i) : 0; });
        $('#aList', el).querySelectorAll('input[data-pkg]').forEach(function (c) { c.onchange = function () { this.checked ? sel.add(this.dataset.pkg) : sel.delete(this.dataset.pkg); }; });
      }
      try { apps = await W().apps(); } catch (e) { $('#aList', el).innerHTML = '<span class="err">' + esc(errText(e)) + '</span>'; return; }
      paint();
      $('#aQ', el).oninput = function () { q = this.value.trim().toLowerCase(); paint(); };
      $('#aSys', el).onchange = function () { showSys = this.checked; paint(); };
      $('#aOk', el).onclick = async function () { s.apps = Array.from(sel); await Store.saveSettings(); closeSheet(); render(); };
    });
  }

  // ───────────── events
  function onState(e) {
    var prev = ui.status.state;
    ui.status = Object.assign({}, ui.status, { state: e.state, message: e.message, mode: e.mode, server: e.server, connectedAt: e.connectedAt });
    if (e.state === 'connected' && prev !== 'connected') setTimeout(fetchInfo, 800);
    if (e.state === 'idle' || e.state === 'error') { ui.stats = null; ui.info = null; ui.status.share = { enabled: false }; }
    if (e.state === 'error' && e.message) toast(e.message);
    render();
  }
  function onStats(e) {
    ui.stats = e; ui.status.share = e.share || { enabled: false };
    ui.speeds.push({ d: e.rxRate, u: e.txRate }); if (ui.speeds.length > 60) ui.speeds.shift();
    if (ui.tab === 'home') {
      var set = function (id, v) { var el = $('#' + id); if (el) el.textContent = v; };
      set('sDown', fmtBytes(e.rx)); set('sUp', fmtBytes(e.tx)); set('sDownR', fmtBytes(e.rxRate) + '/s'); set('sUpR', fmtBytes(e.txRate) + '/s'); set('sDur', fmtDur(e.uptime)); set('sConn', e.connections);
      drawChart();
    } else if (ui.tab === 'share' && !ui.sheet && !document.activeElement.matches('input,select')) { render(); }
  }
  function onLog(e) {
    ui.logs.push(e); if (ui.logs.length > 1000) ui.logs.shift();
    if (ui.tab === 'logs' && ui.paintLogs) ui.paintLogs();
  }
  function applyTheme() {
    var th = Store.settings.theme;
    if (th === 'system') th = g.matchMedia && g.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.dataset.theme = th;
    try { g.NativeSDK.statusBar.setStyle(th === 'dark' ? 'light' : 'dark', th === 'dark' ? '#0e1116' : '#f2f5f9'); } catch (e) { }
  }

  async function boot() {
    try { await g.NativeSDK.waitForReady(15000); } catch (e) { $('#view').innerHTML = '<div class="empty">' + esc(errText(e)) + '</div>'; return; }
    await Store.init();
    var lang = Store.settings.lang || ((navigator.language || 'en').slice(0, 2) === 'fa' ? 'fa' : 'en');
    I18n.set(lang);
    applyTheme(); paintTabs(); render();
    var N = g.NativeSDK;
    N.on('w2rayTunnel.state', onState); N.on('w2rayTunnel.stats', onStats); N.on('w2rayTunnel.log', onLog);
    try { N.backButton.enableIntercept(); N.on('backButton.pressed', function () { if (ui.sheet) closeSheet(); else if (ui.tab !== 'home') { ui.tab = 'home'; paintTabs(); render(); } else N.backButton.minimizeApp(); }); } catch (e) { }
    try {
      ui.logs = await W().logs();
      ui.status = await W().status();
      if (running()) { ui.stats = { rx: ui.status.rx, tx: ui.status.tx, rxRate: ui.status.rxRate, txRate: ui.status.txRate, uptime: ui.status.connectedAt ? Date.now() - ui.status.connectedAt : 0, connections: ui.status.connections }; setTimeout(fetchInfo, 500); }
      render();
    } catch (e) {
      $('#view').insertAdjacentHTML('afterbegin', '<div class="card err">' + esc(t('unavailable')) + '<br>' + esc(errText(e)) + '</div>');
    }
    loadAddrs();
  }
  document.addEventListener('DOMContentLoaded', boot);
})(window);
