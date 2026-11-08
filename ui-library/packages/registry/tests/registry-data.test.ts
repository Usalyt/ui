import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { before, test } from "node:test";

import {
  RUNTIME_PEERS,
  externalPackageName,
  extractSpecifiers,
  listSourceItemNames,
  makeScratchDir,
  readNoticeLicenses,
  readUiPackageJson,
  resolveRegistrySource,
  runGenerator,
  uiSourceRoot,
  validateRegistry,
} from "./helpers.ts";

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
  license: string;
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  dependencyVersions: Record<string, string>;
  files: RegistryFile[];
}

interface Registry {
  $schema: string;
  name: string;
  version: string;
  license: string;
  repository: { type: string; url: string; directory: string };
  dependencyLicenses: Record<string, string>;
  items: RegistryItem[];
}

const SOURCE_PATH_PATTERN =
  /^(?:components\/[a-z0-9]+(?:-[a-z0-9]+)*\/[A-Za-z0-9._-]+|blocks\/[a-z0-9]+(?:-[a-z0-9]+)*\/[A-Za-z0-9._-]+|lib\/[A-Za-z0-9._-]+)$/;

const AUDITED_LICENSES: Record<string, string> = {
  "@base-ui/react": "MIT",
  "@fontsource-variable/inter": "OFL-1.1",
  "@hookform/resolvers": "MIT",
  "@tanstack/react-table": "MIT",
  "class-variance-authority": "Apache-2.0",
  clsx: "MIT",
  cmdk: "MIT",
  "embla-carousel-react": "MIT",
  "input-otp": "MIT",
  "lucide-react": "ISC",
  react: "MIT",
  "react-dom": "MIT",
  "react-hook-form": "MIT",
  "react-resizable-panels": "MIT",
  sonner: "MIT",
  "tailwind-merge": "MIT",
  tailwindcss: "MIT",
  zod: "MIT",
};

const runRoot = makeScratchDir("registry-data");
const generatedPath = path.join(runRoot, "registry.json");
const secondPath = path.join(runRoot, "registry-second.json");

let raw = "";
let registry: Registry;

before(() => {
  const result = runGenerator([
    "--source",
    uiSourceRoot,
    "--out",
    generatedPath,
  ]);

  assert.equal(result.status, 0, result.stderr);
  raw = fs.readFileSync(generatedPath, "utf8");
  registry = JSON.parse(raw) as Registry;
});

test("registry validates against the packaged JSON Schema", () => {
  const { valid, errors } = validateRegistry(registry);
  assert.deepEqual(errors, []);
  assert.equal(valid, true);
});

test("registry declares local schema, version, license, and repository metadata", () => {
  assert.deepEqual(Object.keys(registry), [
    "$schema",
    "name",
    "version",
    "license",
    "repository",
    "dependencyLicenses",
    "items",
  ]);
  assert.equal(registry.$schema, "./schema/registry.schema.json");
  assert.equal(registry.name, "usalyt");
  assert.equal(registry.version, "0.0.1");
  assert.equal(registry.license, "GPL-3.0-only");
  assert.deepEqual(registry.repository, {
    type: "git",
    url: "git+https://github.com/save/ux-check.git",
    directory: "ui-library/packages/registry",
  });
});

test("registry covers every primitive, block, and the shared utils item", () => {
  const primitives = listSourceItemNames(path.join(uiSourceRoot, "components"));
  const blocks = listSourceItemNames(path.join(uiSourceRoot, "blocks"));

  assert.equal(primitives.length, 60);
  assert.equal(blocks.length, 13);

  const expectedNames = [...primitives, ...blocks, "utils"].sort();
  const itemNames = registry.items.map((item) => item.name);

  assert.deepEqual(itemNames, expectedNames);
  assert.equal(new Set(itemNames).size, itemNames.length);

  for (const item of registry.items) {
    if (primitives.includes(item.name)) {
      assert.equal(item.type, "registry:ui");
    } else if (blocks.includes(item.name)) {
      assert.equal(item.type, "registry:block");
    } else {
      assert.equal(item.name, "utils");
      assert.equal(item.type, "registry:lib");
    }
  }
});

test("every item carries the GPL license and sorted dependency metadata", () => {
  for (const item of registry.items) {
    assert.equal(item.license, "GPL-3.0-only", item.name);
    assert.ok(item.title.length > 0, item.name);
    assert.ok(item.description.length > 0, item.name);
    assert.deepEqual(item.devDependencies, [], item.name);
    assert.deepEqual(item.dependencies, [...item.dependencies].sort(), item.name);
    assert.deepEqual(
      item.registryDependencies,
      [...item.registryDependencies].sort(),
      item.name
    );
    assert.deepEqual(
      Object.keys(item.dependencyVersions),
      item.dependencies,
      item.name
    );

    for (const dependency of item.dependencies) {
      assert.ok(
        typeof item.dependencyVersions[dependency] === "string" &&
          item.dependencyVersions[dependency].length > 0,
        `${item.name}: missing version range for ${dependency}`
      );
    }
  }
});

