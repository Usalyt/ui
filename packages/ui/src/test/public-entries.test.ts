// Public entry map contract.
//
// Pins the data that scripts/postbuild.mjs, scripts/verify-artifacts.mjs, and
// the package.json `exports` map consume: every source component/block with an
// index.ts must have exactly one public subpath, a real source file, and a
// dual-format (ESM/CJS + matching declarations) output layout.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildExportsMap,
  entryExtensions,
  publicEntries,
  styleFiles,
} from "../../scripts/public-entries.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "../..");
const sourceRoot = path.join(packageRoot, "src");

function sourceEntries(group: "components" | "blocks"): string[] {
  return readdirSync(path.join(sourceRoot, group), { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(path.join(sourceRoot, group, entry.name, "index.ts")),
    )
    .map((entry) => `${group}/${entry.name}`)
    .sort();
}

describe("public entry map", () => {
  it("lists the root barrel, every component, and every block exactly once", () => {
    const expectedSources = [
      "src/index.ts",
      ...sourceEntries("components").map((name) => `src/${name}/index.ts`),
      ...sourceEntries("blocks").map((name) => `src/${name}/index.ts`),
    ];

    expect(
      publicEntries.map((entry) => entry.source).sort(),
      "publicEntries must mirror src/index.ts + every component/block index.ts",
    ).toEqual(expectedSources.sort());

    const subpaths = publicEntries.map((entry) => entry.subpath);
    expect(new Set(subpaths).size).toBe(subpaths.length);
    expect(subpaths[0]).toBe(".");
  });

  it("points every entry at a real source file", () => {
    for (const entry of publicEntries) {
      expect(
        existsSync(path.join(packageRoot, entry.source)),
        `${entry.subpath} source must exist (${entry.source})`,
      ).toBe(true);
    }
  });

  it("re-exports every component and block from the root barrel", () => {
    const barrel = readFileSync(path.join(sourceRoot, "index.ts"), "utf8");

    for (const entry of publicEntries) {
      if (entry.subpath === ".") continue;
      expect(
        barrel.includes(`export * from "./${entry.source.replace(/^src\//, "").replace(/\/index\.ts$/, "")}";`),
        `src/index.ts must re-export ${entry.subpath}`,
      ).toBe(true);
    }
  });

  it("declares dual-format targets with matching declaration files", () => {
    const exportsMap = buildExportsMap() as Record<
      string,
      | string
      | {
          import?: { types?: string; default?: string };
          require?: { types?: string; default?: string };
        }
    >;

    for (const entry of publicEntries) {
      const target = exportsMap[entry.subpath];
      expect(typeof target, `${entry.subpath} must have an export target`).toBe(
        "object",
      );

      const conditions = target as {
        import: { types: string; default: string };
        require: { types: string; default: string };
      };

      expect(conditions.import.default).toBe(
        `./${entry.distBase}.${entryExtensions.esm}`,
      );
      expect(conditions.import.types).toBe(
        `./${entry.distBase}.${entryExtensions.esmTypes}`,
      );
      expect(conditions.require.default).toBe(
        `./${entry.distBase}.${entryExtensions.cjs}`,
      );
      expect(conditions.require.types).toBe(
        `./${entry.distBase}.${entryExtensions.cjsTypes}`,
      );

      // `types` must precede `default` inside each condition for TypeScript to
      // read the declaration instead of the runtime file.
      expect(Object.keys(conditions.import)).toEqual(["types", "default"]);
      expect(Object.keys(conditions.require)).toEqual(["types", "default"]);
    }

    expect(exportsMap["./styles.css"]).toBe(`./${styleFiles.compiled}`);
    expect(exportsMap["./styles/globals.css"]).toBe(`./${styleFiles.raw}`);
    expect(exportsMap["./styles/theme.css"]).toBe(`./${styleFiles.theme}`);
    expect(exportsMap["./package.json"]).toBe("./package.json");
  });
});
