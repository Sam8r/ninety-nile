import { prisma } from "@/lib/db";
import { text } from "@/lib/content/text";
import { sanitizeRichText } from "@/lib/validation";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHeader } from "@/components/site/page-header";

export const generateMetadata = pageMetadata("community");

export default async function CommunityPage() {
  const content = await prisma.siteContent.findUnique({
    where: { key: "COMMUNITY_ACHIEVEMENT" },
    include: { media: true },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title={text(content?.titleEn, "Community")} />
      <section className="container-prose py-16">
        {content?.media && (
          <img
            src={`/uploads/${content.media.path}`}
            alt={text(content.media.altEn)}
            className="mb-8 w-full rounded-xl object-cover"
          />
        )}
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
