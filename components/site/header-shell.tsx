"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DARK_HERO_ROUTES = ["/about"];

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const overDark = DARK_HERO_ROUTES.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      data-over-dark={overDark}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ease-out",
        scrolled
          ? "border-b border-[var(--color-rule)] bg-[var(--color-paper)] shadow-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-wide flex items-center justify-between py-sm">
        {children}
      </div>
    </header>
  );
}
