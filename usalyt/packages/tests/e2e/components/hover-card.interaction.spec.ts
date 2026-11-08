import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Primitives/HoverCard Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=primitives-hovercard--default&viewMode=story"
    );
    await page.waitForLoadState("domcontentloaded");
  });

  test("renders component in storybook root", async ({ page }) => {
    const root = page.locator("#storybook-root");
    await expect(root).toBeVisible();
  });

  // RED before the task-15 fix: HoverCard reused Base UI Popover without
  // `openOnHover`, so the card only ever opened on click — the pointer hover
  // below timed out with the popup still unmounted.
  test("opens the card on pointer hover without a click and closes on leave", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: "@nextjs" });
    const card = page.getByRole("dialog");

    await expect(trigger).toBeVisible();
    await expect(card).toBeHidden();

    await trigger.hover();
    await expect(card).toBeVisible({ timeout: 5_000 });
    await expect(card).toContainText("The React Framework for the Web");

    // Leaving both the trigger and the card dismisses it again.
    await page.mouse.move(8, 8);
    await expect(card).toBeHidden({ timeout: 5_000 });
  });

  test("keeps keyboard activation: Enter opens, Escape closes and restores focus", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: "@nextjs" });
    const card = page.getByRole("dialog");

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(card).toBeVisible({ timeout: 5_000 });

    await page.keyboard.press("Escape");
    await expect(card).toBeHidden({ timeout: 5_000 });
    await expect(trigger).toBeFocused();
  });

  test("passes axe-core WCAG 2 AA accessibility rules", async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
