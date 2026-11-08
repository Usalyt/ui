// Palette contract tests — TDD layer for OpenSpec change
// refactor-sdd-tdd-full-coverage, tasks 10-11 (Batch 2).
//
// These tests read the actual source (theme.css tokens + component CVA
// class strings) and verify the DESIGN.md palette contract BY CALCULATION:
// every chromatic text pair must clear the WCAG AA floor (>= 4.5:1 body
// text, >= 3:1 non-text) in BOTH the light and dark themes.
//
// RED state (documented in .impeccable/critique 2026-09-24, Priority 2 & 4):
// - `dark:` compiles to prefers-color-scheme media queries because globals.css
//   never declares the class-based dark variant.
// - Badge chromatic text sits on 10% tints with raw-hue text: light theme
//   measures ~2.1:1 (signal-teal) to ~4.0:1 (iris-violet) vs the 4.5:1 floor.
// - alert/toast/progress/rating/copy-button still carry shadcn-era
//   emerald/amber/blue washes.
// - Input/textarea/card fills use theme-blind `bg-white/[0.02]`.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { badgeVariants } from "../components/badge/badge";
import { alertVariants } from "../components/alert/alert";
import { toastVariants } from "../components/toast/toast";
import { indicatorVariants } from "../components/progress/progress";
import { inputVariants } from "../components/input/input";
import { textareaVariants } from "../components/textarea/textarea";
import { cardVariants } from "../components/card/card";
import {
  blend,
  contrastRatio,
  formatRgb,
  hexToRgb,
  mixOklab,
  relativeLuminance,
  type RGB,
} from "./contrast";

const here = path.dirname(fileURLToPath(import.meta.url));
const themeCss = readFileSync(
  path.resolve(here, "../../styles/theme.css"),
  "utf8",
);

const COMPONENT_DIR = path.resolve(here, "../components");

function readComponent(relativePath: string): string {
  return readFileSync(path.resolve(COMPONENT_DIR, relativePath), "utf8");
}

// ---------------------------------------------------------------------------
// Minimal theme.css token parser.
// ---------------------------------------------------------------------------

type VarMap = Record<string, string>; // token name (without --) -> raw value

const LIGHT_SELECTOR = 'html[data-theme="light"]:not(.dark)';

function lightBlockSource(css: string): string {
  const at = css.indexOf(LIGHT_SELECTOR);
  if (at === -1) return "";
  const start = css.indexOf("{", at);
  const end = css.indexOf("}", start);
  return css.slice(start + 1, end);
}

function collectVars(css: string): VarMap {
  const vars: VarMap = {};
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    // First declaration wins per scope: when fed the whole file, @theme /
    // :root / .dark values are captured (dark defaults); when fed only the
    // light block, its overrides are captured.
    if (!(m[1] in vars)) vars[m[1]] = m[2].trim();
  }
  return vars;
}

const darkVars = collectVars(themeCss);
const lightVars = collectVars(lightBlockSource(themeCss));

/** Resolve a token value to a concrete sRGB triple for the given theme. */
function resolveToken(name: string, theme: "light" | "dark"): RGB {
  const key = name.startsWith("color-") ? name : `color-${name}`;
  const scoped = theme === "light" ? lightVars : darkVars;
  const value = scoped[key] ?? darkVars[key];
  if (!value) throw new Error(`Token --${key} not found in theme.css`);

  const hex = value.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hex) return hexToRgb(value);

  const varRef = value.match(/^var\(--([a-z0-9-]+)\)$/);
  if (varRef) return resolveToken(varRef[1], theme);

  const colorMix = value.match(
    /^color-mix\(in oklab,\s*var\(--([a-z0-9-]+)\)\s+([\d.]+)%,\s*var\(--([a-z0-9-]+)\)\)$/,
  );
  if (colorMix) {
    const a = resolveToken(colorMix[1], theme);
    const b = resolveToken(colorMix[3], theme);
    return mixOklab(a, b, parseFloat(colorMix[2]));
  }

  const rgb = value.match(/^rgba?\(.+\)$/);
  if (rgb) {
    const nums = value
      .replace(/^rgba?\(/, "")
      .replace(/\)$/, "")
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map((n) => parseFloat(n));
    return [nums[0], nums[1] ?? 0, nums[2] ?? 0] as RGB;
  }

  throw new Error(`Unsupported token value for --${key}: "${value}"`);
}

