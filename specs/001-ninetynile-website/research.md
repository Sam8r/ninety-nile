# Phase 0 Research: NinetyNile Website + Dashboard

All NEEDS CLARIFICATION items were resolved with the stakeholder (see decisions below). This document records the chosen approaches and rejected alternatives.

## 1. Architecture: full-stack Next.js vs split frontend/backend

- **Decision**: Single Next.js 15 App Router app with a public `[locale]/(site)` route group and an authenticated `admin` route group. Mutations via Server Actions; reads via Server Components.
- **Rationale**: One deployable, shared types/validation, simplest ops for a content-driven site with low write volume. Server Actions remove the need for a separate REST layer for the dashboard.
- **Alternatives considered**: Separate Express/Nest API + standalone React admin (more moving parts, duplicated auth/types); tRPC (nice DX but unnecessary given Server Actions cover the admin and a thin public read layer suffices).

## 2. Content storage: custom Postgres/Prisma vs headless CMS

- **Decision**: PostgreSQL 16 + Prisma ORM, custom dashboard. *(Stakeholder choice.)*
- **Rationale**: Full control of schema and UI, no third-party SaaS dependency or recurring cost, content stays on the self-hosted DB, tailored bilingual + ordering + publish workflow.
- **Alternatives considered**: Payload CMS (great built-in admin/media/auth, but less control and an extra framework to learn); Sanity (hosted, excellent editing UX, but content leaves the self-hosted environment) — both rejected per stakeholder decision.

## 3. Internationalization & RTL (EN + AR)

- **Decision**: `next-intl` with locale-segment routing (`/en/...`, `/ar/...`); `dir="rtl"` set on the `<html>` for Arabic; Tailwind logical properties (`ps-`/`pe-`, `ms-`/`me-`) for direction-agnostic layout. UI strings in `messages/en.json` + `messages/ar.json`; content translations stored per-field in the DB.
- **Rationale**: `next-intl` is the mature App-Router-native i18n library with good RTL and Server Component support. Locale-prefixed routes are SEO-friendly and explicit.
- **Content model**: paired fields (`title_en` / `title_ar`, etc.) — simple, queryable, and validatable. Publish requires both languages present.
- **Alternatives considered**: `next-i18next` (Pages-Router oriented), hand-rolled context (reinvents the wheel); single JSON blob per record (harder to validate/query individual fields).

## 4. Authentication & authorization

- **Decision**: Auth.js (NextAuth v5) Credentials provider, bcrypt-hashed passwords, JWT/session strategy. Roles `admin` | `editor` stored on the User and embedded in the session. Middleware guards `/admin/*`; a server-side `requireRole()` helper gates admin-only actions (branding, users). *(Roles: admin + editor — stakeholder choice.)*
- **Rationale**: First-party Next.js integration, supports route + action-level checks; credentials fit a small internal team with no external IdP requirement.
- **Alternatives considered**: Lucia (lighter but more wiring), Clerk/Auth0 (hosted, overkill + cost for a small internal dashboard).

## 5. Media handling (self-hosted)

- **Decision**: Upload via a route handler; store on a local volume (`/app/uploads`, Docker volume in prod); process/resize with `sharp`; persist metadata in a `MediaAsset` table; serve via Next image optimization. Abstract behind `lib/media.ts`.
- **Rationale**: Stakeholder chose self-hosted; local volume avoids external storage cost. The abstraction keeps a future swap to S3/Vercel Blob to a single module.
- **Alternatives considered**: External object storage (S3/R2) now (unnecessary cost/complexity for v1); storing binaries in Postgres (bad practice, bloats DB).
- **Note**: Case-study *video* is embedded from external platforms (YouTube/Instagram/TikTok) per the profile, so the site stores posters/thumbnails, not large video files.

## 6. Deployment (self-hosted VPS)

