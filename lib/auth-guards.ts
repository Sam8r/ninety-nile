import "server-only";
import { cache } from "react";
import { redirect, forbidden } from "next/navigation";
import { auth, signIn, signOut } from "@/lib/auth";
import type { Role } from "@prisma/client";

export class AuthError extends Error {
  code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = "AuthError";
  }
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export const getSession = cache(async (): Promise<SessionUser | null> => {
  const session = await auth();
  if (!session?.user) return null;
  const u = session.user;
  if (!u.id || !u.email || !u.role) return null;
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? u.email,
    role: u.role as Role,
  };
});

export async function requireSession(callbackUrl?: string): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    if (callbackUrl) redirect(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    throw new AuthError("UNAUTHENTICATED");
  }
  return user;
}

export async function requireRole(
  role: Role,
  callbackUrl?: string,
): Promise<SessionUser> {
  const user = await requireSession(callbackUrl);
  if (user.role !== role) {
    forbidden();
  }
  return user;
}

export async function requireAdmin(callbackUrl?: string): Promise<SessionUser> {
  return requireRole("ADMIN", callbackUrl);
}

export { signIn, signOut };
