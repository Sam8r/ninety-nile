import type { Locale } from "@/lib/i18n/routing";

/**
 * Pick the localized value for a paired EN/AR field.
 * Falls back to English (then optional fallback) when AR is missing.
 */
export function localize(
  en: string | null | undefined,
  ar: string | null | undefined,
  locale: Locale,
  fallback = "",
): string {
  if (locale === "ar") return (ar ?? en ?? fallback).trim();
  return (en ?? fallback).trim();
}

export function localizeArr(
  en: string[] | null,
  ar: string[] | null,
  locale: Locale,
): string[] {
  if (locale === "ar") return ar ?? en ?? [];
  return en ?? [];
}
