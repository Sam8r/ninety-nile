import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("services");

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Services" />
      <section className="container-wide py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="border-2 border-black bg-card p-6 transition-shadow hover:shadow-[6px_6px_0_0_#000]"
            >
              {service.icon && (
                <span className="mb-3 inline-block text-2xl">{service.icon}</span>
              )}
              <h2 className="font-heading text-lg font-bold">{service.nameEn}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.descriptionEn ?? ""}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
