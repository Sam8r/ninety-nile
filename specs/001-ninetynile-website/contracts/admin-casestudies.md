# Admin Contract: Case Studies (Server Actions)

All actions require an authenticated session (ADMIN or EDITOR). Pattern applies equally to Projects, Services, ProcessSteps, TeamMembers, Clients, Testimonials.

### `listCaseStudies(filter?)`
Returns all case studies (any status) for the dashboard table, ordered by `order`.

### `getCaseStudy(id)`
Returns full record incl. both-language fields and gallery for the edit form.

### `createCaseStudy(input)` / `updateCaseStudy(id, input)`
Zod `CaseStudyInput`:
```
slug: string (kebab, unique)
titleEn, titleAr: string (titleAr optional unless publishing)
clientEn?, clientAr?: string
summaryEn?, summaryAr?: string
challengeEn?, challengeAr?, solutionEn?, solutionAr?, resultsEn?, resultsAr?: richtext
category: enum
metrics: { labelEn, labelAr, value }[]
heroMediaId?: uuid
galleryMediaIds: uuid[]
externalLinks: { label: string, url: url }[]
order: int
status: DRAFT | PUBLISHED
```
Validation: on `status=PUBLISHED`, all `*Ar` and `*En` required-pair fields (title, summary, challenge, solution, results) MUST be non-empty → else `{ ok:false, errors }`. Sets `authorId`, timestamps; `publishedAt` on first publish. Revalidates `work` + `case-study:<slug>`.

### `reorderCaseStudies(orderedIds: uuid[])`
Persists new `order`. Revalidates `work`.

### `deleteCaseStudy(id)`
Soft or hard delete (v1: hard). Revalidates `work`.

Errors: `UNAUTHENTICATED` (no session → redirect to `/admin/login`), `VALIDATION_ERROR`, `NOT_FOUND`, `SLUG_TAKEN`.
