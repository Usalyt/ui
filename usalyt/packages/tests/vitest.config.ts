import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  test: {
    name: "integration",
    include: ["src/**/*.test.ts"],
    testTimeout: 60000,
    hookTimeout: 30000
  }
});
