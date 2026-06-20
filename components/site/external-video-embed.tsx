"use client";

import { useState } from "react";
import { Play, ExternalLink as ExternalLinkIcon } from "lucide-react";

type ExternalLink = { label?: string | null; url: string };

type ExternalVideoEmbedProps = {
  links?: ExternalLink[] | null;
  heading?: string;
};

type Parsed =
  | { kind: "youtube" | "vimeo"; embed: string; thumb: string | null }
  | { kind: "link"; embed: null; thumb: null };

function parse(url: string): Parsed {
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
  );
  if (yt) {
    const id = yt[1]!;
    return {
      kind: "youtube",
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return {
      kind: "vimeo",
      embed: `https://player.vimeo.com/video/${vimeo[1]!}?autoplay=1`,
      thumb: null,
    };
  }
  return { kind: "link", embed: null, thumb: null };
}

function VideoItem({ link }: { link: ExternalLink }) {
  const [playing, setPlaying] = useState(false);
  const parsed = parse(link.url);
  const label = link.label || (parsed.kind === "vimeo" ? "Vimeo" : "Watch");

  // Non-embeddable destinations (Instagram, TikTok, etc.) → outbound link.
  if (parsed.kind === "link") {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex aspect-video w-full items-center justify-center gap-2 border border-[var(--color-rule)] bg-[var(--color-paper-2)] text-sm font-semibold text-[var(--color-ink)] transition-colors duration-200 ease-out hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
      >
        <ExternalLinkIcon className="size-4" />
        {label}
      </a>
    );
  }

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden bg-[var(--color-ink)]">
        <iframe
          src={parsed.embed}
          title={label}
          className="size-full"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${label}`}
      className="group relative block aspect-video w-full overflow-hidden bg-[var(--color-ink)]"
    >
      {parsed.thumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={parsed.thumb}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-80 grayscale transition duration-200 ease-out group-hover:scale-[1.02] group-hover:opacity-100 group-hover:grayscale-0"
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-14 items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] transition-transform duration-200 ease-out group-hover:scale-110">
          <Play className="size-5" fill="currentColor" />
        </span>
      </span>
      {link.label && (
        <span className="absolute inset-x-0 bottom-0 bg-[var(--color-ink)]/70 p-sm text-left text-sm font-semibold text-[var(--color-paper)]">
          {link.label}
        </span>
      )}
    </button>
  );
}

export function ExternalVideoEmbed({ links, heading = "Watch" }: ExternalVideoEmbedProps) {
  if (!links || links.length === 0) return null;

  return (
    <div>
      <h2 className="mb-md font-display text-xl font-bold">{heading}</h2>
      <div className={links.length > 1 ? "grid gap-md sm:grid-cols-2" : ""}>
        {links.map((link, i) => (
          <VideoItem key={`${link.url}-${i}`} link={link} />
        ))}
      </div>
    </div>
  );
}
