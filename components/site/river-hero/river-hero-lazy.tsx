"use client";

import dynamic from "next/dynamic";

const RiverHero = dynamic(() =>
  import("@/components/site/river-hero/river-hero").then((m) => m.RiverHero),
  { ssr: false, loading: () => null },
);

export function RiverHeroLazy(props: React.ComponentProps<typeof RiverHero>) {
  return <RiverHero {...props} />;
}
