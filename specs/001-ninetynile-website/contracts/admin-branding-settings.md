# Admin Contract: Branding & Site Settings (Server Actions — ADMIN only)

All actions require `role === ADMIN`. EDITOR attempts → `FORBIDDEN`.

### `getBrandSettings()` / `updateBrandSettings(input)`
Zod `BrandSettingsInput`:
```
siteNameEn, siteNameAr: string
taglineEn, taglineAr: string         // primary "Creativity, Overflowing."
secondaryTaglineEn?, secondaryTaglineAr?: string
logoPrimaryId?, logoAltId?, logoMarkId?: uuid (MediaAsset)
colorPrimary, colorSecondary, colorAccent, colorBg, colorText: hex string
fontHeading, fontBody: string (token)
```
On save: revalidate all (branding affects every page) via `revalidateTag('branding')`; brand colors emitted as CSS variables in the root layout.

### `getContactDetails()` / `updateContactDetails(input)`
`email, phone, website, instagram, tiktok, addressesEn[], addressesAr[]`. Revalidates `contact`.

### `updateSiteContent(key, input)`
For keyed section copy (ABOUT_STORY, CAUSE_EFFECT, COMMUNITY_ACHIEVEMENT, etc.): `titleEn/Ar, bodyEn/Ar (richtext), mediaId?`. Revalidates the affected route tag.

### User management (ADMIN only)
- `listUsers()`, `createUser({ email, name, role, password })`, `updateUserRole(id, role)`, `deleteUser(id)`.
- Cannot delete/demote the last remaining ADMIN → `LAST_ADMIN`.

Errors: `UNAUTHENTICATED`, `FORBIDDEN` (editor), `VALIDATION_ERROR`, `LAST_ADMIN`.
