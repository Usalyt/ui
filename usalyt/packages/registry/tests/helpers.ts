import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";

export const packageRoot = fileURLToPath(new URL("..", import.meta.url));
export const scriptPath = path.join(packageRoot, "scripts", "build-registry.ts");
export const schemaPath = path.join(packageRoot, "schema", "registry.schema.json");
export const committedRegistryPath = path.join(packageRoot, "registry.json");
export const noticesPath = path.join(packageRoot, "THIRD_PARTY_NOTICES.md");
export const uiPackageRoot = path.resolve(packageRoot, "../ui");
export const uiSourceRoot = path.join(uiPackageRoot, "src");
export const uiPackageJsonPath = path.join(uiPackageRoot, "package.json");

/**
 * Absolute URL of the tsx loader. Resolving it from this test module keeps
 * `node --import <loader>` usable from any working directory.
 */
export const tsxLoader = import.meta.resolve("tsx");

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

export interface ValidationResult {
  valid: boolean;
  errors: unknown[];
}

export function validateRegistry(data: unknown): ValidationResult {
  const valid = validate(data);
  return { valid, errors: valid ? [] : [...(validate.errors ?? [])] };
}

export function makeScratchDir(prefix: string): string {
  const dir = path.join(
    packageRoot,
    ".tmp",
    "tests",
    `${prefix}-${Date.now()}-${process.pid}`
  );
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export interface GeneratorResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

export function runGenerator(
  args: string[],
  options: { cwd?: string; env?: Record<string, string> } = {}
): GeneratorResult {
  const result = spawnSync(
    process.execPath,
    ["--import", tsxLoader, scriptPath, ...args],
    {
      cwd: options.cwd ?? packageRoot,
      encoding: "utf8",
      env: { ...process.env, ...(options.env ?? {}) },
    }
  );

  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

export function listSourceItemNames(root: string): string[] {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function readUiPackageJson(): {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
} {
  return JSON.parse(fs.readFileSync(uiPackageJsonPath, "utf8"));
}

/** Parses the audited package/license table from the workspace notices. */
export function readNoticeLicenses(): Record<string, string> {
  const text = fs.readFileSync(noticesPath, "utf8");
  const licenses: Record<string, string> = {};

  for (const line of text.split("\n")) {
    const match = line.match(/^\| `([^`]+)` \| [^|]+ \| ([^|]+) \|$/);
    if (match) {
      licenses[match[1]] = match[2].trim();
    }
  }

  return licenses;
}

const IMPORT_PATTERN =
  /(?:import|export)\s+(?:[^"'()]*?\s+from\s+)?["']([^"']+)["']/g;

export function extractSpecifiers(content: string): string[] {
  const specifiers = new Set<string>();
  for (const match of content.matchAll(IMPORT_PATTERN)) {
    specifiers.add(match[1]);
  }
  return [...specifiers];
}

export const RUNTIME_PEERS = new Set(["react", "react-dom"]);

/** Returns the npm package name for an external specifier, or null. */
export function externalPackageName(specifier: string): string | null {
  if (specifier.startsWith(".") || specifier.startsWith("node:")) {
    return null;
  }
  if (RUNTIME_PEERS.has(specifier.split("/")[0]) || specifier.startsWith("react/") || specifier.startsWith("react-dom/")) {
    return null;
  }
  if (specifier.startsWith("@")) {
    return specifier.split("/").slice(0, 2).join("/");
  }
  return specifier.split("/")[0];
}

const posix = path.posix;

/** Resolves a relative import against a set of registry source paths. */
export function resolveRegistrySource(
  sourcePath: string,
  specifier: string,
  knownPaths: Set<string>
): string | null {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const base = posix.normalize(posix.join(posix.dirname(sourcePath), specifier));
  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
  ];

  return candidates.find((candidate) => knownPaths.has(candidate)) ?? null;
}
