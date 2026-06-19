import { describe, it, expect } from "vitest";
import { brandToCssVars } from "@/lib/branding";
import type { BrandSettings } from "@prisma/client";

function mockBrand(overrides: Partial<BrandSettings> = {}): Pick<
  BrandSettings,
  "colorPrimary" | "colorSecondary" | "colorAccent" | "colorBg" | "colorText"
> {
  return {
    colorPrimary: "#0a0a0a",
    colorSecondary: "#005fa8",
    colorAccent: "#e10600",
    colorBg: "#ffffff",
    colorText: "#0a0a0a",
    ...overrides,
  };
}

describe("brandToCssVars", () => {
  it("maps all five color fields to CSS custom properties", () => {
    const vars = brandToCssVars(mockBrand());
    expect(vars["--brand-primary"]).toBe("#0a0a0a");
    expect(vars["--brand-secondary"]).toBe("#005fa8");
    expect(vars["--brand-accent"]).toBe("#e10600");
    expect(vars["--brand-bg"]).toBe("#ffffff");
    expect(vars["--brand-text"]).toBe("#0a0a0a");
  });

  it("includes Bauhaus yellow token", () => {
    const vars = brandToCssVars(mockBrand());
    expect(vars["--brand-yellow"]).toBeDefined();
  });

  it("reflects custom color overrides", () => {
    const vars = brandToCssVars(mockBrand({ colorAccent: "#ff0000" }));
    expect(vars["--brand-accent"]).toBe("#ff0000");
  });

  it("produces exactly 6 CSS vars", () => {
    const vars = brandToCssVars(mockBrand());
    expect(Object.keys(vars)).toHaveLength(6);
  });
});
