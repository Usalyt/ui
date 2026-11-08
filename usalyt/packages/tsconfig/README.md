# @usalyt/tsconfig

Shared TypeScript configuration presets for Usalyt projects. The package ships JSON-only presets, so it has no runtime dependencies and no build step.

## Supported presets

| Import | Extends | Purpose |
| --- | --- | --- |
| `@usalyt/tsconfig/base.json` | none | Strict ES2022 baseline with `module`/`moduleResolution` set to `NodeNext`, DOM libraries, declarations, source maps, and `isolatedModules`. |
| `@usalyt/tsconfig/react.json` | `./base.json` | React and JSX settings: `module: ESNext`, `moduleResolution: Bundler`, `jsx: react-jsx`, and `jsxImportSource: react`. |
| `@usalyt/tsconfig/next.json` | `./react.json` | Next.js application settings: `allowJs`, `noEmit`, `incremental`, and the `next` TypeScript plugin declaration. |

These three files are the complete public preset set. The package does not ship an Astro preset; Astro projects should use Astro's own presets (`astro/tsconfigs/*`) and may extend the Usalyt base preset when they want the same strict compiler options.

The package `exports` map is:

```json
{
  "./base.json": "./base.json",
  "./react.json": "./react.json",
  "./next.json": "./next.json"
}
```

## Installation

```bash
pnpm add -D @usalyt/tsconfig
```

TypeScript is a prerequisite owned by the consuming project. The presets are tested with `typescript@6.0.0` (the package `devDependency`). They use compiler options available in TypeScript 5.x, but versions below 6.0.0 are not verified. The declared Node.js engine is `>=20`; it applies to the package tooling, not to the JSON presets themselves.

## Usage

Extend a preset by package subpath:

```json
{
  "extends": "@usalyt/tsconfig/base.json",
  "include": ["src"]
}
```

```json
{
  "extends": "@usalyt/tsconfig/react.json",
  "include": ["src"]
}
```

```json
{
  "extends": "@usalyt/tsconfig/next.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
```

TypeScript resolves the `extends` package subpath through Node package resolution, including the `exports` map above. Consumer projects that need a different `include`, `paths`, or `outDir` should override those options locally; shared strictness stays in the preset.

## Requirements and peers

- TypeScript `6.0.0` tested; no `peerDependencies` are declared because the package is configuration data and never imports TypeScript at runtime.
- Next.js projects that use `next.json` must install the `next` package themselves; the preset only records the `next` TypeScript plugin name.
- No runtime dependencies, fonts, or native binaries are distributed.

## Development checks

The repository-only checks are not part of the published allowlist:

```bash
node scripts/smoke.mjs   # isolated consumer under .tmp/consumer, one type-check per preset
node --test test/        # preset parsing, extends targets, exports, README contract
```

The smoke check uses the package-local TypeScript binary and resolves every preset through the package name, not through a relative workspace path.

## License

`@usalyt/tsconfig` is licensed under the MIT License. The complete MIT text is in `LICENSE`. The rest of the `usalyt` workspace and the five other public Usalyt packages remain `GPL-3.0-only`; this is a package-scoped exception, not an ecosystem-wide license change.

The owner selected retaining the package's original MIT declaration. No upstream copyright notice or provenance record was found in the checked-in files, so this README does not identify an upstream author, claim new ownership, or assert permissions beyond the MIT text. It is not a legal certification. Third-party dependency licenses are recorded in `THIRD_PARTY_NOTICES.md`.

### Source availability

The published tarball includes the preset sources needed to rebuild and modify the package. The repository metadata points to `https://github.com/save/ux-check` under `usalyt/packages/tsconfig`. This checkout has no configured Git remote, so that URL could not be independently verified.

## Changelog

### 0.0.1

- Initial release candidate for `@usalyt/tsconfig`.
- Published presets: `base.json`, `react.json`, and `next.json`, each exposed through a package subpath.
- Added an external-consumer smoke check and automated preset/export checks.
- Documented the supported preset set, license, source availability, and provenance status.

This is an initial `0.0.1` release candidate. It is not a stability or compatibility guarantee.
