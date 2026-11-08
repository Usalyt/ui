# @usalyt/ui

Usalyt's component library: accessible React primitives and composed blocks built on [Base UI](https://base-ui.com) and Tailwind CSS v4, with class variants managed by CVA. Every public module is shipped as ESM and CJS with matching TypeScript declarations.

Version `0.0.1` is the initial Usalyt release candidate. See [CHANGELOG.md](./CHANGELOG.md) for the release notes.

## Installation

```bash
pnpm add @usalyt/ui
```

Peer prerequisites:

| Peer | Range | Required | Notes |
| --- | --- | --- | --- |
| `react` | `^18.0.0 \|\| ^19.0.0` | Yes | React 19 is exercised by this package's unit suite. The React 18 leg of the range is declared but is verified by the release coordinator's installed-consumer checks, not by this package's local tests. |
| `react-dom` | `^18.0.0 \|\| ^19.0.0` | Yes | Same evidence boundary as React. |
| `tailwindcss` | `^4.0.0` | Optional | Only needed when you compile the raw stylesheet yourself. The compiled `@usalyt/ui/styles.css` needs no Tailwind install in the consumer. |

## Imports

Root barrel:

```tsx
import { Button, Dialog, DialogContent, Input } from "@usalyt/ui";
```

Per-component subpaths resolve to the same built modules without pulling the whole barrel:

```tsx
import { Button } from "@usalyt/ui/button";
import { Input } from "@usalyt/ui/input";
import { DataTable } from "@usalyt/ui/data-table";
import { AuthForm } from "@usalyt/ui/blocks/auth-form";
```

Export keys are the component directory names. Every component and block in the package has its own subpath; `@usalyt/ui/<name>` resolves components and `@usalyt/ui/blocks/<name>` resolves blocks.

## Styles

### Compiled stylesheet (recommended)

```ts
import "@usalyt/ui/styles.css";
```

`dist/styles.css` is compiled from the package theme and component source. It contains:

- the full Usalyt token set (`--color-*`, `--font-*`, `--text-*`, `--radius-*`, `--shadow-*`, motion tokens),
- only the utility classes the components actually use,
- the Inter Variable `@font-face` rules and the woff2 files they reference, shipped alongside the stylesheet,
- **no Tailwind Preflight and no base element resets**, so importing it does not restyle unrelated host-page elements.

Because Preflight is intentionally absent, the stylesheet does not set a page background, body font, or default border color. Apply your own substrate, for example:

```css
:root {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  font-feature-settings: "cv01" 1, "ss03" 1, "zero" 1;
}
```

### Raw Tailwind source (custom builds)

If you want Tailwind to generate the utilities from your own content and theme configuration, import the raw entry inside your Tailwind CSS file:

```css
@import "tailwindcss";
@import "@usalyt/ui/styles/globals.css";
```

The raw entry imports Tailwind (Preflight included), the shared theme, and `@fontsource-variable/inter`, then scans the package source. It requires `tailwindcss` and `@fontsource-variable/inter` to be resolvable in your build. Treat this file as build input, not as a runtime CSS import.

To keep your own Preflight policy while reusing only the tokens, import the shared theme directly and point Tailwind at the installed package source (adjust the `@source` path to your project layout):

```css
@layer theme, base, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
@import "@usalyt/ui/styles/theme.css";

@source "../node_modules/@usalyt/ui/src";
```

## Themes and dark mode

The library is dark-first.

- Default (no class): the dark Midnight palette applies from `:root`.
- `.dark`: explicitly selects the dark palette.
- `html[data-theme="light"]:not(.dark)`: selects the light palette.

```html
<html class="dark">
  <!-- dark palette -->
</html>
```

```html
<html data-theme="light">
  <!-- light palette -->
</html>
```

Dark mode uses a class strategy (`@custom-variant dark`), never `prefers-color-scheme`, so the host page controls both directions. The semantic tokens (`--color-background`, `--color-foreground`, `--color-primary`, `--color-muted`, `--color-border`, `--color-sidebar*`, and the chromatic `-foreground` inks) are re-anchored per theme.

## Fonts

- **Inter Variable** is bundled through `@fontsource-variable/inter`. The compiled stylesheet references woff2 files shipped in `dist/files/`, and their SIL Open Font License text ships as `dist/files/Inter-OFL.txt`.
- **Berkeley Mono** is a commercial typeface and is **never bundled**. The theme declares it with `local()` only. Consumers who own a license get the real face; everyone else falls back to `"JetBrains Mono"` (install or self-host it) and then `ui-monospace`. No other fallback is implied.

If your bundler does not copy CSS-referenced assets, configure it to emit the referenced `*.woff2` files (Vite, webpack, Next.js, and Astro handle this by default for package CSS).

## Customization

Override tokens at runtime instead of forking styles:

```css
.dark {
  --color-primary: #7c3aed;
  --color-ring: #a78bfa;
}

html[data-theme="light"]:not(.dark) {
  --color-primary: #4c1d95;
}
```

Because components consume semantic utilities (`bg-primary`, `text-foreground`, `rounded-md`, `shadow-xl`), overriding the corresponding custom property updates every component that uses it. To change the raw palette, type scale, radii, or elevation stack, compile the raw stylesheet and override the `@theme` values in your own CSS.

## React Server Components and client boundaries

Every public entry declares the `"use client"` directive in its built output (root barrel, each component subpath, each block subpath). Importing `@usalyt/ui` from a Next.js App Router Server Component is supported: the imported modules are explicitly client modules, so they can render inside a Server Component tree and the boundary is explicit rather than inferred.

`0.0.1` marks all entries as client modules for a conservative, predictable boundary. If you need a server-safe, purely presentational import later, keep the import local to a Client Component.

## License and source availability

`@usalyt/ui` is licensed **GPL-3.0-only**. The full license text ships as [`LICENSE`](./LICENSE).

Because the package is distributed under the GPL, the corresponding source is part of the published artifact: the tarball includes `src/`, `styles/`, `scripts/`, `tsdown.config.ts`, `tsconfig.json`, `dist/`, this README, and the changelog, which is everything needed to rebuild the package. Third-party dependencies and fonts keep their own licenses; see the workspace `THIRD_PARTY_NOTICES.md` for the inventory. Berkeley Mono is not distributed.

## Versioning and changelog

The Usalyt package set uses the fixed `0.0.1` version group until a deliberate versioning change is approved. Package changes are recorded in [`CHANGELOG.md`](./CHANGELOG.md); the workspace-level changelog lives at the repository root.
