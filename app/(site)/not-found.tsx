import Link from "next/link";
import { ui } from "@/lib/content/ui";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-heading text-8xl font-bold text-black/10">404</h1>
      <p className="text-lg font-semibold">{ui.common.notFound}</p>
      <p className="text-muted-foreground">{ui.common.notFoundBody}</p>
      <Link href="/">
        <Button variant="accent">{ui.common.backHome}</Button>
      </Link>
    </div>
  );
}
