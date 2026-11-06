# AvanGard (Sweetmelon edition)

Android client for the **w2ray WebSocket tunnel** ([`tunnel-client.js`](https://github.com/legionir/w2ray/blob/main/tunnel-client.js)
rewritten in Kotlin), built as a web app (`www/`) on the [Sweetmelon](https://github.com/legionir/sweetmelon)
core with its `w2rayTunnel` plugin.

## Features
- **VPN** for the whole phone through [hev-socks5-tunnel](https://github.com/heiher/hev-socks5-tunnel) (latest upstream, vendored in the core).
- **Share the connection as SOCKS5**: pick a port, optionally a login, and any device on your Wi-Fi or hotspot uses *this phone's* connection to the server (`socks5://user:pass@phone-ip:port`). Works with the VPN, or alone (`share only` mode).
- Profiles (import `wss://…` links or JSON, test, duplicate, copy link), kill switch, automatic recovery, restart on network change.
- Split tunnelling (exclude or include apps), bypass LAN, remote DNS (no DNS leaks), IPv6 leak protection, Google services bypass.
- Live speed chart, exit IP / country / ISP seen from the server, server and internet ping.
- Logs (filter, share), English and Persian (RTL), dark/light theme, Always-on VPN shortcut.

## Build
GitHub Actions → **Build AvanGard** → the APK is the `avangard-apk` artifact. Sign it with your own key by adding the
secrets `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`; without them a throw-away key is used.

The workflow uses the action `legionir/sweetmelon` at the branch that holds core 2.7.0; once that release is tagged,
change it to `@v2.7.0`.

## Exit: Cloudflare Worker (default) or your own server
A profile is one of two types:
- **Cloudflare Worker** (default for new profiles): the phone talks straight to a Worker running
  [`ws-cf-tunnel/Cloudflare/worker.js`](https://github.com/legionir/ws-cf-tunnel). Enter its address
  (`https://name.workers.dev`) and its `AUTH_TOKEN`; no server of your own is needed. A Worker cannot reach destinations
  that are themselves behind Cloudflare. Turn on **Fall back to my server** and add a w2ray server: those destinations (and
  any the Worker answers 502 for) then leave through your server. **Exit → My server only** ignores the Worker.
- **w2ray server**: the original mode, below.

## Server
Run the tunnel server of the w2ray project (`TUNNEL_ENABLED=1`), then add a profile with its `wss://host:4431/api/stream`
address and password. A wrong password is not retried: the server bans an address after five failures for 15 minutes.

## Notes
- The tunnel carries TCP. DNS is resolved on the server side; UDP to port 53 is relayed as DNS over TCP. **Block QUIC / HTTP3**
  (Settings, on by default) answers QUIC with a Version Negotiation packet so browsers use HTTPS over TCP at once instead of
  waiting for a timeout. Other UDP is dropped. The Worker exit is TCP only.
- Project layout: `www/` (HTML/CSS/JS), `sweetmelon.yaml` (core version, plugin list), `icon.png`.