test("every file entry points at non-empty embedded source", () => {
  for (const item of registry.items) {
    assert.ok(item.files.length > 0, item.name);
    assert.deepEqual(
      item.files.map((file) => file.path),
      [...item.files.map((file) => file.path)].sort(),
      item.name
    );

    for (const file of item.files) {
      assert.match(file.path, SOURCE_PATH_PATTERN, `${item.name}: ${file.path}`);
      assert.ok(!path.isAbsolute(file.path));
      assert.ok(!file.path.split("/").includes(".."));
      assert.equal(file.type, item.type, file.path);

      const absolute = path.join(uiSourceRoot, file.path);
      assert.ok(fs.existsSync(absolute), `missing source file: ${absolute}`);
      assert.equal(
        file.content,
        fs.readFileSync(absolute, "utf8"),
        `embedded content differs: ${file.path}`
      );
      assert.ok(file.content.trim().length > 0, `empty content: ${file.path}`);
    }
  }
});

test("registry dependencies match source imports", () => {
  const sourceToItem = new Map<string, string>();
  for (const item of registry.items) {
    for (const file of item.files) {
      sourceToItem.set(file.path, item.name);
    }
  }
  const knownPaths = new Set(sourceToItem.keys());

  for (const item of registry.items) {
    const expected = new Set<string>();

    for (const file of item.files) {
      for (const specifier of extractSpecifiers(file.content)) {
        const resolved = resolveRegistrySource(file.path, specifier, knownPaths);
        if (!resolved) {
          continue;
        }
        const dependency = sourceToItem.get(resolved);
        if (dependency && dependency !== item.name) {
          expected.add(dependency);
        }
      }
    }

    assert.deepEqual(
      item.registryDependencies,
      [...expected].sort(),
      item.name
    );
  }

  const utils = registry.items.find((item) => item.name === "utils");
  assert.ok(utils);
  const importingItems = registry.items
    .filter((item) => item.registryDependencies.includes("utils"))
    .map((item) => item.name);
  assert.ok(importingItems.length > 0);
});

test("npm dependencies and version ranges match UI package declarations", () => {
  const uiPackage = readUiPackageJson();
  const declared = {
    ...(uiPackage.dependencies ?? {}),
    ...(uiPackage.peerDependencies ?? {}),
  };

  for (const item of registry.items) {
    const expected = new Set<string>();

    for (const file of item.files) {
      for (const specifier of extractSpecifiers(file.content)) {
        const name = externalPackageName(specifier);
        if (name) {
          assert.ok(
            !RUNTIME_PEERS.has(name),
            `${item.name}: peer dependency leaked into ${name}`
          );
          expected.add(name);
        }
      }
    }

    const expectedNames = [...expected].sort();
    assert.deepEqual(item.dependencies, expectedNames, item.name);

    const expectedVersions: Record<string, string> = {};
    for (const name of expectedNames) {
      assert.ok(
        declared[name],
        `${item.name}: ${name} is not declared by @usalyt/ui`
      );
      expectedVersions[name] = declared[name];
    }
    assert.deepEqual(item.dependencyVersions, expectedVersions, item.name);
  }
});

test("dependency license map matches the audited workspace notices", () => {
  const uiPackage = readUiPackageJson();
  const directDependencies = [
    ...Object.keys(uiPackage.dependencies ?? {}),
    ...Object.keys(uiPackage.peerDependencies ?? {}),
  ].sort();

  assert.deepEqual(Object.keys(registry.dependencyLicenses), directDependencies);

  const notices = readNoticeLicenses();
  for (const name of directDependencies) {
    assert.equal(
      registry.dependencyLicenses[name],
      notices[name],
      `license for ${name} must come from THIRD_PARTY_NOTICES.md`
    );
  }

  assert.deepEqual(registry.dependencyLicenses, AUDITED_LICENSES);
});

test("output has no absolute paths, timestamps, or former branding", () => {
  assert.ok(!raw.includes(uiSourceRoot));
  assert.ok(!raw.includes(path.resolve(uiSourceRoot, "..")));
  assert.ok(!raw.includes("/home/"));
  assert.ok(!raw.includes("tu-ui"));
  assert.ok(!raw.includes("tu-ui.dev"));
  assert.doesNotMatch(raw, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  assert.ok(raw.endsWith("\n"));
  assert.equal(raw, `${JSON.stringify(registry, null, 2)}\n`);
});

test("two generations are byte-identical", () => {
  const second = runGenerator([
    "--source",
    uiSourceRoot,
    "--out",
    secondPath,
  ]);

  assert.equal(second.status, 0, second.stderr);
  assert.equal(fs.readFileSync(secondPath, "utf8"), raw);

  const rewritten = runGenerator([
    "--source",
    uiSourceRoot,
    "--out",
    generatedPath,
  ]);
  assert.equal(rewritten.status, 0, rewritten.stderr);
  assert.equal(fs.readFileSync(generatedPath, "utf8"), raw);
});
