import Image from "next/image";

type MediaFigureProps = {
  path?: string | null;
  altEn?: string | null;
  captionEn?: string | null;
  priority?: boolean;
  sizes?: string;
  className?: string;
  rounded?: boolean;
};

export function MediaFigure({
  path,
  altEn,
  captionEn,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  rounded = false,
}: MediaFigureProps) {
  const alt = (altEn ?? "").trim();
  const caption = (captionEn ?? "").trim() || undefined;

  if (!path) {
    return (
      <figure className={className}>
        <div
          className={`flex aspect-video w-full items-center justify-center bg-[var(--color-paper-2)] ${rounded ? "" : ""}`}
        >
          <span className="text-sm text-[var(--color-muted)]">No image</span>
        </div>
        {caption ? <figcaption className="mt-2xs text-sm text-[var(--color-muted)]">{caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <figure className={className}>
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-paper-2)]">
        <Image
          src={`/uploads/${path}`}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2xs text-sm text-[var(--color-muted)]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
