#!/usr/bin/env node
// Artifact contract verifier for the published @usalyt/ui package.
//
// Default mode validates the build output that this package owns:
//   - every public entry emitted as ESM, CJS, .d.mts, and .d.cts,
//   - every public entry starts with the "use client" directive,
//   - the compiled stylesheet exists, exposes theme tokens and component
//     utilities, contains no Tailwind Preflight, and every font URL resolves,
//   - runtime dependencies contain no pnpm `workspace:` protocol. The source
//     manifest keeps `workspace:` for devDependencies so pnpm links the
//     monorepo; the packed manifest rewrite is verified by the release
//     coordinator's tarball inspection.
//
// `--strict-manifest` additionally requires package.json to match the export
// map, files allowlist, entry fields, and side-effect metadata generated from
// scripts/public-entries.mjs. The manifest is coordinator-owned, so strict mode
// is the post-integration gate rather than a local build check.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildExportsMap,
  entryExtensions,
  publicEntries,
  styleFiles,
} from "./public-entries.mjs";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const strictManifest = process.argv.includes("--strict-manifest");
const errors = [];
const notes = [];

function fail(message) {
  errors.push(message);
}

function pass(message) {
  notes.push(message);
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(packageRoot, relativePath), "utf8"));
}

function requireFile(relativePath, label) {
  const absolute = path.join(packageRoot, relativePath);
  if (!existsSync(absolute)) {
    fail(`${label}: missing ${relativePath}`);
    return false;
  }
  if (statSync(absolute).size === 0) {
    fail(`${label}: ${relativePath} is empty`);
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Public entries: emitted files and client boundary.
// ---------------------------------------------------------------------------

const clientDirective = '"use client";';

for (const entry of publicEntries) {
  const formats = [
    `${entry.distBase}.${entryExtensions.esm}`,
    `${entry.distBase}.${entryExtensions.cjs}`,
    `${entry.distBase}.${entryExtensions.esmTypes}`,
    `${entry.distBase}.${entryExtensions.cjsTypes}`,
  ];

  for (const format of formats) {
    requireFile(format, `entry ${entry.subpath}`);
  }

  for (const extension of [entryExtensions.esm, entryExtensions.cjs]) {
    const relativePath = `${entry.distBase}.${extension}`;
    const absolute = path.join(packageRoot, relativePath);
    if (!existsSync(absolute)) continue;

    const firstLine = readFileSync(absolute, "utf8").split("\n", 1)[0].trim();
    if (firstLine !== clientDirective) {
      fail(
        `entry ${entry.subpath}: ${relativePath} must start with ${clientDirective} (found ${JSON.stringify(firstLine)})`,
      );
    }
  }
}

pass(`${publicEntries.length} public entries checked`);

// ---------------------------------------------------------------------------
// Compiled stylesheet: tokens, utilities, no Preflight, resolvable fonts.
// ---------------------------------------------------------------------------

const compiledCssPath = path.join(packageRoot, styleFiles.compiled);

if (requireFile(styleFiles.compiled, "stylesheet")) {
  const css = readFileSync(compiledCssPath, "utf8");

  const requiredCssMarkers = [
    ["theme token --color-background", "--color-background:"],
    ["theme token --color-acid-lime", "--color-acid-lime:"],
    ["theme token --color-sidebar", "--color-sidebar:"],
    ["theme token --color-field", "--color-field:"],
    ["component utility bg-primary", ".bg-primary{"],
    ["component utility bg-field", ".bg-field{"],
    ["authored tracking utility", ".tracking-tight-linear{"],
    ["motion keyframes", "@keyframes overlay-in"],
  ];

  for (const [label, marker] of requiredCssMarkers) {
    if (!css.includes(marker)) {
      fail(`stylesheet: missing ${label} (${marker})`);
    }
  }

  // Preflight signatures. `::file-selector-button` alone is not a reliable
  // marker: Tailwind's `file:` variant also emits it. These two patterns only
  // appear when Preflight is imported.
  const preflightMarkers = [
    /-webkit-text-size-adjust\s*:\s*100%/,
    /,\s*::?backdrop\s*\{[^}]*box-sizing\s*:\s*border-box/,
  ];

  for (const marker of preflightMarkers) {
    if (marker.test(css)) {
      fail(
        `stylesheet: Tailwind Preflight marker found (${marker}); compiled CSS must not reset host-page styles`,
      );
    }
  }

  if (/--color-background:\s*0 0% 0%/.test(css)) {
    fail("stylesheet: legacy HSL theme variables found");
  }

  const fontUrls = [...css.matchAll(/url\(([^)]+)\)/g)].map((match) =>
    match[1].replace(/^["']|["']$/g, "").trim(),
  );

  for (const url of fontUrls) {
    if (url.startsWith("data:")) continue;
    if (/^[a-z]+:/i.test(url)) {
      fail(`stylesheet: absolute font URL is not portable (${url})`);
      continue;
    }
    const resolved = path.resolve(path.dirname(compiledCssPath), url);
    if (!existsSync(resolved)) {
      fail(`stylesheet: font URL target is missing (${url})`);
    }
  }

  if (
    !fontUrls.some((url) => url.includes("inter-latin-wght-normal.woff2"))
  ) {
    fail("stylesheet: Inter Variable latin font is not referenced");
  }

  if (!css.includes("local(Berkeley Mono)") && !css.includes('local("Berkeley Mono")')) {
    fail("stylesheet: Berkeley Mono local() substitution is missing");
  }

  if (!/font-family:\s*["']?Berkeley Mono["']?/.test(css)) {
    fail("stylesheet: Berkeley Mono @font-face family is missing");
  }

  const berkeleyFace = css.match(
    /@font-face\s*{[^}]*font-family:\s*["']?Berkeley Mono["']?[^}]*}/,
  )?.[0];
  if (berkeleyFace && berkeleyFace.includes("url(")) {
    fail("stylesheet: Berkeley Mono must not bundle a font file");
  }

  pass("compiled stylesheet checked (tokens, utilities, no Preflight, fonts)");
}

const distDir = path.join(packageRoot, "dist");
if (existsSync(distDir)) {
  const berkeleyBinary = readdirSync(distDir, { recursive: true })
    .filter((name) => typeof name === "string")
    .find((name) => /berkeley/i.test(name));
  if (berkeleyBinary) {
    fail(
      `stylesheet: Berkeley Mono file must not be shipped (${berkeleyBinary})`,
    );
  }
}

// ---------------------------------------------------------------------------
// Manifest checks owned by this package slice.
// ---------------------------------------------------------------------------

const manifest = readJson("package.json");

for (const dependencyField of [
  "dependencies",
  "peerDependencies",
  "optionalDependencies",
]) {
  for (const [name, version] of Object.entries(
    manifest[dependencyField] ?? {},
  )) {
    if (String(version).startsWith("workspace:")) {
      fail(
        `manifest: ${dependencyField}.${name} still uses the workspace: protocol`,
      );
    }
  }
}

if (strictManifest) {
  const expectedExports = buildExportsMap();
  const actualExports = manifest.exports ?? {};

  const expectedSubpaths = Object.keys(expectedExports).sort();
  const actualSubpaths = Object.keys(actualExports).sort();

  if (JSON.stringify(expectedSubpaths) !== JSON.stringify(actualSubpaths)) {
    fail(
      `manifest: exports subpaths differ from the public entry map\n  missing: ${expectedSubpaths
        .filter((subpath) => !actualSubpaths.includes(subpath))
        .join(", ") || "none"}\n  unexpected: ${
        actualSubpaths
          .filter((subpath) => !expectedSubpaths.includes(subpath))
          .join(", ") || "none"
      }`,
    );
  }

  for (const [subpath, target] of Object.entries(expectedExports)) {
    const actual = actualExports[subpath];

    // A missing subpath is already reported by the set comparison above.
    if (actual === undefined) continue;

    if (typeof target === "string") {
      if (actual !== target) {
        fail(
          `manifest: exports["${subpath}"] must be ${JSON.stringify(target)}`,
        );
      }
      continue;
    }

    if (typeof actual !== "object") {
      fail(
        `manifest: exports["${subpath}"] is missing the required dual-format target`,
      );
      continue;
    }

    for (const condition of ["import", "require"]) {
      const conditionTarget = actual[condition];
      const expectedCondition = target[condition];

      if (
        !conditionTarget ||
        Object.keys(conditionTarget)[0] !== "types" ||
        conditionTarget.types !== expectedCondition.types ||
        conditionTarget.default !== expectedCondition.default
      ) {
        fail(
          `manifest: exports["${subpath}"].${condition} must declare { types: ${JSON.stringify(
            expectedCondition.types,
          )}, default: ${JSON.stringify(expectedCondition.default)} } with "types" first`,
        );
      }
    }
  }

  for (const [label, relativePath] of [
    ["main", manifest.main],
    ["module", manifest.module],
    ["types", manifest.types],
  ]) {
    if (!relativePath) {
      fail(`manifest: ${label} is missing`);
      continue;
    }
    if (!existsSync(path.resolve(packageRoot, relativePath))) {
      fail(`manifest: ${label} target does not exist (${relativePath})`);
    }
  }

  const files = new Set(manifest.files ?? []);
  for (const requiredFile of [
    "dist",
    "src",
    "styles",
    "scripts",
    "tsdown.config.ts",
    "tsconfig.json",
    "README.md",
    "LICENSE",
    "CHANGELOG.md",
  ]) {
    if (!files.has(requiredFile)) {
      fail(`manifest: files allowlist must include "${requiredFile}"`);
    }
  }

  const sideEffects = manifest.sideEffects;
  const preservesCssImports =
    sideEffects === true ||
    (Array.isArray(sideEffects) &&
      sideEffects.some((pattern) => String(pattern).includes(".css")));

  if (!preservesCssImports) {
    fail(
      'manifest: sideEffects must preserve CSS imports (for example ["**/*.css"])',
    );
  }

  if (manifest.peerDependenciesMeta?.tailwindcss?.optional !== true) {
    fail(
      "manifest: tailwindcss must be an optional peer (it is only needed for raw source customization)",
    );
  }

  if (manifest.publishConfig?.access !== "public") {
    fail("manifest: publishConfig.access must be public");
  }

  if (manifest.license !== "GPL-3.0-only") {
    fail("manifest: license must be GPL-3.0-only");
  }

  pass("strict manifest contract checked");
}

// ---------------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------------

if (errors.length > 0) {
  process.stderr.write("@usalyt/ui artifact verification failed:\n");
  for (const error of errors) {
    process.stderr.write(`  - ${error}\n`);
  }
  process.stderr.write(
    `\n${errors.length} problem(s). Run "pnpm build" and ensure package.json matches scripts/public-entries.mjs.\n` +
      `Print the exact required export map with: node scripts/public-entries.mjs\n`,
  );
  process.exit(1);
}

for (const note of notes) {
  process.stdout.write(`ok: ${note}\n`);
}

process.stdout.write(
  strictManifest
    ? "@usalyt/ui artifact verification passed (strict manifest).\n"
    : "@usalyt/ui artifact verification passed.\n",
);
