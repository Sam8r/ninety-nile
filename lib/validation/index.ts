import { z } from "zod";

export const slugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(80, "Slug must be 80 characters or fewer")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case (lowercase, hyphen-separated)");

export const hexColorSchema = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex color, e.g. #e8722a or #fff");

export const uuidSchema = z.string().uuid("Must be a valid UUID");

export const urlSchema = z
  .string()
  .url("Must be a valid URL")
  .max(500)
  .or(z.literal(""));

export const externalLinkSchema = z.object({
  label: z.string().min(1).max(80),
  url: z.string().url("Must be a valid URL").max(500),
});

export const externalLinksSchema = z.array(externalLinkSchema).default([]);

export const orderSchema = z.number().int().min(0).default(0);

/**
 * Enforce English content completeness on publish: every required English
 * field must be non-empty when status === "PUBLISHED" (English-only redesign).
 *
 * `fields` is a list of field keys pointing at string fields on the parsed
 * value. Returns a list of human-readable error paths.
 */
export function publishErrors<T extends Record<string, unknown>>(
  parsed: T,
  fields: readonly string[],
): string[] {
  const errors: string[] = [];
  const isPublishing = parsed.status === "PUBLISHED";
  if (!isPublishing) return errors;
  for (const key of fields) {
    const val = typeof parsed[key] === "string" ? (parsed[key] as string).trim() : "";
    if (!val) errors.push(`${key} (required for publish)`);
  }
  return errors;
}

/** @deprecated Use publishErrors() — English-only redesign. */
export const bilingualPublishErrors = publishErrors;

export const sanitizeRichText = (raw: string): string => {
  if (!raw) return "";
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, "$1=$2#$2");
};

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; code: string; errors?: Record<string, string[]> | string[] };

export function ok<T>(data: T): ActionResult<T> & { ok: true } {
  return { ok: true, data };
}

export function fail(
  code: string,
  errors?: Record<string, string[]> | string[],
): ActionResult<never> & { ok: false } {
  return { ok: false, code, errors };
}
