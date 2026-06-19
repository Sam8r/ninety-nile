import "server-only";
import Link from "next/link";
import { getBrandTokens } from "@/lib/branding";
import { ui } from "@/lib/content/ui";
import { prisma } from "@/lib/db";

export async function SiteFooter() {
  const brand = await getBrandTokens();

  const contact = await prisma.contactDetails.findUnique({
    where: { id: "singleton" },
  });

  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-black bg-black text-white">
      <div className="container-wide grid gap-8 py-16 md:grid-cols-3">
        <div className="space-y-2">
          <p className="font-heading text-2xl font-bold">{brand.siteNameEn}</p>
          <p className="text-sm text-white/70">{brand.taglineEn}</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <span className="font-heading font-semibold uppercase tracking-wide">Explore</span>
          <Link href="/work" className="text-white/70 hover:text-white">
            {ui.nav.work}
          </Link>
          <Link href="/about" className="text-white/70 hover:text-white">
            {ui.nav.about}
          </Link>
          <Link href="/services" className="text-white/70 hover:text-white">
            {ui.nav.services}
          </Link>
          <Link href="/contact" className="text-white/70 hover:text-white">
            {ui.nav.contact}
          </Link>
        </nav>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-heading font-semibold uppercase tracking-wide">Contact</span>
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className="text-white/70 hover:text-white">
              {contact.email}
            </a>
          )}
          {contact?.phone && (
            <a href={`tel:${contact.phone}`} className="text-white/70 hover:text-white">
              {contact.phone}
            </a>
          )}
          {contact?.instagram && (
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white"
            >
              {ui.contact.instagram}
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-wide flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <p>
            &copy; {year} {brand.siteNameEn}. {ui.footer.rights}
          </p>
          <p>{ui.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
