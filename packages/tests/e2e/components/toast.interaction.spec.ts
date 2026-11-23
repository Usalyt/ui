import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const toastStory = (id: string, theme: "light" | "dark" = "light") =>
  `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;

async function addToasts(
  page: Page,
  count: number,
  options: { viaKeyboard?: boolean } = {}
) {
  const button = page.getByRole("button", { name: "Add toast" });
  for (let index = 0; index < count; index += 1) {
    if (options.viaKeyboard) {
      await button.focus();
      await page.keyboard.press("Enter");
    } else {
      await button.click();
    }
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(700);
}

async function measureStack(page: Page, filterText?: string) {
  return page.evaluate((filterText) => {
    const viewports = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[role="region"][aria-label="Notifications"]'
      )
    );
    const viewport = filterText
      ? viewports.find((element) => (element.textContent ?? "").includes(filterText))
      : viewports[0];
    if (!viewport) return null;

    const rect = viewport.getBoundingClientRect();
    const roots = Array.from(viewport.children).filter((element) =>
      element.matches('[role="status"], [role="alert"], [data-limited]')
    );
    const visible = roots.filter(
      (element) => !element.hasAttribute("data-limited")
    );
    const limited = roots.filter((element) =>
      element.hasAttribute("data-limited")
    );
    const box = (element: Element) => {
      const value = element.getBoundingClientRect();
      return {
        top: +value.top.toFixed(2),
        bottom: +value.bottom.toFixed(2),
        height: +value.height.toFixed(2),
      };
    };

    return {
      viewport: {
        top: +rect.top.toFixed(2),
        bottom: +rect.bottom.toFixed(2),
        height: +rect.height.toFixed(2),
        expanded: viewport.hasAttribute("data-expanded"),
      },
      rootCount: roots.length,
      visibleCount: visible.length,
      limitedCount: limited.length,
      visible: visible.map((element) => ({
        ...box(element),
        role: element.getAttribute("role"),
        ariaLive: element.getAttribute("aria-live"),
        closeButtons: element.querySelectorAll("button").length,
      })),
      limited: limited.map((element) => ({
        ...box(element),
        display: getComputedStyle(element).display,
        opacity: getComputedStyle(element).opacity,
        inert: (element as HTMLElement).inert === true,
      })),
      windowHeight: window.innerHeight,
    };
  }, filterText);
}

test.describe("Primitives/Toast Component E2E & A11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=primitives-toast--default&viewMode=story"
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

  test("keeps the viewport bounded after repeated additions", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(toastStory("primitives-toast--success-toast"));
    await page.getByRole("button", { name: "Add toast" }).waitFor();
    await page.waitForTimeout(350);

    await addToasts(page, 9);
    const stack = await measureStack(page);
    expect(stack).not.toBeNull();

    expect(stack!.rootCount).toBe(10);
    expect(stack!.visibleCount).toBe(3);
    expect(stack!.limitedCount).toBe(7);
    for (const limited of stack!.limited) {
      expect(limited.display).toBe("none");
      expect(limited.height).toBe(0);
      expect(limited.inert).toBe(true);
    }
    expect(stack!.viewport.height).toBeLessThanOrEqual(242);
    expect(stack!.viewport.top).toBeGreaterThanOrEqual(0);
    for (const visible of stack!.visible) {
      expect(visible.top).toBeGreaterThanOrEqual(0);
      expect(visible.bottom).toBeLessThanOrEqual(stack!.windowHeight);
      expect(visible.role).toBe("status");
      expect(visible.ariaLive).toBe("polite");
      expect(visible.closeButtons).toBeGreaterThanOrEqual(1);
    }
    expect(new Set(stack!.visible.map((item) => item.height)).size).toBe(1);
  });

  test("keeps the stack inside a constrained viewport", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 500 });
    await page.goto(toastStory("primitives-toast--success-toast"));
    await page.getByRole("button", { name: "Add toast" }).waitFor();
    await page.waitForTimeout(350);

    // The fixed viewport can cover the Add toast button at this width;
    // keyboard activation is the public interaction that remains reachable.
    await addToasts(page, 7, { viaKeyboard: true });
    const stack = await measureStack(page);
    expect(stack).not.toBeNull();

    expect(stack!.rootCount).toBe(8);
    expect(stack!.visibleCount).toBe(3);
    expect(stack!.limitedCount).toBe(5);
    for (const limited of stack!.limited) {
      expect(limited.display).toBe("none");
      expect(limited.height).toBe(0);
    }
    expect(stack!.viewport.height).toBeLessThanOrEqual(242);
    expect(stack!.viewport.top).toBeGreaterThanOrEqual(0);
    for (const visible of stack!.visible) {
      expect(visible.top).toBeGreaterThanOrEqual(0);
      expect(visible.bottom).toBeLessThanOrEqual(stack!.windowHeight);
    }
  });

  test("promotes a limited toast on close without growing the viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(toastStory("primitives-toast--success-toast"));
    await page.getByRole("button", { name: "Add toast" }).waitFor();
    await page.waitForTimeout(350);

    await addToasts(page, 4);
    const before = await measureStack(page);
    expect(before).not.toBeNull();
    expect(before!.rootCount).toBe(5);
    expect(before!.visibleCount).toBe(3);
    expect(before!.limitedCount).toBe(2);
    expect(before!.viewport.height).toBeLessThanOrEqual(242);

    await page
      .locator(
        '[role="region"][aria-label="Notifications"] [role="status"]'
      )
      .first()
      .getByRole("button", { name: "Close" })
      .click();
    await page.waitForTimeout(900);

    const after = await measureStack(page);
    expect(after).not.toBeNull();
    expect(after!.rootCount).toBe(4);
    expect(after!.visibleCount).toBe(3);
    expect(after!.limitedCount).toBe(1);
    expect(after!.viewport.height).toBeLessThanOrEqual(242);
    for (const limited of after!.limited) {
      expect(limited.display).toBe("none");
    }
    for (const visible of after!.visible) {
      expect(visible.top).toBeGreaterThanOrEqual(0);
      expect(visible.bottom).toBeLessThanOrEqual(after!.windowHeight);
    }
  });

  test("preserves hover, focus and leave expansion behavior", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(toastStory("primitives-toast--success-toast"));
    await page.getByRole("button", { name: "Add toast" }).waitFor();
    await page.waitForTimeout(350);

    await addToasts(page, 2);
    const firstToast = page
      .locator(
        '[role="region"][aria-label="Notifications"] [role="status"]'
      )
      .first();

    await firstToast.hover();
    await expect
      .poll(() => measureStack(page))
      .toMatchObject({ viewport: { expanded: true, height: 241 } });

    await page.mouse.move(10, 10);
    await expect
      .poll(() => measureStack(page))
      .toMatchObject({ viewport: { expanded: false, height: 241 } });

    await firstToast.click();
    await expect
      .poll(() => measureStack(page))
      .toMatchObject({ viewport: { expanded: true, height: 241 } });

    await page.mouse.click(10, 10);
    await expect
      .poll(() => measureStack(page))
      .toMatchObject({ viewport: { expanded: false, height: 241 } });
  });

  test("keeps the pictured Docs Success story stack bounded", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      "/iframe.html?id=primitives-toast--docs&viewMode=docs&globals=theme:light"
    );
    const anchor = page.locator(
      "#anchor--primitives-toast--success-toast"
    );
    await anchor.waitFor();
    const addButton = anchor.getByRole("button", { name: "Add toast" });
    for (let index = 0; index < 3; index += 1) {
      await addButton.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(900);

    const stack = await measureStack(page, "Deployment Successful");
    expect(stack).not.toBeNull();
    expect(stack!.rootCount).toBe(4);
    expect(stack!.visibleCount).toBe(3);
    expect(stack!.limitedCount).toBe(1);
    expect(stack!.limited[0].display).toBe("none");
    expect(stack!.limited[0].height).toBe(0);
    expect(stack!.viewport.height).toBeLessThanOrEqual(242);
    for (const visible of stack!.visible) {
      expect(visible.top).toBeGreaterThanOrEqual(0);
      expect(visible.bottom).toBeLessThanOrEqual(stack!.windowHeight);
    }
  });
});
