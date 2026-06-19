import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/i18n/content";
import { sanitizeRichText } from "@/lib/validation";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const generateMetadata = pageMetadata("production");

export default async function ProductionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [phases, equipment] = await Promise.all([
    prisma.productionPhase.findMany({ orderBy: { order: "asc" } }),
    prisma.equipmentItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader title={loc === "ar" ? "الإنتاج" : "Production"} />

      <section className="container-wide py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {phases.map((phase) => (
            <Card key={phase.id}>
              <CardHeader>
                <CardTitle>{localize(phase.nameEn, phase.nameAr, loc)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose-richtext text-sm"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeRichText(localize(phase.bodyEn, phase.bodyAr, loc)),
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {equipment.length > 0 && (
        <section className="border-t border-border/60 bg-secondary/20 py-16">
          <div className="container-wide">
            <h2 className="mb-6 font-heading text-2xl font-bold">
              {loc === "ar" ? "المعدّات" : "Equipment"}
            </h2>
            <div className="flex flex-wrap gap-3">
              {equipment.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
                >
                  {localize(item.labelEn, item.labelAr, loc)}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
