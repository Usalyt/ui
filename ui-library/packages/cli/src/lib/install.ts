import { lstatSync, realpathSync } from "node:fs";
import path from "node:path";
import type { UsalytConfig } from "./config";
import { rewriteRelativeImports } from "./imports";
import { assertWithinRoot, isWithinRoot, resolveAliasWithinRoot, UnsafePathError } from "./paths";
import type { Registry, RegistryItem } from "./registry";

export class UnknownItemsError extends Error {
  readonly names: string[];

  constructor(names: string[]) {
    super(`unknown component(s): ${names.join(", ")}`);
    this.name = "UnknownItemsError";
    this.names = names;
  }
}

export class UnsupportedItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedItemError";
  }
}

export interface PlannedWrite {
  item: string;
  destination: string;
  relativeDestination: string;
  content: string;
}

export interface InstallPlan {
  writes: PlannedWrite[];
  dependencies: string[];
  conflicts: string[];
}

const SAFE_ITEM_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_FILE_BASENAME = /^[A-Za-z0-9._-]+$/;
const REWRITE_EXTENSIONS = /\.(tsx?|jsx?|mts?|cts?)$/;

function collectRegistryDependencies(
  targets: string[],
  itemsByName: ReadonlyMap<string, RegistryItem>
): string[] {
  const planned = new Set<string>();
  const ordered: string[] = [];

  const visit = (name: string): void => {
    if (planned.has(name)) {
      return;
    }
    const item = itemsByName.get(name);
    if (!item) {
      return;
    }
    planned.add(name);
    for (const dependency of [...item.registryDependencies].sort()) {
      visit(dependency);
    }
    ordered.push(name);
  };

  for (const target of targets) {
    visit(target);
  }
  return ordered;
}

function relativeDisplayPath(root: string, destination: string): string {
  return path.relative(root, destination).split(path.sep).join("/");
}

function extensionOf(alias: string): string {
  return path.extname(alias);
}

/**
 * Build every destination and its rewritten content before touching the
 * filesystem. Unknown items, unsafe destinations, directory collisions, and
 * conflicts are all detected here so a rejected request writes nothing.
 */
export function buildInstallPlan(options: {
  registry: Registry;
  config: UsalytConfig;
  root: string;
  targets: string[];
  overwrite: boolean;
}): InstallPlan {
  const { registry, config, root, targets, overwrite } = options;
  const itemsByName = new Map(registry.items.map((item) => [item.name, item]));
  const unknown = targets.filter((target) => !itemsByName.has(target));
  if (unknown.length > 0) {
    throw new UnknownItemsError(unknown);
  }

  const plannedNames = collectRegistryDependencies(targets, itemsByName);
  const componentsDir = resolveAliasWithinRoot(root, config.aliases.components, "components");

  const utilsAlias = config.aliases.utils;
  let utilsDestination = resolveAliasWithinRoot(root, utilsAlias, "utils");
  const utilsExtension = extensionOf(utilsAlias);
  if (utilsExtension === "") {
    utilsDestination = `${utilsDestination}.ts`;
    assertWithinRoot(root, utilsDestination, "utils");
  }

  const sourceToDest = new Map<string, string>();
  const destinationOwner = new Map<string, string>();

  for (const name of plannedNames) {
    const item = itemsByName.get(name)!;
    if (!SAFE_ITEM_NAME.test(item.name)) {
      throw new UnsupportedItemError(
        `Registry item "${item.name}" has an unsafe name and cannot be installed.`
      );
    }

    for (const file of item.files) {
      const baseName = path.posix.basename(file.path);
      if (!SAFE_FILE_BASENAME.test(baseName) || baseName === "." || baseName === "..") {
        throw new UnsupportedItemError(
          `Registry item "${item.name}" contains an unsafe file path: ${file.path}`
        );
      }

      let destination: string;
      if (file.path.startsWith("lib/")) {
        if (item.name !== "utils") {
          throw new UnsupportedItemError(
            `Registry item "${item.name}" targets the shared lib directory, which is reserved for the "utils" item.`
          );
        }
        destination = utilsDestination;
      } else {
        destination = path.join(componentsDir, item.name, baseName);
      }

      assertWithinRoot(root, destination, `"${item.name}"`);

      const owner = destinationOwner.get(destination);
      if (owner !== undefined && owner !== file.path) {
        throw new UnsupportedItemError(
          `Registry files "${owner}" and "${file.path}" resolve to the same destination: ${destination}`
        );
      }
      destinationOwner.set(destination, file.path);
      sourceToDest.set(file.path, destination);
    }
  }

  const conflicts: string[] = [];
  for (const destination of destinationOwner.keys()) {
    let entry;
    try {
      entry = lstatSync(destination);
    } catch {
      continue;
    }

    if (entry.isSymbolicLink()) {
      let realDestination: string;
      try {
        realDestination = realpathSync(destination);
      } catch {
        throw new UnsupportedItemError(
          `Cannot write "${destination}" because it is a symbolic link with a missing target.`
        );
      }
      const realRoot = realpathSync(root);
      if (!isWithinRoot(realRoot, realDestination)) {
        throw new UnsafePathError(
          destinationOwner.get(destination) ?? "destination",
          destination,
          `The destination "${destination}" resolves outside the consumer root ${root} through a symbolic link.`
        );
      }
    }

    if (entry.isDirectory()) {
      throw new UnsupportedItemError(
        `Cannot write "${destination}" because a directory already exists at that path.`
      );
    }
    if (!overwrite) {
      conflicts.push(relativeDisplayPath(root, destination));
    }
  }

  const writes: PlannedWrite[] = [];
  for (const name of plannedNames) {
    const item = itemsByName.get(name)!;
    for (const file of item.files) {
      const destination = sourceToDest.get(file.path)!;
      const content = REWRITE_EXTENSIONS.test(file.path)
        ? rewriteRelativeImports({
            content: file.content,
            sourcePath: file.path,
            destPath: destination,
            sourceToDest,
          })
        : file.content;
      writes.push({
        item: item.name,
        destination,
        relativeDestination: relativeDisplayPath(root, destination),
        content,
      });
    }
  }

  const dependencies = new Set<string>();
  for (const name of plannedNames) {
    const item = itemsByName.get(name)!;
    for (const dependency of item.dependencies) {
      dependencies.add(dependency);
    }
  }

  return {
    writes,
    dependencies: [...dependencies].sort(),
    conflicts: conflicts.sort(),
  };
}
