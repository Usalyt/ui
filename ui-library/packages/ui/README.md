# @tu-ui/ui (tu-ui) — Core Primitives Library

Biblioteca central de componentes UI para **tu-ui**, basada en primitives headless de **Base UI v1.x**, estilizada con **Tailwind CSS v4** y administrada con **Class Variance Authority (CVA)**.

## Características

- **36 Primitivas Headless + 3 UI Blocks**: Botones, diálogos, formularios, dropdowns, sheets, tooltips, etc.
- **Tailwind CSS v4 & OKLCH**: Paletas cromáticas basadas en `@theme` y colores OKLCH.
- **TypeScript 6 & Strict Typing**: Soporte completo de autocompletado y genéricos.
- **Accesibilidad 100%**: Cobertura total de `axe-core` / `vitest-axe` con 0 violaciones.
- **Directiva "use client"**: Todos los componentes interactivos listos para Next.js 15 App Router, React 19 (Vite) y Astro 7.

## Estructura del Paquete

```
packages/ui/
├── src/
│   ├── components/        # Componentes UI (button, dialog, input, etc.)
│   ├── lib/               # Utilidades globales (cn, cva helpers)
│   ├── hooks/             # Custom hooks compartidos
│   └── index.ts           # Exports públicos
├── styles/                # Estilos globales y tokens Tailwind v4
├── tsdown.config.ts       # Configuración de bundler tsdown
├── vitest.config.ts       # Configuración de pruebas unitarias
├── package.json
└── README.md              # Documentación de contexto
```

## Comandos

```bash
# Compilar paquete con tsdown
pnpm --filter tu-ui build

# Ejecutar pruebas unitarias (Vitest)
pnpm --filter tu-ui test:unit

# Ejecutar pruebas en modo watch
pnpm --filter tu-ui test:watch

# Generar reporte de cobertura de código
pnpm --filter tu-ui test:coverage

# Auditoría de bundle size por componente
pnpm --filter tu-ui audit:bundle-size
```
