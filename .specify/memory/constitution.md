<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0
Bump rationale: MAJOR. Principle I is redefined backward-incompatibly — the
bilingual EN/AR + RTL parity mandate is RETIRED in favor of an English-only
content principle (owner-directed redesign). Principle II is materially expanded
to govern the new WebGL/Three.js hero, and a new Principle VI (Brand-Driven UI &
Progressive Enhancement) is added for the Bauhaus design system. These remove and
redefine prior governance, requiring a MAJOR bump.

Modified principles:
  I. Bilingual Content Parity (EN/AR + RTL)  → I. English-Only Content Integrity
  II. Accessibility & Performance            → II. Accessibility, Performance & Graceful Degradation (expanded)
  III. Security & Least-Privilege Access     → III. Security & Least-Privilege Access (unchanged)
  IV. Type-Safe, Validated Data Flow         → IV. Type-Safe, Validated Data Flow (AR-required rule removed)
  V. Test the Critical Paths                 → V. Test the Critical Paths (re-scoped: drop RTL, add hero fallback)
Added sections:
  - VI. Brand-Driven UI & Progressive Enhancement (Bauhaus tokens + WebGL degradation)
Removed sections:
  - Bilingual/RTL mandate (folded out of Principle I; AR fields deprecated, not required)

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — generic Constitution Check reads this file
     dynamically; no hard-coded bilingual coupling (verified aligned).
  ✅ .specify/templates/spec-template.md — generic; no constitution-coupled fields (verified aligned).
  ✅ .specify/templates/tasks-template.md — generic phases; principle-driven task
     types (a11y, security, tests, perf) still fit (verified aligned).
  ✅ specs/001-ninetynile-website/plan.md — Constitution Check Principle I deviation is
     now RESOLVED by this amendment; re-validate against v2.0.0 at /speckit-tasks time.
  ⚠ specs/001-ninetynile-website/spec.md — still describes a bilingual EN/AR site; update
     during /speckit-tasks or a /speckit-specify pass to reflect English-only redesign.

Follow-up TODOs: Update spec.md (FR-013, bilingual acceptance scenarios, SC-007) to the
English-only redesign. RATIFICATION_DATE unchanged (2026-06-18, original inception).
-->

# NinetyNile Platform Constitution

## Core Principles

### I. English-Only Content Integrity

The public site is **English-only**. There is no locale-segment routing, no language switcher, and
no right-to-left mode; the document is served as `lang="en"`. The release gate for content is
**completeness and accuracy in English** — a published item MUST have all required English fields
present and proofread; drafts MAY be incomplete. Legacy Arabic (`*Ar`) database columns are
**deprecated**: they MUST NOT be rendered on the public site, MUST NOT be required to publish, and
MAY be removed by a later non-destructive migration. Reintroducing a second locale is a
constitutional change requiring an amendment (see Governance).

**Rationale**: The redesign targets a single English-speaking audience; a half-maintained second
locale is worse than none. Concentrating the publish gate on English completeness keeps the bar
meaningful and removes the routing, middleware, and validation complexity that bilingual parity
imposed.

### II. Accessibility, Performance & Graceful Degradation

Public pages MUST meet WCAG 2.1 AA basics (semantic structure, alt text on all meaningful media,
keyboard navigability, sufficient contrast) and MUST achieve Lighthouse Performance and
Accessibility scores ≥ 90 on a representative page set (home + a case study) before launch, **with
the interactive hero active**. Image-heavy content MUST be optimized (AVIF/WebP, responsive sizes)
and lazy-loaded; large video MUST be embedded from external platforms rather than self-hosted.

Interactive/WebGL surfaces (the Three.js river hero) MUST be **progressively enhanced**: heavy
libraries (three.js / R3F) MUST be dynamically imported and excluded from initial route JS; a static
fallback MUST render when `prefers-reduced-motion: reduce` is set or WebGL is unavailable; the render
loop MUST pause when offscreen or the tab is hidden; and the canvas MUST NOT cause layout shift or
block the hero's text and calls-to-action.

**Rationale**: This is a content-and-media showcase; slow or inaccessible pages cost the agency leads
and exclude users. A signature WebGL element is only acceptable if it never degrades the core
experience for users on reduced-motion, no-WebGL, or low-power devices.

### III. Security & Least-Privilege Access

Every dashboard route and every mutating action MUST verify an authenticated session AND the
caller's role. `editor` MUST NOT reach branding, site-settings, or user-management capabilities;
`admin`-only actions MUST enforce `role === ADMIN` server-side (never UI-only hiding). Passwords
MUST be hashed (bcrypt cost ≥ 12); secrets MUST come from environment configuration and never be
committed. Public inputs (contact form) MUST be rate-limited and spam-protected.

**Rationale**: The dashboard controls everything the public sees. A missing server-side role check
or a leaked secret is a direct path to defacement or data loss. Authorization is enforced at the
action layer because that is the only layer an attacker cannot bypass.

### IV. Type-Safe, Validated Data Flow

