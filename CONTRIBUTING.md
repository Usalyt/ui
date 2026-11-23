# Contributing to Usalyt

Thank you for contributing to Usalyt. This repository is a pnpm + Turborepo monorepo containing the UI component library, component registry, CLI, MCP server, shared configs, docs site, and Storybook.

## Quick path

**Prerequisites:** Node.js `>=20` (CI runs Node `24`) and `pnpm@10.2.0`.

1. Fork and clone the repository, then create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-change
   ```
2. Install dependencies with the frozen lockfile:
   ```bash
   pnpm install --frozen-lockfile
   ```
3. Build the workspace and run the verification gate:
   ```bash
   pnpm build
   pnpm check
   ```
4. Commit your changes in focused work units using Conventional Commits and open a pull request.

## Repository layout

| Path | Visibility | Purpose |
| --- | --- | --- |
| `packages/ui` (`@usalyt/ui`) | public | Core React component library, compiled stylesheet, and source distribution |
| `packages/registry` (`@usalyt/registry`) | public | Deterministic component registry generator and JSON Schema |
| `packages/cli` (`@usalyt/cli`) | public | `usalyt` CLI (`init`, `add`, `list`) |
| `packages/mcp-server` (`@usalyt/mcp-server`) | public | `usalyt-mcp` stdio Model Context Protocol server |
| `packages/tsconfig` (`@usalyt/tsconfig`) | public | Shared TypeScript presets (`base`, `react`, `next`) |
| `packages/eslint-config` (`@usalyt/eslint-config`) | public | Shared flat ESLint config (ESM and CommonJS) |
| `packages/tests` (`@usalyt/tests`) | private | Workspace integration smoke tests and Playwright a11y/E2E suites |
| `apps/docs` (`@usalyt/docs`) | private | Astro + Starlight documentation site |
| `apps/storybook` (`@usalyt/storybook`) | private | Storybook 10 visual catalog and sandbox |
| `scripts/` | private | Tarball packing, license validation, installed-consumer checks, and release scripts |

## Development and verification commands

Run all commands from the repository root:

| Task | Command |
| --- | --- |
| Start dev servers (all apps/packages) | `pnpm dev` |
| Start docs or Storybook only | `pnpm --filter @usalyt/docs dev` / `pnpm --filter @usalyt/storybook dev` |
| Build all workspaces | `pnpm build` |
| Type-check all workspaces | `pnpm type-check` |
| Lint all workspaces | `pnpm lint` |
| UI unit tests | `pnpm test:unit` |
| Workspace integration smoke tests | `pnpm test:integration` |
| Registry, CLI, MCP, and config suites | `pnpm test:registry`, `pnpm test:cli`, `pnpm test:mcp`, `pnpm test:configs` |
| Registry reproducibility check | `pnpm build:registry && pnpm --filter @usalyt/registry check` |
| UI package artifact contract | `pnpm --filter @usalyt/ui verify:artifacts:strict` |
| Full local gate (matches CI checks) | `pnpm check` |
| Workspace path, license, and release script tests | `node --test scripts/tests/*.test.mjs scripts/release/tests/*.test.mjs` |
| Pack and inspect all six public tarballs | `pnpm pack:public` |
| Verify tarballs in isolated Vite/Next/Astro/CLI/MCP consumers | `pnpm test:installed` |

Generated test and pack outputs live under `odd/artifacts/usalyt-npm-release/` and `packages/registry/registry.json`. Both are gitignored—never commit generated outputs, `.env*`, or `.npmrc`.

## Commit and PR guidelines

This repository uses **Conventional Commits** (`<type>(<scope>): <summary>` in English, imperative mood):

| Type | When to use | Example |
| --- | --- | --- |
| `feat` | New component, block, CLI command, or package capability | `feat(usalyt): add standalone component installation CLI` |
| `fix` | Bug fix in packages, tests, or CI | `fix(ci): run cli tests in a temporary directory` |
| `refactor` | Structural or internal code/workspace reorganization | `refactor(usalyt): promote monorepo workspace to repository root` |
| `docs` | Documentation-only changes | `docs(usalyt): add contributor guide` |
| `build` | Build pipeline, packaging, or release tooling | `build(usalyt): integrate public release and license checks` |
| `chore` | Maintenance, metadata alignment, or dependency updates | `chore(usalyt): align public source metadata and brand` |

**Commit slicing rules:**

- Commit by **reviewable work unit**, not by file type.
- Keep tests and user-facing docs in the same commit as the behavior they verify or document.
- Every commit should leave the repository in a coherent, buildable state.

## Licensing and release rules

- The workspace and five public packages (`@usalyt/ui`, `@usalyt/registry`, `@usalyt/cli`, `@usalyt/mcp-server`, `@usalyt/eslint-config`) are licensed **`GPL-3.0-only`**.
- `@usalyt/tsconfig` is the explicitly retained **`MIT`** exception.
- Every public package must preserve `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, `CHANGELOG.md`, and accurate `repository.directory` metadata (`packages/<name>`).
- All six public packages share a fixed version group (currently `0.0.1`). Do not bump only a subset of public packages.
- Do not publish manually on push. Releases are triggered via `.github/workflows/usalyt-release.yml` (`workflow_dispatch`) against the protected `npm-release` environment.

## Pull request checklist

Before requesting review, confirm:

- [ ] `pnpm install --frozen-lockfile` succeeds without unexpected lockfile churn
- [ ] `pnpm build` and `pnpm check` pass from the repository root
- [ ] `node --test scripts/tests/*.test.mjs scripts/release/tests/*.test.mjs` passes if you touched paths, licenses, workflows, or release scripts
- [ ] `pnpm pack:public` passes if you changed package manifests, exports, or published files
- [ ] New or changed components include unit tests and docs updates where applicable
- [ ] No secrets, `.env*`, `.npmrc`, or generated artifacts under `odd/` are tracked by Git

## Further reading

- Workspace overview and usage: [README.md](README.md)
- Packages reference: [packages/README.md](packages/README.md)
- Applications reference: [apps/README.md](apps/README.md)
- Release operations and recovery: [scripts/release/README.md](scripts/release/README.md)
