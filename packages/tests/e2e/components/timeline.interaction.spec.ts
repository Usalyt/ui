import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Primitives/Timeline Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=primitives-timeline--default&viewMode=story"
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

  test("gives horizontal orientation horizontal item and connector geometry", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/iframe.html?id=primitives-timeline--horizontal&viewMode=story"
    );
    await page.getByRole("list", { name: "timeline" }).waitFor();

    const metrics = await page.evaluate(() => {
      const root = document.querySelector<HTMLOListElement>(
        'ol[aria-label="timeline"]'
      );
      if (!root) return null;
      const rect = (element?: Element | null) => {
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
      const items = Array.from(root.children).filter(
        (element) => element.tagName === "LI"
      );
      return {
        flexDirection: getComputedStyle(root).flexDirection,
        items: items.map((item) => {
          const title = item.querySelector("h4");
          const header = title?.parentElement ?? null;
          const icon = header?.children[0] ?? null;
          const connector = Array.from(item.children).find(
            (element) => element.getAttribute("aria-hidden") === "true"
          ) ?? null;
          const content = Array.from(item.children).find(
            (element) =>
              element.tagName === "DIV" &&
              element !== header &&
              element.getAttribute("aria-hidden") !== "true"
          ) ?? null;
          return {
            item: rect(item),
            header: rect(header),
            icon: rect(icon),
            connector: rect(connector),
            content: rect(content),
            title: title?.textContent ?? null,
            titleRect: rect(title),
          };
        }),
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.flexDirection).toBe("row");
    expect(metrics!.items).toHaveLength(3);
    for (let index = 1; index < metrics!.items.length; index += 1) {
      expect(metrics!.items[index].item!.left).toBeGreaterThan(
        metrics!.items[index - 1].item!.left
      );
      expect(metrics!.items[index].item!.width).toBeGreaterThan(100);
    }
    for (const entry of metrics!.items.slice(0, 2)) {
      expect(entry.connector).not.toBeNull();
      expect(entry.connector!.width).toBeGreaterThan(100);
      expect(entry.connector!.height).toBeLessThanOrEqual(2);
      const iconCenterX = entry.icon!.left + entry.icon!.width / 2;
      const iconCenterY = entry.icon!.top + entry.icon!.height / 2;
      expect(
        Math.abs(entry.connector!.left - iconCenterX)
      ).toBeLessThanOrEqual(2);
      expect(
        Math.abs(
          entry.connector!.top +
            entry.connector!.height / 2 -
            iconCenterY
        )
      ).toBeLessThanOrEqual(2);
      expect(entry.connector!.right).toBeGreaterThan(entry.item!.right);
    }
    const iconCenters = metrics!.items.map(
      (entry) => entry.icon!.top + entry.icon!.height / 2
    );
    expect(Math.max(...iconCenters) - Math.min(...iconCenters)).toBeLessThanOrEqual(2);
    for (let index = 0; index < metrics!.items.length; index += 1) {
      const entry = metrics!.items[index];
      expect(entry.titleRect!.top).toBeGreaterThanOrEqual(
        entry.icon!.bottom - 1
      );
      expect(entry.content!.top).toBeGreaterThanOrEqual(
        entry.header!.bottom - 1
      );
    }
    expect(metrics!.items.map((entry) => entry.title)).toEqual([
      "Evaluation Created",
      "Element Inspected",
      "Report Exported",
    ]);
  });

  test("keeps the default vertical stacking and connector geometry", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/iframe.html?id=primitives-timeline--default&viewMode=story"
    );
    await page.getByRole("list", { name: "timeline" }).waitFor();

    const metrics = await page.evaluate(() => {
      const root = document.querySelector<HTMLOListElement>(
        'ol[aria-label="timeline"]'
      );
      if (!root) return null;
      const rect = (element?: Element | null) => {
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
      const items = Array.from(root.children).filter(
        (element) => element.tagName === "LI"
      );
      return {
        flexDirection: getComputedStyle(root).flexDirection,
        items: items.map((item) => {
          const title = item.querySelector("h4");
          const header = title?.parentElement ?? null;
          const icon = header?.children[0] ?? null;
          const connector = Array.from(item.children).find(
            (element) => element.getAttribute("aria-hidden") === "true"
          ) ?? null;
          return {
            item: rect(item),
            header: rect(header),
            icon: rect(icon),
            connector: rect(connector),
            title: title?.textContent ?? null,
            titleRect: rect(title),
          };
        }),
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.flexDirection).toBe("column");
    expect(metrics!.items).toHaveLength(3);
    for (let index = 1; index < metrics!.items.length; index += 1) {
      expect(metrics!.items[index].item!.top).toBeGreaterThanOrEqual(
        metrics!.items[index - 1].item!.top + 40
      );
    }
    for (const entry of metrics!.items.slice(0, 2)) {
      expect(entry.connector).not.toBeNull();
      expect(entry.connector!.width).toBeLessThanOrEqual(2);
      expect(entry.connector!.height).toBeGreaterThanOrEqual(
        entry.item!.height
      );
    }
    for (const entry of metrics!.items) {
      expect(entry.titleRect!.left).toBeGreaterThanOrEqual(
        entry.icon!.right - 1
      );
    }
    expect(metrics!.items.map((entry) => entry.title)).toEqual([
      "Evaluation Created",
      "Element Inspected",
      "Report Exported",
    ]);
  });
});
