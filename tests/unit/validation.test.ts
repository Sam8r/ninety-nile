import { describe, it, expect } from "vitest";
import { slugSchema, hexColorSchema, urlSchema, sanitizeRichText, bilingualPublishErrors } from "@/lib/validation";

describe("slugSchema", () => {
  it("accepts valid kebab-case", () => {
    expect(slugSchema.safeParse("hello-world").success).toBe(true);
    expect(slugSchema.safeParse("a1-b2-c3").success).toBe(true);
  });

  it("rejects uppercase", () => {
    expect(slugSchema.safeParse("Hello-World").success).toBe(false);
  });

  it("rejects spaces", () => {
    expect(slugSchema.safeParse("hello world").success).toBe(false);
  });

  it("rejects leading/trailing hyphens", () => {
    expect(slugSchema.safeParse("-hello").success).toBe(false);
    expect(slugSchema.safeParse("hello-").success).toBe(false);
  });

  it("rejects too short", () => {
    expect(slugSchema.safeParse("a").success).toBe(false);
  });
});

describe("hexColorSchema", () => {
  it("accepts 6-digit hex", () => {
    expect(hexColorSchema.safeParse("#e8722a").success).toBe(true);
  });

  it("accepts 3-digit hex", () => {
    expect(hexColorSchema.safeParse("#fff").success).toBe(true);
  });

  it("accepts uppercase hex", () => {
    expect(hexColorSchema.safeParse("#AABBCC").success).toBe(true);
  });

  it("rejects without hash", () => {
    expect(hexColorSchema.safeParse("e8722a").success).toBe(false);
  });

  it("rejects 4-digit hex", () => {
    expect(hexColorSchema.safeParse("#ffff").success).toBe(false);
  });
});

describe("urlSchema", () => {
  it("accepts valid URLs", () => {
    expect(urlSchema.safeParse("https://example.com").success).toBe(true);
  });

  it("accepts empty string", () => {
    expect(urlSchema.safeParse("").success).toBe(true);
  });

  it("rejects plain text", () => {
    expect(urlSchema.safeParse("not a url").success).toBe(false);
  });
});

describe("sanitizeRichText", () => {
  it("strips <script> tags", () => {
    const input = '<p>hello</p><script>alert("xss")</script>';
    expect(sanitizeRichText(input)).toBe('<p>hello</p>');
  });

  it("strips on* event handlers", () => {
    const input = '<img src="x" onerror="alert(1)">';
    const result = sanitizeRichText(input);
    expect(result).not.toContain("onerror");
  });

  it("neutralizes javascript: URIs in href", () => {
    const input = '<a href="javascript:alert(1)">click</a>';
    const result = sanitizeRichText(input);
    expect(result).not.toContain("javascript:");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeRichText("")).toBe("");
  });

  it("preserves safe content", () => {
    const input = "<p>Hello <strong>world</strong></p>";
    expect(sanitizeRichText(input)).toBe(input);
  });
});

describe("bilingualPublishErrors", () => {
  it("returns no errors when both EN and AR are present and publishing", () => {
    const result = bilingualPublishErrors(
      { status: "PUBLISHED", titleEn: "Hello", titleAr: "مرحبا" },
      [["titleEn", "titleAr"]],
    );
    expect(result).toHaveLength(0);
  });

  it("flags missing AR field when publishing", () => {
    const result = bilingualPublishErrors(
      { status: "PUBLISHED", titleEn: "Hello", titleAr: "" },
      [["titleEn", "titleAr"]],
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("titleAr");
  });

  it("does NOT flag missing fields when draft", () => {
    const result = bilingualPublishErrors(
      { status: "DRAFT", titleEn: "Hello", titleAr: "" },
      [["titleEn", "titleAr"]],
    );
    expect(result).toHaveLength(0);
  });

  it("flags both EN and AR when both empty", () => {
    const result = bilingualPublishErrors(
      { status: "PUBLISHED", titleEn: "  ", titleAr: "" },
      [["titleEn", "titleAr"]],
    );
    expect(result).toHaveLength(2);
  });
});
