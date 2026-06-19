# Implementation Plan: NinetyNile Website Redesign — English-only · Bauhaus · Three.js River Hero

**Branch**: `001-ninetynile-website` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)
**Input**: User redesign directive — "scrape images from the PDF and use them; use the logo files in the repo; Bauhaus design look (white space, big headlines, big text & images); a Three.js flowing-river element in the lower third of the hero that reacts to mouse & touch; the website must be **English only**; scan available device skills and utilize them."

> **Scope**: This is a **redesign delta** on the already-implemented `001-ninetynile-website` codebase (Next.js 15 App Router, Prisma/Postgres, Auth.js, next-intl, Tailwind+shadcn, admin dashboard). It does **not** rebuild from scratch — it pivots the existing public site from bilingual EN/AR to **English-only**, re-skins it to a **Bauhaus** visual system, adds a **WebGL river hero**, and integrates **imagery extracted from the company-profile PDF** plus the repo logo assets. The admin dashboard, auth, data layer, and media pipeline are retained and adjusted, not replaced.

## Summary

Transform the existing bilingual NinetyNile site into an English-only, Bauhaus-styled marketing site with a signature interactive Three.js "flowing river" occupying the lower third of the homepage hero, fed by real imagery scraped from the 45-page company-profile PDF and the brand logos already in `public/brand/`. The work is delivered in seven phases: (A) **Asset pipeline** — extract/curate/optimize PDF imagery + logos, optionally augment with on-device Higgsfield AI-image skills; (B) **De-internationalization** — collapse `[locale]` routing, remove RTL/AR rendering and the publish-time AR requirement; (C) **Bauhaus design system** — typography, palette, grid, and shared-component re-skin driven by `BrandSettings` tokens; (D) **River hero** — `@react-three/fiber` shader water in the hero's lower third with pointer/touch interaction, reduced-motion + no-WebGL fallbacks; (E) **Page redesign** — apply the system and assets across all public pages; (F) **Admin alignment** — drop AR-required validation, expose Bauhaus brand tokens; (G) **Quality gates** — accessibility, performance (incl. a WebGL budget), and updated critical-path tests.

## Technical Context

**Language/Version**: TypeScript 5.7 (strict), Node ≥ 20, React 19
**Primary Dependencies**: Next.js 15.1 (App Router, RSC + Server Actions), Prisma 6 + PostgreSQL 16, Auth.js (NextAuth v5), Tailwind 3.4 + shadcn/ui, `sharp`, Zod, react-hook-form.
  - **Added**: `three`, `@react-three/fiber`, `@react-three/drei` (river hero); a Bauhaus-appropriate webfont (e.g. a geometric grotesque — see research).
  - **Removed/retired**: `next-intl` locale routing (library removal evaluated in research; English UI strings move to a typed dictionary).
**Storage**: PostgreSQL via Prisma (unchanged schema core); local media volume behind `lib/media.ts`; PDF-derived assets live under `public/media/from-pdf/` and/or the `MediaAsset` library.
**Testing**: Vitest (units: Zod schemas, helpers) + Playwright (e2e critical paths). Add WebGL-fallback and reduced-motion tests; remove the AR/RTL language-switch test.
**Target Platform**: Self-hosted Docker (Next.js standalone + Postgres + media volume) behind a TLS reverse proxy. Browsers: evergreen desktop + mobile, WebGL2 with graceful degradation.
**Project Type**: Web application — single Next.js deployable (public site + admin in one app).
**Performance Goals**: Lighthouse Performance & Accessibility ≥ 90 on home + a case study (Constitution II). Hero WebGL: ≤ ~150 KB gz added JS for the three.js bundle path (dynamically imported, excluded from initial route JS), maintain ≥ 50 fps on mid-tier mobile, pause when offscreen/hidden.
**Constraints**: No layout shift from the canvas; hero text & CTAs fully usable without WebGL; large PDF imagery must be responsive/optimized (AVIF/WebP via `next/image` + `sharp`); brand values stay data-driven (no hard-coded colors in components).
**Scale/Scope**: ~10 public pages + admin; single agency editor team; low write volume; content seeded from the PDF.

## Constitution Check

*GATE: evaluated against Constitution **v2.0.0** (amended 2026-06-19 to ratify the English-only redesign). Re-checked after Phase 1 design.*

