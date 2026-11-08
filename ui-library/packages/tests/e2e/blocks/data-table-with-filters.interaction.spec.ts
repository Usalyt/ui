import { test, expect } from "@playwright/test";

test.describe("Blocks/DataTableWithFilters containment", () => {
  test("uses one local table scroller and keeps the block controls", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto(
      "/iframe.html?id=blocks-datatablewithfilters--wide-records&viewMode=story"
    );
    await page.waitForSelector("#storybook-root table");

    const metrics = await page.evaluate(() => {
      const table = document.querySelector<HTMLTableElement>(
        "#storybook-root table"
      );
      if (!table) return null;
      const frame = table.parentElement as HTMLElement;
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
        overflowX: getComputedStyle(frame).overflowX,
        clientWidth: frame.clientWidth,
        scrollWidth: frame.scrollWidth,
        before,
        after,
        scrollContainers,
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.overflowX).toBe("auto");
    expect(metrics!.scrollWidth).toBeGreaterThan(metrics!.clientWidth);
    expect(metrics!.before).toBe(0);
    expect(metrics!.after).toBeGreaterThan(0);
    expect(metrics!.scrollContainers).toHaveLength(1);

    await expect(page.getByRole("combobox")).toBeVisible();
    await expect(page.getByText("Team directory")).toBeVisible();
    await expect(
      page.getByText("Alexandria Catherine Montgomery")
    ).toBeVisible();
  });
});
