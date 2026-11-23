import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";

import {
  buildRegistry,
  type Registry,
} from "../src/registry-builder.ts";

const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const DEFAULT_SOURCE_ROOT = path.resolve(PACKAGE_ROOT, "../ui/src");
const DEFAULT_OUT = path.join(PACKAGE_ROOT, "registry.json");
const SCHEMA_PATH = path.join(PACKAGE_ROOT, "schema/registry.schema.json");

class UsageError extends Error {}

interface CliOptions {
  sourceRoot: string;
  outPath: string;
  check: boolean;
  help: boolean;
}

function printUsage(write: (message: string) => void): void {
  write(`Usage: tsx scripts/build-registry.ts [options]

Build the deterministic @usalyt/registry registry.json from the Usalyt UI
source tree.

Options:
  -s, --source <dir>  UI source root containing components/, blocks/, and lib/
                      (default: ../ui/src relative to this package)
  -o, --out <file>    Output registry path
                      (default: registry.json in this package)
      --check         Regenerate in memory and exit non-zero when the output
                      file is missing or differs from the generated registry
  -h, --help          Show this help

Environment:
  USALYT_SOURCE_ROOT  Alternative source root when --source is omitted.
                      An explicit --source flag always wins.
`);
}

function parseArgs(argv: string[]): CliOptions {
  let source: string | undefined;
  let out: string | undefined;
  let check = false;
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    switch (argument) {
      case "--source":
      case "-s": {
        const value = argv[index + 1];
        if (!value) {
          throw new UsageError(`Missing value for ${argument}`);
        }
        source = value;
        index += 1;
        break;
      }
      case "--out":
      case "-o": {
        const value = argv[index + 1];
        if (!value) {
          throw new UsageError(`Missing value for ${argument}`);
        }
        out = value;
        index += 1;
        break;
      }
      case "--check":
        check = true;
        break;
      case "--help":
      case "-h":
        help = true;
        break;
      default:
        throw new UsageError(`Unknown option: ${argument}`);
    }
  }

  const environmentSource = process.env.USALYT_SOURCE_ROOT;
  const selectedSource = source ?? environmentSource ?? DEFAULT_SOURCE_ROOT;

  return {
    sourceRoot: path.resolve(selectedSource),
    outPath: path.resolve(out ?? DEFAULT_OUT),
    check,
    help,
  };
}

function assertRegistryMatchesSchema(registry: Registry): void {
  const schema = fs.readJsonSync(SCHEMA_PATH);
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);

  if (!validate(registry)) {
    const details = (validate.errors ?? [])
      .slice(0, 5)
      .map((error) => `${error.instancePath || "/"} ${error.message}`)
      .join("; ");
    throw new Error(`generated registry does not match the packaged schema: ${details}`);
  }
}

async function main(): Promise<void> {
  let options: CliOptions;

  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`Error: ${error.message}\n\n`);
      printUsage((message) => process.stderr.write(message));
      process.exitCode = 2;
      return;
    }
    throw error;
  }

  if (options.help) {
    printUsage((message) => process.stdout.write(message));
    return;
  }

  const result = await buildRegistry({
    sourceRoot: options.sourceRoot,
    packageRoot: PACKAGE_ROOT,
  });

  assertRegistryMatchesSchema(result.registry);

  if (options.check) {
    if (!(await fs.pathExists(options.outPath))) {
      process.stderr.write(
        `Registry is missing: ${options.outPath}. Run the build command to generate it.\n`
      );
      process.exitCode = 1;
      return;
    }

    const current = await fs.readFile(options.outPath, "utf8");
    if (current !== result.json) {
      process.stderr.write(
        `Registry is out of date: ${options.outPath}. Run the build command to regenerate it.\n`
      );
      process.exitCode = 1;
      return;
    }

    process.stdout.write(`Registry is up to date: ${options.outPath}\n`);
    return;
  }

  await fs.outputFile(options.outPath, result.json);
  const { primitives, blocks, libraries, items } = result.stats;
  process.stdout.write(
    `Registry written to ${options.outPath} (${primitives} primitives, ${blocks} blocks, ${libraries} shared library, ${items} items).\n`
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Registry build failed: ${message}\n`);
  process.exitCode = 1;
});
