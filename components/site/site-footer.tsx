import "server-only";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getBrandTokens } from "@/lib/branding";
import { prisma } from "@/lib/db";

export async function SiteFooter() {
  const t = await getTranslations({ namespaces: ["Footer", "Contact", "Nav"] });
  const brand = await getBrandTokens();

  const contact = await prisma.contactDetails.findUnique({
    where: { id: "singleton" },
  });

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="container-wide grid gap-8 py-12 md:grid-cols-3">
        <div className="space-y-2">
          <p className="font-heading text-xl font-bold">{brand.siteNameEn}</p>
          <p className="text-sm text-muted-foreground">{brand.taglineEn}</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <span className="font-medium">{t("Nav.work")}</span>
          <Link href="/work" className="text-muted-foreground hover:text-foreground">
            {t("Nav.work")}
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground">
            {t("Nav.about")}
          </Link>
          <Link href="/services" className="text-muted-foreground hover:text-foreground">
            {t("Nav.services")}
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
            {t("Nav.contact")}
          </Link>
        </nav>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium">{t("Nav.contact")}</span>
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-foreground">
              {contact.email}
            </a>
          )}
          {contact?.phone && (
            <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-foreground">
              {contact.phone}
            </a>
          )}
          {contact?.instagram && (
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              {t("Contact.instagram")}
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-border/60 py-6">
        <div className="container-wide flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {brand.siteNameEn}. {t("Footer.rights")}
          </p>
          <p>{t("Footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
