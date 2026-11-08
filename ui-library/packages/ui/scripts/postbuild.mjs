#!/usr/bin/env node
// Post-build artifact step for @usalyt/ui.
//
// tsdown compiles the entries but does not preserve React Server Component
// client boundaries: source modules declare `"use client"` and the bundler
// drops the directive. This step re-applies it to every public entry output
// (root barrel, components, blocks) and is idempotent, so repeated builds do
// not duplicate the line. Only entry `.mjs`/`.cjs` files are touched; shared
// chunks, declaration files, and source maps are left intact.
//
// It also copies the Inter Variable woff2 files referenced by the compiled
// stylesheet into `dist/files/`, keeping `url(./files/...)` valid next to
// `dist/styles.css`, and ships the font's OFL license alongside them. Berkeley
// Mono stays local()-only and is never copied.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entryExtensions, publicEntries, styleFiles } from "./public-entries.mjs";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const clientDirective = '"use client";';
const distDir = path.join(packageRoot, "dist");

function assertExists(absolutePath, label) {
  if (!existsSync(absolutePath)) {
    throw new Error(
      `${label} is missing (${path.relative(packageRoot, absolutePath)}). Run the package build first.`,
    );
  }
}

// ---------------------------------------------------------------------------
// 1. Preserve the client boundary on every public entry.
// ---------------------------------------------------------------------------

assertExists(distDir, "dist directory");

const compiledCss = path.join(packageRoot, styleFiles.compiled);
assertExists(
  compiledCss,
  "compiled stylesheet (run the CSS build before this step)",
);

let updatedEntries = 0;

for (const entry of publicEntries) {
  for (const extension of [entryExtensions.esm, entryExtensions.cjs]) {
    const file = path.join(
      packageRoot,
      `${entry.distBase}.${extension}`,
    );
    assertExists(file, `entry ${entry.subpath}`);

    const source = readFileSync(file, "utf8");
    const firstLine = source.split("\n", 1)[0].trim();

    if (firstLine === clientDirective) continue;

    writeFileSync(file, `${clientDirective}\n${source}`);
    updatedEntries += 1;
  }
}

// ---------------------------------------------------------------------------
// 2. Copy the font files referenced by the compiled stylesheet.
// ---------------------------------------------------------------------------

const fontSourceRoot = path.join(
  packageRoot,
  "node_modules",
  "@fontsource-variable",
  "inter",
);

const css = readFileSync(compiledCss, "utf8");
const relativeUrls = [...css.matchAll(/url\(([^)]+)\)/g)]
  .map((match) => match[1].replace(/^["']|["']$/g, "").trim())
  .filter((url) => !url.startsWith("data:") && !/^[a-z]+:/i.test(url));

let copiedFonts = 0;

for (const url of relativeUrls) {
  const destination = path.resolve(path.dirname(compiledCss), url);
  const destinationRelative = path.relative(distDir, destination);

  if (destinationRelative.startsWith("..") || path.isAbsolute(destinationRelative)) {
    throw new Error(
      `stylesheet URL escapes dist/: ${url}`,
    );
  }

  if (existsSync(destination)) continue;

  const source = path.resolve(fontSourceRoot, url.replace(/^\.\//, ""));
  const sourceRelative = path.relative(fontSourceRoot, source);

  if (sourceRelative.startsWith("..") || path.isAbsolute(sourceRelative)) {
    throw new Error(
      `stylesheet URL does not resolve inside @fontsource-variable/inter: ${url}`,
    );
  }

  assertExists(source, `font referenced by ${styleFiles.compiled}`);

  mkdirSync(path.dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  copiedFonts += 1;
}

const interLicense = path.join(fontSourceRoot, "LICENSE");
const interLicenseDestination = path.join(distDir, "files", "Inter-OFL.txt");

if (existsSync(interLicense) && !existsSync(interLicenseDestination)) {
  mkdirSync(path.dirname(interLicenseDestination), { recursive: true });
  copyFileSync(interLicense, interLicenseDestination);
}

process.stdout.write(
  `postbuild: client directive refreshed on ${updatedEntries} entry file(s); ` +
    `${copiedFonts} font file(s) copied to dist/files.\n`,
);
