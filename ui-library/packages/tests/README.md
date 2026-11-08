# @tu-ui/tests — Cross-Framework Integration Suite

Suite de pruebas de integración automatizadas e itinerarios E2E para verificar la compatibilidad cross-framework de los componentes de **tu-ui**.

## Cobertura de Frameworks

- **Next.js 15+** (App Router & SSR)
- **Vite 6 + React 19+**
- **Astro 7+**

## Tecnologías Utilizadas

- **Unit/Integration Runner:** Vitest (`vitest`)
- **End-to-End Runner:** Playwright (`@playwright/test`)
- **Accessibility Testing:** `@axe-core/playwright`

## Estructura del Proyecto

```
packages/tests/
├── e2e/                   # Pruebas End-to-End con Playwright
├── integration/           # Matriz de compatibilidad por framework
├── package.json
└── README.md              # Documentación de contexto
```

## Comandos

```bash
# Ejecutar suite de pruebas de integración
pnpm --filter @tu-ui/tests test

# Ejecutar pruebas End-to-End con Playwright
pnpm --filter @tu-ui/tests test:e2e

# Abrir UI interactiva de Playwright
pnpm --filter @tu-ui/tests test:e2e:ui
```
