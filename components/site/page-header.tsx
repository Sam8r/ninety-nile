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
    <section
      className={cn(
        "border-b border-border/60 bg-gradient-to-b from-secondary/40 to-background",
        className,
      )}
    >
      <div className="container-wide py-16 text-center md:py-24">
        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
