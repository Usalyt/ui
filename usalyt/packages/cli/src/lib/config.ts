import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const CONFIG_FILE = "usalyt.json";

export interface UsalytConfig {
  style?: string;
  rsc?: boolean;
  tsx?: boolean;
  tailwind?: {
    config?: string;
    css?: string;
    baseColor?: string;
  };
  aliases: {
    components: string;
    utils: string;
  };
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

/**
 * Aliases are root-relative destinations. A leading `@/` or `~/` is accepted
 * for readability and is equivalent to the consumer root. The CLI rejects
 * absolute aliases and any alias that normalizes outside the root.
 */
export function defaultConfig(): UsalytConfig {
  return {
    style: "default",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "",
      css: "src/styles/globals.css",
      baseColor: "neutral",
    },
    aliases: {
      components: "@/src/components/ui",
      utils: "@/src/lib/utils",
    },
  };
}

export function configPathFor(root: string): string {
  return path.join(root, CONFIG_FILE);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireAlias(aliases: Record<string, unknown>, key: "components" | "utils"): string {
  const value = aliases[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new ConfigError(`${CONFIG_FILE} must define a non-empty "aliases.${key}" string.`);
  }
  return value;
}

/** Read `usalyt.json` from the consumer root, or return null when absent. */
export function readConfig(root: string): UsalytConfig | null {
  const configPath = configPathFor(root);
  if (!existsSync(configPath)) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new ConfigError(`${configPath} is not valid JSON: ${(error as Error).message}`);
  }
  if (!isRecord(parsed)) {
    throw new ConfigError(`${configPath} must contain a JSON object.`);
  }
  if (!isRecord(parsed.aliases)) {
    throw new ConfigError(`${configPath} must contain an "aliases" object.`);
  }

  const defaults = defaultConfig();
  return {
    style: typeof parsed.style === "string" ? parsed.style : defaults.style,
    rsc: typeof parsed.rsc === "boolean" ? parsed.rsc : defaults.rsc,
    tsx: typeof parsed.tsx === "boolean" ? parsed.tsx : defaults.tsx,
    tailwind: isRecord(parsed.tailwind)
      ? {
          config:
            typeof parsed.tailwind.config === "string" ? parsed.tailwind.config : defaults.tailwind!.config,
          css: typeof parsed.tailwind.css === "string" ? parsed.tailwind.css : defaults.tailwind!.css,
          baseColor:
            typeof parsed.tailwind.baseColor === "string"
              ? parsed.tailwind.baseColor
              : defaults.tailwind!.baseColor,
        }
      : defaults.tailwind,
    aliases: {
      components: requireAlias(parsed.aliases, "components"),
      utils: requireAlias(parsed.aliases, "utils"),
    },
  };
}

export function serializeConfig(config: UsalytConfig): string {
  return `${JSON.stringify(config, null, 2)}\n`;
}
