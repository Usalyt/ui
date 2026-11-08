import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(testDir, "../..");
const repoRoot = path.resolve(workspaceRoot, "..");

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

test("canonical workspace directory is usalyt", () => {
  assert.equal(path.basename(workspaceRoot), "usalyt");
  assert.equal(fs.existsSync(path.join(repoRoot, "usalyt")), true);
  assert.equal(fs.existsSync(path.join(repoRoot, "ui-library")), false);
});

test("six public package repository directories use usalyt", () => {
  for (const [name, dir] of Object.entries(PUBLIC_PACKAGES)) {
    const manifest = JSON.parse(read(`${dir}/package.json`));
    assert.equal(manifest.name, name, name);
    assert.equal(manifest.repository?.directory, `usalyt/${dir}`, name);
    assert.equal(manifest.repository?.url, "git+https://github.com/Usalyt/ui.git", name);
    assert.equal(manifest.homepage, "https://github.com/Usalyt/ui", name);
    assert.equal(manifest.bugs?.url, "https://github.com/Usalyt/ui/issues", name);
  }
});

test("release workflows target usalyt", () => {
  const ci = readRepo(".github/workflows/usalyt-ci.yml");
  const release = readRepo(".github/workflows/usalyt-release.yml");
  for (const content of [ci, release]) {
    assert.doesNotMatch(content, /ui-library/);
    assert.match(content, /usalyt/);
  }
  assert.match(ci, /working-directory: usalyt/);
  assert.match(release, /working-directory: usalyt/);
  assert.match(ci, /cache-dependency-path: usalyt\/pnpm-lock\.yaml/);
  assert.match(release, /cache-dependency-path: usalyt\/pnpm-lock\.yaml/);
  assert.match(ci, /"usalyt\/\*\*"/);
});

test("registry source metadata and expectation use usalyt", () => {
  const builder = read("packages/registry/src/registry-builder.ts");
  const expectation = read("packages/registry/tests/registry-data.test.ts");
  assert.match(builder, /directory: "usalyt\/packages\/registry"/);
  assert.match(expectation, /directory: "usalyt\/packages\/registry"/);
  assert.match(builder, /git\+https:\/\/github\.com\/Usalyt\/ui\.git/);
  assert.match(expectation, /git\+https:\/\/github\.com\/Usalyt\/ui\.git/);
  assert.doesNotMatch(builder, /ui-library\/packages\/registry/);
  assert.doesNotMatch(expectation, /ui-library\/packages\/registry/);
});

test("active workspace docs and source-location strings use usalyt", () => {
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
    assert.doesNotMatch(read(file), /ui-library/, file);
  }
});

test("workspace execution docs use Usalyt identities", () => {
  const workspaceReadme = read("README.md");
  assert.doesNotMatch(workspaceReadme, /ui-library/);
  assert.doesNotMatch(workspaceReadme, /tu-ui|@tu-ui/);
  assert.match(workspaceReadme, /Usalyt/);
  const rootReadme = readRepo("README.md");
  assert.match(rootReadme, /Usalyt/);
  assert.match(rootReadme, /usalyt\//);
  assert.doesNotMatch(rootReadme, /UX Check|save\/ux-check|ui-library/);
});

test("public tree excludes AI-process documents", () => {
  for (const file of [
    "AGENTS.md", "openspec", ".agent", ".agents",
    "usalyt/AGENTS.md", "usalyt/openspec", "usalyt/PRODUCT.md", "usalyt/DESIGN.md",
  ]) {
    assert.equal(fs.existsSync(path.join(repoRoot, file)), false, file);
  }
  assert.match(readRepo(".gitignore"), /^odd\/$/m);
});

test("pack and verify usage headers point at usalyt", () => {
  for (const file of [
    "scripts/pack-public-packages.mjs",
    "scripts/verify-installed.mjs",
  ]) {
    const content = read(file);
    assert.match(content, /Run from the usalyt workspace root after building:/);
    assert.doesNotMatch(content, /Run from the ui-library workspace root/);
  }
});

