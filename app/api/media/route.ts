import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/lib/auth-guards";
import { storeUpload, MediaError } from "@/lib/media";

export async function POST(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ ok: false, code: "UNAUTHENTICATED" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const altEn = String(formData.get("altEn") ?? "");
  const altAr = String(formData.get("altAr") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, code: "VALIDATION_ERROR", errors: { file: ["No file provided"] } },
      { status: 400 },
    );
  }

  try {
    const data = Buffer.from(await file.arrayBuffer());
    const asset = await storeUpload({
      filename: file.name,
      mimeType: file.type,
      data,
      altEn: altEn || undefined,
      altAr: altAr || undefined,
    });
    return NextResponse.json({ ok: true, asset });
  } catch (e) {
    if (e instanceof MediaError) {
      return NextResponse.json({ ok: false, code: e.code }, { status: 400 });
    }
    console.error("Media upload failed:", e);
    return NextResponse.json({ ok: false, code: "UPLOAD_FAILED" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ ok: false, code: "UNAUTHENTICATED" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
