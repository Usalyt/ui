import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RegistryFile {
  path: string;
  type: string;
  content: string;
}

interface RegistryItem {
  name: string;
  type: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

const RELATIVE_IMPORT_PATTERN = /(\bfrom\s*|\bimport\s*)(["'])([^"']+)\2/g;

function sourcePathFor(item: RegistryItem, file: RegistryFile): string {
  if (item.name === "utils") {
    return "lib/utils.ts";
  }
  const fileName = path.posix.basename(file.path);
  return item.type === "registry:block"
    ? `blocks/${item.name}/${fileName}`
    : `components/${item.name}/${fileName}`;
}

function resolveSourceFile(
  sourcePath: string,
  specifier: string,
  knownSources: Set<string>
): string | null {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const base = path.posix.normalize(
    path.posix.join(path.posix.dirname(sourcePath), specifier)
  );
  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
  ];

  return candidates.find((candidate) => knownSources.has(candidate)) ?? null;
}

function rewriteImports(
  content: string,
  sourcePath: string,
  destPath: string,
  sourceToDest: Map<string, string>
): string {
  const knownSources = new Set(sourceToDest.keys());

  return content.replace(
    RELATIVE_IMPORT_PATTERN,
    (match, prefix: string, quote: string, specifier: string) => {
      const resolved = resolveSourceFile(sourcePath, specifier, knownSources);
      if (!resolved) {
        return match;
      }

      const targetDest = sourceToDest.get(resolved);
      if (!targetDest) {
        return match;
      }

      let relative = path
        .relative(path.dirname(destPath), targetDest)
        .split(path.sep)
        .join("/");

      relative = relative.replace(/\.(tsx?|jsx?)$/, "");
      relative = relative.replace(/\/index$/, "");

      if (!relative.startsWith(".")) {
        relative = `./${relative}`;
      }

      return `${prefix}${quote}${relative}${quote}`;
    }
  );
}

export const addCommand = defineCommand({
  meta: {
    name: "add",
    description: "Add a component to your project codebase"
  },
  args: {
    components: {
      type: "positional",
      description: "Name of the component(s) to add",
      required: false
    },
    all: {
      type: "boolean",
      description: "Add all available components",
      alias: "a"
    }
  },
  async run({ args }) {
    p.intro(pc.bgCyan(pc.black(" tu-ui add ")));

    let registryPath = path.resolve(__dirname, "../../registry/registry.json");
    if (!(await fs.pathExists(registryPath))) {
      registryPath = path.resolve(process.cwd(), "packages/registry/registry.json");
    }

    if (!(await fs.pathExists(registryPath))) {
      p.outro(pc.red("Error: Registry JSON not found. Run `pnpm build:registry` first."));
      process.exitCode = 1;
      return;
    }

    const registry = await fs.readJson(registryPath);
    const availableItems: RegistryItem[] = registry.items || [];
    const itemsByName = new Map(availableItems.map((item) => [item.name, item]));

    let targets: string[] = [];

    if (args.all) {
      targets = availableItems.map((i) => i.name);
    } else {
      const positionals = [args.components, ...(args._ || [])].filter(Boolean);
      if (positionals.length > 0) {
        targets = positionals.flatMap((p) => String(p).split(/\s+/));
      } else {
        const selected = await p.multiselect({
          message: "Select components to install:",
          options: availableItems.map((i) => ({
            value: i.name,
            label: i.name,
            hint: i.description
          }))
        });
        if (p.isCancel(selected)) {
          p.cancel("Operation cancelled.");
          process.exit(0);
        }
        targets = selected as string[];
      }
    }

    targets = [...new Set(targets.filter(Boolean))];

    const cwd = process.cwd();
    const configPath = path.join(cwd, "tu-ui.json");
    let relativeTarget = "src/components/ui";
    let relativeUtils = "src/lib/utils.ts";

    if (await fs.pathExists(configPath)) {
      const config = await fs.readJson(configPath);
      if (config.aliases?.components) {
        relativeTarget = config.aliases.components.replace(/^@\//, "");
      }
      if (config.aliases?.utils) {
        relativeUtils = config.aliases.utils.replace(/^@\//, "");
      }
    }

    if (!relativeUtils.endsWith(".ts") && !relativeUtils.endsWith(".tsx")) {
      relativeUtils = `${relativeUtils}.ts`;
    }

    const targetDir = path.resolve(cwd, relativeTarget);
    const utilsDest = path.resolve(cwd, relativeUtils);

    const requested = targets;
    const skipped = requested.filter((name) => !itemsByName.has(name));
    const requestedResolved = requested.filter((name) => itemsByName.has(name));

    const plan: string[] = [];
    const planned = new Set<string>();

    const collect = (name: string) => {
      if (planned.has(name)) {
        return;
      }
      const item = itemsByName.get(name);
      if (!item) {
        return;
      }
      planned.add(name);
      for (const dependency of item.registryDependencies ?? []) {
        if (itemsByName.has(dependency)) {
          collect(dependency);
        }
      }
      plan.push(name);
    };

    for (const name of requestedResolved) {
      collect(name);
    }

    const spinner = p.spinner();
    spinner.start("Installing components...");

    if (requestedResolved.length === 0) {
      spinner.stop(pc.red("No components were installed."));
      for (const name of skipped) {
        p.log.warn(`Component '${name}' not found in registry. Skipping.`);
      }
      p.outro(
        pc.red(
          "Component installation failed: no requested component exists in the registry."
        )
      );
      process.exitCode = 1;
      return;
    }

    const sourceToDest = new Map<string, string>();

    for (const name of plan) {
      const item = itemsByName.get(name)!;
      for (const file of item.files) {
        const destPath =
          name === "utils"
            ? utilsDest
            : path.join(targetDir, name, path.basename(file.path));
        sourceToDest.set(sourcePathFor(item, file), destPath);
      }
    }

    for (const name of plan) {
      const item = itemsByName.get(name)!;
      for (const file of item.files) {
        const destPath = sourceToDest.get(sourcePathFor(item, file))!;
        const content =
          file.path.endsWith(".ts") || file.path.endsWith(".tsx")
            ? rewriteImports(
                file.content,
                sourcePathFor(item, file),
                destPath,
                sourceToDest
              )
            : file.content;
        await fs.outputFile(destPath, content);
      }
    }

    const dependencyCount = plan.length - requestedResolved.length;

    spinner.stop(
      pc.green(
        `Installed ${plan.length} item(s) (${requestedResolved.length} requested, ${dependencyCount} dependencies) to ${targetDir}`
      )
    );

    for (const name of skipped) {
      p.log.warn(`Component '${name}' not found in registry. Skipping.`);
    }

    if (skipped.length > 0) {
      p.outro(
        pc.yellow(
          `✔ Installed ${requestedResolved.length} of ${requested.length} requested component(s).`
        )
      );
      return;
    }

    p.outro(pc.green("✔ Component installation complete!"));
  }
});
