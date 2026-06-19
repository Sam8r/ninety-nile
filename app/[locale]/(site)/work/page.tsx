import { setRequestLocale } from "next-intl/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/routing";
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

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const studies = await getPublishedWork();

  return (
    <div className="animate-fade-in">
      <PageHeader title={loc === "ar" ? "أعمالنا" : "Our Work"} />
      <section className="container-wide py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <CaseStudyCard
              key={study.id}
              locale={loc}
              study={{
                titleEn: study.titleEn,
                titleAr: study.titleAr,
                summaryEn: study.summaryEn,
                summaryAr: study.summaryAr,
                clientEn: study.clientEn,
                clientAr: study.clientAr,
                slug: study.slug,
                category: study.category,
                heroMedia: study.heroMedia
                  ? {
                      path: study.heroMedia.path,
                      altEn: study.heroMedia.altEn,
                      altAr: study.heroMedia.altAr,
                    }
                  : null,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
