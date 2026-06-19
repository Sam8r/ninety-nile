import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { locales } from "@/lib/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/about", "/services", "/process", "/production", "/experiences", "/tribe", "/work", "/community", "/clients", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}${path}`])),
        },
      });
    }
  }

  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    for (const cs of caseStudies) {
      for (const locale of locales) {
        entries.push({
          url: `${BASE_URL}/${locale}/work/${cs.slug}`,
          lastModified: cs.updatedAt,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  } catch {
    // DB unavailable — return static paths only
  }

  return entries;
}
