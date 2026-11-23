# Monorepo Applications (`apps/`)

Este directorio contiene las aplicaciones web y entornos de visualización de **Usalyt**. Las aplicaciones son privadas y no se publican en npm.

## Contenido

| Aplicación | Stack | Propósito | README |
| --- | --- | --- | --- |
| **`docs`** | Astro 5.18 + Starlight + React 19 + Tailwind v4 | Sitio oficial de documentación interactiva de componentes y guías de uso. | [`apps/docs/README.md`](./docs/README.md) |
| **`storybook`** | Storybook 10 + Vite 6 + React 19 + Tailwind v4 | Catálogo visual interactivo, pruebas de accesibilidad y sandbox de componentes. | [`apps/storybook/README.md`](./storybook/README.md) |

## Comandos Generales

```bash
# Iniciar ambas apps en modo desarrollo (procesos en paralelo)
pnpm --filter "./apps/*" --parallel dev

# Iniciar únicamente el sitio de documentación
pnpm --filter @usalyt/docs dev

# Iniciar únicamente Storybook
pnpm --filter @usalyt/storybook dev

# Construir artefactos de producción de ambas apps
pnpm --filter "./apps/*" build
```
