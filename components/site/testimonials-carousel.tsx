"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type TestimonialItem = {
  id: string;
  quoteEn: string;
  authorName: string;
  authorRoleEn: string | null;
  org: string | null;
};

export function TestimonialsCarousel({ items }: { items: TestimonialItem[] }) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  if (count === 0) return null;

  const go = (delta: number) => setIndex((p) => (p + delta + count) % count);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        }
      }}
      className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-paper-2)]"
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((t, i) => (
            <figure
              key={t.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              className="w-full shrink-0"
            >
              <blockquote className="max-w-4xl text-balance font-display text-2xl font-bold leading-[1.15] tracking-tight md:text-3xl lg:text-4xl">
                <span aria-hidden="true">“</span>
                {t.quoteEn}
                <span aria-hidden="true">”</span>
              </blockquote>
              <figcaption className="mt-xl flex flex-col gap-3xs border-t border-[var(--color-rule)] pt-md">
                <span className="font-semibold">{t.authorName}</span>
                {t.authorRoleEn && (
                  <span className="text-pretty text-sm text-[var(--color-muted)]">
                    {t.authorRoleEn}
                    {t.org ? ` · ${t.org}` : ""}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-xl flex items-center gap-md">
          <div className="flex gap-2xs">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex size-11 items-center justify-center border border-[var(--color-rule)] text-[var(--color-ink)] transition-colors duration-200 ease-out hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex size-11 items-center justify-center border border-[var(--color-rule)] text-[var(--color-ink)] transition-colors duration-200 ease-out hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
          <p
            className="font-display text-sm font-bold tabular-nums text-[var(--color-muted)]"
            aria-live="polite"
          >
            {String(index + 1).padStart(2, "0")}{" "}
            <span className="text-[var(--color-rule)]">/</span>{" "}
            {String(count).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}
