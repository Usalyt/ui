// Single source of truth for the package's public entry points.
//
// The list is derived from the source tree instead of a hand-maintained array,
// so adding a component or block directory automatically adds a build entry,
// an artifact-contract check, and an export-map recommendation. Directories
// without an `index.ts` public entry are ignored.
//
// Run `node scripts/public-entries.mjs` to print the manifest data that the
// package.json `exports` map must contain.

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function listEntryDirectories(group) {
  const groupRoot = path.join(packageRoot, "src", group);
  if (!existsSync(groupRoot)) return [];

  return readdirSync(groupRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(path.join(groupRoot, entry.name, "index.ts")),
    )
    .map((entry) => entry.name)
    .sort();
}

const componentNames = listEntryDirectories("components");
const blockNames = listEntryDirectories("blocks");

/**
 * Every public module entry, in a stable order: the root barrel first, then
 * component subpaths, then block subpaths.
 *
 * `subpath` is the package export key, `source` is the tsdown input, and
 * `distBase` is the emitted file base (without extension).
 */
export const publicEntries = [
  {
    subpath: ".",
    source: "src/index.ts",
    distBase: "dist/index",
  },
  ...componentNames.map((name) => ({
    subpath: `./${name}`,
    source: `src/components/${name}/index.ts`,
    distBase: `dist/components/${name}/index`,
  })),
  ...blockNames.map((name) => ({
    subpath: `./blocks/${name}`,
    source: `src/blocks/${name}/index.ts`,
    distBase: `dist/blocks/${name}/index`,
  })),
];

/** Formats emitted by tsdown for every entry. */
export const entryExtensions = {
  esm: "mjs",
  cjs: "cjs",
  esmTypes: "d.mts",
  cjsTypes: "d.cts",
};

/** The compiled public stylesheet and the raw source stylesheets. */
export const styleFiles = {
  compiled: "dist/styles.css",
  raw: "styles/globals.css",
  theme: "styles/theme.css",
};

/**
 * The exact `exports` map the package manifest must declare.
 *
 * Dual-package layout: each condition carries its own declaration file so
 * TypeScript resolves `.d.mts` for `import` and `.d.cts` for `require`.
 */
export function buildExportsMap() {
  /** @type {Record<string, unknown>} */
  const exportsMap = {};

  for (const entry of publicEntries) {
    exportsMap[entry.subpath] = {
      import: {
        types: `./${entry.distBase}.${entryExtensions.esmTypes}`,
        default: `./${entry.distBase}.${entryExtensions.esm}`,
      },
      require: {
        types: `./${entry.distBase}.${entryExtensions.cjsTypes}`,
        default: `./${entry.distBase}.${entryExtensions.cjs}`,
      },
    };
  }

  exportsMap["./styles.css"] = `./${styleFiles.compiled}`;
  exportsMap["./styles/globals.css"] = `./${styleFiles.raw}`;
  exportsMap["./styles/theme.css"] = `./${styleFiles.theme}`;
  exportsMap["./package.json"] = "./package.json";

  return exportsMap;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  process.stdout.write(
    `${JSON.stringify(
      {
        packageRoot,
        entries: publicEntries,
        exports: buildExportsMap(),
      },
      null,
      2,
    )}\n`,
  );
}
