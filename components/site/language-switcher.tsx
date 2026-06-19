"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchTo = currentLocale === "en" ? "ar" : "en";
  const label = switchTo === "ar" ? "العربية" : "English";

  return (
    <Link
      href={pathname ?? "/"}
      locale={switchTo}
      className={cn(
        "rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      aria-label={`Switch to ${label}`}
    >
      {label}
    </Link>
  );
}
