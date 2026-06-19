# Feature Specification: NinetyNile Agency Website + Admin Dashboard (English-only · Bauhaus Redesign)

**Feature Branch**: `001-ninetynile-website`
**Created**: 2026-06-18
**Status**: Draft · **Redesign v2** (2026-06-19)
**Input**: Original — "study the NinetyNile Profile for website TO SAMER copy.pdf and create a plan to make a website based on it with all the data in it using next.js and make a backend dashboard to control the data and added projects and study cases and branding of the website". **Redesign directive (v2)** — English-only site; **Bauhaus** visual system (white space, oversized headlines, big text & imagery); an interactive **Three.js flowing-river** element in the lower third of the hero reacting to mouse & touch; imagery scraped from the company-profile PDF plus the repo logos.

## Overview

NinetyNile (formerly elMastaba) is a boutique creative communication consultancy & content creation agency, originally from Khartoum, Sudan, now operating from Port Sudan, Nairobi, and London. The brand essence is *"Creativity, Overflowing."* This feature delivers two connected products:

1. **Public marketing website** presenting the full company profile — story, services, creative process, production capabilities, brand-experience offering, team ("Our Tribe"), case studies ("Our Work"), a notable community achievement, client list, and contact — in **English only**, styled with a **Bauhaus** visual system (generous white space, oversized geometric headlines, big imagery) and anchored by an interactive **Three.js flowing-river** hero.
2. **Admin dashboard** (role-based: admin + editor) to manage all of that content — create/edit/reorder case studies and projects, manage media, and control site branding (logos, Bauhaus colors/typography tokens, taglines, contact details) without code changes.

Source content is the supplied company-profile PDF (45 pages) — its copy is captured in `data-model.md` seed content and its imagery is scraped, curated, and reused across the site; the repo logos in `public/brand/` are the brand marks.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor explores the agency and its work (Priority: P1)

A prospective client or partner lands on the site, reads who NinetyNile is and what they do, and browses the case studies ("Our Work") to evaluate the agency's capabilities, then finds how to get in touch.

**Why this priority**: This is the core purpose of the site — converting visitors into leads. Without the public site presenting the profile content and case studies, there is no product. It is the MVP.

**Independent Test**: Deploy only the public site reading seeded content; verify a visitor can navigate Home → Services → Our Work → a case study detail → Contact in English (no locale prefix), on desktop and mobile.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** a visitor arrives, **Then** they see the Bauhaus brand hero ("Creativity, Overflowing.") with an interactive flowing-river element in its lower third, a summary of the agency, and navigation to all main sections.
2. **Given** the hero river, **When** the visitor moves the mouse or drags a finger over the lower third, **Then** the water visibly ripples/flows toward the contact point; **and** when `prefers-reduced-motion` is set or WebGL is unavailable, a static river image renders and the page stays fully usable.
3. **Given** the "Our Work" listing, **When** the visitor opens a case study (e.g., "Tamam"), **Then** they see its Challenge / Solution / Results narrative, hero media, metrics, and external links (YouTube/Instagram).
4. **Given** the Contact section, **When** the visitor wants to reach out, **Then** email, phone, social handles, and a contact form are available.

---

### User Story 2 - Editor manages case studies and projects (Priority: P2)

An authenticated editor logs into the dashboard and adds a new case study (or edits an existing one): title, client, the Challenge/Solution/Results text (English), metrics, media, external links, and publish state — and reorders how items appear on the public site.

**Why this priority**: The explicit ask is a dashboard to "control the data and add projects and study cases." This makes the site self-maintainable after launch, but the site can launch (P1) with seeded content before this exists.

**Independent Test**: Log in as editor, create a case study with English content and an uploaded image, publish it, and confirm it appears on the public "Our Work" page; unpublish it and confirm it disappears.

**Acceptance Scenarios**:

1. **Given** a logged-in editor, **When** they create a case study with English fields and save as draft, **Then** it persists and is NOT visible on the public site.
2. **Given** a draft case study, **When** the editor sets it to published, **Then** it appears on the public site in the configured order.
3. **Given** existing case studies, **When** the editor reorders them, **Then** the public listing reflects the new order.
4. **Given** a case study form, **When** the editor uploads a hero image and gallery media, **Then** the media is stored and rendered on the detail page.
5. **Given** required English fields, **When** the editor leaves the title empty, **Then** the form blocks publish and shows a validation message.

---

### User Story 3 - Admin controls branding and site settings (Priority: P2)

An admin updates global branding — logo variants, Bauhaus colors/typography tokens, taglines, services list, team members, client list, and contact details — and these changes reflect on the public site.

**Why this priority**: Branding control is explicitly requested and lets the agency evolve presentation without developer involvement. Depends on the dashboard shell (shared with US2).

**Independent Test**: Log in as admin, change the primary tagline and a brand color, upload a new logo, and confirm the public site header/footer update accordingly.

**Acceptance Scenarios**:

