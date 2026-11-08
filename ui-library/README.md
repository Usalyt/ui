# Usalyt

Usalyt is a source-owned component platform for React: accessible Base UI primitives and composed blocks styled with Tailwind CSS v4 and distributed through npm, a component registry, a CLI, and a Model Context Protocol server.

## Release status

The six public packages are **0.0.1 release candidates**. They are packed and verified as installed artifacts but are **not published**. npm scope ownership, name availability, account access, and credentials are external prerequisites and are not assumed or exercised by this repository.

| Package | Visibility | Purpose |
| --- | --- | --- |
| `@usalyt/ui` | public | Component library, compiled stylesheet, source distribution |
| `@usalyt/registry` | public | Versioned component registry and JSON Schema |
| `@usalyt/cli` | public | `usalyt` project initialization and component installation |
| `@usalyt/mcp-server` | public | `usalyt-mcp` stdio Model Context Protocol server |
| `@usalyt/tsconfig` | public | Shared TypeScript presets (`base`, `react`, `next`) |
| `@usalyt/eslint-config` | public | Shared flat ESLint config (ESM and CommonJS entries) |
| root, `apps/*`, `packages/tests`, fixtures | private | Workspace development only |

## Requirements

- Node.js `>=20` (the installed-artifact suite ran on Node `26.13.0`).
- pnpm 10 for the workspace; consumers may use any Node package manager that understands npm packages.
- React `^18.0.0 || ^19.0.0` for `@usalyt/ui`. React 18.3.1 and React 19.3.1 were both verified in installed Vite consumers.
- Tailwind CSS v4 is optional for consumers who import the compiled stylesheet and required only when compiling the raw source stylesheet or installing registry source that uses Tailwind classes.

## Quick start

```bash
pnpm add @usalyt/ui
```

```tsx
import { Button } from "@usalyt/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@usalyt/ui/card";
import "@usalyt/ui/styles.css";

export function Example() {
  return (
    <Card>
      <CardHeader><CardTitle>Usalyt</CardTitle></CardHeader>
      <CardContent><Button>Continue</Button></CardContent>
    </Card>
  );
}
```

The root barrel and every component/block subpath are dual ESM/CJS entries with matching declarations and a preserved `"use client"` boundary. The compiled `styles.css` contains the Usalyt theme and component utilities without Tailwind Preflight, so importing it does not reset the host page. The raw `styles/globals.css` and `styles/theme.css` are available for consumers who want to compile their own theme. Inter is bundled under the SIL Open Font License; Berkeley Mono is not bundled and is referenced only through `local()` with documented fallbacks.

## CLI

```bash
pnpm dlx @usalyt/cli init
pnpm dlx @usalyt/cli add button
pnpm dlx @usalyt/cli add auth-form --yes
pnpm dlx @usalyt/cli list --json
```

`usalyt init` creates `usalyt.json` with component and utility aliases. `usalyt add` resolves the installed registry, installs registry dependencies recursively, rewrites relative imports, rejects destinations outside the project, preserves existing files unless `--overwrite` is passed, and prints the exact `pnpm add ...` dependency command. It executes that command only with `--install` and explicit confirmation. `usalyt list --json` returns the packaged registry for scripts and agents.

## MCP server

```json
{
  "mcpServers": {
    "usalyt": {
      "command": "npx",
      "args": ["-y", "@usalyt/mcp-server"]
    }
  }
}
```

The `usalyt-mcp` executable resolves the installed registry, writes protocol frames only to stdout, sends diagnostics to stderr, validates tool arguments, and returns actionable `isError` results without terminating the session.

## Shared configs

```json
{
  "extends": "@usalyt/tsconfig/react.json"
}
```

```js
// eslint.config.mjs
import config from "@usalyt/eslint-config";
export default config;
```

## Development

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm type-check
pnpm test:unit          # UI unit suite
pnpm test:registry      # registry schema/determinism suite
pnpm test:cli           # packaged CLI behavior
pnpm test:mcp           # real MCP stdio protocol
pnpm test:configs       # external config smoke checks
pnpm test:installed     # pack + install + Vite/Next/Astro/CLI/MCP verification
pnpm pack:public        # pack and inspect the six public tarballs
pnpm check              # type-check, package suites, registry check, artifact gate
```

Installed-artifact evidence is written under `odd/artifacts/usalyt-npm-release/` at the repository root. OpenSpec governs changes under `openspec/`; validate with `openspec validate <change-name> --strict`.

## Release and publishing

The release workflow is `.github/workflows/usalyt-release.yml`. It is manual (`workflow_dispatch`) and bound to a protected environment named `npm-release` with required reviewers. It never publishes on push. CI uses `pnpm install --frozen-lockfile`, build, type-check, package tests, registry check, and tarball inspection.

### Minimum npm permissions and prerequisites

1. The `@usalyt` npm organization/scope must exist and be owned by the release owner. Scope creation and name availability are external actions and are not performed here.
2. Every maintainer account with publish rights must have 2FA enabled. Prefer a dedicated granular automation token limited to the six package names and publish operations; do not grant organization-wide automation or billing permissions.
3. Each package must be public (`publishConfig.access: "public"`). No placeholder packages, name reservations, or ownership changes are performed by this repository.
4. Protect the `npm-release` environment with required reviewers and restrict who can run the workflow. The workflow receives `NODE_AUTH_TOKEN` only from that environment.
5. Per-package trusted publisher/OIDC: npm's trusted-publisher flow requires an OIDC-capable publish client. pnpm 10.2.0 does not document a complete npm trusted-publisher exchange, and this repository has not verified it. The workflow requests `id-token: write` and supports `--provenance`, but the token-based protected-environment path is the verified baseline. Validate OIDC end-to-end with a pre-release version before relying on it; do not claim OIDC compatibility without that evidence.

### Partial-release recovery

1. Never republish or overwrite an existing version. npm rejects duplicate versions and the repository must not attempt `--force`.
2. If only some packages published, inspect the published set, then rerun the workflow for the missing packages only. `scripts/release/publish-public-packages.mjs` checks `pnpm view <name>@<version> version` and skips packages that already exist.
3. If a published package needs a code change, bump the fixed version group (for example to `0.0.2`), update every public changelog, and publish the new version. Do not delete or unpublish the old version as a recovery mechanism.
4. A failed build or test run publishes nothing: the workflow runs verification before publication.

### Source availability and licensing

The `ui-library` workspace and five of the six public packages are licensed `GPL-3.0-only`. `@usalyt/tsconfig` is the package-scoped exception and is licensed `MIT`, retaining its original declaration by explicit owner decision. Each tarball includes its full license text, `NOTICE`, `THIRD_PARTY_NOTICES.md`, its changelog, and its TypeScript/JavaScript source or configuration inputs needed to rebuild it. The repository URL used in package metadata is `https://github.com/save/ux-check` (the URL already referenced by the docs); this checkout has no configured Git remote, so it could not be independently verified. If that repository is not publicly accessible, the source included in the tarballs remains available to recipients.

The wider repository root README still declares the UX Check project proprietary. That statement is outside this workspace's scope and must be reconciled by the repository owner before publication.

## License

GPL-3.0-only for the workspace and five public packages; MIT for `@usalyt/tsconfig`. See each package `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`. Third-party components and fonts retain their own licenses; Berkeley Mono is not bundled.
