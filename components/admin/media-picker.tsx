"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

type Asset = {
  id: string;
  url: string;
  filename: string;
  width?: number;
  height?: number;
};

export function MediaPicker({
  value,
  onChange,
  label = "Image",
  multiple = false,
}: {
  value: string | string[];
  onChange: (id: string | string[]) => void;
  label?: string;
  multiple?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, Asset>>({});

  const ids = Array.isArray(value) ? value : value ? [value] : [];

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    startTransition(async () => {
      const uploaded: Asset[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/media", { method: "POST", body: formData });
        const data = await res.json();
        if (!data.ok) {
          setError(data.code || "Upload failed");
          return;
        }
        uploaded.push(data.asset);
      }
      if (uploaded.length === 0) return;

      const newPreviews = { ...previews };
      for (const a of uploaded) newPreviews[a.id] = a;
      setPreviews(newPreviews);

      if (multiple) {
        onChange([...ids, ...uploaded.map((a) => a.id)]);
      } else {
        onChange(uploaded[0]!.id);
      }
      e.target.value = "";
    });
  }

  function remove(id: string) {
    if (multiple) {
      onChange(ids.filter((x) => x !== id));
    } else {
      onChange("");
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-3">
        {ids.map((id) => {
          const asset = previews[id];
          return (
            <div
              key={id}
              className="group relative h-24 w-32 overflow-hidden rounded-md border bg-muted"
            >
              {asset && (
                <Image
                  src={asset.url}
                  alt={asset.filename}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => remove(id)}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="size-3" />
              </button>
            </div>
          );
        })}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => document.getElementById(`media-upload-${label}`)?.click()}
      >
        <Upload className="size-4" />
        {isPending ? "Uploading…" : "Upload"}
      </Button>
      <input
        id={`media-upload-${label}`}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple={multiple}
        className="hidden"
        onChange={onUpload}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
