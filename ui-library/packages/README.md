# Monorepo Packages (`packages/`)

Este directorio contiene los paquetes y bibliotecas compartidas de **tu-ui**.

## Paquetes Disponibles

| Paquete | Propósito | README |
| --- | --- | --- |
| **`ui`** (`tu-ui` / `@tu-ui/ui`) | Core component library with 36 headless primitives and 3 UI blocks. | [`packages/ui/README.md`](./ui/README.md) |
| **`cli`** (`@tu-ui/cli`) | Interactive CLI tool (`npx tu-ui add <component>`). | [`packages/cli/README.md`](./cli/README.md) |
| **`mcp-server`** (`@tu-ui/mcp-server`) | Model Context Protocol server for AI coding agents. | [`packages/mcp-server/README.md`](./mcp-server/README.md) |
| **`registry`** (`@tu-ui/registry`) | Registry metadata generator and builder (`registry.json`). | [`packages/registry/README.md`](./registry/README.md) |
| **`tests`** (`@tu-ui/tests`) | Cross-framework integration suite (Next.js 15, Vite + React 19, Astro 7). | [`packages/tests/README.md`](./tests/README.md) |
| **`eslint-config`** (`@tu-ui/eslint-config`) | Shared ESLint linting configurations. | [`packages/eslint-config/README.md`](./eslint-config/README.md) |
| **`tsconfig`** (`@tu-ui/tsconfig`) | Shared TypeScript configurations. | [`packages/tsconfig/README.md`](./tsconfig/README.md) |

## Comandos Principales

```bash
# Compilar todos los paquetes
pnpm --filter "./packages/*" build

# Ejecutar pruebas unitarias de componentes
pnpm --filter tu-ui test:unit

# Reconstruir registry.json
pnpm --filter @tu-ui/registry build
```
