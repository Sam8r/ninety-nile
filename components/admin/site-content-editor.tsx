"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteContent } from "@/lib/actions/site-content";
import type { SiteContent } from "@prisma/client";

export function SiteContentEditor({ content }: { content: SiteContent }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [titleEn, setTitleEn] = useState(content.titleEn ?? "");
  const [bodyEn, setBodyEn] = useState(content.bodyEn ?? "");

  function save() {
    startTransition(async () => {
      const res = await updateSiteContent(content.key, { titleEn, bodyEn });
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold">{content.key}</h3>
        <Button type="button" variant="accent" size="sm" disabled={isPending} onClick={save}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <Label>Body</Label>
        <Textarea rows={5} value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} className="mt-1" />
      </div>
    </div>
  );
}
