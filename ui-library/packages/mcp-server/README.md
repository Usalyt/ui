# @tu-ui/mcp-server — Model Context Protocol Server

Servidor **Model Context Protocol (MCP)** para la integración nativa de **tu-ui** con agentes de Inteligencia Artificial (Antigravity, Cursor, Claude Code).

## Características

- Exposición de especificaciones OpenSpec de componentes (`openspec/specs/`).
- Búsqueda y descubrimiento de componentes, variaciones CVA y ejemplos de uso para LLMs.
- Soporte para herramientas MCP (tools) y recursos (resources) estructurados.

## Tecnologías Utilizadas

- **MCP SDK:** `@modelcontextprotocol/sdk` (v1.6.0)
- **Bundler:** `tsdown`
- **Testing:** `vitest`

## Estructura del Proyecto

```
packages/mcp-server/
├── src/
│   ├── tools/             # Implementación de tools MCP
│   ├── resources/         # Recursos exposed (specs, tokens)
│   └── index.ts           # Entrypoint del servidor MCP
├── tsdown.config.ts       # Configuración de tsdown
├── package.json
└── README.md              # Documentación de contexto
```

## Comandos

```bash
# Compilar paquete
pnpm --filter @tu-ui/mcp-server build

# Iniciar servidor MCP en modo watch
pnpm --filter @tu-ui/mcp-server dev

# Ejecutar pruebas unitarias
pnpm --filter @tu-ui/mcp-server test:unit
```
