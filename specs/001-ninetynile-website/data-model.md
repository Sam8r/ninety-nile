# Phase 1 Data Model: NinetyNile Website + Dashboard

Bilingual fields use paired columns: `<field>En` / `<field>Ar`. Long-form copy is rich text (stored as sanitized HTML/markdown). `order` controls public display order. Publish state: `DRAFT | PUBLISHED`.

## Entities

### User
| Field | Type | Notes |
|-------|------|-------|
| id | uuid (PK) | |
| email | string, unique | login |
| passwordHash | string | bcrypt |
| name | string | |
| role | enum `ADMIN` \| `EDITOR` | authorization |
| createdAt / updatedAt | datetime | |

Rules: at least one ADMIN must exist (seeded). EDITOR cannot mutate BrandSettings, ContactDetails, or Users.

### CaseStudy
| Field | Type | Notes |
|-------|------|-------|
| id | uuid (PK) | |
| slug | string, unique | URL key |
| titleEn / titleAr | string | required for publish |
| clientEn / clientAr | string | e.g., UNICEF, UNDP |
| summaryEn / summaryAr | text | listing teaser |
| challengeEn / challengeAr | rich text | "THE CHALLENGE" |
| solutionEn / solutionAr | rich text | "THE SOLUTION" |
| resultsEn / resultsAr | rich text | "THE RESULTS" |
| category | enum (FILM, MUSIC_VIDEO, DOCUMENTARY, TVC, ORIGINAL, CAMPAIGN, OTHER) | tag/filter |
| metrics | json | array of `{labelEn,labelAr,value}` e.g. views/reach |
| heroMediaId | FK → MediaAsset | |
| externalLinks | json | array of `{label,url}` (YouTube/IG/TikTok) |
| order | int | |
| status | enum DRAFT/PUBLISHED | |
| authorId | FK → User | |
| createdAt / updatedAt / publishedAt | datetime | |

Relations: `galleryItems` (CaseStudyMedia join → MediaAsset, ordered).

### Project
Lighter portfolio item. `id, slug, titleEn/Ar, descriptionEn/Ar, heroMediaId, externalLinks(json), order, status, createdAt/updatedAt`. Optional `galleryItems`.

### MediaAsset
`id, filename, path/url, mimeType, kind(IMAGE|VIDEO_POSTER), width, height, sizeBytes, altEn, altAr, createdAt`. Referenced by case studies, projects, team, clients, branding.

### Service
`id, nameEn/Ar, descriptionEn/Ar, icon (string key), order`.

### ProcessStep
`id, labelEn/Ar, descriptionEn/Ar, order` — the Creative Process steps.

### ProductionPhase & EquipmentItem
- ProductionPhase: `id, nameEn/Ar (Pre-Production/Production/Post-Production), bodyEn/Ar (rich text), order`.
- EquipmentItem: `id, labelEn/Ar, order`.

### TeamMember (Tribe)
`id, nameEn/Ar, roleEn/Ar, bioEn/Ar, photoId (FK MediaAsset), order, status`.

### Client
`id, name, logoId (FK MediaAsset, nullable), url (nullable), order`.

### Testimonial
`id, quoteEn/Ar, authorName, authorRoleEn/Ar, org, order` — UNICEF/UNDP references.

### BrandSettings (singleton)
`id, siteNameEn/Ar, taglineEn/Ar (primary "Creativity, Overflowing."), secondaryTaglineEn/Ar, logoPrimaryId, logoAltId, logoMarkId (FK MediaAsset), colorPrimary, colorSecondary, colorAccent, colorBg, colorText (hex), fontHeading, fontBody (token), updatedAt`.

### SiteContent (keyed section copy, singleton-per-key)
`id, key (unique: HOME_INTRO, ABOUT_STORY, CAUSE_EFFECT, WHY_CONTENT, BRAND_EXPERIENCE, COMMUNITY_ACHIEVEMENT, TRIBE_INTRO, SHOWREEL_URL), titleEn/Ar, bodyEn/Ar (rich text), mediaId (nullable), updatedAt`.

### ContactDetails (singleton)
`id, email, phone, website, instagram, tiktok, addressesEn/Ar (json list of office locations), updatedAt`.

### ContactSubmission
`id, name, email, message, locale, status (NEW|READ|SPAM), createdAt`.

---

## Relationship summary

- User 1—* CaseStudy/Project (author)
- CaseStudy/Project/TeamMember/Client/BrandSettings/SiteContent *—1 MediaAsset (various)
- CaseStudy *—* MediaAsset via CaseStudyMedia (ordered gallery)

---

## Seed content (extracted from the company-profile PDF)

> English copy below is taken from the profile; Arabic to be supplied by agency (seed with placeholders).

