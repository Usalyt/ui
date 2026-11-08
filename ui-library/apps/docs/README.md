# @tu-ui/docs — Documentation Site

Sitio oficial de documentación interactivo para **tu-ui**, construido con **Astro 7**, **Starlight** y **React 19**.

## Tecnologías Utilizadas

- **Framework:** Astro 7 (`astro`)
- **Documentación Engine:** Starlight (`@astrojs/starlight`)
- **UI & Components:** React 19 (`@astrojs/react`)
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite` & `tailwindcss`)
- **Iconos:** Lucide React (`lucide-react`)
- **Componentes tu-ui:** Importados desde el workspace local (`tu-ui`)

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
pnpm --filter @tu-ui/docs dev

# Construir para producción
pnpm --filter @tu-ui/docs build

# Vista previa de la build de producción
pnpm --filter @tu-ui/docs preview
```
