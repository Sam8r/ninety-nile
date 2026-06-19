import { NextResponse, type NextRequest } from "next/server";
import { readMediaFile } from "@/lib/media";

/**
 * Serves uploaded media from the local volume with long cache headers.
 * In production a reverse proxy (nginx/Caddy) can mount the volume directly.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const relPath = path.join("/");
  const file = await readMediaFile(relPath);
  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
