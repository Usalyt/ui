import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";

/**
 * Every directory under `src/<group>` with an `index.ts` is a public entry.
 * Keeping this derived from the tree prevents a component from shipping in the
 * root barrel while silently missing its own subpath artifact.
 */
function entryDirectories(group: string): string[] {
  const groupRoot = path.resolve("src", group);
  if (!existsSync(groupRoot)) return [];

  return readdirSync(groupRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(path.join(groupRoot, entry.name, "index.ts")),
    )
    .map((entry) => `src/${group}/${entry.name}/index.ts`)
    .sort();
}

export default defineConfig({
  entry: [
    "src/index.ts",
    ...entryDirectories("components"),
    ...entryDirectories("blocks"),
  ],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "@base-ui/react"]
});
