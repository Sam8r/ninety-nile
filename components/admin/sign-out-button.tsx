"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size={compact ? "icon" : "default"}
      className="w-full justify-start lg:w-full"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      <LogOut className="size-4" />
      {!compact && <span>{label}</span>}
    </Button>
  );
}
