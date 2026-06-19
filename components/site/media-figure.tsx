import Image from "next/image";
import type { Locale } from "@/lib/i18n/routing";

type MediaFigureProps = {
  path?: string | null;
  altEn?: string | null;
  altAr?: string | null;
  locale: Locale;
  captionEn?: string | null;
  captionAr?: string | null;
  priority?: boolean;
  sizes?: string;
  className?: string;
  rounded?: boolean;
};

export function MediaFigure({
  path,
  altEn,
  altAr,
  locale,
  captionEn,
  captionAr,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  rounded = true,
}: MediaFigureProps) {
  const alt = (locale === "ar" ? altAr ?? altEn : altEn) ?? "";
  const caption = locale === "ar" ? captionAr ?? captionEn : captionEn;

  if (!path) {
    return (
      <figure className={className}>
        <div
          className={`flex aspect-video w-full items-center justify-center bg-muted ${rounded ? "rounded-lg" : ""}`}
        >
          <span className="text-sm text-muted-foreground">No image</span>
        </div>
        {caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <figure className={className}>
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={`/uploads/${path}`}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${rounded ? "rounded-lg" : ""}`}
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
