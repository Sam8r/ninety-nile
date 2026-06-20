import { prisma } from "@/lib/db";
import { textArr } from "@/lib/content/text";
import { ui } from "@/lib/content/ui";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";

export const generateMetadata = pageMetadata("contact");

export default async function ContactPage() {
  const contact = await prisma.contactDetails.findUnique({
    where: { id: "singleton" },
  });
  const addresses = textArr(contact?.addressesEn as string[] | null);

  return (
    <div className="animate-fade-in">
      <PageHeader title={ui.contact.title} subtitle={ui.contact.subtitle} />

      <section className="container-wide grid gap-2xl py-3xl md:grid-cols-2">
        <div>
          <ContactForm />
        </div>

        <div className="space-y-lg">
          {contact?.email && (
            <div className="border-t border-[var(--color-rule)] pt-md">
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                {ui.contact.emailLabel}
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-xs block text-lg transition-colors hover:text-[var(--color-accent)]"
              >
                {contact.email}
              </a>
            </div>
          )}
          {contact?.phone && (
            <div className="border-t border-[var(--color-rule)] pt-md">
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                {ui.contact.phone}
              </p>
              <a
                href={`tel:${contact.phone}`}
                className="mt-xs block text-lg transition-colors hover:text-[var(--color-accent)]"
              >
                {contact.phone}
              </a>
            </div>
          )}
          {(contact?.instagram || contact?.tiktok || contact?.twitter) && (
            <div className="border-t border-[var(--color-rule)] pt-md">
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                Social
              </p>
              <div className="mt-xs flex flex-wrap gap-md">
                {contact?.instagram && (
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-[var(--color-accent)] underline underline-offset-4"
                  >
                    {ui.contact.instagram}
                  </a>
                )}
                {contact?.tiktok && (
                  <a
                    href={contact.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-[var(--color-accent)] underline underline-offset-4"
                  >
                    {ui.contact.tiktok}
                  </a>
                )}
                {contact?.twitter && (
                  <a
                    href={contact.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-[var(--color-accent)] underline underline-offset-4"
                  >
                    Twitter / X
                  </a>
                )}
              </div>
            </div>
          )}
          {addresses.length > 0 && (
            <div className="border-t border-[var(--color-rule)] pt-md">
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                Locations
              </p>
              <ul className="mt-xs space-y-2xs">
                {addresses.map((addr, i) => (
                  <li key={i} className="text-lg">{addr}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
