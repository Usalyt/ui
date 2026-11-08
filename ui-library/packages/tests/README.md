# @usalyt/tests — Workspace Integration Smoke Suite

This private package contains fast workspace-level smoke tests and the Playwright end-to-end/a11y suite for the Usalyt component platform.

## What lives here

- `src/cli-registry.test.ts` — fast registry data and CLI smoke checks against the workspace build.
- `e2e/**` — Playwright interaction and accessibility suites for Storybook.
- `scripts/docs-a11y.mjs` — axe audit for the built docs site.

The authoritative npm-readiness suite is **not** a source-copy fixture. It lives at `../../scripts/verify-installed.mjs` and is run from the `ui-library` workspace root:

```bash
pnpm test:installed
```

That script packs all six public packages, installs the tarballs into isolated consumers under `odd/artifacts/usalyt-npm-release/consumers`, and verifies TypeScript resolution, ESM/CJS imports, compiled CSS, React 18/19 Vite builds, a Next.js App Router build, an Astro build, CLI commands and path guards, real MCP stdio traffic, and the external TypeScript/ESLint configs.

## Commands

```bash
# Fast workspace smoke tests
pnpm --filter @usalyt/tests test

# Playwright interaction and a11y suites
pnpm --filter @usalyt/tests test:e2e

# Full installed-artifact verification (from ui-library/)
pnpm test:installed
```

Source-copy assertions are not accepted as proof that a package works when installed from npm.