### Brand
- Primary tagline: **"Creativity, Overflowing."**
- Identity: NinetyNile (formerly elMastaba). Handle: **@19NinetyNile** / TikTok `@19ninetynile`. Site: **ninetynile.com**.
- Logos (already in repo): `NN_Logos-01.PNG`, `NN_Logos-03.png`, `NN_Logos-04.png`, `NN_Logos-06.png`, `Picture7-1.png`.
- Showreel: https://drive.google.com/file/d/1bAEFVqsi8_0SiJE4XnH8O0x7MfzuOxfb/view

### About / Story (SiteContent: ABOUT_STORY)
Boutique Creative Communication Consultancy & Content Creation Agency, originally where the two Niles meet — Khartoum, Sudan. 2023: operates from Nairobi (Kenya) & London (UK) due to the war. 2026: as Sudan recovers, operates from Port Sudan, working across states. Core essence: *to remain creative, to remain rooted, to remain true.* "We are 'Creativity, Overflowing.'"

### Cause & Effect (SiteContent: CAUSE_EFFECT)
Curiosity into how minds react to stimuli; ideas tailored to each target — original, relevant, timeless, and Sudanese. Quote: "You are only one post away from your greatest audience."

### Services (Service[])
1. Concept and content creation
2. Advertising campaigns
3. Digital media campaigns
4. Creative copywriting in Arabic and English
5. Graphic design
6. 2D and motion graphics
7. Filmmaking/videography (TVCs, documentaries, social content, short films, music videos, explainer videos)
8. Photography
9. Audio production and music (composing, VOs, sound design, sound engineering, podcast, radio edits)
10. Media planning
11. Experiential marketing and events (incl. exhibitions)

### Creative Process (ProcessStep[])
Communication Brief → Brief Analysis & Research → Client Debrief → Brainstorming → Project Timeline → Creative Brief → Creative Concept Development → Client Presentation → Concept Finalisation → Concept Execution & Implementation.

### Production
- Crew sizes from one-man-crew to 80+. Equipment (EquipmentItem[]): Sony FX30, Canon C50, Canon C70, RED Raven; Sony Alpha (A7IV, A7V); lenses 50mm prime → 70–200 telephoto; Rode & Sennheiser mics; Aputure/Spark/LED (AP120, AP300); DJI Ronin stabilisers, rigs & mounts.
- Phases (ProductionPhase[]): **Pre-Production** (director treatment, timeline, art direction, mood-board, location scouting, casting, shot list, content forms, audio production, PPM) → **Production** (the shoot, after client approval) → **Post-Production** (sound design, colour correction + grading, subtitles & translations, motion graphics, final delivery).

### Brand Experiences & Events (SiteContent: BRAND_EXPERIENCE)
"How a person interacts with your brand is everything." Brand = 'Why you exist' (a promise); Experience = 'What you do' (the proof). In-store experiences, launch events, sponsorships, pop-ups, meetings — memorable, buzz-worthy, PR-able.

### Why Content (SiteContent: WHY_CONTENT)
Content keeps organisations relevant, generates continuous dialogue, attracts and retains audiences as the line between advertising and PR blurs.

### Our Tribe (SiteContent: TRIBE_INTRO)
Creators. Communication Artists. Curators. Punctual Beings. Sudanese creatives; 25+ years combined local & international experience (UK, Germany, Netherlands, Uganda, Kenya, Egypt). Proven track record of globalising Sudanese culture.

### Case Studies (CaseStudy[]) — 9 items
1. **Sixty Light Seconds** (NNL Original) — multi-episode show on IG/TikTok, Ramadan 2023 & 2024; bridges generations via spontaneous dialogue with Sudanese figures. Results: 600,000+ views, 40,000+ interactions. Link: instagram.com/reel/C4YxiVDObqZ.
2. **Cradle the Earth** (UNDP) — renewable-energy short, UNDP Sudan's official COP27 2022 entry; pushed to UNDP global/regional channels, screened at COP27. Results: 20,000+ views, reached 27,000+ accounts. Link: instagram.com/reel/Ck8eUcHoJKO.
3. **What's the Sauce? (Bono)** — quirky TVC for 1st 100% Sudanese chicken stock cube; aired Ramadan 2023 during 'Aghani w Aghani'. Link: TikTok.com/@19ninetynile.
4. **Tamam** (UNICEF) — music video for Int'l Day of the Girl Child simplifying the CRC; 13-yr-old lead. Results: 565,000 views on Facebook, reached 1,512,270 people. Link: youtube.com/watch?v=IRxFuA2QPg0.
5. **Hodana** (UNICEF) — back-to-school post-COVID, inspired by lullaby "Shilel Weanu"; w/ Maha AJ & AbdelMuniem AbuSam; #HodanaChallenge trended in Sudan/Egypt/KSA/UAE. Results: 106,000 views, reached 283,115. Link: youtube.com/watch?v=pnEELjKDgog.
6. **Makhtoum** (UNICEF) — documentary about Youth Advocate Makhtoum Abdalla (IDP camp, Darfur; 275/280 grades). TED invited him to speak; TED has 21.6M subscribers. Links: youtube.com/watch?v=iS4Bx2pmSlg, watch?v=hVRN1rKq2v8.
7. **Ayaam** (Soulja | SVNBRDS) — guerilla-style music video on displacement (post 15 April 2023). Results: 500,000+ views in one month; clips used in VICE Arabia documentary. Links: youtube.com/watch?v=JS6nXa5K2so, watch?v=wAohE6VG6-c.
8. **Digitech / LG Vivace** — TVC for smart washing machine; song inspired by James Brown's 'I Feel Good' & 'ShibSib Shol', 70s/80s nostalgia. Results: 58,000+ views, largest viewership on their socials. Link: youtube.com/watch?v=-7k8HrT9iMk.
9. **Salimmik** (YouTube Creators for Change — Maha AJ) — celebrates Sudan's nature & culture. Results: 4,564,747 views; appeared on MBC. Link: youtube.com/watch?v=JS6nXa5K2so.

