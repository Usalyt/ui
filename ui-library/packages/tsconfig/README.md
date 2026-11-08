# @tu-ui/tsconfig — Shared TypeScript Configurations

Configuraciones base de **TypeScript 6.0** (`tsconfig.json`) compartidas por los paquetes y aplicaciones del monorepo **tu-ui**.

## Configuraciones Expuestas

- `base.json`: Opciones estrictas comunes de TypeScript (`strict`, `target: ES2022`, `moduleResolution: Bundler`).
- `react-library.json`: Ajustes optimizados para librerías React 19 y JSX.
- `nextjs.json`: Ajustes de tipos para aplicaciones Next.js.
- `astro.json`: Ajustes de tipos para aplicaciones Astro 7.

## Estructura del Proyecto

```
packages/tsconfig/
├── base.json
├── react-library.json
├── nextjs.json
├── astro.json
├── package.json
└── README.md              # Documentación de contexto
```
