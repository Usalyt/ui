// Type contract tests — TDD layer for OpenSpec change
// refactor-sdd-tdd-full-coverage, task 12 (Batch 3).
//
// These tests read the actual source (theme.css + package.json) and pin the
// DESIGN.md "Tokens — Typography" contract:
//   - every type-scale token declared with its size / line-height /
//     letter-spacing values,
//   - the 300 / 400 / 510 / 590 weight vocabulary as aliases,
//   - a REAL loading mechanism for Inter Variable (fontsource import +
//     dependency), so consumers never silently receive system fallbacks,
//   - the Berkeley Mono substitution contract (local() first, JetBrains Mono
//     then ui-monospace, never bundled) documented in a CSS comment,
//   - the OpenType feature signature (cv01 / ss03 / zero) applied to the sans
//     stack.
//
// RED state (documented in the 2026-09-24 critique, Priority Issue 5):
// `--text-caption` / `--text-body-sm` etc. do not exist, "Inter Variable" is
// referenced by name only with no loader, and Berkeley Mono has no declared
// source at all.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const themeCss = readFileSync(
  path.resolve(here, "../../styles/theme.css"),
  "utf8",
);
const globalsCss = readFileSync(
  path.resolve(here, "../../styles/globals.css"),
  "utf8",
);
const packageJson = readFileSync(
  path.resolve(here, "../../package.json"),
  "utf8",
);

// ---------------------------------------------------------------------------
// Minimal theme.css token parser (same contract as palette-contract).
// ---------------------------------------------------------------------------

type VarMap = Record<string, string>; // token name (without --) -> raw value

function collectVars(css: string): VarMap {
  const vars: VarMap = {};
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    if (!(m[1] in vars)) vars[m[1]] = m[2].trim();
  }
  return vars;
}

/** Resolve a token value through at most one `var(--x)` indirection. */
function resolveValue(vars: VarMap, name: string): string {
  const raw = vars[name];
  if (raw === undefined) {
    throw new Error(`Token --${name} not found in theme.css`);
  }
  const ref = raw.match(/^var\(--([a-z0-9-]+)\)$/);
  return ref ? vars[ref[1]] ?? "" : raw;
}

const vars = collectVars(themeCss);

// ---------------------------------------------------------------------------
// (a) Type scale — every DESIGN.md token declared with exact metrics.
// Values come from DESIGN.md "Type Scale" and "Type Scale Detail"
// (micro/label leadings; caption has no tracking by contract).
// ---------------------------------------------------------------------------

const TYPE_SCALE: Record<
  string,
  { size: string; lineHeight: string; letterSpacing: string | null }
> = {
  micro: { size: "10px", lineHeight: "1.5", letterSpacing: null },
  label: { size: "12px", lineHeight: "1.4", letterSpacing: null },
  caption: { size: "13px", lineHeight: "1.2", letterSpacing: null },
  "body-sm": { size: "15px", lineHeight: "1.6", letterSpacing: "-0.165px" },
  "body-lg": { size: "20px", lineHeight: "1.33", letterSpacing: "-0.24px" },
  subheading: { size: "24px", lineHeight: "1.33", letterSpacing: "-0.288px" },
  "heading-sm": { size: "32px", lineHeight: "1.13", letterSpacing: "-0.704px" },
  heading: { size: "48px", lineHeight: "1", letterSpacing: "-1.056px" },
  "heading-lg": { size: "64px", lineHeight: "1", letterSpacing: "-1.408px" },
  display: { size: "72px", lineHeight: "1", letterSpacing: "-1.584px" },
};

describe("Type scale tokens (task 12)", () => {
  it("declares every DESIGN.md type-scale token with its exact size", () => {
    for (const [name, spec] of Object.entries(TYPE_SCALE)) {
      expect(
        vars[`text-${name}`],
        `--text-${name} must be declared in packages/ui/styles/theme.css @theme`,
      ).toBe(spec.size);
    }
  });

  it("declares per-size line-height (sub-key) and the granular --leading-* token with the same value", () => {
    for (const [name, spec] of Object.entries(TYPE_SCALE)) {
      const subKey = resolveValue(vars, `text-${name}--line-height`);
      expect(
        subKey,
        `--text-${name}--line-height must exist and resolve to ${spec.lineHeight}`,
      ).toBe(spec.lineHeight);
      expect(
        vars[`leading-${name}`],
        `--leading-${name} must exist for the granular leading utility`,
      ).toBe(spec.lineHeight);
    }
  });

  it("declares optical letter-spacing per size (and none for micro/label/caption)", () => {
    for (const [name, spec] of Object.entries(TYPE_SCALE)) {
      if (spec.letterSpacing === null) {
        expect(
          vars[`text-${name}--letter-spacing`],
          `--text-${name}--letter-spacing must NOT exist: ${name} ships default tracking per DESIGN.md`,
        ).toBeUndefined();
        continue;
      }
      expect(
        resolveValue(vars, `text-${name}--letter-spacing`),
        `--text-${name}--letter-spacing must resolve to ${spec.letterSpacing}`,
      ).toBe(spec.letterSpacing);
      expect(
        vars[`tracking-${name}`],
        `--tracking-${name} must exist for the granular tracking utility`,
      ).toBe(spec.letterSpacing);
    }
  });
});

