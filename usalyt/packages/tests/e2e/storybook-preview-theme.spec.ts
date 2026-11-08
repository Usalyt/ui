import { test, expect, type Page } from "@playwright/test";

function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  return errors;
}

test.describe("Storybook preview theme runtime", () => {
  test("renders the AppShellLayout Docs page without the decorator crash", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await page.goto(
      "/iframe.html?id=blocks-appshelllayout--docs&viewMode=docs&globals=theme:dark"
    );
    await page.waitForSelector("#storybook-docs", { timeout: 60_000 });
    await page.waitForTimeout(800);

    expect(errors, errors.join("\n")).toEqual([]);
    await expect(page.getByRole("heading", { name: "AppShellLayout" })).toBeVisible();
    await expect(page.getByText("Project Dashboard").first()).toBeVisible();
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "dark"
    );
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains("dark")
      )
    ).toBe(true);
    expect(
      await page.evaluate(() => document.body.classList.contains("dark"))
    ).toBe(true);
  });

  test("keeps Canvas light/dark synchronization and page errors empty", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await page.goto(
      "/iframe.html?id=blocks-appshelllayout--default&viewMode=story&globals=theme:light"
    );
    await page.waitForSelector("#storybook-root");
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "light"
    );
    expect(errors, errors.join("\n")).toEqual([]);
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains("dark")
      )
    ).toBe(false);
    expect(
      await page.evaluate(() => document.body.classList.contains("dark"))
    ).toBe(false);
    await expect(page.getByText("Project Dashboard").first()).toBeVisible();

    await page.goto(
      "/iframe.html?id=blocks-appshelllayout--default&viewMode=story&globals=theme:dark"
    );
    await page.waitForSelector("#storybook-root");
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "dark"
    );
    expect(errors, errors.join("\n")).toEqual([]);
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains("dark")
      )
    ).toBe(true);
    expect(
      await page.evaluate(() => document.body.classList.contains("dark"))
    ).toBe(true);
  });



  test("switches the Docs theme through the Storybook toolbar", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await page.goto("/?path=/docs/blocks-appshelllayout--docs");
    const iframe = page.frameLocator("#storybook-preview-iframe");
    await expect(iframe.locator("html")).toHaveAttribute(
      "data-theme",
      "dark",
      { timeout: 60_000 }
    );
    await expect(
      iframe.getByText("Project Dashboard").first()
    ).toBeVisible();
    const collapse = page.getByRole("button", {
      name: "Collapse onboarding guide",
    });
    if ((await collapse.count()) > 0) {
      await collapse.click();
      await page.waitForTimeout(300);
    }

    const themeButton = page.getByRole("button", {
      name: /Global theme for components/,
    });
    await themeButton.click();
    await page.getByRole("option", { name: "Light" }).click();
    await expect(iframe.locator("html")).toHaveAttribute(
      "data-theme",
      "light"
    );
    expect(
      await iframe.locator("html").evaluate((element) =>
        element.classList.contains("dark")
      )
    ).toBe(false);
    await expect(iframe.locator("body")).not.toContainText(
      "resolveDispatcher"
    );

    await themeButton.click();
    await page.getByRole("option", { name: "Dark" }).click();
    await expect(iframe.locator("html")).toHaveAttribute(
      "data-theme",
      "dark"
    );
    expect(
      await iframe.locator("html").evaluate((element) =>
        element.classList.contains("dark")
      )
    ).toBe(true);
    await expect(iframe.locator("body")).not.toContainText(
      "resolveDispatcher"
    );
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("keeps an ordinary hook-bearing story interactive", async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto(
      "/iframe.html?id=primitives-tabs--default&viewMode=story&globals=theme:dark"
    );
    await page.waitForSelector("#storybook-root");
    await page.getByRole("tab", { name: "Password" }).click();
    await expect(page.getByText("Password & Security")).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
  });
});
