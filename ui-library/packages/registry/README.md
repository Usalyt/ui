# @tu-ui/registry — Registry Builder & Definitions

Paquete encargado de la definición, escaneo e indexación del archivo `registry.json` de **tu-ui** (esquema compatible con `shadcn` CLI).

## Descripción

Escanea los código fuente en `packages/ui` y genera la metadata de componentes, dependencias de paquetes, estilos Tailwind y hooks requeridos para permitir la instalación desacoplada vía `@tu-ui/cli`.

## Tecnologías Utilizadas

- **TypeScript Runner:** `tsx`
- **File System:** `fs-extra`

## Estructura del Proyecto

```
packages/registry/
├── scripts/
│   └── build-registry.ts # Script generador de registry.json
├── package.json
└── README.md              # Documentación de contexto
```

## Comandos

```bash
# Reconstruir registry.json
pnpm --filter @tu-ui/registry build
```
