import { test, expect } from "@playwright/test";

function parseRgb(colorStr: string): [number, number, number] {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
  }
  if (colorStr.startsWith("#")) {
    const hex = colorStr.slice(1);
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
  }
  return [0, 0, 0];
}

function getLuminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrast(color1: string, color2: string): number {
  const rgb1 = parseRgb(color1);
  const rgb2 = parseRgb(color2);
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

test.describe("Runtime Visual Contrast Checks (Adaptive Light & Dark)", () => {
  // 1. Team Members Table (Light & Dark)
  test("TeamMembersTable in Light Theme: card, name, select, badge Owner", async ({ page }) => {
    await page.goto("/iframe.html?id=blocks-teammemberstable--default&viewMode=story&globals=theme:light");
    await page.waitForLoadState("domcontentloaded");

    await page.evaluate(() => {
      document.documentElement.dataset.theme = "light";
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      const root = document.getElementById("storybook-root");
      if (root) root.classList.remove("dark");
    });

    const card = page.locator("[class*='rounded-xl'], [class*='rounded-lg']").first();
    await expect(card).toBeVisible();

    const cardStyles = await card.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { bg: style.backgroundColor, color: style.color };
    });

    const memberName = card.locator("span.font-semibold").first();
    const nameStyles = await memberName.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { color: style.color };
    });

    const selectEl = card.locator("select").first();
    const selectStyles = await selectEl.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { bg: style.backgroundColor, color: style.color };
    });

    const ownerBadge = card.getByText("Owner", { exact: true });
    const badgeStyles = await ownerBadge.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { bg: style.backgroundColor, color: style.color };
    });

    const nameContrast = calculateContrast(nameStyles.color, cardStyles.bg);
    const selectContrast = calculateContrast(selectStyles.color, selectStyles.bg);
    const badgeContrast = calculateContrast(badgeStyles.color, badgeStyles.bg);

    console.log(`[RUNTIME LIGHT] TeamMembersTable Card BG: ${cardStyles.bg}`);
    console.log(`[RUNTIME LIGHT] Member Name: ${nameStyles.color} on ${cardStyles.bg} -> Contrast: ${nameContrast.toFixed(2)}:1`);
    console.log(`[RUNTIME LIGHT] Select: ${selectStyles.color} on ${selectStyles.bg} -> Contrast: ${selectContrast.toFixed(2)}:1`);
    console.log(`[RUNTIME LIGHT] Owner Badge: ${badgeStyles.color} on ${badgeStyles.bg} -> Contrast: ${badgeContrast.toFixed(2)}:1`);

    expect(nameContrast).toBeGreaterThanOrEqual(4.5);
    expect(selectContrast).toBeGreaterThanOrEqual(4.5);
    expect(badgeContrast).toBeGreaterThanOrEqual(4.5);
  });

  test("TeamMembersTable in Dark Theme: card, name, select, badge Owner", async ({ page }) => {
    await page.goto("/iframe.html?id=blocks-teammemberstable--default&viewMode=story&globals=theme:dark");
    await page.waitForLoadState("domcontentloaded");

    await page.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      const root = document.getElementById("storybook-root");
      if (root) root.classList.add("dark");
    });

    const card = page.locator("[class*='rounded-xl'], [class*='rounded-lg']").first();
    await expect(card).toBeVisible();

    const cardStyles = await card.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { bg: style.backgroundColor, color: style.color };
    });

    const memberName = card.locator("span.font-semibold").first();
    const nameStyles = await memberName.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { color: style.color };
    });

    const selectEl = card.locator("select").first();
    const selectStyles = await selectEl.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { bg: style.backgroundColor, color: style.color };
    });

    const ownerBadge = card.getByText("Owner", { exact: true });
    const badgeStyles = await ownerBadge.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { bg: style.backgroundColor, color: style.color };
    });

    const nameContrast = calculateContrast(nameStyles.color, cardStyles.bg);
    const selectContrast = calculateContrast(selectStyles.color, selectStyles.bg);
    const badgeContrast = calculateContrast(badgeStyles.color, badgeStyles.bg);

    console.log(`[RUNTIME DARK] TeamMembersTable Card BG: ${cardStyles.bg}`);
    console.log(`[RUNTIME DARK] Member Name: ${nameStyles.color} on ${cardStyles.bg} -> Contrast: ${nameContrast.toFixed(2)}:1`);
    console.log(`[RUNTIME DARK] Select: ${selectStyles.color} on ${selectStyles.bg} -> Contrast: ${selectContrast.toFixed(2)}:1`);
    console.log(`[RUNTIME DARK] Owner Badge: ${badgeStyles.color} on ${badgeStyles.bg} -> Contrast: ${badgeContrast.toFixed(2)}:1`);

    expect(nameContrast).toBeGreaterThanOrEqual(4.5);
    expect(selectContrast).toBeGreaterThanOrEqual(4.5);
    expect(badgeContrast).toBeGreaterThanOrEqual(4.5);
  });

  // 2. Input with typed value (Light & Dark)
  test("Input with typed value in Light Theme computes contrast >= 4.5:1", async ({ page }) => {
    await page.goto("/iframe.html?id=primitives-input--default&viewMode=story&globals=theme:light");
    await page.waitForLoadState("domcontentloaded");

    await page.evaluate(() => {
      document.documentElement.dataset.theme = "light";
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      const root = document.getElementById("storybook-root");
      if (root) root.classList.remove("dark");
    });

    const input = page.locator("input").first();
    await expect(input).toBeVisible();
    await input.fill("Linear Adaptive Light");

    const inputStyles = await input.evaluate((el: HTMLInputElement) => {
      const style = window.getComputedStyle(el);
      return {
        bg: style.backgroundColor,
        color: style.color,
      };
    });

    const effectiveBg = "rgb(255, 255, 255)";
    const contrast = calculateContrast(inputStyles.color, effectiveBg);

    console.log(`[RUNTIME LIGHT] Input Raw BG: ${inputStyles.bg} (effective canvas: ${effectiveBg})`);
    console.log(`[RUNTIME LIGHT] Input Typed Value Color: ${inputStyles.color} -> Contrast: ${contrast.toFixed(2)}:1`);

    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });

  test("Input with typed value in Dark Theme computes contrast >= 4.5:1", async ({ page }) => {
    await page.goto("/iframe.html?id=primitives-input--default&viewMode=story&globals=theme:dark");
    await page.waitForLoadState("domcontentloaded");

    await page.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      const root = document.getElementById("storybook-root");
      if (root) root.classList.add("dark");
    });

    const input = page.locator("input").first();
    await expect(input).toBeVisible();
    await input.fill("Linear Dark Mode");

    const inputStyles = await input.evaluate((el: HTMLInputElement) => {
      const style = window.getComputedStyle(el);
      return {
        bg: style.backgroundColor,
        color: style.color,
      };
    });

    const effectiveBg = "rgb(8, 9, 10)";
    const contrast = calculateContrast(inputStyles.color, effectiveBg);

    console.log(`[RUNTIME DARK] Input Raw BG: ${inputStyles.bg} (effective canvas: ${effectiveBg})`);
    console.log(`[RUNTIME DARK] Input Typed Value Color: ${inputStyles.color} -> Contrast: ${contrast.toFixed(2)}:1`);

    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });

  // 3. Open Dialog (Light & Dark)
  test("Dialog in Light Theme computes contrast >= 4.5:1 on portaled popup", async ({ page }) => {
    await page.goto("/iframe.html?id=primitives-dialog--default&viewMode=story&globals=theme:light");
    await page.waitForLoadState("domcontentloaded");

    await page.evaluate(() => {
      document.documentElement.dataset.theme = "light";
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      const root = document.getElementById("storybook-root");
      if (root) root.classList.remove("dark");
    });

    const trigger = page.locator("button", { hasText: /Open Terms/i });
    await trigger.click();

    const popup = page.locator("[role='dialog']");
    await expect(popup).toBeVisible();

    const popupStyles = await popup.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { bg: style.backgroundColor, color: style.color };
    });

    const titleEl = popup.locator("h2, [class*='font-semibold']").first();
    const titleStyles = await titleEl.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { color: style.color };
    });

    const descEl = popup.locator("p").first();
    const descStyles = await descEl.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { color: style.color };
    });

    const popupContrast = calculateContrast(popupStyles.color, popupStyles.bg);
    const titleContrast = calculateContrast(titleStyles.color, popupStyles.bg);
    const descContrast = calculateContrast(descStyles.color, popupStyles.bg);

    console.log(`[RUNTIME LIGHT] Dialog Popup BG: ${popupStyles.bg}`);
    console.log(`[RUNTIME LIGHT] Dialog Body Text: ${popupStyles.color} -> Contrast: ${popupContrast.toFixed(2)}:1`);
    console.log(`[RUNTIME LIGHT] Dialog Title Text: ${titleStyles.color} -> Contrast: ${titleContrast.toFixed(2)}:1`);
    console.log(`[RUNTIME LIGHT] Dialog Description Text: ${descStyles.color} -> Contrast: ${descContrast.toFixed(2)}:1`);

    expect(popupContrast).toBeGreaterThanOrEqual(4.5);
    expect(titleContrast).toBeGreaterThanOrEqual(4.5);
    expect(descContrast).toBeGreaterThanOrEqual(4.5);
  });

  test("Dialog in Dark Theme computes contrast >= 4.5:1 on portaled popup", async ({ page }) => {
    await page.goto("/iframe.html?id=primitives-dialog--default&viewMode=story&globals=theme:dark");
    await page.waitForLoadState("domcontentloaded");

    await page.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      const root = document.getElementById("storybook-root");
      if (root) root.classList.add("dark");
    });

    const trigger = page.locator("button", { hasText: /Open Terms/i });
    await trigger.click();

    const popup = page.locator("[role='dialog']");
    await expect(popup).toBeVisible();

    const popupStyles = await popup.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { bg: style.backgroundColor, color: style.color };
    });

    const titleEl = popup.locator("h2, [class*='font-semibold']").first();
    const titleStyles = await titleEl.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { color: style.color };
    });

    const descEl = popup.locator("p").first();
    const descStyles = await descEl.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { color: style.color };
    });

    const popupContrast = calculateContrast(popupStyles.color, popupStyles.bg);
    const titleContrast = calculateContrast(titleStyles.color, popupStyles.bg);
    const descContrast = calculateContrast(descStyles.color, popupStyles.bg);

    console.log(`[RUNTIME DARK] Dialog Popup BG: ${popupStyles.bg}`);
    console.log(`[RUNTIME DARK] Dialog Body Text: ${popupStyles.color} -> Contrast: ${popupContrast.toFixed(2)}:1`);
    console.log(`[RUNTIME DARK] Dialog Title Text: ${titleStyles.color} -> Contrast: ${titleContrast.toFixed(2)}:1`);
    console.log(`[RUNTIME DARK] Dialog Description Text: ${descStyles.color} -> Contrast: ${descContrast.toFixed(2)}:1`);

    expect(popupContrast).toBeGreaterThanOrEqual(4.5);
    expect(titleContrast).toBeGreaterThanOrEqual(4.5);
    expect(descContrast).toBeGreaterThanOrEqual(4.5);
  });
});
