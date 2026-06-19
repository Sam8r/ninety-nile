import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"] as const,
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
