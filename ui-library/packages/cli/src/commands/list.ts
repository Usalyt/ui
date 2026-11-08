import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "List all available components in the tu-ui registry",
  },
  async run() {
    p.intro(pc.bgCyan(pc.black(" tu-ui list ")));

    let registryPath = path.resolve(__dirname, "../../registry/registry.json");
    if (!(await fs.pathExists(registryPath))) {
      registryPath = path.resolve(
        process.cwd(),
        "packages/registry/registry.json",
      );
    }

    if (!(await fs.pathExists(registryPath))) {
      p.outro(
        pc.yellow(
          "Registry not found locally. Run `pnpm build:registry` first.",
        ),
      );
      return;
    }

    const registry = await fs.readJson(registryPath);
    const items = registry.items || [];

    p.note(
      items
        .map((i: any) => `${pc.bold(pc.cyan(i.name))} — ${i.description}`)
        .join("\n"),
      `Available Components (${items.length})`,
    );

    p.outro(
      pc.green(
        "Use `npx tu-ui add <component>` to add any component to your codebase.",
      ),
    );
  },
});
