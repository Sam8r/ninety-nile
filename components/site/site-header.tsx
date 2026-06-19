import "server-only";
import Link from "next/link";
import Image from "next/image";
import { getBrandTokens } from "@/lib/branding";
import { navItems } from "@/lib/content/ui";
import { SiteNav } from "@/components/site/site-nav";

export async function SiteHeader() {
  const brand = await getBrandTokens();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white/90 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/logo-mark.png"
            alt={brand.siteNameEn}
            width={32}
            height={32}
            className="size-8 object-contain"
          />
          <span className="font-heading text-lg font-bold tracking-tight">
            {brand.siteNameEn}
          </span>
        </Link>

        <SiteNav items={navItems} />
      </div>
    </header>
  );
}
