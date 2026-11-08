import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "../../ui/src");
const componentsDir = path.join(srcDir, "components");
const blocksDir = path.join(srcDir, "blocks");
const utilsPath = path.join(srcDir, "lib/utils.ts");
const outputPath = path.resolve(__dirname, "../registry.json");

interface RegistryFile {
  path: string;
  type: string;
  content: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

const IMPORT_PATTERN =
  /(?:import|export)\s+(?:[^"'()]*?\s+from\s+)?["']([^"']+)["']/g;

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
  if (specifier === "react" || specifier.startsWith("react/")) {
    return null;
  }
  if (specifier === "react-dom" || specifier.startsWith("react-dom/")) {
    return null;
  }
  if (specifier.startsWith("@")) {
    return specifier.split("/").slice(0, 2).join("/");
  }
  return specifier.split("/")[0];
}

function toTitle(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function listItemDirectories(root: string): Promise<string[]> {
  if (!(await fs.pathExists(root))) {
    return [];
  }
  const entries = await fs.readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function readItemFiles(
  root: string,
  name: string,
  pathPrefix: string,
  type: string
): Promise<RegistryFile[]> {
  const itemDir = path.join(root, name);
  const fileNames = (await fs.readdir(itemDir)).sort();
  const files: RegistryFile[] = [];

  for (const fileName of fileNames) {
    if (fileName.endsWith(".test.tsx") || fileName.endsWith(".stories.tsx")) {
      continue;
    }
    const filePath = path.join(itemDir, fileName);
    if (!(await fs.stat(filePath)).isFile()) {
      continue;
    }
    files.push({
      path: `${pathPrefix}/${name}/${fileName}`,
      type,
      content: await fs.readFile(filePath, "utf-8"),
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

async function buildRegistry() {
  console.log(
    "🔨 Building registry.json from packages/ui/src/components and src/blocks..."
  );

  if (!(await fs.pathExists(componentsDir))) {
    throw new Error(`Components directory not found at: ${componentsDir}`);
  }

  const primitiveNames = await listItemDirectories(componentsDir);
  const blockNames = await listItemDirectories(blocksDir);

  const sourceFiles = new Map<string, { itemName: string; fileName: string }>();

  const collectSourceFiles = async (
    root: string,
    names: string[],
    kind: "components" | "blocks",
    pathPrefix: string
  ) => {
    for (const name of names) {
      const files = await readItemFiles(root, name, pathPrefix, "registry:ui");
      for (const file of files) {
        const fileName = path.posix.basename(file.path);
        sourceFiles.set(sourcePathFor(name, fileName, kind), {
          itemName: name,
          fileName,
        });
      }
    }
  };

  await collectSourceFiles(componentsDir, primitiveNames, "components", "components/ui");
  await collectSourceFiles(blocksDir, blockNames, "blocks", "components/ui");

  const knownSourcePaths = new Set(sourceFiles.keys());

  const resolveRelativeImport = (
    sourcePath: string,
    specifier: string
  ): string | null => {
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
    return candidates.find((candidate) => knownSourcePaths.has(candidate)) ?? null;
  };

  const registryDependenciesFor = (
    itemName: string,
    kind: "components" | "blocks",
    files: RegistryFile[]
  ): string[] => {
    const dependencies = new Set<string>(["utils"]);
    for (const file of files) {
      const sourcePath = sourcePathFor(
        itemName,
        path.posix.basename(file.path),
        kind
      );
      for (const specifier of extractSpecifiers(file.content)) {
        const resolved = resolveRelativeImport(sourcePath, specifier);
        if (!resolved) {
          continue;
        }
        const sourceFile = sourceFiles.get(resolved);
        if (sourceFile && sourceFile.itemName !== itemName) {
          dependencies.add(sourceFile.itemName);
        }
      }
    }
    return [...dependencies].sort();
  };

  const dependenciesFor = (files: RegistryFile[]): string[] => {
    const dependencies = new Set<string>();
    for (const file of files) {
      for (const specifier of extractSpecifiers(file.content)) {
        const packageName = packageNameFromSpecifier(specifier);
        if (packageName) {
          dependencies.add(packageName);
        }
      }
    }
    return [...dependencies].sort();
  };

  const items: RegistryItem[] = [];

  for (const name of primitiveNames) {
    const files = await readItemFiles(
      componentsDir,
      name,
      "components/ui",
      "registry:ui"
    );
    const title = toTitle(name);

    items.push({
      name,
      type: "registry:ui",
      title,
      description: `Accessible ${title} primitive component built with Base UI and Tailwind v4.`,
      dependencies: dependenciesFor(files),
      devDependencies: [],
      registryDependencies: registryDependenciesFor(name, "components", files),
      files,
    });
  }

  for (const name of blockNames) {
    const files = await readItemFiles(
      blocksDir,
      name,
      "components/ui",
      "registry:block"
    );
    const title = toTitle(name);

    items.push({
      name,
      type: "registry:block",
      title: `${title} Block`,
      description: `Composed ${title} block built from tu-ui primitives, Base UI and Tailwind v4.`,
      dependencies: dependenciesFor(files),
      devDependencies: [],
      registryDependencies: registryDependenciesFor(name, "blocks", files),
      files,
    });
  }

  const utilsContent = await fs.readFile(utilsPath, "utf-8");
  items.push({
    name: "utils",
    type: "registry:lib",
    title: "Utils",
    description: "Shared cn() class merge utility for tu-ui components.",
    dependencies: ["clsx", "tailwind-merge"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
        content: utilsContent,
      },
    ],
  });

  const registry: Registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "tu-ui",
    homepage: "https://tu-ui.dev",
    items,
  };

  await fs.writeJson(outputPath, registry, { spaces: 2 });
  console.log(
    `✅ Registry built successfully with ${items.length} items (${primitiveNames.length} primitives, ${blockNames.length} blocks, 1 utils) -> ${outputPath}`
  );
}

buildRegistry().catch((err) => {
  console.error("❌ Registry build failed:", err);
  process.exit(1);
});
