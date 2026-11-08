import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distEntry = path.join(cliRoot, "dist", "index.mjs");
const registryJsonPath = path.resolve(cliRoot, "..", "registry", "registry.json");

function makeConsumer(label) {
  const scratch = fs.mkdtempSync(path.join(cliRoot, ".tmp", `test-${label}-`));
  const consumer = path.join(scratch, "consumer");
  fs.mkdirSync(consumer, { recursive: true });
  return { scratch, consumer };
}

function runCli(args, { cwd, entry = distEntry } = {}) {
  return spawnSync(process.execPath, [entry, ...args], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      NO_COLOR: "1",
      FORCE_COLOR: "0",
      CI: "1",
      TERM: "dumb",
    },
  });
}

function runInit(consumer) {
  const result = runCli(["init", "--yes"], { cwd: consumer });
  assert.equal(result.status, 0, `init failed:\n${result.stdout}\n${result.stderr}`);
  return result;
}

function listFiles(root) {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        files.push(path.relative(root, full).split(path.sep).join("/"));
      }
    }
  };
  if (fs.existsSync(root)) {
    walk(root);
  }
  return files.sort();
}

function sha256(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function readRegistryNames() {
  const registry = JSON.parse(fs.readFileSync(registryJsonPath, "utf8"));
  return registry.items.map((item) => item.name);
}

test("help reports the Usalyt identity and 0.0.1 version", () => {
  const { consumer } = makeConsumer("identity");
  const help = runCli(["--help"], { cwd: consumer });
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /usalyt/);
  assert.doesNotMatch(help.stdout, /tu-ui/);

  const version = runCli(["--version"], { cwd: consumer });
  assert.equal(version.status, 0, version.stderr);
  assert.equal(version.stdout.trim(), "0.0.1");
});

test("init creates usalyt.json and a second init refuses to overwrite it", () => {
  const { consumer } = makeConsumer("init");
  runInit(consumer);

  const configPath = path.join(consumer, "usalyt.json");
  const before = fs.readFileSync(configPath);
  const config = JSON.parse(before.toString("utf8"));

  assert.equal(config.aliases.components, "@/src/components/ui");
  assert.equal(config.aliases.utils, "@/src/lib/utils");
  assert.equal(JSON.stringify(config).includes("tu-ui"), false);
  assert.equal(JSON.stringify(config).includes("tu-ui.dev"), false);

  const second = runCli(["init", "--yes"], { cwd: consumer });
  assert.notEqual(second.status, 0);
  assert.match(second.stderr, /already exists/i);
  assert.match(second.stderr, /--overwrite/);
  assert.deepEqual(fs.readFileSync(configPath), before);
});

test("add button writes the component and utils, rewrites imports, and reports dependencies", () => {
  const { consumer } = makeConsumer("add-button");
  runInit(consumer);

  const result = runCli(["add", "button"], { cwd: consumer });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  const buttonPath = path.join(consumer, "src", "components", "ui", "button", "button.tsx");
  const buttonIndexPath = path.join(consumer, "src", "components", "ui", "button", "index.ts");
  const utilsPath = path.join(consumer, "src", "lib", "utils.ts");

  assert.ok(fs.existsSync(buttonPath), "button.tsx missing");
  assert.ok(fs.existsSync(buttonIndexPath), "button/index.ts missing");
  assert.ok(fs.existsSync(utilsPath), "lib/utils.ts missing");

  const button = fs.readFileSync(buttonPath, "utf8");
  assert.match(button, /from "\.\.\/\.\.\/\.\.\/lib\/utils"/);
  assert.doesNotMatch(button, /from "\.\.\/\.\.\/lib\/utils"/);

  assert.match(
    result.stdout,
    /pnpm add @base-ui\/react class-variance-authority clsx lucide-react tailwind-merge/
  );
  assert.match(result.stdout, /not installed/i);
  assert.equal(fs.existsSync(path.join(consumer, "node_modules")), false);
});

test("add auth-form installs the block and its transitive registry dependencies", () => {
  const { consumer } = makeConsumer("add-auth-form");
  runInit(consumer);

  const result = runCli(["add", "auth-form"], { cwd: consumer });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  const base = path.join(consumer, "src", "components", "ui");
  for (const name of ["auth-form", "button", "card", "form", "input", "label"]) {
    assert.ok(fs.existsSync(path.join(base, name)), `${name} was not installed`);
  }
  assert.ok(fs.existsSync(path.join(consumer, "src", "lib", "utils.ts")));

  const block = fs.readFileSync(path.join(base, "auth-form", "auth-form.tsx"), "utf8");
  assert.match(block, /from "\.\.\/button"/);
  assert.match(block, /from "\.\.\/card"/);
  assert.match(block, /from "\.\.\/\.\.\/\.\.\/lib\/utils"/);
  assert.match(
    result.stdout,
    /pnpm add @base-ui\/react @hookform\/resolvers class-variance-authority clsx lucide-react react-hook-form tailwind-merge zod/
  );
});

