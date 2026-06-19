import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";
import { MediaFigure } from "@/components/site/media-figure";

export const generateMetadata = pageMetadata("tribe");

export default async function TribePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

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
        title={localize(intro?.titleEn, intro?.titleAr, loc, "Our Tribe")}
        subtitle={localize(intro?.bodyEn, intro?.bodyAr, loc) || undefined}
      />
      <section className="container-wide py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article key={member.id} className="text-center">
              <MediaFigure
                path={member.photo?.path}
                altEn={member.photo?.altEn}
                altAr={member.photo?.altAr}
                locale={loc}
                className="mx-auto max-w-xs"
              />
              <h2 className="mt-4 font-heading text-lg font-semibold">
                {localize(member.nameEn, member.nameAr, loc)}
              </h2>
              {member.roleEn && (
                <p className="text-sm font-medium text-accent">
                  {localize(member.roleEn, member.roleAr, loc)}
                </p>
              )}
              {member.bioEn && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {localize(member.bioEn, member.bioAr, loc)}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
