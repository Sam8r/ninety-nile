import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { prisma } from "@/lib/db";
import { getBrandTokens } from "@/lib/branding";
import { CaseStudyCard } from "@/components/site/case-study-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
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

  const loc = locale as Locale;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container-wide flex flex-col items-center gap-6 py-24 text-center md:py-32">
          <h1 className="max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {loc === "ar" ? brand.taglineAr : brand.taglineEn}
          </h1>
          {brand.secondaryTaglineEn && (
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              {loc === "ar" ? brand.secondaryTaglineAr : brand.secondaryTaglineEn}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/work">
              <Button variant="accent" size="lg">
                {t("viewAllWork")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                {t("viewAllWork") ? "Contact" : ""}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured work */}
      {featured.length > 0 && (
        <section className="container-wide py-16 md:py-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">{t("featuredWork")}</h2>
            <Link
              href="/work"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              {t("viewAllWork")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((study) => (
              <CaseStudyCard
                key={study.id}
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
                locale={loc}
              />
            ))}
          </div>
        </section>
      )}

      {/* Services preview */}
      {services.length > 0 && (
        <section className="border-t border-border/60 bg-secondary/20 py-16 md:py-24">
          <div className="container-wide">
            <h2 className="mb-8 font-heading text-2xl font-bold md:text-3xl">{t("whatWeDo")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <h3 className="font-heading text-lg font-semibold">
                    {loc === "ar" ? service.nameAr ?? service.nameEn : service.nameEn}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {loc === "ar"
                      ? service.descriptionAr ?? service.descriptionEn ?? ""
                      : service.descriptionEn ?? ""}
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
