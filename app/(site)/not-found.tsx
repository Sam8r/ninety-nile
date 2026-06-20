import Link from "next/link";
import { ui } from "@/lib/content/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-md text-center">
      <p className="font-display text-[10rem] font-bold leading-none text-[var(--color-rule)]">
        404
      </p>
      <p className="text-lg font-semibold">{ui.common.notFound}</p>
      <p className="text-[var(--color-muted)]">{ui.common.notFoundBody}</p>
      <Link
        href="/"
        className="mt-sm inline-flex h-10 items-center bg-[var(--color-accent)] px-md text-sm font-semibold text-[var(--color-paper)] transition-opacity hover:opacity-90"
      >
        {ui.common.backHome}
      </Link>
    </div>
  );
}
