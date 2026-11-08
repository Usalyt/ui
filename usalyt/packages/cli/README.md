# @usalyt/cli

Component distribution CLI for the Usalyt component platform. It installs the
registry source of Usalyt primitives and blocks into a consumer project, so the
installed code stays readable and editable.

- Registry data comes from the installed `@usalyt/registry` package. The CLI
  does not read a sibling checkout or depend on the current working directory.
- Consumer configuration lives in `usalyt.json`.
- The executable is named `usalyt`.
- Every write is confined to the consumer root, and existing files are
  preserved unless `--overwrite` is passed.
- Dependency installation is never implicit. The CLI prints the exact
  `pnpm add ...` command and only runs it with `--install` plus confirmed
  consent.

## Requirements

- Node.js 20 or newer
- pnpm for dependency installation in the consumer project

## Run

```bash
# Recommended: run the published binary without a global install
pnpm dlx @usalyt/cli --help

# npm-compatible invocation
npx @usalyt/cli --help
```

Both commands resolve the packaged registry through the installed
`@usalyt/registry` dependency.

## Commands

### `usalyt init`

Creates `usalyt.json` in the current directory with component and utility
aliases.

```bash
usalyt init           # prompt for aliases when the terminal is interactive
usalyt init --yes     # accept the default aliases without prompting
usalyt init --overwrite
```

Defaults:

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "@/src/components/ui",
    "utils": "@/src/lib/utils"
  }
}
```

If `usalyt.json` already exists, `init` exits non-zero and leaves the file
byte-identical. `--overwrite` replaces it explicitly. The command does not write
a hosted `$schema` URL.

### `usalyt add`

Installs one or more registry items, plus every transitive
`registryDependencies` entry (including the shared `utils` item).

```bash
usalyt add button
usalyt add button badge dialog
usalyt add auth-form
usalyt add --all
```

Flags:

| Flag              | Behavior                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| `--all`, `-a`     | Install every registry item.                                              |
| `--overwrite`, `-o` | Replace existing destination files. Without it, any conflict aborts the whole command before writing. |
| `--install`       | Run the printed `pnpm add ...` command after confirming consent.          |
| `--yes`, `-y`     | Confirm dependency installation without an interactive prompt.            |

For every planned file the CLI:

1. Resolves the destination from the configured alias and normalizes it
   against the consumer root.
2. Rejects absolute aliases and any destination that resolves outside the root,
   including through an existing symbolic link.
3. Rewrites registry-internal relative imports so they point at the installed
   files.
4. Detects existing files before writing anything. Any conflict without
   `--overwrite` exits non-zero and leaves the project unchanged.

Unknown component names also exit non-zero and write nothing.

#### Aliases and import rewriting

Aliases are destination paths relative to the consumer root. A leading `@/` or
`~/` is accepted for readability and is equivalent to the consumer root:

```json
{
  "aliases": {
    "components": "@/components/ui",
    "utils": "@/lib/utils"
  }
}
```

- `components` is the directory that receives one subdirectory per item.
- `utils` is the destination file for the shared `cn()` helper. The CLI appends
  `.ts` when the alias has no file extension.
- Registry-internal relative imports are rewritten to relative imports between
  the installed files, so the generated source resolves without relying on the
  consumer's TypeScript path mapping.

#### Dependencies

`add` collects the npm dependencies of every installed item, including
transitive registry dependencies, and prints one exact command:

```text
Dependencies: pnpm add @base-ui/react class-variance-authority clsx lucide-react tailwind-merge
Dependencies were not installed. Run the command above, or pass --install --yes to execute it.
```

The CLI never runs npm or yarn. `--install` without `--yes` asks for
confirmation when the terminal is interactive; in a non-interactive session it
prints the command and skips execution. `--install --yes` executes
`pnpm add ...` in the consumer root without prompting.

Example session:

```bash
$ usalyt init --yes
Created usalyt.json at /home/user/app/usalyt.json
  components: @/src/components/ui
  utils: @/src/lib/utils

$ usalyt add button
Installed 2 item(s) (1 requested, 1 registry dependencies):
  + src/lib/utils.ts
  + src/components/ui/button/button.tsx
  + src/components/ui/button/index.ts
Dependencies: pnpm add @base-ui/react class-variance-authority clsx lucide-react tailwind-merge
Dependencies were not installed. Run the command above, or pass --install --yes to execute it.
```

### `usalyt list`

Lists the items in the packaged registry.

```bash
usalyt list
usalyt list --json
```

`--json` prints a single JSON document with `name`, `version`, `count`, and an
`items` array (`name`, `type`, `title`, `description`, `license`,
`dependencies`, `registryDependencies`). No human-readable text is mixed into
the JSON output.

## Exit status

- `0`: the command completed as requested.
- non-zero: invalid usage, an unknown item, a missing registry, a write
  conflict without `--overwrite`, an unsafe destination, or a failed
  dependency installation.

Failures are reported on stderr. Rejected `add` requests do not write any files.

## Registry resolution

The CLI resolves `@usalyt/registry/registry.json` with Node package resolution
(`createRequire(import.meta.url).resolve(...)`) and reads it at runtime. If the
packaged registry cannot be found, the command exits non-zero with an
actionable message instead of silently using an empty catalog. A
monorepo-relative path exists only as a development fallback.

## License and source availability

`@usalyt/cli` is licensed `GPL-3.0-only`; the full text is in `LICENSE`. The
package ships the TypeScript source and build configuration needed to rebuild
the executable, so the corresponding source is distributed with the package.
The source repository is recorded in `package.json`. Third-party dependency
licenses are recorded in `THIRD_PARTY_NOTICES.md`; the inventory is an audit of
declared licenses, not a legal certification. The commercial Berkeley Mono font
is not bundled.

## Version 0.0.1 changelog

- Initial Usalyt release candidate under the `@usalyt/cli` identity and the
  `usalyt` executable.
- Packaged registry resolution through `@usalyt/registry`, independent of the
  current working directory.
- `init` creates `usalyt.json` and refuses implicit replacement.
- `add` resolves transitive registry dependencies, rewrites relative imports,
  enforces consumer-root containment (including symlink escapes), refuses
  overwrite conflicts before writing, and requires explicit consent before
  installing npm dependencies.
- `list` supports human-readable and `--json` output.
- `GPL-3.0-only` license, notices, and source-availability guidance.

See `CHANGELOG.md` for the maintained changelog. This is an initial `0.0.1`
release candidate, not a stability or compatibility guarantee.

## Development

```bash
pnpm --filter @usalyt/cli build
node --test packages/cli/tests/cli.test.mjs
```

Tests run the built `dist/index.mjs` against isolated consumers under
`packages/cli/.tmp/` and never install dependencies.

## Package layout

```text
packages/cli/
├── src/
│   ├── commands/       # init, add, list
│   ├── lib/            # registry, config, path containment, install plan
│   └── index.ts        # executable entry point (dist/index.mjs)
├── tests/              # node --test public-interface tests
├── dist/               # built executable
├── tsdown.config.ts
├── LICENSE
├── NOTICE
├── THIRD_PARTY_NOTICES.md
├── CHANGELOG.md
└── README.md
```
