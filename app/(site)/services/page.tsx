import Image from "next/image";
import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = pageMetadata("services");

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="animate-fade-in">
      <section className="relative isolate flex min-h-svh items-end overflow-hidden">
        <Image
          src="/uploads/curated/page-services.jpg"
          alt="Our services"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />
        <div className="container-wide relative pb-3xl pt-[8rem]">
          <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Services
          </h1>
        </div>
      </section>

      <section className="container-wide pt-3xl pb-3xl">
        <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="border-t border-[var(--color-rule)] pt-md transition-colors duration-200 ease-out hover:border-[var(--color-accent)]"
            >
              {service.icon && (
                <span className="mb-2xs inline-block text-2xl">{service.icon}</span>
              )}
              <h2 className="font-display text-lg font-bold">{service.nameEn}</h2>
              <p className="mt-2xs text-sm leading-relaxed text-[var(--color-muted)]">
                {service.descriptionEn ?? ""}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
