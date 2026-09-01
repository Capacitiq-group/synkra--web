# syntax=docker/dockerfile:1
# Mirrors synkra-client-hub's Dockerfile: same stack (TanStack Start),
# Debian-slim/glibc over Alpine for the same native-binary reasons
# (@rollup/rollup-*, @tailwindcss/oxide-* have unreliable musl support).
#
# vite.config.ts uses the nitro/vite plugin with the node-server preset,
# so the build produces a self-starting Node server at
# .output/server/index.mjs. Nitro bundles all runtime dependencies into
# .output itself, so the runner stage doesn't need node_modules at all.
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
RUN rm -f package-lock.json
RUN npm install

COPY . .

# Vite bakes VITE_-prefixed vars into the client bundle at BUILD time, not
# runtime - setting them as ordinary Coolify environment variables on the
# service does nothing for these, since npm run build never sees them. They
# have to arrive as Docker build args instead (Coolify: set these under the
# service's "Build Variables", not "Environment Variables") and get
# re-exported as ENV here so `npm run build` below can actually read them.
# Without this, both fell back to their built-in defaults silently:
# VITE_POCKETBASE_URL fell back to http://127.0.0.1:8090 (see the "not set"
# warning logged at runtime in client.ts), and VITE_UTILITIES_API_URL fell
# back to an empty string, sending every utility page's requests to a
# relative /api/v1/... path on synkra.co.za itself instead of the actual
# utilities backend - which is the utilities errors this was built to fix.
ARG VITE_POCKETBASE_URL
ARG VITE_UTILITIES_API_URL
ENV VITE_POCKETBASE_URL=${VITE_POCKETBASE_URL}
ENV VITE_UTILITIES_API_URL=${VITE_UTILITIES_API_URL}

RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
