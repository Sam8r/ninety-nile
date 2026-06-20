"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Header chrome: transparent while at the very top (so it floats over the
 * hero), then a translucent white bar with a hairline rule + blur once the
 * page is scrolled.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ease-out",
        scrolled
          ? "border-b border-[var(--color-rule)] bg-[var(--color-paper)]/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-wide flex items-center justify-between py-sm">
        {children}
      </div>
    </header>
  );
}
