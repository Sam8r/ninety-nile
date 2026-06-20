import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about",
    "/services",
    "/tribe",
    "/work",
    "/clients",
    "/contact",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const caseStudies = await prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    for (const cs of caseStudies) {
      entries.push({
        url: `${BASE_URL}/work/${cs.slug}`,
        lastModified: cs.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  } catch {
    // DB unavailable — return static paths only
  }

  return entries;
}
