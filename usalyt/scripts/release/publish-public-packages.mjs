#!/usr/bin/env node
/**
 * Publish the six public Usalyt packages with pnpm, skipping versions that
 * already exist. Never overwrites, force-publishes, or unpublishes.
 *
 * The release target is derived from each package's own manifest. All six
 * manifests are validated as one fixed version group before any registry
 * query or mutation, so a bumped or inconsistent group cannot be silently
 * published under a stale hardcoded version.
 *
 * Usage (from usalyt/):
 *   node scripts/release/publish-public-packages.mjs --dry-run
 *   node scripts/release/publish-public-packages.mjs
 *   node scripts/release/publish-public-packages.mjs --provenance
 *
 * The release workflow supplies NODE_AUTH_TOKEN from the protected
 * `npm-release` environment. A dry run never publishes.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "../..");

const PACKAGES = [
  ["@usalyt/ui", "packages/ui"],
  ["@usalyt/registry", "packages/registry"],
  ["@usalyt/cli", "packages/cli"],
  ["@usalyt/mcp-server", "packages/mcp-server"],
  ["@usalyt/tsconfig", "packages/tsconfig"],
  ["@usalyt/eslint-config", "packages/eslint-config"],
];

const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

const dryRun = process.argv.includes("--dry-run");
const provenance = process.argv.includes("--provenance");

function abort(message) {
  console.error(message);
  process.exit(1);
}

function readReleaseManifests() {
  const manifests = [];

  for (const [expectedName, relativeDir] of PACKAGES) {
    const manifestPath = path.join(workspaceRoot, relativeDir, "package.json");
    let raw;
    try {
      raw = fs.readFileSync(manifestPath, "utf8");
    } catch (error) {
      abort(`Cannot read ${manifestPath}: ${error instanceof Error ? error.message : String(error)}`);
    }

    let manifest;
    try {
      manifest = JSON.parse(raw);
    } catch (error) {
      abort(`${manifestPath} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
      abort(`${manifestPath} must contain a JSON object.`);
    }
    if (manifest.name !== expectedName) {
      abort(
        `Identity mismatch in ${manifestPath}: expected "${expectedName}", found "${String(manifest.name)}".`,
      );
    }
    if (manifest.private === true) {
      abort(`${manifestPath} is private; a private package cannot be released.`);
    }
    if (typeof manifest.version !== "string" || !VERSION_PATTERN.test(manifest.version)) {
      abort(`${manifestPath} has an invalid version: ${String(manifest.version)}.`);
    }
    if (manifest.publishConfig?.access !== "public") {
      abort(`${manifestPath} must declare publishConfig.access "public".`);
    }

    manifests.push({
      name: expectedName,
      relativeDir,
      cwd: path.join(workspaceRoot, relativeDir),
      version: manifest.version,
    });
  }

  const versions = [...new Set(manifests.map((manifest) => manifest.version))];
  if (versions.length !== 1) {
    abort(
      `The public package group is not fixed: found versions ${versions
        .sort()
        .join(", ")}. Align every public manifest before publishing.`,
    );
  }

  return { manifests, version: versions[0] };
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0", ...(options.env ?? {}) },
  });
}

function isNotFound(result) {
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  return /E404|404 Not Found|ERR_PNPM_FETCH_404|not found/i.test(output);
}

const { manifests, version } = readReleaseManifests();

if (!dryRun && !process.env.NODE_AUTH_TOKEN) {
  abort("Refusing to publish without NODE_AUTH_TOKEN from the protected npm-release environment.");
}

let published = 0;
let skipped = 0;

for (const manifest of manifests) {
  const { name, cwd } = manifest;
  const query = run("pnpm", ["view", `${name}@${version}`, "version"], { cwd });

  if (query.status === 0) {
    const reportedVersion = query.stdout.trim();
    if (reportedVersion !== version) {
      abort(
        `Abort ${name}: registry returned version "${reportedVersion}" for ${name}@${version}; expected "${version}".`,
      );
    }
    console.log(`skip ${name}@${version}: already published`);
    skipped += 1;
    continue;
  }

  if (!isNotFound(query)) {
    abort(
      `Abort ${name}: could not determine whether ${name}@${version} exists.\n${`${query.stdout ?? ""}\n${query.stderr ?? ""}`.trim()}`,
    );
  }

  if (dryRun) {
    console.log(`would publish ${name}@${version}${provenance ? " with provenance" : ""}`);
    published += 1;
    continue;
  }

  const args = ["publish", "--access", "public", "--no-git-checks"];
  if (provenance) args.push("--provenance");
  console.log(`publishing ${name}@${version}...`);
  const result = run("pnpm", args, { cwd });
  if (result.status !== 0) {
    abort(
      `Publish failed for ${name}@${version}. Stop here; rerun later to resume missing packages.\n${`${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim()}`,
    );
  }
  console.log(`published ${name}@${version}`);
  published += 1;
}

console.log(`${dryRun ? "Dry run" : "Release"} complete: ${published} to publish, ${skipped} already present.`);
