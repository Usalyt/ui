import { test, expect } from "@playwright/test";

test.describe("Blocks/InspectorSplitView containment and selection", () => {
  test("makes long details reachable through one local panel scroller", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/iframe.html?id=blocks-inspectorsplitview--long-details&viewMode=story"
    );
    await page.getByText("Target Selector").waitFor();

    const metrics = await page.evaluate(() => {
      const panel = Array.from(
        document.querySelectorAll<HTMLElement>("#storybook-root div")
      ).find(
        (element) =>
          element.className.includes("bg-muted/10") &&
          element.className.includes("p-4") &&
          (element.textContent ?? "").includes("Target Selector")
      );
      if (!panel) return null;
      const classBlock = panel.querySelector<HTMLElement>(".break-all");
      if (!classBlock) return null;
      const panelRect = panel.getBoundingClientRect();
      const beforeRect = classBlock.getBoundingClientRect();
      const before = {
        overflowY: getComputedStyle(panel).overflowY,
        clientHeight: panel.clientHeight,
        scrollHeight: panel.scrollHeight,
        scrollTop: panel.scrollTop,
        classBottom: +beforeRect.bottom.toFixed(2),
        panelBottom: +panelRect.bottom.toFixed(2),
      };
      panel.scrollTop = panel.scrollHeight;
      const afterRect = classBlock.getBoundingClientRect();
      return {
        before,
        after: {
          scrollTop: panel.scrollTop,
          classTop: +afterRect.top.toFixed(2),
          classBottom: +afterRect.bottom.toFixed(2),
          panelTop: +panelRect.top.toFixed(2),
          panelBottom: +panelRect.bottom.toFixed(2),
        },
        classText: (classBlock.textContent ?? "").trim(),
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.before.overflowY).toBe("auto");
    expect(metrics!.before.scrollHeight).toBeGreaterThan(
      metrics!.before.clientHeight
    );
    expect(metrics!.before.scrollTop).toBe(0);
    expect(metrics!.before.classBottom).toBeGreaterThan(
      metrics!.before.panelBottom
    );
    expect(metrics!.after.scrollTop).toBeGreaterThan(0);
    expect(metrics!.after.classBottom).toBeLessThanOrEqual(
      metrics!.after.panelBottom + 1
    );
    expect(metrics!.after.classTop).toBeLessThan(
      metrics!.after.panelBottom
    );
    expect(metrics!.classText).toContain("utility-class-79");
  });

  test("preserves tree selection and details updates", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/iframe.html?id=blocks-inspectorsplitview--default&viewMode=story"
    );
    await page.getByText("DOM Hierarchy").waitFor();

    await page.getByText("<button>").last().click();
    await expect(
      page.getByText("button#checkout-btn.btn-primary")
    ).toBeVisible();
  });
});
