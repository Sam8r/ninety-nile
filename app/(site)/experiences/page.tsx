import { prisma } from "@/lib/db";
import { text } from "@/lib/content/text";
import { sanitizeRichText } from "@/lib/validation";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("experiences");

export default async function ExperiencesPage() {
  const content = await prisma.siteContent.findUnique({
    where: { key: "BRAND_EXPERIENCE" },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title={text(content?.titleEn, "Brand Experiences")} />
      <section className="container-prose py-16">
        <div
          className="prose-richtext text-lg"
          dangerouslySetInnerHTML={{
            __html: sanitizeRichText(text(content?.bodyEn)),
          }}
        />
      </section>
    </div>
  );
}
