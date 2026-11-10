#!/usr/bin/env node
/**
 * Install the packed Usalyt packages into isolated consumers and verify the
 * public npm contract from those installed artifacts.
 *
 * Run from the usalyt workspace root after building:
 *   node scripts/verify-installed.mjs
 *
 * All consumers live under odd/artifacts/usalyt-npm-release/consumers and are
 * intentionally preserved for parent review. This script never publishes.
 */
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(workspaceRoot, "..");
const artifactRoot = path.join(repoRoot, "odd/artifacts/usalyt-npm-release");
const packRoot = path.join(artifactRoot, "packs", "0.0.1");
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const runRoot = path.join(artifactRoot, "consumers", runId);
const resultPath = path.join(artifactRoot, "installed-evidence.json");

const tarballs = {
  ui: path.join(packRoot, "usalyt-ui-0.0.1.tgz"),
  registry: path.join(packRoot, "usalyt-registry-0.0.1.tgz"),
  cli: path.join(packRoot, "usalyt-cli-0.0.1.tgz"),
  mcp: path.join(packRoot, "usalyt-mcp-server-0.0.1.tgz"),
  tsconfig: path.join(packRoot, "usalyt-tsconfig-0.0.1.tgz"),
  eslint: path.join(packRoot, "usalyt-eslint-config-0.0.1.tgz"),
};

const results = [];
const failures = [];

function log(message) {
  process.stdout.write(`[installed] ${message}\n`);
}

function record(name, status, detail) {
  results.push({ name, status, detail });
  if (status === "fail") failures.push(`${name}: ${detail}`);
  log(`${status === "pass" ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
}

function run(name, command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
    timeout: options.timeout ?? 900_000,
    env: {
      ...process.env,
      NO_COLOR: "1",
      FORCE_COLOR: "0",
      NEXT_TELEMETRY_DISABLED: "1",
      ASTRO_TELEMETRY_DISABLED: "1",
      CI: "1",
      ...(options.env ?? {}),
    },
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  if (result.error) {
    if (options.allowFailure) return { ...result, output };
    throw new Error(`${name}: ${command} ${args.join(" ")} failed to start: ${result.error.message}`);
  }
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${name}: ${command} ${args.join(" ")} exited ${result.status}\n${output.slice(-4000)}`);
  }
  return { ...result, output };
}

