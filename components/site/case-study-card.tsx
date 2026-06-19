import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import type { CaseStudy } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

type LocalizedField = {
  titleEn: string;
  titleAr: string | null;
  summaryEn: string | null;
  summaryAr: string | null;
  clientEn: string | null;
  clientAr: string | null;
  slug: string;
  category: CaseStudy["category"];
  heroMedia?: { path: string; altEn: string | null; altAr: string | null } | null;
};

function pick(en: string | null, ar: string | null, locale: Locale): string {
  if (locale === "ar") return (ar ?? en ?? "").trim();
  return (en ?? "").trim();
}

export function CaseStudyCard({
  study,
  locale,
}: {
  study: LocalizedField;
  locale: Locale;
}) {
  const title = pick(study.titleEn, study.titleAr, locale);
  const summary = pick(study.summaryEn, study.summaryAr, locale);
  const client = pick(study.clientEn, study.clientAr, locale);
  const alt = pick(study.heroMedia?.altEn ?? null, study.heroMedia?.altAr ?? null, locale);

  return (
    <Link
      href={`/work/${study.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {study.heroMedia ? (
          <Image
            src={`/uploads/${study.heroMedia.path}`}
            alt={alt || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <span className="font-heading text-4xl font-bold text-muted-foreground/40">
              {title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="uppercase tracking-wide">
            {study.category.replace(/_/g, " ").toLowerCase()}
          </Badge>
          <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3 className="font-heading text-lg font-semibold leading-tight">{title}</h3>
        {client && <p className="text-sm font-medium text-accent">{client}</p>}
        {summary && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{summary}</p>
        )}
      </div>
    </Link>
  );
}
