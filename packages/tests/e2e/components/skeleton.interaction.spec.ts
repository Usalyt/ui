import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const skeletonUrl = (id: string, theme = "light") =>
  `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;

test.describe("Primitives/Skeleton Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=primitives-skeleton--default&viewMode=story"
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

  test("default example uses a definite, viewport-bounded width", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(skeletonUrl("primitives-skeleton--default"));
    await page.waitForSelector('#storybook-root [aria-hidden="true"]');

    const geometry = await page.evaluate(() => {
      const bars = Array.from(
        document.querySelectorAll<HTMLElement>(
          '#storybook-root [aria-hidden="true"]'
        )
      );
      const wrapper = bars[0]?.parentElement;
      const wrapperRect = wrapper?.getBoundingClientRect();
      return {
        wrapper: wrapperRect
          ? { left: wrapperRect.left, right: wrapperRect.right, width: wrapperRect.width }
          : null,
        viewportWidth: window.innerWidth,
        bars: bars.map((bar) => {
          const rect = bar.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }),
      };
    });

    expect(geometry.bars).toHaveLength(3);
    expect(geometry.wrapper).not.toBeNull();
    expect(geometry.wrapper!.width).toBeGreaterThanOrEqual(300);
    expect(geometry.wrapper!.width).toBeLessThanOrEqual(384);
    expect(geometry.wrapper!.left).toBeGreaterThanOrEqual(0);
    expect(geometry.wrapper!.right).toBeLessThanOrEqual(
      geometry.viewportWidth
    );
    for (const bar of geometry.bars) {
      expect(bar.width).toBeGreaterThanOrEqual(200);
      expect(bar.width).toBeLessThanOrEqual(384);
      expect(bar.height).toBeGreaterThanOrEqual(16);
    }
  });

  test("default example stays bounded and legible on a narrow viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(skeletonUrl("primitives-skeleton--default"));
    await page.waitForSelector('#storybook-root [aria-hidden="true"]');

    const geometry = await page.evaluate(() => {
      const bars = Array.from(
        document.querySelectorAll<HTMLElement>(
          '#storybook-root [aria-hidden="true"]'
        )
      );
      const wrapper = bars[0]?.parentElement?.getBoundingClientRect();
      return {
        wrapper: wrapper
          ? { left: wrapper.left, right: wrapper.right, width: wrapper.width }
          : null,
        viewportWidth: window.innerWidth,
        bars: bars.map((bar) => bar.getBoundingClientRect().width),
      };
    });

    expect(geometry.wrapper).not.toBeNull();
    expect(geometry.wrapper!.width).toBeGreaterThanOrEqual(250);
    expect(geometry.wrapper!.left).toBeGreaterThanOrEqual(0);
    expect(geometry.wrapper!.right).toBeLessThanOrEqual(
      geometry.viewportWidth
    );
    for (const width of geometry.bars) {
      expect(width).toBeGreaterThanOrEqual(150);
      expect(width).toBeLessThanOrEqual(geometry.wrapper!.width);
    }
  });

  test("card placeholder example resolves its percentage children against a definite width", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(skeletonUrl("primitives-skeleton--card-placeholder"));
    await page.waitForSelector('#storybook-root [aria-hidden="true"]');

    const geometry = await page.evaluate(() => {
      const card = document.querySelector<HTMLElement>(
        "#storybook-root > div > div"
      );
      const cardRect = card?.getBoundingClientRect();
      const bars = Array.from(
        card?.querySelectorAll<HTMLElement>('[aria-hidden="true"]') ?? []
      );
      return {
        card: cardRect ? { width: cardRect.width, left: cardRect.left, right: cardRect.right } : null,
        viewportWidth: window.innerWidth,
        barWidths: bars.map((bar) => bar.getBoundingClientRect().width),
      };
    });

    expect(geometry.card).not.toBeNull();
    expect(geometry.card!.width).toBeGreaterThanOrEqual(320);
    expect(geometry.card!.width).toBeLessThanOrEqual(384);
    expect(geometry.card!.left).toBeGreaterThanOrEqual(0);
    expect(geometry.card!.right).toBeLessThanOrEqual(geometry.viewportWidth);
    expect(geometry.barWidths.length).toBeGreaterThanOrEqual(6);
    for (const width of geometry.barWidths) {
      expect(width).toBeGreaterThanOrEqual(40);
    }
  });
});
