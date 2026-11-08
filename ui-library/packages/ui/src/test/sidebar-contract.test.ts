// Sidebar surface + collapsed-rail contract tests — TDD layer for OpenSpec
// change refactor-sdd-tdd-full-coverage, task 15 (Redesign Workstream).
//
// These tests read the actual source (globals.css tokens + sidebar source)
// and pin the task-15 sidebar contract:
//   - the six `--color-sidebar*` tokens exist in @theme and are overridden in
//     the light theme block, so `bg-sidebar` / `text-sidebar-foreground` /
//     `hover:bg-sidebar-accent` resolve in BOTH themes,
//   - the sidebar foreground keeps the WCAG AA floor on both sidebar surfaces,
//   - the primitive hides the label slot and centres the icon in the
//     `collapsible=icon` rail instead of clipping text into single letters,
//   - the default story ships a fullscreen layout with icons, real labels and
//     a visible active state.
//
// RED state before task 15: none of the `--color-sidebar*` tokens existed in
// globals.css (the sidebar surface rendered transparent over the page canvas),
// the story had no `layout: "fullscreen"` (SidebarInset collapsed to a sliver)
// and the collapsed rail wrapped "UX Check" and clipped menu labels to single
// letters.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { contrastRatio, hexToRgb, type RGB } from "./contrast";

const here = path.dirname(fileURLToPath(import.meta.url));
const globalsCss = readFileSync(
  path.resolve(here, "../../styles/globals.css"),
  "utf8",
);

const COMPONENT_DIR = path.resolve(here, "../components");

function readComponent(relativePath: string): string {
  return readFileSync(path.resolve(COMPONENT_DIR, relativePath), "utf8");
}

const sidebarSource = readComponent("sidebar/sidebar.tsx");
const sidebarStories = readComponent("sidebar/sidebar.stories.tsx");

// ---------------------------------------------------------------------------
// Minimal globals.css token parser (same contract as palette/type contracts).
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
    if (!(m[1] in vars)) vars[m[1]] = m[2].trim();
  }
  return vars;
}

const darkVars = collectVars(globalsCss);
const lightVars = collectVars(lightBlockSource(globalsCss));

/** Resolve a token through up to two `var(--x)` indirections. */
function resolveVar(scoped: VarMap, name: string): string | undefined {
  let value = scoped[name] ?? darkVars[name];
  for (let hop = 0; hop < 2 && value; hop++) {
    const ref = value.match(/^var\(--([a-z0-9-]+)\)$/);
    if (!ref) break;
    value = scoped[ref[1]] ?? darkVars[ref[1]];
  }
  return value;
}

function resolveColor(name: string, theme: "light" | "dark"): RGB {
  const scoped = theme === "light" ? lightVars : darkVars;
  const value = resolveVar(scoped, name);
  if (!value) throw new Error(`Token --${name} not found in globals.css`);
  const hex = value.match(/^#([0-9a-fA-F]{3,8})$/);
  if (!hex) throw new Error(`--${name} must resolve to a hex color, got "${value}"`);
  return hexToRgb(value);
}

const SIDEBAR_TOKENS = [
  "color-sidebar",
  "color-sidebar-foreground",
  "color-sidebar-border",
  "color-sidebar-ring",
  "color-sidebar-accent",
  "color-sidebar-accent-foreground",
] as const;

describe("Sidebar surface tokens (task 15)", () => {
  it("declares all six --color-sidebar* tokens in the @theme block", () => {
    for (const token of SIDEBAR_TOKENS) {
      expect(
        darkVars[token],
        `--${token} must be declared in packages/ui/styles/globals.css @theme so bg-sidebar / text-sidebar-foreground resolve`,
      ).toBeTruthy();
    }
  });

  it("overrides the sidebar surface tokens in the light theme block", () => {
    for (const token of SIDEBAR_TOKENS) {
      expect(
        lightVars[token],
        `--${token} must be overridden in ${LIGHT_SELECTOR}`,
      ).toBeTruthy();
    }
    expect(
      resolveVar(lightVars, "color-sidebar"),
      "the light sidebar surface must differ from the dark carbon surface",
    ).not.toBe(resolveVar(darkVars, "color-sidebar"));
  });

  it("keeps the sidebar foreground >= 4.5:1 on the sidebar surface in both themes", () => {
    for (const theme of ["dark", "light"] as const) {
      const surface = resolveColor("color-sidebar", theme);
      const foreground = resolveColor("color-sidebar-foreground", theme);
      const ratio = contrastRatio(foreground, surface);
      expect(
        ratio,
        `[${theme}] sidebar foreground on sidebar surface measured ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("routes the primitive through token utilities instead of dead hsl(var(--sidebar-*)) references", () => {
    expect(sidebarSource).toContain("bg-sidebar");
    expect(sidebarSource).toContain("text-sidebar-foreground");
    expect(sidebarSource).toContain("hover:bg-sidebar-accent");
    expect(sidebarSource).toContain("border-sidebar-border");
    expect(
      sidebarSource.match(/hsl\(var\(--sidebar/g) ?? [],
      "hsl(var(--sidebar-*)) never resolves — use the --color-sidebar-* tokens directly",
    ).toEqual([]);
  });
});

describe("Sidebar collapsed rail (task 15)", () => {
  it("collapses the icon rail to a centred 2rem button and hides the label slot", () => {
    expect(
      sidebarSource,
      "menu buttons must shrink to a centred icon square when collapsible=icon",
    ).toContain("group-data-[collapsible=icon]:size-8");
    expect(
      sidebarSource,
      "menu buttons must centre their icon when collapsible=icon",
    ).toContain("group-data-[collapsible=icon]:justify-center");
    expect(
      sidebarSource,
      "the trailing label span must be hidden when collapsible=icon (no single-letter clipping)",
    ).toMatch(/group-data-\[collapsible=icon\]:\[&>span:last-child\]:hidden/);
  });

  it("removes the group padding in the collapsed rail so the icon square fits", () => {
    expect(sidebarSource).toContain(
      "group-data-[collapsible=icon]:p-0",
    );
  });
});

describe("Sidebar default story (task 15)", () => {
  it("renders fullscreen in both themes", () => {
    expect(sidebarStories).toContain('layout: "fullscreen"');
  });

  it("uses real lucide icons and keeps honest UX Check demo content", () => {
    expect(sidebarStories).toContain('from "lucide-react"');
    expect(sidebarStories).toContain("UX Check");
    expect(sidebarStories).toContain("Evaluations");
    expect(sidebarStories).toContain("v1.0.0");
  });

  it("shows one active item and names the icon-only buttons when collapsed", () => {
    expect(sidebarStories).toContain("isActive");
    expect(
      sidebarStories.match(/aria-label=/g)?.length ?? 0,
      "collapsed rail buttons need accessible names (aria-label)",
    ).toBeGreaterThanOrEqual(2);
    expect(
      sidebarStories,
      "collapsed rail labels must hide cleanly through the group-data contract",
    ).toContain("group-data-[collapsible=icon]:hidden");
  });
});
