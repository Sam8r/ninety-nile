import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

type CardStudy = {
  titleEn: string;
  summaryEn: string | null;
  clientEn: string | null;
  slug: string;
  category: CaseStudy["category"];
  heroMedia?: { path: string; altEn: string | null } | null;
};

export function CaseStudyCard({ study }: { study: CardStudy }) {
  const title = study.titleEn.trim();
  const summary = (study.summaryEn ?? "").trim();
  const client = (study.clientEn ?? "").trim();
  const alt = (study.heroMedia?.altEn ?? "").trim();

  return (
    <Link
      href={`/work/${study.slug}`}
      className="group flex flex-col overflow-hidden border-2 border-black bg-white transition-shadow hover:shadow-[8px_8px_0_0_#000]"
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
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <span className="font-heading text-6xl font-bold text-black/10">
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
        <h3 className="font-heading text-lg font-bold leading-tight">{title}</h3>
        {client && <p className="text-sm font-semibold text-accent">{client}</p>}
        {summary && <p className="line-clamp-2 text-sm text-muted-foreground">{summary}</p>}
      </div>
    </Link>
  );
}
