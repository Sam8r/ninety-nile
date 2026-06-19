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
            className="inline-flex items-center gap-2 border-2 border-black bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-shadow hover:shadow-[4px_4px_0_0_#000]"
          >
            <Play className="size-4" />
            {label}
          </a>
        );
      })}
    </div>
  );
}
