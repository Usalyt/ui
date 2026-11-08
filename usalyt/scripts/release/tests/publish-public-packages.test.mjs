import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const releaseDir = path.resolve(testDir, "..");
const sourceScript = path.join(releaseDir, "publish-public-packages.mjs");
const legacyScript = path.join(testDir, "fixtures/pre-fix-hardcoded.mjs");
const repoRoot = path.resolve(releaseDir, "../../..");
const fixtureRoot = path.join(
  repoRoot,
  "odd/artifacts/usalyt-npm-release/correction-release-version/tests",
);
fs.mkdirSync(fixtureRoot, { recursive: true });

const PACKAGES = [
  ["@usalyt/ui", "ui"],
  ["@usalyt/registry", "registry"],
  ["@usalyt/cli", "cli"],
  ["@usalyt/mcp-server", "mcp-server"],
  ["@usalyt/tsconfig", "tsconfig"],
  ["@usalyt/eslint-config", "eslint-config"],
];

const stubSource = `#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
if (process.env.STUB_LOG) {
  fs.appendFileSync(process.env.STUB_LOG, JSON.stringify(args) + "\\n");
}
if (args[0] === "view") {
  const spec = args[1];
  const existing = (process.env.STUB_EXISTING || "").split(",").filter(Boolean);
  if (existing.includes(spec)) {
    console.log(spec.split("@").pop());
    process.exit(0);
  }
  console.error("ERR_PNPM_FETCH_404 not found");
  process.exit(1);
}
if (args[0] === "publish") {
  console.error("publish must not run in this test");
  process.exit(99);
}
console.error("unexpected pnpm invocation: " + args.join(" "));
process.exit(98);
`;