### Notable Community Achievement (SiteContent: COMMUNITY_ACHIEVEMENT)
**Al Qiyadah Nights / #elQiyadaNights** (6 April 2019, HQ sit-in). Reclaimed and rehabilitated an open-air dump into Al Qiyadah's most celebrated cultural space during the revolution; event series with figures like Alaa Satir, Galal Yousif, Asil Diab, Mohamed Kordofani, Hajooj Kuka, Yousra El Bagir, Mohammed Mattar. Before / Process / After media.

### Animation/Motion Graphics
Malnutrition Explained; CRC Explained; Eid Greeting (each a "Watch here" link — URLs to be supplied).

### Annex — Notable Clients (Client[])
UNICEF Sudan; YouTube Creators For Change (Maha AJ); YouTube – Fly With Haifa (Sudan); WFP; UN Women; UNDP; FAO; Careem; Omal Bank; East Sudan Reconstruction Fund; Viva Con Agua (Kampala); w/ African Focus → AlJazeera Documentary Channel; SUDIA; CTC Group/LG Sudan; MSU/DAL Trading; ZOA International.

### Annex — Testimonials (Testimonial[])
- **Fatma Naib** — former Chief of Communication & Advocacy, UNICEF Sudan (2018–2022): "...professional, diligent... game changers and unmatched in Sudan..." (fnaib@unicef.org).
- **Lameese Badr** — Head of Communications, UNDP Sudan: "...extremely creative and disciplined... exceeded expectations... I am confident in recommending them..." (lameese.badr@undp.org).

### Contact (ContactDetails)
Email: **safa@ninetynile.com** · Phone: **+44 (0)7956925540** · Website: **ninetynile.com** · Instagram/handle: **@19NinetyNile** · TikTok: **@19ninetynile**.

### Other relevant work / Annex links (store as Project or SiteContent links)
Unicef Kids Speech, ZOA Water Resources, Karmakol International Festival, AlJazeera elTayib Wad Dahawiya soundtrack, "A Love Letter to Sudan" audio, elMastaba photography portfolio, Safa Kazzam portfolio (M&C Saatchi: Virgin Holidays, EE, Footlocker, Reebok, Peroni; The Box: Sudani, Sudapost, UNICEF, Toyota, Babyloo, Shirouq Paints). Full URLs captured in the PDF text extraction.

---

# Redesign Delta (v2) — English-only · Bauhaus

The core schema is largely unchanged. The redesign affects how fields are used and validated, plus brand tokens.

## Bilingual fields → English-only usage
- All `*Ar` columns (`titleAr`, `summaryAr`, `clientAr`, `challengeAr`, `descriptionAr`, `altAr`, taglines, etc.) are **kept but deprecated**: nullable, no longer rendered on the public site, no longer required to publish.
- **Validation change**: publish gate requires only the English (`*En`) fields. Update `lib/validation/*.ts` Zod schemas accordingly.
- **Cleanup (deferred)**: a later migration may drop `*Ar` columns once the English-only site is confirmed in production. Not done in this phase to keep the migration non-destructive.

## BrandSettings — Bauhaus tokens
- Repurpose/extend color + typography tokens for the Bauhaus palette: `primary` (black), `bg` (white), and Bauhaus accents (red/blue/yellow) mapped onto existing `--brand-*` CSS variables.
- Typography tokens point at the chosen geometric display + neutral body faces (loaded via `next/font`).
- Arabic-specific tagline fields become optional/unused.

## MediaAsset — PDF source tagging
- Curated PDF-extracted assets are registered as `MediaAsset` rows (or referenced statically from `public/media/from-pdf/`). `altEn` required; `altAr` optional/unused.

## Seed
- `prisma/seed.ts`: seed English-only content, Bauhaus `BrandSettings` tokens, and wire real PDF-derived media into hero, case studies, and section blocks.
