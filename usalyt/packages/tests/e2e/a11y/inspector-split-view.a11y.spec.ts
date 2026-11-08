import { test } from "@playwright/test";
import { auditStoryA11y } from "./a11y-helper";

test.describe("inspector-split-view Accessibility Audit", () => {
  test("audit inspector-split-view story for zero WCAG 2.1 AA violations in light and dark mode", async ({ page }) => {
    await auditStoryA11y(page, "blocks-inspectorsplitview--default");
  });
});
