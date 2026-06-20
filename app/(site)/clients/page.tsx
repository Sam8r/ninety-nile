import { prisma } from "@/lib/db";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";
import { TestimonialsCarousel } from "@/components/site/testimonials-carousel";

export const generateMetadata = pageMetadata("clients");

export default async function ClientsPage() {
  const [clients, testimonials] = await Promise.all([
    prisma.client.findMany({ orderBy: { order: "asc" }, include: { logo: true } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Clients & Testimonials" />

      {testimonials.length > 0 && (
        <section className="border-b border-[var(--color-rule)] bg-[var(--color-paper-2)]">
          <div className="container-wide py-3xl md:py-3xl">
            <p className="mb-xl text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
              What they say
            </p>
            <TestimonialsCarousel items={testimonials} />
          </div>
        </section>
      )}

      <section className="container-wide pt-3xl pb-3xl">
        <h2 className="mb-xl text-balance font-display text-2xl font-bold md:text-3xl">
          Our Clients
        </h2>
        <ul className="grid grid-cols-2 gap-px border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((client) => {
            const logo = client.logo
              ? { src: `/uploads/${client.logo.path}`, alt: client.name }
              : null;
            return (
              <li
                key={client.id}
                className="flex min-h-[7rem] items-center justify-center bg-[var(--color-paper)] p-lg"
              >
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    title={client.name}
                    className="max-h-12 max-w-[80%] object-contain opacity-70 grayscale transition duration-200 ease-out hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="text-pretty text-center font-display text-sm font-bold text-[var(--color-muted)]">
                    {client.name}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
