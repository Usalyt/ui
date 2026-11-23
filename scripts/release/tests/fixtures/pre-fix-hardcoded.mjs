#!/usr/bin/env node
/**
 * Publish the six public Usalyt packages with pnpm, skipping versions that
 * already exist. Never overwrites, force-publishes, or unpublishes.
 *
 * Usage (from ui-library/):
 *   node scripts/release/publish-public-packages.mjs --dry-run
 *   node scripts/release/publish-public-packages.mjs
 *   node scripts/release/publish-public-packages.mjs --provenance
 *
 * The release workflow supplies NODE_AUTH_TOKEN from the protected
 * `npm-release` environment. A dry run never publishes.
 */
import { spawnSync } from "node:child_process";
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

const VERSION = "0.0.1";
const dryRun = process.argv.includes("--dry-run");
const provenance = process.argv.includes("--provenance");

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

if (!dryRun && !process.env.NODE_AUTH_TOKEN) {
  console.error("Refusing to publish without NODE_AUTH_TOKEN from the protected npm-release environment.");
  process.exit(1);
}

let published = 0;
let skipped = 0;

for (const [name, relativeDir] of PACKAGES) {
  const cwd = path.join(workspaceRoot, relativeDir);
  const query = run("pnpm", ["view", `${name}@${VERSION}`, "version"], { cwd });

  if (query.status === 0 && query.stdout.trim() === VERSION) {
    console.log(`skip ${name}@${VERSION}: already published`);
    skipped += 1;
    continue;
  }

  if (query.status !== 0 && !isNotFound(query)) {
    console.error(`abort ${name}: could not determine whether ${name}@${VERSION} exists.`);
    console.error(`${query.stdout ?? ""}\n${query.stderr ?? ""}`.trim());
    process.exit(1);
  }

  if (dryRun) {
    console.log(`would publish ${name}@${VERSION}${provenance ? " with provenance" : ""}`);
    published += 1;
    continue;
  }

  const args = ["publish", "--access", "public", "--no-git-checks"];
  if (provenance) args.push("--provenance");
  console.log(`publishing ${name}@${VERSION}...`);
  const result = run("pnpm", args, { cwd });
  if (result.status !== 0) {
    console.error(`publish failed for ${name}@${VERSION}. Stop here; rerun later to resume missing packages.`);
    console.error(`${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim());
    process.exit(1);
  }
  console.log(`published ${name}@${VERSION}`);
  published += 1;
}

console.log(`${dryRun ? "Dry run" : "Release"} complete: ${published} to publish, ${skipped} already present.`);
