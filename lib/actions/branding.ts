"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { brandSettingsSchema } from "@/lib/validation/settings";
import { ok, fail, type ActionResult } from "@/lib/validation";

export async function getBrandSettings() {
  await requireAdmin("/admin/branding");
  return prisma.brandSettings.findUnique({ where: { id: "singleton" } });
}

export async function updateBrandSettings(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = brandSettingsSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.flatten().fieldErrors);
  const d = parsed.data;

  await prisma.brandSettings.upsert({
    where: { id: "singleton" },
    update: {
      siteNameEn: d.siteNameEn,
      siteNameAr: d.siteNameAr || null,
      taglineEn: d.taglineEn,
      taglineAr: d.taglineAr || null,
      secondaryTaglineEn: d.secondaryTaglineEn || null,
      secondaryTaglineAr: d.secondaryTaglineAr || null,
      logoPrimaryId: d.logoPrimaryId || null,
      logoAltId: d.logoAltId || null,
      logoMarkId: d.logoMarkId || null,
      colorPrimary: d.colorPrimary,
      colorSecondary: d.colorSecondary,
      colorAccent: d.colorAccent,
      colorBg: d.colorBg,
      colorText: d.colorText,
      fontHeading: d.fontHeading,
      fontBody: d.fontBody,
    },
    create: {
      id: "singleton",
      siteNameEn: d.siteNameEn,
      siteNameAr: d.siteNameAr || null,
      taglineEn: d.taglineEn,
      taglineAr: d.taglineAr || null,
      secondaryTaglineEn: d.secondaryTaglineEn || null,
      secondaryTaglineAr: d.secondaryTaglineAr || null,
      logoPrimaryId: d.logoPrimaryId || null,
      logoAltId: d.logoAltId || null,
      logoMarkId: d.logoMarkId || null,
      colorPrimary: d.colorPrimary,
      colorSecondary: d.colorSecondary,
      colorAccent: d.colorAccent,
      colorBg: d.colorBg,
      colorText: d.colorText,
      fontHeading: d.fontHeading,
      fontBody: d.fontBody,
    },
  });

  revalidateTag("branding");
  revalidateTag("work");
  return ok({ id: "singleton" });
}
