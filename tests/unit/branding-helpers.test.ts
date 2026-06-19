import { describe, it, expect } from "vitest";
import { brandToCssVars } from "@/lib/branding";
import type { BrandSettings } from "@prisma/client";

function mockBrand(overrides: Partial<BrandSettings> = {}): Pick<
  BrandSettings,
  "colorPrimary" | "colorSecondary" | "colorAccent" | "colorBg" | "colorText"
> {
  return {
    colorPrimary: "#1a202c",
    colorSecondary: "#0e7490",
    colorAccent: "#e8722a",
    colorBg: "#faf8f4",
    colorText: "#1a202c",
    ...overrides,
  };
}

describe("brandToCssVars", () => {
  it("maps all five color fields to CSS custom properties", () => {
    const vars = brandToCssVars(mockBrand());
    expect(vars["--brand-primary"]).toBe("#1a202c");
    expect(vars["--brand-secondary"]).toBe("#0e7490");
    expect(vars["--brand-accent"]).toBe("#e8722a");
    expect(vars["--brand-bg"]).toBe("#faf8f4");
    expect(vars["--brand-text"]).toBe("#1a202c");
  });

  it("reflects custom color overrides", () => {
    const vars = brandToCssVars(mockBrand({ colorAccent: "#ff0000" }));
    expect(vars["--brand-accent"]).toBe("#ff0000");
  });

  it("produces exactly 5 CSS vars", () => {
    const vars = brandToCssVars(mockBrand());
    expect(Object.keys(vars)).toHaveLength(5);
  });
});
