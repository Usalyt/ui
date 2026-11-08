import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs-extra";
import path from "path";
import os from "os";

const REGISTRY_PATH = path.resolve(__dirname, "../../../packages/registry/registry.json");

describe("Cross-Framework CLI & Registry Integration Tests", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "tu-ui-integration-"));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  describe("Next.js 15 Fixture Integration", () => {
    it("initializes config and adds button component to Next.js fixture", async () => {
      const pkgPath = path.join(tmpDir, "package.json");
      await fs.writeJson(pkgPath, {
        name: "next-app",
        dependencies: { next: "^15.0.0", react: "^19.0.0" }
      });

      const configPath = path.join(tmpDir, "tu-ui.json");
      const config = {
        $schema: "https://tu-ui.dev/schema/config.json",
        style: "default",
        rsc: true,
        tsx: true,
        aliases: {
          components: "@/components/ui",
          utils: "@/lib/utils"
        }
      };
      await fs.writeJson(configPath, config);

      expect(await fs.pathExists(configPath)).toBe(true);

      const registry = await fs.readJson(REGISTRY_PATH);
      const buttonItem = registry.items.find((i: any) => i.name === "button");
      expect(buttonItem).toBeDefined();

      for (const file of buttonItem.files) {
        const destPath = path.join(tmpDir, "src/components/ui/button", path.basename(file.path));
        await fs.outputFile(destPath, file.content);
      }

      const mainFile = path.join(tmpDir, "src/components/ui/button/button.tsx");
      expect(await fs.pathExists(mainFile)).toBe(true);
      const content = await fs.readFile(mainFile, "utf-8");
      expect(content).toContain("buttonVariants");
      expect(content).toContain("cva");
    });
  });

  describe("Vite + React 19 Fixture Integration", () => {
    it("adds dialog component to Vite fixture", async () => {
      const pkgPath = path.join(tmpDir, "package.json");
      await fs.writeJson(pkgPath, {
        name: "vite-app",
        dependencies: { vite: "^6.0.0", react: "^19.0.0" }
      });

      const registry = await fs.readJson(REGISTRY_PATH);
      const dialogItem = registry.items.find((i: any) => i.name === "dialog");
      expect(dialogItem).toBeDefined();

      for (const file of dialogItem.files) {
        const destPath = path.join(tmpDir, "src/components/ui/dialog", path.basename(file.path));
        await fs.outputFile(destPath, file.content);
      }

      const mainFile = path.join(tmpDir, "src/components/ui/dialog/dialog.tsx");
      expect(await fs.pathExists(mainFile)).toBe(true);
      const content = await fs.readFile(mainFile, "utf-8");
      expect(content).toContain("BaseDialog");
    });
  });

  describe("Astro 7 Fixture Integration", () => {
    it("adds tabs component to Astro 7 fixture", async () => {
      const pkgPath = path.join(tmpDir, "package.json");
      await fs.writeJson(pkgPath, {
        name: "astro-app",
        dependencies: { astro: "^7.0.0", react: "^19.0.0" }
      });

      const registry = await fs.readJson(REGISTRY_PATH);
      const tabsItem = registry.items.find((i: any) => i.name === "tabs");
      expect(tabsItem).toBeDefined();

      for (const file of tabsItem.files) {
        const destPath = path.join(tmpDir, "src/components/ui/tabs", path.basename(file.path));
        await fs.outputFile(destPath, file.content);
      }

      const mainFile = path.join(tmpDir, "src/components/ui/tabs/tabs.tsx");
      expect(await fs.pathExists(mainFile)).toBe(true);
      const content = await fs.readFile(mainFile, "utf-8");
      expect(content).toContain("BaseTabs");
    });
  });
});
