import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
  locale: z.string().max(10).default("en"),
  hp: z.string().max(0, "spam detected").optional().default(""),
});

// Simple in-memory rate limit (per IP): 5 submissions / 10 min.
const WINDOW_MS = 10 * 60_000;
const MAX = 5;
const submissions = new Map<string, { count: number; firstAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = submissions.get(ip);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    submissions.set(ip, { count: 1, firstAt: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, errors: { _form: ["Too many submissions. Please try again later."] } },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { _form: ["Invalid request body."] } },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, message, locale } = parsed.data;

  await prisma.contactSubmission.create({
    data: { name, email, message, locale, status: "NEW" },
  });

  return NextResponse.json({ ok: true });
}
