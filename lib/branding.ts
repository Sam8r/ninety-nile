import "server-only";
import { prisma } from "@/lib/db";
import type { BrandSettings } from "@prisma/client";

export type BrandTokens = {
  siteNameEn: string;
  siteNameAr: string;
  taglineEn: string;
  taglineAr: string;
  secondaryTaglineEn: string | null;
  secondaryTaglineAr: string | null;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBg: string;
  colorText: string;
  fontHeading: string;
  fontBody: string;
};

const FALLBACK: BrandTokens = {
  siteNameEn: "NinetyNile",
  siteNameAr: "ناينتي نايل",
  taglineEn: "Creativity, Overflowing.",
  taglineAr: "الإبداع يفيض.",
  secondaryTaglineEn: null,
  secondaryTaglineAr: null,
  colorPrimary: "#1a202c",
  colorSecondary: "#0e7490",
  colorAccent: "#e8722a",
  colorBg: "#faf8f4",
  colorText: "#1a202c",
  fontHeading: "Inter",
  fontBody: "Inter",
};

export function brandToCssVars(brand: Pick<
  BrandSettings,
  "colorPrimary" | "colorSecondary" | "colorAccent" | "colorBg" | "colorText"
>): Record<string, string> {
  return {
    "--brand-primary": brand.colorPrimary,
    "--brand-secondary": brand.colorSecondary,
    "--brand-accent": brand.colorAccent,
    "--brand-bg": brand.colorBg,
    "--brand-text": brand.colorText,
  };
}

export async function getBrandTokens(): Promise<BrandTokens> {
  try {
    const brand = await prisma.brandSettings.findUnique({
      where: { id: "singleton" },
    });
    if (!brand) return FALLBACK;
    return {
      siteNameEn: brand.siteNameEn,
      siteNameAr: brand.siteNameAr ?? FALLBACK.siteNameAr,
      taglineEn: brand.taglineEn,
      taglineAr: brand.taglineAr ?? FALLBACK.taglineAr,
      secondaryTaglineEn: brand.secondaryTaglineEn,
      secondaryTaglineAr: brand.secondaryTaglineAr,
      colorPrimary: brand.colorPrimary,
      colorSecondary: brand.colorSecondary,
      colorAccent: brand.colorAccent,
      colorBg: brand.colorBg,
      colorText: brand.colorText,
      fontHeading: brand.fontHeading,
      fontBody: brand.fontBody,
    };
  } catch {
    return FALLBACK;
  }
}

export function brandStyle(brand: Pick<
  BrandSettings,
  "colorPrimary" | "colorSecondary" | "colorAccent" | "colorBg" | "colorText"
>): React.CSSProperties {
  return brandToCssVars(brand) as React.CSSProperties;
}
