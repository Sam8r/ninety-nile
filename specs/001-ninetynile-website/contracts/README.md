# Interface Contracts

The app exposes three interface surfaces:

1. **Public content reads** — Server Components fetch published content directly via Prisma (no public REST needed). Documented in `content-public.md` as the data each public page consumes.
2. **Admin mutations** — Next.js **Server Actions** (not REST), each validated by a Zod schema and guarded by auth + role. Documented in `admin-casestudies.md` and `admin-branding-settings.md` (representative; other content types follow the same CRUD shape).
3. **HTTP route handlers** — the few true HTTP endpoints: auth (`auth.md`), media upload/serve (`media.md`), and the public contact form.

Conventions:
- All write actions require an authenticated session; admin-only actions require `role === ADMIN`.
- Inputs validated with Zod; on failure return `{ ok: false, errors }`. On success return `{ ok: true, data }`.
- Publish transitions require both EN and AR required fields present.
- Mutations that affect public pages call `revalidatePath`/`revalidateTag`.
