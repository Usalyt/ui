import { describe, it, expect } from "vitest";
import { createMcpServer } from "./index";

describe("MCP Server", () => {
  it("initializes MCP Server instance correctly", () => {
    const server = createMcpServer();
    expect(server).toBeDefined();
  });
});
