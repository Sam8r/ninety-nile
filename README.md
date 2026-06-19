# NinetyNile — Creative Agency Website + Admin Dashboard

An English-only, Bauhaus-styled creative agency website with a role-based admin dashboard for full no-code content management. Features a signature interactive Three.js flowing-river hero, imagery sourced from the company-profile PDF, and a data-driven Bauhaus design system.

## Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript strict)
- **Database**: PostgreSQL 16 + Prisma ORM
- **Auth**: Auth.js v5 (credentials provider, ADMIN/EDITOR roles)
- **UI**: Tailwind CSS + shadcn/ui components, Bauhaus design system
- **WebGL**: Three.js + @react-three/fiber (dynamically imported river hero)
- **Fonts**: Space Grotesk (display) + Inter (body) via next/font
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

- Public site: http://localhost:3000 (English-only, no locale prefix)
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
  (site)/              # Public website (English-only, Bauhaus)
  admin/(dashboard)/   # Admin dashboard (auth-protected)
  api/                 # API routes (contact, media, auth)
components/
  ui/                  # shadcn/ui primitives
  site/                # Public site components
    river-hero/        # Three.js flowing-river hero (water-material, fallback, component)
  admin/               # Admin dashboard components
lib/
  actions/             # Server actions (CRUD)
  validation/          # Zod schemas (English-only publish gate)
  content/             # UI string dictionary + text helpers
  auth.ts              # Auth.js config (node runtime)
  auth.config.ts       # Edge-safe auth config
  auth-guards.ts       # Role-based guards (requireAdmin, requireSession)
  branding.ts          # Bauhaus brand tokens + CSS vars
  db.ts                # Prisma client
prisma/
  schema.prisma        # Full data model (*Ar columns deprecated/nullable)
  seed.ts              # Content seed (9 case studies, services, clients, etc.)
public/
  brand/               # Logo assets (NN_Logos-*, optimized variants)
  media/curated/       # Curated, optimized PDF-sourced imagery
tests/
  unit/                # Vitest unit tests
  e2e/                 # Playwright e2e tests
```

## Key Features

- **Bauhaus design system**: White/black base with red/blue/yellow accents, oversized geometric headlines, generous white space — all driven by `BrandSettings` tokens (no hard-coded values)
- **Interactive river hero**: Three.js flowing-water shader in the lower third of the homepage hero, reacting to mouse and touch; progressively enhanced with reduced-motion and no-WebGL fallbacks
- **English-only publish gate**: Case studies and content require English fields before publishing
- **Role-based access**: ADMIN (full access) vs EDITOR (content only); enforced server-side
- **Live branding**: Change tagline, Bauhaus colors, logo from admin, reflected on public site instantly
- **Media management**: Upload, optimize, and serve images (sharp + next/image)
- **SEO**: Dynamic sitemap, robots.txt, per-page metadata
- **Security**: Rate-limited login, XSS sanitization, security headers

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
