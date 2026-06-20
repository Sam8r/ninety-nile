import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Image
              src="/brand/ninetynile-black.png"
              alt="NinetyNile"
              width={100}
              height={41}
              className="h-8 w-auto object-contain"
            />
            <span className="text-muted-foreground/40">|</span>
            <Image
              src="/brand/mastaba-black.png"
              alt="Mastaba"
              width={40}
              height={17}
              className="h-5 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground">Sign in to the dashboard</p>
        </div>
        <Suspense fallback={<div className="h-10 animate-pulse rounded-md bg-muted" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
