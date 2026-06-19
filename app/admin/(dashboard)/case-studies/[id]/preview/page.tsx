import { notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudy } from "@/lib/actions/case-studies";
import { sanitizeRichText } from "@/lib/validation";
import { Badge } from "@/components/ui/badge";
import { ExternalVideoEmbed } from "@/components/site/external-video-embed";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Preview Case Study" };

export default async function PreviewCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await getCaseStudy(id);
  if (!study) notFound();

  const metrics = (study.metrics as Array<{ labelEn?: string; value?: string }>) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href={`/admin/case-studies/${study.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to edit
        </Link>
        <Badge variant={study.status === "PUBLISHED" ? "accent" : "secondary"}>
          {study.status}
        </Badge>
      </div>

      <article className="space-y-6">
        <header>
          <Badge variant="outline" className="mb-2 uppercase">
            {study.category.replace(/_/g, " ").toLowerCase()}
          </Badge>
          <h1 className="font-heading text-3xl font-bold">{study.titleEn}</h1>
          {study.clientEn && <p className="mt-2 text-accent">{study.clientEn}</p>}
        </header>

        {study.heroMedia && (
          <img
            src={`/uploads/${study.heroMedia.path}`}
            alt={study.heroMedia.altEn ?? study.titleEn}
            className="w-full rounded-xl object-cover"
          />
        )}

        <Section title="Challenge" en={study.challengeEn} />
        <Section title="Solution" en={study.solutionEn} />
        <Section title="Results" en={study.resultsEn} />

        {metrics.length > 0 && (
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <div key={i} className="rounded-lg border p-4 text-center">
                <dd className="font-heading text-2xl font-bold text-accent">{m.value}</dd>
                <dt className="mt-1 text-xs uppercase text-muted-foreground">{m.labelEn}</dt>
              </div>
            ))}
          </dl>
        )}

        <ExternalVideoEmbed links={study.externalLinks as never} />

        {study.galleryItems.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {study.galleryItems.map((item) => (
              <img
                key={item.id}
                src={`/uploads/${item.media.path}`}
                alt={item.media.altEn ?? ""}
                className="w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

function Section({ title, en }: { title: string; en: string | null }) {
  if (!en) return null;
  return (
    <section className="space-y-2">
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <div
        className="prose-richtext"
        dangerouslySetInnerHTML={{ __html: sanitizeRichText(en) }}
      />
    </section>
  );
}
