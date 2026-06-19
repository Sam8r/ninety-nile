"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaPicker } from "@/components/admin/media-picker";
import { updateBrandSettings } from "@/lib/actions/branding";
import type { BrandSettingsInput } from "@/lib/validation/settings";
import type { BrandSettings } from "@prisma/client";

export function BrandingForm({ initial }: { initial: BrandSettings | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<BrandSettingsInput>({
    siteNameEn: initial?.siteNameEn ?? "",
    siteNameAr: initial?.siteNameAr ?? "",
    taglineEn: initial?.taglineEn ?? "",
    taglineAr: initial?.taglineAr ?? "",
    secondaryTaglineEn: initial?.secondaryTaglineEn ?? "",
    secondaryTaglineAr: initial?.secondaryTaglineAr ?? "",
    logoPrimaryId: initial?.logoPrimaryId ?? "",
    logoAltId: initial?.logoAltId ?? "",
    logoMarkId: initial?.logoMarkId ?? "",
    colorPrimary: initial?.colorPrimary ?? "#1a202c",
    colorSecondary: initial?.colorSecondary ?? "#0e7490",
    colorAccent: initial?.colorAccent ?? "#e8722a",
    colorBg: initial?.colorBg ?? "#faf8f4",
    colorText: initial?.colorText ?? "#1a202c",
    fontHeading: initial?.fontHeading ?? "Inter",
    fontBody: initial?.fontBody ?? "Inter",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  function set<K extends keyof BrandSettingsInput>(key: K, value: BrandSettingsInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    startTransition(async () => {
      const res = await updateBrandSettings(form);
      if (!res.ok) {
        if (res.code === "VALIDATION_ERROR") setErrors((res.errors as Record<string, string[]>) ?? {});
        return;
      }
      router.refresh();
    });
  }

  const colors: Array<{ key: keyof BrandSettingsInput; label: string }> = [
    { key: "colorPrimary", label: "Primary" },
    { key: "colorSecondary", label: "Secondary" },
    { key: "colorAccent", label: "Accent" },
    { key: "colorBg", label: "Background" },
    { key: "colorText", label: "Text" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Identity */}
      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-1 font-heading text-sm font-semibold">Identity</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="siteNameEn">Site name (English) *</Label>
            <Input id="siteNameEn" required value={form.siteNameEn} onChange={(e) => set("siteNameEn", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="siteNameAr">Site name (Arabic)</Label>
            <Input id="siteNameAr" dir="rtl" value={form.siteNameAr} onChange={(e) => set("siteNameAr", e.target.value)} className="mt-1" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="taglineEn">Tagline (English) *</Label>
            <Input id="taglineEn" required value={form.taglineEn} onChange={(e) => set("taglineEn", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="taglineAr">Tagline (Arabic)</Label>
            <Input id="taglineAr" dir="rtl" value={form.taglineAr} onChange={(e) => set("taglineAr", e.target.value)} className="mt-1" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="secondaryTaglineEn">Secondary tagline (English)</Label>
            <Input id="secondaryTaglineEn" value={form.secondaryTaglineEn} onChange={(e) => set("secondaryTaglineEn", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="secondaryTaglineAr">Secondary tagline (Arabic)</Label>
            <Input id="secondaryTaglineAr" dir="rtl" value={form.secondaryTaglineAr} onChange={(e) => set("secondaryTaglineAr", e.target.value)} className="mt-1" />
          </div>
        </div>
      </fieldset>

      {/* Colors */}
      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-1 font-heading text-sm font-semibold">Brand colors</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map(({ key, label }) => (
            <div key={key}>
              <Label htmlFor={key}>{label}</Label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id={key}
                  type="color"
                  value={form[key] as string}
                  onChange={(e) => set(key, e.target.value as BrandSettingsInput[typeof key])}
                  className="size-10 cursor-pointer rounded border"
                />
                <Input value={form[key] as string} onChange={(e) => set(key, e.target.value as BrandSettingsInput[typeof key])} className="flex-1" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg p-4" style={{ background: form.colorBg, color: form.colorText }}>
          <p className="font-heading text-lg font-bold" style={{ color: form.colorPrimary }}>
            {form.siteNameEn || "Preview"}
          </p>
          <p className="text-sm" style={{ color: form.colorAccent }}>
            {form.taglineEn || "Tagline preview"}
          </p>
        </div>
      </fieldset>

      {/* Logos */}
      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-1 font-heading text-sm font-semibold">Logos</legend>
        <MediaPicker label="Primary logo" value={form.logoPrimaryId ?? ""} onChange={(v) => set("logoPrimaryId", (v as string) || "")} />
        <MediaPicker label="Alternate logo" value={form.logoAltId ?? ""} onChange={(v) => set("logoAltId", (v as string) || "")} />
        <MediaPicker label="Logo mark" value={form.logoMarkId ?? ""} onChange={(v) => set("logoMarkId", (v as string) || "")} />
      </fieldset>

      {/* Fonts */}
      <fieldset className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
        <legend className="px-1 font-heading text-sm font-semibold">Typography</legend>
        <div>
          <Label htmlFor="fontHeading">Heading font</Label>
          <Input id="fontHeading" value={form.fontHeading} onChange={(e) => set("fontHeading", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="fontBody">Body font</Label>
          <Input id="fontBody" value={form.fontBody} onChange={(e) => set("fontBody", e.target.value)} className="mt-1" />
        </div>
      </fieldset>

      {Object.keys(errors).length > 0 && (
        <p className="text-sm font-medium text-destructive">
          Please fix: {Object.keys(errors).join(", ")}
        </p>
      )}

      <Button type="submit" variant="accent" disabled={isPending}>
        {isPending ? "Saving…" : "Save branding"}
      </Button>
    </form>
  );
}
