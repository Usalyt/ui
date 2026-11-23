# Changelog

All notable changes to this package are recorded here. The Usalyt package set uses the fixed `0.0.1` version group until a deliberate versioning change is approved.

## 0.0.1 — 2026-11-07

### Added

- Initial Usalyt release candidate for `@usalyt/mcp-server`.
- `usalyt-mcp` executable with a Node.js shebang and executable permissions.
- Registry resolution through `@usalyt/registry/registry.json`, independent of the working directory.
- Protocol-only stdout, stderr diagnostics, and non-zero exit when the packaged registry is missing or invalid.
- Validated `get_component_code` arguments with actionable `isError` tool results.
- Real stdio protocol tests for initialization, tool calls, stdout purity, and registry failures.
- `GPL-3.0-only` license text and source-availability documentation.
- Package README with installation, supported imports, and release notes.

### Notes

- This is an initial `0.0.1` release candidate. It is not a stability or compatibility guarantee.
