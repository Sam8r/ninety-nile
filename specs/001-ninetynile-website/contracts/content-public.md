# Public Content Contract (Server Component reads)

Each public route consumes published-only data for the active `locale` (`en` | `ar`). Rendering selects the `*En`/`*Ar` field by locale; `dir` = `rtl` when locale is `ar`.

| Route | Data consumed |
|-------|---------------|
| `/[locale]` (Home) | BrandSettings, SiteContent[HOME_INTRO], featured CaseStudy[] (status=PUBLISHED, top N by order), Service[] (preview) |
| `/[locale]/about` | SiteContent[ABOUT_STORY, CAUSE_EFFECT, WHY_CONTENT] |
| `/[locale]/services` | Service[] (ordered) |
| `/[locale]/process` | ProcessStep[] (ordered) |
| `/[locale]/production` | ProductionPhase[] (ordered), EquipmentItem[] |
| `/[locale]/experiences` | SiteContent[BRAND_EXPERIENCE] |
| `/[locale]/tribe` | SiteContent[TRIBE_INTRO], TeamMember[] (PUBLISHED, ordered) |
| `/[locale]/work` | CaseStudy[] (PUBLISHED, ordered) — listing cards |
| `/[locale]/work/[slug]` | CaseStudy by slug (PUBLISHED) + gallery + externalLinks + metrics |
| `/[locale]/community` | SiteContent[COMMUNITY_ACHIEVEMENT] + before/process/after media |
| `/[locale]/clients` | Client[] (ordered), Testimonial[] |
| `/[locale]/contact` | ContactDetails |

Rules:
- A request for a non-published or non-existent slug → 404.
- Each route exports `generateMetadata` (localized title/description/OG).
- Listing/detail use ISR; revalidated on publish via tags (`work`, `case-study:<slug>`, `branding`, etc.).
