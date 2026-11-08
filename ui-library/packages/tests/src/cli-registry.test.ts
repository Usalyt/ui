import { describe, it, expect, beforeAll } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, "../../cli/dist/index.mjs");
const registryPath = path.resolve(__dirname, "../../registry/registry.json");
const scratchRoot = path.resolve(__dirname, "../.tmp/cli-registry");

function runCli(cwd: string, args: string[]) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      NO_COLOR: "1",
      FORCE_COLOR: "0",
      CI: "1",
    },
  });
}

function createConsumer(name: string) {
  const dir = fs.mkdtempSync(path.join(scratchRoot, `${name}-`));
  fs.writeFileSync(
    path.join(dir, "usalyt.json"),
    JSON.stringify(
      {
        aliases: {
          components: "@/src/components/ui",
          utils: "@/src/lib/utils",
        },
      },
      null,
      2
    )
  );
  return dir;
}

beforeAll(() => {
  fs.mkdirSync(scratchRoot, { recursive: true });
});

describe("Registry distribution data", () => {
  it("includes primitives, blocks and the shared utils item", () => {
    const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    expect(registry.name).toBe("usalyt");
    expect(registry.version).toBe("0.0.1");
    expect(registry.license).toBe("GPL-3.0-only");

    const items = new Map<string, any>(
      registry.items.map((item: any) => [item.name, item])
    );

    expect(items.size).toBe(74);
    expect(items.get("utils")).toBeDefined();
    expect(items.get("utils").files[0].path).toBe("lib/utils.ts");
    expect(items.get("color-swatch")).toBeDefined();

    const authForm = items.get("auth-form");
    expect(authForm).toBeDefined();
    expect(authForm.type).toBe("registry:block");
    expect(authForm.registryDependencies).toEqual(
      expect.arrayContaining(["button", "card", "form", "input"])
    );
    expect(authForm.dependencies).toEqual(
      expect.arrayContaining(["react-hook-form", "zod", "@hookform/resolvers"])
    );

    const form = items.get("form");
    expect(form.registryDependencies).toEqual(
      expect.arrayContaining(["label"])
    );

    const rating = items.get("rating");
    expect(rating.dependencies).toEqual(
      expect.arrayContaining(["lucide-react"])
    );
  });
});

describe("usalyt add in an isolated consumer", () => {
  it("installs a block with its primitive and utils dependencies", () => {
    const consumer = createConsumer("block");
    const result = runCli(consumer, ["add", "auth-form"]);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).toBe(0);
    expect(output).toContain("Installed");

    const componentDir = path.join(consumer, "src/components/ui");
    for (const name of [
      "auth-form",
      "button",
      "card",
      "form",
      "input",
      "label",
    ]) {
      expect(fs.existsSync(path.join(componentDir, name))).toBe(true);
    }
    expect(fs.existsSync(path.join(consumer, "src/lib/utils.ts"))).toBe(true);

    const authFormSource = fs.readFileSync(
      path.join(componentDir, "auth-form/auth-form.tsx"),
      "utf8"
    );
    expect(authFormSource).toContain('from "../button"');
    expect(authFormSource).toContain('from "../card"');
    expect(authFormSource).toContain('from "../form"');
    expect(authFormSource).toContain('from "../input"');
    expect(authFormSource).not.toContain('from "../../components/');

    const formSource = fs.readFileSync(
      path.join(componentDir, "form/form.tsx"),
      "utf8"
    );
    expect(formSource).toContain('from "../label"');
    expect(formSource).toContain('from "../../../lib/utils"');
  });

  it("reports unknown components truthfully and writes nothing", () => {
    const consumer = createConsumer("unknown");
    const result = runCli(consumer, ["add", "does-not-exist"]);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(output).toContain("does-not-exist");
    expect(fs.existsSync(path.join(consumer, "src"))).toBe(false);
  });
});
