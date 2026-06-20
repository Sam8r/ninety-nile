import "server-only";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/content/ui";
import { SiteNav } from "@/components/site/site-nav";
import { HeaderShell } from "@/components/site/header-shell";

function LogoSet({ variant }: { variant: "dark" | "light" }) {
  const nnLogo = variant === "dark" ? "/brand/ninetynile-black.png" : "/brand/ninetynile-white.png";
  const mastabaLogo = variant === "dark" ? "/brand/mastaba-black.png" : "/brand/mastaba-white.png";
  const sepColor = variant === "dark" ? "text-[var(--color-muted)]/40" : "text-white/40";
  return (
    <span className={variant === "dark" ? "logo-set-dark flex items-center gap-sm" : "logo-set-light hidden items-center gap-sm"}>
      <Image src={nnLogo} alt="NinetyNile" width={160} height={65} className="h-11 w-auto object-contain" priority />
      <span className={cn("text-lg", sepColor)}>|</span>
      <Image src={mastabaLogo} alt="Mastaba" width={64} height={27} className="h-7 w-auto object-contain" priority />
    </span>
  );
}

export async function SiteHeader() {
  return (
    <HeaderShell>
      <Link href="/" className="relative flex items-center gap-sm" aria-label="NinetyNile — Mastaba home">
        <LogoSet variant="dark" />
        <LogoSet variant="light" />
      </Link>
      <SiteNav items={navItems} />
    </HeaderShell>
  );
}
