import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/routing";

const TITLES: Record<string, { en: string; ar: string }> = {
  about: { en: "About", ar: "من نحن" },
  services: { en: "Services", ar: "خدماتنا" },
  process: { en: "Creative Process", ar: "العملية الإبداعية" },
  production: { en: "Production", ar: "الإنتاج" },
  experiences: { en: "Brand Experiences", ar: "تجارب العلامة" },
  tribe: { en: "Our Tribe", ar: "قبيلتنا" },
  work: { en: "Our Work", ar: "أعمالنا" },
  community: { en: "Community", ar: "المجتمع" },
  clients: { en: "Clients", ar: "العملاء" },
  contact: { en: "Contact", ar: "تواصل" },
};

/** Build per-page metadata without relying on getTranslations (prerender-safe). */
export function pageMetadata(pageKey: keyof typeof TITLES) {
  return async ({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> => {
    const { locale } = await params;
    const loc = (locale === "ar" ? "ar" : "en") as Locale;
    const entry = TITLES[pageKey];
    if (!entry) return {};
    const title = loc === "ar" ? entry.ar : entry.en;
    return { title };
  };
}
