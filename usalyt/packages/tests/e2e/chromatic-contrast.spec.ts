import { test, expect, type Page, type Locator } from "@playwright/test";

// Both-theme chromatic contrast floor (OpenSpec: Both-Theme Contrast Floor +
// Theme-Gated Dark Mode; tasks 10-11 of refactor-sdd-tdd-full-coverage).
//
// RED state: badge chromatic accents measure ~2.1:1 (signal-teal) to ~4.0:1
// (iris-violet) in light theme, and `dark:` utilities compile to
// prefers-color-scheme media queries, so a light theme on a dark-OS host
// renders dark washes. GREEN: explicit -foreground pairs per DESIGN.md plus
// `@custom-variant dark (&:where(.dark, .dark *))`.

type RGB = [number, number, number];

function fmt(rgb: RGB): string {
  return `rgb(${rgb.map((v) => Math.round(v)).join(", ")})`;
}

async function forceTheme(page: Page, theme: "light" | "dark") {
  await page.evaluate((t) => {
    document.documentElement.dataset.theme = t;
    const apply = (el: Element | null | undefined) => {
      if (!el) return;
      el.classList.toggle("dark", t === "dark");
    };
    apply(document.documentElement);
    apply(document.body);
    const root = document.getElementById("storybook-root");
    apply(root);
    if (root) apply(root.firstElementChild);
  }, theme);
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; } html { background-color: var(--color-background) !important; }",
  });
}

