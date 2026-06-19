import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@ninetynile.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMeNow123";
const EDITOR_EMAIL = "editor@ninetynile.com";
const EDITOR_PASSWORD = "EditorPass123";

test.describe("Auth & role boundaries", () => {
  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain("/admin/login");
  });

  test("editor can access case studies but NOT branding or users", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', EDITOR_EMAIL);
    await page.fill('input[name="password"]', EDITOR_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("/admin");

    await page.goto("/admin/case-studies");
    await expect(page).toHaveURL("/admin/case-studies");

    await page.goto("/admin/branding");
    await expect(page).not.toHaveURL("/admin/branding");

    await page.goto("/admin/users");
    await expect(page).not.toHaveURL("/admin/users");
  });

  test("admin can access branding and users", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("/admin");

    await page.goto("/admin/branding");
    await expect(page).toHaveURL("/admin/branding");

    await page.goto("/admin/users");
    await expect(page).toHaveURL("/admin/users");
  });
});