/** Alpha baked into a token declared like `rgb(255 255 255 / 0.02)`. */
function tokenAlpha(name: string, theme: "light" | "dark"): number {
  const key = name.startsWith("color-") ? name : `color-${name}`;
  const scoped = theme === "light" ? lightVars : darkVars;
  const value = scoped[key] ?? darkVars[key] ?? "";
  const m = value.match(/\/\s*([\d.]+)\s*\)?$/);
  return m ? parseFloat(m[1]) : 1;
}

function classList(variants: string): string[] {
  return variants.split(/\s+/).filter(Boolean);
}

/**
 * Resolve the text/ink token a chromatic variant declares. GREEN contract:
 * an explicit `text-<hue>-foreground` pair. Legacy `text-<hue>` (raw hue as
 * text) is accepted as a fallback so the numeric test can RED with real
 * measured ratios instead of an unresolvable token.
 */
function resolveInkToken(classes: string[], hue: string): string {
  const explicit = classes.find((c) => c === `text-${hue}-foreground`);
  if (explicit) return `${hue}-foreground`;
  const legacy = classes.find((c) => c === `text-${hue}`);
  if (legacy) return hue;
  throw new Error(
    `No text pair found for hue "${hue}" in classes: ${classes.join(" ")}`,
  );
}

/** Extract `bg-<token>/<alpha>` tint from a CVA class string. */
function resolveBgTint(classes: string[]): { token: string; alpha: number } {
  const bg = classes.find((c) => /^bg-[a-z0-9-]+\/\d+$/.test(c));
  if (!bg) {
    throw new Error(
      `No tinted surface (bg-<token>/<alpha>) in classes: ${classes.join(" ")}`,
    );
  }
  const [, token, alpha] = bg.match(/^bg-([a-z0-9-]+)\/(\d+)$/)!;
  return { token, alpha: parseInt(alpha, 10) / 100 };
}

// Surfaces each theme can present behind a component (canvas extremes).
const themeCanvases: Record<"light" | "dark", () => RGB[]> = {
  light: () => [
    resolveToken("background", "light"),
    resolveToken("secondary", "light"),
    resolveToken("accent", "light"),
  ],
  dark: () => [
    resolveToken("void", "dark"),
    resolveToken("carbon", "dark"),
    resolveToken("obsidian", "dark"),
  ],
};

const BODY_FLOOR = 4.5; // text-xs (12px) badge/alert/toast copy
const NON_TEXT_FLOOR = 3.0; // icons, indicators, star fills

type BadgeChromatic =
  | "pulse-green"
  | "coral-red"
  | "signal-teal"
  | "iris-violet"
  | "lavender";

const BADGE_CHROMATIC_VARIANTS: BadgeChromatic[] = [
  "pulse-green",
  "coral-red",
  "signal-teal",
  "iris-violet",
  "lavender",
];

// Stock Tailwind palette hues that must not survive the DESIGN.md migration.
const STOCK_HUE_CLASSES =
  /\b(?:text|bg|border|fill|ring|stroke)-(?:(?:emerald|amber|blue|red|orange|yellow|lime|sky|cyan|teal|violet|purple|fuchsia|pink|rose|indigo|slate|gray|zinc|stone|neutral)-\d{2,3}\b)/;

// Utilities that are NOT declared in @theme, so they compile to stock
// Tailwind defaults instead of the DESIGN.md shadow stack.
const DEFAULT_SHADOW_LEAK = /\bshadow-(?:2xs|xs|lg|2xl)\b/;

