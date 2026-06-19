# Quickstart — NinetyNile Redesign (English-only · Bauhaus · River Hero)

Run/verify steps for the redesign delta. Assumes Node ≥ 20, PostgreSQL, and `.env` from `.env.example`.

## 0. Prerequisites
```bash
pnpm install
# new runtime deps for the river hero:
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three
```

## 1. Asset pipeline (Phase A)
```bash
brew install poppler                         # provides pdfimages (one-time)
mkdir -p public/media/from-pdf
pdfimages -all "NinetyNile Profile for website TO SAMER copy.pdf" public/media/from-pdf/nn
# Fallback for a specific page graphic:
# magick -density 200 "NinetyNile Profile for website TO SAMER copy.pdf[12]" public/media/from-pdf/page-12.png
```
> The raw dump (~208 images, ~160 MB) is **uncurated and must NOT be committed wholesale**. Select the
> hero-grade photos/graphics, optimize to AVIF/WebP via `sharp`/`next/image`, keep only those, and
> `.gitignore` the rest. Logos already live in `public/brand/`. Gap-fill on-brand Bauhaus graphics with the
> device skills: `/higgsfield-generate`, `/higgsfield-product-photoshoot`.

## 2. Database
```bash
cp .env.example .env          # set DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL/PASSWORD, UPLOAD_DIR
docker compose up -d postgres
pnpm prisma:generate
pnpm prisma:migrate           # if validation/schema changes land
pnpm prisma:seed              # English-only content + Bauhaus tokens + PDF media refs
```

## 3. Run
```bash
pnpm dev          # http://localhost:3000  (no /en or /ar prefix — English-only)
```

## 4. Verify (maps to acceptance)
- **English-only**: routes have no locale prefix; no language switcher; English copy throughout.
- **Bauhaus look**: oversized bold headlines, generous white space, big imagery, Bauhaus accents.
- **River hero**: lower third of the homepage hero flows; mouse move and touch drag ripple the water.
- **Fallbacks**: with `prefers-reduced-motion` or WebGL disabled, a static river image shows; page fully usable.
- **Admin**: `/admin/login`; case-study publish requires only English fields; Branding form exposes Bauhaus tokens.

## 5. Quality gates (Phase G)
```bash
pnpm typecheck && pnpm lint
pnpm test                 # vitest units (schemas/helpers)
pnpm test:e2e             # playwright: visitor journey, auth/role, publish, hero fallback
# Lighthouse (home + a case study): Performance & Accessibility >= 90 with the canvas active
```

## Production (self-hosted Docker) — unchanged from v1
```bash
docker compose up -d                          # web (standalone) + postgres + named volumes
docker compose exec web pnpm prisma migrate deploy
docker compose exec web pnpm prisma db seed   # first deploy only
# reverse proxy (Caddy/nginx) terminates TLS → web:3000
```

## Next step
Run `/speckit-constitution` to ratify the **English-only** change (retire/rescope Principle I), then
`/speckit-tasks` to generate the dependency-ordered task list, then `/speckit-implement`.
