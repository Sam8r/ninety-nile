import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/i18n/content";
import { sanitizeRichText } from "@/lib/validation";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("community");

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const content = await prisma.siteContent.findUnique({
    where: { key: "COMMUNITY_ACHIEVEMENT" },
    include: { media: true },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={localize(content?.titleEn, content?.titleAr, loc, "Community")}
      />
      <section className="container-prose py-16">
        {content?.media && (
          <img
            src={`/uploads/${content.media.path}`}
            alt={localize(content.media.altEn, content.media.altAr, loc)}
            className="mb-8 w-full rounded-xl object-cover"
          />
        )}
        <div
          className="prose-richtext text-lg"
          dangerouslySetInnerHTML={{
            __html: sanitizeRichText(localize(content?.bodyEn, content?.bodyAr, loc)),
          }}
        />
      </section>
    </div>
  );
}