function contrastAgainst(
  fg: RGB,
  hueToken: string,
  tintAlpha: number,
  theme: "light" | "dark",
): Array<{ canvas: RGB; bg: RGB; ratio: number }> {
  const hueColor = resolveToken(hueToken, theme);
  return themeCanvases[theme]().map((canvas) => {
    const bg = blend({ rgb: hueColor, alpha: tintAlpha }, canvas);
    return { canvas, bg, ratio: contrastRatio(fg, bg) };
  });
}

describe("Theme gate (task 10)", () => {
  it("theme.css gates the dark: variant to the .dark class strategy", () => {
    expect(
      themeCss.includes("@custom-variant dark (&:where(.dark, .dark *));"),
    ).toBe(true);
  });
});

describe("Badge chromatic contrast (Both-Theme Contrast Floor)", () => {
  it("pairs every chromatic tint with an explicit theme-calibrated -foreground", () => {
    for (const variant of BADGE_CHROMATIC_VARIANTS) {
      const classes = classList(badgeVariants({ variant }) as string);
      expect(
        classes.some((c) => c === `text-${variant}-foreground`),
        `badge variant "${variant}" must declare an explicit text-${variant}-foreground pair (packages/ui/src/components/badge/badge.tsx)`,
      ).toBe(true);
    }
  });

  it("meets >= 4.5:1 on its tinted surface in BOTH themes, computed from tokens", () => {
    const report: string[] = [];
    for (const variant of BADGE_CHROMATIC_VARIANTS) {
      const classes = classList(badgeVariants({ variant }) as string);
      const inkToken = resolveInkToken(classes, variant);
      const { token: tintToken, alpha: tintAlpha } = resolveBgTint(classes);
      for (const theme of ["light", "dark"] as const) {
        const ink = resolveToken(inkToken, theme);
        for (const { bg, ratio } of contrastAgainst(
          ink,
          tintToken,
          tintAlpha,
          theme,
        )) {
          const line = `badge ${variant} [${theme}] ${formatRgb(ink)} on ${formatRgb(bg)} -> ${ratio.toFixed(2)}:1`;
          report.push(line);
          console.log(`[palette-contract] ${line}`);
          expect(
            ratio,
            `badge variant "${variant}" in ${theme} theme: ${formatRgb(ink)} on ${formatRgb(bg)} = ${ratio.toFixed(2)}:1 < ${BODY_FLOOR}:1 (ink token: --${inkToken})`,
          ).toBeGreaterThanOrEqual(BODY_FLOOR);
        }
      }
    }
    console.log(`[palette-contract] badge ratios:\n${report.join("\n")}`);
  });

  it("keeps the acid-lime and destructive solid fills on-contrast in both themes", () => {
    const lime = classList(badgeVariants({ variant: "acid-lime" }) as string);
    expect(lime).toContain("bg-acid-lime");
    expect(lime).toContain("text-void");
    const destructive = classList(
      badgeVariants({ variant: "destructive" }) as string,
    );
    expect(destructive).toContain("bg-destructive");
    expect(destructive).toContain("text-destructive-foreground");
    for (const theme of ["light", "dark"] as const) {
      const onLime = contrastRatio(
        resolveToken("void", theme),
        resolveToken("acid-lime", theme),
      );
      const onCoral = contrastRatio(
        resolveToken("destructive-foreground", theme),
        resolveToken("destructive", theme),
      );
      expect(onLime).toBeGreaterThanOrEqual(BODY_FLOOR);
      expect(onCoral).toBeGreaterThanOrEqual(BODY_FLOOR);
    }
  });

  it("keeps the destructive hover fill on-contrast in BOTH themes (owner measured 4.0:1)", () => {
    const destructive = classList(
      badgeVariants({ variant: "destructive" }) as string,
    );
    // The hover fill is declared as `hover:bg-<token>/<alpha>`; resolve it
    // from the CVA string instead of hardcoding so the contract tracks the
    // component.
    const hoverClass = destructive.find((c) => /^hover:bg-[a-z0-9-]+\/\d+$/.test(c));
    expect(
      hoverClass,
      `badge destructive must declare a hover:bg-<token>/<alpha> treatment (${destructive.join(" ")})`,
    ).toBeTruthy();
    const [, hoverToken, hoverAlphaRaw] = hoverClass!.match(
      /^hover:bg-([a-z0-9-]+)\/(\d+)$/,
    )!;
    const hoverAlpha = Number(hoverAlphaRaw) / 100;
    expect(hoverToken).toBe("destructive");

    // Compute the hover background exactly as the browser would: the token
    // blended at its alpha over each theme canvas, checked against the
    // destructive ink in both themes.
    for (const theme of ["light", "dark"] as const) {
      const ink = resolveToken("destructive-foreground", theme);
      for (const canvas of themeCanvases[theme]()) {
        const bg = blend(
          { rgb: resolveToken(hoverToken, theme), alpha: hoverAlpha },
          canvas,
        );
        const ratio = contrastRatio(ink, bg);
        console.log(
          `[palette-contract] badge destructive hover:${hoverToken}/${hoverAlphaRaw}% [${theme}] ink ${formatRgb(ink)} on ${formatRgb(bg)} -> ${ratio.toFixed(2)}:1`,
        );
        expect(
          ratio,
          `badge destructive hover (${hoverClass}) in ${theme} theme: ${formatRgb(ink)} on ${formatRgb(bg)} = ${ratio.toFixed(2)}:1 < ${BODY_FLOOR}:1`,
        ).toBeGreaterThanOrEqual(BODY_FLOOR);
      }
    }
  });
});

