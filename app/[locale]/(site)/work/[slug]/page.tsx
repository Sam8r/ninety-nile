import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/i18n/content";
import { sanitizeRichText } from "@/lib/validation";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import { MediaFigure } from "@/components/site/media-figure";
import { ExternalVideoEmbed } from "@/components/site/external-video-embed";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

type Metric = { labelEn?: string; labelAr?: string; value?: string };

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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  const loc = locale as Locale;
  const title = localize(study.titleEn, study.titleAr, loc);
  const description = localize(study.summaryEn, study.summaryAr, loc);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: study.heroMedia ? [{ url: `/uploads/${study.heroMedia.path}` }] : undefined,
    },
    alternates: { languages: { en: `/en/work/${slug}`, ar: `/ar/work/${slug}` } },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("Work");

  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const title = localize(study.titleEn, study.titleAr, loc);
  const client = localize(study.clientEn, study.clientAr, loc);
  const metrics = (study.metrics as Metric[] | null) ?? [];

  return (
    <article className="animate-fade-in">
      <header className="border-b border-border/60 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container-wide max-w-4xl py-12 md:py-16">
          <Link
            href="/work"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t("backToWork")}
          </Link>
          <Badge variant="accent" className="mb-3 uppercase">
            {study.category.replace(/_/g, " ").toLowerCase()}
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          {client && <p className="mt-3 text-lg font-medium text-accent">{client}</p>}
        </div>
      </header>

      {study.heroMedia && (
        <section className="container-wide max-w-5xl py-8">
          <MediaFigure
            path={study.heroMedia.path}
            altEn={study.heroMedia.altEn}
            altAr={study.heroMedia.altAr}
            locale={loc}
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </section>
      )}

      <div className="container-wide max-w-3xl space-y-12 py-12">
        {study.challengeEn && (
          <section>
            <h2 className="mb-4 font-heading text-xl font-bold">{t("theChallenge")}</h2>
            <div
              className="prose-richtext"
              dangerouslySetInnerHTML={{
                __html: sanitizeRichText(localize(study.challengeEn, study.challengeAr, loc)),
              }}
            />
          </section>
        )}

        {study.solutionEn && (
          <section>
            <h2 className="mb-4 font-heading text-xl font-bold">{t("theSolution")}</h2>
            <div
              className="prose-richtext"
              dangerouslySetInnerHTML={{
                __html: sanitizeRichText(localize(study.solutionEn, study.solutionAr, loc)),
              }}
            />
          </section>
        )}

        {(study.resultsEn || metrics.length > 0) && (
          <section>
            <h2 className="mb-4 font-heading text-xl font-bold">{t("theResults")}</h2>
            {study.resultsEn && (
              <div
                className="prose-richtext"
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichText(localize(study.resultsEn, study.resultsAr, loc)),
                }}
              />
            )}
            {metrics.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {metrics.map((m, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-4 text-center">
                    <dd className="font-heading text-2xl font-bold text-accent">{m.value}</dd>
                    <dt className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {localize(m.labelEn, m.labelAr, loc)}
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
                  altAr={item.media.altAr}
                  locale={loc}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
