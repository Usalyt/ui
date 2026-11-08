import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Primitives/DataTable Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=primitives-datatable--default&viewMode=story"
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

  test("contains a wide table in one local horizontal scroller", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      "/iframe.html?id=primitives-datatable--wide-records&viewMode=story"
    );
    await page.waitForSelector("#storybook-root table");

    const metrics = await page.evaluate(() => {
      const table = document.querySelector<HTMLTableElement>(
        "#storybook-root table"
      );
      if (!table) return null;
      const frame = table.parentElement as HTMLElement;
      const frameRect = frame.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();
      const scrollContainers: string[] = [];
      let current: HTMLElement | null = frame;
      while (current && current.id !== "storybook-root") {
        const style = getComputedStyle(current);
        if (style.overflowX === "auto" || style.overflowX === "scroll") {
          scrollContainers.push(`${current.tagName}.${current.className}`);
        }
        current = current.parentElement;
      }
      const before = frame.scrollLeft;
      frame.scrollLeft = frame.scrollWidth;
      const after = frame.scrollLeft;
      return {
        frame: {
          width: +frameRect.width.toFixed(2),
          clientWidth: frame.clientWidth,
          scrollWidth: frame.scrollWidth,
          overflowX: getComputedStyle(frame).overflowX,
          before,
          after,
        },
        tableWidth: +tableRect.width.toFixed(2),
        scrollContainers,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.frame.overflowX).toBe("auto");
    expect(metrics!.frame.scrollWidth).toBeGreaterThan(
      metrics!.frame.clientWidth
    );
    expect(metrics!.tableWidth).toBeGreaterThan(metrics!.frame.clientWidth);
    expect(metrics!.frame.before).toBe(0);
    expect(metrics!.frame.after).toBeGreaterThan(0);
    expect(metrics!.scrollContainers).toHaveLength(1);
    expect(metrics!.documentWidth).toBeLessThanOrEqual(
      metrics!.viewportWidth + 1
    );

    await expect(
      page.getByText("Alexandria Catherine Montgomery")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Name" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Next page" })).toBeVisible();
  });
});
