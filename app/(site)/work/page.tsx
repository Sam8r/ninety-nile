import Image from "next/image";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { ui } from "@/lib/content/ui";
import { pageMetadata } from "@/lib/page-metadata";
import { CaseStudyCard } from "@/components/site/case-study-card";

export const generateMetadata = pageMetadata("work");

const getPublishedWork = unstable_cache(
  async () =>
    prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: {
        heroMedia: { select: { path: true, altEn: true } },
      },
    }),
  ["work-listing"],
  { tags: ["work"] },
);

export default async function WorkPage() {
  const studies = await getPublishedWork();

  return (
    <div className="animate-fade-in">
      <section className="relative isolate flex min-h-svh items-end overflow-hidden">
        <Image
          src="/uploads/curated/page-work.jpg"
          alt="Our Work"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />
        <div className="container-wide relative pb-3xl pt-[8rem]">
          <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Selected Work
          </h1>
        </div>
      </section>

      <section className="container-wide pt-3xl pb-3xl">
        {studies.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-3xl text-center">
            <h2 className="font-display text-2xl font-bold">{ui.work.emptyTitle}</h2>
            <p className="text-[var(--color-muted)]">{ui.work.emptyBody}</p>
          </div>
        ) : (
          <div className="grid gap-xl sm:grid-cols-2 lg:grid-cols-3">
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
