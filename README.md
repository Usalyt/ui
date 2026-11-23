# Usalyt

Accessible, open-code React UI components built with [Base UI](https://base-ui.com) and [Tailwind CSS v4](https://tailwindcss.com).

Usalyt provides **60 accessible UI primitives** and **13 composed blocks** that you can consume as a standard npm library (`@usalyt/ui`), copy directly into your codebase with the CLI (`@usalyt/cli`), or query from AI coding tools through the Model Context Protocol server (`@usalyt/mcp-server`).

## Highlights

- **Accessible by default** — Built on Base UI headless primitives with full keyboard navigation and WAI-ARIA semantics.
- **Tailwind CSS v4, CSS-first** — Dark-first Midnight theme with semantic `@theme` tokens. Ship with the precompiled stylesheet (`@usalyt/ui/styles.css`, no Tailwind Preflight resets) or compile from raw source tokens.
- **Two adoption paths** — Install `@usalyt/ui` with dual ESM/CJS builds and per-component subpath imports, or own the source directly via `@usalyt/cli`.
- **AI-ready** — Includes `@usalyt/mcp-server` (`usalyt-mcp`) so editors and agents can discover components and retrieve source code over stdio MCP.
- **Cross-framework** — Supports React 18 and 19 across Vite, Next.js App Router, and Astro.

## Quick start

### Install the component library

```bash
pnpm add @usalyt/ui
```

```tsx
import { Button } from "@usalyt/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@usalyt/ui/card";
import "@usalyt/ui/styles.css";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usalyt</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Continue</Button>
      </CardContent>
    </Card>
  );
}
```

### Copy source with the CLI

```bash
pnpm dlx @usalyt/cli init
pnpm dlx @usalyt/cli add button
pnpm dlx @usalyt/cli add auth-form --yes
pnpm dlx @usalyt/cli list --json
```

### Use with an MCP-compatible editor or agent

```json
{
  "mcpServers": {
    "usalyt": {
      "command": "npx",
      "args": ["-y", "@usalyt/mcp-server"]
    }
  }
}
```

## Monorepo structure

| Workspace | Package | Description |
| --- | --- | --- |
| [`packages/ui`](packages/ui/README.md) | `@usalyt/ui` | 60 React primitives, 13 UI blocks, and compiled/raw stylesheets |
| [`packages/cli`](packages/cli/README.md) | `@usalyt/cli` | CLI to initialize projects and copy registry components into your codebase |
| [`packages/registry`](packages/registry/README.md) | `@usalyt/registry` | Deterministic component registry and JSON Schema |
| [`packages/mcp-server`](packages/mcp-server/README.md) | `@usalyt/mcp-server` | Stdio Model Context Protocol server (`usalyt-mcp`) |
| [`packages/tsconfig`](packages/tsconfig/README.md) | `@usalyt/tsconfig` | Shared TypeScript presets (`base`, `react`, `next`) |
| [`packages/eslint-config`](packages/eslint-config/README.md) | `@usalyt/eslint-config` | Shared flat ESLint config for TypeScript and React |
| [`apps/docs`](apps/docs/README.md) | `@usalyt/docs` | Astro + Starlight documentation site |
| [`apps/storybook`](apps/storybook/README.md) | `@usalyt/storybook` | Interactive Storybook component catalog |

## Local development

Requires Node.js `>=20` and `pnpm@10.2.0`.

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm dev     # starts docs and Storybook
pnpm check   # runs type-check, unit/integration/package tests, and artifact checks
```

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for workspace commands, commit conventions, and pull request requirements.

## License

Licensed under [GPL-3.0-only](LICENSE) (`MIT` for [`@usalyt/tsconfig`](packages/tsconfig/LICENSE)). See [NOTICE](NOTICE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for details.
