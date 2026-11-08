# tu-ui — Base UI + Tailwind v4 Component Platform

### Compatible con Next.js 15+ · React 19+ (Vite) · Astro 7+

Una plataforma de distribución de componentes primitives headless (vía Base UI v1.x) y estilos en Tailwind CSS v4, inspirada en shadcn/ui con soporte nativo para los frameworks principales de React.

---

## 📚 Documentación de Contexto & Agentes

- **Instrucciones para Agentes AI:** [`AGENTS.md`](./AGENTS.md)
- **Especificaciones SDD (OpenSpec):** [`openspec/`](./openspec/) (`openspec/project.md` y `openspec/specs/`)
- **Sistema de Diseño & Tokens:** [`DESIGN.md`](./DESIGN.md)
- **Aplicaciones Monorepo (`apps/`):** [`apps/README.md`](./apps/README.md)
- **Paquetes Monorepo (`packages/`):** [`packages/README.md`](./packages/README.md)

---

## 🚀 Arquitectura del Monorepo

### Aplicaciones (`apps/`)

- [`apps/docs`](./apps/docs/README.md): Sitio de documentación interactivo (Astro 7 + Starlight).
- [`apps/storybook`](./apps/storybook/README.md): Catálogo visual interactivo y sandbox (Storybook 10).

### Paquetes (`packages/`)

- [`packages/ui`](./packages/ui/README.md): Biblioteca core con 59 primitivas UI + 13 UI Blocks (`tu-ui` / `@tu-ui/ui`).
- [`packages/cli`](./packages/cli/README.md): CLI interactivo (`npx tu-ui add <component>`) que instala primitivas, Blocks y sus dependencias del registry.
- [`packages/mcp-server`](./packages/mcp-server/README.md): Servidor MCP (Model Context Protocol) para integración nativa con agentes de IA (Cursor, Claude Code, Antigravity).
- [`packages/registry`](./packages/registry/README.md): Definición e indexación en `registry.json` (esquema compatible con `shadcn` CLI) con primitivas, Blocks y la utilidad `utils`.
- [`packages/tests`](./packages/tests/README.md): Pruebas de integración automatizadas cross-framework en Next.js 15, Vite + React 19 y Astro 7.
- [`packages/eslint-config`](./packages/eslint-config/README.md): Configuración de ESLint compartida del monorepo.
- [`packages/tsconfig`](./packages/tsconfig/README.md): Configuraciones base de TypeScript 6.0 compartidas.

---

## 🛠️ Comandos Principales

```bash
# Compilar todos los paquetes y aplicaciones
pnpm build

# Verificación de tipos TypeScript 6.0
pnpm type-check

# Pruebas unitarias (Vitest + spy global console.warn/error de Base UI)
pnpm test:unit

# Pruebas de integración cross-framework (Next.js 15, Vite, Astro 7)
pnpm test:integration

# Auditoría de bundle size por componente (<5kb, <15kb, <30kb)
pnpm --filter tu-ui audit:bundle-size

# Reconstruir registry.json
pnpm build:registry
```

---

## ✅ Criterios de Release Gate (v1.0.0 GA)

- [x] **59 primitivas core + 13 UI blocks** totalmente implementados con CVA y Tailwind v4.
- [x] **398/398 pruebas unitarias pasando** con 0 warnings o errores de consola.
- [x] **Pruebas de integración cross-framework pasando** en Next.js 15, Vite + React 19 y Astro 7.
- [x] **Auditoría de bundle size cumplida**: 0 violaciones de límites (<5 KB simples, <15 KB medianos, <30 KB complejos).
- [x] **Servidor MCP y CLI operativos** para distribución y desarrollo asistido por IA.
- [x] **Mapeo de Figma Kit** documentado y sincronizado con tokens `@theme` OKLCH.
