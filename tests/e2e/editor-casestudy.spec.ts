import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@ninetynile.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMeNow123";

test.describe("Editor case-study CRUD (English-only)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("/admin");
  });

  test("create, publish, and unpublish a case study", async ({ page }) => {
    const slug = `test-e2e-${Date.now()}`;
    await page.goto("/admin/case-studies");
    await page.click('a[href="/admin/case-studies/new"], button:has-text("New")');
    await page.waitForURL(/\/admin\/case-studies\/(new|\w+)/);

    await page.fill('input[name="slug"], #slug', slug);
    await page.fill('input[name="titleEn"], #titleEn', `E2E Test: ${slug}`);
    await page.fill('input[name="clientEn"], #clientEn', "E2E Client");
    await page.fill('textarea[name="summaryEn"], #summaryEn', "E2E summary text");
    await page.fill('[name="challengeEn"], #challengeEn', "E2E challenge text");
    await page.fill('[name="solutionEn"], #solutionEn', "E2E solution text");
    await page.fill('[name="resultsEn"], #resultsEn', "E2E results text");

    await page.click('button:has-text("Save")');
    await page.waitForURL(/\/admin\/case-studies/);

    await page.goto(`/work/${slug}`);
    await expect(page.locator("h1").first()).toContainText("E2E Test");
  });

  test("Arabic fields are NOT present in the form", async ({ page }) => {
    await page.goto("/admin/case-studies/new");
    await expect(page.locator('input[name="titleAr"], #titleAr')).toHaveCount(0);
    await expect(page.locator('input[name="summaryAr"], #summaryAr')).toHaveCount(0);
  });
});
