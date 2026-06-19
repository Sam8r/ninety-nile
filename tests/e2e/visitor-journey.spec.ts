import { test, expect } from "@playwright/test";

test.describe("Visitor journey (English-only, no locale prefix)", () => {
  test("Home → Services → Work → case-study detail → Contact", async ({ page }) => {
    // Home page — no locale prefix
    await page.goto("/");
    await expect(page).toHaveURL(/^(?!.*\/(en|ar)\/).*$/);
    await expect(page.locator("h1").first()).toBeVisible();

    // Navigate to Services
    await page.goto("/services");
    await expect(page).toHaveTitle(/Services/i);

    // Navigate to Work
    await page.goto("/work");
    await expect(page).toHaveURL("/work");

    // Click the first case study card
    const firstCard = page.locator('a[href^="/work/"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await page.waitForURL(/\/work\/[\w-]+/);
      await expect(page.locator("h1").first()).toBeVisible();

      // Navigate to Contact
      await page.goto("/contact");
      await expect(page).toHaveURL("/contact");
      await expect(page.locator("form")).toBeVisible();
    }
  });

  test("no language switcher is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('text=العربية')).not.toBeVisible();
    await expect(page.locator('text=English')).toHaveCount(0);
  });

  test("no /en or /ar prefix in URLs", async ({ page }) => {
    await page.goto("/");
    const url = page.url();
    expect(url).not.toMatch(/\/(en|ar)(\/|$)/);
  });
});
