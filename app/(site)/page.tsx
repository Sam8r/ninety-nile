import Link from "next/link";
import { prisma } from "@/lib/db";
import { getBrandTokens } from "@/lib/branding";
import { ui } from "@/lib/content/ui";
import { CaseStudyCard } from "@/components/site/case-study-card";
import { RiverHeroLazy } from "@/components/site/river-hero/river-hero-lazy";
import { Button } from "@/components/ui/button";
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
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-black bg-white">
        <div className="container-wide flex flex-col items-start gap-6 pt-24 md:pt-32">
          <h1 className="max-w-4xl font-heading text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
            {brand.taglineEn}
          </h1>
          {brand.secondaryTaglineEn && (
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              {brand.secondaryTaglineEn}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 pb-12">
            <Link href="/work">
              <Button variant="accent" size="lg">
                {ui.home.ctaWork}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                {ui.home.ctaContact}
              </Button>
            </Link>
          </div>
        </div>
        {/* River hero — lower third, dynamic import (no SSR) */}
        <div className="relative h-[33vh] min-h-[200px] w-full">
          <RiverHeroLazy fallbackSrc="/media/curated/hero-river.jpg" />
        </div>
      </section>

      {/* Featured work */}
      {featured.length > 0 && (
        <section className="container-wide py-16 md:py-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">{ui.home.featuredWork}</h2>
            <Link
              href="/work"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              {ui.home.viewAllWork}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>
      )}

      {/* Services preview */}
      {services.length > 0 && (
        <section className="border-y-2 border-black bg-secondary/20 py-16 md:py-24">
          <div className="container-wide">
            <h2 className="mb-8 font-heading text-3xl font-bold md:text-4xl">{ui.home.whatWeDo}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="border-2 border-black bg-card p-6"
                >
                  {service.icon && (
                    <span className="mb-3 inline-block text-2xl">{service.icon}</span>
                  )}
                  <h3 className="font-heading text-lg font-bold">
                    {service.nameEn}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.descriptionEn ?? ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
