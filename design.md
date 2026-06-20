# Design — NinetyNile

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
Editorial

## Macrostructure family
Pick one base macrostructure for marketing pages, one for content pages, one
for app pages. Pages within a family share the family's shape; they vary only
in component archetypes.

- Marketing pages: Marquee Hero (home), Portfolio Grid (work, tribe, clients)
- Content pages: Long Document (about, experiences, community, contact, work detail)
- Process pages: Narrative Workflow (process, production, services)
- App pages: Workbench (admin dashboard — unchanged)

## Theme
Bauhaus Editorial — OKLCH conversion of brand tokens with proper tonal range.

- `--color-paper`    oklch(98% 0.004 250)
- `--color-paper-2`  oklch(95% 0.006 250)
- `--color-rule`     oklch(85% 0.005 250)
- `--color-neutral`  oklch(55% 0.005 250)
- `--color-muted`    oklch(42% 0.005 250)
- `--color-ink`      oklch(18% 0.008 250)
- `--color-ink-2`    oklch(30% 0.006 250)
- `--color-accent`   oklch(56% 0.22 27)
- `--color-accent-2` oklch(55% 0.16 255)
- `--color-yellow`   oklch(85% 0.18 95)
- `--color-focus`    oklch(55% 0.22 27)

## Typography
- Display: Space Grotesk, weight 700, roman
- Body: Inter, weight 400/500
- Display tracking: -0.03em on large sizes, -0.01em on medium
- Type scale anchor: --text-display = clamp(2.75rem, 6vw + 1rem, 5.5rem)

## Spacing
4-point named scale. Values in tokens.css. Pages use named tokens
(var(--space-md)), never raw values.

## Motion
- Easings: cubic-bezier(0.16, 1, 0.3, 1) named --ease-out; cubic-bezier(0.7, 0, 0.84, 0) named --ease-in
- Reveal pattern: fade only, max 300ms, opacity-only
- Reduced-motion fallback: opacity-only, <= 150ms
- River hero retains existing Three.js motion

## Microinteractions stance
- Silent success (no celebratory toasts)
- Hover delay: none (instant colour shift)
- Focus ring: instant, 2px solid --color-focus

## CTA voice
- Primary CTA: accent fill, white text, no border-radius, bold, uppercase tracking
- Secondary CTA: hairline outline, ink text, no border-radius
- Typographic link: ink text, 1px underline, arrow right

## Per-page allowances
- Marketing pages MAY use enrichment (river hero on home, Tier-A imagery on portfolio grids)
- App pages MUST NOT use enrichment — function carries the page
- Content pages: typography only

## What pages MUST share
- The wordmark / logotype (Space Grotesk bold, left-aligned in nav)
- The accent colour and its placement (<= 5% per viewport)
- The display + body fonts (Space Grotesk + Inter)
- The CTA voice (no border-radius, bold, accent fill for primary)
- Section heading rhythm: oversized Space Grotesk heading, no eyebrow labels

## What pages MAY differ on
- Macrostructure within the page-type family
- Hero archetype (Marquee on home, Portfolio Grid opening on work)
- Section count and pacing

## Nav archetype
N6 Newspaper masthead — full-width, wordmark left, inline link row with double-rule below.
Thin date/issue line above in small caps. Reads as broadsheet editorial.

## Footer archetype
Ft5 Statement — one large display sentence dominates the footer.
Wordmark, minimal links, copyright sit beneath in muted small type.

## Exports

### tokens.css
```css
:root {
  --color-paper:      oklch(98% 0.004 250);
  --color-paper-2:    oklch(95% 0.006 250);
  --color-rule:       oklch(85% 0.005 250);
  --color-neutral:    oklch(55% 0.005 250);
  --color-muted:      oklch(42% 0.005 250);
  --color-ink:        oklch(18% 0.008 250);
  --color-ink-2:      oklch(30% 0.006 250);
  --color-accent:     oklch(56% 0.22 27);
  --color-accent-2:   oklch(55% 0.16 255);
  --color-yellow:     oklch(85% 0.18 95);
  --color-focus:      oklch(55% 0.22 27);

  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-body:    "Inter", system-ui, sans-serif;

  --space-3xs: 0.25rem;  --space-2xs: 0.5rem;  --space-xs: 0.75rem;
  --space-sm:  1rem;     --space-md:  1.5rem;  --space-lg: 2rem;
  --space-xl:  3rem;     --space-2xl: 4.5rem;  --space-3xl: 7rem;

  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-md: 1.125rem;
  --text-lg: 1.375rem; --text-xl: 1.75rem;  --text-2xl: 2.25rem;
  --text-3xl: 3rem;    --text-4xl: 3.75rem;
  --text-display: clamp(2.75rem, 6vw + 1rem, 5.5rem);
  --text-display-s: clamp(2rem, 4vw + 0.5rem, 3.5rem);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:  cubic-bezier(0.7, 0, 0.84, 0);
  --dur-short: 220ms;
  --dur-med:   300ms;

  --rule-hair: 1px;
  --rule-thick: 3px;
  --radius-card: 0;
  --radius-pill: 0;
  --radius-input: 0;

  --page-gutter: clamp(1rem, 4vw, 1.5rem);
  --measure: 65ch;
}
```

### Tailwind v4 @theme
(mapped through tailwind.config.ts theme.extend)