function writeFiles(root, files) {
  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

function writeConsumer(name, packageJson, files) {
  const root = path.join(runRoot, name);
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(path.join(root, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
  writeFiles(root, files);
  return root;
}

function localRegistryOverride(consumer) {
  const pkgPath = path.join(consumer, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.pnpm = {
    ...(pkg.pnpm ?? {}),
    overrides: {
      ...(pkg.pnpm?.overrides ?? {}),
      "@usalyt/registry": `file:${tarballs.registry}`,
    },
  };
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  fs.writeFileSync(
    path.join(consumer, "pnpm-workspace.yaml"),
    `packages:\n  - "."\noverrides:\n  "@usalyt/registry": "file:${tarballs.registry}"\n`,
  );
}

function install(consumer) {
  log(`installing ${path.basename(consumer)}`);
  run(`install ${path.basename(consumer)}`, "pnpm", ["install", "--prefer-offline", "--ignore-scripts", "--no-frozen-lockfile"], {
    cwd: consumer,
    timeout: 900_000,
  });
}

function assertFile(file) {
  if (!fs.existsSync(file)) throw new Error(`missing file: ${file}`);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function hash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function viteFiles({ reactMajor, pluginReact, typescript, vite }) {
  const reactTypes = reactMajor === 18 ? "18.3.1" : "19.3.0";
  return {
    "index.html": `<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n`,
    "vite.config.ts": `import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()] });\n`,
    "tsconfig.json": `${JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        lib: ["DOM", "DOM.Iterable", "ES2022"],
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        esModuleInterop: true,
        types: ["vite/client"],
      },
      include: ["src"],
    }, null, 2)}\n`,
    "src/main.tsx": `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport { Button } from "@usalyt/ui";\nimport { Card, CardContent, CardHeader, CardTitle } from "@usalyt/ui/card";\nimport "@usalyt/ui/styles.css";\n\nfunction App() {\n  return (\n    <Card>\n      <CardHeader><CardTitle>Installed Usalyt</CardTitle></CardHeader>\n      <CardContent><Button>Hello</Button></CardContent>\n    </Card>\n  );\n}\n\ncreateRoot(document.getElementById("root")!).render(<App />);\n`,
    "src/conditions.mjs": `import * as all from "@usalyt/ui";\nimport { Button, buttonVariants } from "@usalyt/ui/button";\nimport * as card from "@usalyt/ui/card";\nif (!Button || !buttonVariants) throw new Error("missing button exports");\nif (!all.Card) throw new Error("missing root Card export");\nif (!card.Card) throw new Error("missing card subpath export");\nconsole.log(JSON.stringify({ rootKeys: Object.keys(all).length, button: typeof Button }));\n`,
    "src/conditions.cjs": `const ui = require("@usalyt/ui");\nconst button = require("@usalyt/ui/button");\nif (!button.Button || !button.buttonVariants) throw new Error("missing CJS button exports");\nif (!ui.Card) throw new Error("missing CJS root export");\nconsole.log(JSON.stringify({ rootKeys: Object.keys(ui).length, button: typeof button.Button }));\n`,
  };
}

function main() {
  for (const [name, file] of Object.entries(tarballs)) {
    if (!fs.existsSync(file)) throw new Error(`missing tarball (${name}): ${file}. Run node scripts/pack-public-packages.mjs first.`);
  }
  fs.mkdirSync(runRoot, { recursive: true });
  log(`run directory: ${runRoot}`);

  // 1. Vite + React 19
  try {
    const root = writeConsumer("vite-react19", {
      name: "usalyt-consumer-vite-react19",
      private: true,
      type: "module",
      dependencies: { "@usalyt/ui": `file:${tarballs.ui}`, react: "19.3.1", "react-dom": "19.3.1" },
      devDependencies: { "@types/react": "19.3.0", "@types/react-dom": "19.3.0", "@vitejs/plugin-react": "6.2.1", typescript: "6.0.3", vite: "8.3.6" },
    }, viteFiles({ reactMajor: 19, pluginReact: "6.2.1", typescript: "6.0.3", vite: "8.3.6" }));
    install(root);
    run("vite19 tsc", "pnpm", ["exec", "tsc", "--noEmit"], { cwd: root });
    run("vite19 build", "pnpm", ["exec", "vite", "build"], { cwd: root });
    assertFile(path.join(root, "dist/index.html"));
    const css = read(path.join(root, "node_modules/@usalyt/ui/dist/styles.css"));
    if (!css.includes("--color-background")) throw new Error("installed CSS lacks theme tokens");
    if (/-webkit-text-size-adjust:\s*100%/.test(css)) throw new Error("installed CSS contains Tailwind Preflight");
    assertFile(path.join(root, "node_modules/@usalyt/ui/dist/index.mjs"));
    if (!read(path.join(root, "node_modules/@usalyt/ui/dist/index.mjs")).startsWith('"use client";')) {
      throw new Error("installed root entry lost the client directive");
    }
    const esm = run("vite19 ESM conditions", "node", ["src/conditions.mjs"], { cwd: root });
    const cjs = run("vite19 CJS conditions", "node", ["src/conditions.cjs"], { cwd: root });
    record("vite-react19", "pass", `tsc + vite build + ESM/CJS ${esm.output.trim()} / ${cjs.output.trim()}`);
  } catch (error) {
    record("vite-react19", "fail", error.message);
  }

  // 2. Vite + React 18
  try {
    const root = writeConsumer("vite-react18", {
      name: "usalyt-consumer-vite-react18",
      private: true,
      type: "module",
      dependencies: { "@usalyt/ui": `file:${tarballs.ui}`, react: "18.3.1", "react-dom": "18.3.1" },
      devDependencies: { "@types/react": "18.3.1", "@types/react-dom": "18.3.1", "@vitejs/plugin-react": "6.2.1", typescript: "6.0.3", vite: "8.3.6" },
    }, viteFiles({ reactMajor: 18, pluginReact: "6.2.1", typescript: "6.0.3", vite: "8.3.6" }));
    install(root);
    run("vite18 tsc", "pnpm", ["exec", "tsc", "--noEmit"], { cwd: root });
    run("vite18 build", "pnpm", ["exec", "vite", "build"], { cwd: root });
    assertFile(path.join(root, "dist/index.html"));
    record("vite-react18", "pass", "tsc + vite build");
  } catch (error) {
    record("vite-react18", "fail", error.message);
  }

  // 3. Next.js App Router
  try {
    const root = writeConsumer("next-app", {
      name: "usalyt-consumer-next",
      private: true,
      dependencies: { "@usalyt/ui": `file:${tarballs.ui}`, next: "16.4.5", react: "19.3.1", "react-dom": "19.3.1" },
      devDependencies: { "@types/node": "26.6.6", "@types/react": "19.3.0", "@types/react-dom": "19.3.0", typescript: "6.0.3" },
    }, {
      "next.config.mjs": `/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nexport default nextConfig;\n`,
      "tsconfig.json": `${JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          lib: ["DOM", "DOM.Iterable", "ES2022"],
          allowJs: false,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "ESNext",
          moduleResolution: "Bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      }, null, 2)}\n`,
      "next-env.d.ts": `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n`,
      "app/layout.tsx": `import "./globals.css";\nexport default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }\n`,
      "app/globals.css": `@import "@usalyt/ui/styles.css";\n`,
      "app/client-widget.tsx": `"use client";\nimport { Button } from "@usalyt/ui";\nexport function ClientWidget() { return <Button>Client widget</Button>; }\n`,
      "app/page.tsx": `import { Card, CardContent, CardHeader, CardTitle } from "@usalyt/ui";\nimport { ClientWidget } from "./client-widget";\nexport default function Page() { return <Card><CardHeader><CardTitle>Server page</CardTitle></CardHeader><CardContent><ClientWidget /></CardContent></Card>; }\n`,
    });
    install(root);
    run("next build", "pnpm", ["exec", "next", "build"], { cwd: root, timeout: 900_000 });
    assertFile(path.join(root, ".next/BUILD_ID"));
    record("next-app", "pass", "next build + client boundary");
  } catch (error) {
    record("next-app", "fail", error.message);
  }

  // 4. Astro 7
  try {
    const root = writeConsumer("astro-app", {
      name: "usalyt-consumer-astro",
      private: true,
      type: "module",
      dependencies: { "@astrojs/react": "7.1.4", "@usalyt/ui": `file:${tarballs.ui}`, astro: "7.4.7", react: "19.3.1", "react-dom": "19.3.1" },
      devDependencies: { "@types/react": "19.3.0", "@types/react-dom": "19.3.0" },
    }, {
      "astro.config.mjs": `import { defineConfig } from "astro/config";\nimport react from "@astrojs/react";\nexport default defineConfig({ integrations: [react()] });\n`,
      "src/pages/index.astro": `---\nimport { Button } from "@usalyt/ui";\nimport "@usalyt/ui/styles.css";\n---\n<html lang="en"><body><h1>Astro Usalyt</h1><Button client:load>Astro button</Button></body></html>\n`,
    });
    install(root);
    run("astro build", "pnpm", ["exec", "astro", "build"], { cwd: root, timeout: 900_000 });
    assertFile(path.join(root, "dist/index.html"));
    const html = read(path.join(root, "dist/index.html"));
    if (!html.includes("Astro button")) throw new Error("Astro output does not contain the rendered Button");
    record("astro-app", "pass", "astro build + rendered client button");
  } catch (error) {
    record("astro-app", "fail", error.message);
  }

  // 5. CLI consumer
  try {
    const root = writeConsumer("cli-consumer", {
      name: "usalyt-consumer-cli",
      private: true,
      type: "module",
      dependencies: { "@usalyt/cli": `file:${tarballs.cli}`, "@usalyt/registry": `file:${tarballs.registry}` },
    }, {});
    localRegistryOverride(root);
    install(root);
    run("cli init", "pnpm", ["exec", "usalyt", "init", "--yes"], { cwd: root });
    const config = JSON.parse(read(path.join(root, "usalyt.json")));
    if (!config.aliases?.components || !config.aliases?.utils) throw new Error("init did not write usable aliases");
    const add = run("cli add button", "pnpm", ["exec", "usalyt", "add", "button", "--yes"], { cwd: root });
    if (!add.output.includes("pnpm add")) throw new Error("add did not print the dependency install command");
    assertFile(path.join(root, "src/components/ui/button/button.tsx"));
    assertFile(path.join(root, "src/lib/utils.ts"));
    const buttonFile = path.join(root, "src/components/ui/button/button.tsx");
    const before = hash(buttonFile);
    const conflict = run("cli overwrite conflict", "pnpm", ["exec", "usalyt", "add", "button"], { cwd: root, allowFailure: true });
    if (conflict.status === 0) throw new Error("second add unexpectedly succeeded without --overwrite");
    if (hash(buttonFile) !== before) throw new Error("conflicting add changed the existing file");
    const list = run("cli list json", "pnpm", ["exec", "usalyt", "list", "--json"], { cwd: root });
    const parsed = JSON.parse(list.stdout);
    if (parsed.name !== "usalyt" || parsed.items.length !== 74) throw new Error(`unexpected registry payload: ${list.stdout.slice(0, 200)}`);
    record("cli-consumer", "pass", "init + add + list + overwrite refusal");
  } catch (error) {
    record("cli-consumer", "fail", error.message);
  }

  // 6. CLI path containment
  try {
    const root = writeConsumer("cli-escape", {
      name: "usalyt-consumer-cli-escape",
      private: true,
      type: "module",
      dependencies: { "@usalyt/cli": `file:${tarballs.cli}`, "@usalyt/registry": `file:${tarballs.registry}` },
    }, {
      "usalyt.json": `${JSON.stringify({ aliases: { components: "../../outside-usalyt", utils: "../../outside-usalyt/utils" } }, null, 2)}\n`,
    });
    localRegistryOverride(root);
    install(root);
    const escape = run("cli escape", "pnpm", ["exec", "usalyt", "add", "button"], { cwd: root, allowFailure: true });
    if (escape.status === 0) throw new Error("escaping alias unexpectedly succeeded");
    const outside = path.resolve(root, "../../outside-usalyt");
    if (fs.existsSync(outside)) throw new Error(`escape wrote files outside the consumer: ${outside}`);
    record("cli-containment", "pass", "escaping alias rejected with no outside writes");
  } catch (error) {
    record("cli-containment", "fail", error.message);
  }

  // 7. MCP consumer
  try {
    const root = writeConsumer("mcp-consumer", {
      name: "usalyt-consumer-mcp",
      private: true,
      type: "module",
      dependencies: { "@modelcontextprotocol/sdk": "1.29.0", "@usalyt/mcp-server": `file:${tarballs.mcp}` },
    }, {
      "check.mjs": `import assert from "node:assert/strict";\nimport { Client } from "@modelcontextprotocol/sdk/client/index.js";\nimport { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";\n\nconst bin = new URL("./node_modules/@usalyt/mcp-server/dist/index.mjs", import.meta.url).pathname;\nconst transport = new StdioClientTransport({ command: process.execPath, args: [bin], stderr: "pipe" });\nconst client = new Client({ name: "usalyt-consumer-check", version: "0.0.1" }, { capabilities: {} });\nawait client.connect(transport);\nconst info = client.getServerVersion();\nassert.equal(info.name, "usalyt");\nassert.equal(info.version, "0.0.1");\nconst tools = await client.listTools();\nassert.deepEqual(tools.tools.map((tool) => tool.name).sort(), ["get_component_code", "list_components"]);\nconst list = await client.callTool({ name: "list_components", arguments: {} });\nconst items = JSON.parse(list.content[0].text);\nassert.equal(items.length, 74);\nconst code = await client.callTool({ name: "get_component_code", arguments: { name: "button" } });\nassert.ok(code.content[0].text.includes("buttonVariants"));\nconst missing = await client.callTool({ name: "get_component_code", arguments: {} });\nassert.equal(missing.isError, true);\nconst stillAlive = await client.callTool({ name: "list_components", arguments: {} });\nassert.equal(JSON.parse(stillAlive.content[0].text).length, 74);\nawait client.close();\nconsole.log("mcp ok");\n`,
    });
    localRegistryOverride(root);
    install(root);
    const check = run("mcp protocol", "node", ["check.mjs"], { cwd: root });
    if (!check.output.includes("mcp ok")) throw new Error(`unexpected MCP output: ${check.output.slice(0, 500)}`);
    record("mcp-consumer", "pass", "stdio initialize + tools + errors + stdout protocol");
  } catch (error) {
    record("mcp-consumer", "fail", error.message);
  }

  // 8. External configs
  try {
    const root = writeConsumer("configs-consumer", {
      name: "usalyt-consumer-configs",
      private: true,
      type: "module",
      dependencies: { "@usalyt/eslint-config": `file:${tarballs.eslint}`, "@usalyt/tsconfig": `file:${tarballs.tsconfig}`, react: "19.3.1", "react-dom": "19.3.1" },
      devDependencies: { "@types/node": "26.6.6", "@types/react": "19.3.0", "@types/react-dom": "19.3.0", eslint: "9.39.5", typescript: "6.0.3" },
    }, {
      "tsconfig.json": `${JSON.stringify({ extends: "@usalyt/tsconfig/react.json", compilerOptions: { noEmit: true, types: ["node"] }, include: ["src"] }, null, 2)}\n`,
      "eslint.config.mjs": `import config from "@usalyt/eslint-config";\nexport default config;\n`,
      "src/good.tsx": `import * as React from "react";\nexport function Good({ label }: { label: string }) { return <button type="button">{label}</button>; }\n`,
      "src/bad.tsx": `import * as React from "react";\nexport function Bad() { return <img src="/x.png" />; }\n`,
    });
    install(root);
    run("configs tsc", "pnpm", ["exec", "tsc", "--noEmit"], { cwd: root });
    run("configs eslint good", "pnpm", ["exec", "eslint", "src/good.tsx"], { cwd: root });
    const bad = run("configs eslint bad", "pnpm", ["exec", "eslint", "src/bad.tsx"], { cwd: root, allowFailure: true });
    if (bad.status === 0 || !bad.output.includes("jsx-a11y/alt-text")) {
      throw new Error("ESLint did not report the configured jsx-a11y/alt-text rule");
    }
    record("configs-consumer", "pass", "tsconfig preset + flat ESLint config");
  } catch (error) {
    record("configs-consumer", "fail", error.message);
  }

  const summary = {
    runId,
    runRoot,
    tarballs,
    results,
    failures,
    finishedAt: new Date().toISOString(),
  };
  fs.mkdirSync(artifactRoot, { recursive: true });
  fs.writeFileSync(resultPath, `${JSON.stringify(summary, null, 2)}\n`);
  log(`evidence: ${resultPath}`);

  if (failures.length > 0) {
    console.error(`Installed-artifact verification failed (${failures.length} problem(s)):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  log("all installed-artifact checks passed");
}

main();
