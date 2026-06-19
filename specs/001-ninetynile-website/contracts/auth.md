# Auth Contract (Auth.js / NextAuth v5)

### `POST /api/auth/callback/credentials`
Body: `{ email, password }`. Verifies bcrypt hash. On success issues session (JWT) containing `{ userId, role, name }`. On failure → generic "Invalid credentials" (no user enumeration).

### Session
- `GET` session via Auth.js helpers in server components/actions.
- Session payload: `user: { id, email, name, role }`.

### Middleware / guards
- `middleware.ts` protects `/admin/*` (except `/admin/login`): no session → redirect `/admin/login?callbackUrl=...`.
- `requireSession()` — used in actions; throws `UNAUTHENTICATED`.
- `requireRole('ADMIN')` — used in admin-only actions/pages; throws `FORBIDDEN` for editors.

### Rules
- Passwords ≥ 10 chars, bcrypt cost ≥ 12.
- Rate-limit login attempts (e.g., 10/min/IP).
- Logout clears session.
