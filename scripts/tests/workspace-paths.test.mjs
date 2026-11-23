import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(testDir, "../..");
const repoRoot = workspaceRoot;

const PUBLIC_PACKAGES = {
  "@usalyt/ui": "packages/ui",
  "@usalyt/registry": "packages/registry",
  "@usalyt/cli": "packages/cli",
  "@usalyt/mcp-server": "packages/mcp-server",
  "@usalyt/tsconfig": "packages/tsconfig",
  "@usalyt/eslint-config": "packages/eslint-config",
};

function read(relativeToWorkspace) {
  return fs.readFileSync(path.join(workspaceRoot, relativeToWorkspace), "utf8");
}

function readRepo(relativeToRepo) {
  return fs.readFileSync(path.join(repoRoot, relativeToRepo), "utf8");
}

test("canonical workspace lives at the repository root", () => {
  assert.equal(fs.existsSync(path.join(repoRoot, "pnpm-workspace.yaml")), true);
  assert.equal(fs.existsSync(path.join(repoRoot, "package.json")), true);
  assert.equal(fs.existsSync(path.join(repoRoot, "packages")), true);
  assert.equal(fs.existsSync(path.join(repoRoot, "apps")), true);
  assert.equal(fs.existsSync(path.join(repoRoot, "usalyt")), false);
  assert.equal(fs.existsSync(path.join(repoRoot, "ui-library")), false);
});

test("six public package repository directories target packages/*", () => {
  for (const [name, dir] of Object.entries(PUBLIC_PACKAGES)) {
    const manifest = JSON.parse(read(`${dir}/package.json`));
    assert.equal(manifest.name, name, name);
    assert.equal(manifest.repository?.directory, dir, name);
    assert.equal(manifest.repository?.url, "git+https://github.com/Usalyt/ui.git", name);
    assert.equal(manifest.homepage, "https://github.com/Usalyt/ui", name);
    assert.equal(manifest.bugs?.url, "https://github.com/Usalyt/ui/issues", name);
  }
});

test("release workflows target the repository root", () => {
  const ci = readRepo(".github/workflows/usalyt-ci.yml");
  const release = readRepo(".github/workflows/usalyt-release.yml");
  for (const content of [ci, release]) {
    assert.doesNotMatch(content, /ui-library/);
    assert.doesNotMatch(content, /working-directory: usalyt/);
    assert.doesNotMatch(content, /cache-dependency-path: usalyt\/pnpm-lock\.yaml/);
    assert.match(content, /cache-dependency-path: pnpm-lock\.yaml/);
  }
  assert.doesNotMatch(ci, /"usalyt\/\*\*"/);
});

test("registry source metadata and expectation use packages/registry", () => {
  const builder = read("packages/registry/src/registry-builder.ts");
  const expectation = read("packages/registry/tests/registry-data.test.ts");
  assert.match(builder, /directory: "packages\/registry"/);
  assert.match(expectation, /directory: "packages\/registry"/);
  assert.match(builder, /git\+https:\/\/github\.com\/Usalyt\/ui\.git/);
  assert.match(expectation, /git\+https:\/\/github\.com\/Usalyt\/ui\.git/);
  assert.doesNotMatch(builder, /(?:ui-library|usalyt)\/packages\/registry/);
  assert.doesNotMatch(expectation, /(?:ui-library|usalyt)\/packages\/registry/);
});

test("active workspace docs and source-location strings use root layout", () => {
  const activeFiles = [
    "README.md",
    "packages/README.md",
    "apps/README.md",
    "packages/tests/README.md",
    "scripts/release/README.md",
    "scripts/release/publish-public-packages.mjs",
    "NOTICE",
    "packages/ui/NOTICE",
    "packages/registry/NOTICE",
    "packages/cli/NOTICE",
    "packages/mcp-server/NOTICE",
    "packages/tsconfig/NOTICE",
    "packages/eslint-config/NOTICE",
    "packages/eslint-config/README.md",
    "packages/tsconfig/README.md",
  ];
  for (const file of activeFiles) {
    const content = read(file);
    assert.doesNotMatch(content, /ui-library/, file);
    assert.doesNotMatch(content, /usalyt\/packages\//, file);
  }
});

test("workspace execution docs use Usalyt identities", () => {
  const rootReadme = readRepo("README.md");
  assert.doesNotMatch(rootReadme, /ui-library/);
  assert.doesNotMatch(rootReadme, /tu-ui|@tu-ui/);
  assert.doesNotMatch(rootReadme, /UX Check|save\/ux-check/);
  assert.match(rootReadme, /Usalyt/);
});

test("public tree excludes AI-process documents", () => {
  for (const file of [
    "AGENTS.md", "openspec", ".agent", ".agents", "PRODUCT.md", "DESIGN.md",
  ]) {
    assert.equal(fs.existsSync(path.join(repoRoot, file)), false, file);
  }
  assert.match(readRepo(".gitignore"), /^odd\/$/m);
});

test("pack and verify usage headers point at repository root", () => {
  for (const file of [
    "scripts/pack-public-packages.mjs",
    "scripts/verify-installed.mjs",
  ]) {
    const content = read(file);
    assert.match(content, /Run from the repository root after building:/);
    assert.doesNotMatch(content, /Run from the (?:ui-library|usalyt) workspace root/);
  }
});

test("@usalyt/ui source does not depend on workspace apps/*", () => {
  const uiSrcRoot = path.join(workspaceRoot, "packages/ui/src");
  const stack = [uiSrcRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (!/\.(?:ts|tsx|js|mjs|cjs)$/.test(entry.name)) continue;
      const content = fs.readFileSync(fullPath, "utf8");
      const relative = path.relative(workspaceRoot, fullPath);
      assert.doesNotMatch(content, /\.\.\/apps\//, relative);
    }
  }
});

