#!/usr/bin/env node
/**
 * docs-a11y.mjs — automated accessibility audit for the built Usalyt docs site.
 *
 * Serves `apps/docs/dist` on an ephemeral local port and runs axe-core
 * (tags: wcag2a, wcag2aa, wcag21aa) against a representative route set in both
 * themes at desktop and mobile widths. Exits non-zero while any serious or
 * critical violation remains.
 *
 * Usage (from the repo root):
 *   pnpm --filter @usalyt/tests docs-a11y
 *   DOCS_A11Y_SKIP_BUILD=1 pnpm --filter @usalyt/tests docs-a11y   # reuse apps/docs/dist
 *   DOCS_A11Y_LOG=/tmp/docs-a11y.log pnpm --filter @usalyt/tests docs-a11y
 */

import { spawnSync } from "node:child_process";
import { createReadStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "../../..");
const DIST_DIR = path.join(REPO_ROOT, "apps/docs/dist");
const BASE_PATH = "/";

/** Routes audited at desktop width in both themes. */
const DESKTOP_ROUTES = [
  "/",
  "/getting-started/installation/",
  "/es/",
  "/es/getting-started/installation/",
  "/components/button/",
  "/components/sidebar/",
  "/components/combobox/",
  "/blocks/auth-form/",
  "/blocks/project-kanban-board/",
  "/404.html",
];

/** Routes audited at mobile width in both themes. */
const MOBILE_ROUTES = ["/", "/components/button/"];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const THEMES = ["dark", "light"];
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21aa"];
const FAILING_IMPACTS = new Set(["serious", "critical"]);

const MIME_TYPES = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".wasm": "application/wasm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

/**
 * Minimal static file server for the Astro build output.
 * @returns {Promise<{ server: import('node:http').Server, origin: string }>}
 */
async function serveDist() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      let pathname = decodeURIComponent(url.pathname);
      if (!pathname.startsWith(BASE_PATH)) {
        res.writeHead(404).end("Not found");
        return;
      }
      let filePath = path.join(DIST_DIR, pathname);
      // `/components/button/` -> `<dist>/components/button/index.html`
      const info = await stat(filePath).catch(() => null);
      if (info?.isDirectory()) filePath = path.join(filePath, "index.html");

      const fileInfo = await stat(filePath).catch(() => null);
      if (!fileInfo?.isFile()) {
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      res.writeHead(200, {
        "content-type": MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
        "cache-control": "no-store",
      });
      createReadStream(filePath).pipe(res);
    } catch (error) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end(String(error));
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(Number(process.env.DOCS_A11Y_PORT ?? 0), "127.0.0.1", resolve);
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return { server, origin: `http://127.0.0.1:${port}` };
}

function buildDocs() {
  if (process.env.DOCS_A11Y_SKIP_BUILD === "1") {
    console.log("docs-a11y: DOCS_A11Y_SKIP_BUILD=1 — reusing existing apps/docs/dist\n");
    return;
  }
  console.log("docs-a11y: building @usalyt/docs…");
  const result = spawnSync("pnpm", ["--filter", "@usalyt/docs", "build"], {
    cwd: REPO_ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    throw new Error(`@usalyt/docs build failed with exit code ${result.status}`);
  }
  console.log("docs-a11y: build finished\n");
}

/** Force a theme the way the site's own toggle does (belt and braces after load). */
async function applyTheme(page, theme) {
  await page.evaluate((value) => {
    localStorage.setItem("starlight-theme", value);
    localStorage.setItem("theme", value);
    document.documentElement.dataset.theme = value;
    document.documentElement.classList.toggle("dark", value === "dark");
  }, theme);
  // Let the style recalculation settle before axe reads computed styles.
  await page.waitForTimeout(120);
}

function summarizeViolations(violations) {
  return violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact ?? "unknown",
    help: violation.help,
    nodes: violation.nodes.length,
    targets: violation.nodes.slice(0, 3).map((node) => node.target.join(" ")),
  }));
}

function isFailing(entry) {
  return entry.violations.some((violation) => FAILING_IMPACTS.has(violation.impact ?? ""));
}

