import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  PACKAGE_LICENSE_CONTRACTS,
  validatePackageLicense,
} from "../package-licenses.mjs";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(testDir, "../..");

const PACKAGE_DIRS = {
  "@usalyt/ui": "packages/ui",
  "@usalyt/registry": "packages/registry",
  "@usalyt/cli": "packages/cli",
  "@usalyt/mcp-server": "packages/mcp-server",
  "@usalyt/tsconfig": "packages/tsconfig",
  "@usalyt/eslint-config": "packages/eslint-config",
};

function readPackage(name) {
  const dir = path.join(workspaceRoot, PACKAGE_DIRS[name]);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  const licenseText = fs.readFileSync(path.join(dir, "LICENSE"), "utf8");
  return { manifest, licenseText };
}

test("all six package licenses match their package-specific contract", () => {
  for (const name of Object.keys(PACKAGE_LICENSE_CONTRACTS)) {
    const { manifest, licenseText } = readPackage(name);
    assert.deepEqual(validatePackageLicense(name, manifest.license, licenseText), [], name);
  }
});

test("tsconfig requires MIT and the other five require GPL-3.0-only", () => {
  assert.equal(PACKAGE_LICENSE_CONTRACTS["@usalyt/tsconfig"].license, "MIT");
  for (const name of Object.keys(PACKAGE_LICENSE_CONTRACTS)) {
    if (name === "@usalyt/tsconfig") continue;
    assert.equal(PACKAGE_LICENSE_CONTRACTS[name].license, "GPL-3.0-only", name);
  }
});

test("tsconfig rejects the previous GPL declaration", () => {
  const { licenseText } = readPackage("@usalyt/tsconfig");
  assert.notDeepEqual(
    validatePackageLicense("@usalyt/tsconfig", "GPL-3.0-only", licenseText),
    [],
  );
});

test("tsconfig rejects a missing license identifier", () => {
  const { licenseText } = readPackage("@usalyt/tsconfig");
  assert.notDeepEqual(validatePackageLicense("@usalyt/tsconfig", undefined, licenseText), []);
});

test("GPL packages reject MIT", () => {
  const { licenseText } = readPackage("@usalyt/tsconfig");
  assert.notDeepEqual(validatePackageLicense("@usalyt/ui", "MIT", licenseText), []);
});

test("unknown package is rejected", () => {
  assert.notDeepEqual(validatePackageLicense("@usalyt/unknown", "MIT", "MIT License"), []);
});

test("missing license text is rejected", () => {
  assert.notDeepEqual(validatePackageLicense("@usalyt/tsconfig", "MIT", ""), []);
});

test("tsconfig rejects incomplete MIT legal text", () => {
  const { licenseText } = readPackage("@usalyt/tsconfig");
  const warrantyIndex = licenseText.indexOf("THE SOFTWARE IS PROVIDED");
  const incomplete = [
    "MIT License\nPermission is hereby granted, free of charge",
    licenseText.slice(0, warrantyIndex),
  ];
  for (const text of incomplete) {
    assert.notDeepEqual(
      validatePackageLicense("@usalyt/tsconfig", "MIT", text),
      [],
    );
  }

  const formatted = licenseText
    .replace(/\n/g, "\r\n")
    .replace(
      "Permission is hereby granted, free of charge",
      "Permission is hereby granted,   free of charge",
    );
  assert.deepEqual(validatePackageLicense("@usalyt/tsconfig", "MIT", formatted), []);
});

