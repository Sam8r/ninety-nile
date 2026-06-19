import { prisma } from "@/lib/db";
import { sanitizeRichText } from "@/lib/validation";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const generateMetadata = pageMetadata("production");

export default async function ProductionPage() {
  const [phases, equipment] = await Promise.all([
    prisma.productionPhase.findMany({ orderBy: { order: "asc" } }),
    prisma.equipmentItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Production" />

      <section className="container-wide py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {phases.map((phase) => (
            <Card key={phase.id}>
              <CardHeader>
                <CardTitle>{phase.nameEn}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose-richtext text-sm"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeRichText(phase.bodyEn ?? ""),
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {equipment.length > 0 && (
        <section className="border-y-2 border-black bg-secondary/20 py-16">
          <div className="container-wide">
            <h2 className="mb-6 font-heading text-2xl font-bold md:text-3xl">Equipment</h2>
            <div className="flex flex-wrap gap-3">
              {equipment.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full border-2 border-black bg-card px-4 py-2 text-sm font-semibold"
                >
                  {item.labelEn}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
