import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { localizeArr } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";

export const generateMetadata = pageMetadata("contact");

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("Contact");

  const contact = await prisma.contactDetails.findUnique({
    where: { id: "singleton" },
  });
  const addresses = localizeArr(
    contact?.addressesEn as string[] | null,
    contact?.addressesAr as string[] | null,
    loc,
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="container-wide grid gap-12 py-16 md:grid-cols-2">
        <div>
          <ContactForm locale={locale} />
        </div>

        <div className="space-y-6">
          {contact?.email && (
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("email")}
              </h3>
              <a href={`mailto:${contact.email}`} className="text-lg hover:underline">
                {contact.email}
              </a>
            </div>
          )}
          {contact?.phone && (
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("phone")}
              </h3>
              <a href={`tel:${contact.phone}`} className="text-lg hover:underline">
                {contact.phone}
              </a>
            </div>
          )}
          {(contact?.instagram || contact?.tiktok) && (
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Social
              </h3>
              <div className="flex flex-wrap gap-3">
                {contact?.instagram && (
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {t("instagram")}
                  </a>
                )}
                {contact?.tiktok && (
                  <a
                    href={contact.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {t("tiktok")}
                  </a>
                )}
              </div>
            </div>
          )}
          {addresses.length > 0 && (
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {loc === "ar" ? "العناوين" : "Locations"}
              </h3>
              <ul className="space-y-1">
                {addresses.map((addr, i) => (
                  <li key={i}>{addr}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
