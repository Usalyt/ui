# @usalyt/docs — Documentation Site

Sitio oficial de documentación interactivo para **Usalyt**, construido con **Astro 5.18**, **Starlight** y **React 19**.

## Tecnologías Utilizadas

- **Framework:** Astro 5.18 (`astro`)
- **Documentación Engine:** Starlight (`@astrojs/starlight`)
- **UI & Components:** React 19 (`@astrojs/react`)
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite` & `tailwindcss`)
- **Iconos:** Lucide React (`lucide-react`)
- **Componentes Usalyt:** Importados desde el workspace local (`@usalyt/ui`)

## Estructura del Proyecto

```
apps/docs/
├── src/
│   ├── content/
│   │   └── docs/          # Páginas de documentación escritas en MDX/Markdown
│   ├── components/        # Componentes interactivos de demostración
│   └── styles/            # Estilos globales y configuración de Tailwind CSS v4
├── astro.config.mjs       # Configuración de Astro y Starlight
├── package.json
└── README.md              # Documentación de contexto
```

## Comandos

```bash
# Iniciar servidor de desarrollo (Astro dev)
pnpm --filter @usalyt/docs dev

# Construir para producción
pnpm --filter @usalyt/docs build

# Vista previa de la build de producción
pnpm --filter @usalyt/docs preview
```
