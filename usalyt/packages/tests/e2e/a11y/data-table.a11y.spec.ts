import { test } from "@playwright/test";
import { auditStoryA11y } from "./a11y-helper";

test.describe("data-table Accessibility Audit", () => {
  test("audit data-table story for zero WCAG 2.1 AA violations in light and dark mode", async ({ page }) => {
    await auditStoryA11y(page, "primitives-datatable--default");
  });
});
