# Media Contract (HTTP route handlers)

### `POST /api/media` (auth required)
Multipart upload. Accepts images (jpg, png, webp, avif) and poster images for video.
- Validate MIME + extension allowlist; max size (e.g., 15 MB images).
- Process with `sharp`: store original + generate responsive variants/thumbnail; capture width/height.
- Save file to media volume (`uploads/<yyyy>/<mm>/<uuid>.<ext>`), insert `MediaAsset` row.
- Response: `{ ok: true, asset: { id, url, width, height, mimeType } }`.
- Errors: `UNAUTHENTICATED`, `UNSUPPORTED_TYPE`, `TOO_LARGE`.

### `GET /uploads/*` (public)
Serve stored media (via Next static/route handler or reverse-proxy mount). Long cache headers; images consumed through Next `<Image>` optimization.

### `DELETE /api/media/:id` (auth required)
Blocks deletion if asset is referenced (returns `IN_USE` with referencing items) unless `force=true` (ADMIN).

### Public contact form — `POST /api/contact`
Body: `{ name, email, message, locale, hp }` (`hp` = honeypot, must be empty).
- Honeypot + rate limit for spam protection.
- Insert `ContactSubmission` (status=NEW); optionally send email via SMTP env config.
- Response `{ ok: true }` or `{ ok:false, errors }`.
