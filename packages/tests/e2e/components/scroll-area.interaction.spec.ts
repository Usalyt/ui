import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Primitives/ScrollArea Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=primitives-scrollarea--default&viewMode=story"
    );
    await page.waitForLoadState("domcontentloaded");
  });

  test("renders component in storybook root", async ({ page }) => {
    const root = page.locator("#storybook-root");
    await expect(root).toBeVisible();
  });

  test("passes axe-core WCAG 2 AA accessibility rules", async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
