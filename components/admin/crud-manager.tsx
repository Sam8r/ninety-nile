"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

type FieldDef = {
  key: string;
  label: string;
  textarea?: boolean;
  required?: boolean;
};

type Row = Record<string, string | number>;

type Item = { id: string } & Row;

export function CrudManager({
  items: initial,
  fields,
  upsert,
  remove,
  defaultRow,
}: {
  items: Item[];
  fields: FieldDef[];
  // Server actions passed as references (must not be wrapped in arrow fns).
  upsert: (id: string | null, data: Record<string, unknown>) => Promise<{ ok: boolean }>;
  remove: (id: string) => Promise<{ ok: boolean }>;
  defaultRow: Row;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initial);
  const [drafts, setDrafts] = useState<Record<string, Row>>({});
  const [, startTransition] = useTransition();

  function getDraft(id: string): Row {
    return drafts[id] ?? (items.find((i) => i.id === id) ?? {});
  }

  function setDraft(id: string, key: string, value: string) {
    setDrafts((d) => ({ ...d, [id]: { ...getDraft(id), [key]: value } }));
  }

  function save(id: string) {
    const draft = getDraft(id);
    startTransition(async () => {
      const data: Record<string, unknown> = { ...draft };
      for (const f of fields) {
        if (f.key === "order") data[f.key] = Number(draft[f.key] ?? 0);
      }
      const res = await upsert(id.startsWith("new-") ? null : id, data);
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
    const row = { ...defaultRow };
    setItems((items) => [...items, { id, ...row }]);
    setDrafts((d) => ({ ...d, [id]: row }));
  }

  function del(id: string) {
    if (id.startsWith("new-")) {
      setItems((items) => items.filter((i) => i.id !== id));
      return;
    }
    if (!confirm("Delete this item?")) return;
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
        {items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-lg border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
                  <Label className="text-xs">{f.label}</Label>
                  {f.textarea ? (
                    <Textarea
                      rows={2}
                      value={String(getDraft(item.id)[f.key] ?? "")}
                      onChange={(e) => setDraft(item.id, f.key, e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      value={String(getDraft(item.id)[f.key] ?? "")}
                      onChange={(e) => setDraft(item.id, f.key, e.target.value)}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
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
        ))}
      </div>
    </div>
  );
}
