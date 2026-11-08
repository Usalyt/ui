import fs from "fs-extra";
import path from "node:path";

export const REGISTRY_NAME = "usalyt";
export const REGISTRY_VERSION = "0.0.1";
export const REGISTRY_LICENSE = "GPL-3.0-only";
export const REGISTRY_SCHEMA_REFERENCE = "./schema/registry.schema.json";
export const REGISTRY_REPOSITORY = {
  type: "git",
  url: "git+https://github.com/Usalyt/ui.git",
  directory: "usalyt/packages/registry",
} as const;

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
  $schema: string;
  name: string;
  version: string;
  license: string;
  repository: typeof REGISTRY_REPOSITORY;
  dependencyLicenses: Record<string, string>;
  items: RegistryItem[];
}

export interface RegistryBuildStats {
  primitives: number;
  blocks: number;
  libraries: number;
  items: number;
}

export interface RegistryBuildResult {
  registry: Registry;
  json: string;
  stats: RegistryBuildStats;
}

export interface RegistryBuildOptions {
  /** UI source root that contains `components/`, `blocks/`, and `lib/`. */
  sourceRoot: string;
  /** Root of the `@usalyt/registry` package, used for the notices file. */
  packageRoot: string;
}

interface UiPackageManifest {
  name?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

const IMPORT_PATTERN =
  /(?:import|export)\s+(?:[^"'()]*?\s+from\s+)?["']([^"']+)["']/g;

const RUNTIME_PEERS = new Set(["react", "react-dom"]);

const posix = path.posix;

function toTitle(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function extractSpecifiers(content: string): string[] {
  const specifiers = new Set<string>();
  for (const match of content.matchAll(IMPORT_PATTERN)) {
    specifiers.add(match[1]);
  }
  return [...specifiers];
}

function packageNameFromSpecifier(specifier: string): string | null {
  if (specifier.startsWith(".") || specifier.startsWith("node:")) {
    return null;
  }
  const root = specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];
  if (RUNTIME_PEERS.has(root)) {
    return null;
  }
  return root;
}

function isItemSourceFile(fileName: string): boolean {
  if (fileName.endsWith(".test.ts") || fileName.endsWith(".test.tsx")) {
    return false;
  }
  if (fileName.endsWith(".stories.ts") || fileName.endsWith(".stories.tsx")) {
    return false;
  }
  return fileName.endsWith(".ts") || fileName.endsWith(".tsx");
}

async function listItemDirectories(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function readItemFiles(
  sourceRoot: string,
  kind: "components" | "blocks",
  itemName: string,
  type: string
): Promise<RegistryFile[]> {
  const itemDir = path.join(sourceRoot, kind, itemName);
  const fileNames = (await fs.readdir(itemDir))
    .filter(isItemSourceFile)
    .sort();

  const files: RegistryFile[] = [];
  for (const fileName of fileNames) {
    files.push({
      path: `${kind}/${itemName}/${fileName}`,
      type,
      content: await fs.readFile(path.join(itemDir, fileName), "utf-8"),
    });
  }

  return files;
}

function sourcePathFor(
  itemName: string,
  fileName: string,
  kind: "components" | "blocks"
): string {
  return `${kind}/${itemName}/${fileName}`;
}

function resolveRelativeImport(
  sourcePath: string,
  specifier: string,
  knownPaths: Set<string>
): string | null {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const base = posix.normalize(
    posix.join(posix.dirname(sourcePath), specifier)
  );
  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
  ];

  return candidates.find((candidate) => knownPaths.has(candidate)) ?? null;
}

function sortedRecord(entries: Iterable<[string, string]>): Record<string, string> {
  return Object.fromEntries(
    [...entries].sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
  );
}

async function readUiPackageManifest(
  sourceRoot: string
): Promise<UiPackageManifest> {
  const candidates = [
    path.resolve(sourceRoot, "..", "package.json"),
    path.resolve(sourceRoot, "package.json"),
  ];

  for (const candidate of candidates) {
    if (!(await fs.pathExists(candidate))) {
      continue;
    }
    const manifest = (await fs.readJson(candidate)) as UiPackageManifest;
    if (manifest.name === "@usalyt/ui" && manifest.dependencies) {
      return manifest;
    }
  }

  throw new Error(
    `Cannot find the @usalyt/ui package.json next to source root: ${sourceRoot}`
  );
}

async function readNoticeLicenses(
  packageRoot: string
): Promise<Record<string, string>> {
  const noticesPath = path.join(packageRoot, "THIRD_PARTY_NOTICES.md");
  if (!(await fs.pathExists(noticesPath))) {
    throw new Error(`Third-party notices file not found: ${noticesPath}`);
  }

  const licenses: Record<string, string> = {};
  const text = await fs.readFile(noticesPath, "utf-8");

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trimEnd();
    const match = line.match(/^\| `([^`]+)` \| [^|]+ \| ([^|]+) \|$/);
    if (match) {
      licenses[match[1]] = match[2].trim();
    }
  }

  return licenses;
}

function buildDependencyLicenses(
  directDependencyNames: string[],
  notices: Record<string, string>
): Record<string, string> {
  const entries: Array<[string, string]> = [];
  const missing: string[] = [];

  for (const name of directDependencyNames) {
    const license = notices[name];
    if (!license) {
      missing.push(name);
      continue;
    }
    entries.push([name, license]);
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing audited licenses in THIRD_PARTY_NOTICES.md for: ${missing.join(", ")}`
    );
  }

  return sortedRecord(entries);
}

