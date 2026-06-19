"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/components/admin/media-picker";
import { createProject, updateProject } from "@/lib/actions/projects";
import type { ProjectInput } from "@/lib/validation/project";

const EMPTY: ProjectInput = {
  slug: "",
  titleEn: "",
  titleAr: "",
  descriptionEn: "",
  descriptionAr: "",
  externalLinks: [],
  heroMediaId: "",
  order: 0,
  status: "DRAFT",
};

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-");
}

export function ProjectForm({ id, initial }: { id?: string; initial?: Partial<ProjectInput> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<ProjectInput>({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  function set<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    startTransition(async () => {
      const res = id ? await updateProject(id, form) : await createProject(form);
      if (!res.ok) {
        if (res.code === "VALIDATION_ERROR" || res.code === "SLUG_TAKEN") {
          setErrors((res.errors as Record<string, string[]>) ?? {});
        }
        return;
      }
      router.push("/admin/projects");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="titleEn">Title (English) *</Label>
          <Input
            id="titleEn"
            required
            value={form.titleEn}
            onChange={(e) => {
              set("titleEn", e.target.value);
              if (!form.slug) set("slug", slugify(e.target.value));
            }}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="titleAr">Title (Arabic)</Label>
          <Input
            id="titleAr"
            value={form.titleAr}
            onChange={(e) => set("titleAr", e.target.value)}
            dir="rtl"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            required
            value={form.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            className="mt-1"
          />
          {errors.slug && <p className="mt-1 text-xs text-destructive">{errors.slug}</p>}
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => set("status", e.target.value as ProjectInput["status"])}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="descriptionEn">Description (English)</Label>
          <Textarea
            id="descriptionEn"
            rows={5}
            value={form.descriptionEn}
            onChange={(e) => set("descriptionEn", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="descriptionAr">Description (Arabic)</Label>
          <Textarea
            id="descriptionAr"
            rows={5}
            dir="rtl"
            value={form.descriptionAr}
            onChange={(e) => set("descriptionAr", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <MediaPicker label="Hero image" value={form.heroMediaId ?? ""} onChange={(v) => set("heroMediaId", (v as string) || "")} />

      <div className="flex items-end gap-4">
        <div>
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            min={0}
            value={form.order}
            onChange={(e) => set("order", Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="accent" disabled={isPending}>
          {isPending ? "Saving…" : id ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
