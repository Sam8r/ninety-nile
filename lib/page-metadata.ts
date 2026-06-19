import type { Metadata } from "next";

const TITLES: Record<string, string> = {
  about: "About",
  services: "Services",
  process: "Creative Process",
  production: "Production",
  experiences: "Brand Experiences",
  tribe: "Our Tribe",
  work: "Our Work",
  community: "Community",
  clients: "Clients",
  contact: "Contact",
};

export function pageMetadata(pageKey: keyof typeof TITLES) {
  return function (): Promise<Metadata> {
    const title = TITLES[pageKey];
    return Promise.resolve(title ? { title } : {});
  };
}
