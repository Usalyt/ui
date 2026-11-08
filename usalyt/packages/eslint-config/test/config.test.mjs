import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  entryFiles,
  expectedPluginKeys,
  expectedRules,
  publishedExports,
  publishedFiles
} from "../scripts/public-contract.mjs";
import {
  runConsumerCheck,
  runConsumerImportCheck
} from "../scripts/consumer-check.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const manifest = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
);

function exportTargets(value) {
  if (typeof value === "string") {
    return [value];
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(exportTargets);
  }
  return [];
}

function normalizeConfig(config) {
  return config.map((entry) => ({
    files: entry.files,
    pluginKeys: Object.keys(entry.plugins).sort(),
    rules: entry.rules
  }));
}

test("published contract files exist on disk", () => {
  for (const file of publishedFiles) {
    assert.ok(existsSync(join(packageRoot, file)), `Missing published file: ${file}`);
  }
  for (const file of entryFiles) {
    assert.ok(existsSync(join(packageRoot, file)), `Missing entry file: ${file}`);
  }
});

test("declared manifest allowlist and export targets match real files", () => {
  if (Array.isArray(manifest.files)) {
    for (const file of manifest.files) {
      assert.ok(
        existsSync(join(packageRoot, file)),
        `package.json files entry does not exist: ${file}`
      );
    }
    for (const file of publishedFiles) {
      assert.ok(
        manifest.files.includes(file),
        `package.json files is missing the required published file: ${file}`
      );
    }
  }

  if (manifest.exports) {
    for (const target of exportTargets(manifest.exports)) {
      assert.ok(
        existsSync(join(packageRoot, target)),
        `package.json exports target does not exist: ${target}`
      );
    }
    assert.equal(
      manifest.exports["."]?.import,
      publishedExports["."].import,
      "ESM export must target ./index.mjs"
    );
    assert.equal(
      manifest.exports["."]?.require,
      publishedExports["."].require,
      "CommonJS export must target ./index.js"
    );
  }
});

test("ESM entry exports the expected flat config array", async () => {
  const module = await import("../index.mjs");
  const config = module.default;

  assert.ok(Array.isArray(config), "index.mjs must default-export an array");
  assert.equal(config.length, 1);
  assert.deepEqual(config[0].files, ["**/*.{ts,tsx}"]);
  assert.deepEqual(Object.keys(config[0].plugins).sort(), expectedPluginKeys);
  assert.deepEqual(config[0].rules, expectedRules);
  assert.equal(config[0].languageOptions.parserOptions.sourceType, "module");
  assert.equal(config[0].languageOptions.parserOptions.ecmaFeatures.jsx, true);
});

test("CommonJS entry exports the same flat config array", async () => {
  const esmConfig = (await import("../index.mjs")).default;
  const cjsConfig = require("../index.js");

  assert.ok(Array.isArray(cjsConfig), "index.js must export an array");
  assert.deepEqual(normalizeConfig(cjsConfig), normalizeConfig(esmConfig));
});

test("consumer can import the package without module-syntax detection", () => {
  const result = runConsumerImportCheck();
  assert.equal(
    result.status,
    0,
    `Consumer import failed (flags: ${result.flags.join(" ") || "none"}):\n${result.stderr}`
  );
  assert.match(result.stdout, /array=true/);
  assert.match(result.stdout, /entries=1/);
});

test("consumer lint pass and expected rule failure", () => {
  const result = runConsumerCheck();

  assert.equal(
    result.valid.status,
    0,
    `valid.tsx should lint cleanly:\n${result.valid.stdout}\n${result.valid.stderr}`
  );
  assert.equal(
    result.invalid.status,
    1,
    `invalid.tsx should fail:\n${result.invalid.stdout}\n${result.invalid.stderr}`
  );

  const invalidOutput = `${result.invalid.stdout}\n${result.invalid.stderr}`;
  assert.match(invalidOutput, /jsx-a11y\/alt-text/);
});
