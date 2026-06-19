"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { contactDetailsSchema } from "@/lib/validation/settings";
import { ok, fail, type ActionResult } from "@/lib/validation";

export async function getContactDetails() {
  await requireAdmin("/admin/contact");
  return prisma.contactDetails.findUnique({ where: { id: "singleton" } });
}

export async function updateContactDetails(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = contactDetailsSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.flatten().fieldErrors);
  const d = parsed.data;

  await prisma.contactDetails.upsert({
    where: { id: "singleton" },
    update: {
      email: d.email || null,
      phone: d.phone || null,
      website: d.website || null,
      instagram: d.instagram || null,
      tiktok: d.tiktok || null,
      addressesEn: d.addressesEn,
      addressesAr: d.addressesAr,
    },
    create: {
      id: "singleton",
      email: d.email || null,
      phone: d.phone || null,
      website: d.website || null,
      instagram: d.instagram || null,
      tiktok: d.tiktok || null,
      addressesEn: d.addressesEn,
      addressesAr: d.addressesAr,
    },
  });

  revalidateTag("contact");
  revalidateTag("branding");
  return ok({ id: "singleton" });
}

export async function getContactSubmissions() {
  await requireAdmin();
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function markSubmissionRead(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await prisma.contactSubmission.update({
    where: { id },
    data: { status: "READ" },
  });
  return ok({ id });
}

export async function markSubmissionSpam(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await prisma.contactSubmission.update({
    where: { id },
    data: { status: "SPAM" },
  });
  return ok({ id });
}

export async function deleteSubmission(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await prisma.contactSubmission.delete({ where: { id } });
  return ok({ id });
}
