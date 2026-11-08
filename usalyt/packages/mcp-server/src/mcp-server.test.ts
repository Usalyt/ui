import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { beforeAll, describe, expect, it } from "vitest";

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST_ENTRY = resolve(PACKAGE_ROOT, "dist/index.mjs");
// Scratch state under .tmp is intentionally left in place for inspection.
const SCRATCH_ROOT = resolve(PACKAGE_ROOT, ".tmp/mcp-tests");

const require = createRequire(import.meta.url);
const REGISTRY_PATH = require.resolve("@usalyt/registry/registry.json");
const PACKAGED_REGISTRY = JSON.parse(readFileSync(REGISTRY_PATH, "utf8")) as {
  items: Array<{ name: string; files: Array<{ path: string; content: string }> }>;
};

interface TextContent {
  type: "text";
  text: string;
}

function firstText(content: unknown): string {
  const blocks = content as TextContent[];
  const textBlock = blocks.find((block) => block.type === "text");
  if (!textBlock) {
    throw new Error("Tool result has no text content block");
  }
  return textBlock.text;
}

async function withClient(run: (client: Client) => Promise<void>): Promise<void> {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [DIST_ENTRY],
    cwd: PACKAGE_ROOT,
    stderr: "pipe"
  });
  const client = new Client({ name: "mcp-server-protocol-test", version: "0.0.1" });
  await client.connect(transport);
  try {
    await run(client);
  } finally {
    await client.close();
  }
}

/**
 * Runs a minimal newline-delimited JSON-RPC session and returns every stdout line.
 * Used to prove stdout carries protocol frames only.
 */
function runRawSession(): Promise<string[]> {
  return new Promise((resolveLines, reject) => {
    const child: ChildProcessWithoutNullStreams = spawn(process.execPath, [DIST_ENTRY], {
      cwd: PACKAGE_ROOT,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`Raw MCP session timed out. stdout so far: ${stdout}`));
    }, 10_000);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
      if (/"id":2[^\n]*\n/.test(stdout)) {
        clearTimeout(timeout);
        child.kill("SIGTERM");
        resolveLines(stdout.split("\n").filter((line) => line.trim() !== ""));
      }
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.stdin.write(
      `${JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "raw-harness", version: "0.0.1" }
        }
      })}\n`
    );
    child.stdin.write(
      `${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`
    );
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" })}\n`);
  });
}

interface BrokenInstallationRun {
  code: number | null;
  stdout: string;
  stderr: string;
}

type BrokenInstallation = "missing" | "invalid";

/**
 * Copies the executable into a scratch directory whose nearest @usalyt/registry
 * shadow package either omits the registry export or ships malformed JSON. This
 * reproduces an incomplete or corrupted installation without touching the
 * workspace package.
 */
function prepareBrokenInstallation(kind: BrokenInstallation): string {
  const root = resolve(SCRATCH_ROOT, `${kind}-registry`);
  const fakePackageDir = resolve(root, "node_modules/@usalyt/registry");
  mkdirSync(fakePackageDir, { recursive: true });

  const exportedPackageJson: Record<string, unknown> = {
    name: "@usalyt/registry",
    version: "0.0.1",
    type: "module",
    exports: { "./package.json": "./package.json" }
  };
  if (kind === "invalid") {
    exportedPackageJson.exports = {
      "./registry.json": "./registry.json",
      "./package.json": "./package.json"
    };
    writeFileSync(resolve(fakePackageDir, "registry.json"), "{ this is not valid json\n");
  }
  writeFileSync(
    resolve(fakePackageDir, "package.json"),
    `${JSON.stringify(exportedPackageJson, null, 2)}\n`
  );
  copyFileSync(DIST_ENTRY, resolve(root, "index.mjs"));
  return root;
}

function runBrokenInstallation(kind: BrokenInstallation): Promise<BrokenInstallationRun> {
  const root = prepareBrokenInstallation(kind);

  return new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, [resolve(root, "index.mjs")], {
      cwd: root,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => (stdout += chunk.toString("utf8")));
    child.stderr.on("data", (chunk: Buffer) => (stderr += chunk.toString("utf8")));
    child.on("error", reject);
    child.on("close", (code) => resolveRun({ code, stdout, stderr }));
    child.stdin.end();
  });
}

