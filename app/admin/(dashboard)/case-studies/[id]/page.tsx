import { notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudy } from "@/lib/actions/case-studies";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import { deleteCaseStudy } from "@/lib/actions/case-studies";
import { DeleteButton } from "@/components/admin/delete-button";
import type { CaseStudyInput } from "@/lib/validation/case-study";

export const metadata = { title: "Edit Case Study" };

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">New Case Study</h1>
        <CaseStudyForm />
      </div>
    );
  }

  const study = await getCaseStudy(id);
  if (!study) notFound();

  const initial: Partial<CaseStudyInput> = {
    slug: study.slug,
    titleEn: study.titleEn,
    titleAr: study.titleAr ?? "",
    clientEn: study.clientEn ?? "",
    clientAr: study.clientAr ?? "",
    summaryEn: study.summaryEn ?? "",
    summaryAr: study.summaryAr ?? "",
    challengeEn: study.challengeEn ?? "",
    challengeAr: study.challengeAr ?? "",
    solutionEn: study.solutionEn ?? "",
    solutionAr: study.solutionAr ?? "",
    resultsEn: study.resultsEn ?? "",
    resultsAr: study.resultsAr ?? "",
    category: study.category,
    metrics: (study.metrics as CaseStudyInput["metrics"]) ?? [],
    heroMediaId: study.heroMediaId ?? "",
    galleryMediaIds: study.galleryItems.map((g) => g.mediaId),
    externalLinks: (study.externalLinks as CaseStudyInput["externalLinks"]) ?? [],
    order: study.order,
    status: study.status,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{study.titleEn}</h1>
        <div className="flex gap-2">
          <Link
            href={`/admin/case-studies/${study.id}/preview`}
            className="text-sm font-medium text-accent hover:underline"
          >
            Preview
          </Link>
          <DeleteButton
            action={() => deleteCaseStudy(study.id)}
            redirectTo="/admin/case-studies"
            label="Delete"
          />
        </div>
      </div>
      <CaseStudyForm id={study.id} initial={initial} />
    </div>
  );
}
