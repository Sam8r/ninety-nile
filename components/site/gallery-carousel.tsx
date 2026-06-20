"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type GallerySlide = {
  label: string;
  images: { id: string; path: string; altEn: string }[];
};

export function GalleryCarousel({ slides }: { slides: GallerySlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  if (count === 0) return null;

  const go = (delta: number) => setIndex((p) => (p + delta + count) % count);
  const slide = slides[index];

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Project gallery"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      }}
      className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div
              key={s.label}
              aria-roledescription="slide"
              aria-label={`${s.label} — ${i + 1} of ${count}`}
              aria-hidden={i !== index}
              className="w-full shrink-0"
            >
              <p className="mb-lg font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {s.label}
              </p>
              <div className={`grid gap-md ${s.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {s.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-video w-full overflow-hidden bg-[var(--color-paper-2)]"
                  >
                    <Image
                      src={`/uploads/${img.path}`}
                      alt={img.altEn}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-xl flex items-center gap-md">
          <div className="flex gap-2xs">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="flex size-11 items-center justify-center border border-[var(--color-rule)] text-[var(--color-ink)] transition-colors duration-200 ease-out hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="flex size-11 items-center justify-center border border-[var(--color-rule)] text-[var(--color-ink)] transition-colors duration-200 ease-out hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
          <p
            className="font-display text-sm font-bold tabular-nums text-[var(--color-muted)]"
            aria-live="polite"
          >
            {slides[index]?.label}{" "}
            <span className="text-[var(--color-rule)]">·</span>{" "}
            {String(index + 1).padStart(2, "0")}{" "}
            <span className="text-[var(--color-rule)]">/</span>{" "}
            {String(count).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}