function renderTextReport(entries, skippedBuild) {
  const lines = [];
  const pad = (value, width) => String(value).padEnd(width);
  const right = (value, width) => String(value).padStart(width);

  lines.push("docs-a11y — axe-core audit of the built Usalyt docs site");
  lines.push(`axe tags: ${AXE_TAGS.join(", ")} | failing on: serious, critical`);
  lines.push(`routes: ${entries.length} audits (${THEMES.length} themes x desktop+mobile)`);
  lines.push("");

  const ruleTotals = new Map();
  let seriousCriticalTotal = 0;

  for (const entry of entries) {
    const label = `${pad(entry.route, 34)} ${pad(entry.theme, 6)} ${pad(entry.viewport, 8)}`;
    const failing = isFailing(entry);
    if (entry.error) {
      lines.push(`${label} ERROR   ${entry.error}`);
      seriousCriticalTotal += 1;
      continue;
    }
    if (entry.violations.length === 0) {
      lines.push(`${label} PASS    0 violations`);
    } else {
      lines.push(
        `${label} ${failing ? "FAIL" : "WARN"}    ${entry.violations.length} rule(s), ${entry.totalNodes} node(s)`
      );
    }
    for (const violation of entry.violations) {
      const mark = FAILING_IMPACTS.has(violation.impact) ? "!" : " ";
      lines.push(
        `  ${mark} ${pad(violation.id, 30)} ${pad(violation.impact, 9)} ${right(violation.nodes, 4)} node(s)  ${violation.help}`
      );
      if (violation.targets.length > 0) lines.push(`      e.g. ${violation.targets.join(" | ")}`);
      const current = ruleTotals.get(violation.id) ?? { nodes: 0, entries: 0, impact: violation.impact };
      ruleTotals.set(violation.id, {
        nodes: current.nodes + violation.nodes,
        entries: current.entries + 1,
        impact: violation.impact,
      });
    }
  }

  lines.push("");
  lines.push("Violation totals by rule:");
  const sortedRules = [...ruleTotals.entries()].sort((a, b) => b[1].nodes - a[1].nodes || a[0].localeCompare(b[0]));
  for (const [id, meta] of sortedRules) {
    lines.push(`  ${meta.impact === "serious" || meta.impact === "critical" ? "!" : " "} ${pad(id, 30)} ${right(meta.nodes, 5)} node(s) across ${meta.entries} audit(s)`);
    if (FAILING_IMPACTS.has(meta.impact)) seriousCriticalTotal += meta.nodes;
  }
  if (sortedRules.length === 0) lines.push("  (none)");

  const failingAudits = entries.filter((entry) => entry.error || isFailing(entry));
  lines.push("");
  if (failingAudits.length === 0) {
    lines.push("RESULT: GREEN — no serious/critical violations.");
  } else {
    lines.push(`RESULT: RED — ${failingAudits.length} audit(s) with serious/critical violations.`);
    for (const entry of failingAudits) {
      const failingRules = entry.violations
        .filter((violation) => FAILING_IMPACTS.has(violation.impact))
        .map((violation) => `${violation.id} (${violation.nodes})`);
      lines.push(`  - ${entry.route} [${entry.theme} ${entry.viewport}] ${entry.error ?? failingRules.join(", ")}`);
    }
  }
  if (skippedBuild) lines.push("(build was skipped; audited the existing apps/docs/dist)");
  return { text: lines.join("\n"), failingCount: failingAudits.length };
}

async function main() {
  const startedAt = new Date().toISOString();
  buildDocs();

  const { server, origin } = await serveDist();
  const entries = [];
  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    const targets = [
      ...DESKTOP_ROUTES.flatMap((route) => THEMES.map((theme) => ({ route, theme, viewport: "desktop" }))),
      ...MOBILE_ROUTES.flatMap((route) => THEMES.map((theme) => ({ route, theme, viewport: "mobile" }))),
    ];

    for (const target of targets) {
      const context = await browser.newContext({
        viewport: VIEWPORTS[target.viewport],
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        colorScheme: target.theme === "dark" ? "dark" : "light",
      });
      await context.addInitScript((theme) => {
        try {
          localStorage.setItem("starlight-theme", theme);
          localStorage.setItem("theme", theme);
        } catch {
          /* localStorage unavailable — the forced dataset below still applies */
        }
      }, target.theme);

      const page = await context.newPage();
      const entry = { ...target, violations: [], totalNodes: 0 };
      try {
        const response = await page.goto(origin + target.route, { waitUntil: "load", timeout: 45_000 });
        if (response && response.status() >= 400) {
          throw new Error(`HTTP ${response.status()} for ${target.route}`);
        }
        await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3000))]));
        await applyTheme(page, target.theme);

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        entry.violations = summarizeViolations(results.violations);
        entry.totalNodes = entry.violations.reduce((sum, violation) => sum + violation.nodes, 0);

        const htmlTheme = await page.evaluate(() => ({
          dataTheme: document.documentElement.dataset.theme,
          hasDark: document.documentElement.classList.contains("dark"),
        }));
        entry.htmlTheme = htmlTheme;
        console.log(
          `docs-a11y: ${target.route} [${target.theme} ${target.viewport}] -> ${entry.violations.length} rule(s), ${entry.totalNodes} node(s)`
        );
      } catch (error) {
        entry.error = String(error instanceof Error ? error.message : error);
        console.error(`docs-a11y: ${target.route} [${target.theme} ${target.viewport}] ERROR ${entry.error}`);
      } finally {
        await context.close();
      }
      entries.push(entry);
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const { text, failingCount } = renderTextReport(entries, process.env.DOCS_A11Y_SKIP_BUILD === "1");
  const report = [
    text,
    "",
    `generated: ${startedAt}`,
    `report: ${entries.length} audits, ${failingCount} failing`,
    "",
  ].join("\n");
  console.log(`\n${report}`);

  const logPath = process.env.DOCS_A11Y_LOG;
  if (logPath) {
    await mkdir(path.dirname(logPath), { recursive: true });
    await writeFile(logPath, report, "utf8");
    const jsonPath = logPath.replace(/\.log$/, ".json") === logPath ? `${logPath}.json` : logPath.replace(/\.log$/, ".json");
    await writeFile(jsonPath, JSON.stringify({ generatedAt: startedAt, entries }, null, 2), "utf8");
    console.log(`docs-a11y: report written to ${logPath} (JSON: ${jsonPath})`);
  }

  process.exitCode = failingCount > 0 ? 1 : 0;
}

main().catch((error) => {
  console.error("docs-a11y: fatal error", error);
  process.exitCode = 1;
});
