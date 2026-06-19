import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("process");

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const steps = await prisma.processStep.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="animate-fade-in">
      <PageHeader title={loc === "ar" ? "العملية الإبداعية" : "Creative Process"} />
      <section className="container-wide py-16">
        <ol className="relative space-y-8 border-s-2 border-border ps-8">
          {steps.map((step, i) => (
            <li key={step.id} className="relative">
              <span className="absolute -start-[2.1rem] flex size-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {i + 1}
              </span>
              <h2 className="font-heading text-lg font-semibold">
                {localize(step.labelEn, step.labelAr, loc)}
              </h2>
              {step.descriptionEn && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {localize(step.descriptionEn, step.descriptionAr, loc)}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