function createFixture(label, options = {}) {
  const fixture = fs.mkdtempSync(path.join(fixtureRoot, `${label}-`));
  fs.mkdirSync(path.join(fixture, "scripts/release"), { recursive: true });
  fs.copyFileSync(
    options.scriptSource ?? sourceScript,
    path.join(fixture, "scripts/release/publish-public-packages.mjs"),
  );

  for (const [name, dir] of PACKAGES) {
    const manifestDir = path.join(fixture, "packages", dir);
    fs.mkdirSync(manifestDir, { recursive: true });
    const manifest = {
      name,
      version: options.version ?? "0.0.1",
      private: false,
      publishConfig: { access: "public" },
      ...(options.manifestOverrides?.[dir] ?? {}),
    };
    if (options.omit === dir) continue;
    fs.writeFileSync(
      path.join(manifestDir, "package.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
  }

  const binDir = path.join(fixture, "bin");
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(path.join(binDir, "pnpm"), stubSource, { mode: 0o755 });

  return {
    root: fixture,
    log: path.join(fixture, "pnpm.log"),
    bin: binDir,
    existing: options.existing ?? "",
  };
}

function runFixture(fixture, args = ["--dry-run"], env = {}) {
  const childEnv = {
    ...process.env,
    PATH: `${fixture.bin}${path.delimiter}${process.env.PATH ?? ""}`,
    STUB_LOG: fixture.log,
    STUB_EXISTING: fixture.existing,
    STUB_PUBLISH_STATUS: "99",
    ...env,
  };
  delete childEnv.NODE_AUTH_TOKEN;
  if (env.NODE_AUTH_TOKEN) childEnv.NODE_AUTH_TOKEN = env.NODE_AUTH_TOKEN;

  const result = spawnSync(
    process.execPath,
    [path.join(fixture.root, "scripts/release/publish-public-packages.mjs"), ...args],
    { cwd: fixture.root, encoding: "utf8", env: childEnv },
  );
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    output: `${result.stdout ?? ""}\n${result.stderr ?? ""}`,
  };
}

function readLog(fixture) {
  return fs.existsSync(fixture.log) ? fs.readFileSync(fixture.log, "utf8") : "";
}

const allAt = (version) => PACKAGES.map(([name]) => `${name}@${version}`).join(",");

test("RED reproduction: the pre-fix hardcoded script skips a bumped group as 0.0.1", () => {
  const fixture = createFixture("red-hardcoded", {
    version: "0.0.2",
    existing: allAt("0.0.1"),
    scriptSource: legacyScript,
  });
  const result = runFixture(fixture);
  assert.equal(result.status, 0, result.output);
  assert.equal(
    (result.stdout.match(/skip @usalyt\/.*@0\.0\.1: already published/g) ?? []).length,
    6,
  );
  assert.doesNotMatch(result.stdout, /0\.0\.2/);
  assert.match(result.stdout, /0 to publish, 6 already present/);
});

test("bumped fixed group queries and reports each manifest version", () => {
  const fixture = createFixture("bumped", { version: "0.0.2" });
  const result = runFixture(fixture);
  assert.equal(result.status, 0, result.output);
  assert.match(result.stdout, /would publish @usalyt\/ui@0\.0\.2/);
  assert.match(result.stdout, /would publish @usalyt\/eslint-config@0\.0\.2/);
  assert.doesNotMatch(result.stdout, /0\.0\.1/);
  const log = readLog(fixture);
  assert.match(log, /\["view","@usalyt\/ui@0\.0\.2","version"\]/);
  assert.doesNotMatch(log, /@0\.0\.1/);
});

test("bumped fixed group skips only the exact existing version", () => {
  const fixture = createFixture("bumped-existing", {
    version: "0.0.2",
    existing: allAt("0.0.2"),
  });
  const result = runFixture(fixture);
  assert.equal(result.status, 0, result.output);
  assert.equal((result.stdout.match(/skip @usalyt\/.*@0\.0\.2: already published/g) ?? []).length, 6);
  assert.match(result.stdout, /0 to publish, 6 already present/);
  assert.doesNotMatch(result.stdout, /0\.0\.1/);
});

test("existing 0.0.1 dry-run skip behavior still holds", () => {
  const fixture = createFixture("existing-001", { version: "0.0.1", existing: allAt("0.0.1") });
  const result = runFixture(fixture);
  assert.equal(result.status, 0, result.output);
  assert.equal((result.stdout.match(/skip @usalyt\/.*@0\.0\.1: already published/g) ?? []).length, 6);
  assert.match(result.stdout, /0 to publish, 6 already present/);
});

test("missing 0.0.1 still reports a publish plan", () => {
  const fixture = createFixture("missing-001", { version: "0.0.1" });
  const result = runFixture(fixture);
  assert.equal(result.status, 0, result.output);
  assert.equal((result.stdout.match(/would publish @usalyt\/.*@0\.0\.1/g) ?? []).length, 6);
  assert.match(result.stdout, /6 to publish, 0 already present/);
});

test("mismatched fixed group fails before any registry query", () => {
  const fixture = createFixture("mismatch", {
    version: "0.0.1",
    manifestOverrides: { ui: { version: "0.0.2" } },
  });
  const result = runFixture(fixture);
  assert.equal(result.status, 1, result.output);
  assert.match(result.stderr, /not fixed: found versions 0\.0\.1, 0\.0\.2/);
  assert.equal(readLog(fixture), "");
});

test("missing manifest fails before any registry query", () => {
  const fixture = createFixture("missing-manifest", { version: "0.0.2", omit: "cli" });
  const result = runFixture(fixture);
  assert.equal(result.status, 1, result.output);
  assert.match(result.stderr, /Cannot read .*packages\/cli\/package\.json/);
  assert.equal(readLog(fixture), "");
});

test("wrong package identity fails before any registry query", () => {
  const fixture = createFixture("wrong-identity", {
    version: "0.0.2",
    manifestOverrides: { ui: { name: "@tu-ui/ui" } },
  });
  const result = runFixture(fixture);
  assert.equal(result.status, 1, result.output);
  assert.match(result.stderr, /Identity mismatch/);
  assert.equal(readLog(fixture), "");
});

test("private package fails before any registry query", () => {
  const fixture = createFixture("private", {
    version: "0.0.2",
    manifestOverrides: { ui: { private: true } },
  });
  const result = runFixture(fixture);
  assert.equal(result.status, 1, result.output);
  assert.match(result.stderr, /is private/);
  assert.equal(readLog(fixture), "");
});

test("missing publish token fails before any registry query", () => {
  const fixture = createFixture("no-token", { version: "0.0.2" });
  const result = runFixture(fixture, []);
  assert.equal(result.status, 1, result.output);
  assert.match(result.stderr, /Refusing to publish without NODE_AUTH_TOKEN/);
  assert.equal(readLog(fixture), "");
});
