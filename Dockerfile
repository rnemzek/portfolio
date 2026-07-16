# syntax=docker/dockerfile:1

# ── Stage 1: build ──────────────────────────────────────────────────────────
# Full dependency install (dev deps included — Vite/vinxi are build tooling),
# then compile the SolidStart + Hono bundle. Nitro emits a self-contained
# server into .output (its own node_modules), so nothing else ships.
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: runtime ────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Railway injects PORT at runtime; 3000 is the local-run fallback
ENV PORT=3000

COPY --from=builder /app/.output ./.output

# Run as the unprivileged user baked into the official Node image
USER node

EXPOSE 3000

# Liveness probe without curl/wget (not present in alpine base)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
