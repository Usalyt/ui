# @usalyt/registry

Standalone, deterministic, versioned component registry for the Usalyt component
platform. The package ships the `registry.json` data file, the JSON Schema that
describes it, and the generator used to rebuild it from the `@usalyt/ui` source
tree.

The registry embeds the source of every published item, so the CLI and MCP
server can install or return components without reading a sibling checkout or
the current working directory. Consumers should read the packaged JSON; they do
not run the generator.

## Installed imports

The package exposes the registry, its schema, and package metadata as data
files:

```ts
import registry from "@usalyt/registry/registry.json" with { type: "json" };
import schema from "@usalyt/registry/schema/registry.schema.json" with {
  type: "json",
};
import packageMetadata from "@usalyt/registry/package.json" with {
  type: "json",
};
```

Synchronous CommonJS consumers can load the same files with `require`. The
registry is data only; the package has no runtime dependencies and no executable
entry point. JSON import attributes require Node.js 20.10 or newer; the declared
engine range lives in `package.json`.

## Registry shape

Root fields:

| Field                | Value                                                        |
| -------------------- | ------------------------------------------------------------ |
| `$schema`            | `./schema/registry.schema.json` (local, packaged reference)  |
| `name`               | `usalyt`                                                     |
| `version`            | `0.0.1`                                                      |
| `license`            | `GPL-3.0-only`                                               |
| `repository`         | `{ type, url, directory }` for this package                  |
| `dependencyLicenses` | audited license for every direct `@usalyt/ui` dependency     |
| `items`              | sorted registry items                                        |

Every item declares `name`, `type` (`registry:ui`, `registry:block`, or
`registry:lib`), `title`, `description`, `license`, `dependencies`,
`devDependencies`, `registryDependencies`, `dependencyVersions`, and `files`.
Every file entry declares a source-root-relative `path`, a `type`, and the
embedded file `content`.

The generated data covers 60 primitive components, 13 blocks, and the shared
`utils` item. `registry.json` is sorted deterministically: items by name,
dependency lists alphabetically, and files by path. The file is 2-space JSON
with a trailing newline and contains no timestamps or absolute paths.

## Schema

`schema/registry.schema.json` is a JSON Schema Draft 2020-12 document that
validates the root, item, dependency, license, and file shapes. The schema is
packaged locally and referenced from `registry.json` as
`./schema/registry.schema.json`; there is no hosted schema URL. The build fails
if the generated data does not validate, and the test suite validates the
committed registry independently with Ajv.

## Generation

The generator takes an explicit source root and an explicit output path. The
monorepo build uses package-relative defaults, so it does not depend on the
current working directory:

```bash
pnpm --filter @usalyt/registry build
```

The default source root is `../ui/src` relative to this package; the default
output is `registry.json` in this package.

Generate from any layout by pointing at a UI source root:

```bash
pnpm --filter @usalyt/registry exec tsx scripts/build-registry.ts \
  --source /path/to/ui/src \
  --out /path/to/registry.json
```

The source root must contain `components/`, `blocks/`, and `lib/utils.ts`, and
the `@usalyt/ui` `package.json` must exist at the source root or its parent
directory because dependency ranges are read from it. A copied source tree
produces the same bytes as the monorepo source tree.

`USALYT_SOURCE_ROOT` provides an alternative default source root when
`--source` is omitted; an explicit flag always wins:

```bash
USALYT_SOURCE_ROOT=/path/to/ui/src pnpm --filter @usalyt/registry build
```

Use `--help` for the full option list.

### Reproducibility gate

`--check` regenerates the registry in memory and compares it with the output
file. It exits non-zero when the file is missing or differs, without writing
anything:

```bash
pnpm --filter @usalyt/registry exec tsx scripts/build-registry.ts --check
```

The registry build is byte-identical for identical input, so this check is safe
to run in CI. The package also exposes the recommended `check` script in its
manifest.

## Dependency and license metadata

- `dependencies` lists the npm packages imported by an item's embedded source,
  normalized to package names. `react` and `react-dom` stay peer dependencies
  and are not listed per item.
- `dependencyVersions` maps each item dependency to the range declared by the
  `@usalyt/ui` `package.json`. Generation fails when an imported package is not
  declared.
- `registryDependencies` lists other registry items reached through relative
  imports, including `utils` when a source file imports the shared `cn()`
  helper. Generation derives the list from the embedded source instead of
  assuming every item needs every dependency.
- `dependencyLicenses` records the audited license of every direct `@usalyt/ui`
  dependency (runtime and peer) from `THIRD_PARTY_NOTICES.md`. Generation fails
  when a direct dependency has no audited license entry.

Third-party licenses and notices remain in `THIRD_PARTY_NOTICES.md`. The
inventory is an audit of declared dependency licenses, not a legal
certification.

## License and source availability

First-party code in this package is licensed `GPL-3.0-only`; the complete text
is in `LICENSE`. The package ships the registry data, the generator, and the
schema, and the embedded item sources are part of `registry.json`, so the
corresponding source needed to rebuild the package is distributed with it. The
source repository is recorded in `package.json`, `NOTICE`, and
`THIRD_PARTY_NOTICES.md` preserve the upstream licensing status.

The commercial Berkeley Mono font is not bundled. Font-related dependencies keep
their own licenses as recorded in `THIRD_PARTY_NOTICES.md`.

## Tests

The package uses the Node.js built-in test runner with the repository's `tsx`
loader. No additional test framework is required:

```bash
node --import tsx --test tests/registry-data.test.ts tests/registry-cli.test.ts
```

The suite covers schema validation, source embedding, source/dependency
accuracy, license metadata, determinism, `--check`, argument handling, and a
standalone copied-source fixture under `.tmp/standalone-ui-src/`.

## Version 0.0.1 changelog

The initial `0.0.1` release candidate introduces the Usalyt registry identity,
the deterministic generator, the packaged schema, dependency and license
metadata, the `--check` reproducibility gate, and the standalone source-root
contract. See `CHANGELOG.md` for the recorded changelog entry. The package is
part of the fixed `0.0.1` Usalyt version group; it is not a stability or
compatibility guarantee.

## Package layout

```
packages/registry/
├── schema/registry.schema.json   # Draft 2020-12 schema
├── scripts/build-registry.ts     # Generator CLI (build and --check)
├── src/registry-builder.ts       # Deterministic generation logic
├── tests/                        # node --test suites
├── registry.json                 # Generated registry data
├── LICENSE
├── NOTICE
├── THIRD_PARTY_NOTICES.md
├── CHANGELOG.md
└── README.md
```
