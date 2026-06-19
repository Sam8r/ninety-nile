import "server-only";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getBrandTokens } from "@/lib/branding";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { SiteNav } from "@/components/site/site-nav";

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const brand = await getBrandTokens();

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/process", label: t("process") },
    { href: "/production", label: t("production") },
    { href: "/work", label: t("work") },
    { href: "/tribe", label: t("tribe") },
    { href: "/clients", label: t("clients") },
    { href: "/community", label: t("community") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight"
        >
          {brand.siteNameEn}
        </Link>

        <SiteNav items={navItems} />

        <LanguageSwitcher />
      </div>
    </header>
  );
}