| Principle (v2.0.0) | Status | Notes |
|-----------|--------|-------|
| **I. English-Only Content Integrity** | ✅ Upheld | Constitution amended — bilingual parity retired. Plan flattens locale routing, removes RTL, and gates publish on English completeness. AR columns kept deprecated/nullable. No deviation remains. |
| **II. Accessibility, Performance & Graceful Degradation** | ✅ Upheld | Three.js mitigations are now first-class governance: dynamic import (off initial JS), `prefers-reduced-motion` + no-WebGL static fallback, offscreen pause, no CLS, ≥90 Lighthouse with canvas active. Big PDF imagery optimized via `next/image`+`sharp`. |
| **III. Security & Least-Privilege Access** | ✅ Unchanged | Auth, roles, server-side `requireRole()`, hashed passwords, rate-limited contact form all retained. Redesign touches presentation, not authz. |
| **IV. Type-Safe, Validated Data Flow** | ✅ Upheld | Strict TS preserved; Zod schemas updated to require English fields only; no new `any` at boundaries. |
| **V. Test the Critical Paths** | ✅ Re-scoped | Drop language/RTL switch test; keep visitor journey, auth/role, case-study publish; add hero-fallback + reduced-motion tests. |
| **VI. Brand-Driven UI & Progressive Enhancement** | ✅ Upheld | Bauhaus look via `BrandSettings` tokens (no hard-coded brand values); interactive hero enhances but never gates content/navigation. |

**Gate result**: PASS. The former Principle I deviation is **resolved** by the v2.0.0 amendment; no outstanding violations. The Complexity Tracking entries below are retained as historical record of the WebGL/performance tension and its mitigations.

## Project Structure

### Documentation (this feature)

```text
specs/001-ninetynile-website/
├── plan.md                  # This file (redesign plan)
├── research.md              # Phase 0 — original + "Redesign Addendum (v2)"
├── data-model.md            # Phase 1 — original + "Redesign Delta (v2)"
├── quickstart.md            # Phase 1 — redesign run/verify steps
├── contracts/
│   ├── hero-river.md        # NEW — Three.js river component contract
│   ├── asset-pipeline.md    # NEW — PDF/logo extraction → optimize → place
│   └── … (existing API contracts retained)
└── tasks.md                 # Phase 2 — produced by /speckit-tasks (not here)
```

### Source Code (repository root) — redesign-affected paths

```text
app/
├── (site)/                    # CHANGED: flattened from app/[locale]/(site) — no locale segment
│   ├── layout.tsx             # CHANGED: drop locale/dir/next-intl provider; English <html lang="en">
│   ├── page.tsx               # CHANGED: Bauhaus hero + <RiverHero/>; EN-only copy
│   ├── about|services|process|production|work|tribe|clients|community|experiences|contact/
│   └── work/[slug]/page.tsx   # CHANGED: Bauhaus case-study layout, PDF imagery
├── admin/(dashboard)/…        # MINOR: branding form gains Bauhaus tokens; AR inputs retired
├── layout.tsx                 # CHANGED: root metadata EN-only; load Bauhaus font
└── globals.css                # CHANGED: Bauhaus tokens, type scale, remove RTL block

components/
├── site/
│   ├── river-hero/            # NEW: client component + shader + pointer/touch + fallbacks
│   │   ├── river-hero.tsx     # 'use client'; dynamic-imported R3F <Canvas>
│   │   ├── water-material.ts  # custom shader (flow + ripple on pointer)
│   │   └── river-fallback.tsx # static image used for reduced-motion / no-WebGL
│   ├── site-header.tsx        # CHANGED: remove LanguageSwitcher; Bauhaus nav
│   ├── site-footer.tsx        # CHANGED: EN-only, Bauhaus
│   ├── case-study-card.tsx    # CHANGED: Bauhaus card; single-locale fields
│   └── language-switcher.tsx  # REMOVED
└── ui/…                       # shadcn primitives restyled via tokens (mostly token-driven)

lib/
├── content/ui.ts              # NEW: typed English UI-string dictionary (replaces messages/*)
├── i18n/…                     # REMOVED/retired (routing, navigation, request, content)
├── branding.ts                # CHANGED: Bauhaus token defaults; EN-only getters
└── validation/*.ts            # CHANGED: publish gate no longer requires *Ar fields

messages/                      # REMOVED (en.json/ar.json) — superseded by lib/content/ui.ts
middleware.ts                  # CHANGED: drop next-intl middleware; keep /admin auth guard
public/
├── brand/                     # existing logos (NN_Logos-*.png, Picture7-1.png)
└── media/from-pdf/            # NEW: curated, optimized imagery scraped from the PDF
prisma/seed.ts                 # CHANGED: EN-only seed, Bauhaus brand tokens, PDF media refs
```

