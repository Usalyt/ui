import { test } from "@playwright/test";
import { auditStoryA11y } from "./a11y-helper";

test.describe("auth-form Accessibility Audit", () => {
  test("audit auth-form story for zero WCAG 2.1 AA violations in light and dark mode", async ({ page }) => {
    await auditStoryA11y(page, "blocks-authform--default");
  });
});
