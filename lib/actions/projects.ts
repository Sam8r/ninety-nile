"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-guards";
import { projectSchema, validateProjectPublish } from "@/lib/validation/project";
import { sanitizeRichText, ok, fail, type ActionResult } from "@/lib/validation";
import type { Status } from "@prisma/client";

export async function listProjects() {
  await requireSession("/admin/projects");
  return prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { heroMedia: true },
  });
}

export async function getProject(id: string) {
  await requireSession();
  return prisma.project.findUnique({
    where: { id },
    include: { heroMedia: true },
  });
}

export async function createProject(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireSession();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.flatten().fieldErrors);
  const data = parsed.data;

  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing) return fail("SLUG_TAKEN", { slug: ["This slug is already in use"] });

  if (data.status === "PUBLISHED") {
    const errs = validateProjectPublish(data);
    if (Object.keys(errs).length > 0) return fail("VALIDATION_ERROR", errs);
  }

  const created = await prisma.project.create({
    data: {
      slug: data.slug,
      titleEn: data.titleEn,
      titleAr: data.titleAr || null,
      descriptionEn: sanitizeRichText(data.descriptionEn) || null,
      descriptionAr: sanitizeRichText(data.descriptionAr) || null,
      externalLinks: data.externalLinks,
      heroMediaId: data.heroMediaId || null,
      order: data.order,
      status: data.status as Status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      authorId: user.id,
    },
  });

  revalidateTag("work");
  return ok({ id: created.id });
}

export async function updateProject(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireSession();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.flatten().fieldErrors);
  const data = parsed.data;

  const current = await prisma.project.findUnique({ where: { id } });
  if (!current) return fail("NOT_FOUND");

  const slugTaken = await prisma.project.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (slugTaken) return fail("SLUG_TAKEN", { slug: ["This slug is already in use"] });

  if (data.status === "PUBLISHED") {
    const errs = validateProjectPublish(data);
    if (Object.keys(errs).length > 0) return fail("VALIDATION_ERROR", errs);
  }

  await prisma.project.update({
    where: { id },
    data: {
      slug: data.slug,
      titleEn: data.titleEn,
      titleAr: data.titleAr || null,
      descriptionEn: sanitizeRichText(data.descriptionEn) || null,
      descriptionAr: sanitizeRichText(data.descriptionAr) || null,
      externalLinks: data.externalLinks,
      heroMediaId: data.heroMediaId || null,
      order: data.order,
      status: data.status as Status,
      authorId: user.id,
    },
  });

  revalidateTag("work");
  return ok({ id });
}

export async function reorderProjects(
  orderedIds: string[],
): Promise<ActionResult<{ count: number }>> {
  await requireSession();
  await prisma.$transaction(
    orderedIds.map((id, i) => prisma.project.update({ where: { id }, data: { order: i } })),
  );
  revalidateTag("work");
  return ok({ count: orderedIds.length });
}

export async function deleteProject(id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return fail("NOT_FOUND");
  await prisma.project.delete({ where: { id } });
  revalidateTag("work");
  return ok({ id });
}
