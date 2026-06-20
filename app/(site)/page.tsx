import Link from "next/link";
import { prisma } from "@/lib/db";
import { getBrandTokens } from "@/lib/branding";
import { ui } from "@/lib/content/ui";
import { CaseStudyCard } from "@/components/site/case-study-card";
import { RiverHeroLazy } from "@/components/site/river-hero/river-hero-lazy";
import { HeroLoader } from "@/components/site/river-hero/hero-loader";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const brand = await getBrandTokens();

  const [featured, services] = await Promise.all([
    prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      take: 6,
      include: { heroMedia: true },
    }),
    prisma.service.findMany({ orderBy: { order: "asc" }, take: 6 }),
  ]);

  return (
    <>
      <HeroLoader />
      <div className="animate-fade-in">
      <section className="relative isolate min-h-svh overflow-hidden">
        {/* Full-height scene: white-cloud sky with the reactive sea in the lower third */}
        <div className="absolute inset-0 -z-20">
          <RiverHeroLazy
            fallbackSrc="/media/curated/hero-river.jpg"
            className="h-full w-full"
          />
        </div>
        {/* Soft scrim over the sky for headline legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3 bg-gradient-to-b from-[var(--color-paper)]/55 via-[var(--color-paper)]/10 to-transparent" />

        <div className="container-wide relative flex min-h-svh flex-col justify-end pb-[32vh] pt-3xl md:pb-[34vh]">
          <h3 className="mb-sm font-display text-lg font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]">
            WE ARE
          </h3>
          <h1 className="display-text max-w-5xl text-balance text-[clamp(3.25rem,9vw+1rem,8.5rem)]">
            {brand.taglineEn}
          </h1>
          {brand.secondaryTaglineEn && (
            <p className="mt-lg max-w-xl text-pretty text-lg leading-relaxed text-[var(--color-ink)]/80 md:text-xl">
              {brand.secondaryTaglineEn}
            </p>
          )}
          <div className="mt-xl flex flex-wrap items-center gap-sm">
            <Link
              href="/work"
              className="inline-flex h-12 items-center gap-2 bg-[var(--color-accent)] px-8 text-base font-semibold text-[var(--color-paper)] transition-opacity duration-200 ease-out hover:opacity-90"
            >
              {ui.home.ctaWork}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center border border-[var(--color-paper)]/50 bg-transparent px-8 text-base font-semibold text-[var(--color-paper)] backdrop-blur-sm transition-colors duration-200 ease-out hover:border-[var(--color-paper)]"
            >
              {ui.home.ctaContact}
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-t border-[var(--color-rule)]">
          <div className="container-wide pt-3xl pb-2xl">
            <div className="mb-xl flex items-baseline justify-between">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                {ui.home.featuredWork}
              </h2>
              <Link
                href="/work"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-ink)] underline underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
              >
                {ui.home.viewAllWork}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-xl sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((study) => (
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
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="border-t border-[var(--color-rule)] bg-[var(--color-paper-2)]">
          <div className="container-wide pt-3xl pb-3xl">
            <h2 className="mb-xl font-display text-3xl font-bold md:text-4xl">
              {ui.home.whatWeDo}
            </h2>
            <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="border-t border-[var(--color-rule)] pt-md"
                >
                  {service.icon && (
                    <span className="mb-2xs inline-block text-2xl">{service.icon}</span>
                  )}
                  <h3 className="font-display text-lg font-bold">
                    {service.nameEn}
                  </h3>
                  <p className="mt-2xs text-sm leading-relaxed text-[var(--color-muted)]">
                    {service.descriptionEn ?? ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      </div>
    </>
  );
}
