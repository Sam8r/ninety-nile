import { z } from "zod";
import { hexColorSchema, uuidSchema } from "@/lib/validation";

export const brandSettingsSchema = z.object({
  siteNameEn: z.string().min(1).max(100),
  siteNameAr: z.string().max(100).optional().default(""),
  taglineEn: z.string().min(1).max(200),
  taglineAr: z.string().max(200).optional().default(""),
  secondaryTaglineEn: z.string().max(200).optional().default(""),
  secondaryTaglineAr: z.string().max(200).optional().default(""),
  logoPrimaryId: uuidSchema.optional().or(z.literal("")),
  logoAltId: uuidSchema.optional().or(z.literal("")),
  logoMarkId: uuidSchema.optional().or(z.literal("")),
  colorPrimary: hexColorSchema,
  colorSecondary: hexColorSchema,
  colorAccent: hexColorSchema,
  colorBg: hexColorSchema,
  colorText: hexColorSchema,
  fontHeading: z.string().max(80).default("Inter"),
  fontBody: z.string().max(80).default("Inter"),
});

export type BrandSettingsInput = z.infer<typeof brandSettingsSchema>;

export const contactDetailsSchema = z.object({
  email: z.string().email().max(200).optional().or(z.literal("")),
  phone: z.string().max(60).optional().default(""),
  website: z.string().max(200).optional().default(""),
  instagram: z.string().max(200).optional().default(""),
  tiktok: z.string().max(200).optional().default(""),
  addressesEn: z.array(z.string().max(200)).default([]),
  addressesAr: z.array(z.string().max(200)).default([]),
});

export type ContactDetailsInput = z.infer<typeof contactDetailsSchema>;

export const siteContentSchema = z.object({
  titleEn: z.string().max(200).optional().default(""),
  titleAr: z.string().max(200).optional().default(""),
  bodyEn: z.string().max(20000).optional().default(""),
  bodyAr: z.string().max(20000).optional().default(""),
  mediaId: uuidSchema.optional().or(z.literal("")),
});

export type SiteContentInput = z.infer<typeof siteContentSchema>;

export const serviceSchema = z.object({
  nameEn: z.string().min(1).max(120),
  nameAr: z.string().max(120).optional().default(""),
  descriptionEn: z.string().max(2000).optional().default(""),
  descriptionAr: z.string().max(2000).optional().default(""),
  icon: z.string().max(40).optional().default(""),
  order: z.number().int().min(0).default(0),
});

export const processStepSchema = z.object({
  labelEn: z.string().min(1).max(120),
  labelAr: z.string().max(120).optional().default(""),
  descriptionEn: z.string().max(2000).optional().default(""),
  descriptionAr: z.string().max(2000).optional().default(""),
  order: z.number().int().min(0).default(0),
});

export const productionPhaseSchema = z.object({
  nameEn: z.string().min(1).max(120),
  nameAr: z.string().max(120).optional().default(""),
  bodyEn: z.string().max(20000).optional().default(""),
  bodyAr: z.string().max(20000).optional().default(""),
  order: z.number().int().min(0).default(0),
});

export const equipmentItemSchema = z.object({
  labelEn: z.string().min(1).max(120),
  labelAr: z.string().max(120).optional().default(""),
  order: z.number().int().min(0).default(0),
});

export const teamMemberSchema = z.object({
  nameEn: z.string().min(1).max(120),
  nameAr: z.string().max(120).optional().default(""),
  roleEn: z.string().max(120).optional().default(""),
  roleAr: z.string().max(120).optional().default(""),
  bioEn: z.string().max(5000).optional().default(""),
  bioAr: z.string().max(5000).optional().default(""),
  photoId: uuidSchema.optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const clientSchema = z.object({
  name: z.string().min(1).max(120),
  url: z.string().max(300).optional().default(""),
  logoId: uuidSchema.optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
});

export const testimonialSchema = z.object({
  quoteEn: z.string().min(1).max(2000),
  quoteAr: z.string().max(2000).optional().default(""),
  authorName: z.string().min(1).max(120),
  authorRoleEn: z.string().max(200).optional().default(""),
  authorRoleAr: z.string().max(200).optional().default(""),
  org: z.string().max(120).optional().default(""),
  order: z.number().int().min(0).default(0),
});
