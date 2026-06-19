import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("clients");

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [clients, testimonials] = await Promise.all([
    prisma.client.findMany({ orderBy: { order: "asc" }, include: { logo: true } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader title={loc === "ar" ? "عملاؤنا" : "Clients & Testimonials"} />

      {testimonials.length > 0 && (
        <section className="border-b border-border/60 bg-secondary/20 py-16">
          <div className="container-wide">
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure
                  key={t.id}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <blockquote className="text-lg italic leading-relaxed text-foreground">
                    &ldquo;{localize(t.quoteEn, t.quoteAr, loc)}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4">
                    <p className="font-semibold">{t.authorName}</p>
                    {t.authorRoleEn && (
                      <p className="text-sm text-muted-foreground">
                        {localize(t.authorRoleEn, t.authorRoleAr, loc)}
                        {t.org ? ` · ${t.org}` : ""}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-wide py-16">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold">
          {loc === "ar" ? "عملاؤنا" : "Our Clients"}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-center rounded-lg border border-border bg-card p-6 text-center"
            >
              {client.logo ? (
                <img
                  src={`/uploads/${client.logo.path}`}
                  alt={client.name}
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <span className="font-heading font-semibold text-muted-foreground">
                  {client.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
