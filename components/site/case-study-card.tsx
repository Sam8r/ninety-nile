import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@prisma/client";
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
      className="group flex flex-col border-t border-[var(--color-rule)] pt-md transition-colors duration-200 ease-out hover:border-[var(--color-accent)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-paper-2)]">
        {study.heroMedia ? (
          <Image
            src={`/uploads/${study.heroMedia.path}`}
            alt={alt || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-7xl font-bold text-[var(--color-rule)]">
              {title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2xs pt-md">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
            {study.category.replace(/_/g, " ").toLowerCase()}
          </span>
          <ArrowUpRight className="size-4 text-[var(--color-muted)] transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3 className="font-display text-xl font-bold leading-tight">{title}</h3>
        {client && (
          <p className="text-sm font-medium text-[var(--color-accent)]">{client}</p>
        )}
        {summary && (
          <p className="line-clamp-2 text-sm text-[var(--color-muted)]">{summary}</p>
        )}
      </div>
    </Link>
  );
}
