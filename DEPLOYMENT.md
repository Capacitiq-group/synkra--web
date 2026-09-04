# Deployment — synkra--web

**There is exactly one deployment path: Docker image built from this repo's
`Dockerfile`, deployed on Coolify (self-hosted, VPS `167.86.106.152`).**

The previous Vercel path (`vercel.json`, `NITRO_PRESET=vercel`) has been
removed. It was never the live path: `synkra.co.za` / `www.synkra.co.za`
resolve to the Coolify VPS, and `vite.config.ts` pins
`nitro({ preset: "node-server" })`, which produces a self-starting Node
server at `.output/server/index.mjs` — the artifact the `Dockerfile` runs.
Keeping both descriptions in the repo only caused config drift, so the
Vercel one is gone. Do not reintroduce it.

## How it builds

```
Dockerfile (node:22-slim)
  builder: npm install -> npm run build  ->  .output/
  runner : node .output/server/index.mjs  (PORT=3000)
```

## Environment variables (Coolify)

Names only — never commit values. See `.env.example` for the full list.

- **Build Variables** (baked into the browser bundle at build time, must be
  passed as Docker build args): `VITE_POCKETBASE_URL`, `VITE_UTILITIES_API_URL`.
- **Environment Variables** (runtime, server-only): `POCKETBASE_URL`,
  `POCKETBASE_ADMIN_EMAIL`, `POCKETBASE_ADMIN_PASSWORD`, `PAYSTACK_SECRET_KEY`,
  `SYNKRA_INTERNAL_SECRET`, `CLIENT_HUB_API_SECRET`, `NODE_ENV`, `PORT`, `HOST`.

Never put a secret in a `VITE_` variable — those ship to the browser.

## PocketBase

This app talks to the **shared instance, which is the `synkra-os` container
itself**, at `https://os.synkra.co.za`. The old `pb-web.synkra.co.za` host
does not resolve to a running service and must not be used. `synkra-client-hub`
keeps its own separate instance at `https://pb.synkra.co.za`. Canonical
reference: [`SYNKRA-ARCHITECTURE.md` in `synkra-os`](https://github.com/Capacitiq-group/synkra-os/blob/main/SYNKRA-ARCHITECTURE.md).

## Domains

Both the apex and the `www` host must be attached to this service in Coolify
so Coolify's proxy issues a certificate and routes for each:

- `https://www.synkra.co.za` — attached, serving (HTTP 200).
- `https://synkra.co.za` — **DNS resolves to the VPS but the apex is not yet
  attached to this service**: the proxy answers `503 no available server` and
  serves a certificate that does not match the apex name. Fix in Coolify by
  adding `https://synkra.co.za` to the service's Domains field alongside the
  `www` host (or add it as a redirect to `www`), then redeploy so a
  certificate covering both names is issued. This is a hosting-panel setting,
  not a repository change.
