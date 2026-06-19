import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const PUBLIC_FILE =
  /\.(?!well-known\/).*(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|webmanifest|css|js|map)$/;
const ADMIN_PATH = /^\/admin(?:\/|$)/;

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (ADMIN_PATH.test(pathname)) {
    const session = req.auth;
    const isLoginPage = pathname === "/admin/login";
    if (!session?.user) {
      if (isLoginPage) return NextResponse.next();
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(url);
    }
    if (isLoginPage) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|uploads|.*\\..*).*)"],
};
