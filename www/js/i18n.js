(function (g) {
  'use strict';
  var T = {
    en: {
      home: 'Home', profiles: 'Profiles', share: 'Share', logs: 'Logs', settings: 'Settings',
      idle: 'Disconnected', connecting: 'Connecting…', connected: 'Connected', reconnecting: 'Reconnecting…', disconnecting: 'Disconnecting…', error: 'Error',
      tapConnect: 'Tap to connect', tapDisconnect: 'Tap to disconnect', noProfile: 'Add a server profile first',
      download: 'Download', upload: 'Upload', duration: 'Duration', connections: 'Connections', speedChart: 'Speed',
      server: 'Server', ip: 'IP address', location: 'Location', isp: 'ISP', ping: 'Server ping', pingTarget: 'Internet ping', refresh: 'Refresh',
      addProfile: 'Add profile', editProfile: 'Edit profile', name: 'Name', url: 'Server URL', urlHint: 'wss://host:4431/api/stream', password: 'Password',
      host: 'Host', port: 'Port', useTls: 'Use TLS', path: 'WebSocket path', sni: 'SNI (TLS server name)', hostHeader: 'Host header', allowInsecure: 'Allow insecure certificate',
      advancedServer: 'Advanced', save: 'Save', cancel: 'Cancel', delete: 'Delete', duplicate: 'Duplicate', test: 'Test', import: 'Import', importHint: 'Paste a wss:// link or a profile JSON',
      testing: 'Testing…', testOk: 'Server answered in {ms} ms', testFail: 'Test failed: {e}', saved: 'Saved', deleted: 'Deleted', confirmDelete: 'Delete this profile?',
      noProfiles: 'No profiles yet', active: 'Active', needsServer: 'Enter the server address and password',
      shareTitle: 'Share connection (SOCKS5)', shareIntro: 'Let other devices on your Wi-Fi or hotspot use this phone’s connection to the w2ray server.',
      shareEnable: 'Share this connection', sharePort: 'Port', shareAuth: 'Require login', shareUser: 'Username', sharePass: 'Password', shareMode: 'Mode',
      modeVpn: 'VPN for this phone + share', modeProxy: 'Share only (no VPN on this phone)', allowPrivate: 'Allow private-network destinations',
      shareBind: 'Listen on', allInterfaces: 'All networks (0.0.0.0)', clients: 'Connected devices', noClients: 'No device connected', address: 'Address on your network',
      copy: 'Copy', copied: 'Copied', shareLink: 'Share link', randomize: 'Random', shareWarn: 'Anyone who can reach this port can use your server. Turn on login unless the network is yours alone.',
      sharingNow: 'Sharing on port {p}', startShare: 'Start sharing', stopShare: 'Stop sharing', shareApplied: 'Sharing updated',
      vpn: 'VPN', dns: 'DNS', splitTunnel: 'Split tunnelling', splitOff: 'All apps use the VPN', splitExclude: 'Selected apps bypass the VPN', splitInclude: 'Only selected apps use the VPN',
      selectApps: 'Select apps', appsSelected: '{n} selected', searchApps: 'Search apps', systemApps: 'System apps', loadingApps: 'Loading apps…',
      excludeGoogle: 'Google services bypass the VPN', excludeGoogleDesc: 'Keeps push notifications working',
      killSwitch: 'Kill switch', killSwitchDesc: 'Block traffic while the server is unreachable instead of leaking', systemKill: 'System kill switch', systemKillDesc: 'Always-on VPN and “Block connections without VPN”',
      remoteDns: 'Remote DNS', remoteDnsDesc: 'Resolve names on the server side (no DNS leaks)', dnsServer: 'DNS server', ipv6: 'IPv6', ipv6Desc: 'Tunnel IPv6 traffic', blockIpv6: 'Block IPv6 leaks', blockIpv6Desc: 'When IPv6 is off, drop it instead of letting it bypass the VPN',
      bypassLan: 'Bypass local network', bypassLanDesc: 'Keep printers, router and other local devices reachable', globalMode: 'Route all traffic', mtu: 'MTU',
      performance: 'Performance', warmPool: 'Ready tunnels', warmPoolDesc: 'Authenticated tunnels kept ready for faster connections', idleTimeout: 'Idle timeout (min)', connectTimeout: 'Connect timeout (s)', pingInterval: 'Keep-alive (s)',
      logLevel: 'Native log level', appearance: 'Appearance', theme: 'Theme', language: 'Language', dark: 'Dark', light: 'Light', system: 'System',
      backup: 'Backup', exportAll: 'Copy all profiles', importAll: 'Import profiles', about: 'About', version: 'Version',
      clearLogs: 'Clear', exportLogs: 'Share logs', noLogs: 'No logs yet', logFilter: 'Level',
      vpnPermission: 'Allow the VPN request to continue', notifPerm: 'Notifications keep the connection visible', invalidConfig: 'Check the settings',
      proxyOnlyNeedsShare: 'Turn on sharing for share-only mode', retrying: 'Server unreachable. Retrying…', backgroundHint: 'The connection continues in the background',
      authFailed: 'The server refused the password', disconnectBtn: 'Disconnect', connectBtn: 'Connect', permOk: 'Permissions granted', sub_off: 'service inactive', sub_connecting: 'establishing tunnel…', sub_reconnecting: 'recovering connection…', sub_on: 'relay active • traffic routing', sub_error: 'connection failed', unavailable: 'Open this app on Android with the VPN module', speed: 'Speed',
    },
    fa: {
      home: 'خانه', profiles: 'پروفایل‌ها', share: 'اشتراک', logs: 'گزارش‌ها', settings: 'تنظیمات',
      idle: 'قطع', connecting: 'در حال اتصال…', connected: 'متصل', reconnecting: 'اتصال مجدد…', disconnecting: 'در حال قطع…', error: 'خطا',
      tapConnect: 'برای اتصال بزنید', tapDisconnect: 'برای قطع بزنید', noProfile: 'ابتدا یک پروفایل سرور اضافه کنید',
      download: 'دانلود', upload: 'آپلود', duration: 'مدت', connections: 'اتصال‌ها', speedChart: 'سرعت',
      server: 'سرور', ip: 'آدرس IP', location: 'موقعیت', isp: 'ارائه‌دهنده', ping: 'پینگ سرور', pingTarget: 'پینگ اینترنت', refresh: 'تازه‌سازی',
      addProfile: 'افزودن پروفایل', editProfile: 'ویرایش پروفایل', name: 'نام', url: 'آدرس سرور', urlHint: 'wss://host:4431/api/stream', password: 'رمز عبور',
      host: 'میزبان', port: 'پورت', useTls: 'استفاده از TLS', path: 'مسیر WebSocket', sni: 'SNI (نام سرور TLS)', hostHeader: 'هدر Host', allowInsecure: 'پذیرش گواهی نامعتبر',
      advancedServer: 'پیشرفته', save: 'ذخیره', cancel: 'انصراف', delete: 'حذف', duplicate: 'کپی', test: 'تست', import: 'وارد کردن', importHint: 'لینک wss:// یا JSON پروفایل را بچسبانید',
      testing: 'در حال تست…', testOk: 'سرور در {ms} میلی‌ثانیه پاسخ داد', testFail: 'تست ناموفق: {e}', saved: 'ذخیره شد', deleted: 'حذف شد', confirmDelete: 'این پروفایل حذف شود؟',
      noProfiles: 'هنوز پروفایلی نیست', active: 'فعال', needsServer: 'آدرس سرور و رمز را وارد کنید',
      shareTitle: 'اشتراک اتصال (SOCKS5)', shareIntro: 'به دستگاه‌های دیگر روی وای‌فای یا هات‌اسپات اجازه دهید از اتصال این گوشی به سرور w2ray استفاده کنند.',
      shareEnable: 'اشتراک‌گذاری این اتصال', sharePort: 'پورت', shareAuth: 'نیاز به ورود', shareUser: 'نام کاربری', sharePass: 'رمز', shareMode: 'حالت',
      modeVpn: 'وی‌پی‌ان این گوشی + اشتراک', modeProxy: 'فقط اشتراک (بدون وی‌پی‌ان روی این گوشی)', allowPrivate: 'اجازه مقصد در شبکه‌های خصوصی',
      shareBind: 'گوش دادن روی', allInterfaces: 'همه شبکه‌ها (0.0.0.0)', clients: 'دستگاه‌های متصل', noClients: 'دستگاهی متصل نیست', address: 'آدرس در شبکه شما',
      copy: 'کپی', copied: 'کپی شد', shareLink: 'اشتراک لینک', randomize: 'تصادفی', shareWarn: 'هر کسی به این پورت دسترسی داشته باشد می‌تواند از سرور شما استفاده کند. اگر شبکه فقط برای شماست غیر از این، ورود را فعال کنید.',
      sharingNow: 'اشتراک روی پورت {p}', startShare: 'شروع اشتراک', stopShare: 'توقف اشتراک', shareApplied: 'اشتراک به‌روز شد',
      vpn: 'وی‌پی‌ان', dns: 'DNS', splitTunnel: 'تونل جداگانه', splitOff: 'همه برنامه‌ها از وی‌پی‌ان استفاده می‌کنند', splitExclude: 'برنامه‌های انتخابی از وی‌پی‌ان عبور نمی‌کنند', splitInclude: 'فقط برنامه‌های انتخابی از وی‌پی‌ان استفاده می‌کنند',
      selectApps: 'انتخاب برنامه‌ها', appsSelected: '{n} انتخاب شده', searchApps: 'جستجوی برنامه', systemApps: 'برنامه‌های سیستمی', loadingApps: 'در حال بارگذاری برنامه‌ها…',
      excludeGoogle: 'سرویس‌های گوگل خارج از وی‌پی‌ان', excludeGoogleDesc: 'اعلان‌های پوش سالم می‌مانند',
      killSwitch: 'کیل سوییچ', killSwitchDesc: 'تا رسیدن سرور، ترافیک مسدود شود تا نشتی نباشد', systemKill: 'کیل سوییچ سیستم', systemKillDesc: 'Always-on VPN و «مسدود کردن اتصال بدون VPN»',
      remoteDns: 'DNS از راه دور', remoteDnsDesc: 'نام‌ها سمت سرور حل شوند (بدون نشت DNS)', dnsServer: 'سرور DNS', ipv6: 'IPv6', ipv6Desc: 'عبور ترافیک IPv6', blockIpv6: 'جلوگیری از نشت IPv6', blockIpv6Desc: 'وقتی IPv6 خاموش است، به جای دور زدن وی‌پی‌ان حذف شود',
      bypassLan: 'عبور ندادن شبکه محلی', bypassLanDesc: 'پرینتر، مودم و دستگاه‌های محلی در دسترس بمانند', globalMode: 'مسیریابی همه ترافیک', mtu: 'MTU',
      performance: 'کارایی', warmPool: 'تونل‌های آماده', warmPoolDesc: 'تونل‌های احرازشده برای اتصال سریع‌تر آماده نگه داشته می‌شوند', idleTimeout: 'مهلت بیکاری (دقیقه)', connectTimeout: 'مهلت اتصال (ثانیه)', pingInterval: 'Keep-alive (ثانیه)',
      logLevel: 'سطح لاگ بومی', appearance: 'ظاهر', theme: 'پوسته', language: 'زبان', dark: 'تیره', light: 'روشن', system: 'سیستم',
      backup: 'پشتیبان', exportAll: 'کپی همه پروفایل‌ها', importAll: 'ورود پروفایل‌ها', about: 'درباره', version: 'نسخه',
      clearLogs: 'پاک کردن', exportLogs: 'اشتراک لاگ', noLogs: 'هنوز لاگی نیست', logFilter: 'سطح',
      vpnPermission: 'درخواست وی‌پی‌ان را تأیید کنید', notifPerm: 'اعلان، اتصال را قابل مشاهده نگه می‌دارد', invalidConfig: 'تنظیمات را بررسی کنید',
      proxyOnlyNeedsShare: 'برای حالت فقط‌اشتراک، اشتراک را روشن کنید', retrying: 'سرور در دسترس نیست. تلاش مجدد…', backgroundHint: 'اتصال در پس‌زمینه ادامه می‌یابد',
      authFailed: 'سرور رمز را نپذیرفت', disconnectBtn: 'قطع اتصال', connectBtn: 'اتصال', permOk: 'مجوزها داده شد', sub_off: 'سرویس غیرفعال', sub_connecting: 'در حال برقراری تونل…', sub_reconnecting: 'در حال بازیابی اتصال…', sub_on: 'رله فعال • مسیریابی ترافیک', sub_error: 'اتصال ناموفق', unavailable: 'این برنامه را روی اندروید با ماژول VPN باز کنید', speed: 'سرعت',
    }
  };
  var lang = 'en';
  function t(k, v) {
    var s = (T[lang] && T[lang][k]) || T.en[k] || k;
    if (v) Object.keys(v).forEach(function (x) { s = s.replace('{' + x + '}', v[x]); });
    return s;
  }
  g.I18n = {
    t: t,
    langs: { en: 'English', fa: 'فارسی' },
    set: function (l) { lang = T[l] ? l : 'en'; document.documentElement.lang = lang; document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'; },
    get: function () { return lang; }
  };
})(window);
