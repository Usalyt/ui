import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { before, test } from "node:test";

import {
  committedRegistryPath,
  makeScratchDir,
  packageRoot,
  runGenerator,
  uiPackageJsonPath,
  uiSourceRoot,
  validateRegistry,
} from "./helpers.ts";

const runRoot = makeScratchDir("registry-cli");
const explicitPath = path.join(runRoot, "explicit.json");

let explicitRaw = "";

before(() => {
  const result = runGenerator([
    "--source",
    uiSourceRoot,
    "--out",
    explicitPath,
  ]);
  assert.equal(result.status, 0, result.stderr);
  explicitRaw = fs.readFileSync(explicitPath, "utf8");
});

test("--check passes for the committed registry", () => {
  const result = runGenerator(["--check"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /up to date/i);
});

test("the default build still writes the packaged registry", () => {
  const before = fs.readFileSync(committedRegistryPath, "utf8");

  const result = runGenerator([]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /74 items/);
  assert.equal(fs.readFileSync(committedRegistryPath, "utf8"), before);
});

test("--check fails for a stale registry copy", () => {
  const stalePath = path.join(runRoot, "stale-registry.json");
  const data = JSON.parse(fs.readFileSync(committedRegistryPath, "utf8"));
  data.items[0].description = "stale description";
  fs.writeFileSync(stalePath, `${JSON.stringify(data, null, 2)}\n`);

  const result = runGenerator(["--check", "--out", stalePath]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /out of date|differs/i);
});

test("--check fails when the output registry is missing", () => {
  const missingPath = path.join(runRoot, "missing-registry.json");
  const result = runGenerator(["--check", "--out", missingPath]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /missing|out of date/i);
});

test("a missing source root fails without writing output", () => {
  const missingSource = path.join(runRoot, "does-not-exist");
  const outPath = path.join(runRoot, "missing-source-output.json");

  const result = runGenerator([
    "--source",
    missingSource,
    "--out",
    outPath,
  ]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /source/i);
  assert.equal(fs.existsSync(outPath), false);
});

test("an unknown option fails with usage", () => {
  const result = runGenerator(["--unknown-option"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unknown|usage/i);
});

test("the default source is package-relative, not working-directory-relative", () => {
  const foreignCwd = path.join(runRoot, "foreign-cwd");
  fs.mkdirSync(foreignCwd, { recursive: true });
  const outPath = path.join(runRoot, "default-source.json");

  const result = runGenerator(["--out", outPath], { cwd: foreignCwd });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(outPath, "utf8"), explicitRaw);
});

test("USALYT_SOURCE_ROOT supplies the source default and --source wins", () => {
  const envOut = path.join(runRoot, "env-source.json");
  const fromEnvironment = runGenerator(["--out", envOut], {
    env: { USALYT_SOURCE_ROOT: uiSourceRoot },
  });

  assert.equal(fromEnvironment.status, 0, fromEnvironment.stderr);
  assert.equal(fs.readFileSync(envOut, "utf8"), explicitRaw);

  const flagOut = path.join(runRoot, "flag-wins.json");
  const flagWins = runGenerator(
    ["--source", uiSourceRoot, "--out", flagOut],
    { env: { USALYT_SOURCE_ROOT: path.join(runRoot, "missing-env-source") } }
  );

  assert.equal(flagWins.status, 0, flagWins.stderr);
  assert.equal(fs.readFileSync(flagOut, "utf8"), explicitRaw);
});

test("a copied standalone source fixture generates the same valid registry", () => {
  const fixtureRoot = path.join(packageRoot, ".tmp", "standalone-ui-src");
  fs.mkdirSync(fixtureRoot, { recursive: true });
  fs.cpSync(uiSourceRoot, path.join(fixtureRoot, "src"), {
    recursive: true,
    force: true,
  });
  fs.copyFileSync(uiPackageJsonPath, path.join(fixtureRoot, "package.json"));

  const fixtureOut = path.join(fixtureRoot, "registry.json");
  const result = runGenerator([
    "--source",
    path.join(fixtureRoot, "src"),
    "--out",
    fixtureOut,
  ]);

  assert.equal(result.status, 0, result.stderr);

  const fixtureRaw = fs.readFileSync(fixtureOut, "utf8");
  const data = JSON.parse(fixtureRaw);
  const { valid, errors } = validateRegistry(data);

  assert.deepEqual(errors, []);
  assert.equal(valid, true);
  assert.equal(data.items.length, 74);
  assert.ok(!fixtureRaw.includes(fixtureRoot));
  assert.equal(fixtureRaw, explicitRaw);
});
