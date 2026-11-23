import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Blocks/DashboardHeader Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=blocks-dashboardheader--default&viewMode=story"
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

  test("aligns desktop visual order with the semantic tab order", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/iframe.html?id=blocks-dashboardheader--with-actions&viewMode=story"
    );

    const custom = page.getByRole("button", { name: "Invite teammate" });
    const notifications = page.getByRole("button", { name: /notifications/i });
    const userMenu = page.getByRole("button", { name: /user menu/i });
    const search = page.getByLabel("Search dashboard");

    await expect(custom).toBeVisible();
    await expect(notifications).toBeVisible();
    await expect(userMenu).toBeVisible();
    await expect(search).toBeVisible();

    // DOM and tab order are custom action -> notifications -> user menu -> search.
    await custom.focus();
    await page.keyboard.press("Tab");
    await expect(notifications).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(userMenu).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(search).toBeFocused();

    // The visual order must agree with that same semantic order.
    const boxes = await Promise.all(
      [custom, notifications, userMenu, search].map((locator) =>
        locator.boundingBox()
      )
    );
    expect(boxes.every((box) => box !== null)).toBe(true);
    const [customBox, notificationsBox, userMenuBox, searchBox] = boxes as {
      x: number;
      y: number;
      width: number;
      height: number;
    }[];
    expect(customBox.x).toBeLessThan(notificationsBox.x);
    expect(notificationsBox.x).toBeLessThan(userMenuBox.x);
    expect(userMenuBox.x).toBeLessThan(searchBox.x);
  });

  test("preserves the old mobile containment", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      "/iframe.html?id=blocks-dashboardheader--with-actions&viewMode=story"
    );

    const header = page.locator("#storybook-root header");
    const search = page.getByLabel("Search dashboard");
    await expect(header).toBeVisible();
    await expect(page.getByRole("button", { name: "Invite teammate" })).toBeVisible();
    await expect(search).toBeVisible();

    const metrics = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>(
        "#storybook-root header"
      );
      const search = document.querySelector<HTMLElement>(
        'input[aria-label="Search dashboard"]'
      );
      if (!header || !search) return null;
      const headerRect = header.getBoundingClientRect();
      const searchRect = search.getBoundingClientRect();
      return {
        headerScrollWidth: header.scrollWidth,
        headerClientWidth: header.clientWidth,
        searchLeft: +searchRect.left.toFixed(2),
        searchRight: +searchRect.right.toFixed(2),
        viewportWidth: window.innerWidth,
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.headerScrollWidth).toBeLessThanOrEqual(
      metrics!.headerClientWidth + 1
    );
    expect(metrics!.searchLeft).toBeGreaterThanOrEqual(0);
    expect(metrics!.searchRight).toBeLessThanOrEqual(metrics!.viewportWidth);
  });
});
