import { existsSync, lstatSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { defineCommand } from "citty";
import {
  CONFIG_FILE,
  configPathFor,
  defaultConfig,
  serializeConfig,
  type UsalytConfig,
} from "../lib/config";
import { printError } from "../lib/output";

function aliasFromPath(value: string, stripExtension = false): string {
  const normalized = value.trim().replace(/\\/g, "/").replace(/^\.?\//, "");
  const withoutExtension = stripExtension
    ? normalized.replace(/\.(tsx?|jsx?)$/, "")
    : normalized;
  return `@/${withoutExtension}`;
}

async function promptForConfig(defaults: UsalytConfig): Promise<UsalytConfig> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const defaultComponents = defaults.aliases.components.replace(/^@\//, "");
    const defaultUtils = `${defaults.aliases.utils.replace(/^@\//, "")}.ts`;

    const componentsAnswer = await rl.question(
      `Components directory (relative to the project root) [${defaultComponents}]: `
    );
    const utilsAnswer = await rl.question(
      `Utils file (relative to the project root) [${defaultUtils}]: `
    );

    const componentsPath = componentsAnswer.trim() || defaultComponents;
    const utilsPath = utilsAnswer.trim() || defaultUtils;

    return {
      ...defaults,
      aliases: {
        components: aliasFromPath(componentsPath),
        utils: aliasFromPath(utilsPath, true),
      },
    };
  } finally {
    rl.close();
  }
}

export const initCommand = defineCommand({
  meta: {
    name: "init",
    description: "Create usalyt.json with the component and utility aliases",
  },
  args: {
    yes: {
      type: "boolean",
      description: "Use the default aliases without prompting",
      alias: "y",
    },
    overwrite: {
      type: "boolean",
      description: "Replace an existing usalyt.json",
      alias: "o",
    },
  },
  async run({ args }) {
    const root = process.cwd();
    const configPath = configPathFor(root);

    if (existsSync(configPath) && !args.overwrite) {
      printError(
        `${CONFIG_FILE} already exists at ${configPath}. Pass --overwrite to replace it.`
      );
      return;
    }

    try {
      if (lstatSync(configPath).isSymbolicLink()) {
        printError(
          `${CONFIG_FILE} at ${configPath} is a symbolic link. Remove the link and run init again.`
        );
        return;
      }
    } catch {
      // The configuration file does not exist yet.
    }

    const defaults = defaultConfig();
    const interactive =
      !args.yes && Boolean(process.stdin.isTTY) && Boolean(process.stdout.isTTY);
    const config = interactive ? await promptForConfig(defaults) : defaults;

    try {
      writeFileSync(configPath, serializeConfig(config), "utf8");
    } catch (error) {
      printError(`could not write ${configPath}: ${(error as Error).message}`);
      return;
    }
    console.log(`Created ${CONFIG_FILE} at ${configPath}`);
    console.log(`  components: ${config.aliases.components}`);
    console.log(`  utils: ${config.aliases.utils}`);
  },
});
