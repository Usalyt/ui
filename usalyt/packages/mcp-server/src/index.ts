#!/usr/bin/env node
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult
} from "@modelcontextprotocol/sdk/types.js";

const SERVER_NAME = "usalyt";
const SERVER_VERSION = "0.0.1";
const REGISTRY_REQUEST = "@usalyt/registry/registry.json";

export interface RegistryFile {
  path: string;
  type: string;
  content: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  files: RegistryFile[];
  [key: string]: unknown;
}

export interface Registry {
  name?: string;
  version?: string;
  items: RegistryItem[];
  [key: string]: unknown;
}

export class RegistryLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryLoadError";
  }
}

/**
 * Resolves the registry through the installed @usalyt/registry package so the
 * executable works from any working directory. The monorepo-relative lookup is
 * a development-only fallback for checkouts without linked workspace packages.
 */
function resolveRegistryPath(): string {
  const require = createRequire(import.meta.url);
  try {
    return require.resolve(REGISTRY_REQUEST);
  } catch (packageError) {
    const here = dirname(fileURLToPath(import.meta.url));
    const developmentFallback = resolve(here, "../../registry/registry.json");
    if (process.env.NODE_ENV !== "production" && existsSync(developmentFallback)) {
      return developmentFallback;
    }
    const reason = packageError instanceof Error ? packageError.message : String(packageError);
    throw new RegistryLoadError(
      `cannot load the packaged component registry. Expected "${REGISTRY_REQUEST}" to resolve ` +
        `from this installation. Reinstall @usalyt/mcp-server (which depends on @usalyt/registry) ` +
        `or install @usalyt/registry explicitly. Resolution error: ${reason}`
    );
  }
}

function assertRegistryShape(value: unknown, source: string): Registry {
  if (typeof value !== "object" || value === null || !Array.isArray((value as Registry).items)) {
    throw new RegistryLoadError(
      `the packaged component registry at "${source}" is invalid: expected an object with an "items" array. ` +
        `Reinstall @usalyt/registry to restore the packaged registry.`
    );
  }
  for (const item of (value as Registry).items) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof item.name !== "string" ||
      !Array.isArray(item.files)
    ) {
      throw new RegistryLoadError(
        `the packaged component registry at "${source}" is invalid: every item needs a string "name" ` +
          `and a "files" array. Reinstall @usalyt/registry to restore the packaged registry.`
      );
    }
  }
  return value as Registry;
}

export function loadRegistry(): Registry {
  const registryPath = resolveRegistryPath();
  let raw: string;
  try {
    raw = readFileSync(registryPath, "utf8");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new RegistryLoadError(
      `cannot read the packaged component registry at "${registryPath}": ${reason}. ` +
        `Reinstall @usalyt/registry to restore the packaged registry.`
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new RegistryLoadError(
      `the packaged component registry at "${registryPath}" is not valid JSON: ${reason}. ` +
        `Reinstall @usalyt/registry to restore the packaged registry.`
    );
  }

  return assertRegistryShape(parsed, registryPath);
}

function textResult(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

function toolError(text: string): CallToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

export function createMcpServer(registry: Registry = loadRegistry()) {
  const server = new Server(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "list_components",
        description: "List all UI components and blocks available in the registry",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "get_component_code",
        description: "Get the source code for a specific component",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string" }
          },
          required: ["name"]
        }
      }
    ]
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
    if (request.params.name === "list_components") {
      return textResult(JSON.stringify(registry.items, null, 2));
    }

    if (request.params.name === "get_component_code") {
      const componentName = request.params.arguments?.name;
      if (typeof componentName !== "string" || componentName.trim() === "") {
        return toolError(
          `Invalid "name" argument: expected a non-empty component name such as "button". ` +
            `Call list_components to see the available component names.`
        );
      }

      const item = registry.items.find((candidate) => candidate.name === componentName);
      if (!item) {
        return toolError(
          `Component "${componentName}" was not found. ` +
            `Call list_components to see the available component names.`
        );
      }

      return textResult(JSON.stringify(item.files, null, 2));
    }

    throw new Error(`Tool not found: ${request.params.name}`);
  });

  return server;
}

export async function startServer(): Promise<void> {
  const registry = loadRegistry();
  const server = createMcpServer(registry);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

function isExecutableEntryPoint(): boolean {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return realpathSync(entry) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isExecutableEntryPoint()) {
  startServer().catch((error: unknown) => {
    const reason = error instanceof Error ? error.message : String(error);
    process.stderr.write(`usalyt-mcp: ${reason}\n`, () => {
      process.exit(1);
    });
  });
}