1. **Given** an admin in Branding settings, **When** they upload a new logo variant and save, **Then** the public site uses it.
2. **Given** brand settings, **When** the admin edits the tagline, Bauhaus colors, or typography tokens, **Then** the public site reflects them.
3. **Given** the Services / Team / Clients managers, **When** the admin adds or edits an entry, **Then** the corresponding public section updates.

---

### User Story 4 - Admin manages users and access (Priority: P3)

An admin invites/creates editor accounts and manages roles; editors cannot access branding/user settings.

**Why this priority**: Needed for multi-person operation and security, but a single seeded admin can operate the dashboard initially.

**Independent Test**: As admin, create an editor account; log in as that editor and confirm branding/user-management routes are blocked while project/case-study routes are allowed.

**Acceptance Scenarios**:

1. **Given** an admin, **When** they create an editor account, **Then** the editor can log in and manage projects/case studies only.
2. **Given** an editor, **When** they attempt to open branding or user-management pages, **Then** access is denied.
3. **Given** any dashboard route, **When** an unauthenticated user requests it, **Then** they are redirected to login.

---

### Edge Cases

- A case study missing a required English field: system MUST block publish; drafts may be incomplete.
- Large media uploads / unsupported file types: system MUST validate type and size and show clear errors.
- External video links that are removed/broken upstream: public page MUST still render the case study text without breaking layout.
- Concurrent edits by two editors to the same item: last-write-wins with an updated-at timestamp shown (no hard locking in v1).
- Visitor on a device with reduced-motion enabled or no WebGL: the hero river MUST degrade to a static image and the page MUST remain fully usable.
- Empty sections (e.g., no published case studies yet): public page MUST show a tasteful empty state, not a broken grid.

## Requirements *(mandatory)*

### Functional Requirements — Public Website

