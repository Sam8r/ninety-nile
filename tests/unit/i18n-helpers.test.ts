import { describe, it, expect } from "vitest";
import { isLocale, getDir, locales, defaultLocale } from "@/lib/i18n/routing";

describe("isLocale", () => {
  it("returns true for 'en'", () => {
    expect(isLocale("en")).toBe(true);
  });

  it("returns true for 'ar'", () => {
    expect(isLocale("ar")).toBe(true);
  });

  it("returns false for 'fr'", () => {
    expect(isLocale("fr")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isLocale("")).toBe(false);
  });

  it("returns false for 'AR' (case-sensitive)", () => {
    expect(isLocale("AR")).toBe(false);
  });
});

describe("getDir", () => {
  it("returns 'rtl' for Arabic", () => {
    expect(getDir("ar")).toBe("rtl");
  });

  it("returns 'ltr' for English", () => {
    expect(getDir("en")).toBe("ltr");
  });
});

describe("locale constants", () => {
  it("locales includes en and ar", () => {
    expect(locales).toContain("en");
    expect(locales).toContain("ar");
  });

  it("defaultLocale is en", () => {
    expect(defaultLocale).toBe("en");
  });
});