test("unknown components exit non-zero and write nothing", () => {
  const { consumer } = makeConsumer("unknown");
  runInit(consumer);
  const before = listFiles(consumer);

  const result = runCli(["add", "does-not-exist"], { cwd: consumer });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unknown component/i);
  assert.deepEqual(listFiles(consumer), before);
});

test("add refuses to overwrite an existing file without --overwrite", () => {
  const { consumer } = makeConsumer("overwrite");
  runInit(consumer);
  runCli(["add", "button"], { cwd: consumer });

  const buttonPath = path.join(consumer, "src", "components", "ui", "button", "button.tsx");
  const utilsPath = path.join(consumer, "src", "lib", "utils.ts");
  fs.appendFileSync(buttonPath, "// local edit\n");
  fs.appendFileSync(utilsPath, "// local edit\n");
  const buttonBefore = sha256(buttonPath);
  const utilsBefore = sha256(utilsPath);

  const conflict = runCli(["add", "button"], { cwd: consumer });
  assert.notEqual(conflict.status, 0);
  assert.match(conflict.stderr, /--overwrite/);
  assert.equal(sha256(buttonPath), buttonBefore);
  assert.equal(sha256(utilsPath), utilsBefore);

  const overwrite = runCli(["add", "button", "--overwrite"], { cwd: consumer });
  assert.equal(overwrite.status, 0, `${overwrite.stdout}\n${overwrite.stderr}`);
  assert.equal(fs.readFileSync(buttonPath, "utf8").includes("// local edit"), false);
});

test("an alias escaping the consumer root is rejected before any write", () => {
  const { scratch, consumer } = makeConsumer("escape");
  runInit(consumer);
  const outside = path.resolve(consumer, "..", "..", `outside-${path.basename(scratch)}`);

  const configPath = path.join(consumer, "usalyt.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.aliases.components = `../../${path.basename(outside)}`;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
  const before = listFiles(consumer);

  const result = runCli(["add", "button"], { cwd: consumer });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /outside the consumer root/i);
  assert.deepEqual(listFiles(consumer), before);
  assert.equal(fs.existsSync(outside), false);

  const { consumer: absoluteConsumer } = makeConsumer("absolute");
  runInit(absoluteConsumer);
  const absoluteConfigPath = path.join(absoluteConsumer, "usalyt.json");
  const absoluteConfig = JSON.parse(fs.readFileSync(absoluteConfigPath, "utf8"));
  absoluteConfig.aliases.utils = "/tmp/usalyt-outside/utils.ts";
  fs.writeFileSync(absoluteConfigPath, JSON.stringify(absoluteConfig, null, 2) + "\n");
  const absoluteBefore = listFiles(absoluteConsumer);

  const absoluteResult = runCli(["add", "button"], { cwd: absoluteConsumer });
  assert.notEqual(absoluteResult.status, 0);
  assert.match(absoluteResult.stderr, /absolute/i);
  assert.deepEqual(listFiles(absoluteConsumer), absoluteBefore);
});

test("add accepts multiple component names in one invocation", () => {
  const { consumer } = makeConsumer("add-multiple");
  runInit(consumer);

  const result = runCli(["add", "button", "badge"], { cwd: consumer });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.ok(
    fs.existsSync(path.join(consumer, "src", "components", "ui", "button", "button.tsx"))
  );
  assert.ok(
    fs.existsSync(path.join(consumer, "src", "components", "ui", "badge", "badge.tsx"))
  );
});

test("list --json prints the packaged registry item names", () => {
  const { consumer } = makeConsumer("list-json");
  const human = runCli(["list"], { cwd: consumer });
  assert.equal(human.status, 0, human.stderr);
  assert.match(human.stdout, /button/);
  assert.match(human.stdout, /items/);

  const result = runCli(["list", "--json"], { cwd: consumer });
  assert.equal(result.status, 0, result.stderr);

  const parsed = JSON.parse(result.stdout);
  assert.deepEqual(
    parsed.items.map((item) => item.name),
    readRegistryNames()
  );
  assert.equal(parsed.count, parsed.items.length);
  assert.ok(parsed.items.every((item) => typeof item.description === "string"));
});

test("the built executable works from an isolated consumer with no sibling registry", () => {
  const { scratch, consumer } = makeConsumer("isolated");
  const copiedEntry = path.join(scratch, "app", "cli", "index.mjs");
  fs.mkdirSync(path.dirname(copiedEntry), { recursive: true });
  fs.copyFileSync(distEntry, copiedEntry);

  assert.equal(fs.existsSync(path.join(scratch, "app", "registry")), false);
  assert.equal(fs.existsSync(path.join(consumer, "packages")), false);

  const init = runCli(["init", "--yes"], { cwd: consumer, entry: copiedEntry });
  assert.equal(init.status, 0, init.stderr);

  const result = runCli(["list", "--json"], { cwd: consumer, entry: copiedEntry });
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.deepEqual(
    parsed.items.map((item) => item.name),
    readRegistryNames()
  );

  const add = runCli(["add", "button"], { cwd: consumer, entry: copiedEntry });
  assert.equal(add.status, 0, `${add.stdout}\n${add.stderr}`);
  assert.ok(fs.existsSync(path.join(consumer, "src", "components", "ui", "button", "button.tsx")));
});
