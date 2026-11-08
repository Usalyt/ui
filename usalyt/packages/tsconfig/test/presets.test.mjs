import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  presets,
  publishedExports,
  publishedFiles
} from "../scripts/public-contract.mjs";
import { runConsumerCheck } from "../scripts/consumer-check.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readPreset(preset) {
  const file = join(packageRoot, `${preset}.json`);
  return JSON.parse(readFileSync(file, "utf8"));
}

test("published contract files exist on disk", () => {
  for (const file of publishedFiles) {
    assert.ok(existsSync(join(packageRoot, file)), `Missing published file: ${file}`);
  }
});

test("only the documented presets are shipped", () => {
  const jsonFiles = readdirSync(packageRoot)
    .filter((file) => file.endsWith(".json") && file !== "package.json")
    .sort();

  assert.deepEqual(
    jsonFiles,
    presets.map((preset) => `${preset}.json`).sort()
  );
});

test("every preset parses and its extends target exists", () => {
  for (const preset of presets) {
    const file = join(packageRoot, `${preset}.json`);
    const parsed = readPreset(preset);

    assert.equal(typeof parsed, "object", `${preset}.json must parse as an object`);
    assert.ok(parsed.compilerOptions, `${preset}.json must declare compilerOptions`);

    if (parsed.extends) {
      const target = resolve(dirname(file), parsed.extends);
      assert.ok(
        existsSync(target),
        `${preset}.json extends a missing file: ${parsed.extends}`
      );
    }
  }
});

test("manifest exports every preset and every target exists", () => {
  const manifest = JSON.parse(
    readFileSync(join(packageRoot, "package.json"), "utf8")
  );

  for (const preset of presets) {
    const subpath = `./${preset}.json`;
    assert.equal(
      manifest.exports?.[subpath],
      publishedExports[subpath],
      `package.json exports must expose ${subpath}`
    );
    assert.ok(
      existsSync(join(packageRoot, `${preset}.json`)),
      `Export target for ${subpath} does not exist`
    );
  }
});

test("README documents only real presets, the license, and provenance", () => {
  const readme = readFileSync(join(packageRoot, "README.md"), "utf8");

  for (const preset of presets) {
    assert.ok(
      readme.includes(`${preset}.json`),
      `README must document ${preset}.json`
    );
  }

  for (const missing of ["react-library.json", "nextjs.json", "astro.json"]) {
    assert.ok(
      !readme.includes(missing),
      `README must not reference a preset that does not exist: ${missing}`
    );
  }

  assert.match(readme, /GPL-3\.0-only/);
  assert.match(readme, /provenance/i);
});

test("isolated consumer type-checks every preset", () => {
  const results = runConsumerCheck();

  for (const result of results) {
    assert.equal(
      result.status,
      0,
      `preset=${result.preset} failed:\n${result.stdout}\n${result.stderr}`
    );
  }
});
