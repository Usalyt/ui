import { test, expect, type Locator, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

type Theme = "dark" | "light";
type ViewportName = "desktop" | "mobile";

const FORMS = [
  {
    name: "AuthForm",
    id: "blocks-authform--submission-error",
    fields: [
      { label: "Email Address", value: "visual-review@example.com" },
      { label: "Password", value: "ReviewPass123!" },
    ],
    emptyErrors: [
      "Please enter a valid email address",
      "Password must be at least 6 characters",
    ],
    submitName: "Sign In",
    alertText:
      "Invalid credentials. Please try again. If the problem persists, contact your administrator.",
  },
  {
    name: "FormWithValidation",
    id: "blocks-formwithvalidation--submission-error",
    fields: [
      { label: "Full Name", value: "Visual Reviewer" },
      { label: "Work Email", value: "visual-review@example.com" },
      { label: "Organization / University", value: "Visual QA" },
    ],
    emptyErrors: [
      "Full name must be at least 2 characters.",
      "Invalid email address.",
      "Organization is required.",
    ],
    submitName: "Save Profile",
    alertText:
      "Profile update failed. Please try again. If the problem persists, contact your administrator.",
  },
] as const;

const VIEWPORTS: Array<{ name: ViewportName; width: number; height: number }> = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

function channelToLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([red, green, blue]: [number, number, number]) {
  return (
    0.2126 * channelToLinear(red) +
    0.7152 * channelToLinear(green) +
    0.0722 * channelToLinear(blue)
  );
}

function contrastRatio(
  foreground: [number, number, number],
  background: [number, number, number]
) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

async function expectVisibleKeyboardFocus(locator: Locator) {
  await expect(locator).toBeFocused();
  const indicator = await locator.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      focusVisible: element.matches(":focus-visible"),
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineColor: style.outlineColor,
    };
  });
  expect(indicator.focusVisible).toBe(true);
  const hasFocusRing =
    indicator.boxShadow.includes("0px 0px 0px 2px") &&
    indicator.boxShadow.includes("0px 0px 0px 4px");
  const hasOutline =
    indicator.outlineStyle !== "none" &&
    Number.parseFloat(indicator.outlineWidth) > 0;
  expect(
    hasFocusRing || hasOutline,
    `Expected an observable focus indicator (2px/4px ring or outline): ${JSON.stringify(indicator)}`
  ).toBe(true);
  return indicator;
}

async function openErrorStory(
  page: Page,
  form: (typeof FORMS)[number],
  theme: Theme
) {
  await page.emulateMedia({ colorScheme: theme });
  await page.goto(
    `/iframe.html?id=${form.id}&viewMode=story&globals=theme:${theme}`,
    { waitUntil: "domcontentloaded" }
  );
  await page.waitForSelector("#storybook-root > *", {
    state: "attached",
    timeout: 15_000,
  });
  await page.waitForFunction(
    expected => document.documentElement.dataset.theme === expected,
    theme,
    { timeout: 8_000 }
  );
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }",
  });
}

