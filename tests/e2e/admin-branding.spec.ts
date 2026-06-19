import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@ninetynile.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMeNow123";

test.describe("Admin branding reflects on public site", () => {
  test("branding form exposes Bauhaus color tokens", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("/admin");

    await page.goto("/admin/branding");
    await expect(page.locator('input[name="colorPrimary"], #colorPrimary')).toBeVisible();
    await expect(page.locator('input[name="colorSecondary"], #colorSecondary')).toBeVisible();
    await expect(page.locator('input[name="colorAccent"], #colorAccent')).toBeVisible();

    await expect(page.locator('input[name="siteNameAr"], #siteNameAr')).toHaveCount(0);
    await expect(page.locator('input[name="taglineAr"], #taglineAr')).toHaveCount(0);
  });

  test("public site reflects branding changes", async ({ page }) => {
    await page.goto("/");
    const headerText = await page.locator("header").textContent();
    expect(headerText).toContain("NinetyNile");
  });
});
