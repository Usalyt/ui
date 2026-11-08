# @usalyt/eslint-config

Shared flat ESLint configuration for Usalyt TypeScript and React projects. The package exports one flat config array that registers the TypeScript parser, the TypeScript ESLint plugin, the React hooks plugins, and the JSX accessibility plugin.

## Installation

```bash
pnpm add -D @usalyt/eslint-config eslint typescript
```

- `eslint` is a peer dependency: `>=9`. Flat config is an ESLint 9 feature, and earlier ESLint versions are not supported.
- `typescript` is required by the bundled `@typescript-eslint/parser`. The installed parser declares `>=4.8.4 <6.1.0`; this package is tested with `typescript@6.0.0`.
- The plugins (`@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-plugin-react-hooks`, and `eslint-plugin-jsx-a11y`) are package dependencies. Consumers do not install them separately.

The declared Node.js engine is `>=20`.

## Usage

With an ESM config file (`eslint.config.mjs`):

```js
import usalytConfig from "@usalyt/eslint-config";

export default usalytConfig;
```

With a CommonJS config file (`eslint.config.cjs`):

```js
const usalytConfig = require("@usalyt/eslint-config");

module.exports = usalytConfig;
```

When composing with other configs, spread the array:

```js
import usalytConfig from "@usalyt/eslint-config";

export default [
  ...usalytConfig,
  {
    rules: {
      "no-console": "warn"
    }
  }
];
```

## Entry points

The package ships two entries that expose the same flat config array:

| File | Module format | Use |
| --- | --- | --- |
| `index.mjs` | ES module | `import` from `eslint.config.mjs` or any ESM consumer. |
| `index.js` | CommonJS | `require` from `eslint.config.cjs` or any CommonJS consumer. |

The `.mjs` extension makes the ESM entry explicit, so it does not depend on Node module-syntax detection. `index.js` is valid CommonJS and keeps legacy `main` resolution working without a `"type": "module"` declaration.

## Behavior

The config applies to `**/*.{ts,tsx}` only. JavaScript and JSX files are intentionally outside the current scope, and the config does not enable type-aware linting or declare global variables.

Parser settings: `@typescript-eslint/parser` with `ecmaVersion: "latest"`, `sourceType: "module"`, and JSX enabled.

Configured rules:

| Rule | Severity | Notes |
| --- | --- | --- |
| `@typescript-eslint/no-unused-vars` | `error` | Arguments whose names start with `_` are ignored. |
| `react-hooks/rules-of-hooks` | `error` | Enforces the Rules of Hooks. |
| `react-hooks/exhaustive-deps` | `warn` | Warns about incomplete dependency arrays. |
| `jsx-a11y/alt-text` | `error` | Requires alternative text for images. |

## Development checks

The repository-only checks are not part of the published allowlist:

```bash
node scripts/smoke.mjs   # isolated consumer under .tmp/consumer, valid and invalid lint runs
node --test test/        # entry parity, consumer import, manifest allowlist, lint behavior
```

The smoke check runs the package-local ESLint binary against an isolated consumer that imports `@usalyt/eslint-config` by package name. It asserts a clean file passes and that a missing image `alt` attribute reports `jsx-a11y/alt-text`.

## License

This package is licensed under `GPL-3.0-only`. The complete license text is in `LICENSE`. There is no warranty, to the extent permitted by law.

### Source availability

The published tarball includes the config entries and the metadata needed to rebuild and modify the package. The repository metadata points to `https://github.com/Usalyt/ui` under `usalyt/packages/eslint-config`. If the repository is not publicly accessible, the source included in the tarball remains the corresponding-source channel for GPL recipients.

### Third-party notices

The bundled lint plugins are third-party MIT-licensed packages. Their licenses and copyright notices are recorded in `THIRD_PARTY_NOTICES.md`. The Usalyt workspace licensing decision is recorded in `NOTICE`.

## Changelog

### 0.0.1

- Initial release candidate for `@usalyt/eslint-config`.
- Added an explicit ESM entry (`index.mjs`) alongside a valid CommonJS entry (`index.js`); both export the same flat config array.
- Preserved the existing TypeScript, React hooks, and JSX accessibility rules and plugins.
- Added an external-consumer smoke check and automated entry/manifest/lint checks.
- Documented installation, supported entries, rule behavior, license, and source availability.

This is an initial `0.0.1` release candidate. It is not a stability or compatibility guarantee.
