import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Primitives/NavigationMenu Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=primitives-navigationmenu--default&viewMode=story"
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

  test("caps the popup to the viewport while keeping keyboard focus behavior", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      "/iframe.html?id=primitives-navigationmenu--default&viewMode=story"
    );
    const trigger = page.getByRole("button", { name: "Components" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const popup = page.getByRole("dialog");
    await expect(popup).toBeVisible();
    await expect(page.getByRole("link", { name: /Accordion/ })).toBeVisible();
    await page.waitForTimeout(300);

    const metrics = await page.evaluate(() => {
      const popup = Array.from(
        document.querySelectorAll<HTMLElement>('[data-open][role="dialog"]')
      ).find((element) => (element.textContent ?? "").includes("Accordion"));
      if (!popup) return null;
      const rect = popup.getBoundingClientRect();
      const style = getComputedStyle(popup);
      return {
        left: +rect.left.toFixed(2),
        right: +rect.right.toFixed(2),
        width: +rect.width.toFixed(2),
        maxWidth: style.maxWidth,
        viewportWidth: window.innerWidth,
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.left).toBeGreaterThanOrEqual(0);
    expect(metrics!.right).toBeLessThanOrEqual(metrics!.viewportWidth);
    expect(metrics!.width).toBeLessThan(450);
    expect(metrics!.width).toBeGreaterThanOrEqual(280);
    expect(metrics!.maxWidth).not.toBe("none");

    await page.keyboard.press("Escape");
    await expect(popup).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("keeps the preferred popup width when the viewport has room", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/iframe.html?id=primitives-navigationmenu--default&viewMode=story"
    );
    await page.getByRole("button", { name: "Components" }).click();
    const popup = page.getByRole("dialog");
    await expect(popup).toBeVisible();
    await page.waitForTimeout(300);

    const metrics = await page.evaluate(() => {
      const popup = Array.from(
        document.querySelectorAll<HTMLElement>('[data-open][role="dialog"]')
      ).find((element) => (element.textContent ?? "").includes("Accordion"));
      if (!popup) return null;
      const rect = popup.getBoundingClientRect();
      return {
        width: +rect.width.toFixed(2),
        right: +rect.right.toFixed(2),
        viewportWidth: window.innerWidth,
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.width).toBeGreaterThanOrEqual(440);
    expect(metrics!.width).toBeLessThanOrEqual(450);
    expect(metrics!.right).toBeLessThanOrEqual(metrics!.viewportWidth);
    await expect(page.getByRole("link", { name: /Dialog/ })).toBeVisible();
  });
});
