import { prisma } from "@/lib/db";
import { text } from "@/lib/content/text";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";
import { MediaFigure } from "@/components/site/media-figure";

export const generateMetadata = pageMetadata("tribe");

export default async function TribePage() {
  const [intro, members] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "TRIBE_INTRO" } }),
    prisma.teamMember.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: { photo: true },
    }),
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={text(intro?.titleEn, "Our Tribe")}
        subtitle={text(intro?.bodyEn) || undefined}
      />
      <section className="container-wide py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article key={member.id} className="text-center">
              <MediaFigure
                path={member.photo?.path}
                altEn={member.photo?.altEn}
                className="mx-auto max-w-xs"
              />
              <h2 className="mt-4 font-heading text-lg font-bold">{member.nameEn}</h2>
              {member.roleEn && (
                <p className="text-sm font-semibold text-accent">{member.roleEn}</p>
              )}
              {member.bioEn && (
                <p className="mt-2 text-sm text-muted-foreground">{member.bioEn}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
