/**
 * English-only content helpers (replaces the former bilingual localize()).
 * Returns the English value directly; AR columns are deprecated.
 */
export function text(
  en: string | null | undefined,
  fallback = "",
): string {
  return (en ?? fallback).trim();
}

export function textArr(
  en: string[] | null | undefined,
): string[] {
  return en ?? [];
}
