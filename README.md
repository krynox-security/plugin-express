# @krynox/captcha-express

Official [**Krynox Captcha**](https://krynox.net) integration for **Express** — a verify
middleware plus a server-rendered widget embed helper. Privacy-first, proof-of-work CAPTCHA.

```bash
npm install @krynox/captcha-express
```

Set `KRYNOX_SECRET_KEY` (your `kcps_…` secret) in the environment.

## Verify middleware

Drop `krynoxCaptcha()` in front of any route. It reads the solved token from the request body
field `krynox-captcha` (mount a body parser first) and falls back to the `x-krynox-captcha`
header for fetch/API clients. On failure it responds `403`; on success it attaches the full result
to `req.krynox` and continues.

```js
import express from 'express';
import { krynoxCaptcha } from '@krynox/captcha-express';

const app = express();
app.use(express.urlencoded({ extended: true })); // or express.json()

app.post('/signup', krynoxCaptcha(), (req, res) => {
  // reached only when the captcha passed
  if (req.krynox?.risk === 'high' || req.krynox?.reasons?.includes('tor-exit')) {
    // add friction: email verification, manual review, …
  }
  res.send('welcome');
});
```

Only `POST`/`PUT`/`PATCH`/`DELETE` are enforced by default; `GET` passes through.

### The result — `req.krynox`

`{ success, score?, risk?, hostname?, challengeTs?, errorCodes?, reasons?, agent?, human? }`

- `reasons` — stable codes explaining the score (`tor-exit`, `elevated-request-rate`, …).
- `agent` — a **verified AI agent** (Web Bot Auth) when forwarded: `{ verified, name, allowlisted }`.
- `human` — a **device-attested human** (Private Access Token) when forwarded: `{ attested, method, issuer }`.

```js
app.post('/api', krynoxCaptcha(), (req, res) => {
  if (req.krynox?.agent?.verified && req.krynox.agent.allowlisted) return res.json({ bot: 'allowed' });
  res.json({ ok: true });
});
```

## Widget embed

`krynoxWidget()` returns the loader `<script>` + `<krynox-captcha>` element as an HTML string for
any template engine. Place it inside your `<form>`.

```js
import { krynoxWidget } from '@krynox/captcha-express';

app.get('/signup', (_req, res) => {
  res.send(`
    <form method="post" action="/signup">
      ${krynoxWidget({ sitekey: process.env.KRYNOX_SITE_KEY })}
      <button type="submit">Sign up</button>
    </form>
  `);
});
```

## Configuration — `krynoxCaptcha(config)`

| Option | Default | Notes |
| --- | --- | --- |
| `secret` | `process.env.KRYNOX_SECRET_KEY` | Your `kcps_…` secret key. |
| `apiHost` | `process.env.KRYNOX_API_HOST` or `https://api.krynox.net` | Data-plane host (self-hosting). |
| `field` | `krynox-captcha` | Body field carrying the token. |
| `header` | `x-krynox-captcha` | Header checked when the field is absent. |
| `methods` | `['POST','PUT','PATCH','DELETE']` | Methods to enforce on. |
| `timeoutMs` | `5000` | Per-attempt request timeout. |
| `retries` | `2` | Transient-failure (network/429/5xx) retries; a retried single-use token replays the first outcome via an idempotency key. |
| `onFailure` | 403 JSON | `(req, res, result) => void` to customise the rejection. |

`verifyKrynox(token, options)` is also exported for manual verification (Server-Sent handlers,
GraphQL resolvers, etc.).

## Reliability

Transient failures (network, `429`, `5xx`) are retried automatically with exponential backoff.
Because a captcha token is single-use, a retried verify carries an **idempotency key** so the retry
replays the first outcome instead of failing the now-consumed token.

## Honeypot

Enable **Honeypot** for the site in the Krynox dashboard and the widget injects an invisible decoy
field (`krynox-hp`) that only bots fill in. This middleware forwards it to `/siteverify` as
`honeypot` automatically (override the field name with `honeypotField`) — the data plane then floors
the score (report mode) or rejects with `honeypot-tripped` (enforce mode). See the
[Honeypot docs](https://docs.krynox.net/server-side/honeypot/).

MIT licensed. Docs: <https://krynox.net/docs>
