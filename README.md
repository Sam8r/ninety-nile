# NinetyNile — Bilingual Agency Website + Admin Dashboard

A bilingual (EN/AR, RTL-aware) creative agency website with a role-based admin dashboard for full no-code content management.

## Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript strict)
- **Database**: PostgreSQL 16 + Prisma ORM
- **Auth**: Auth.js v5 (credentials provider, ADMIN/EDITOR roles)
- **i18n**: next-intl (locale routing, RTL support)
- **UI**: Tailwind CSS + shadcn/ui components
- **Deploy**: Self-hosted Docker (standalone Next.js + Postgres + media volume)

## Quick Start

### Prerequisites

- Node.js 20+ and pnpm 10+
- Docker + Docker Compose (for PostgreSQL)

### Local Development

```bash
# Install dependencies
pnpm install

# Copy environment file and set secrets
cp .env .env.local
# Edit AUTH_SECRET: openssl rand -base64 32

# Start PostgreSQL
docker compose up -d postgres

# Run database migration + seed
pnpm prisma:migrate
pnpm prisma:seed

# Start dev server
pnpm dev
```

- Public site: http://localhost:3000/en (English) / http://localhost:3000/ar (Arabic, RTL)
- Admin dashboard: http://localhost:3000/admin
- Default admin: `admin@ninetynile.com` / `ChangeMeNow123`
- Default editor: `editor@ninetynile.com` / `EditorPass123`

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript strict check |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright e2e tests |
| `pnpm prisma:migrate` | Create/apply migration |
| `pnpm prisma:seed` | Seed database |
| `pnpm prisma:studio` | Prisma Studio GUI |

## Project Structure

```
app/
  [locale]/(site)/     # Public website (EN + AR, RTL)
  admin/(dashboard)/   # Admin dashboard (auth-protected)
  api/                 # API routes (contact, media, auth)
components/
  ui/                  # shadcn/ui primitives
  site/                # Public site components
  admin/               # Admin dashboard components
lib/
  actions/             # Server actions (CRUD)
  validation/          # Zod schemas
  auth.ts              # Auth.js config (node runtime)
  auth.config.ts       # Edge-safe auth config
  auth-guards.ts       # Role-based guards (requireAdmin, requireSession)
  branding.ts          # Brand tokens + CSS vars
  db.ts                # Prisma client
  i18n/                # next-intl routing + config
prisma/
  schema.prisma        # Full data model
  seed.ts              # Content seed (9 case studies, services, clients, etc.)
public/brand/          # Logo assets
tests/
  unit/                # Vitest unit tests
```

## Key Features

- **Bilingual publish gate**: Case studies and content require both EN + AR fields before publishing
- **Role-based access**: ADMIN (full access) vs EDITOR (content only); enforced server-side
- **Live branding**: Change tagline, colors, logo from admin → reflected on public site instantly
- **Media management**: Upload, crop, and serve optimized images (sharp)
- **SEO**: Dynamic sitemap, robots.txt, per-page metadata
- **Security**: Rate-limited login, XSS sanitization, security headers (CSP-ready)

## Production Docker Deploy

```bash
# Build and start full stack
docker compose up -d

# Run migrations on first deploy
docker compose exec web pnpm prisma:deploy
docker compose exec web pnpm prisma:seed
```

The compose stack includes:
- **web**: Next.js standalone server (port 3000)
- **postgres**: PostgreSQL 16 with persistent volume
- **uploads**: Named volume for media files

Place behind a reverse proxy (Caddy/Nginx) for TLS termination.

## License

Proprietary. (c) NinetyNile.
