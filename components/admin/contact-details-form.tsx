"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateContactDetails } from "@/lib/actions/contact";
import type { ContactDetails } from "@prisma/client";

export function ContactDetailsForm({ initial }: { initial: ContactDetails | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    website: initial?.website ?? "",
    instagram: initial?.instagram ?? "",
    tiktok: initial?.tiktok ?? "",
    twitter: initial?.twitter ?? "",
    addressesEn: ((initial?.addressesEn as string[]) ?? []).join("\n"),
  });

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateContactDetails({
        ...form,
        addressesEn: form.addressesEn.split("\n").map((s) => s.trim()).filter(Boolean),
      });
      if (res.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-lg border p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Email</Label>
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1" />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Website</Label>
          <Input value={form.website} onChange={(e) => set("website", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Instagram URL</Label>
          <Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} className="mt-1" />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>TikTok URL</Label>
          <Input value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Twitter / X URL</Label>
          <Input value={form.twitter} onChange={(e) => set("twitter", e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <Label>Addresses (one per line)</Label>
        <Textarea value={form.addressesEn} onChange={(e) => set("addressesEn", e.target.value)} rows={4} className="mt-1" />
      </div>
      <Button type="submit" variant="accent" disabled={isPending}>
        {isPending ? "Saving…" : "Save contact details"}
      </Button>
    </form>
  );
}
