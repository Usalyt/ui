# Changelog

All notable changes to the Usalyt package set are recorded here. Public packages follow the fixed `0.0.1` version group until a deliberate versioning change is approved.

## 0.0.1 — 2026-11-07

### Added

- Usalyt `@usalyt/*` public package identities for the UI library, registry, CLI, MCP server, TypeScript configs, and ESLint configs.
- `GPL-3.0-only` licensing for the workspace and five of the six public packages, with a package-scoped `MIT` exception for `@usalyt/tsconfig`; per-package license files, source-availability guidance, and third-party notices.
- Package READMEs, changelogs, metadata, and release documentation for the initial npm release candidate.
- Installed-artifact verification for the public packages.

### Changed

- The workspace identity, documentation, apps, and internal dependency references now use Usalyt.
- The UI package exports, type declarations, client boundaries, and stylesheet output match the built artifact.
- The registry is a standalone data package with an embedded schema.
- The CLI and MCP server resolve the packaged registry instead of reading the working directory.

### Security

- The CLI confines consumer paths, refuses silent overwrites, and requires explicit dependency-install consent.
- Release publication is gated by a protected, manually dispatched workflow.