**Structure Decision**: Retain the single-deployable Next.js app. The largest structural change is **removing the `[locale]` route group** (`app/[locale]/(site)` → `app/(site)`) and the next-intl middleware, plus adding a self-contained `components/site/river-hero/` module. Everything else is in-place re-skinning and validation/seed adjustments. AR database columns are **kept but deprecated** (nullable, no longer rendered or required) to avoid a destructive migration in this phase; a later cleanup migration can drop them once confirmed.

## Phased Approach

**Phase A — Asset pipeline (prerequisite).** Extract embedded imagery from `NinetyNile Profile for website TO SAMER copy.pdf` (via `pdfimages -all`; ghostscript page-render fallback). Curate the usable photos/graphics, optimize to web formats, and place under `public/media/from-pdf/`. Catalog logos in `public/brand/`. Where the PDF lacks a clean hero/section asset, generate Bauhaus-style supporting graphics with the on-device **Higgsfield** skills (`higgsfield-generate` for geometric/Bauhaus art & textures; `higgsfield-product-photoshoot` for hero/banner creatives). See `contracts/asset-pipeline.md`.

**Phase B — English-only.** Flatten locale routing, delete next-intl wiring/middleware, move UI strings to `lib/content/ui.ts`, render only English fields, and drop the AR-required publish gate in Zod/validation. Keep AR DB columns nullable/deprecated.

**Phase C — Bauhaus design system.** Define tokens (primary Bauhaus palette — black on white with red/blue/yellow accents, configurable via `BrandSettings`), a bold geometric type scale (oversized headlines), generous spacing scale, and asymmetric grid utilities in `globals.css` + `tailwind.config.ts`. Re-skin shadcn primitives and shared site components through tokens (no hard-coded brand values — Constitution constraint).

**Phase D — River hero.** Build `components/site/river-hero/` — a dynamically imported R3F `<Canvas>` rendering a flowing-water shader confined to the hero's lower third, displacing/rippling toward the pointer and touch points. Ship `prefers-reduced-motion` and no-WebGL fallbacks, offscreen pause, and a fixed-height container to prevent layout shift. See `contracts/hero-river.md`.

**Phase E — Page redesign.** Apply the Bauhaus system and PDF imagery across home, about/story, services, process, production, work + case-study detail, tribe, clients, community, experiences, contact — big headlines, big images, white space.

**Phase F — Admin alignment.** Remove AR inputs / AR-required validation from admin forms; extend the Branding form with Bauhaus color/typography tokens so the agency can tune the look without code.

**Phase G — Quality gates.** Verify Lighthouse ≥ 90 (perf + a11y) on home + a case study with the canvas active; confirm WebGL/reduced-motion fallbacks; update Playwright/Vitest suites (remove RTL switch; add fallback tests); typecheck + lint clean.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| **English-only — departs from Constitution I (Bilingual Parity)** | Explicit owner directive for this redesign. The audience target and content strategy changed; maintaining AR parity is no longer a requirement. | Keeping bilingual parity was rejected because it contradicts the direct owner instruction; a half-maintained AR locale would be worse than none. **Resolution: amend the constitution** (retire/rescope Principle I) via `/speckit-constitution` before `/speckit-implement`. |
| **Add Three.js / WebGL to a performance-budgeted site (tension with Constitution II)** | The signature interactive river hero is an explicit, central product requirement. | A CSS/SVG/`<video>` river was considered (cheaper) but cannot meet the "interacts with mouse and touch" requirement with the same fidelity. Mitigated by dynamic import (kept off initial JS), reduced-motion/no-WebGL fallbacks, offscreen pause, and an explicit WebGL bundle + fps budget so Principle II still holds. |
