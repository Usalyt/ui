import { test, expect } from "@playwright/test";

test.describe("Dynamic ARIA Live Region & Announcement E2E Audit", () => {
  test("Toast story exposes role status/alert and aria-live polite/assertive", async ({ page }) => {
    await page.goto("/iframe.html?id=primitives-toast--default&viewMode=story");
    await page.waitForLoadState("domcontentloaded");

    const toastRoot = page.locator('[role="status"], [role="alert"]').first();
    await expect(toastRoot).toBeVisible();

    const ariaLive = await toastRoot.getAttribute("aria-live");
    expect(["polite", "assertive"]).toContain(ariaLive);
  });

  test("Combobox story contains polite live region for search results announcement", async ({ page }) => {
    await page.goto("/iframe.html?id=primitives-combobox--default&viewMode=story");
    await page.waitForLoadState("domcontentloaded");

    // Open combobox popover
    const trigger = page.locator('button[role="combobox"]').first();
    await trigger.click();

    const liveRegion = page.locator('[aria-live="polite"]').first();
    await expect(liveRegion).toBeAttached();
  });

  test("DataTable story contains status region for row filtering announcements", async ({ page }) => {
    await page.goto("/iframe.html?id=primitives-datatable--default&viewMode=story");
    await page.waitForLoadState("domcontentloaded");

    const statusRegion = page.locator('[role="status"][aria-live="polite"]').first();
    await expect(statusRegion).toBeVisible();
  });
});
