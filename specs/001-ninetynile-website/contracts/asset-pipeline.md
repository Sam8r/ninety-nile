# Contract: Asset Pipeline (PDF imagery + logos + AI augmentation)

Defines how source imagery becomes optimized, web-ready assets for the redesign.

## Inputs

- `NinetyNile Profile for website TO SAMER copy.pdf` (45 pages, ~136 MB) at repo root — source of brand photography and graphics.
- `public/brand/` — existing logos: `NN_Logos-01.PNG`, `NN_Logos-03.png`, `NN_Logos-04.png`, `NN_Logos-06.png`, `Picture7-1.png`.

## Extraction

1. **Primary**: `pdfimages -all "<pdf>" public/media/from-pdf/nn` (poppler) — extracts embedded raster images at source resolution.
2. **Fallback** (if embedded images are fragmented/CMYK/unsuitable): render pages with ghostscript/ImageMagick at ≥ 200 DPI and crop the desired graphic:
   `magick -density 200 "<pdf>[<page>]" page-<n>.png`.

## Curation & optimization

- Discard duplicates, decorative fragments, and low-resolution noise; keep hero-grade photography, case-study imagery, team photos, client logos, and reusable Bauhaus-friendly graphics.
- Optimize through `sharp` / `next/image` to AVIF + WebP with responsive sizes; record meaningful `alt` text (English).
- Final placement: `public/media/from-pdf/` for static use, and/or registered in the `MediaAsset` table for dashboard reuse. Seed (`prisma/seed.ts`) references the curated paths for case studies, hero, and sections.

## AI augmentation (on-device Higgsfield skills) — gap-fill only

When the PDF lacks a clean asset for a slot (e.g. hero band backdrop, section dividers, geometric Bauhaus motifs):

| Need | Skill | Notes |
|------|-------|-------|
| Bauhaus geometric art, textures, abstract graphics, design/text imagery | `higgsfield-generate` (GPT Image 2) | Prompt for Bauhaus primaries (red/blue/yellow), geometric forms, generous negative space. |
| Hero/banner & lifestyle brand creatives | `higgsfield-product-photoshoot` | `hero_banner` / `lifestyle_scene` modes. |

Out of scope: `higgsfield-soul-id` (face training), `higgsfield-marketplace-cards` (listing cards).

## Outputs

- `public/media/from-pdf/*` — curated, optimized imagery.
- Optional `MediaAsset` rows for dashboard-managed reuse.
- Updated `prisma/seed.ts` wiring real assets into hero, case studies, and section content.

## Acceptance

1. The homepage hero, "Our Work" cards, and at least the About/Tribe/Clients sections render real imagery sourced from the PDF (or on-brand generated fill), not placeholders.
2. All hero/large images are served responsively (AVIF/WebP) with alt text; no oversized raw PDF exports shipped to the browser.
3. Brand logos from `public/brand/` appear in the header/footer per the Bauhaus layout.
