// Deterministic WCAG 2 contrast math for the palette contract tests.
// Mirrors the CSS painting model: alpha compositing happens in gamma-encoded
// sRGB, and `color-mix(in oklab, A p%, B)` interpolates linearly in Oklab.
// Numbers produced here are what the browser computes, not approximations.

export type RGB = [number, number, number];

/** Parse `#rgb`/`#rrggbb` into gamma-encoded sRGB 0-255 triple. */
export function hexToRgb(hex: string): RGB {
  const h = hex.trim().replace(/^#/, "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  if (full.length !== 6) throw new Error(`Unsupported hex color: "${hex}"`);
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Parse `rgb(r g b / a)` or `rgb(r, g, b)` into an sRGB triple + alpha. */
export function parseRgbString(value: string): { rgb: RGB; alpha: number } {
  const nums = value
    .replace(/^rgba?\(/, "")
    .replace(/\)$/, "")
    .split(/[\s,\/]+/)
    .filter(Boolean)
    .map((n) => parseFloat(n));
  if (nums.length < 3) throw new Error(`Unsupported rgb string: "${value}"`);
  return {
    rgb: [nums[0], nums[1] ?? 0, nums[2] ?? 0] as RGB,
    alpha: nums[3] === undefined ? 1 : nums[3],
  };
}

/** WCAG 2 relative luminance (uses the 0.03928 threshold as specced). */
export function relativeLuminance([r, g, b]: RGB): number {
  const lin = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function contrastRatio(fg: RGB, bg: RGB): number {
  const lf = relativeLuminance(fg);
  const lb = relativeLuminance(bg);
  const hi = Math.max(lf, lb);
  const lo = Math.min(lf, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Alpha-composite a source over a backdrop in gamma-encoded sRGB — the same
 * simple alpha blend CSS performs when painting a translucent background.
 */
export function compositeOver(fg: RGB, alpha: number, bg: RGB): RGB {
  return [0, 1, 2].map((i) => fg[i] * alpha + bg[i] * (1 - alpha)) as RGB;
}

/** Blend a (possibly translucent) foreground color over a backdrop. */
export function blend(fg: { rgb: RGB; alpha: number }, bg: RGB): RGB {
  return compositeOver(fg.rgb, fg.alpha, bg);
}

// sRGB transfer functions (CSS Color 4): gamma-encode linear, decode gamma.
const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const toGamma = (c: number) =>
  c <= 0 ? 0 : c >= 1 ? 255 : Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055));

// Oklab matrices — CSS Color 4 reference implementation.
function linearRgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToLinearRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/**
 * Mirror of CSS `color-mix(in oklab, A p%, B)` for opaque colors:
 * Oklab components interpolate linearly between A and B.
 */
export function mixOklab(a: RGB, b: RGB, weightA: number): RGB {
  const w = weightA / 100;
  const [la, aa, ba] = linearRgbToOklab(
    toLinear(a[0] / 255),
    toLinear(a[1] / 255),
    toLinear(a[2] / 255),
  );
  const [lb, ab, bb] = linearRgbToOklab(
    toLinear(b[0] / 255),
    toLinear(b[1] / 255),
    toLinear(b[2] / 255),
  );
  const [L, aComp, bComp] = [
    lb + (la - lb) * w,
    ab + (aa - ab) * w,
    bb + (ba - bb) * w,
  ];
  const lin = oklabToLinearRgb(L, aComp, bComp);
  return [
    toGamma(clamp01(lin[0])),
    toGamma(clamp01(lin[1])),
    toGamma(clamp01(lin[2])),
  ];
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function formatRgb(rgb: RGB): string {
  return `rgb(${rgb.map((v) => Math.round(v)).join(", ")})`;
}
