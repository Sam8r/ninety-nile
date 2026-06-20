"use client";

import { useState, useTransition } from "react";
import { ui } from "@/lib/content/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      locale: "en",
      hp: String(formData.get("hp") ?? ""),
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.ok) {
          setResult({ ok: true, message: ui.contact.success });
          (e.target as HTMLFormElement).reset();
        } else {
          setResult({ ok: false, message: ui.contact.error });
        }
      } catch {
        setResult({ ok: false, message: ui.contact.error });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-md">
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="hp">Leave this empty</label>
        <Input id="hp" name="hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-2xs">
        <Label htmlFor="name">{ui.contact.name}</Label>
        <Input id="name" name="name" required maxLength={120} placeholder={ui.contact.namePlaceholder} />
      </div>
      <div className="space-y-2xs">
        <Label htmlFor="email">{ui.contact.email}</Label>
        <Input id="email" name="email" type="email" required maxLength={200} placeholder={ui.contact.emailPlaceholder} />
      </div>
      <div className="space-y-2xs">
        <Label htmlFor="message">{ui.contact.message}</Label>
        <Textarea id="message" name="message" required maxLength={5000} rows={5} placeholder={ui.contact.messagePlaceholder} />
      </div>

      {result && (
        <p
          role="status"
          className={
            result.ok
              ? "text-sm font-medium text-[var(--color-accent)]"
              : "text-sm font-medium text-[var(--color-destructive)]"
          }
        >
          {result.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center bg-[var(--color-accent)] px-lg text-base font-semibold text-[var(--color-paper)] transition-opacity duration-200 ease-out hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? ui.contact.sending : ui.contact.send}
      </button>
    </form>
  );
}
