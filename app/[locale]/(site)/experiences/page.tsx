import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { localize } from "@/lib/i18n/content";
import { sanitizeRichText } from "@/lib/validation";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("experiences");

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const content = await prisma.siteContent.findUnique({
    where: { key: "BRAND_EXPERIENCE" },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title={localize(content?.titleEn, content?.titleAr, loc, "Brand Experiences")} />
      <section className="container-prose py-16">
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
