# @usalyt/storybook — Visual Catalog & Sandbox

Catálogo visual interactivo y sandbox de pruebas para todos los componentes de **Usalyt**, construido con **Storybook 10** y **Vite 6**.

## Tecnologías Utilizadas

- **Storybook:** Storybook 10 (`@storybook/react`, `@storybook/react-vite`)
- **Accessibility Audit:** `@storybook/addon-a11y`
- **Documentación:** `@storybook/addon-docs`
- **Framework & Runtime:** React 19 + Vite 6
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`)

## Estructura del Proyecto

```
apps/storybook/
├── .storybook/            # Configuración de Storybook (main.ts, preview.ts)
├── package.json
└── README.md              # Documentación de contexto
```

Las historias de primitivas y Blocks viven junto a su código fuente en `packages/ui/src/**/*.stories.tsx` y se descubren desde la configuración de Storybook.

## Comandos

```bash
# Iniciar Storybook en puerto 6006
pnpm --filter @usalyt/storybook dev

# Construir sitio estático de Storybook
pnpm --filter @usalyt/storybook build
```

## Solución de problemas

### `resolveDispatcher() is null` en el decorador de tema

Los decoradores de Storybook se ejecutan dentro del contexto de hooks de Storybook, no dentro del dispatcher de React. Llamar directamente a un hook de React (por ejemplo `React.useEffect`) puede fallar con `can't access property "useEffect", resolveDispatcher() is null`.

Usa los hooks públicos de `storybook/preview-api` dentro de los decoradores y conserva `React` para crear elementos:

```ts
import { useEffect } from "storybook/preview-api";

const withTheme: Decorator = (Story, context) => {
  useEffect(() => {
    document.documentElement.dataset.theme = context.globals.theme || "dark";
  }, [context.globals.theme]);

  return React.createElement(Story);
};
```

Los comandos de desarrollo y build no cambian.
