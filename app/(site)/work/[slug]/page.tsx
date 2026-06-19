import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { sanitizeRichText } from "@/lib/validation";
import { ui } from "@/lib/content/ui";
import { MediaFigure } from "@/components/site/media-figure";
import { ExternalVideoEmbed } from "@/components/site/external-video-embed";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

type Metric = { labelEn?: string; value?: string };

async function getCaseStudy(slug: string) {
  return unstable_cache(
    async () => {
      const study = await prisma.caseStudy.findUnique({
        where: { slug },
        include: {
          heroMedia: true,
          galleryItems: {
            orderBy: { order: "asc" },
            include: { media: true },
          },
        },
      });
      if (!study || study.status !== "PUBLISHED") return null;
      return study;
    },
    [`case-study-${slug}`],
    { tags: ["work", `case-study:${slug}`] },
  )();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.titleEn,
    description: study.summaryEn ?? undefined,
    openGraph: {
      title: study.titleEn,
      description: study.summaryEn ?? undefined,
      type: "article",
      images: study.heroMedia ? [{ url: `/uploads/${study.heroMedia.path}` }] : undefined,
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const metrics = (study.metrics as Metric[] | null) ?? [];

  return (
    <article className="animate-fade-in">
      <header className="border-b-2 border-black bg-secondary/20">
        <div className="container-wide max-w-4xl py-12 md:py-16">
          <Link
            href="/work"
            className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {ui.work.backToWork}
          </Link>
          <Badge variant="accent" className="mb-3 uppercase">
            {study.category.replace(/_/g, " ").toLowerCase()}
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
            {study.titleEn}
          </h1>
          {study.clientEn && (
            <p className="mt-3 text-lg font-semibold text-accent">{study.clientEn}</p>
          )}
        </div>
      </header>

      {study.heroMedia && (
        <section className="container-wide max-w-5xl py-8">
          <MediaFigure
            path={study.heroMedia.path}
            altEn={study.heroMedia.altEn}
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </section>
      )}

      <div className="container-wide max-w-3xl space-y-12 py-12">
        {study.challengeEn && (
          <section>
            <h2 className="mb-4 font-heading text-xl font-bold">{ui.work.theChallenge}</h2>
            <div
              className="prose-richtext"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(study.challengeEn) }}
            />
          </section>
        )}

        {study.solutionEn && (
          <section>
            <h2 className="mb-4 font-heading text-xl font-bold">{ui.work.theSolution}</h2>
            <div
              className="prose-richtext"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(study.solutionEn) }}
            />
          </section>
        )}

        {(study.resultsEn || metrics.length > 0) && (
          <section>
            <h2 className="mb-4 font-heading text-xl font-bold">{ui.work.theResults}</h2>
            {study.resultsEn && (
              <div
                className="prose-richtext"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(study.resultsEn) }}
              />
            )}
            {metrics.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {metrics.map((m, i) => (
                  <div key={i} className="border-2 border-black bg-card p-4 text-center">
                    <dd className="font-heading text-3xl font-bold text-accent">{m.value}</dd>
                    <dt className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {m.labelEn ?? ""}
                    </dt>
                  </div>
                ))}
              </dl>
            )}
          </section>
        )}

        <section>
          <ExternalVideoEmbed links={study.externalLinks as never} />
        </section>

        {study.galleryItems.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-xl font-bold">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {study.galleryItems.map((item) => (
                <MediaFigure
                  key={item.id}
                  path={item.media.path}
                  altEn={item.media.altEn}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