// ---------------------------------------------------------------------------
// (b) Weight aliases — the Linear precision vocabulary (300 / 400 / 510 / 590).
// ---------------------------------------------------------------------------

describe("Font weight aliases (task 12)", () => {
  it("declares light / regular / w510 / w590 aliases", () => {
    expect(vars["font-weight-light"]).toBe("300");
    expect(vars["font-weight-regular"]).toBe("400");
    expect(vars["font-weight-w510"]).toBe("510");
    expect(vars["font-weight-w590"]).toBe("590");
  });
});

// ---------------------------------------------------------------------------
// (c) Font loading — Inter Variable must have a REAL loading mechanism.
// A bare `"Inter Variable"` name with no @font-face source silently falls
// back to system-ui (the critique's Priority Issue 5). The contract is: the
// @fontsource-variable/inter CSS is imported in globals.css AND shipped as a
// runtime dependency, so any consumer importing @usalyt/ui/styles.css resolves the
// actual variable font.
// ---------------------------------------------------------------------------

describe("Inter Variable loading (task 12)", () => {
  it("imports the @fontsource-variable/inter CSS in globals.css", () => {
    expect(
      /@import\s+"@fontsource-variable\/inter"/.test(globalsCss),
      'globals.css must import "@fontsource-variable/inter" so "Inter Variable" resolves for consumers',
    ).toBe(true);
  });

  it("ships @fontsource-variable/inter as a runtime dependency", () => {
    const pkg = JSON.parse(packageJson) as { dependencies?: Record<string, string> };
    expect(
      pkg.dependencies?.["@fontsource-variable/inter"],
      "@fontsource-variable/inter must be a dependency of @usalyt/ui (not dev-only) so the import resolves in consumer apps",
    ).toBeTruthy();
  });

  it("references the Inter Variable family in the sans stacks", () => {
    for (const stack of ["font-sans", "font-inter-variable"]) {
      expect(
        vars[stack],
        `--${stack} must keep "Inter Variable" as its first family`,
      ).toMatch(/^"Inter Variable"/);
    }
  });
});

// ---------------------------------------------------------------------------
// (d) Berkeley Mono substitution contract — commercial face, never bundled.
// ---------------------------------------------------------------------------

function berkeleyMonoFontFace(css: string): string {
  const at = css.indexOf('@font-face');
  expect(at, 'theme.css must declare an @font-face for Berkeley Mono').toBeGreaterThanOrEqual(0);
  const start = css.indexOf("{", at);
  const end = css.indexOf("}", start);
  return css.slice(start + 1, end);
}

describe("Berkeley Mono substitution contract (task 12)", () => {
  it("declares Berkeley Mono with local() as the first source and never bundles a file", () => {
    const face = berkeleyMonoFontFace(themeCss);
    expect(face).toContain('font-family: "Berkeley Mono"');
    const localAt = face.indexOf('local("Berkeley Mono")');
    expect(
      localAt,
      'the Berkeley Mono @font-face must start from local("Berkeley Mono")',
    ).toBeGreaterThanOrEqual(0);
    expect(
      face.indexOf("url("),
      "Berkeley Mono is commercial — the @font-face must not bundle a url() source",
    ).toBe(-1);
  });

  it("falls back to JetBrains Mono then ui-monospace in the mono stacks", () => {
    for (const stack of ["font-mono", "font-berkeley-mono"]) {
      const value = vars[stack];
      expect(value, `--${stack} must keep "Berkeley Mono" first`).toMatch(
        /^"Berkeley Mono"/,
      );
      expect(
        value.indexOf('"JetBrains Mono"'),
        `--${stack} must list "JetBrains Mono" right after Berkeley Mono`,
      ).toBeGreaterThan(-1);
      expect(
        value.indexOf("ui-monospace"),
        `--${stack} must keep ui-monospace after JetBrains Mono`,
      ).toBeGreaterThan(value.indexOf('"JetBrains Mono"'));
    }
  });

  it("documents the substitution contract in a CSS comment", () => {
    const comments = themeCss.match(/\/\*[\s\S]*?\*\//g) ?? [];
    expect(
      comments.some((c) =>
        /Berkeley Mono/.test(c) && /JetBrains Mono/.test(c) && /never bundled|not bundled/.test(c),
      ),
      "theme.css must carry a comment documenting the Berkeley Mono → JetBrains Mono → ui-monospace substitution contract",
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// OpenType feature signature — cv01 / ss03 / zero applied to the sans stack.
// ---------------------------------------------------------------------------

describe("OpenType features (task 12)", () => {
  it("applies cv01 / ss03 / zero to the Inter Variable sans stack", () => {
    const bodyRule = globalsCss.match(/body\s*{[^}]*}/)?.[0] ?? "";
    expect(bodyRule, "the base body rule must set font-family: var(--font-sans)").toContain(
      "font-family: var(--font-sans)",
    );
    expect(
      bodyRule,
      'the base body rule must apply font-feature-settings "cv01", "ss03", "zero"',
    ).toMatch(/font-feature-settings:\s*"cv01"[\s\S]*"ss03"[\s\S]*"zero"/);
  });
});
