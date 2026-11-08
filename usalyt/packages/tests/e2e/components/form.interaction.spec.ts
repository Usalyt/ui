import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const formUrl = (theme: "light" | "dark") =>
  `/iframe.html?id=primitives-form--default&viewMode=story&globals=theme:${theme}`;

test.describe("Primitives/Form Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=primitives-form--default&viewMode=story"
    );
    await page.waitForLoadState("domcontentloaded");
  });

  test("renders component in storybook root", async ({ page }) => {
    const root = page.locator("#storybook-root");
    await expect(root).toBeVisible();
  });

  test("passes axe-core WCAG 2 AA accessibility rules", async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("light-mode example uses restrained, token-backed elevation", async ({
    page,
  }) => {
    await page.goto(formUrl("light"));
    await page.waitForSelector("#storybook-root > div > div");

    const shadow = await page.evaluate(() => {
      const card = document.querySelector<HTMLElement>(
        "#storybook-root > div > div"
      );
      return {
        theme: document.documentElement.dataset.theme,
        boxShadow: card ? getComputedStyle(card).boxShadow : null,
      };
    });

    expect(shadow.theme).toBe("light");
    expect(shadow.boxShadow).not.toBeNull();
    expect(shadow.boxShadow).not.toBe("none");

    const alphas = Array.from(
      shadow.boxShadow!.matchAll(/rgba?\(([^)]+)\)/g)
    )
      .map((match) => match[1].split(",").map((part) => part.trim()))
      .filter((parts) => parts.length === 4)
      .map((parts) => Number.parseFloat(parts[3]));

    expect(alphas.length).toBeGreaterThan(0);
    expect(Math.max(...alphas)).toBeLessThanOrEqual(0.2);
  });

  test("dark-mode example keeps the intended deeper elevation", async ({
    page,
  }) => {
    await page.goto(formUrl("dark"));
    await page.waitForSelector("#storybook-root > div > div");

    const shadow = await page.evaluate(() => {
      const card = document.querySelector<HTMLElement>(
        "#storybook-root > div > div"
      );
      return {
        theme: document.documentElement.dataset.theme,
        boxShadow: card ? getComputedStyle(card).boxShadow : null,
      };
    });

    expect(shadow.theme).toBe("dark");
    const alphas = Array.from(
      shadow.boxShadow!.matchAll(/rgba?\(([^)]+)\)/g)
    )
      .map((match) => match[1].split(",").map((part) => part.trim()))
      .filter((parts) => parts.length === 4)
      .map((parts) => Number.parseFloat(parts[3]));

    expect(Math.max(...alphas)).toBeGreaterThanOrEqual(0.5);
  });

  test("keeps fields, copy and validation behavior unchanged", async ({
    page,
  }) => {
    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByPlaceholder("shadcn")).toBeVisible();
    await expect(page.getByPlaceholder("m@example.com")).toBeVisible();

    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText("Username must be at least 2 characters.")
    ).toBeVisible();
    await expect(
      page.getByText("Please enter a valid email address.")
    ).toBeVisible();
  });
});
