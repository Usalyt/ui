import { test } from "@playwright/test";
import { auditStoryA11y } from "./a11y-helper";

test.describe("empty-state-block Accessibility Audit", () => {
  test("audit empty-state-block story for zero WCAG 2.1 AA violations in light and dark mode", async ({ page }) => {
    await auditStoryA11y(page, "blocks-emptystateblock--default");
  });
});
