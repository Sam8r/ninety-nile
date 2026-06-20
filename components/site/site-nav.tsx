"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function SiteNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-lg lg:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[0.8125rem] font-medium uppercase tracking-[0.07em] text-[var(--color-ink)] underline-offset-[6px] decoration-1 transition-opacity duration-200 ease-out hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="flex size-10 items-center justify-center lg:hidden"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div
          className={cn(
            "fixed inset-x-0 top-[3.75rem] z-40 border-b border-[var(--color-rule)] bg-[var(--color-paper)] p-md lg:hidden",
          )}
        >
          <nav className="flex flex-col gap-2xs">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-xs text-base font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
