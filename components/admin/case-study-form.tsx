"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/components/admin/media-picker";
import { createCaseStudy, updateCaseStudy } from "@/lib/actions/case-studies";
import type { CaseStudyInput } from "@/lib/validation/case-study";
import { Plus, Trash2 } from "lucide-react";

const CATEGORIES = ["FILM", "MUSIC_VIDEO", "DOCUMENTARY", "TVC", "ORIGINAL", "CAMPAIGN", "OTHER"];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

type Props = {
  id?: string;
  initial?: Partial<CaseStudyInput>;
};

const EMPTY: CaseStudyInput = {
  slug: "",
  titleEn: "",
  titleAr: "",
  clientEn: "",
  clientAr: "",
  summaryEn: "",
  summaryAr: "",
  challengeEn: "",
  challengeAr: "",
  solutionEn: "",
  solutionAr: "",
  resultsEn: "",
  resultsAr: "",
  category: "OTHER",
  metrics: [],
  heroMediaId: "",
  galleryMediaIds: [],
  externalLinks: [],
  order: 0,
  status: "DRAFT",
};

export function CaseStudyForm({ id, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<CaseStudyInput>({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  function set<K extends keyof CaseStudyInput>(key: K, value: CaseStudyInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function autoSlug(titleEn: string) {
    if (!form.slug || form.slug === slugify(initial?.titleEn ?? "")) {
      set("slug", slugify(titleEn));
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);
    startTransition(async () => {
      const res = id
        ? await updateCaseStudy(id, form)
        : await createCaseStudy(form);
      if (!res.ok) {
        if (res.code === "VALIDATION_ERROR") {
          setErrors((res.errors as Record<string, string[]>) ?? {});
        } else if (res.code === "SLUG_TAKEN") {
          setErrors((res.errors as Record<string, string[]>) ?? {});
        } else {
          setGlobalError(res.code);
        }
        return;
      }
      router.push("/admin/case-studies");
      router.refresh();
    });
  }

  const inputCls = "mt-1";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Bilingual core */}
      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-1 font-heading text-sm font-semibold">Basics</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="titleEn">Title *</Label>
            <Input
              id="titleEn"
              required
              value={form.titleEn}
              onChange={(e) => {
                set("titleEn", e.target.value);
                autoSlug(e.target.value);
              }}
              className={inputCls}
            />
            {errors.titleEn && <p className="mt-1 text-xs text-destructive">{errors.titleEn}</p>}
          </div>
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              required
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              className={inputCls}
            />
            {errors.slug && <p className="mt-1 text-xs text-destructive">{errors.slug}</p>}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => set("category", e.target.value as CaseStudyInput["category"])}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="clientEn">Client</Label>
            <Input id="clientEn" value={form.clientEn} onChange={(e) => set("clientEn", e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <Label htmlFor="summaryEn">Summary</Label>
          <Textarea id="summaryEn" value={form.summaryEn} onChange={(e) => set("summaryEn", e.target.value)} className={inputCls} />
        </div>
      </fieldset>

      {/* Body sections */}
      {(["challenge", "solution", "results"] as const).map((section) => (
        <fieldset key={section} className="space-y-4 rounded-lg border p-4">
          <legend className="px-1 font-heading text-sm font-semibold capitalize">{section}</legend>
          <div>
            <Label htmlFor={`${section}En`} className="capitalize">{section}</Label>
            <Textarea
              id={`${section}En`}
              rows={6}
              value={form[`${section}En`]}
              onChange={(e) => set(`${section}En`, e.target.value)}
              className={inputCls}
            />
          </div>
        </fieldset>
      ))}

      {/* Metrics */}
      <fieldset className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <legend className="px-1 font-heading text-sm font-semibold">Metrics</legend>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => set("metrics", [...form.metrics, { labelEn: "", labelAr: "", value: "" }])}
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        {form.metrics.map((metric, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2">
            <div>
              <Label>Label</Label>
              <Input
                value={metric.labelEn}
                onChange={(e) => {
                  const next = [...form.metrics];
                  next[i] = { ...next[i]!, labelEn: e.target.value };
                  set("metrics", next);
                }}
              />
            </div>
            <div>
              <Label>Value</Label>
              <Input
                value={metric.value}
                onChange={(e) => {
                  const next = [...form.metrics];
                  next[i] = { ...next[i]!, value: e.target.value };
                  set("metrics", next);
                }}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => set("metrics", form.metrics.filter((_, j) => j !== i))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </fieldset>

      {/* Media */}
      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-1 font-heading text-sm font-semibold">Media</legend>
        <MediaPicker label="Hero image" value={form.heroMediaId ?? ""} onChange={(v) => set("heroMediaId", (v as string) || "")} />
        <MediaPicker label="Gallery" multiple value={form.galleryMediaIds} onChange={(v) => set("galleryMediaIds", v as string[])} />
      </fieldset>

      {/* External links */}
      <fieldset className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <legend className="px-1 font-heading text-sm font-semibold">External links</legend>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => set("externalLinks", [...form.externalLinks, { label: "", url: "" }])}
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        {form.externalLinks.map((link, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2">
            <div>
              <Label>Label</Label>
              <Input
                value={link.label}
                onChange={(e) => {
                  const next = [...form.externalLinks];
                  next[i] = { ...next[i]!, label: e.target.value };
                  set("externalLinks", next);
                }}
              />
            </div>
            <div className="min-w-[16rem] flex-1">
              <Label>URL</Label>
              <Input
                value={link.url}
                onChange={(e) => {
                  const next = [...form.externalLinks];
                  next[i] = { ...next[i]!, url: e.target.value };
                  set("externalLinks", next);
                }}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => set("externalLinks", form.externalLinks.filter((_, j) => j !== i))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </fieldset>

      {/* Status & order */}
      <fieldset className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
        <legend className="px-1 font-heading text-sm font-semibold">Publishing</legend>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => set("status", e.target.value as CaseStudyInput["status"])}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        <div>
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            min={0}
            value={form.order}
            onChange={(e) => set("order", Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </fieldset>

      {globalError && (
        <p className="text-sm font-medium text-destructive">{globalError}</p>
      )}

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
