import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-heading text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-lg text-muted-foreground">Page not found</p>
      <Link href="/">
        <Button variant="accent">Back home</Button>
      </Link>
    </div>
  );
}
