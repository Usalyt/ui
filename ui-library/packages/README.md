# Monorepo Packages (`packages/`)

Este directorio contiene los paquetes y bibliotecas compartidas de **Usalyt**. Los paquetes públicos forman el grupo fijo `0.0.1`; el paquete de pruebas permanece privado.

## Paquetes Disponibles

| Paquete | Visibilidad | Propósito | README |
| --- | --- | --- | --- |
| **`ui`** (`@usalyt/ui`) | pública | Biblioteca core con 60 primitivas headless y 13 UI Blocks. | [`packages/ui/README.md`](./ui/README.md) |
| **`cli`** (`@usalyt/cli`) | pública | CLI de distribución (`usalyt init`, `usalyt add`, `usalyt list`). | [`packages/cli/README.md`](./cli/README.md) |
| **`mcp-server`** (`@usalyt/mcp-server`) | pública | Servidor Model Context Protocol (`usalyt-mcp`) para agentes de IA. | [`packages/mcp-server/README.md`](./mcp-server/README.md) |
| **`registry`** (`@usalyt/registry`) | pública | Registry determinista de 74 ítems y su JSON Schema. | [`packages/registry/README.md`](./registry/README.md) |
| **`tests`** (`@usalyt/tests`) | privada | Verificación de artefactos npm instalados y suite Playwright de interacción/accesibilidad. | [`packages/tests/README.md`](./tests/README.md) |
| **`eslint-config`** (`@usalyt/eslint-config`) | pública | Configuración ESLint flat compartida (entradas ESM y CommonJS). | [`packages/eslint-config/README.md`](./eslint-config/README.md) |
| **`tsconfig`** (`@usalyt/tsconfig`) | pública | Presets TypeScript compartidos (`base`, `react`, `next`). | [`packages/tsconfig/README.md`](./tsconfig/README.md) |

## Comandos Principales

Ejecutar desde `ui-library/`:

```bash
# Compilar todos los paquetes y apps del workspace
pnpm build

# Verificar tipos
pnpm type-check

# Pruebas unitarias de componentes
pnpm test:unit

# Pruebas del registry, CLI, MCP y configs
pnpm test:registry
pnpm test:cli
pnpm test:mcp
pnpm test:configs

# Reconstruir registry.json y verificar reproducibilidad
pnpm build:registry
pnpm --filter @usalyt/registry check

# Instalar los tarballs empaquetados en consumidores aislados
pnpm pack:public
pnpm test:installed
```
