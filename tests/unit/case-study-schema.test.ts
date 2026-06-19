import { describe, it, expect } from "vitest";
import { caseStudySchema, validateCaseStudyPublish } from "@/lib/validation/case-study";

const validDraft = {
  slug: "test-case-study",
  titleEn: "Test Case Study",
  status: "DRAFT" as const,
};

describe("caseStudySchema", () => {
  it("accepts a minimal draft", () => {
    const parsed = caseStudySchema.safeParse(validDraft);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid slug (not kebab-case)", () => {
    const parsed = caseStudySchema.safeParse({ ...validDraft, slug: "Not Valid!" });
    expect(parsed.success).toBe(false);
  });

  it("rejects slug too short", () => {
    const parsed = caseStudySchema.safeParse({ ...validDraft, slug: "a" });
    expect(parsed.success).toBe(false);
  });

  it("rejects title over 200 chars", () => {
    const parsed = caseStudySchema.safeParse({
      ...validDraft,
      titleEn: "x".repeat(201),
    });
    expect(parsed.success).toBe(false);
  });

  it("defaults category to OTHER", () => {
    const parsed = caseStudySchema.safeParse(validDraft);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.category).toBe("OTHER");
    }
  });

  it("accepts all valid categories", () => {
    for (const cat of ["FILM", "MUSIC_VIDEO", "DOCUMENTARY", "TVC", "ORIGINAL", "CAMPAIGN", "OTHER"]) {
      const parsed = caseStudySchema.safeParse({ ...validDraft, category: cat });
      expect(parsed.success).toBe(true);
    }
  });

  it("rejects unknown category", () => {
    const parsed = caseStudySchema.safeParse({ ...validDraft, category: "INVALID" });
    expect(parsed.success).toBe(false);
  });
});

describe("validateCaseStudyPublish", () => {
  it("returns no errors for a fully bilingual published case study", () => {
    const input = caseStudySchema.parse({
      ...validDraft,
      status: "PUBLISHED",
      titleAr: "دراسة حالة",
      summaryEn: "Summary",
      summaryAr: "ملخص",
      challengeEn: "Challenge",
      challengeAr: "تحدي",
      solutionEn: "Solution",
      solutionAr: "حل",
      resultsEn: "Results",
      resultsAr: "نتائج",
    });
    expect(validateCaseStudyPublish(input)).toEqual({});
  });

  it("flags missing Arabic title when publishing", () => {
    const input = caseStudySchema.parse({
      ...validDraft,
      status: "PUBLISHED",
      titleAr: "",
    });
    const errors = validateCaseStudyPublish(input);
    expect(errors.titleAr).toBeDefined();
  });

  it("flags missing English summary when publishing", () => {
    const input = caseStudySchema.parse({
      ...validDraft,
      status: "PUBLISHED",
      titleAr: "دراسة",
      summaryEn: "",
    });
    const errors = validateCaseStudyPublish(input);
    expect(errors.summaryEn).toBeDefined();
  });

  it("does NOT enforce bilingual parity for drafts", () => {
    const input = caseStudySchema.parse({
      ...validDraft,
      status: "DRAFT",
      titleAr: "",
    });
    expect(validateCaseStudyPublish(input)).toEqual({});
  });

  it("flags all missing paired fields when publishing with only English", () => {
    const input = caseStudySchema.parse({
      ...validDraft,
      status: "PUBLISHED",
      titleAr: "",
      summaryEn: "Summary",
      summaryAr: "",
      challengeEn: "Challenge",
      challengeAr: "",
      solutionEn: "Solution",
      solutionAr: "",
      resultsEn: "Results",
      resultsAr: "",
    });
    const errors = validateCaseStudyPublish(input);
    expect(Object.keys(errors).sort()).toEqual(
      ["challengeAr", "resultsAr", "solutionAr", "summaryAr", "titleAr"].sort(),
    );
  });
});
