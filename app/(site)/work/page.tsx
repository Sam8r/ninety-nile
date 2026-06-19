import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { ui } from "@/lib/content/ui";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";
import { CaseStudyCard } from "@/components/site/case-study-card";

export const generateMetadata = pageMetadata("work");

const getPublishedWork = unstable_cache(
  async () =>
    prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: { heroMedia: true },
    }),
  ["work-listing"],
  { tags: ["work"] },
);

export default async function WorkPage() {
  const studies = await getPublishedWork();

  return (
    <div className="animate-fade-in">
      <PageHeader title={ui.nav.work} />
      <section className="container-wide py-16">
        {studies.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <h2 className="font-heading text-2xl font-bold">{ui.work.emptyTitle}</h2>
            <p className="text-muted-foreground">{ui.work.emptyBody}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((study) => (
              <CaseStudyCard
                key={study.id}
                study={{
                  titleEn: study.titleEn,
                  summaryEn: study.summaryEn,
                  clientEn: study.clientEn,
                  slug: study.slug,
                  category: study.category,
                  heroMedia: study.heroMedia
                    ? { path: study.heroMedia.path, altEn: study.heroMedia.altEn }
                    : null,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
