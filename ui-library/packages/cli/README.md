# @tu-ui/cli — Component Distribution CLI

Herramienta CLI interactiva para la instalación y distribución modular de componentes **tu-ui** en proyectos de usuarios finales (similar a `shadcn` CLI).

## Tecnologías Utilizadas

- **CLI Framework:** `citty`
- **Prompts Interáctivos:** `@clack/prompts`
- **Colores de Terminal:** `picocolors`
- **Operaciones I/O de Archivos:** `fs-extra`
- **Bundler:** `tsdown`

## Uso

```bash
# Añadir un componente a un proyecto local
npx tu-ui add button

# Añadir múltiples componentes
npx tu-ui add dialog input label
```

## Estructura del Proyecto

```
packages/cli/
├── src/
│   ├── commands/          # Comandos CLI (add, init, etc.)
│   ├── utils/             # Helpers de descarga, inserción de código e I/O
│   └── index.ts           # Entrypoint binario (./dist/index.mjs)
├── tsdown.config.ts       # Configuración de build con tsdown
├── package.json
└── README.md              # Documentación de contexto
```

## Comandos de Desarrollo

```bash
# Compilar binario CLI
pnpm --filter @tu-ui/cli build
```