The codebase MUST be TypeScript in strict mode. The Prisma schema is the single source of truth for
persisted data. Every trust boundary — Server Actions, route handlers, and form submissions — MUST
validate input with a Zod schema before use, and validation schemas SHOULD be shared between the
client form and the server action. No `any` at boundaries; no unvalidated request data reaching the
database. Publish-gate validation enforces required **English** fields (Principle I).

**Rationale**: Records with many optional/required-on-publish fields are error-prone. Strict types
plus boundary validation catch malformed content before it corrupts the public site or the database,
and keep the publish-gate rules enforceable in one place.

### V. Test the Critical Paths

Automated tests MUST cover the highest-risk surfaces before they ship: the visitor journey
(home → work → case-study detail → contact), authentication and role boundaries, the case-study
create/publish/unpublish workflow, and the hero's **graceful-degradation fallback** (reduced-motion /
no-WebGL renders the static river and the page stays usable). These paths MUST have end-to-end
coverage; pure helpers and validation schemas SHOULD have unit tests. Exhaustive coverage of every
screen is NOT required.

**Rationale**: Resources are finite; tests are concentrated where a regression is most damaging
(broken auth, broken publish, a hero that white-screens on unsupported devices). This keeps the
suite meaningful and fast rather than a box-ticking burden.

### VI. Brand-Driven UI & Progressive Enhancement

The visual system is **Bauhaus** — generous white space, oversized geometric headlines, large
imagery, and the Bauhaus primary accents — implemented as design tokens (CSS variables) surfaced
from `BrandSettings`. Hard-coding brand colors, typography, or spacing values in components is
prohibited; the agency MUST be able to retune the look from the dashboard without code changes.
Signature interactive elements MUST enhance, never gate, the experience (see Principle II): the
content and navigation MUST be fully functional with JavaScript-heavy effects disabled.

**Rationale**: Branding is data, not markup — keeping it in tokens lets the look evolve safely and
consistently. Tying the design system to progressive enhancement ensures the Bauhaus polish and the
WebGL hero never come at the cost of reach or maintainability.

## Technology & Architecture Constraints

- **Stack**: Next.js 15 (App Router, React Server Components + Server Actions), TypeScript, Tailwind
  CSS + shadcn/ui. **English-only** — no i18n locale routing or RTL machinery.
- **Interactive hero**: Three.js via `@react-three/fiber` + `@react-three/drei`, dynamically
  imported and isolated in a self-contained client module with fallbacks.
- **Data**: PostgreSQL via Prisma ORM. Custom dashboard (no third-party headless CMS).
- **Auth**: Auth.js (NextAuth v5) credentials provider; roles `admin` and `editor`.
- **Media**: Stored on a local volume behind a `lib/media.ts` abstraction so storage can be swapped
  (e.g., to object storage) without touching callers. Source imagery may be scraped from the
  company-profile PDF and optimized before use; on-device asset-generation skills MAY augment it.
- **Deployment**: Self-hosted via Docker Compose (Next.js standalone + Postgres + media volume)
  behind a TLS-terminating reverse proxy.
- **Single deployable**: Public site and dashboard live in one Next.js app; introducing a separate
  service or a CMS dependency is a constitutional change requiring justification (see Governance).
- **Brand-driven theming**: Brand colors/typography are data (`BrandSettings`) surfaced as CSS
  variables; hard-coding brand values in components is prohibited.

## Development Workflow & Quality Gates

- **Spec Kit flow**: Features follow specify → plan → tasks → implement. The Constitution Check in
  `plan.md` MUST be re-validated against this document before implementation begins.
- **Publish gate**: Content cannot move to `PUBLISHED` unless required **English** fields are present
  (Principle I) and validation passes (Principle IV).
- **Pre-merge gate**: Lint, type-check, and the critical-path tests (Principle V) MUST pass.
  Accessibility/performance budgets and hero degradation (Principle II) MUST be verified before a
  public launch.
- **Reviews**: Changes touching auth, roles, or data validation MUST be reviewed with Principles III
  and IV explicitly in mind; changes to the design tokens or the hero with Principles II and VI.
- **Secrets & config**: All environment-specific values come from `.env`; `.env.example` MUST stay
  current. No secrets in the repository or in client bundles.

## Governance

This constitution supersedes ad-hoc practice for the NinetyNile platform. Amendments MUST be made by
editing this file, accompanied by an updated Sync Impact Report and a version bump per the policy
below; dependent templates and the active plan's Constitution Check MUST be re-validated in the same
change.

**Versioning policy** (semantic):
- **MAJOR**: Removal or backward-incompatible redefinition of a principle or governance rule.
- **MINOR**: A new principle/section, or materially expanded mandatory guidance.
- **PATCH**: Clarifications, wording, or non-semantic refinements.

**Compliance review**: Plans, code reviews, and pre-merge checks MUST verify compliance with these
principles. Any deviation MUST be documented and justified in the plan's Complexity Tracking section
with the simpler alternative that was rejected and why. Unjustified violations block the gate.

**Version**: 2.0.0 | **Ratified**: 2026-06-18 | **Last Amended**: 2026-06-19
