"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-guards";
import type { AuthError } from "@/lib/auth-guards";
import { caseStudySchema, validateCaseStudyPublish } from "@/lib/validation/case-study";
import { sanitizeRichText, ok, fail, type ActionResult } from "@/lib/validation";
import type { CaseStudy, CaseStudyCategory, Status } from "@prisma/client";

export type CaseStudyListItem = Pick<
  CaseStudy,
  "id" | "slug" | "titleEn" | "titleAr" | "category" | "order" | "status" | "updatedAt"
>;

export async function listCaseStudies(): Promise<CaseStudyListItem[]> {
  await requireSession("/admin/case-studies");
  return prisma.caseStudy.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      titleEn: true,
      titleAr: true,
      category: true,
      order: true,
      status: true,
      updatedAt: true,
    },
  });
}

export async function getCaseStudy(id: string) {
  await requireSession();
  const study = await prisma.caseStudy.findUnique({
    where: { id },
    include: {
      heroMedia: true,
      galleryItems: { orderBy: { order: "asc" }, include: { media: true } },
    },
  });
  if (!study) fail("NOT_FOUND");
  return study;
}

export async function createCaseStudy(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireSession();
  const parsed = caseStudySchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.flatten().fieldErrors);
  }
  const data = parsed.data;

  const existing = await prisma.caseStudy.findUnique({ where: { slug: data.slug } });
  if (existing) return fail("SLUG_TAKEN", { slug: ["This slug is already in use"] });

  if (data.status === "PUBLISHED") {
    const publishErrors = validateCaseStudyPublish(data);
    if (Object.keys(publishErrors).length > 0) return fail("VALIDATION_ERROR", publishErrors);
  }

  const created = await prisma.caseStudy.create({
    data: {
      slug: data.slug,
      titleEn: data.titleEn,
      titleAr: data.titleAr || null,
      clientEn: data.clientEn || null,
      clientAr: data.clientAr || null,
      summaryEn: data.summaryEn || null,
      summaryAr: data.summaryAr || null,
      challengeEn: sanitizeRichText(data.challengeEn) || null,
      challengeAr: sanitizeRichText(data.challengeAr) || null,
      solutionEn: sanitizeRichText(data.solutionEn) || null,
      solutionAr: sanitizeRichText(data.solutionAr) || null,
      resultsEn: sanitizeRichText(data.resultsEn) || null,
      resultsAr: sanitizeRichText(data.resultsAr) || null,
      category: data.category as CaseStudyCategory,
      metrics: data.metrics,
      externalLinks: data.externalLinks,
      heroMediaId: data.heroMediaId || null,
      order: data.order,
      status: data.status as Status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      authorId: user.id,
    },
  });

  if (data.galleryMediaIds.length > 0) {
    await prisma.caseStudyMedia.createMany({
      data: data.galleryMediaIds.map((mediaId, i) => ({
        caseStudyId: created.id,
        mediaId,
        order: i,
      })),
    });
  }

  revalidateTag("work");
  revalidateTag(`case-study:${data.slug}`);
  return ok({ id: created.id });
}

export async function updateCaseStudy(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireSession();
  const parsed = caseStudySchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.flatten().fieldErrors);
  }
  const data = parsed.data;

  const current = await prisma.caseStudy.findUnique({ where: { id } });
  if (!current) return fail("NOT_FOUND");

  const slugTaken = await prisma.caseStudy.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (slugTaken) return fail("SLUG_TAKEN", { slug: ["This slug is already in use"] });

  if (data.status === "PUBLISHED") {
    const publishErrors = validateCaseStudyPublish(data);
    if (Object.keys(publishErrors).length > 0) return fail("VALIDATION_ERROR", publishErrors);
  }

  const wasPublished = current.status === "PUBLISHED";
  const isPublishing = data.status === "PUBLISHED";

  await prisma.caseStudy.update({
    where: { id },
    data: {
      slug: data.slug,
      titleEn: data.titleEn,
      titleAr: data.titleAr || null,
      clientEn: data.clientEn || null,
      clientAr: data.clientAr || null,
      summaryEn: data.summaryEn || null,
      summaryAr: data.summaryAr || null,
      challengeEn: sanitizeRichText(data.challengeEn) || null,
      challengeAr: sanitizeRichText(data.challengeAr) || null,
      solutionEn: sanitizeRichText(data.solutionEn) || null,
      solutionAr: sanitizeRichText(data.solutionAr) || null,
      resultsEn: sanitizeRichText(data.resultsEn) || null,
      resultsAr: sanitizeRichText(data.resultsAr) || null,
      category: data.category as CaseStudyCategory,
      metrics: data.metrics,
      externalLinks: data.externalLinks,
      heroMediaId: data.heroMediaId || null,
      order: data.order,
      status: data.status as Status,
      publishedAt: isPublishing && !wasPublished ? new Date() : current.publishedAt,
      authorId: user.id,
    },
  });

  // Rebuild gallery (simple replace).
  if (data.galleryMediaIds.length > 0) {
    await prisma.caseStudyMedia.deleteMany({ where: { caseStudyId: id } });
    await prisma.caseStudyMedia.createMany({
      data: data.galleryMediaIds.map((mediaId, i) => ({
        caseStudyId: id,
        mediaId,
        order: i,
      })),
    });
  } else {
    await prisma.caseStudyMedia.deleteMany({ where: { caseStudyId: id } });
  }

  revalidateTag("work");
  revalidateTag(`case-study:${current.slug}`);
  if (current.slug !== data.slug) revalidateTag(`case-study:${data.slug}`);
  return ok({ id });
}

export async function reorderCaseStudies(
  orderedIds: string[],
): Promise<ActionResult<{ count: number }>> {
  await requireSession();
  await prisma.$transaction(
    orderedIds.map((id, i) =>
      prisma.caseStudy.update({ where: { id }, data: { order: i } }),
    ),
  );
  revalidateTag("work");
  return ok({ count: orderedIds.length });
}

export async function deleteCaseStudy(id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const study = await prisma.caseStudy.findUnique({ where: { id } });
  if (!study) return fail("NOT_FOUND");
  await prisma.caseStudy.delete({ where: { id } });
  revalidateTag("work");
  revalidateTag(`case-study:${study.slug}`);
  return ok({ id });
}

export type { AuthError };
