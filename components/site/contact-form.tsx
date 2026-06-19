"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations("Contact");
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
      locale,
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
          setResult({ ok: true, message: t("success") });
          (e.target as HTMLFormElement).reset();
        } else {
          setResult({ ok: false, message: t("error") });
        }
      } catch {
        setResult({ ok: false, message: t("error") });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot — hidden from users, catches bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="hp">Leave this empty</label>
        <Input id="hp" name="hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" required maxLength={120} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required maxLength={200} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea id="message" name="message" required maxLength={5000} rows={5} />
      </div>

      {result && (
        <p
          role="status"
          className={
            result.ok
              ? "text-sm font-medium text-accent"
              : "text-sm font-medium text-destructive"
          }
        >
          {result.message}
        </p>
      )}

      <Button type="submit" variant="accent" disabled={isPending}>
        {isPending ? t("sending") : t("send")}
      </Button>
    </form>
  );
}
