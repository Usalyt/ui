import { test } from "@playwright/test";
import { auditStoryA11y } from "./a11y-helper";

test.describe("radio-group Accessibility Audit", () => {
  test("audit radio-group story for zero WCAG 2.1 AA violations in light and dark mode", async ({ page }) => {
    await auditStoryA11y(page, "primitives-radiogroup--default");
  });
});
