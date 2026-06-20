"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function HeroLoader() {
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const onReady = () => setReady(true);
    window.addEventListener("hero-ready", onReady);
    const safety = window.setTimeout(onReady, 9000);
    return () => {
      window.removeEventListener("hero-ready", onReady);
      window.clearTimeout(safety);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setGone(true), 750);
    return () => window.clearTimeout(t);
  }, [ready]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-paper)] transition-opacity duration-700 ease-out",
        ready ? "opacity-0" : "opacity-100",
      )}
    >
      <div className="flex animate-pulse items-center gap-sm motion-reduce:animate-none">
        <Image
          src="/brand/ninetynile-black.png"
          alt=""
          width={140}
          height={57}
          className="h-12 w-auto object-contain"
        />
        <span className="text-[var(--color-muted)]/40">|</span>
        <Image
          src="/brand/mastaba-black.png"
          alt=""
          width={56}
          height={23}
          className="h-6 w-auto object-contain"
        />
      </div>
    </div>
  );
}
