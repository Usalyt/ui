# Monorepo Applications (`apps/`)

Este directorio contiene las aplicaciones web y entornos de visualización de **tu-ui**.

## Contenido

| Aplicación | Stack | Propósito | README |
| --- | --- | --- | --- |
| **`docs`** | Astro 7 + Starlight + React 19 + Tailwind v4 | Sitio oficial de documentación interactiva de componentes y guías de uso. | [`apps/docs/README.md`](./docs/README.md) |
| **`storybook`** | Storybook 10 + Vite 6 + React 19 + Tailwind v4 | Catálogo visual interactivo, pruebas de accesibilidad y sandbox de componentes. | [`apps/storybook/README.md`](./storybook/README.md) |

## Comandos Generales

```bash
# Iniciar todas las apps en modo desarrollo
pnpm --filter "@tu-ui/*" dev

# Iniciar únicamente el sitio de documentación
pnpm --filter @tu-ui/docs dev

# Iniciar únicamente Storybook
pnpm --filter @tu-ui/storybook dev

# Construir artefactos de producción de todas las apps
pnpm --filter "@tu-ui/*" build
```