describe("Alert / Toast semantic palettes (task 11)", () => {
  const cases: Array<{
    file: string;
    name: string;
    get: (variant: string) => string;
    variants: Array<[string, string]>;
  }> = [
    {
      file: "alert/alert.tsx",
      name: "alert",
      get: (v) =>
        alertVariants({
          variant: v as "default" | "destructive" | "success" | "warning",
        }) as string,
      variants: [
        ["success", "pulse-green"],
        ["warning", "signal-teal"],
        ["destructive", "coral-red"],
      ],
    },
    {
      file: "toast/toast.tsx",
      name: "toast",
      get: (v) =>
        toastVariants({
          variant: v as "default" | "destructive" | "success" | "warning" | "info",
        }) as string,
      variants: [
        ["success", "pulse-green"],
        ["warning", "signal-teal"],
        ["destructive", "coral-red"],
        ["info", "iris-violet"],
      ],
    },
  ];

  for (const { file, name, get, variants } of cases) {
    it(`${name} variants map to DESIGN.md chromatics with explicit -foreground pairs`, () => {
      for (const [variant] of variants) {
        const classes = classList(get(variant));
        expect(
          classes.some((c) => /^text-[a-z0-9-]+-foreground$/.test(c)),
          `${name} variant "${variant}" must declare an explicit -foreground pair (${file})`,
        ).toBe(true);
        expect(
          classes.some((c) => /^bg-[a-z0-9-]+\/\d+$/.test(c)),
          `${name} variant "${variant}" must declare a tinted surface (${file})`,
        ).toBe(true);
      }
    });

    it(`${name} variants meet >= 4.5:1 in BOTH themes (computed)`, () => {
      const report: string[] = [];
      for (const [variant] of variants) {
        const classes = classList(get(variant));
        const inkToken = classes
          .find((c) => /^text-[a-z0-9-]+-foreground$/.test(c))!
          .replace(/^text-/, "");
        const { token: tintToken, alpha: tintAlpha } = resolveBgTint(classes);
        for (const theme of ["light", "dark"] as const) {
          const ink = resolveToken(inkToken, theme);
          for (const { bg, ratio } of contrastAgainst(
            ink,
            tintToken,
            tintAlpha,
            theme,
          )) {
            const softened = contrastRatio(
              blend({ rgb: ink, alpha: 0.9 }, bg),
              bg,
            );
            const line = `${name} ${variant} [${theme}] ${formatRgb(ink)} on ${formatRgb(bg)} -> ${ratio.toFixed(2)}:1 (description @90%: ${softened.toFixed(2)}:1)`;
            report.push(line);
            console.log(`[palette-contract] ${line}`);
            expect(
              ratio,
              `${name} "${variant}" ${theme} theme: ${ratio.toFixed(2)}:1 < ${BODY_FLOOR}:1 (${file})`,
            ).toBeGreaterThanOrEqual(BODY_FLOOR);
            expect(
              softened,
              `${name} "${variant}" ${theme} theme description (90% opacity): ${softened.toFixed(2)}:1 < ${BODY_FLOOR}:1`,
            ).toBeGreaterThanOrEqual(BODY_FLOOR);
          }
        }
      }
      console.log(`[palette-contract] ${name} ratios:\n${report.join("\n")}`);
    });
  }

  it("no component ships stock Tailwind palette washes anymore", () => {
    const files = [
      "alert/alert.tsx",
      "toast/toast.tsx",
      "progress/progress.tsx",
      "rating/rating.tsx",
      "copy-button/copy-button.tsx",
    ];
    for (const file of files) {
      const source = readComponent(file);
      const hit = source.match(STOCK_HUE_CLASSES);
      expect(
        hit,
        `${file} still carries a stock Tailwind palette class ("${hit?.[0]}") — use DESIGN.md chromatic tokens`,
      ).toBeNull();
    }
  });
});