/**
 * Builds the registry data from an explicit UI source root. The function only
 * reads files below `sourceRoot` and the package-local notices file, and it
 * never records absolute paths or timestamps.
 */
export async function buildRegistry(
  options: RegistryBuildOptions
): Promise<RegistryBuildResult> {
  const sourceRoot = path.resolve(options.sourceRoot);
  const componentsDir = path.join(sourceRoot, "components");
  const blocksDir = path.join(sourceRoot, "blocks");
  const utilsPath = path.join(sourceRoot, "lib", "utils.ts");

  if (!(await fs.pathExists(componentsDir))) {
    throw new Error(`UI source root not found or incomplete: ${sourceRoot}`);
  }
  if (!(await fs.pathExists(blocksDir))) {
    throw new Error(`UI blocks directory not found: ${blocksDir}`);
  }
  if (!(await fs.pathExists(utilsPath))) {
    throw new Error(`Shared utils source not found: ${utilsPath}`);
  }

  const uiPackage = await readUiPackageManifest(sourceRoot);
  const declaredVersions: Record<string, string> = {
    ...(uiPackage.dependencies ?? {}),
    ...(uiPackage.peerDependencies ?? {}),
  };

  const primitiveNames = await listItemDirectories(componentsDir);
  const blockNames = await listItemDirectories(blocksDir);

  const sourceIndex = new Map<string, string>();
  for (const name of primitiveNames) {
    for (const fileName of (await fs.readdir(path.join(componentsDir, name))).sort()) {
      if (isItemSourceFile(fileName)) {
        sourceIndex.set(sourcePathFor(name, fileName, "components"), name);
      }
    }
  }
  for (const name of blockNames) {
    for (const fileName of (await fs.readdir(path.join(blocksDir, name))).sort()) {
      if (isItemSourceFile(fileName)) {
        sourceIndex.set(sourcePathFor(name, fileName, "blocks"), name);
      }
    }
  }
  sourceIndex.set("lib/utils.ts", "utils");

  const knownPaths = new Set(sourceIndex.keys());

  const registryDependenciesFor = (itemName: string, files: RegistryFile[]): string[] => {
    const dependencies = new Set<string>();
    for (const file of files) {
      for (const specifier of extractSpecifiers(file.content)) {
        const resolved = resolveRelativeImport(file.path, specifier, knownPaths);
        if (!resolved) {
          continue;
        }
        const dependency = sourceIndex.get(resolved);
        if (dependency && dependency !== itemName) {
          dependencies.add(dependency);
        }
      }
    }
    return [...dependencies].sort();
  };

  const dependencyVersionsFor = (
    itemName: string,
    files: RegistryFile[]
  ): { dependencies: string[]; dependencyVersions: Record<string, string> } => {
    const dependencies = new Set<string>();

    for (const file of files) {
      for (const specifier of extractSpecifiers(file.content)) {
        const packageName = packageNameFromSpecifier(specifier);
        if (!packageName) {
          continue;
        }
        if (!declaredVersions[packageName]) {
          throw new Error(
            `${itemName}: imported package "${packageName}" is not declared by @usalyt/ui`
          );
        }
        dependencies.add(packageName);
      }
    }

    const sortedDependencies = [...dependencies].sort();
    return {
      dependencies: sortedDependencies,
      dependencyVersions: sortedRecord(
        sortedDependencies.map((name) => [name, declaredVersions[name]])
      ),
    };
  };

  const items: RegistryItem[] = [];

  for (const name of primitiveNames) {
    const files = await readItemFiles(sourceRoot, "components", name, "registry:ui");
    const title = toTitle(name);
    const { dependencies, dependencyVersions } = dependencyVersionsFor(name, files);

    items.push({
      name,
      type: "registry:ui",
      title,
      description: `Accessible ${title} primitive component built with Base UI and Tailwind v4.`,
      license: REGISTRY_LICENSE,
      dependencies,
      devDependencies: [],
      registryDependencies: registryDependenciesFor(name, files),
      dependencyVersions,
      files,
    });
  }

  for (const name of blockNames) {
    const files = await readItemFiles(sourceRoot, "blocks", name, "registry:block");
    const title = toTitle(name);
    const { dependencies, dependencyVersions } = dependencyVersionsFor(name, files);

    items.push({
      name,
      type: "registry:block",
      title: `${title} Block`,
      description: `Composed ${title} block built from Usalyt primitives, Base UI and Tailwind v4.`,
      license: REGISTRY_LICENSE,
      dependencies,
      devDependencies: [],
      registryDependencies: registryDependenciesFor(name, files),
      dependencyVersions,
      files,
    });
  }

  const utilsFiles: RegistryFile[] = [
    {
      path: "lib/utils.ts",
      type: "registry:lib",
      content: await fs.readFile(utilsPath, "utf-8"),
    },
  ];
  const utilsDependencies = dependencyVersionsFor("utils", utilsFiles);

  items.push({
    name: "utils",
    type: "registry:lib",
    title: "Utils",
    description: "Shared cn() class merge utility for Usalyt components.",
    license: REGISTRY_LICENSE,
    dependencies: utilsDependencies.dependencies,
    devDependencies: [],
    registryDependencies: registryDependenciesFor("utils", utilsFiles),
    dependencyVersions: utilsDependencies.dependencyVersions,
    files: utilsFiles,
  });

  items.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0));

  const notices = await readNoticeLicenses(options.packageRoot);
  const directDependencyNames = [
    ...new Set([
      ...Object.keys(uiPackage.dependencies ?? {}),
      ...Object.keys(uiPackage.peerDependencies ?? {}),
    ]),
  ].sort();

  const registry: Registry = {
    $schema: REGISTRY_SCHEMA_REFERENCE,
    name: REGISTRY_NAME,
    version: REGISTRY_VERSION,
    license: REGISTRY_LICENSE,
    repository: REGISTRY_REPOSITORY,
    dependencyLicenses: buildDependencyLicenses(directDependencyNames, notices),
    items,
  };

  return {
    registry,
    json: `${JSON.stringify(registry, null, 2)}\n`,
    stats: {
      primitives: primitiveNames.length,
      blocks: blockNames.length,
      libraries: 1,
      items: items.length,
    },
  };
}
