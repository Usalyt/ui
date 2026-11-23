import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { defineCommand } from "citty";
import { readConfig, defaultConfig, type UsalytConfig } from "../lib/config";
import {
  buildInstallPlan,
  UnknownItemsError,
  UnsupportedItemError,
  type InstallPlan,
} from "../lib/install";
import { printError } from "../lib/output";
import { UnsafePathError } from "../lib/paths";
import { loadRegistry, RegistryLoadError, type Registry } from "../lib/registry";

function normalizePositionals(values: unknown[]): string[] {
  const names = values
    .map((value) => String(value))
    .flatMap((value) => value.split(/\s+/))
    .map((value) => value.trim())
    .filter(Boolean);
  return [...new Set(names)];
}

async function confirmInstall(command: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`Run "${command}" now? (y/N): `);
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}

function runPnpmAdd(root: string, dependencies: string[]): void {
  const result = spawnSync("pnpm", ["add", ...dependencies], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.error) {
    printError(`could not run pnpm: ${result.error.message}`);
    return;
  }
  if (result.status !== 0) {
    printError(`pnpm add exited with status ${String(result.status)}.`);
  }
}

export const addCommand = defineCommand({
  meta: {
    name: "add",
    description: "Add registry components and their dependencies to your project",
  },
  args: {
    components: {
      type: "positional",
      description: "Name of the component(s) to add",
      required: false,
    },
    all: {
      type: "boolean",
      description: "Add every item in the registry",
      alias: "a",
    },
    yes: {
      type: "boolean",
      description: "Confirm dependency installation without prompting",
      alias: "y",
    },
    overwrite: {
      type: "boolean",
      description: "Replace existing files",
      alias: "o",
    },
    install: {
      type: "boolean",
      description: "Run the printed pnpm add command when consent is confirmed",
    },
  },
  async run({ args }) {
    const root = process.cwd();

    let registry: Registry;
    try {
      ({ registry } = loadRegistry());
    } catch (error) {
      printError(error instanceof RegistryLoadError ? error.message : String(error));
      return;
    }

    const positionals = Array.isArray(args._) ? (args._ as unknown[]) : [];
    const targets = args.all
      ? [...registry.items.map((item) => item.name)].sort()
      : normalizePositionals(positionals);

    if (targets.length === 0) {
      printError(
        "no components specified. Pass one or more component names or --all."
      );
      return;
    }

    let config: UsalytConfig;
    try {
      config = readConfig(root) ?? defaultConfig();
    } catch (error) {
      printError((error as Error).message);
      return;
    }

    let plan: InstallPlan;
    try {
      plan = buildInstallPlan({
        registry,
        config,
        root,
        targets,
        overwrite: Boolean(args.overwrite),
      });
    } catch (error) {
      if (error instanceof UnknownItemsError) {
        printError(`${error.message}.`);
        console.error('Run "usalyt list" to see the available components.');
      } else if (error instanceof UnsafePathError) {
        printError(error.message);
      } else if (error instanceof UnsupportedItemError) {
        printError(error.message);
      } else {
        printError((error as Error).message);
      }
      console.error("No files were written.");
      return;
    }

    if (plan.conflicts.length > 0) {
      printError("refusing to overwrite existing files without --overwrite:");
      for (const conflict of plan.conflicts) {
        console.error(`  - ${conflict}`);
      }
      console.error("No files were written.");
      return;
    }

    try {
      for (const write of plan.writes) {
        mkdirSync(path.dirname(write.destination), { recursive: true });
        writeFileSync(write.destination, write.content, "utf8");
      }
    } catch (error) {
      printError(
        `could not write the planned files: ${(error as Error).message}. Some files may already have been written.`
      );
      return;
    }

    const installedItems = new Set(plan.writes.map((write) => write.item)).size;
    const dependencyCount = installedItems - targets.length;

    console.log(
      `Installed ${installedItems} item(s) (${targets.length} requested, ${dependencyCount} registry dependencies):`
    );
    for (const write of plan.writes) {
      console.log(`  + ${write.relativeDestination}`);
    }

    if (plan.dependencies.length === 0) {
      console.log("No npm dependencies required.");
      return;
    }

    const installCommand = `pnpm add ${plan.dependencies.join(" ")}`;
    console.log(`Dependencies: ${installCommand}`);

    if (!args.install) {
      console.log(
        "Dependencies were not installed. Run the command above, or pass --install --yes to execute it."
      );
      return;
    }

    if (!args.yes) {
      if (process.stdin.isTTY && process.stdout.isTTY) {
        if (await confirmInstall(installCommand)) {
          runPnpmAdd(root, plan.dependencies);
        } else {
          console.log("Dependencies were not installed.");
        }
      } else {
        console.log(
          "Dependencies were not installed because consent was not confirmed. Pass --yes to execute the printed command."
        );
      }
      return;
    }

    runPnpmAdd(root, plan.dependencies);
  },
});
