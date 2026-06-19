import Image from "next/image";

/**
 * Static fallback for the river hero — shown when prefers-reduced-motion
 * is set or WebGL2 is unavailable. Uses the curated PDF hero image.
 */
export function RiverFallback({
  src = "/media/curated/hero-river.jpg",
  className,
}: {
  src?: string;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className ?? ""}`}>
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      {/* Bauhaus accent overlay for brand cohesion */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
}
