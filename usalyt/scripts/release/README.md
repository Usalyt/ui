# Usalyt release operations

These scripts prepare and publish the fixed Usalyt package group (currently `0.0.1`). They never run automatically and never reserve names or create credentials.

## Local pre-release gate

From `usalyt/`:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm type-check
pnpm test:registry
pnpm test:cli
pnpm test:mcp
pnpm test:configs
pnpm build:registry && pnpm --filter @usalyt/registry check
pnpm --filter @usalyt/ui verify:artifacts:strict
pnpm pack:public
pnpm test:installed
```

`pack:public` writes tarballs and `pack-report.json` under `../odd/artifacts/usalyt-npm-release/`. Its package-specific license gate requires `MIT` for `@usalyt/tsconfig` and `GPL-3.0-only` for the other five; missing, unknown, or arbitrary licenses fail. `test:installed` writes consumers and `installed-evidence.json` there. Review both before publishing.

## Workflow

`.github/workflows/usalyt-release.yml` is manual (`workflow_dispatch`) and bound to the protected `npm-release` environment. Type `PUBLISH` only when `dry_run` is false. The workflow verifies, packs, inspects, and then calls `scripts/release/publish-public-packages.mjs`.

The script:

- reads the release version from each package manifest instead of hardcoding it;
- validates all six expected names, public visibility, and one fixed version group before any registry query;
- queries and prints the exact manifest version for each package;
- skips any package whose exact version already exists;
- publishes only missing packages, in fixed order;
- stops on the first publish failure;
- never uses `--force`, never unpublishes, and never overwrites.

Run the release-script regression with:

```bash
node --test scripts/release/tests/publish-public-packages.test.mjs
```

The test copies the script and manifests into disposable fixtures under `odd/artifacts/usalyt-npm-release/correction-*`, uses a controlled `pnpm` stub, and never contacts the live registry. It includes a preserved pre-fix script fixture that reproduces the bumped-group false skip, then verifies the corrected script for a bumped group, the existing `0.0.1` skip path, a missing-version publish plan, and fail-before-query cases for mismatched versions, missing or misnamed manifests, private packages, and a missing publish token.

## npm prerequisites

- `@usalyt` scope ownership and name availability are external prerequisites. This repository does not create or reserve them.
- 2FA on every publishing account.
- A granular token limited to the six packages and publish operations, stored only in the protected environment as `NODE_AUTH_TOKEN`.
- Required reviewers on the `npm-release` environment.
- Public package access is declared by `publishConfig.access: "public"` in every manifest.

## OIDC and provenance

The workflow requests `id-token: write` and supports `pnpm --provenance`, but npm trusted-publisher/OIDC compatibility with pnpm 10.2.0 is **not verified**. Validate it with a pre-release package before selecting `provenance: true`. Until then, the protected-environment token path is the baseline. Do not claim OIDC support from configuration alone.

## Recovery

If a release is partial:

1. Inspect which exact versions exist with `pnpm view <name>@<version> version`.
2. Rerun the workflow; existing versions are skipped.
3. If content must change, bump the fixed group (for example `0.0.2`), update every public changelog, and publish the new version.
4. Never delete, unpublish, or overwrite a published version as a recovery step.