async function readAlertContrast(page: Page) {
  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();

  const screenshot = await alert.screenshot({ animations: "disabled" });
  const sample = await page.evaluate(async base64 => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to read the rendered alert pixels.");
    }
    context.drawImage(image, 0, 0);
    const { data, width, height } = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Sample the flat top padding strip, inside the 6px radius and border,
    // and above the first text line. The mode is the actual composited color.
    const counts = new Map<string, number>();
    const maxY = Math.min(6, height - 1);
    for (let y = 3; y <= maxY; y += 1) {
      for (let x = 8; x < width - 8; x += 1) {
        const index = (y * width + x) * 4;
        const key = `${data[index]},${data[index + 1]},${data[index + 2]}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    const [backgroundKey, backgroundSamples] = [...counts.entries()].sort(
      (first, second) => second[1] - first[1]
    )[0] ?? ["0,0,0", 0];
    if (!backgroundSamples) {
      throw new Error("No opaque alert background pixels were sampled.");
    }
    const background = backgroundKey
      .split(",")
      .map(Number) as [number, number, number];

    const alertElement = document.querySelector('[role="alert"]');
    if (!alertElement) {
      throw new Error("The rendered alert element was not found.");
    }
    const computedColor = getComputedStyle(alertElement).color;
    const colorProbe = document.createElement("canvas");
    colorProbe.width = 1;
    colorProbe.height = 1;
    const colorContext = colorProbe.getContext("2d");
    if (!colorContext) {
      throw new Error("Unable to normalize the alert text color.");
    }
    colorContext.fillStyle = computedColor;
    colorContext.fillRect(0, 0, 1, 1);
    const foreground = [
      ...colorContext.getImageData(0, 0, 1, 1).data,
    ].slice(0, 3) as [number, number, number];

    return {
      background,
      backgroundSamples,
      foreground,
      computedColor,
      width,
      height,
    };
  }, screenshot.toString("base64"));

  return {
    ...sample,
    ratio: contrastRatio(sample.foreground, sample.background),
    screenshot,
  };
}

for (const viewport of VIEWPORTS) {
  test.describe(`error feedback ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const theme of ["dark", "light"] as const) {
      for (const form of FORMS) {
        test(`${form.name} ${theme} error is readable and recoverable`, async ({
          page,
        }) => {
          await openErrorStory(page, form, theme);
          const submit = page.getByRole("button", { name: form.submitName });

          // The focus ring must be added by focus, not inherited from the
          // button's base shadow.
          const unfocusedShadow = await submit.evaluate(
            element => getComputedStyle(element).boxShadow
          );
          expect(unfocusedShadow).not.toContain("0px 0px 0px 2px");
          expect(unfocusedShadow).not.toContain("0px 0px 0px 4px");

          // Tab from the document start through every field to the action.
          // Clicking the non-focusable card heading gives the iframe document
          // focus without seeding a control.
          await page.locator("#storybook-root h3").first().click();
          for (const field of form.fields) {
            await page.keyboard.press("Tab");
            await expect(page.getByLabel(field.label)).toBeFocused();
          }
          await page.keyboard.press("Tab");
          const beforeSubmitIndicator = await expectVisibleKeyboardFocus(submit);
          console.log(
            `[error-feedback-focus] ${form.name} pre-submit ` +
              `focusVisible=${beforeSubmitIndicator.focusVisible} ` +
              `boxShadow=${beforeSubmitIndicator.boxShadow}`
          );

          // Real reverse traversal from the action to the previous field, then
          // real forward traversal back to the action.
          const lastField = page.getByLabel(
            form.fields[form.fields.length - 1].label
          );
          await page.keyboard.press("Shift+Tab");
          await expect(lastField).toBeFocused();
          await page.keyboard.press("Tab");
          await expectVisibleKeyboardFocus(submit);

          // Validation remains active before any rejected submission.
          await page.keyboard.press("Enter");
          for (const message of form.emptyErrors) {
            await expect(page.getByText(message)).toBeVisible();
          }
          await expect(page.getByRole("alert")).toHaveCount(0);

          for (const field of form.fields) {
            await page.getByLabel(field.label).fill(field.value);
          }

          // Actual Tab from the last field reaches the action again before the
          // rejected submission; the focus ring must be observable.
          await page.keyboard.press("Tab");
          await expectVisibleKeyboardFocus(submit);
          await page.keyboard.press("Enter");
          const alert = page.getByRole("alert");
          await expect(alert).toBeVisible();
          await expect(alert).toHaveText(form.alertText);
          await expect(submit).toBeEnabled();

          // The temporarily disabled pending action does not retain focus.
          // Add a test-only focus sentinel after the action (as a consumer
          // footer would provide), then reach the real action with Shift+Tab.
          const sentinelId = "error-feedback-focus-sentinel";
          await submit.evaluate((element, id) => {
            const sentinel = document.createElement("button");
            sentinel.id = id;
            sentinel.type = "button";
            sentinel.textContent = "After form";
            sentinel.style.position = "fixed";
            sentinel.style.left = "-9999px";
            element.insertAdjacentElement("afterend", sentinel);
          }, sentinelId);
          const sentinel = page.locator(`#${sentinelId}`);
          await sentinel.focus();
          await expect(sentinel).toBeFocused();
          await page.keyboard.press("Shift+Tab");
          const afterRecoveryIndicator =
            await expectVisibleKeyboardFocus(submit);
          console.log(
            `[error-feedback-focus] ${form.name} post-recovery ` +
              `focusVisible=${afterRecoveryIndicator.focusVisible} ` +
              `boxShadow=${afterRecoveryIndicator.boxShadow}`
          );
          await page.evaluate(id => {
            document.getElementById(id)?.remove();
          }, sentinelId);

          const alertBox = await alert.boundingBox();
          expect(alertBox).not.toBeNull();
          expect(alertBox!.x).toBeGreaterThanOrEqual(0);
          expect(alertBox!.x + alertBox!.width).toBeLessThanOrEqual(
            viewport.width + 1
          );
          expect(
            await alert.evaluate(
              element => element.scrollWidth <= element.clientWidth + 1
            )
          ).toBe(true);
          expect(
            await alert.evaluate(element => {
              const range = document.createRange();
              range.selectNodeContents(element);
              return range.getClientRects().length;
            })
          ).toBeGreaterThanOrEqual(2);

          const contrast = await readAlertContrast(page);
          const label = `${form.name} ${theme} ${viewport.name}`;
          console.log(
            `[error-feedback] ${label} ratio=${contrast.ratio.toFixed(2)} ` +
              `text=rgb(${contrast.foreground.join(",")}) ` +
              `bg=rgb(${contrast.background.join(",")}) ` +
              `computed=${contrast.computedColor}`
          );

          const artifactDirectory = process.env.ERROR_FEEDBACK_SCRATCH;
          if (artifactDirectory) {
            fs.mkdirSync(artifactDirectory, { recursive: true });
            const stem = `${form.name}-${theme}-${viewport.name}`;
            fs.writeFileSync(
              path.join(artifactDirectory, `${stem}.png`),
              contrast.screenshot
            );
            fs.writeFileSync(
              path.join(artifactDirectory, `${stem}.json`),
              JSON.stringify(
                {
                  form: form.name,
                  theme,
                  viewport,
                  ratio: contrast.ratio,
                  foreground: contrast.foreground,
                  background: contrast.background,
                  computedColor: contrast.computedColor,
                  backgroundSamples: contrast.backgroundSamples,
                },
                null,
                2
              )
            );
          }

          expect(
            contrast.ratio,
            `${label}: readable error text on the actual composited alert background`
          ).toBeGreaterThanOrEqual(4.5);
        });
      }
    }
  });
}
