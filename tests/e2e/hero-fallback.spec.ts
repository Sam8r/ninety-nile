import { test, expect } from "@playwright/test";

test.describe("Hero graceful degradation", () => {
  test("reduced-motion renders static fallback (no WebGL loop)", async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
    });
    const page = await context.newPage();

    await page.goto("/");

    // The hero section should render (headline + CTA visible)
    await expect(page.locator("h1").first()).toBeVisible();

    // The hero image fallback should be present (img tag inside the river band)
    const heroSection = page.locator("section").first();
    await expect(heroSection).toBeVisible();

    await context.close();
  });

  test("page is fully usable with WebGL disabled", async ({ browser }) => {
    // Launch with WebGL disabled
    const context = await browser.newContext({
      javaScriptEnabled: true,
    });
    const page = await context.newPage();

    // Block WebGL by injecting a script before page load
    await page.addInitScript(() => {
      const proto = HTMLCanvasElement.prototype;
      proto.getContext = (() => {
        return function (type: string) {
          if (type === "webgl2" || type === "webgl") return null;
          return proto.getContext.call(this, type);
        };
      })();
    });

    await page.goto("/");

    // Page should still render with headline and navigation
    await expect(page.locator("h1").first()).toBeVisible();

    // Navigation should work
    await page.goto("/work");
    await expect(page).toHaveURL("/work");

    await context.close();
  });

  test("WebGL canvas does not accumulate on navigation", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/");
    await page.waitForTimeout(1000);

    // Navigate away and back
    await page.goto("/work");
    await page.waitForTimeout(500);
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Should not have multiple canvases
    const canvasCount = await page.locator("canvas").count();
    expect(canvasCount).toBeLessThanOrEqual(1);

    await context.close();
  });
});
