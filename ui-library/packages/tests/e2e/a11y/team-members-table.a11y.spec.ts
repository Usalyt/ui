import { test } from "@playwright/test";
import { auditStoryA11y } from "./a11y-helper";

test.describe("team-members-table Accessibility Audit", () => {
  test("audit team-members-table story for zero WCAG 2.1 AA violations in light and dark mode", async ({ page }) => {
    await auditStoryA11y(page, "blocks-teammemberstable--default");
  });
});
