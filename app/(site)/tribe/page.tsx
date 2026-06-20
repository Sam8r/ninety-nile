import Image from "next/image";
import { prisma } from "@/lib/db";
import { text } from "@/lib/content/text";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = pageMetadata("tribe");

export default async function TribePage() {
  const intro = await prisma.siteContent.findUnique({ where: { key: "TRIBE_INTRO" } });

  return (
    <div className="animate-fade-in">
      <section className="relative isolate flex min-h-svh items-end overflow-hidden">
        <Image
          src="/uploads/curated/page-tribe.jpg"
          alt="Our Tribe"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />
        <div className="container-wide relative pb-3xl pt-[8rem]">
          <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {text(intro?.titleEn, "Tribe")}
          </h1>
          {intro?.bodyEn && (
            <p className="mt-lg max-w-2xl text-pretty text-lg leading-relaxed text-white/80">
              {text(intro.bodyEn)}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
