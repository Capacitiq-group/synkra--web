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
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
