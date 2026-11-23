import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  realpathSync,
  symlinkSync,
  writeFileSync
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { presets } from "./public-contract.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tscBin = join(packageRoot, "node_modules", "typescript", "bin", "tsc");

export const consumerRoot = join(packageRoot, ".tmp", "consumer");

const reactShim = `declare module "react/jsx-runtime" {
  export const jsx: unknown;
  export const jsxs: unknown;
  export const Fragment: unknown;
  export namespace JSX {
    type Element = unknown;
    interface IntrinsicElements {
      [elementName: string]: Record<string, unknown>;
    }
  }
}
`;

const consumerFiles = {
  base: {
    "tsconfig.json": {
      extends: "@usalyt/tsconfig/base.json",
      include: ["index.ts"],
      compilerOptions: { noEmit: true }
    },
    "index.ts": `export interface Sample {
  readonly id: string;
}

export const sample: Sample = { id: "base" };
`
  },
  react: {
    "tsconfig.json": {
      extends: "@usalyt/tsconfig/react.json",
      include: ["App.tsx", "react-shim.d.ts"],
      compilerOptions: { noEmit: true }
    },
    "App.tsx": `export function App({ label }: { label: string }) {
  return <span data-label={label}>{label}</span>;
}
`,
    "react-shim.d.ts": reactShim
  },
  next: {
    "tsconfig.json": {
      extends: "@usalyt/tsconfig/next.json",
      include: ["App.tsx", "react-shim.d.ts"]
    },
    "App.tsx": `export function Page({ label }: { label: string }) {
  return <main>{label}</main>;
}
`,
    "react-shim.d.ts": reactShim
  }
};

export function prepareConsumer() {
  mkdirSync(consumerRoot, { recursive: true });

  const linkPath = join(consumerRoot, "node_modules", "@usalyt", "tsconfig");
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

function runPreset(preset) {
  const presetRoot = join(consumerRoot, preset);
  mkdirSync(presetRoot, { recursive: true });

  for (const [fileName, contents] of Object.entries(consumerFiles[preset])) {
    const text =
      typeof contents === "string" ? contents : `${JSON.stringify(contents, null, 2)}\n`;
    writeFileSync(join(presetRoot, fileName), text, "utf8");
  }

  const result = spawnSync(
    process.execPath,
    [tscBin, "-p", join(presetRoot, "tsconfig.json")],
    { cwd: presetRoot, encoding: "utf8" }
  );

  return {
    preset,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

/**
 * Writes isolated consumer projects (left in place by design) that extend each
 * packaged preset through Node package resolution, then type-checks each one
 * with the package-local TypeScript binary.
 */
export function runConsumerCheck() {
  if (!existsSync(tscBin)) {
    throw new Error(`Package-local TypeScript binary not found: ${tscBin}`);
  }

  prepareConsumer();

  return presets.map(runPreset);
}
