import { z } from "zod";
import { slugSchema, externalLinksSchema, orderSchema, bilingualPublishErrors } from "@/lib/validation";

export const projectSchema = z.object({
  slug: slugSchema,
  titleEn: z.string().min(1).max(200),
  titleAr: z.string().max(200).optional().default(""),
  descriptionEn: z.string().max(5000).optional().default(""),
  descriptionAr: z.string().max(5000).optional().default(""),
  externalLinks: externalLinksSchema,
  heroMediaId: z.string().uuid().optional().or(z.literal("")),
  order: orderSchema,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export type ProjectInput = z.infer<typeof projectSchema>;

const PUBLISH_PAIRS = [
  ["titleEn", "titleAr"],
  ["descriptionEn", "descriptionAr"],
] as const;

export function validateProjectPublish(input: ProjectInput): Record<string, string[]> {
  const errs = bilingualPublishErrors(input as unknown as Record<string, unknown>, PUBLISH_PAIRS);
  if (errs.length === 0) return {};
  const fieldErrors: Record<string, string[]> = {};
  for (const e of errs) {
    const field = e.split(" ")[0] ?? "_form";
    fieldErrors[field] = ["Required for publishing"];
  }
  return fieldErrors;
}