// In-page measurement: composites every translucent ancestor background down
// to the first opaque one (CSS painting model), then computes the text/backdrop
// ratio, honoring the element's own background alpha and opacity.
const measureSelf = (locator: Locator) =>
  locator.evaluate((el: Element) => {
    const parseColor = (value: string) => {
      // Chromium serializes color-mix()/token colors as oklab/oklch —
      // convert any modern color syntax to sRGB ourselves.
      const oklab = value.match(
        /^oklab\(([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+))?\)$/,
      );
      const oklch = value.match(
        /^oklch\(([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+))?\)$/,
      );
      if (oklab || oklch) {
        const m = oklab ?? oklch!;
        const [L, a, b] = oklch
          ? [
              parseFloat(m[1]),
              parseFloat(m[2]) * Math.cos((parseFloat(m[3]) * Math.PI) / 180),
              parseFloat(m[2]) * Math.sin((parseFloat(m[3]) * Math.PI) / 180),
            ]
          : [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
        const alpha = m[4] === undefined ? 1 : parseFloat(m[4]);
        return { rgb: oklabToRgb(L, a, b), alpha };
      }
      const m = value.match(/rgba?\(([^)]+)\)/);
      if (!m) {
        const hex = value.match(/^#([0-9a-f]{6})$/i);
        if (hex) {
          return {
            rgb: [
              parseInt(hex[1].slice(0, 2), 16),
              parseInt(hex[1].slice(2, 4), 16),
              parseInt(hex[1].slice(4, 6), 16),
            ] as RGB,
            alpha: 1,
          };
        }
        return { rgb: [255, 255, 255] as RGB, alpha: 0 };
      }
      const parts = m[1]
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((v) => parseFloat(v));
      return {
        rgb: [parts[0], parts[1] ?? 0, parts[2] ?? 0] as RGB,
        alpha: parts[3] === undefined ? 1 : parts[3],
      };
    };

    function oklabToRgb(L: number, a: number, b: number): RGB {
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.291485548 * b;
      const l = l_ * l_ * l_;
      const m = m_ * m_ * m_;
      const s = s_ * s_ * s_;
      const toGamma = (c: number) => {
        const clamped = Math.min(1, Math.max(0, c));
        const enc =
          clamped <= 0.0031308
            ? 12.92 * clamped
            : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
        return Math.round(255 * enc);
      };
      return [
        toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
      ];
    }

    // Walk up from the PARENT until an opaque backdrop is found (the element's
    // own background is composited on top of this backdrop separately).
    const layers: Array<{ rgb: RGB; alpha: number }> = [];
    let node: Element | null = el.parentElement;
    while (node && node instanceof Element) {
      const parsed = parseColor(window.getComputedStyle(node).backgroundColor);
      if (parsed.alpha > 0) {
        layers.push(parsed);
        if (parsed.alpha === 1) break;
      }
      node = node.parentElement;
    }
    let backdrop: RGB = [255, 255, 255];
    if (layers.length && layers[layers.length - 1].alpha === 1) {
      backdrop = layers[layers.length - 1].rgb;
      for (let i = layers.length - 2; i >= 0; i--) {
        const { rgb, alpha } = layers[i];
        backdrop = backdrop.map(
          (c, i2) => rgb[i2] * alpha + c * (1 - alpha),
        ) as RGB;
      }
    }

    const style = window.getComputedStyle(el);
    const own = parseColor(style.backgroundColor);
    const painted = own.rgb.map(
      (c, i) => c * own.alpha + backdrop[i] * (1 - own.alpha),
    ) as RGB;

    // SVG ink = computed fill; HTML ink = computed color.
    const inkSource = el instanceof SVGElement ? style.fill : style.color;
    const textColor = parseColor(inkSource);
    const opacity = parseFloat(style.opacity || "1");
    const ink = textColor.rgb.map(
      (c, i) => c * opacity + painted[i] * (1 - opacity),
    ) as RGB;

    return {
      text: ink,
      bg: painted,
      colorRaw: style.color,
      bgRaw: style.backgroundColor,
      ratio: (Math.max(
        relativeLuminance(ink),
        relativeLuminance(painted),
      ) +
        0.05) /
        (Math.min(relativeLuminance(ink), relativeLuminance(painted)) + 0.05),
      // Non-text elements separate against their backdrop (painted fill vs
      // the composited ancestor backdrop) — WCAG 1.4.11 non-text contrast.
      fillRatio: (Math.max(
        relativeLuminance(painted),
        relativeLuminance(backdrop),
      ) +
        0.05) /
        (Math.min(relativeLuminance(painted), relativeLuminance(backdrop)) +
          0.05),
    };

    function relativeLuminance([r, g, b]: RGB): number {
      const lin = [r, g, b].map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
    }
  });

async function expectRatio(
  locator: Locator,
  floor: number,
  label: string,
): Promise<number> {
  const m = await measureSelf(locator);
  console.log(
    `[chromatic-contrast] ${label}: ${fmt(m.text)} on ${fmt(m.bg)} (raw: ${m.colorRaw} / ${m.bgRaw}) -> ${m.ratio.toFixed(2)}:1`,
  );
  expect(
    m.ratio,
    `${label}: ${m.ratio.toFixed(2)}:1 < ${floor}:1 (${fmt(m.text)} on ${fmt(m.bg)})`,
  ).toBeGreaterThanOrEqual(floor);
  return m.ratio;
}

// Navigate with the story's own theme global so Storybook's theme decorator
// and the forced classes agree (the decorator sets data-theme on mount —
// forcing classes alone races against it).
const storyUrl = (id: string, theme: "light" | "dark") =>
  `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;

const BADGE_LABELS = [
  "Pulse Green",
  "Coral Red",
  "Signal Teal",
  "Iris Violet",
  "Lavender",
  "Acid Lime",
];

const TOAST_CASES: Array<[string, RegExp, string]> = [
  ["primitives-toast--success-toast", /Deployment Successful/, "toast success"],
  ["primitives-toast--warning-toast", /Storage Limit Reached/, "toast warning"],
  ["primitives-toast--destructive-toast", /Connection Error/, "toast destructive"],
  ["primitives-toast--info-toast", /Heads Up/, "toast info"],
];

test.describe("Chromatic surfaces — both-theme contrast floor", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`badge chromatic accents meet 4.5:1 (${theme})`, async ({ page }) => {
      await page.goto(storyUrl("primitives-badge--chromatic-accents", theme));
      await page.waitForLoadState("domcontentloaded");
      await forceTheme(page, theme);

      for (const label of BADGE_LABELS) {
        const badge = page.getByText(label, { exact: true }).first();
        await expect(badge).toBeVisible();
        await expectRatio(badge, 4.5, `badge "${label}" (${theme})`);
      }
    });

    test(`alert chromatic variants meet 4.5:1 (${theme})`, async ({ page }) => {
      const cases: Array<[string, string]> = [
        ["primitives-alert--success", "alert success"],
        ["primitives-alert--warning", "alert warning"],
        ["primitives-alert--destructive", "alert destructive"],
      ];
      for (const [storyId, label] of cases) {
        await page.goto(storyUrl(storyId, theme));
        await page.waitForLoadState("domcontentloaded");
        await forceTheme(page, theme);
        const alert = page.locator("[role='alert']").first();
        await expect(alert).toBeVisible();
        await expectRatio(
          alert.locator("p").first(), // AlertTitle (styled text, not a heading — heading-order a11y fix)
          4.5,
          `${label} title (${theme})`,
        );
        await expectRatio(
          alert.locator("div").last(), // AlertDescription (opacity 0.9)
          4.5,
          `${label} description (${theme})`,
        );
      }
    });

    test(`toast chromatic variants meet 4.5:1 (${theme})`, async ({ page }) => {
      for (const [storyId, titleText, label] of TOAST_CASES) {
        await page.goto(storyUrl(storyId, theme));
        await page.waitForLoadState("domcontentloaded");
        await forceTheme(page, theme);
        const toastRoot = page.locator("[role='status'], [role='alert']").first();
        await expect(toastRoot).toBeVisible();
        const title = toastRoot.getByText(titleText).first();
        await expect(title).toBeVisible();
        await expectRatio(title, 4.5, `${label} title (${theme})`);
      }
    });

    test(`rating filled star meets 3:1 (${theme})`, async ({ page }) => {
      await page.goto(storyUrl("primitives-rating--default", theme));
      await page.waitForLoadState("domcontentloaded");
      await forceTheme(page, theme);
      const star = page.locator("button[role='radio'] svg").first();
      await expect(star).toBeVisible();
      await expectRatio(star, 3, `rating filled star (${theme})`);
    });

    test(`progress warning indicator meets 3:1 (${theme})`, async ({ page }) => {
      await page.goto(storyUrl("primitives-progress--warning-variant", theme));
      await page.waitForLoadState("domcontentloaded");
      await forceTheme(page, theme);
      const indicator = page
        .locator("[role='progressbar'] [data-progressing]")
        .last();
      await expect(indicator).toBeVisible();
      const m = await measureSelf(indicator);
      console.log(
        `[chromatic-contrast] progress warning indicator (${theme}): fill ${fmt(m.bg)} vs backdrop -> ${m.fillRatio.toFixed(2)}:1`,
      );
      expect(
        m.fillRatio,
        `progress warning indicator fill vs track (${theme}): ${m.fillRatio.toFixed(2)}:1 < 3:1`,
      ).toBeGreaterThanOrEqual(3);
    });
  }

  test.describe("Theme gate: light theme on a dark-OS host", () => {
    test.use({ colorScheme: "dark" });

    test("alert success keeps its light palette when the OS prefers dark", async ({
      page,
    }) => {
      await page.goto(storyUrl("primitives-alert--success", "light"));
      await page.waitForLoadState("domcontentloaded");
      await forceTheme(page, "light");
      // Class-based gate: the light palette must win. Before the fix the
      // prefers-color-scheme media query leaks dark washes here.
      await expectRatio(
        page.locator("[role='alert'] p").first(),
        4.5,
        "alert success title (light theme, dark-OS host)",
      );
    });

    test("input keeps a visible field fill and legible value on a dark-OS host", async ({
      page,
    }) => {
      await page.goto(storyUrl("primitives-input--default", "light"));
      await page.waitForLoadState("domcontentloaded");
      await forceTheme(page, "light");
      const input = page.locator("input").first();
      await expect(input).toBeVisible();
      await input.fill("Light on dark OS");
      const m = await measureSelf(input);
      // The theme-blind white 2% fill composites to pure white on light
      // canvas; the field token paints a visible black 3% fill instead.
      expect(
        Math.min(m.bg[0], m.bg[1], m.bg[2]),
        `input fill ${m.bgRaw} composites to ${fmt(m.bg)} — must paint a visible fill in light theme`,
      ).toBeLessThan(250);
      console.log(
        `[chromatic-contrast] input value (light theme, dark-OS): ${fmt(m.text)} on ${fmt(m.bg)} -> ${m.ratio.toFixed(2)}:1`,
      );
      expect(
        m.ratio,
        `input typed value: ${m.ratio.toFixed(2)}:1 < 4.5:1`,
      ).toBeGreaterThanOrEqual(4.5);
    });
  });
});
