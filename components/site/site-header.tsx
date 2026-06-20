import "server-only";
import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/lib/content/ui";
import { SiteNav } from "@/components/site/site-nav";
import { HeaderShell } from "@/components/site/header-shell";

export async function SiteHeader() {
  return (
    <HeaderShell>
      <Link href="/" className="flex items-center gap-sm" aria-label="NinetyNile — Mastaba home">
        <Image
          src="/brand/ninetynile-black.png"
          alt="NinetyNile"
          width={160}
          height={65}
          className="h-11 w-auto object-contain"
          priority
        />
        <span className="text-lg text-[var(--color-muted)]/40">|</span>
        <Image
          src="/brand/mastaba-black.png"
          alt="Mastaba"
          width={64}
          height={27}
          className="h-7 w-auto object-contain"
          priority
        />
      </Link>
      <SiteNav items={navItems} />
    </HeaderShell>
  );
}
