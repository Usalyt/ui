import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";

const REGISTRY_PATH = path.resolve(
  process.cwd(),
  "../../packages/registry/registry.json"
);

export function createMcpServer() {
  const server = new Server(
    {
      name: "tu-ui",
      version: "0.1.0"
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
        description: "List all UI components and blocks available in the registry"
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

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    let registryData = { items: [] as any[] };
    if (fs.existsSync(REGISTRY_PATH)) {
      registryData = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
    }

    if (request.params.name === "list_components") {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(registryData.items, null, 2)
          }
        ]
      };
    }

    if (request.params.name === "get_component_code") {
      const componentName = request.params.arguments?.name;
      const item = registryData.items.find((i: any) => i.name === componentName);

      if (!item) {
        return {
          content: [
            {
              type: "text",
              text: `Component "${componentName}" not found in registry.`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(item.files, null, 2)
          }
        ]
      };
    }

    throw new Error(`Tool not found: ${request.params.name}`);
  });

  return server;
}

export async function startServer() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch(console.error);
}
