import { NextResponse, type NextRequest } from "next/server";
import { requireSession, requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/db";
import { isMediaInUse, deleteMediaFile } from "@/lib/media";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ ok: false, code: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { id } = await params;
  const force = req.nextUrl.searchParams.get("force") === "true";

  if (force) {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json({ ok: false, code: "FORBIDDEN" }, { status: 403 });
    }
  }

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) {
    return NextResponse.json({ ok: false, code: "NOT_FOUND" }, { status: 404 });
  }

  if (!force && (await isMediaInUse(id))) {
    return NextResponse.json(
      { ok: false, code: "IN_USE" },
      { status: 409 },
    );
  }

  // Null out references (FKs are SetNull on the defining side; gallery cascades).
  await prisma.mediaAsset.delete({ where: { id } });
  await deleteMediaFile(asset.path);

  return NextResponse.json({ ok: true });
}
