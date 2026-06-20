import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-[var(--color-rule)]", className)}>
      <div className="container-wide pb-xl pt-[6rem] md:pb-2xl md:pt-[8.5rem]">
        <h1 className="text-balance font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-lg max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-muted)] md:text-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
