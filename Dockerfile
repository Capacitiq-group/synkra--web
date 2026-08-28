# syntax=docker/dockerfile:1
# Mirrors synkra-client-hub's Dockerfile: same stack (TanStack Start),
# Debian-slim/glibc over Alpine for the same native-binary reasons
# (@rollup/rollup-*, @tailwindcss/oxide-* have unreliable musl support).
# Requires vite.config.ts to use the plain tanstackStart() plugin (not
# @lovable.dev/vite-tanstack-config's Cloudflare-targeted wrapper) so the
# build actually produces a server-runtime/node-entry.mjs to run.
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
RUN rm -f package-lock.json
RUN npm install

COPY . .
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server-runtime ./server-runtime

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "./server-runtime/node-entry.mjs"]