describe("Progress / Rating / CopyButton chromatic ink (task 11)", () => {
  it("progress indicators hold >= 3:1 against their track in both themes", () => {
    const mapping: Array<[string, string]> = [
      ["success", "pulse-green-foreground"],
      ["warning", "signal-teal-foreground"],
      ["destructive", "destructive"],
    ];
    for (const [variant, token] of mapping) {
      const classes = classList(
        indicatorVariants({
          variant: variant as "default" | "success" | "warning" | "destructive",
        }) as string,
      );
      expect(classes, `progress ${variant} indicator must use bg-${token}`).toContain(
        `bg-${token}`,
      );
    }
    for (const theme of ["light", "dark"] as const) {
      const track = resolveToken("secondary", theme);
      for (const [, token] of mapping) {
        const ink = resolveToken(token, theme);
        const ratio = contrastRatio(ink, track);
        console.log(
          `[palette-contract] progress ${token} [${theme}] on ${formatRgb(track)} -> ${ratio.toFixed(2)}:1`,
        );
        expect(
          ratio,
          `progress indicator ${token} on ${theme} track ${formatRgb(track)}: ${ratio.toFixed(2)}:1 < ${NON_TEXT_FLOOR}:1`,
        ).toBeGreaterThanOrEqual(NON_TEXT_FLOOR);
      }
    }
  });

  it("rating filled stars hold >= 3:1 in both themes", () => {
    const source = readComponent("rating/rating.tsx");
    expect(source).toContain("fill-pulse-green-foreground");
    expect(source).not.toMatch(STOCK_HUE_CLASSES);
  });

  it("copy-button confirmation ink holds >= 3:1 in both themes", () => {
    const source = readComponent("copy-button/copy-button.tsx");
    expect(source).toContain("text-pulse-green-foreground");
    expect(source).not.toMatch(STOCK_HUE_CLASSES);
  });
});

