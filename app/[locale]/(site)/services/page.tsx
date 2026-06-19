import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("services");

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="animate-fade-in">
      <PageHeader title={loc === "ar" ? "خدماتنا" : "Services"} />
      <section className="container-wide py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              {service.icon && (
                <span className="mb-3 inline-block text-2xl">{service.icon}</span>
              )}
              <h2 className="font-heading text-lg font-semibold">
                {localize(service.nameEn, service.nameAr, loc)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {localize(service.descriptionEn, service.descriptionAr, loc)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
