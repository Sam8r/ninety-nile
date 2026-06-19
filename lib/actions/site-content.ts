"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { siteContentSchema } from "@/lib/validation/settings";
import { sanitizeRichText, ok, fail, type ActionResult } from "@/lib/validation";

export async function getSiteContentByKey(key: string) {
  await requireAdmin();
  return prisma.siteContent.findUnique({ where: { key }, include: { media: true } });
}

export async function getAllSiteContent() {
  await requireAdmin("/admin/content");
  return prisma.siteContent.findMany({ orderBy: { key: "asc" }, include: { media: true } });
}

export async function updateSiteContent(
  key: string,
  input: unknown,
): Promise<ActionResult<{ key: string }>> {
  await requireAdmin();
  const parsed = siteContentSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.flatten().fieldErrors);
  const d = parsed.data;

  await prisma.siteContent.upsert({
    where: { key },
    update: {
      titleEn: d.titleEn || null,
      titleAr: d.titleAr || null,
      bodyEn: sanitizeRichText(d.bodyEn) || null,
      bodyAr: sanitizeRichText(d.bodyAr) || null,
      mediaId: d.mediaId || null,
    },
    create: {
      key,
      titleEn: d.titleEn || null,
      titleAr: d.titleAr || null,
      bodyEn: sanitizeRichText(d.bodyEn) || null,
      bodyAr: sanitizeRichText(d.bodyAr) || null,
      mediaId: d.mediaId || null,
    },
  });

  revalidateTag("branding");
  return ok({ key });
}
