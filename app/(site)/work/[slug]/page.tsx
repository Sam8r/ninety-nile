import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { sanitizeRichText } from "@/lib/validation";
import { ui } from "@/lib/content/ui";
import { MediaFigure } from "@/components/site/media-figure";
import { GalleryCarousel } from "@/components/site/gallery-carousel";
import { ExternalVideoEmbed } from "@/components/site/external-video-embed";
import { ArrowLeft } from "lucide-react";

type Metric = { labelEn?: string; value?: string };

async function getCaseStudy(slug: string) {
  return unstable_cache(
    async () => {
      const study = await prisma.caseStudy.findUnique({
        where: { slug },
        include: {
          heroMedia: { select: { path: true, altEn: true } },
          galleryItems: {
            orderBy: { order: "asc" },
            include: {
              media: { select: { path: true, altEn: true } },
            },
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
      <header className="border-b border-[var(--color-rule)]">
        <div className="container-wide max-w-4xl pb-2xl pt-[6rem] md:pb-3xl md:pt-[8.5rem]">
          <Link
            href="/work"
            className="mb-lg inline-flex items-center gap-1 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            <ArrowLeft className="size-4" />
            {ui.work.backToWork}
          </Link>
          <p className="mb-xs text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
            {study.category.replace(/_/g, " ").toLowerCase()}
          </p>
          <h1 className="display-text text-display-s">
            {study.titleEn}
          </h1>
          {study.clientEn && (
            <p className="mt-md text-lg font-medium text-[var(--color-accent)]">{study.clientEn}</p>
          )}
        </div>
      </header>

      {study.heroMedia && (
        <section className="container-wide max-w-5xl py-xl">
          <MediaFigure
            path={study.heroMedia.path}
            altEn={study.heroMedia.altEn}
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </section>
      )}

      <div className="container-wide max-w-3xl space-y-2xl py-2xl">
        {study.challengeEn && (
          <section>
            <h2 className="mb-md font-display text-xl font-bold">{ui.work.theChallenge}</h2>
            <div
              className="prose-richtext"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(study.challengeEn) }}
            />
          </section>
        )}

        {study.solutionEn && (
          <section>
            <h2 className="mb-md font-display text-xl font-bold">{ui.work.theSolution}</h2>
            <div
              className="prose-richtext"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(study.solutionEn) }}
            />
          </section>
        )}

        {(study.resultsEn || metrics.length > 0) && (
          <section>
            <h2 className="mb-md font-display text-xl font-bold">{ui.work.theResults}</h2>
            {study.resultsEn && (
              <div
                className="prose-richtext"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(study.resultsEn) }}
              />
            )}
            {metrics.length > 0 && (
              <dl className="mt-xl grid grid-cols-2 gap-md sm:grid-cols-3">
                {metrics.map((m, i) => (
                  <div key={i} className="border-t border-[var(--color-rule)] pt-md">
                    <dd className="font-display text-3xl font-bold text-[var(--color-accent)]">
                      {m.value}
                    </dd>
                    <dt className="mt-2xs text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
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

        {study.galleryItems.length > 0 && (() => {
          type GalleryItem = (typeof study.galleryItems)[number];
          const PHASES = ["before", "process", "after"];
          const groups: { label: string; items: GalleryItem[] }[] = [];
          const fallback: GalleryItem[] = [];

          for (const item of study.galleryItems) {
            const alt = (item.media.altEn ?? "").toLowerCase();
            const phase = PHASES.find((p) => alt.startsWith(p));
            if (phase) {
              let g = groups.find((g) => g.label.toLowerCase() === phase);
              if (!g) {
                g = { label: phase.charAt(0).toUpperCase() + phase.slice(1), items: [] };
                groups.push(g);
              }
              g.items.push(item);
            } else {
              fallback.push(item);
            }
          }

          const hasPhases = groups.length > 0;

          if (hasPhases) {
            const slides = groups.map((g) => ({
              label: g.label,
              images: g.items.map((item) => ({
                id: item.id,
                path: item.media.path,
                altEn: item.media.altEn ?? "",
              })),
            }));
            return (
              <section>
                <h2 className="mb-lg font-display text-xl font-bold">Gallery</h2>
                <GalleryCarousel slides={slides} />
              </section>
            );
          }

          return (
            <section>
              <h2 className="mb-md font-display text-xl font-bold">Gallery</h2>
              <div className="grid gap-md sm:grid-cols-2">
                {(fallback.length > 0 ? fallback : study.galleryItems as GalleryItem[]).map((item) => (
                  <MediaFigure
                    key={item.id}
                    path={item.media.path}
                    altEn={item.media.altEn}
                  />
                ))}
              </div>
            </section>
          );
        })()}
      </div>
    </article>
  );
}
