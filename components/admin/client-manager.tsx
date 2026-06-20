"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaPicker } from "@/components/admin/media-picker";
import { Plus, Trash2 } from "lucide-react";

type ClientItem = {
  id: string;
  name: string;
  url: string;
  order: number;
  logoId: string;
  logoUrl: string | null;
};

export function ClientManager({
  items: initial,
  upsert,
  remove,
}: {
  items: ClientItem[];
  upsert: (id: string | null, data: Record<string, unknown>) => Promise<{ ok: boolean }>;
  remove: (id: string) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();
  const [items, setItems] = useState<ClientItem[]>(initial);
  const [drafts, setDrafts] = useState<Record<string, ClientItem>>({});
  const [, startTransition] = useTransition();

  function getDraft(id: string): ClientItem {
    return drafts[id] ?? items.find((i) => i.id === id) ?? { id, name: "", url: "", order: 0, logoId: "", logoUrl: null };
  }

  function setDraft(id: string, patch: Partial<ClientItem>) {
    setDrafts((d) => ({ ...d, [id]: { ...getDraft(id), ...patch } }));
  }

  function save(id: string) {
    const draft = getDraft(id);
    startTransition(async () => {
      const res = await upsert(id.startsWith("new-") ? null : id, {
        name: draft.name,
        url: draft.url,
        order: draft.order,
        logoId: draft.logoId,
      });
      if (res.ok) {
        setDrafts((d) => {
          const next = { ...d };
          delete next[id];
          return next;
        });
        router.refresh();
      }
    });
  }

  function addRow() {
    const id = `new-${Date.now()}`;
    const row: ClientItem = { id, name: "", url: "", order: items.length, logoId: "", logoUrl: null };
    setItems((items) => [...items, row]);
    setDrafts((d) => ({ ...d, [id]: row }));
  }

  function del(id: string) {
    if (id.startsWith("new-")) {
      setItems((items) => items.filter((i) => i.id !== id));
      return;
    }
    if (!confirm("Delete this client?")) return;
    startTransition(async () => {
      const res = await remove(id);
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="size-4" />
        Add
      </Button>
      <div className="space-y-3">
        {items.map((item) => {
          const draft = getDraft(item.id);
          return (
            <div key={item.id} className="space-y-2 rounded-lg border p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={draft.name}
                    onChange={(e) => setDraft(item.id, { name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={draft.url}
                    onChange={(e) => setDraft(item.id, { url: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Order</Label>
                  <Input
                    type="number"
                    value={draft.order}
                    onChange={(e) => setDraft(item.id, { order: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                {draft.logoUrl && !draft.logoId && (
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={draft.logoUrl}
                      alt="Current logo"
                      className="h-10 w-auto rounded border object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setDraft(item.id, { logoUrl: null })}
                      className="text-xs text-destructive underline"
                    >
                      Remove current logo
                    </button>
                  </div>
                )}
                <MediaPicker
                  label="Logo"
                  value={draft.logoId}
                  onChange={(v) => setDraft(item.id, { logoId: (v as string) || "", logoUrl: null })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="accent" size="sm" onClick={() => save(item.id)}>
                  Save
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => del(item.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
