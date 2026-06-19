import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

/**
 * Edge-safe Auth.js config (no DB / bcrypt imports).
 * Imported by middleware.ts which runs on the Edge Runtime.
 */
export const authConfig = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/admin/login" },
  providers: [], // Credentials provider added in lib/auth.ts (Node runtime)
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdmin = pathname.startsWith("/admin");
      const isLogin = pathname === "/admin/login";
      if (isAdmin && !isLogin && !auth) return false;
      if (isLogin && auth) {
        return Response.redirect(new URL("/admin", request.url));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: Role }).role ?? "EDITOR";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
