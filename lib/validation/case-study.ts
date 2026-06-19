import { z } from "zod";
import { slugSchema, externalLinksSchema, orderSchema, bilingualPublishErrors } from "@/lib/validation";

export const caseStudySchema = z.object({
  slug: slugSchema,
  titleEn: z.string().min(1).max(200),
  titleAr: z.string().max(200).optional().default(""),
  clientEn: z.string().max(200).optional().default(""),
  clientAr: z.string().max(200).optional().default(""),
  summaryEn: z.string().max(1000).optional().default(""),
  summaryAr: z.string().max(1000).optional().default(""),
  challengeEn: z.string().max(20000).optional().default(""),
  challengeAr: z.string().max(20000).optional().default(""),
  solutionEn: z.string().max(20000).optional().default(""),
  solutionAr: z.string().max(20000).optional().default(""),
  resultsEn: z.string().max(20000).optional().default(""),
  resultsAr: z.string().max(20000).optional().default(""),
  category: z
    .enum(["FILM", "MUSIC_VIDEO", "DOCUMENTARY", "TVC", "ORIGINAL", "CAMPAIGN", "OTHER"])
    .default("OTHER"),
  metrics: z
    .array(
      z.object({
        labelEn: z.string().max(80).default(""),
        labelAr: z.string().max(80).default(""),
        value: z.string().max(40).default(""),
      }),
    )
    .default([]),
  heroMediaId: z.string().uuid().optional().or(z.literal("")),
  galleryMediaIds: z.array(z.string().uuid()).default([]),
  externalLinks: externalLinksSchema,
  order: orderSchema,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export type CaseStudyInput = z.infer<typeof caseStudySchema>;

/** Paired EN/AR fields that must BOTH be present when publishing. */
const PUBLISH_PAIRS = [
  ["titleEn", "titleAr"],
  ["summaryEn", "summaryAr"],
  ["challengeEn", "challengeAr"],
  ["solutionEn", "solutionAr"],
  ["resultsEn", "resultsAr"],
] as const;

/** Returns field-level errors if the publish gate (bilingual parity) fails. */
export function validateCaseStudyPublish(input: CaseStudyInput): Record<string, string[]> {
  const errs = bilingualPublishErrors(input as unknown as Record<string, unknown>, PUBLISH_PAIRS);
  if (errs.length === 0) return {};
  const fieldErrors: Record<string, string[]> = {};
  for (const e of errs) {
    const field = e.split(" ")[0] ?? "_form";
    fieldErrors[field] = ["Required for publishing"];
  }
  return fieldErrors;
}
