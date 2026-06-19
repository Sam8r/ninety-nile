"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { createUserSchema } from "@/lib/validation/user";
import { ok, fail, type ActionResult } from "@/lib/validation";
export type UserListItem = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR";
  createdAt: Date;
};

export async function listUsers(): Promise<UserListItem[]> {
  await requireAdmin("/admin/users");
  return prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function createUser(input: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.flatten().fieldErrors);

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (existing) return fail("VALIDATION_ERROR", { email: ["Email already in use"] });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name,
      role: parsed.data.role,
      passwordHash,
    },
  });
  return ok({ id: user.id });
}

export async function updateUserRole(
  id: string,
  role: "ADMIN" | "EDITOR",
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return fail("NOT_FOUND");
  if (target.role === role) return ok({ id });

  // Last-admin guard: cannot demote the last remaining ADMIN.
  if (target.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) return fail("LAST_ADMIN", { role: ["Cannot demote the last admin"] });
  }

  await prisma.user.update({ where: { id }, data: { role } });
  return ok({ id });
}

export async function deleteUser(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return fail("NOT_FOUND");

  // Last-admin guard: cannot delete the last remaining ADMIN.
  if (target.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) return fail("LAST_ADMIN", { _form: ["Cannot delete the last admin"] });
  }

  await prisma.user.delete({ where: { id } });
  return ok({ id });
}
