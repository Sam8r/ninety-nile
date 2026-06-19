# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
WORKDIR /app

# --- deps -----------------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile || pnpm install

# --- builder --------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV AUTH_SECRET="placeholder-secret-for-build-only-min-32-chars"
ENV ADMIN_EMAIL="build@placeholder.com"
ENV ADMIN_PASSWORD="placeholder-password-build"
RUN pnpm prisma generate
RUN pnpm build

# --- runner ---------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
