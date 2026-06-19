import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="font-heading text-2xl font-bold">NinetyNile</h1>
          <p className="text-sm text-muted-foreground">Sign in to the dashboard</p>
        </div>
        <Suspense fallback={<div className="h-10 animate-pulse rounded-md bg-muted" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
