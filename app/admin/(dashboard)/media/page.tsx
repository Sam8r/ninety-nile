import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-guards";
import { MediaLibraryGrid } from "@/components/admin/media-library-grid";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  await requireSession("/admin/media");
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Media Library</h1>
        <p className="text-sm text-muted-foreground">{assets.length} assets</p>
      </div>
      <MediaLibraryGrid
        assets={assets.map((a) => ({
          id: a.id,
          path: a.path,
          filename: a.filename,
          altEn: a.altEn,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
