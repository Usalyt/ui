import { test } from "@playwright/test";
import { auditStoryA11y } from "./a11y-helper";

test.describe("stepper Accessibility Audit", () => {
  test("audit stepper story for zero WCAG 2.1 AA violations in light and dark mode", async ({ page }) => {
    await auditStoryA11y(page, "primitives-stepper--default");
  });
});
