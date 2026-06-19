import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid PostgreSQL connection string"),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters (run: openssl rand -base64 32)"),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(10, "ADMIN_PASSWORD must be at least 10 characters"),
  UPLOAD_DIR: z.string().default("./uploads"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Invalid environment variables:\n${parsed.error.flatten().fieldErrors}`,
      );
    }
    console.warn("⚠️  Environment variables not fully configured. Using fallbacks for dev.");
    console.warn(parsed.error.flatten().fieldErrors);
  }
  return {
    ...(parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>)),
    isProd: process.env.NODE_ENV === "production",
  };
}

export const env = loadEnv();