- **FR-001**: System MUST present a Home page with brand hero, tagline ("Creativity, Overflowing."), and intro to the agency.
- **FR-002**: System MUST present an About/Story section covering origin (Khartoum), current operations (Port Sudan / Nairobi / London), the "Cause & Effect" concept, and the core essence ("remain creative, rooted, true").
- **FR-003**: System MUST present a Services section listing all offered services (concept & content creation, advertising campaigns, digital media, copywriting EN/AR, graphic design, 2D/motion graphics, filmmaking/videography, photography, audio production, media planning, experiential marketing & events).
- **FR-004**: System MUST present the Creative Process (Communication Brief → Brief Analysis & Research → Client Debrief → Brainstorming → Project Timeline → Creative Brief → Creative Concept Development → Client Presentation → Concept Finalisation → Concept Execution & Implementation).
- **FR-005**: System MUST present a Production section (production sizes, equipment list, and the three phases: Pre-Production / Production / Post-Production).
- **FR-006**: System MUST present a Brand Experiences & Events section.
- **FR-007**: System MUST present an "Our Tribe" (team/about-people) section.
- **FR-008**: System MUST present an "Our Work" listing of case studies and open a detail page per case study with Challenge / Solution / Results, metrics, media, and external links.
- **FR-009**: System MUST seed and display the v1 case studies: Sixty Light Seconds, Cradle the Earth (UNDP), What's the Sauce? (Bono), Tamam (UNICEF), Hodana (UNICEF), Makhtoum (UNICEF), Ayaam (Soulja/SVNBRDS), Digitech/LG Vivace, Salimmik (YouTube).
- **FR-010**: System MUST present a "Notable Community Achievement" story (Al Qiyadah Nights / #elQiyadaNights) with before/process/after media.
- **FR-011**: System MUST present an Animation/Motion Graphics showcase and Annex content (notable clients, other relevant work, references/testimonials from UNICEF & UNDP).
- **FR-012**: System MUST present a Contact section with email (safa@ninetynile.com), phone (+44 7956925540), website (ninetynile.com), social handle (@19NinetyNile), and a contact form.
- **FR-013**: Public site MUST be **English-only** — served as `lang="en"`, with no locale-segment routing, no language switcher, and no right-to-left layout. (Note: "copywriting EN/AR" in FR-003 is a *service the agency offers clients*, not a site-localization requirement.)
- **FR-014**: Public site MUST be responsive (mobile, tablet, desktop) and meet baseline accessibility (semantic structure, alt text, keyboard navigation, sufficient contrast).
- **FR-015**: Public site MUST expose per-page SEO metadata (title, description, Open Graph) and only render published content.
- **FR-016**: Contact form submissions MUST be stored and/or emailed to the agency, with spam protection.
- **FR-017**: Public site MUST present a **Bauhaus** visual system — generous white space, oversized geometric headlines, large imagery, and the Bauhaus primary accents — with all brand color/typography values driven by data tokens (no hard-coded brand values in components).
- **FR-018**: The Home hero MUST include an interactive **flowing-river** element occupying its lower third, animated continuously and reacting to **mouse and touch** at the contact point. It MUST be progressively enhanced: a static fallback renders under `prefers-reduced-motion` or when WebGL is unavailable, it MUST NOT cause layout shift, and it MUST NOT block the hero's headline/CTA.
- **FR-019**: Public imagery MUST be sourced from the company-profile PDF (scraped, curated, optimized) and the repo brand logos, served responsively (AVIF/WebP) with alt text.

### Functional Requirements — Admin Dashboard

- **FR-020**: System MUST provide authenticated login for dashboard users; unauthenticated access MUST redirect to login.
- **FR-021**: System MUST support two roles — **admin** (full access incl. branding & users) and **editor** (projects & case studies only) — and enforce role-based access on every protected route and action.
- **FR-022**: Editors/admins MUST be able to create, read, update, delete, and reorder **case studies** with English fields (title, client, summary, Challenge, Solution, Results), metrics, tags/category, hero media, gallery, external links, and publish state (draft/published).
- **FR-023**: Editors/admins MUST be able to manage **projects** (a lighter portfolio item type) with English fields, media, links, and publish state.
- **FR-024**: Admins MUST be able to manage **branding**: logo variants, Bauhaus color tokens, fonts/typography tokens, taglines, and the site name/identity (English).
- **FR-025**: Admins MUST be able to manage **site content blocks** backing the public sections: Services, Creative Process steps, Production equipment/phases, Team ("Our Tribe") members, Clients list, About/Story copy, and Contact details.
- **FR-026**: System MUST provide a **media library**: upload images/video posters, validate type/size, store files, and reuse media across items.
- **FR-027**: Admins MUST be able to create/manage **user accounts** and assign roles.
- **FR-028**: All content edits MUST capture timestamps (created/updated) and the acting user; required-field validation MUST block publish when a required English field is missing.
- **FR-029**: Dashboard MUST provide a content preview path so editors can see an item before publishing.

### Key Entities

> Note: existing Arabic (`*Ar`) columns are retained as **deprecated/nullable** for now (non-destructive); they are not rendered or required. Entities below describe the active English-only fields.

- **User**: dashboard account — email, hashed password, role (admin|editor), name, timestamps.
- **CaseStudy**: portfolio case — title/client/summary/challenge/solution/results (English), slug, category/tags, metrics (e.g., views/reach), order, publish state, hero media, gallery media, external links, timestamps, author.
- **Project**: lighter portfolio item — title/description (English), slug, media, links, order, publish state, timestamps.
- **MediaAsset**: uploaded file — path/URL, type, dimensions/size, alt text (English), timestamps.
- **Service**: name/description (English), icon, order.
- **ProcessStep**: label/description (English), order (Creative Process).
- **TeamMember** ("Tribe"): name/role/bio (English), photo, order.
- **Client**: name, logo, optional link, order (Annex notable clients).
- **Testimonial/Reference**: quote, author, role/org (English) (UNICEF, UNDP references).
- **BrandSettings** (singleton): logo variants, Bauhaus color tokens, typography tokens, tagline (English), site identity.
- **SiteContent / Section copy**: English rich text for About/Story, Production, Brand-Experience, Community-Achievement narratives.
- **ContactDetails** (singleton): email, phone, website, social handles, address(es).
- **ContactSubmission**: name, email, message, timestamp, spam/status flag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can go from homepage to any case study detail in ≤ 2 clicks.
- **SC-002**: 100% of the company-profile PDF's sections and all 9 named case studies are represented on the public site at launch.
- **SC-003**: An editor can create and publish a new case study (with media) end-to-end in under 10 minutes without developer help.
- **SC-004**: An admin can change a brand element (logo/tagline/Bauhaus color or typography token) and see it live on the public site in under 5 minutes.
- **SC-005**: Public pages achieve Lighthouse Performance and Accessibility scores ≥ 90 on a typical connection, **with the interactive hero active** on the homepage.
- **SC-006**: Role enforcement verified: editors cannot reach branding/user-management routes in 100% of attempts.
- **SC-007**: The hero river degrades gracefully — under `prefers-reduced-motion` or with WebGL unavailable, a static river renders and all main pages stay fully usable on mobile and desktop.

## Assumptions

- Source of truth for content is the supplied company-profile PDF; English copy comes directly from it. The site is **English-only** — no Arabic translation is maintained (legacy `*Ar` DB columns are deprecated/nullable and may be dropped by a later non-destructive migration).
- Imagery is **scraped from the company-profile PDF** (curated/optimized into `public/media/`) plus the repo brand logos (`public/brand/NN_Logos-*`, `Picture7-1.png`); final high-res media/video posters may still be supplied by the agency. On-device asset-generation skills (Higgsfield) may fill gaps with on-brand Bauhaus graphics.
- The hero river is implemented with Three.js (`@react-three/fiber`), dynamically imported and progressively enhanced.
- Case studies primarily embed/link to externally hosted video (YouTube/Instagram/TikTok) rather than self-hosting video.
- Deployment target is self-hosted (Docker/VPS) with a local PostgreSQL database and local media storage volume.
- A single admin account is seeded at setup; additional users are created via the dashboard.
- "Projects" and "Case Studies" are distinct content types (case studies carry the full Challenge/Solution/Results narrative; projects are lighter portfolio entries).
- Governance is the ratified **Constitution v2.0.0** (English-only; Bauhaus + progressive-enhancement principles); this spec aligns with it.
