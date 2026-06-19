import { prisma } from "@/lib/db";
import { text } from "@/lib/content/text";
import { sanitizeRichText } from "@/lib/validation";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("about");

export default async function AboutPage() {
  const [story, causeEffect, whyContent] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "ABOUT_STORY" } }),
    prisma.siteContent.findUnique({ where: { key: "CAUSE_EFFECT" } }),
    prisma.siteContent.findUnique({ where: { key: "WHY_CONTENT" } }),
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader title={text(story?.titleEn, "About")} />

      <section className="container-prose py-16">
        <div
          className="prose-richtext"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(text(story?.bodyEn)) }}
        />
      </section>

      {causeEffect && (
        <section className="border-y-2 border-black bg-secondary/20 py-16">
          <div className="container-prose">
            <h2 className="mb-6 font-heading text-2xl font-bold md:text-3xl">
              {text(causeEffect.titleEn)}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {text(causeEffect.bodyEn)}
            </p>
          </div>
        </section>
      )}

      {whyContent && (
        <section className="container-prose py-16">
          <h2 className="mb-6 font-heading text-2xl font-bold md:text-3xl">
            {text(whyContent.titleEn)}
          </h2>
          <div
            className="prose-richtext"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(text(whyContent.bodyEn)) }}
          />
        </section>
      )}
    </div>
  );
}
