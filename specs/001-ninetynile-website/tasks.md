---
description: "Task list for NinetyNile bilingual website + admin dashboard"
---

# Tasks: NinetyNile Bilingual Agency Website + Admin Dashboard

**Input**: Design documents from `/specs/001-ninetynile-website/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Critical-path tests are INCLUDED because Constitution v1.0.0 Principle V mandates
end-to-end coverage of the visitor journey, RTL switching, auth/role boundaries, and the
publish workflow. Coverage is focused on these surfaces, not exhaustive.

**Organization**: Tasks are grouped by user story (US1–US4) to enable independent implementation
and testing. Paths follow the single full-stack Next.js layout in plan.md.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1–US4 (user story phases only)

## Path Conventions

Single Next.js App Router project at repo root: `app/`, `components/`, `lib/`, `prisma/`,
`messages/`, `tests/`, with public site under `app/[locale]/(site)` and dashboard under `app/admin`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling.

- [X] T001 Initialize Next.js 15 app (App Router, React 19, TypeScript strict, `output: "standalone"`) at repo root with `app/`, `components/`, `lib/` structure per plan.md
- [X] T002 [P] Install and configure Tailwind CSS + shadcn/ui (logical properties enabled) in `tailwind.config.ts` and `app/globals.css`
- [X] T003 [P] Configure ESLint, Prettier, and TypeScript strict settings in `.eslintrc`, `.prettierrc`, `tsconfig.json`
- [X] T004 [P] Install core deps (Prisma, @prisma/client, next-auth@beta, next-intl, zod, react-hook-form, bcrypt, sharp) and dev deps (vitest, @playwright/test) in `package.json`
- [X] T005 [P] Initialize Prisma (`prisma init`) and create `prisma/schema.prisma` datasource/generator blocks
- [X] T006 [P] Configure next-intl: `lib/i18n/routing.ts` (locales `en`,`ar`; default `en`), `messages/en.json`, `messages/ar.json`, `lib/i18n/request.ts`
- [X] T007 [P] Create `docker-compose.yml` (web + `postgres:16` + named volumes `pgdata`,`uploads`) and `Dockerfile` (standalone build)
- [X] T008 [P] Create `.env.example` and `lib/env.ts` (Zod-validated env: DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL/PASSWORD, UPLOAD_DIR, SMTP_*)

**Checkpoint**: Project builds and runs an empty page in both `/en` and `/ar`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure all user stories depend on.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [X] T009 Define full Prisma schema (User, CaseStudy, Project, MediaAsset, CaseStudyMedia, Service, ProcessStep, ProductionPhase, EquipmentItem, TeamMember, Client, Testimonial, BrandSettings, SiteContent, ContactDetails, ContactSubmission; enums Role/Status/Category) per data-model.md in `prisma/schema.prisma`
- [X] T010 Create initial migration and Prisma client singleton in `lib/db.ts` (`prisma migrate dev`)
- [X] T011 [P] Implement locale layout with `dir` rtl/ltr + next-intl provider in `app/[locale]/layout.tsx`
- [X] T012 [P] Implement brand theming: read BrandSettings → emit CSS variables (colors/fonts) in root layout `app/[locale]/layout.tsx` + `lib/branding.ts`
- [X] T013 [P] Implement media storage abstraction (`sharp` resize, local-volume write/read, metadata) in `lib/media.ts`
- [X] T014 [P] Scaffold shared Zod validation module + bilingual-required-on-publish helper in `lib/validation/`
- [X] T015 Configure Auth.js v5 credentials provider (bcrypt verify, role in session) in `lib/auth.ts` and `app/api/auth/[...nextauth]/route.ts`
- [X] T016 Implement `middleware.ts` guarding `/admin/*` (redirect to login) + `requireSession()`/`requireRole()` helpers in `lib/auth-guards.ts`
- [X] T017 Build admin shell: login page `app/admin/login/page.tsx` and dashboard layout with role-based nav in `app/admin/(dashboard)/layout.tsx`
- [X] T018 Implement seed script seeding the admin user + all PDF content (brand, services, process, production, tribe, 9 case studies, community story, clients, testimonials, contact) from data-model.md in `prisma/seed.ts`
- [X] T019 [P] Add shared UI primitives (shadcn components) and base `components/site/` + `components/admin/` scaffolding

**Checkpoint**: Migrated DB seeded with PDF content; admin can log in; locale + RTL + branding render.

---

## Phase 3: User Story 1 - Visitor explores the agency and its work (Priority: P1) 🎯 MVP

**Goal**: A fully navigable bilingual public website presenting the entire profile and all case studies.

**Independent Test**: Navigate Home → Services → Our Work → a case study → Contact, in EN and AR (RTL), on mobile and desktop, reading seeded content.

### Tests for User Story 1

- [~] T020 [P] [US1] Playwright e2e: visitor journey home→work→detail→contact in EN and AR (RTL) in `tests/e2e/visitor-journey.spec.ts`

### Implementation for User Story 1

- [X] T021 [P] [US1] Build Header/nav, Footer, and LanguageSwitcher (locale-aware, persists choice) in `components/site/`
- [X] T022 [P] [US1] Build CaseStudyCard, MediaFigure, and ExternalVideoEmbed components in `components/site/`
- [X] T023 [US1] Home page (brand hero, tagline, intro, featured case studies, services preview) in `app/[locale]/(site)/page.tsx`
- [X] T024 [P] [US1] About page (story, Cause & Effect, Why Content) in `app/[locale]/(site)/about/page.tsx`
- [X] T025 [P] [US1] Services page in `app/[locale]/(site)/services/page.tsx`
- [X] T026 [P] [US1] Creative Process page in `app/[locale]/(site)/process/page.tsx`
- [X] T027 [P] [US1] Production page (3 phases + equipment) in `app/[locale]/(site)/production/page.tsx`
- [X] T028 [P] [US1] Brand Experiences & Events page in `app/[locale]/(site)/experiences/page.tsx`
- [X] T029 [P] [US1] Our Tribe page in `app/[locale]/(site)/tribe/page.tsx`
- [X] T030 [US1] Our Work listing (published, ordered) in `app/[locale]/(site)/work/page.tsx`
- [X] T031 [US1] Case study detail (Challenge/Solution/Results, metrics, gallery, external links) + `generateMetadata` in `app/[locale]/(site)/work/[slug]/page.tsx`
- [X] T032 [P] [US1] Community Achievement page (before/process/after media) in `app/[locale]/(site)/community/page.tsx`
- [X] T033 [P] [US1] Clients + Testimonials page in `app/[locale]/(site)/clients/page.tsx`
- [X] T034 [US1] Contact page + form component, and `POST /api/contact` (store submission, honeypot, rate limit) in `app/[locale]/(site)/contact/page.tsx` and `app/api/contact/route.ts`
- [X] T035 [P] [US1] Per-page SEO/OG metadata, `sitemap.ts`, `robots.ts`
- [X] T036 [US1] Wire ISR/revalidate tags (`work`, `case-study:<slug>`, `branding`, `contact`) for public reads

**Checkpoint**: Public site is complete and demoable as the MVP using seeded content.

---

## Phase 4: User Story 2 - Editor manages case studies and projects (Priority: P2)

**Goal**: Authenticated editors do full bilingual CRUD + reorder + publish for case studies and projects with media.

**Independent Test**: Log in as editor, create a bilingual case study with an uploaded image, publish it (appears on site), unpublish it (disappears).

### Tests for User Story 2

- [~] T037 [P] [US2] Playwright e2e: editor create→publish→appears→reorder→unpublish in `tests/e2e/casestudy-crud.spec.ts`

### Implementation for User Story 2

- [X] T038 [P] [US2] Zod `CaseStudyInput` + `ProjectInput` schemas (publish requires EN+AR) in `lib/validation/case-study.ts` and `lib/validation/project.ts`
- [X] T039 [P] [US2] MediaPicker/upload UI in `components/admin/` and `POST /api/media` route handler in `app/api/media/route.ts`
- [X] T040 [US2] Case study server actions (list/get/create/update/delete/reorder, revalidation) in `lib/actions/case-studies.ts` per contracts/admin-casestudies.md
- [X] T041 [US2] Case studies list + drag-reorder page in `app/admin/(dashboard)/case-studies/page.tsx`
- [X] T042 [US2] Case study create/edit form (bilingual fields, metrics, hero+gallery media, external links, publish validation) in `app/admin/(dashboard)/case-studies/[id]/page.tsx`
- [X] T043 [P] [US2] Project server actions + admin list/form pages (mirror case studies) in `lib/actions/projects.ts` and `app/admin/(dashboard)/projects/`
- [X] T044 [US2] Draft preview path so editors view an item before publishing in `app/admin/(dashboard)/case-studies/[id]/preview/page.tsx`

**Checkpoint**: Editors manage portfolio content end-to-end; changes reflect on the public site.

---

## Phase 5: User Story 3 - Admin controls branding and site settings (Priority: P2)

**Goal**: Admins manage branding, section copy, structured content (services/process/tribe/clients/testimonials), media library, and contact details.

**Independent Test**: Log in as admin, change tagline + a brand color + logo, confirm the public site updates.

### Tests for User Story 3

- [~] T045 [P] [US3] Playwright e2e: admin edits tagline/color/logo → reflected on public site in `tests/e2e/branding.spec.ts`

### Implementation for User Story 3

- [X] T046 [P] [US3] Zod schemas for BrandSettings, ContactDetails, SiteContent, Service, ProcessStep, ProductionPhase/EquipmentItem, TeamMember, Client, Testimonial in `lib/validation/`
- [X] T047 [US3] Branding server actions + ADMIN-only branding page (logos, colors, fonts, taglines) in `lib/actions/branding.ts` and `app/admin/(dashboard)/branding/page.tsx` per contracts/admin-branding-settings.md
- [X] T048 [P] [US3] Site content (About/Production/Community/Why-Content copy) server actions + admin page in `lib/actions/site-content.ts` and `app/admin/(dashboard)/content/page.tsx`
- [X] T049 [P] [US3] CRUD managers for Services, Process steps, Tribe, Clients, Testimonials in `app/admin/(dashboard)/{services,process,tribe,clients,testimonials}/`
- [X] T050 [US3] Contact details editor + submissions inbox in `app/admin/(dashboard)/contact/page.tsx`
- [X] T051 [US3] Media library page (list, upload, delete with in-use guard) in `app/admin/(dashboard)/media/page.tsx` and `DELETE /api/media/[id]`
- [X] T052 [US3] Revalidate `branding`/`contact`/section tags on save across the above actions

**Checkpoint**: Agency can re-skin and re-content the entire public site without code changes.

---

## Phase 6: User Story 4 - Admin manages users and access (Priority: P3)

**Goal**: Admins manage user accounts and roles; editors are blocked from admin-only areas.

**Independent Test**: As admin, create an editor; log in as that editor and confirm branding/users routes are denied while case-study routes work.

### Tests for User Story 4

- [~] T053 [P] [US4] Playwright e2e: editor blocked from `/admin/branding` & `/admin/users`; unauthenticated redirected to login in `tests/e2e/auth-roles.spec.ts`

### Implementation for User Story 4

- [X] T054 [P] [US4] Zod user schemas + user server actions (list/create/updateRole/delete, last-admin guard) in `lib/validation/user.ts` and `lib/actions/users.ts`
- [X] T055 [US4] Users management page (ADMIN only) in `app/admin/(dashboard)/users/page.tsx`
- [X] T056 [US4] Enforce `requireRole('ADMIN')` on all admin-only actions/routes and hide admin-only nav for editors in `app/admin/(dashboard)/layout.tsx`

**Checkpoint**: Multi-user operation with enforced least-privilege access.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Constitution gates and launch readiness.

- [X] T057 [P] Vitest unit tests for Zod schemas (publish gate) and media/i18n/branding helpers in `tests/unit/`
- [~] T058 [P] Accessibility pass (WCAG AA: alt text, keyboard, contrast, semantics) and Lighthouse ≥ 90 verification on home + a case study (Principle II / SC-005)
- [X] T059 [P] Copy default logos to `public/brand/` and seed final/placeholder Arabic translations (Principle I)
- [X] T060 Security hardening: login rate limit, security headers, rich-text sanitization on render (Principle III)
- [X] T061 [P] Update `README.md` and run `quickstart.md` smoke checklist
- [X] T062 Production Docker build verification: `migrate deploy` + `db seed` against compose stack

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Stories (Phase 3–6)**: All depend on Foundational.
  - US1 (P1) is independent and is the MVP.
  - US2 (P2) is independent of US1 (uses the same foundation/auth shell).
  - US3 (P2) depends on the admin shell + media upload introduced in US2 (media library/picker reuse); sequence US2 → US3.
  - US4 (P3) depends on the admin shell (Foundational) and finalizes role gating; sequence after US2.
- **Polish (Phase 7)**: Depends on the targeted user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Foundational only. No dependency on other stories.
- **US2 (P2)**: Foundational only. Introduces media upload (`/api/media`, MediaPicker).
- **US3 (P2)**: Foundational + reuses US2's media upload/picker. Branding read path already wired in Foundational (T012).
- **US4 (P3)**: Foundational. Hardens role gating established in the admin shell.

### Within Each User Story

- Tests written first and expected to fail before implementation (Principle V).
- Schemas/models before server actions; server actions before admin pages; components before pages that use them.
- Story complete and independently testable before moving to the next priority.

### Parallel Opportunities

- All `[P]` Setup tasks (T002–T008) run in parallel after T001.
- Foundational `[P]` tasks (T011–T014, T019) run in parallel after the schema/migration (T009–T010).
- Within US1, all `[P]` static section pages (T024–T029, T032, T033, T035) run in parallel after components (T021–T022).
- Across teams: once Foundational is done, US1 and US2 can be built in parallel by different developers; US3 follows US2.

---

## Parallel Example: User Story 1

```bash
# After T021–T022 (shared components) are done, build static section pages in parallel:
Task: "About page in app/[locale]/(site)/about/page.tsx"          # T024
Task: "Services page in app/[locale]/(site)/services/page.tsx"     # T025
Task: "Creative Process page in app/[locale]/(site)/process/page.tsx" # T026
Task: "Production page in app/[locale]/(site)/production/page.tsx"  # T027
Task: "Brand Experiences page in app/[locale]/(site)/experiences/page.tsx" # T028
Task: "Our Tribe page in app/[locale]/(site)/tribe/page.tsx"        # T029
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 (Setup) + Phase 2 (Foundational).
2. Complete Phase 3 (US1) → public bilingual site on seeded content.
3. **STOP and VALIDATE**: run the visitor-journey e2e in EN + AR; deploy/demo the MVP.

### Incremental Delivery

1. Foundation ready → US1 (MVP, public site) → demo.
2. US2 (editor CRUD) → demo self-service content.
3. US3 (branding/settings) → demo full no-code control.
4. US4 (users/roles) → enable multi-user operation.
5. Polish (Phase 7) → accessibility/perf gates + production Docker verification before launch.

### Constitution gates (must pass before launch)

- Bilingual parity enforced on publish (T038/T046 schemas).
- Lighthouse Perf + A11y ≥ 90 (T058).
- Server-side role enforcement verified (T053/T056).
- Critical-path e2e green (T020, T037, T045, T053).

---

## Notes

- Total tasks: **62** (Setup 8, Foundational 11, US1 17, US2 8, US3 8, US4 4, Polish 6).
- `[P]` = different files, no incomplete-task dependency.
- `[US#]` labels map tasks to spec.md user stories for traceability.
- Commit after each task or logical group; the optional `before_implement` git hook can auto-commit.
- Each user story is an independently demoable increment.
