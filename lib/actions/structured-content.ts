"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-guards";
import {
  serviceSchema,
  processStepSchema,
  productionPhaseSchema,
  equipmentItemSchema,
  teamMemberSchema,
  clientSchema,
  testimonialSchema,
} from "@/lib/validation/settings";
import { sanitizeRichText, ok, fail, type ActionResult } from "@/lib/validation";

// Revalidate public reads whenever structured content changes.
function revalidateAll() {
  revalidateTag("branding");
  revalidateTag("work");
}

// --- Services -------------------------------------------------------------
export async function listServices() {
  await requireSession();
  return prisma.service.findMany({ orderBy: { order: "asc" } });
}
export async function upsertService(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const p = serviceSchema.safeParse(input);
  if (!p.success) return fail("VALIDATION_ERROR", p.error.flatten().fieldErrors);
  const d = p.data;
  const row = id
    ? await prisma.service.update({ where: { id }, data: { ...d, nameAr: d.nameAr || null, descriptionEn: d.descriptionEn || null, descriptionAr: d.descriptionAr || null } })
    : await prisma.service.create({ data: { ...d, nameAr: d.nameAr || null, descriptionEn: d.descriptionEn || null, descriptionAr: d.descriptionAr || null } });
  revalidateAll();
  return ok({ id: row.id });
}
export async function deleteService(id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  await prisma.service.delete({ where: { id } });
  revalidateAll();
  return ok({ id });
}

// --- Process steps --------------------------------------------------------
export async function listProcessSteps() {
  await requireSession();
  return prisma.processStep.findMany({ orderBy: { order: "asc" } });
}
export async function upsertProcessStep(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const p = processStepSchema.safeParse(input);
  if (!p.success) return fail("VALIDATION_ERROR", p.error.flatten().fieldErrors);
  const d = p.data;
  const row = id
    ? await prisma.processStep.update({ where: { id }, data: { ...d, labelAr: d.labelAr || null, descriptionEn: d.descriptionEn || null, descriptionAr: d.descriptionAr || null } })
    : await prisma.processStep.create({ data: { ...d, labelAr: d.labelAr || null, descriptionEn: d.descriptionEn || null, descriptionAr: d.descriptionAr || null } });
  revalidateAll();
  return ok({ id: row.id });
}
export async function deleteProcessStep(id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  await prisma.processStep.delete({ where: { id } });
  revalidateAll();
  return ok({ id });
}

// --- Production phases ----------------------------------------------------
export async function listProductionPhases() {
  await requireSession();
  return prisma.productionPhase.findMany({ orderBy: { order: "asc" } });
}
export async function upsertProductionPhase(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const p = productionPhaseSchema.safeParse(input);
  if (!p.success) return fail("VALIDATION_ERROR", p.error.flatten().fieldErrors);
  const d = p.data;
  const row = id
    ? await prisma.productionPhase.update({ where: { id }, data: { ...d, nameAr: d.nameAr || null, bodyEn: sanitizeRichText(d.bodyEn) || null, bodyAr: sanitizeRichText(d.bodyAr) || null } })
    : await prisma.productionPhase.create({ data: { ...d, nameAr: d.nameAr || null, bodyEn: sanitizeRichText(d.bodyEn) || null, bodyAr: sanitizeRichText(d.bodyAr) || null } });
  revalidateAll();
  return ok({ id: row.id });
}
export async function deleteProductionPhase(id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  await prisma.productionPhase.delete({ where: { id } });
  revalidateAll();
  return ok({ id });
}

// --- Equipment ------------------------------------------------------------
export async function listEquipment() {
  await requireSession();
  return prisma.equipmentItem.findMany({ orderBy: { order: "asc" } });
}
export async function upsertEquipment(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const p = equipmentItemSchema.safeParse(input);
  if (!p.success) return fail("VALIDATION_ERROR", p.error.flatten().fieldErrors);
  const d = p.data;
  const row = id
    ? await prisma.equipmentItem.update({ where: { id }, data: { ...d, labelAr: d.labelAr || null } })
    : await prisma.equipmentItem.create({ data: { ...d, labelAr: d.labelAr || null } });
  revalidateAll();
  return ok({ id: row.id });
}
export async function deleteEquipment(id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  await prisma.equipmentItem.delete({ where: { id } });
  revalidateAll();
  return ok({ id });
}

// --- Team members ---------------------------------------------------------
export async function listTeamMembers() {
  await requireSession();
  return prisma.teamMember.findMany({ orderBy: { order: "asc" }, include: { photo: true } });
}
export async function upsertTeamMember(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const p = teamMemberSchema.safeParse(input);
  if (!p.success) return fail("VALIDATION_ERROR", p.error.flatten().fieldErrors);
  const d = p.data;
  const data = {
    nameEn: d.nameEn,
    nameAr: d.nameAr || null,
    roleEn: d.roleEn || null,
    roleAr: d.roleAr || null,
    bioEn: d.bioEn || null,
    bioAr: d.bioAr || null,
    photoId: d.photoId || null,
    order: d.order,
    status: d.status,
  };
  const row = id ? await prisma.teamMember.update({ where: { id }, data }) : await prisma.teamMember.create({ data });
  revalidateAll();
  return ok({ id: row.id });
}
export async function deleteTeamMember(id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  await prisma.teamMember.delete({ where: { id } });
  revalidateAll();
  return ok({ id });
}

// --- Clients --------------------------------------------------------------
export async function listClients() {
  await requireSession();
  return prisma.client.findMany({ orderBy: { order: "asc" }, include: { logo: true } });
}
export async function upsertClient(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const p = clientSchema.safeParse(input);
  if (!p.success) return fail("VALIDATION_ERROR", p.error.flatten().fieldErrors);
  const d = p.data;
  const row = id
    ? await prisma.client.update({ where: { id }, data: { ...d, url: d.url || null, logoId: d.logoId || null } })
    : await prisma.client.create({ data: { ...d, url: d.url || null, logoId: d.logoId || null } });
  revalidateAll();
  return ok({ id: row.id });
}
export async function deleteClient(id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  await prisma.client.delete({ where: { id } });
  revalidateAll();
  return ok({ id });
}

// --- Testimonials ---------------------------------------------------------
export async function listTestimonials() {
  await requireSession();
  return prisma.testimonial.findMany({ orderBy: { order: "asc" } });
}
export async function upsertTestimonial(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const p = testimonialSchema.safeParse(input);
  if (!p.success) return fail("VALIDATION_ERROR", p.error.flatten().fieldErrors);
  const d = p.data;
  const row = id
    ? await prisma.testimonial.update({ where: { id }, data: { ...d, quoteAr: d.quoteAr || null, authorRoleEn: d.authorRoleEn || null, authorRoleAr: d.authorRoleAr || null, org: d.org || null } })
    : await prisma.testimonial.create({ data: { ...d, quoteAr: d.quoteAr || null, authorRoleEn: d.authorRoleEn || null, authorRoleAr: d.authorRoleAr || null, org: d.org || null } });
  revalidateAll();
  return ok({ id: row.id });
}
export async function deleteTestimonial(id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  await prisma.testimonial.delete({ where: { id } });
  revalidateAll();
  return ok({ id });
}
