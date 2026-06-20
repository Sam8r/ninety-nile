import "server-only";
import { prisma } from "@/lib/db";
import type { BrandSettings } from "@prisma/client";

export type BrandTokens = {
  siteNameEn: string;
  taglineEn: string;
  secondaryTaglineEn: string | null;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBg: string;
  colorText: string;
  fontHeading: string;
  fontBody: string;
};

/** Bauhaus Editorial defaults — OKLCH tokens per design.md. */
const FALLBACK: BrandTokens = {
  siteNameEn: "NinetyNile",
  taglineEn: "Creativity, Overflowing.",
  secondaryTaglineEn:
    "A boutique creative communication consultancy and content creation agency — rooted in Sudan, working across the globe.",
  colorPrimary: "oklch(18% 0 0)",
  colorSecondary: "oklch(55% 0 0)",
  colorAccent: "oklch(18% 0 0)",
  colorBg: "oklch(98% 0 0)",
  colorText: "oklch(18% 0 0)",
  fontHeading: "Space Grotesk",
  fontBody: "Inter",
};

/** Bauhaus yellow is a design-system constant (not yet admin-configurable). */
const BAUHAUS_YELLOW = "oklch(80% 0 0)";

export function brandToCssVars(
  brand: Pick<
    BrandSettings,
    "colorPrimary" | "colorSecondary" | "colorAccent" | "colorBg" | "colorText"
  >,
): Record<string, string> {
  return {
    "--brand-primary": brand.colorPrimary,
    "--brand-secondary": brand.colorSecondary,
    "--brand-accent": brand.colorAccent,
    "--brand-yellow": BAUHAUS_YELLOW,
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
      taglineEn: brand.taglineEn,
      secondaryTaglineEn: brand.secondaryTaglineEn,
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

export function brandStyle(
  brand: Pick<
    BrandSettings,
    "colorPrimary" | "colorSecondary" | "colorAccent" | "colorBg" | "colorText"
  >,
): React.CSSProperties {
  return brandToCssVars(brand) as React.CSSProperties;
}
