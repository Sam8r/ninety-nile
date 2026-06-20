import "server-only";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter } from "lucide-react";
import { getBrandTokens } from "@/lib/branding";
import { ui } from "@/lib/content/ui";
import { prisma } from "@/lib/db";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
    </svg>
  );
}

export async function SiteFooter() {
  const brand = await getBrandTokens();
  const contact = await prisma.contactDetails.findUnique({
    where: { id: "singleton" },
  });
  const year = new Date().getFullYear();

  const socials = [
    contact?.instagram && { href: contact.instagram, label: "Instagram", icon: Instagram },
    contact?.tiktok && { href: contact.tiktok, label: "TikTok", icon: TikTokIcon },
    contact?.twitter && { href: contact.twitter, label: "Twitter / X", icon: Twitter },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Instagram }[];

  return (
    <footer className="border-t border-[var(--color-rule)] bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div className="container-wide pt-3xl pb-2xl">
        <p className="font-display text-4xl font-bold leading-none tracking-tight md:text-5xl lg:text-6xl">
          {brand.taglineEn}
        </p>
        <p className="mt-md max-w-xl text-base text-[var(--color-paper)]/70">
          {brand.secondaryTaglineEn ?? ""}
        </p>
      </div>
      <div className="border-t border-[var(--color-paper)]/15">
        <div className="container-wide flex flex-col items-start justify-between gap-md py-lg sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-md">
            <div className="flex items-center gap-sm">
              <Image
                src="/brand/ninetynile-white.png"
                alt="NinetyNile"
                width={140}
                height={57}
                className="h-10 w-auto object-contain"
              />
              <span className="text-[var(--color-paper)]/30">|</span>
              <Image
                src="/brand/mastaba-white.png"
                alt="Mastaba"
                width={56}
                height={23}
                className="h-6 w-auto object-contain"
              />
            </div>
            <span className="text-xs text-[var(--color-paper)]/50">
              &copy; {year}. {ui.footer.rights}
            </span>
          </div>
          <div className="flex items-center gap-md">
            <nav className="flex flex-wrap items-center gap-md">
              <Link
                href="/work"
                className="text-sm text-[var(--color-paper)]/70 transition-colors hover:text-[var(--color-paper)]"
              >
                {ui.nav.work}
              </Link>
              <Link
                href="/about"
                className="text-sm text-[var(--color-paper)]/70 transition-colors hover:text-[var(--color-paper)]"
              >
                {ui.nav.about}
              </Link>
              <Link
                href="/contact"
                className="text-sm text-[var(--color-paper)]/70 transition-colors hover:text-[var(--color-paper)]"
              >
                {ui.nav.contact}
              </Link>
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-[var(--color-paper)]/70 transition-colors hover:text-[var(--color-paper)]"
                >
                  {contact.email}
                </a>
              )}
            </nav>
            {socials.length > 0 && (
              <div className="flex items-center gap-2xs">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex size-9 items-center justify-center text-[var(--color-paper)]/70 transition-colors hover:text-[var(--color-paper)]"
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
