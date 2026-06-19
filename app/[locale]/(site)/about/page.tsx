import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/i18n/content";
import { sanitizeRichText } from "@/lib/validation";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("about");

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [story, causeEffect, whyContent] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "ABOUT_STORY" } }),
    prisma.siteContent.findUnique({ where: { key: "CAUSE_EFFECT" } }),
    prisma.siteContent.findUnique({ where: { key: "WHY_CONTENT" } }),
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader title={localize(story?.titleEn, story?.titleAr, loc)} />

      <section className="container-prose py-16">
        <div
          className="prose-richtext"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(localize(story?.bodyEn, story?.bodyAr, loc)) }}
        />
      </section>

      {causeEffect && (
        <section className="border-y border-border/60 bg-secondary/20 py-16">
          <div className="container-prose">
            <h2 className="mb-6 font-heading text-2xl font-bold">
              {localize(causeEffect.titleEn, causeEffect.titleAr, loc)}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {localize(causeEffect.bodyEn, causeEffect.bodyAr, loc)}
            </p>
          </div>
        </section>
      )}

      {whyContent && (
        <section className="container-prose py-16">
          <h2 className="mb-6 font-heading text-2xl font-bold">
            {localize(whyContent.titleEn, whyContent.titleAr, loc)}
          </h2>
          <div
            className="prose-richtext"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(localize(whyContent.bodyEn, whyContent.bodyAr, loc)) }}
          />
        </section>
      )}
    </div>
  );
}
