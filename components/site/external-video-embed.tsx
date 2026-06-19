import { Play } from "lucide-react";

type ExternalLink = { label?: string | null; url: string };

type ExternalVideoEmbedProps = {
  links?: ExternalLink[] | null;
  posterEn?: string | null;
};

function isYouTube(url: string): { id: string } | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m ? { id: m[1]! } : null;
}

/**
 * Case-study videos are embedded from external platforms (YouTube/Instagram/TikTok)
 * per the agency profile — the site stores posters/thumbnails, not video files.
 * Renders a list of "Watch on…" links (privacy-friendly, no third-party JS).
 */
export function ExternalVideoEmbed({ links }: ExternalVideoEmbedProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link, i) => {
        const yt = isYouTube(link.url);
        const label = link.label || (yt ? "YouTube" : "Watch");
        return (
          <a
            key={`${link.url}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            <Play className="size-4" />
            {label}
          </a>
        );
      })}
    </div>
  );
}
