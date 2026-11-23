import { spawnSync } from "node:child_process";
import {
  lstatSync,
  mkdirSync,
  realpathSync,
  symlinkSync,
  writeFileSync
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const consumerRoot = join(packageRoot, ".tmp", "consumer");

const consumerFiles = {
  "eslint.config.mjs": `import usalytConfig from "@usalyt/eslint-config";

export default usalytConfig;
`,
  "valid.tsx": `export function Greeting({ name }: { name: string }) {
  return <p>Hello {name}</p>;
}
`,
  "invalid.tsx": `export function BrokenImage() {
  return <img src="/logo.png" />;
}
`
};

export function prepareConsumer() {
  mkdirSync(consumerRoot, { recursive: true });
  const linkPath = join(consumerRoot, "node_modules", "@usalyt", "eslint-config");
  mkdirSync(dirname(linkPath), { recursive: true });

  try {
    const stat = lstatSync(linkPath);
    if (stat.isSymbolicLink()) {
      const actual = realpathSync(linkPath);
      const expected = realpathSync(packageRoot);
      if (actual !== expected) {
        throw new Error(
          `Existing consumer link ${linkPath} points to ${actual}, expected ${expected}. Resolve it manually; this check never deletes files.`
        );
      }
      return;
    }
    if (stat.isDirectory()) {
      return;
    }
    throw new Error(`Consumer link path ${linkPath} exists and is not a directory.`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  symlinkSync(packageRoot, linkPath, "dir");
}

function runEslint(args) {
  const eslintBin = join(packageRoot, "node_modules", "eslint", "bin", "eslint.js");
  return spawnSync(
    process.execPath,
    [eslintBin, "--config", "eslint.config.mjs", ...args],
    { cwd: consumerRoot, encoding: "utf8" }
  );
}

/**
 * Writes an isolated consumer project (left in place by design) and verifies
 * that the packaged flat config lints a valid file and reports a configured
 * rule violation on an invalid file.
 */
export function runConsumerCheck() {
  prepareConsumer();

  for (const [fileName, contents] of Object.entries(consumerFiles)) {
    writeFileSync(join(consumerRoot, fileName), contents, "utf8");
  }

  const valid = runEslint(["valid.tsx"]);
  const invalid = runEslint(["invalid.tsx"]);

  return {
    consumerRoot,
    valid: {
      status: valid.status,
      stdout: valid.stdout,
      stderr: valid.stderr
    },
    invalid: {
      status: invalid.status,
      stdout: invalid.stdout,
      stderr: invalid.stderr
    }
  };
}

/**
 * Imports the package by name from the consumer directory while disabling
 * Node's module-syntax detection, so a CommonJS/ESM mismatch cannot be masked.
 */
export function runConsumerImportCheck() {
  prepareConsumer();

  const detectionFlags = [
    "--no-experimental-detect-module",
    "--no-experimental-require-module"
  ].filter((flag) => process.allowedNodeEnvironmentFlags.has(flag));

  const source = `
import("@usalyt/eslint-config")
  .then((module) => {
    const config = module.default;
    console.log("array=" + Array.isArray(config));
    console.log("entries=" + (Array.isArray(config) ? config.length : "none"));
  })
  .catch((error) => {
    console.error(error.name + ": " + error.message.split("\\n")[0]);
    process.exit(1);
  });
`;

  const result = spawnSync(
    process.execPath,
    [...detectionFlags, "--input-type=module", "-e", source],
    { cwd: consumerRoot, encoding: "utf8" }
  );

  return {
    flags: detectionFlags,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}
