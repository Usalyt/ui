import { chmodSync, readFileSync } from "node:fs";
import { defineConfig } from "tsdown";

const BIN_OUTPUT = "dist/index.mjs";
const NODE_SHEBANG = "#!/usr/bin/env node";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  outDir: "dist",
  onSuccess() {
    const output = readFileSync(BIN_OUTPUT, "utf8");
    if (!output.startsWith(NODE_SHEBANG)) {
      throw new Error(`${BIN_OUTPUT} must start with "${NODE_SHEBANG}" for the usalyt-mcp bin entry.`);
    }
    chmodSync(BIN_OUTPUT, 0o755);
  }
});
