import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, getDir, isLocale, type Locale } from "@/lib/i18n/routing";
import { getBrandTokens, brandStyle } from "@/lib/branding";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const brand = await getBrandTokens();
  const title = locale === "ar" ? brand.siteNameAr : brand.siteNameEn;
  return {
    title: { default: `${title} — ${brand.taglineEn}`, template: `%s | ${title}` },
    description: brand.secondaryTaglineEn ?? brand.taglineEn,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    openGraph: {
      title: `${title} — ${brand.taglineEn}`,
      description: brand.secondaryTaglineEn ?? brand.taglineEn,
      locale: locale === "ar" ? "ar_SD" : "en_US",
      type: "website",
    },
    alternates: {
      languages: { en: "/en", ar: "/ar" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const brand = await getBrandTokens();
  const dir = getDir(locale as Locale);

  return (
    <html lang={locale} dir={dir} className={inter.variable} suppressHydrationWarning>
      <body style={brandStyle(brand)}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
