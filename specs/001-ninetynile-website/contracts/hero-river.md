# Contract: Three.js River Hero (`components/site/river-hero/`)

A self-contained client module that renders an interactive flowing-river WebGL surface in the **lower third** of the homepage hero. Consumed by `app/(site)/page.tsx`.

## Public API

```ts
// components/site/river-hero/river-hero.tsx  ('use client')
export interface RiverHeroProps {
  /** Optional static image shown as the reduced-motion / no-WebGL fallback. */
  fallbackSrc?: string;
  /** Optional flow tint tokens; default reads Bauhaus brand tokens (CSS vars). */
  colors?: { water?: string; highlight?: string };
  /** Height of the canvas band as a fraction of the hero. Default 1/3. */
  bandFraction?: number;
  className?: string;
}
export function RiverHero(props: RiverHeroProps): JSX.Element;
```

- The component is **dynamically imported** by the hero with `next/dynamic({ ssr: false })`; three.js MUST NOT appear in the initial route JS bundle.
- The exported component renders the fallback during load and when WebGL is unavailable — callers never branch on capability themselves.

## Behavior contract

| Concern | Requirement |
|---------|-------------|
| Placement | Canvas occupies only the lower third of the hero (`bandFraction`, default 0.33); hero headline/CTA sit above and remain fully interactive. |
| Animation | Continuous downstream flow (scrolling flow-noise in the water shader). |
| Interaction | Pointer move AND touch move add a ripple/displacement at the contact point in canvas space; multi-touch supported on touch devices. |
| Reduced motion | If `prefers-reduced-motion: reduce`, render `fallbackSrc` (or a still first frame); no animation loop starts. |
| No WebGL | If WebGL2 context creation fails, render `fallbackSrc`; never throw. |
| Offscreen / hidden | Pause the render loop via `IntersectionObserver` and `visibilitychange`; resume on return. |
| Layout stability | Fixed-height container → **zero CLS**; canvas resizes to container, DPR capped (≤ 2). |
| Cleanup | Dispose geometries/materials/renderer and remove listeners on unmount (no GPU leak on route change). |
| Accessibility | Decorative: `aria-hidden` on the canvas; hero meaning conveyed by the text layer; not keyboard-focusable. |

## Performance budget (Constitution II)

- Added three.js bundle on the home route ≤ ~150 KB gz, dynamically imported (excluded from initial JS).
- ≥ 50 fps on mid-tier mobile; Lighthouse home Performance & Accessibility ≥ 90 with the canvas active.

## Acceptance

1. Home renders headline + CTA instantly; the river fades in after hydration.
2. Moving the mouse / dragging a finger over the lower third visibly disturbs the water at that point.
3. With `prefers-reduced-motion` set, a static river image shows and no WebGL loop runs.
4. With WebGL disabled, the page still renders cleanly via the fallback.
5. Navigating away and back does not accumulate GPU memory or duplicate animation loops.
