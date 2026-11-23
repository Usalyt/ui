import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Primitives/Slider Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=primitives-slider--default&viewMode=story"
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

  test("renders vertical geometry and preserves keyboard values", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/iframe.html?id=primitives-slider--vertical&viewMode=story"
    );
    const slider = page.getByRole("slider");
    await expect(slider).toBeVisible();

    const metrics = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>(
        '#storybook-root [data-orientation="vertical"]'
      );
      const control = root?.children[0] as HTMLElement | undefined;
      const track = control?.children[0] as HTMLElement | undefined;
      const thumb = control?.children[1] as HTMLElement | undefined;
      const rect = (element?: HTMLElement) => {
        if (!element) return null;
        const value = element.getBoundingClientRect();
        return {
          left: +value.left.toFixed(2),
          top: +value.top.toFixed(2),
          right: +value.right.toFixed(2),
          bottom: +value.bottom.toFixed(2),
          width: +value.width.toFixed(2),
          height: +value.height.toFixed(2),
        };
      };
      return {
        orientation: root?.getAttribute("data-orientation") ?? null,
        root: rect(root),
        control: rect(control),
        track: rect(track),
        thumb: rect(thumb),
      };
    });

    expect(metrics.orientation).toBe("vertical");
    expect(metrics.root).not.toBeNull();
    expect(metrics.control).not.toBeNull();
    expect(metrics.track).not.toBeNull();
    expect(metrics.thumb).not.toBeNull();
    expect(metrics.root!.width).toBeGreaterThanOrEqual(18);
    expect(metrics.root!.height).toBeGreaterThanOrEqual(200);
    expect(metrics.control!.height).toBeGreaterThanOrEqual(200);
    expect(metrics.track!.height).toBeGreaterThanOrEqual(200);
    expect(metrics.track!.width).toBeGreaterThanOrEqual(2);
    expect(metrics.track!.width).toBeLessThanOrEqual(12);
    expect(metrics.thumb!.width).toBeGreaterThanOrEqual(18);
    expect(metrics.thumb!.height).toBeGreaterThanOrEqual(18);
    expect(metrics.track!.left).toBeGreaterThanOrEqual(metrics.root!.left);
    expect(metrics.track!.right).toBeLessThanOrEqual(metrics.root!.right);

    const before = await slider.getAttribute("aria-valuenow");
    await slider.focus();
    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(100);
    const after = await slider.getAttribute("aria-valuenow");
    expect(after).not.toBe(before);

    await page.keyboard.press("End");
    await expect(slider).toHaveAttribute("aria-valuenow", "100");
    await page.keyboard.press("Home");
    await expect(slider).toHaveAttribute("aria-valuenow", "0");
  });

  test("keeps default horizontal geometry and keyboard behavior", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/iframe.html?id=primitives-slider--default&viewMode=story"
    );
    const slider = page.getByRole("slider");
    await expect(slider).toBeVisible();

    const metrics = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>(
        '#storybook-root [data-orientation="horizontal"]'
      );
      const control = root?.children[0] as HTMLElement | undefined;
      const track = control?.children[0] as HTMLElement | undefined;
      const rect = (element?: HTMLElement) => {
        if (!element) return null;
        const value = element.getBoundingClientRect();
        return {
          width: +value.width.toFixed(2),
          height: +value.height.toFixed(2),
        };
      };
      return {
        orientation: root?.getAttribute("data-orientation") ?? null,
        root: rect(root),
        track: rect(track),
      };
    });

    expect(metrics.orientation).toBe("horizontal");
    expect(metrics.root).not.toBeNull();
    expect(metrics.track).not.toBeNull();
    expect(metrics.root!.width).toBeGreaterThanOrEqual(100);
    expect(metrics.track!.width).toBeGreaterThanOrEqual(100);
    expect(metrics.track!.height).toBeGreaterThanOrEqual(4);
    expect(metrics.track!.height).toBeLessThanOrEqual(12);

    const before = await slider.getAttribute("aria-valuenow");
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);
    expect(await slider.getAttribute("aria-valuenow")).not.toBe(before);
    await page.keyboard.press("End");
    await expect(slider).toHaveAttribute("aria-valuenow", "100");
    await page.keyboard.press("Home");
    await expect(slider).toHaveAttribute("aria-valuenow", "0");
  });
});