describe("Field fills (task 11)", () => {
  it("theme.css declares --color-field with a light-theme override", () => {
    expect(
      darkVars["color-field"],
      "--color-field must exist in @theme",
    ).toBeTruthy();
    expect(
      lightVars["color-field"],
      "--color-field must be overridden in the light theme block",
    ).toBeTruthy();
    expect(tokenAlpha("color-field", "dark")).toBeCloseTo(0.02, 5);
    expect(tokenAlpha("color-field", "light")).toBeGreaterThan(0);
    expect(tokenAlpha("color-field", "light")).toBeLessThan(0.06);
  });

  it("input/textarea/card-subtle fill from the semantic token, not theme-blind white", () => {
    const inputs = classList(inputVariants({}) as string);
    const textareas = classList(textareaVariants({}) as string);
    const subtleCard = classList(cardVariants({ variant: "subtle" }) as string);
    for (const [name, classes] of [
      ["input", inputs],
      ["textarea", textareas],
      ["card subtle", subtleCard],
    ] as const) {
      expect(classes, `${name} must use bg-field`).toContain("bg-field");
      expect(
        classes.some((c) => c.startsWith("bg-white/")),
        `${name} must not use theme-blind bg-white fills`,
      ).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// Light-theme overlay elevation (task 14): the dark 60%-alpha --shadow-xl
// halo reads as a black smear around popovers on the light canvas. The light
// block must soften it; the dark default must stay untouched.
// ---------------------------------------------------------------------------

describe("Light-theme overlay shadow (task 14)", () => {
  it("overrides --shadow-xl with a softened stack in the light theme block", () => {
    expect(
      darkVars["shadow-xl"],
      "--shadow-xl must stay declared in @theme with the dark default",
    ).toBeTruthy();
    const light = lightVars["shadow-xl"];
    expect(
      light,
      '--shadow-xl must be overridden in the light theme block (html[data-theme="light"]:not(.dark))',
    ).toBeTruthy();
    expect(light).not.toBe(darkVars["shadow-xl"]);

    const alphas = [
      ...light.matchAll(
        /rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/g,
      ),
    ].map((m) => Number(m[1]));
    expect(
      alphas.length,
      "--shadow-xl light override must declare explicit alpha stops",
    ).toBeGreaterThan(0);
    expect(
      Math.max(...alphas),
      `light --shadow-xl alphas (${alphas.join(", ")}) must stay under 0.25 so overlays do not render a black halo`,
    ).toBeLessThan(0.25);
  });
});

describe("Default-shadow sweep (task 11)", () => {
  it("no component source relies on default Tailwind shadow utilities", () => {
    const files = [
      "alert/alert.tsx",
      "input/input.tsx",
      "textarea/textarea.tsx",
      "card/card.tsx",
      "timeline/timeline.tsx",
      "resizable/resizable.tsx",
      "file-input/file-input.tsx",
      "select/select.tsx",
      "menubar/menubar.tsx",
      "kbd/kbd.tsx",
      "calendar/calendar.tsx",
      "button/button.tsx",
      "number-field/number-field.tsx",
      "radio-group/radio-group.tsx",
      "switch/switch.tsx",
      "chart/chart.tsx",
      "data-table/data-table.tsx",
      "sheet/sheet.tsx",
      "drawer/drawer.tsx",
      "tooltip/tooltip.tsx",
      "popover/popover.tsx",
      "hover-card/hover-card.tsx",
      "context-menu/context-menu.tsx",
      "dropdown-menu/dropdown-menu.tsx",
      "navigation-menu/navigation-menu.tsx",
      "combobox/combobox.tsx",
      "sonner/sonner.tsx",
      "sidebar/sidebar.tsx",
    ];
    for (const file of files) {
      const source = readComponent(file);
      const hit = source.match(DEFAULT_SHADOW_LEAK);
      expect(
        hit,
        `${file} uses a default-Tailwind shadow ("${hit?.[0]}") that stands in for the DESIGN.md elevation system`,
      ).toBeNull();
    }
  });

  it("floating overlays keep a real authored elevation shadow", () => {
    for (const file of [
      "popover/popover.tsx",
      "dialog/dialog.tsx",
      "tooltip/tooltip.tsx",
      "context-menu/context-menu.tsx",
    ]) {
      expect(
        readComponent(file),
        `${file} must keep a real elevation shadow (shadow-xl) for its floating surface`,
      ).toMatch(/shadow-xl/);
    }
  });
});

// Guard the helpers themselves so the math can't silently rot.
describe("contrast helper sanity", () => {
  it("reproduces known reference ratios", () => {
    expect(contrastRatio(hexToRgb("#000000"), hexToRgb("#ffffff"))).toBeCloseTo(21, 1);
    expect(contrastRatio(hexToRgb("#ffffff"), hexToRgb("#08090a"))).toBeGreaterThan(18);
    expect(relativeLuminance(hexToRgb("#ffffff"))).toBeCloseTo(1, 5);
    // mixOklab at 100%/0% weight returns the endpoints.
    expect(mixOklab(hexToRgb("#27a644"), hexToRgb("#08090a"), 100)).toEqual([
      0x27, 0xa6, 0x44,
    ]);
    expect(mixOklab(hexToRgb("#27a644"), hexToRgb("#08090a"), 0)).toEqual([
      0x08, 0x09, 0x0a,
    ]);
  });
});

// ---------------------------------------------------------------------------
// Block-level chromatic ink (batch 4 triage — surfaced by the e2e axe audit
// of blocks-evaluationsummaryreport--default: raw-hue stat labels measured
// 3.29:1 in light theme, below the 4.5:1 body floor).
// ---------------------------------------------------------------------------

const BLOCK_DIR = path.resolve(here, "../blocks");

function readBlock(relativePath: string): string {
  return readFileSync(path.resolve(BLOCK_DIR, relativePath), "utf8");
}

/** Raw hue used directly as ink (`text-<hue>` without a -foreground pair). */
const RAW_HUE_INK =
  /(?<![\w-])text-(?:destructive|coral-red|pulse-green|signal-teal|iris-violet|lavender|acid-lime)(?!-foreground)/g;

describe("Block-level chromatic ink (Both-Theme Contrast Floor)", () => {
  it("blocks never use a raw hue as text ink; they use the theme-calibrated -foreground pairs", () => {
    for (const file of [
      "evaluation-summary-report/evaluation-summary-report.tsx",
      "project-kanban-board/project-kanban-board.tsx",
      "dashboard-header/dashboard-header.tsx",
    ]) {
      const source = readBlock(file);
      const lineOf = (index: number) => source.slice(0, index).split("\n").length;
      RAW_HUE_INK.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = RAW_HUE_INK.exec(source))) {
        expect(
          m[0],
          `${file}:${lineOf(m.index)} uses raw hue ink "${m[0]}" — use the theme-calibrated text-<hue>-foreground pair`,
        ).toBeNull();
      }
    }
  });

  it("summary-report stat labels hold >= 4.5:1 on their tinted cards in BOTH themes", () => {
    const statCards: Array<[string, string, number]> = [
      // [surface hue token, foreground ink token, tint alpha]
      ["coral-red", "coral-red-foreground", 0.05],
      ["signal-teal", "signal-teal-foreground", 0.05],
      ["pulse-green", "pulse-green-foreground", 0.05],
    ];
    for (const theme of ["light", "dark"] as const) {
      for (const [hue, inkToken, alpha] of statCards) {
        const ink = resolveToken(inkToken, theme);
        for (const { bg, ratio } of contrastAgainst(ink, hue, alpha, theme)) {
          console.log(
            `[palette-contract] block stat ${inkToken} [${theme}] on ${formatRgb(bg)} -> ${ratio.toFixed(2)}:1`,
          );
          expect(
            ratio,
            `evaluation-summary-report stat label --${inkToken} in ${theme} theme: ${ratio.toFixed(2)}:1 < ${BODY_FLOOR}:1 (packages/ui/src/blocks/evaluation-summary-report/evaluation-summary-report.tsx)`,
          ).toBeGreaterThanOrEqual(BODY_FLOOR);
        }
      }
    }
  });

  it("kanban column icons hold >= 3:1 (non-text) against their card surface in BOTH themes", () => {
    const icons = ["signal-teal-foreground", "iris-violet-foreground", "pulse-green-foreground"];
    for (const theme of ["light", "dark"] as const) {
      const card = resolveToken("card", theme);
      for (const inkToken of icons) {
        const ink = resolveToken(inkToken, theme);
        const ratio = contrastRatio(ink, card);
        console.log(
          `[palette-contract] block kanban icon ${inkToken} [${theme}] on card ${formatRgb(card)} -> ${ratio.toFixed(2)}:1`,
        );
        expect(
          ratio,
          `project-kanban-board icon --${inkToken} in ${theme} theme: ${ratio.toFixed(2)}:1 < ${NON_TEXT_FLOOR}:1 (packages/ui/src/blocks/project-kanban-board/project-kanban-board.tsx)`,
        ).toBeGreaterThanOrEqual(NON_TEXT_FLOOR);
      }
    }
  });
});
