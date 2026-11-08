# Usalyt

Usalyt is an open-code React UI component platform built with Base UI and Tailwind CSS v4. Its pnpm workspace is in [`usalyt/`](usalyt/README.md), with the UI library, component registry, CLI, MCP server, documentation, and Storybook.

```bash
cd usalyt
pnpm install --frozen-lockfile
pnpm build
pnpm check
```

See the [workspace guide](usalyt/README.md), [packages](usalyt/packages/README.md), and [changelog](usalyt/CHANGELOG.md). This repository contains **Usalyt source and history only**.

## Licenses

The workspace and five public packages use [GPL-3.0-only](LICENSE). [`@usalyt/tsconfig`](usalyt/packages/tsconfig/LICENSE) is the explicitly retained MIT exception. Consult package-specific `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md` files and the [workspace notice](usalyt/NOTICE) for third-party terms.

Public source on GitHub does not mean the six npm packages have been published. GitHub CI never publishes on push; the npm release workflow is manual and requires separately configured approvals and credentials. Independent installed-browser and external-config proof remains outstanding.
