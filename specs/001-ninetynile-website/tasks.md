---
description: "Task list for NinetyNile redesign — English-only · Bauhaus · Three.js river hero"
---

# Tasks: NinetyNile Website Redesign (English-only · Bauhaus · Three.js River Hero)

**Input**: Design documents from `/specs/001-ninetynile-website/`
**Prerequisites**: plan.md (redesign), research.md (Redesign Addendum v2), data-model.md (Redesign Delta v2), contracts/ (hero-river.md, asset-pipeline.md)

**Tests**: Critical-path tests are included per Constitution v2.0.0 Principle V (visitor journey, auth/role, publish workflow, hero graceful-degradation). Exhaustive per-screen tests are NOT required.

**Organization**: This is a **redesign delta** on the existing implementation — most tasks MODIFY existing files. Tasks are grouped by user story for independent delivery.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: US1 (public redesign), US2 (editor admin), US3 (admin branding/content), US4 (users)

## Path Conventions

Single Next.js app at repo root: `app/`, `components/`, `lib/`, `prisma/`, `public/`, `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencies, fonts, and the PDF asset pipeline that everything else draws on.

- [X] T001 Add WebGL deps to `package.json`: `three`, `@react-three/fiber`, `@react-three/drei` (deps) and `@types/three` (devDep); run install and commit `pnpm-lock.yaml`.
- [X] T002 [P] Load Bauhaus typography via `next/font` (geometric display + neutral body, e.g. Space Grotesk + Inter) in `app/layout.tsx`, exposing `--font-heading`/`--font-body` CSS vars.
- [X] T003 [P] Curate the extracted PDF images: select hero/case-study/team/client/graphic assets from `public/media/from-pdf/`, optimize to AVIF/WebP via `sharp`, and place the keepers in `public/media/curated/` (committed); leave the raw dump gitignored per `asset-pipeline.md`.
- [X] T004 [P] Catalog brand logos in `public/brand/` (`NN_Logos-*`, `Picture7-1.png`): pick header/footer/favicon variants and record paths in `specs/001-ninetynile-website/contracts/asset-pipeline.md` notes.

**Checkpoint**: Deps installed, fonts wired, curated imagery + logos ready to reference.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: De-internationalize to English-only and stand up the Bauhaus token system. **Blocks all user stories** — every page and form depends on the flattened routing, the English dictionary, and the design tokens.

⚠️ Complete this entire phase before starting any user story.

### English-only routing & strings

- [X] T005 Remove the `next-intl` middleware from `middleware.ts`; keep only the `/admin` auth guard and the static-file/`/api`/`/uploads` passthrough; simplify the `config.matcher`.
- [X] T006 Flatten routing: move every route from `app/[locale]/(site)/*` to `app/(site)/*` (pages: home, about, services, process, production, work, work/[slug], tribe, clients, community, experiences, contact, not-found), and delete the `app/[locale]/` tree.
- [X] T007 Update the root `app/layout.tsx` to render `<html lang="en" dir="ltr">` with no locale param and no `NextIntlClientProvider`; remove `app/[locale]/layout.tsx`.
- [X] T008 [P] Create `lib/content/ui.ts` — a typed English UI-string dictionary replacing `messages/en.json` (Nav, Home, common labels); delete `messages/en.json` and `messages/ar.json` and the `messages/` dir.
- [X] T009 Remove `lib/i18n/*` (`routing.ts`, `navigation.ts`, `request.ts`, `content.ts`) and `next-intl` config in `next.config.mjs`; replace `@/lib/i18n/navigation` `Link` imports with `next/link` and `getTranslations` calls with `lib/content/ui.ts` lookups across `app/` and `components/`.
- [X] T010 Remove `next-intl` from `package.json` dependencies once no imports remain; run typecheck to confirm.

### Bauhaus design tokens & validation

- [X] T011 Rewrite `app/globals.css` tokens for Bauhaus: white background, black foreground, primary accents (red/blue/yellow) mapped to `--brand-*` vars; add an oversized geometric type scale and a generous spacing scale; remove the `[dir="rtl"]` block.
- [X] T012 [P] Extend `tailwind.config.ts`: map Bauhaus accent colors, set `fontFamily.heading/body` to the new font vars, widen the display font-size scale, and add a `flow`/`ripple` keyframe for the river fallback shimmer.
- [X] T013 [P] Update `lib/branding.ts`: Bauhaus token defaults (palette + typography) and English-only getters (drop `*Ar` tagline/name getters from the public path).
- [X] T014 Update `lib/validation/*.ts` (`case-study.ts`, `project.ts`, `settings.ts`, `user.ts`, `index.ts`): publish gate requires English fields only; make `*Ar` optional/nullable in all schemas.
- [X] T015 [P] Confirm `prisma/schema.prisma` `*Ar` columns are nullable (deprecated, not dropped); add a `// deprecated: English-only redesign` comment. No destructive migration in this phase.

**Checkpoint**: App builds and runs English-only at `/` (no locale prefix); Bauhaus tokens active; publish validation English-only. User stories can now begin.

---

## Phase 3: User Story 1 — Visitor explores the redesigned site (Priority: P1) 🎯 MVP

**Goal**: An English-only, Bauhaus-styled public site with big headlines/white space/big imagery, a signature interactive Three.js river hero, and real PDF-sourced imagery across all pages.

**Independent Test**: Navigate Home → Services → Our Work → a case-study detail → Contact in English; confirm Bauhaus styling, the river hero reacting to mouse/touch in the lower third, and the static fallback under reduced-motion/no-WebGL.

### River hero (contracts/hero-river.md)

- [X] T016 [P] [US1] Create `components/site/river-hero/water-material.ts` — a custom flowing-water shader (scrolling flow-noise + pointer-ripple uniform).
- [X] T017 [P] [US1] Create `components/site/river-hero/river-fallback.tsx` — static river image (from curated PDF asset) for reduced-motion / no-WebGL.
- [X] T018 [US1] Create `components/site/river-hero/river-hero.tsx` (`'use client'`) — R3F `<Canvas>` confined to the lower third, pointer + touch ripple, `IntersectionObserver`/`visibilitychange` pause, DPR cap, `aria-hidden`, dispose-on-unmount; renders fallback on reduced-motion/no-WebGL per `RiverHeroProps`.
- [X] T019 [US1] Integrate the hero into `app/(site)/page.tsx`: Bauhaus hero (oversized headline + CTA above) with `<RiverHero>` dynamically imported via `next/dynamic({ ssr: false })`, fixed-height band → zero CLS.

### Shared site chrome & components (Bauhaus, English-only)

- [X] T020 [US1] Re-skin `components/site/site-header.tsx`: remove `LanguageSwitcher`, English nav from `lib/content/ui.ts`, Bauhaus layout + logo from `public/brand/`.
- [X] T021 [P] [US1] Delete `components/site/language-switcher.tsx` and remove all references.
- [X] T022 [P] [US1] Re-skin `components/site/site-footer.tsx` and `components/site/site-nav.tsx` — English-only, Bauhaus.
- [X] T023 [P] [US1] Update `components/site/case-study-card.tsx` — single English fields, Bauhaus card (big image, bold title).
- [X] T024 [P] [US1] Restyle `components/site/page-header.tsx`, `media-figure.tsx`, `external-video-embed.tsx` to the Bauhaus system.
- [X] T025 [P] [US1] Update `components/site/contact-form.tsx` — English-only labels/validation, Bauhaus styling, retain honeypot/rate-limit.

### Public pages (Bauhaus + PDF imagery, English-only)

- [X] T026 [US1] Redesign `app/(site)/page.tsx` sections below the hero (featured work, services preview) — big imagery, white space, English copy.
- [X] T027 [P] [US1] Redesign `app/(site)/about/page.tsx` (origin/operations/"Cause & Effect") with curated imagery.
- [X] T028 [P] [US1] Redesign `app/(site)/services/page.tsx` and `app/(site)/process/page.tsx`.
- [X] T029 [P] [US1] Redesign `app/(site)/production/page.tsx` and `app/(site)/experiences/page.tsx`.
- [X] T030 [P] [US1] Redesign `app/(site)/work/page.tsx` (listing grid + empty state) and `app/(site)/work/[slug]/page.tsx` (Challenge/Solution/Results, metrics, gallery, external links).
- [X] T031 [P] [US1] Redesign `app/(site)/tribe/page.tsx`, `app/(site)/clients/page.tsx`, `app/(site)/community/page.tsx`.
- [X] T032 [P] [US1] Redesign `app/(site)/contact/page.tsx` with English contact details + form.

### SEO, seed & data wiring

- [X] T033 [P] [US1] Update `lib/page-metadata.ts`, `app/sitemap.ts`, `app/robots.ts`, and `app/(site)/not-found.tsx` to English-only (no locale alternates).
- [X] T034 [US1] Update `prisma/seed.ts`: English-only content from the PDF, Bauhaus `BrandSettings` tokens, and curated media wired into hero, case studies, services, team, and clients.

### Critical-path tests (US1)

- [X] T035 [P] [US1] Playwright: visitor journey Home → Services → Work → case-study detail → Contact (no locale prefix) in `tests/e2e/visitor-journey.spec.ts`.
- [X] T036 [P] [US1] Playwright: hero graceful degradation — `prefers-reduced-motion` and WebGL-disabled both render the static river and a usable page in `tests/e2e/hero-fallback.spec.ts`.
- [X] T037 [P] [US1] Remove/replace the old RTL/locale-switch e2e test; delete assertions on `/en` `/ar` routing.

**Checkpoint**: US1 is independently shippable — the full redesigned English-only public site with the interactive hero. **This is the MVP.**

---

## Phase 4: User Story 2 — Editor manages case studies & projects (Priority: P2)

**Goal**: Editors create/edit/reorder case studies and projects through English-only admin forms.

**Independent Test**: Log in as editor, create a case study with English content + uploaded image, publish it, confirm it appears on `/work`; unpublish and confirm it disappears.

- [X] T038 [US2] Update `components/admin/case-study-form.tsx` — remove Arabic input fields; English-only validation via shared Zod; keep media/links/order/publish.
- [X] T039 [P] [US2] Update `components/admin/project-form.tsx` — remove Arabic fields, English-only.
- [X] T040 [P] [US2] Update `components/admin/bilingual-crud-manager.tsx` → single-language manager (drop the AR column/tab) used by list/reorder screens.
- [X] T041 [P] [US2] Update `components/admin/media-picker.tsx` and `media-library-grid.tsx` — English alt text only.
- [X] T042 [US2] Update `app/admin/(dashboard)/case-studies/[id]/preview/page.tsx`, `case-studies/page.tsx`, and `projects/page.tsx` to the English-only render path.
- [X] T043 [P] [US2] Update `lib/actions/case-studies.ts` and `lib/actions/projects.ts` — English-only validation + `revalidatePath` on publish; ensure no `*Ar`-required logic remains.
- [X] T044 [P] [US2] Playwright: editor create → publish → unpublish case study round-trip in `tests/e2e/editor-casestudy.spec.ts`.

**Checkpoint**: Editors manage content end-to-end in English; public site reflects publish/unpublish.

---

## Phase 5: User Story 3 — Admin controls Bauhaus branding & site content (Priority: P2)

**Goal**: Admin tunes the Bauhaus look (colors/typography tokens, logos, taglines) and section content without code.

**Independent Test**: As admin, change a Bauhaus accent color and the primary tagline, upload a logo, and confirm the public header/footer/hero update.

- [X] T045 [US3] Extend `components/admin/branding-form.tsx` — Bauhaus color tokens (primary + red/blue/yellow accents) and typography token pickers; English-only taglines/site name; writes to `BrandSettings`.
- [X] T046 [P] [US3] Update `lib/actions/branding.ts` — persist Bauhaus tokens, validate via `lib/validation/settings.ts`, revalidate public layout.
- [X] T047 [P] [US3] Update `components/admin/site-content-editor.tsx` and `contact-details-form.tsx` — English-only.
- [X] T048 [P] [US3] Update the Services / Process / Tribe / Clients / Testimonials managers (`app/admin/(dashboard)/{services,process,tribe,clients,testimonials,content,contact}/page.tsx`) and `lib/actions/{site-content,structured-content}.ts` to English-only.
- [X] T049 [P] [US3] Playwright: admin branding change reflects on public site in `tests/e2e/admin-branding.spec.ts`.

**Checkpoint**: Branding and section content are admin-editable; Bauhaus theme is data-driven (Constitution VI).

---

## Phase 6: User Story 4 — Admin manages users & access (Priority: P3)

**Goal**: Admin creates editor accounts and manages roles; editors are blocked from branding/user routes. (Largely existing — verify under the redesign.)

**Independent Test**: As admin create an editor; log in as editor and confirm branding/user routes are denied while case-study routes are allowed.

- [X] T050 [P] [US4] Verify/adjust `components/admin/users-manager.tsx` and `lib/actions/users.ts` render English-only; no behavioral regressions from de-i18n.
- [X] T051 [P] [US4] Confirm server-side role guards in `lib/auth-guards.ts` and the `/admin` middleware still enforce `editor` exclusion from `branding`/`users` (Constitution III) after routing changes.
- [X] T052 [P] [US4] Playwright: auth + role boundary test (unauth → login redirect; editor blocked from `/admin/branding` & `/admin/users`) in `tests/e2e/auth-roles.spec.ts`.

**Checkpoint**: Role enforcement intact; user management works English-only.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates, cleanup, and doc alignment per Constitution v2.0.0.

- [X] T053 [P] Unit tests (Vitest) for updated Zod schemas (English-required publish gate) in `tests/unit/validation.test.ts`.
- [X] T054 Verify Lighthouse Performance & Accessibility ≥ 90 on home (with canvas active) and a case study; record results; fix regressions (image sizing, three.js bundle isolation).
- [X] T055 [P] Confirm three.js is excluded from the initial home-route JS bundle (dynamic import) and the WebGL bundle is within the budget in `contracts/hero-river.md`.
- [X] T056 [P] Run `pnpm typecheck` and `pnpm lint`; resolve all errors from the de-i18n refactor.
- [X] T057 [P] Update `spec.md` to the English-only redesign: revise FR-013 (drop bilingual/RTL), the bilingual acceptance scenarios in US1, and SC-007; note Bauhaus + river hero requirements. (Resolves the Sync Impact Report follow-up.)
- [X] T058 [P] Update `README.md` cross-checks (English-only run, no locale URLs); confirm `quickstart.md` steps.
- [X] T059 [P] Accessibility pass: alt text on all curated imagery, keyboard nav, contrast against the Bauhaus palette (Constitution II).

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** → **Phase 2 (Foundational)**: strictly sequential; Phase 2 blocks all stories.
- **User stories** after Phase 2:
  - **US1 (P1)** is the MVP and should be delivered first.
  - **US2 (P2)** and **US3 (P2)** are independent of each other and of US1's pages (they touch `app/admin/*` and `components/admin/*`); they can proceed in parallel once Phase 2 is done, depending on T014 (English-only validation) and T013 (branding tokens).
  - **US4 (P3)** is mostly verification; depends only on the routing/guard changes in Phase 2.
- **Phase 7 (Polish)** runs after the stories it audits; T057/T058 (docs) can start any time.

```
Setup → Foundational → ├─ US1 (P1, MVP) ─┐
                       ├─ US2 (P2) ──────┤→ Polish
                       ├─ US3 (P2) ──────┤
                       └─ US4 (P3) ──────┘
```

## Parallel Execution Examples

- **Setup**: T002, T003, T004 in parallel after T001.
- **Foundational**: T008, T012, T013, T015 in parallel (distinct files) while T005–T007/T009–T011 proceed in dependency order.
- **US1 pages**: T027–T032 are all `[P]` (separate page files) once chrome (T020–T025) and the hero (T016–T019) land.
- **Cross-story**: once Phase 2 is done, an US2 worker (admin forms), an US3 worker (branding), and an US4 worker (verification) can run alongside the US1 worker.

## Implementation Strategy

- **MVP = Phase 1 + Phase 2 + Phase 3 (US1)** — the redesigned English-only public site with the Bauhaus system and interactive river hero. Shippable on its own.
- **Increment 2** = US2 + US3 (admin alignment to English-only + Bauhaus branding).
- **Increment 3** = US4 (user-management verification) + Phase 7 polish/gates.
- Keep AR DB columns until the redesign is confirmed in production; schedule a later non-destructive migration to drop them.

## Notes

- This is a **delta** on a working codebase — prefer MODIFY over rewrite; match existing file conventions.
- No hard-coded brand values in components (Constitution VI) — everything Bauhaus flows from `BrandSettings`/CSS vars.
- Re-validate the Constitution Check in `plan.md` against **v2.0.0** before `/speckit-implement`.
