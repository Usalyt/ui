import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface RegistryFile {
  path: string;
  type: string;
  content: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  license: string;
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  dependencyVersions: Record<string, string>;
  files: RegistryFile[];
}

export interface Registry {
  name: string;
  version: string;
  items: RegistryItem[];
}

export class RegistryLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryLoadError";
  }
}

const require = createRequire(import.meta.url);

/**
 * Resolve the registry through Node package resolution so the CLI works from
 * any working directory once `@usalyt/registry` is installed. The relative
 * candidates are a development-only fallback for the monorepo layout and are
 * never based on the current working directory.
 */
export function resolveRegistryPath(): string {
  try {
    return require.resolve("@usalyt/registry/registry.json");
  } catch {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const candidates = [
      path.resolve(here, "../../registry/registry.json"),
      path.resolve(here, "../registry/registry.json"),
    ];
    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }
    throw new RegistryLoadError(
      "Could not locate the packaged @usalyt/registry/registry.json. " +
        "Reinstall @usalyt/cli so its @usalyt/registry dependency is present, then retry."
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateRegistry(value: unknown, registryPath: string): Registry {
  if (!isRecord(value)) {
    throw new RegistryLoadError(`Registry at ${registryPath} is not a JSON object.`);
  }
  if (typeof value.name !== "string" || typeof value.version !== "string") {
    throw new RegistryLoadError(`Registry at ${registryPath} is missing "name" or "version".`);
  }
  if (!Array.isArray(value.items) || value.items.length === 0) {
    throw new RegistryLoadError(`Registry at ${registryPath} contains no items.`);
  }

  for (const item of value.items) {
    if (!isRecord(item) || typeof item.name !== "string" || typeof item.type !== "string") {
      throw new RegistryLoadError(`Registry at ${registryPath} contains an invalid item.`);
    }
    if (!Array.isArray(item.files) || item.files.length === 0) {
      throw new RegistryLoadError(`Registry item "${item.name}" contains no files.`);
    }
    for (const file of item.files) {
      if (!isRecord(file) || typeof file.path !== "string" || typeof file.content !== "string") {
        throw new RegistryLoadError(`Registry item "${item.name}" contains an invalid file entry.`);
      }
    }
  }

  return value as unknown as Registry;
}

export function loadRegistry(): { registry: Registry; registryPath: string } {
  const registryPath = resolveRegistryPath();
  let raw: string;
  try {
    raw = readFileSync(registryPath, "utf8");
  } catch (error) {
    throw new RegistryLoadError(
      `Could not read the packaged registry at ${registryPath}: ${(error as Error).message}`
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new RegistryLoadError(
      `The packaged registry at ${registryPath} is not valid JSON: ${(error as Error).message}`
    );
  }

  return { registry: validateRegistry(parsed, registryPath), registryPath };
}
