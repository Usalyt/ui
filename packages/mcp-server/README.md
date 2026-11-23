# @usalyt/mcp-server

Standalone [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) stdio server for the Usalyt component registry. It exposes the packaged component catalog and source files to MCP-capable agents without requiring the Usalyt monorepo.

- Package: `@usalyt/mcp-server`
- Version: `0.0.1`
- License: `GPL-3.0-only`
- Node.js: `>=20`

## Install

```bash
pnpm add @usalyt/mcp-server
```

The package depends on `@usalyt/registry`, which ships the component registry data. Both are installed together.

## Executable

The install exposes the `usalyt-mcp` command, which runs `dist/index.mjs` with a Node.js shebang:

```bash
pnpm exec usalyt-mcp
```

The server speaks MCP over stdin/stdout, so it is normally started by an MCP client rather than by hand. It resolves the registry through Node package resolution, so the working directory does not matter.

## MCP client configuration

Point your MCP client at the installed executable. Using an absolute project path:

```json
{
  "mcpServers": {
    "usalyt": {
      "command": "node",
      "args": ["/absolute/path/to/your-project/node_modules/@usalyt/mcp-server/dist/index.mjs"],
      "cwd": "/absolute/path/to/your-project"
    }
  }
}
```

Clients that support `pnpm exec` can use:

```json
{
  "mcpServers": {
    "usalyt": {
      "command": "pnpm",
      "args": ["exec", "usalyt-mcp"],
      "cwd": "/absolute/path/to/your-project"
    }
  }
}
```

Any working directory is valid because the registry comes from the installed package, not from a relative path.

## Tools

### `list_components`

Lists every item in the packaged registry.

- Arguments: none
- Result: a text content block containing the registry `items` array as JSON.

### `get_component_code`

Returns the embedded source files for one registry item.

- Arguments:

  | Name   | Type     | Required | Description                          |
  | ------ | -------- | -------- | ------------------------------------ |
  | `name` | `string` | yes      | Non-empty component name, e.g. `button` |

- Result: a text content block containing the item's `files` array as JSON. Each file has `path`, `type`, and `content`.
- Unknown names and missing or non-string `name` values return a tool result with `isError: true` and an actionable message. The server process stays alive and keeps serving subsequent requests.

## stdout and stderr contract

- stdout carries only newline-delimited JSON-RPC MCP protocol frames. The server never logs to stdout.
- All diagnostics and fatal errors are written to stderr.
- If the packaged registry cannot be resolved, read, parsed, or validated, the process writes an actionable error to stderr and exits non-zero instead of serving an empty catalog.

## Errors

| Situation | Behavior |
| --------- | -------- |
| Unknown component name | Tool result with `isError: true`; process continues |
| Missing, empty, or non-string `name` | Tool result with `isError: true`; process continues |
| Unknown tool name | JSON-RPC error for that request; process continues |
| Missing or invalid packaged registry | stderr message naming `@usalyt/registry/registry.json`; non-zero exit |

Registry failures name the expected package export and tell you to reinstall `@usalyt/mcp-server` or `@usalyt/registry`.

## Packaged registry

The server resolves `@usalyt/registry/registry.json` through the installed package (Node package resolution plus `fs.readFileSync`) and performs no network access. Component sources are read from that package at runtime; they are not inlined into the server bundle. In a monorepo checkout without linked workspace packages, a development-only fallback looks for `packages/registry/registry.json`.

## License and source availability

The first-party code in this package is licensed `GPL-3.0-only`. The complete license text is in `LICENSE`. The corresponding source needed to rebuild the package is distributed in the npm tarball (`src/`, `tsdown.config.ts`, and the TypeScript configuration), and the repository metadata in `package.json` identifies the upstream location. Third-party dependency licenses and notices are recorded in `NOTICE` and `THIRD_PARTY_NOTICES.md`.

## Changelog

### 0.0.1

- Initial Usalyt release candidate under the `@usalyt/mcp-server` name and `usalyt-mcp` executable.
- Standalone registry resolution through `@usalyt/registry/registry.json`, independent of the working directory.
- Protocol-only stdout, stderr diagnostics, and non-zero exit on registry failure.
- Validated `get_component_code` input with actionable `isError` tool results.
- Real stdio protocol tests for initialization, tool calls, stdout purity, and missing-registry failure.

See `CHANGELOG.md` for the maintained changelog.
