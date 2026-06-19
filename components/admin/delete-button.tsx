"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  redirectTo,
  label = "Delete",
}: {
  action: () => Promise<unknown>;
  redirectTo: string;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  if (!confirming) {
    return (
      <Button type="button" variant="destructive" size="sm" onClick={() => setConfirming(true)}>
        {label}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Sure?</span>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => {
          startTransition(async () => {
            await action();
            router.push(redirectTo);
            router.refresh();
          });
        }}
      >
        Confirm
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </div>
  );
}
