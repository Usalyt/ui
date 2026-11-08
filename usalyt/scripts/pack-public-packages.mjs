#!/usr/bin/env node
/**
 * Pack the six public Usalyt packages and inspect each tarball.
 *
 * Run from the usalyt workspace root after building:
 *   node scripts/pack-public-packages.mjs
 *
 * The tarballs and inspection report are written under
 * odd/artifacts/usalyt-npm-release/ so the parent reviewer can inspect them.
 * Nothing is published and no npm account is contacted.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validatePackageLicense } from "./package-licenses.mjs";

const STORE_VERSION = "0.0.1";
const PUBLIC_PACKAGES = [
  ["@usalyt/ui", "packages/ui"],
  ["@usalyt/registry", "packages/registry"],
  ["@usalyt/cli", "packages/cli"],
  ["@usalyt/mcp-server", "packages/mcp-server"],
  ["@usalyt/tsconfig", "packages/tsconfig"],
  ["@usalyt/eslint-config", "packages/eslint-config"],
];

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(workspaceRoot, "..");
const artifactRoot = path.join(repoRoot, "odd/artifacts/usalyt-npm-release");
const packRoot = path.join(artifactRoot, "packs", STORE_VERSION);
const reportPath = path.join(artifactRoot, "pack-report.json");

const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bNPM_TOKEN\b/,
  /\bNODE_AUTH_TOKEN\b/,
  /\bnpm_[A-Za-z0-9]{20,}\b/,
];
const FORBIDDEN_TARBALL_ENTRIES = [
  /(^|\/)\.tmp(\/|$)/,
  /(^|\/)node_modules(\/|$)/,
  /(^|\/)\.turbo(\/|$)/,
  /(^|\/)\.env(?:\.|$)/,
  /(^|\/)\.npmrc$/,
  /(^|\/)\.git(\/|$)/,
];

const failures = [];
const report = { generatedAt: new Date().toISOString(), version: STORE_VERSION, packages: [] };

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0", ...(options.env ?? {}) },
  });
  if (result.status !== 0) {
    const detail = `${command} ${args.join(" ")} failed (exit ${result.status})\n${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    if (options.allowFailure) return { ...result, detail };
    throw new Error(detail);
  }
  return result;
}

function tarList(tarball) {
  return run("tar", ["-tzf", tarball]).stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function tarRead(tarball, entry) {
  return run("tar", ["-xOzf", tarball, entry]).stdout;
}

function fail(pkg, message) {
  failures.push(`${pkg}: ${message}`);
}

function inspect(pkgName, pkgDir, tarball) {
  const entries = tarList(tarball);
  const entrySet = new Set(entries);
  const manifestPath = "package/package.json";
  if (!entrySet.has(manifestPath)) {
    fail(pkgName, "tarball has no package/package.json");
    return null;
  }
  const manifest = JSON.parse(tarRead(tarball, manifestPath));
  const requiredFiles = [
    "package/package.json",
    "package/README.md",
    "package/LICENSE",
    "package/CHANGELOG.md",
    "package/NOTICE",
    "package/THIRD_PARTY_NOTICES.md",
  ];
  for (const file of requiredFiles) {
    if (!entrySet.has(file)) fail(pkgName, `missing ${file}`);
  }

  if (manifest.name !== pkgName) fail(pkgName, `name is ${manifest.name}`);
  if (manifest.version !== STORE_VERSION) fail(pkgName, `version is ${manifest.version}`);
  if (manifest.private === true) fail(pkgName, "package is private");
  if (manifest.publishConfig?.access !== "public") fail(pkgName, "publishConfig.access is not public");
  if (manifest.engines?.node !== ">=20") fail(pkgName, "engines.node is not >=20");

  const serialized = JSON.stringify(manifest);
  if (serialized.includes("workspace:")) fail(pkgName, "packed manifest still contains workspace: protocol");

  const internalDeps = Object.entries({
    ...(manifest.dependencies ?? {}),
    ...(manifest.peerDependencies ?? {}),
  }).filter(([name]) => name.startsWith("@usalyt/"));
  for (const [name, range] of internalDeps) {
    if (!/^\^0\.0\.1$/.test(range)) fail(pkgName, `internal dependency ${name} is ${range}, expected ^0.0.1`);
  }

  for (const entry of entries) {
    if (FORBIDDEN_TARBALL_ENTRIES.some((pattern) => pattern.test(entry))) {
      fail(pkgName, `forbidden tarball entry ${entry}`);
    }
    if (entry.startsWith("/")) fail(pkgName, `absolute tarball entry ${entry}`);
  }

  const textEntries = entries.filter((entry) =>
    /(?:^|\/)(?:package\.json|README\.md|CHANGELOG\.md|NOTICE|THIRD_PARTY_NOTICES\.md)$/.test(entry) ||
    /\.(?:ts|tsx|js|mjs|cjs|css|json)$/.test(entry)
  );
  for (const entry of textEntries) {
    const content = tarRead(tarball, entry);
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(content)) fail(pkgName, `secret-like content in ${entry}`);
    }
    if (content.includes("/home/save/")) fail(pkgName, `absolute developer path in ${entry}`);
  }

  const licenseText = tarRead(tarball, "package/LICENSE");
  for (const error of validatePackageLicense(pkgName, manifest.license, licenseText)) {
    fail(pkgName, error);
  }
  const changelog = tarRead(tarball, "package/CHANGELOG.md");
  if (!changelog.includes("0.0.1")) fail(pkgName, "CHANGELOG has no 0.0.1 entry");

  const exportTargets = [];
  const visit = (value) => {
    if (typeof value === "string") {
      if (value.startsWith("./")) exportTargets.push(value);
      return;
    }
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit(manifest.exports);
  for (const target of exportTargets) {
    const entry = `package/${target.replace(/^\.\//, "")}`;
    if (!entrySet.has(entry)) fail(pkgName, `export target missing from tarball: ${target}`);
  }

  for (const [binName, binTarget] of Object.entries(manifest.bin ?? {})) {
    const entry = `package/${String(binTarget).replace(/^\.\//, "")}`;
    if (!entrySet.has(entry)) fail(pkgName, `bin target for ${binName} missing: ${binTarget}`);
  }

  report.packages.push({
    name: pkgName,
    directory: pkgDir,
    tarball: path.basename(tarball),
    files: entries.length,
    exportTargets: exportTargets.length,
    bin: manifest.bin ?? null,
    dependencies: manifest.dependencies ?? {},
    sizeBytes: fs.statSync(tarball).size,
  });
  return manifest;
}

fs.mkdirSync(packRoot, { recursive: true });
fs.mkdirSync(artifactRoot, { recursive: true });

for (const [pkgName, pkgDir] of PUBLIC_PACKAGES) {
  const result = spawnSync("pnpm", ["pack", "--pack-destination", packRoot], {
    cwd: path.join(workspaceRoot, pkgDir),
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  if (result.status !== 0) {
    fail(pkgName, `pnpm pack failed (exit ${result.status}): ${result.stderr || result.stdout}`);
    continue;
  }
  const packedName = (result.stdout.match(/[^\s]+\.tgz\s*$/) ?? [])[0]?.trim();
  const expectedPrefix = `${pkgName.replace("@", "").replace("/", "-")}-${STORE_VERSION}.tgz`;
  const tarball = path.join(packRoot, packedName ? path.basename(packedName) : expectedPrefix);
  if (!fs.existsSync(tarball)) {
    fail(pkgName, `packed tarball not found at ${tarball}`);
    continue;
  }
  inspect(pkgName, pkgDir, tarball);
}

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  console.error(`Tarball inspection failed (${failures.length} problem(s)):`);
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(`\nReport: ${reportPath}`);
  process.exit(1);
}

console.log(`Packed and inspected ${report.packages.length} public packages.`);
for (const pkg of report.packages) {
  console.log(`- ${pkg.name}: ${pkg.tarball} (${pkg.files} files, ${pkg.exportTargets} export targets, ${pkg.sizeBytes} bytes)`);
}
console.log(`Report: ${reportPath}`);
