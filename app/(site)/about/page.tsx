import Image from "next/image";
import { prisma } from "@/lib/db";
import { text } from "@/lib/content/text";
import { sanitizeRichText } from "@/lib/validation";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = pageMetadata("about");

export default async function AboutPage() {
  const [story, causeEffect, whyContent, brandExperience, steps] =
    await Promise.all([
      prisma.siteContent.findUnique({ where: { key: "ABOUT_STORY" }, include: { media: true } }),
      prisma.siteContent.findUnique({ where: { key: "CAUSE_EFFECT" }, include: { media: true } }),
      prisma.siteContent.findUnique({ where: { key: "WHY_CONTENT" }, include: { media: true } }),
      prisma.siteContent.findUnique({ where: { key: "BRAND_EXPERIENCE" }, include: { media: true } }),
      prisma.processStep.findMany({ orderBy: { order: "asc" } }),
    ]);

  return (
    <div className="animate-fade-in">
      {/* Story — full-bleed hero with title overlaid */}
      <section className="relative isolate flex min-h-svh items-end overflow-hidden">
        {story?.media && (
          <Image
            src={`/uploads/${story.media.path}`}
            alt={story.media.altEn ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        <div className="container-wide relative pb-3xl pt-[8rem]">
          <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {text(story?.titleEn, "About")}
          </h1>
        </div>
      </section>

      {story?.bodyEn && (
        <section className="container-prose pt-3xl pb-2xl">
          <div
            className="prose-richtext text-lg"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(text(story.bodyEn)) }}
          />
        </section>
      )}

      {/* Cause & Effect — full-bleed image with text overlaid */}
      {causeEffect && (
        <section className="relative isolate overflow-hidden">
          {causeEffect.media && (
            <Image
              src={`/uploads/${causeEffect.media.path}`}
              alt={causeEffect.media.altEn ?? ""}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/70" />
          <div className="container-prose relative py-3xl">
            <h2 className="mb-lg text-balance font-display text-2xl font-bold text-white md:text-3xl">
              {text(causeEffect.titleEn)}
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-white/85">
              {text(causeEffect.bodyEn)}
            </p>
          </div>
        </section>
      )}

      {whyContent && (
        <section className="container-prose py-3xl">
          <h2 className="mb-lg text-balance font-display text-2xl font-bold md:text-3xl">
            {text(whyContent.titleEn)}
          </h2>
          <div
            className="prose-richtext text-lg"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(text(whyContent.bodyEn)) }}
          />
        </section>
      )}

      {/* Brand Experience — full-bleed image with text overlaid */}
      {brandExperience && (
        <section className="relative isolate overflow-hidden">
          {brandExperience.media && (
            <Image
              src={`/uploads/${brandExperience.media.path}`}
              alt={brandExperience.media.altEn ?? ""}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/75" />
          <div className="container-prose relative py-3xl">
            <h2 className="mb-lg text-balance font-display text-2xl font-bold text-white md:text-3xl">
              {text(brandExperience.titleEn, "Brand Experiences")}
            </h2>
            <div
              className="prose-richtext prose-inverted text-lg"
              dangerouslySetInnerHTML={{
                __html: sanitizeRichText(text(brandExperience.bodyEn)),
              }}
            />
          </div>
        </section>
      )}

      {steps.length > 0 && (
        <section className="border-t border-[var(--color-rule)]">
          <div className="container-wide py-3xl">
            <h2 className="mb-2xl text-balance font-display text-2xl font-bold md:text-3xl">
              Creative Process
            </h2>
            <ol className="space-y-xl">
              {steps.map((step, i) => (
                <li
                  key={step.id}
                  className="grid gap-md border-t border-[var(--color-rule)] pt-lg md:grid-cols-[5rem_1fr]"
                >
                  <p className="font-display text-3xl font-bold tabular-nums text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="font-display text-xl font-bold">{step.labelEn}</h3>
                    {step.descriptionEn && (
                      <p className="mt-2xs text-pretty text-base leading-relaxed text-[var(--color-muted)]">
                        {step.descriptionEn}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </div>
  );
}
