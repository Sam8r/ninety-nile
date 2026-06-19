"use client";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function SiteNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </Button>

      {open && (
        <div
          className={cn(
            "fixed inset-x-0 top-16 z-40 border-b border-border bg-background p-4 lg:hidden",
          )}
        >
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-secondary"
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
