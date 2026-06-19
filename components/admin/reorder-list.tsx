"use client";

import { useState, useTransition } from "react";
import { reorderCaseStudies } from "@/lib/actions/case-studies";
import { ArrowUp, ArrowDown } from "lucide-react";

type Item = { id: string; titleEn: string; order: number };

export function ReorderList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [, startTransition] = useTransition();

  function move(index: number, dir: -1 | 1) {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= items.length) return;
    const next = [...items];
    [next[index], next[newIndex]] = [next[newIndex]!, next[index]!];
    setItems(next);
    startTransition(async () => {
      await reorderCaseStudies(next.map((i) => i.id));
    });
  }

  return (
    <ul className="divide-y divide-border rounded-lg border">
      {items.map((item, i) => (
        <li key={item.id} className="flex items-center justify-between gap-3 p-3">
          <span className="flex items-center gap-3">
            <span className="flex flex-col">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Move up"
              >
                <ArrowUp className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Move down"
              >
                <ArrowDown className="size-3" />
              </button>
            </span>
            <span className="text-sm">{item.titleEn}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
