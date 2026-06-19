export default function Forbidden() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
      <h1 className="font-heading text-3xl font-bold">403</h1>
      <p className="text-sm text-muted-foreground">
        You don&apos;t have permission to access this page.
      </p>
    </div>
  );
}
