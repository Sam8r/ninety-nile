import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("process");

export default async function ProcessPage() {
  const steps = await prisma.processStep.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Creative Process" />
      <section className="container-wide py-16">
        <ol className="relative space-y-8 border-s-2 border-black ps-8">
          {steps.map((step, i) => (
            <li key={step.id} className="relative">
              <span className="absolute -start-[2.1rem] flex size-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                {i + 1}
              </span>
              <h2 className="font-heading text-lg font-bold">{step.labelEn}</h2>
              {step.descriptionEn && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.descriptionEn}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