describe("MCP stdio server", () => {
  beforeAll(() => {
    mkdirSync(SCRATCH_ROOT, { recursive: true });
  });

  it("initializes the protocol and advertises the Usalyt identity at 0.0.1", async () => {
    await withClient(async (client) => {
      expect(client.getServerVersion()).toMatchObject({ name: "usalyt", version: "0.0.1" });
    });
  });

  it("keeps the existing tool names, descriptions, and input schema", async () => {
    await withClient(async (client) => {
      const { tools } = await client.listTools();
      expect(tools.map((tool) => tool.name)).toEqual(["list_components", "get_component_code"]);

      const listTool = tools.find((tool) => tool.name === "list_components");
      expect(listTool?.description).toBe(
        "List all UI components and blocks available in the registry"
      );
      expect(listTool?.inputSchema).toMatchObject({ type: "object", properties: {} });

      const codeTool = tools.find((tool) => tool.name === "get_component_code");
      expect(codeTool?.description).toBe("Get the source code for a specific component");
      expect(codeTool?.inputSchema).toMatchObject({
        type: "object",
        properties: { name: { type: "string" } },
        required: ["name"]
      });
    });
  });

  it("lists every packaged registry item from list_components", async () => {
    await withClient(async (client) => {
      const result = await client.callTool({ name: "list_components", arguments: {} });
      expect(result.isError).toBeFalsy();
      const items = JSON.parse(firstText(result.content)) as Array<{ name: string }>;
      expect(items.map((item) => item.name)).toEqual(
        PACKAGED_REGISTRY.items.map((item) => item.name)
      );
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it("returns the source files for the button component", async () => {
    await withClient(async (client) => {
      const result = await client.callTool({
        name: "get_component_code",
        arguments: { name: "button" }
      });
      expect(result.isError).toBeFalsy();
      const files = JSON.parse(firstText(result.content)) as Array<{
        path: string;
        content: string;
      }>;
      expect(files.map((file) => file.path)).toContain("components/button/button.tsx");
      expect(files.some((file) => file.content.includes("Button"))).toBe(true);
    });
  });

  it("returns an error result for an unknown component and keeps serving requests", async () => {
    await withClient(async (client) => {
      const unknown = await client.callTool({
        name: "get_component_code",
        arguments: { name: "does-not-exist" }
      });
      expect(unknown.isError).toBe(true);
      const message = firstText(unknown.content);
      expect(message).toContain("does-not-exist");
      expect(message).toContain("list_components");

      const followUp = await client.callTool({ name: "list_components", arguments: {} });
      expect(followUp.isError).toBeFalsy();
      expect(JSON.parse(firstText(followUp.content)).length).toBeGreaterThan(0);
    });
  });

  it("returns an error result for a missing or non-string name and keeps serving requests", async () => {
    await withClient(async (client) => {
      const missing = await client.callTool({
        name: "get_component_code",
        arguments: {}
      });
      expect(missing.isError).toBe(true);
      expect(firstText(missing.content)).toContain("name");

      const wrongType = await client.callTool({
        name: "get_component_code",
        arguments: { name: 42 }
      });
      expect(wrongType.isError).toBe(true);

      const followUp = await client.callTool({ name: "list_components", arguments: {} });
      expect(followUp.isError).toBeFalsy();
    });
  });

  it("writes protocol frames only to stdout", async () => {
    const lines = await runRawSession();
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      const message = JSON.parse(line) as { jsonrpc?: string; id?: number };
      expect(message.jsonrpc).toBe("2.0");
      expect(typeof message.id).toBe("number");
    }
    const initialize = lines
      .map((line) => JSON.parse(line) as { id?: number; result?: { serverInfo?: unknown } })
      .find((message) => message.id === 1);
    expect(initialize?.result?.serverInfo).toMatchObject({ name: "usalyt", version: "0.0.1" });
  });

  it("exits non-zero with an actionable stderr message when the packaged registry is missing", async () => {
    const run = await runBrokenInstallation("missing");
    expect(run.code).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr).toMatch(/registry/i);
    expect(run.stderr).toMatch(/@usalyt\/registry\/registry\.json/);
    expect(run.stderr).toMatch(/reinstall|install/i);
  });

  it("exits non-zero with an actionable stderr message when the packaged registry is invalid", async () => {
    const run = await runBrokenInstallation("invalid");
    expect(run.code).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr).toMatch(/not valid JSON/i);
    expect(run.stderr).toMatch(/reinstall/i);
  });
});