- **Decision**: Docker Compose — `web` (Next.js `output: "standalone"`), `postgres:16`, named volumes for DB data and uploads; reverse proxy (Caddy or nginx) for TLS. Prisma migrations run on deploy; seed runs once.
- **Rationale**: Reproducible, matches the self-hosted choice, portable across any VPS.
- **Alternatives considered**: Vercel (rejected — stakeholder chose self-hosted; also local-volume media doesn't fit serverless); bare-metal PM2 (less reproducible than containers).

## 7. UI / styling system

- **Decision**: Tailwind CSS + shadcn/ui; brand tokens (colors, fonts) driven by CSS variables populated from `BrandSettings` so admin branding changes theme the site live. Forms with react-hook-form + Zod resolver.
- **Rationale**: Fast, consistent, accessible primitives; logical properties make RTL straightforward; CSS-variable theming lets branding be data-driven.
- **Alternatives considered**: Plain CSS/SCSS (slower to build consistent UI), MUI/Chakra (heavier, harder to fully restyle to brand).

## 8. Public content delivery (freshness vs performance)

- **Decision**: Static rendering with ISR / on-demand revalidation. Admin publish actions call `revalidatePath`/`revalidateTag` so edits go live within seconds while pages stay fast and cacheable.
- **Rationale**: Read-heavy content site benefits from caching; on-demand revalidation satisfies SC-004 (changes live in < 5 min, actually seconds).
- **Alternatives considered**: Fully dynamic SSR (slower, more DB load), pure SSG with rebuilds (edits require redeploy — fails the live-update requirement).

## 9. Testing strategy

- **Decision**: Vitest for unit (Zod schemas, helpers, media utils); Playwright for e2e covering the P1 visitor journey, language/RTL switching, auth + role boundaries, and case-study CRUD/publish.
- **Rationale**: Matches the highest-risk surfaces (auth, bilingual rendering, publish workflow) and the spec's success criteria.

## Open items deferred to later phases (non-blocking)

- Final Arabic translations of profile copy (agency to supply; placeholders seeded).
- High-resolution case-study imagery/video posters (agency to supply; placeholders/links seeded).
- Contact-form delivery channel (SMTP credentials vs store-only) — default: store in DB + optional SMTP via env; spam protection via honeypot + rate limit.

---

# Redesign Addendum (v2) — English-only · Bauhaus · Three.js River Hero

Records the decisions for the redesign delta. Supersedes §3 (i18n) for this phase.

## R1. English-only (supersedes original §3 i18n/RTL)

- **Decision**: Remove locale-segment routing and RTL. Flatten `app/[locale]/(site)` → `app/(site)`; drop `next-intl` middleware and the `lib/i18n/*` modules; move UI strings into a typed `lib/content/ui.ts` dictionary. Render only English (`*En`) fields; the publish gate no longer requires `*Ar`.
- **DB stance**: Keep `*Ar` columns (nullable, deprecated) for now — non-destructive. A later migration can drop them once the English-only site is confirmed in production.
- **Rationale**: The owner directed an English-only site; removing the i18n machinery simplifies routing, middleware, validation, and the admin UI, and reduces bundle/runtime overhead.
- **Constitution note**: Conflicts with Principle I — flagged in plan.md Complexity Tracking; resolve via `/speckit-constitution` amendment.
- **Alternatives considered**: Keep `next-intl` with a single locale and `localePrefix: "never"` (less churn but retains unused i18n machinery and the locale provider); rejected in favor of a clean removal for clarity and performance.

## R2. Bauhaus design system

- **Decision**: Black-on-white base with the classic Bauhaus primary accents (red / blue / yellow), generous white space, an oversized bold geometric headline scale, strong baseline grid, and geometric motifs (circle/triangle/square dividers). Implement as CSS-variable design tokens in `globals.css` consumed by `tailwind.config.ts`, themeable through `BrandSettings` (no hard-coded brand values in components — Constitution constraint).
- **Typography**: Pair a geometric grotesque for display headlines (e.g. a Futura-like / "Archivo"/"Poppins"/"Space Grotesk"-class webfont) with a clean neutral body face, loaded via `next/font` for zero-CLS self-hosting. Final face selectable in `BrandSettings` typography tokens.
- **Rationale**: Matches the requested Bauhaus aesthetic (white space, big headlines, big text & images) while keeping branding data-driven so the agency can tune it from the dashboard.
- **Alternatives considered**: Hard-coded theme (rejected — violates data-driven theming constraint); a heavier UI kit (rejected — fights the minimalist Bauhaus look).

## R3. Three.js flowing-river hero

- **Decision**: Use `@react-three/fiber` + `@react-three/drei` over a thin `three` base. Render a plane with a **custom flowing-water shader** (scrolling normal/flow noise) confined to the **lower third** of the hero. Pointer and touch positions feed a uniform that adds ripple/displacement at the contact point. The whole `<Canvas>` is **dynamically imported** (`next/dynamic`, `ssr: false`) so three.js stays off the initial route bundle.
- **Resilience**: Render a static `river-fallback` image when `prefers-reduced-motion: reduce` or WebGL2 is unavailable; pause the render loop via `IntersectionObserver`/`document.visibilitychange`; fixed-height container to avoid CLS; cap DPR (e.g. ≤ 2) and frameloop on-demand where possible.
- **Performance budget**: three.js loaded only on the home route and excluded from initial JS; target ≥ 50 fps mid-tier mobile; Lighthouse home ≥ 90 retained (Constitution II).
- **Rationale**: Only a real WebGL surface delivers the requested fluid, mouse/touch-reactive water with the right fidelity; R3F gives a declarative, maintainable React integration.
- **Alternatives considered**: Looping `<video>` (no real interaction); CSS/SVG animation (limited fluid realism, no per-pointer ripple); raw `three` without R3F (more imperative lifecycle/cleanup code). All rejected against the interaction requirement.

## R4. Asset pipeline (PDF imagery + logos + AI augmentation)

- **Decision**: Extract embedded images from the company-profile PDF using `pdfimages -all` (poppler); fall back to a ghostscript/ImageMagick page-render-and-crop when embedded extraction is unsuitable. Curate usable photos/graphics, optimize to AVIF/WebP via `sharp`/`next/image`, and place under `public/media/from-pdf/` (and/or register in the `MediaAsset` library). Reuse the repo logos in `public/brand/`.
- **AI augmentation (on-device skills)**: Where the PDF lacks a clean hero/section asset, generate Bauhaus-style geometric art, textures, and hero/banner creatives with the available **Higgsfield** skills — `higgsfield-generate` (GPT Image 2 for design/text/graphics) and `higgsfield-product-photoshoot` (hero/banner/lifestyle creatives). `higgsfield-soul-id`/`higgsfield-marketplace-cards` are out of scope.
- **Rationale**: Grounds the redesign in the agency's real brand imagery while filling gaps with on-brand generated assets; keeps everything self-hosted.
- **Alternatives considered**: Stock photography (off-brand, licensing overhead); rasterizing whole PDF pages as imagery (includes text/layout, not reusable) — used only as a cropping fallback.

## R5. Skills utilized

- **Spec Kit skills** drive the workflow: `/speckit-plan` (this), `/speckit-tasks`, `/speckit-implement`, `/speckit-analyze`, `/speckit-checklist`, plus the `speckit-git-*` hooks for branch/commit hygiene. A `/speckit-constitution` run is required to ratify the English-only change.
- **Higgsfield skills** drive asset production (see R4).
