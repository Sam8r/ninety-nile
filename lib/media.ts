import "server-only";
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

export type SavedAsset = {
  id: string;
  filename: string;
  path: string;
  url: string;
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
};

function yearMonth(): { year: string; month: string } {
  const now = new Date();
  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, "0"),
  };
}

export function resolveUploadRoot(): string {
  return path.resolve(process.cwd(), env.UPLOAD_DIR ?? "./uploads");
}

export async function ensureUploadRoot(): Promise<string> {
  const root = resolveUploadRoot();
  await fs.mkdir(root, { recursive: true });
  return root;
}

export function publicUrlFor(relPath: string): string {
  const normalized = relPath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `/uploads/${normalized}`;
}

export async function storeUpload(input: {
  filename: string;
  mimeType: string;
  data: Buffer;
  altEn?: string;
  altAr?: string;
}): Promise<SavedAsset> {
  if (!ALLOWED_MIME.includes(input.mimeType as never)) {
    throw new MediaError("UNSUPPORTED_TYPE", `Unsupported MIME type: ${input.mimeType}`);
  }
  if (input.data.byteLength > MAX_UPLOAD_BYTES) {
    throw new MediaError("TOO_LARGE", `File exceeds ${MAX_UPLOAD_BYTES} bytes`);
  }

  const { year, month } = yearMonth();
  const dir = path.join(resolveUploadRoot(), year, month);
  await fs.mkdir(dir, { recursive: true });

  const ext = path.extname(input.filename).toLowerCase() || `.${mimeToExt(input.mimeType)}`;
  const id = randomUUID();
  const storedName = `${id}${ext}`;
  const absPath = path.join(dir, storedName);

  // Normalize/strip metadata; capture dimensions.
  const pipeline = sharp(input.data, { failOn: "truncated" }).rotate();
  const meta = await pipeline.metadata();
  await pipeline.clone().toFile(absPath);

  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const relPath = path.join(year, month, storedName);

  const asset = await prisma.mediaAsset.create({
    data: {
      filename: input.filename,
      path: relPath,
      mimeType: input.mimeType,
      kind: "IMAGE",
      width,
      height,
      sizeBytes: BigInt(input.data.byteLength),
      altEn: input.altEn,
      altAr: input.altAr,
    },
  });

  return {
    id: asset.id,
    filename: asset.filename,
    path: relPath,
    url: publicUrlFor(relPath),
    mimeType: asset.mimeType,
    width,
    height,
    sizeBytes: input.data.byteLength,
  };
}

export async function readMediaFile(relPath: string): Promise<{
  data: Buffer;
  mimeType: string;
} | null> {
  const abs = path.join(resolveUploadRoot(), relPath);
  try {
    await fs.access(abs);
  } catch {
    return null;
  }
  const data = await fs.readFile(abs);
  const ext = path.extname(abs).toLowerCase();
  return { data, mimeType: extToMime(ext) };
}

export async function deleteMediaFile(relPath: string): Promise<void> {
  const abs = path.join(resolveUploadRoot(), relPath);
  await fs.rm(abs, { force: true });
}

export async function isMediaInUse(mediaId: string): Promise<boolean> {
  const refs = await prisma.mediaAsset.findUnique({
    where: { id: mediaId },
    select: {
      caseStudyHeroes: { select: { id: true }, take: 1 },
      caseStudyGallery: { select: { id: true }, take: 1 },
      projectHeroes: { select: { id: true }, take: 1 },
      teamPhotos: { select: { id: true }, take: 1 },
      clientLogos: { select: { id: true }, take: 1 },
      siteContentMedia: { select: { id: true }, take: 1 },
      brandPrimaryLogo: { select: { id: true } },
      brandAltLogo: { select: { id: true } },
      brandMarkLogo: { select: { id: true } },
    },
  });
  if (!refs) return false;

  // One-to-one relations return objects (or null); one-to-many return arrays.
  return (
    refs.caseStudyHeroes.length > 0 ||
    refs.caseStudyGallery.length > 0 ||
    refs.projectHeroes.length > 0 ||
    refs.teamPhotos.length > 0 ||
    refs.clientLogos.length > 0 ||
    refs.siteContentMedia.length > 0 ||
    refs.brandPrimaryLogo !== null ||
    refs.brandAltLogo !== null ||
    refs.brandMarkLogo !== null
  );
}

export class MediaError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "MediaError";
  }
}

function mimeToExt(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

function extToMime(ext: string): string {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".avif":
      return "image/avif";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}
