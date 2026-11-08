import { Page, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Audits a Storybook story for zero WCAG 2.1 AA violations in both Light and Dark mode.
 *
 * Each theme is audited in a fresh navigation so the preview decorator owns
 * the `.dark` class strategy (matching `@custom-variant dark`) and no axe
 * state can leak between the two runs.
 */
export async function auditStoryA11y(page: Page, storyId: string) {
  for (const theme of ["light", "dark"] as const) {
    await page.goto(
      `/iframe.html?id=${storyId}&viewMode=story&globals=theme:${theme}`,
    );
    await page.waitForLoadState("domcontentloaded");
    // Wait for the story to actually mount before auditing: an empty
    // #storybook-root would make axe report zero violations without auditing
    // anything (false pass), and a half-mounted tree can produce false fails.
    await page.waitForSelector("#storybook-root > *", {
      state: "attached",
      timeout: 15_000,
    });

    await page.addStyleTag({
      content:
        "*, *::before, *::after { transition: none !important; animation: none !important; }",
    });

    const results = await runAxe(page);

    const violations = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(
      violations,
      `${theme === "light" ? "Light" : "Dark"} theme WCAG 2.1 AA violations in story "${storyId}"`,
    ).toEqual([]);
  }
}

/**
 * axe-core refuses to start a second run while one is in flight (the
 * Storybook a11y addon or a previous partial may still hold the lock).
 * Wait for any in-flight run, then retry once if the race still hits.
 */
async function runAxe(page: Page, attempt = 0): Promise<Awaited<ReturnType<AxeBuilder["analyze"]>>> {
  await page
    .waitForFunction(() => {
      const axe = (window as unknown as { axe?: { _running?: boolean } }).axe;
      return !axe || axe._running !== true;
    })
    .catch(() => {
      // If the flag never clears, let analyze() surface the real error.
    });
  try {
    return await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (attempt < 1 && message.includes("Axe is already running")) {
      await page.waitForTimeout(500);
      return runAxe(page, attempt + 1);
    }
    throw error;
  }
}
