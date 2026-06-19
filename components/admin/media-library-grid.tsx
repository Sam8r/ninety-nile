"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

type Asset = {
  id: string;
  path: string;
  filename: string;
  altEn: string | null;
  createdAt: string;
};

export function MediaLibraryGrid({ assets }: { assets: Asset[] }) {
  const router = useRouter();
  const [isUploading, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);
    startUpload(async () => {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/media", { method: "POST", body: formData });
        const data = await res.json();
        if (!data.ok) {
          setError(data.code || "Upload failed");
          break;
        }
      }
      e.target.value = "";
      router.refresh();
    });
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this asset? It will be removed from all references.")) return;
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.code === "IN_USE") {
      alert("This asset is in use. Remove references first, or force-delete as admin.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="accent"
          disabled={isUploading}
          onClick={() => document.getElementById("media-library-upload")?.click()}
        >
          <Upload className="size-4" />
          {isUploading ? "Uploading…" : "Upload"}
        </Button>
        <input
          id="media-library-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          className="hidden"
          onChange={onUpload}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {assets.length === 0 ? (
        <p className="text-sm text-muted-foreground">No media yet. Upload some images.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {assets.map((asset) => (
            <div key={asset.id} className="group relative overflow-hidden rounded-lg border bg-muted">
              <div className="relative aspect-square">
                <Image
                  src={`/uploads/${asset.path}`}
                  alt={asset.altEn ?? asset.filename}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-muted-foreground">{asset.filename}</p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(asset.id)}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
