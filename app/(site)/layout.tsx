import type { Metadata } from "next";
import { getBrandTokens, brandStyle } from "@/lib/branding";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandTokens();
  const title = brand.siteNameEn;
  return {
    title: { default: `${title} — ${brand.taglineEn}`, template: `%s | ${title}` },
    description: brand.secondaryTaglineEn ?? brand.taglineEn,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    openGraph: {
      title: `${title} — ${brand.taglineEn}`,
      description: brand.secondaryTaglineEn ?? brand.taglineEn,
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const brand = await getBrandTokens();
  return (
    <div style={brandStyle(brand)} className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
