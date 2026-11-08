import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import { usalytDarkTheme, usalytLightTheme } from "./ec-themes.mjs";

export default defineConfig({
  integrations: [
    starlight({
      title: "Usalyt Documentation",
      description: "Accessible, unstyled-first UI primitives built with Base UI and Tailwind v4",
      customCss: ["./src/styles/starlight-custom.css"],
      // The custom 404 lives in `src/content/docs/404.mdx` (Starlight 0.32
      // supports content-collection 404 pages). Starlight's injected `404`
      // route competes with the docs collection route that already emits
      // `dist/404.html`; disabling the injected one keeps a single output and
      // a warning-free build.
      disable404Route: true,
      social: {
        github: "https://github.com/save/ux-check"
      },
      // The theme control lives in the header's right group AND in the mobile
      // menu footer — both render `<ThemeSelect />` in Starlight 0.32.6, so the
      // functional Sun/Moon toggle is wired through the ThemeSelect override
      // (the default Header renders no named slots, children are dropped).
      components: {
        Header: "./src/components/overrides/Header.astro",
        ThemeSelect: "./src/components/overrides/ThemeSelect.astro"
      },
      expressiveCode: {
        // Palette-mapped themes: every syntax role references a shipped token
        // (see ec-themes.mjs). The built-in contrast fixer only understands
        // parseable colors, so it stays off; contrast is enforced by the
        // `docs-a11y` axe audit instead.
        themes: [usalytDarkTheme, usalytLightTheme],
        minSyntaxHighlightingColorContrast: 0,
        useStarlightUiThemeColors: false,
        styleOverrides: {
          borderRadius: "var(--radius-lg)",
          borderWidth: "1px",
          borderColor: "var(--color-border)",
          codeBackground: "var(--color-card)",
          codeForeground: "var(--color-foreground)",
          codeFontFamily: "var(--font-mono)",
          codeFontSize: "0.875rem",
          codeLineHeight: "1.6",
          gutterForeground: "var(--color-muted-foreground)",
          focusBorder: "var(--color-ring)",
          scrollbarThumbColor: "var(--color-border)",
          scrollbarThumbHoverColor: "var(--color-muted-foreground)",
          uiFontFamily: "var(--font-sans)",
          uiFontSize: "var(--text-caption)",
          frames: {
            editorBackground: "var(--color-card)",
            editorActiveTabBackground: "var(--color-card)",
            editorActiveTabForeground: "var(--color-foreground)",
            editorActiveTabIndicatorTopColor: "var(--color-border)",
            editorActiveTabIndicatorBottomColor: "transparent",
            editorActiveTabIndicatorHeight: "2px",
            editorTabBarBackground: "var(--color-card)",
            editorTabBarBorderColor: "var(--color-border)",
            editorTabBarBorderBottomColor: "var(--color-border)",
            terminalBackground: "var(--color-card)",
            terminalTitlebarBackground: "var(--color-card)",
            terminalTitlebarForeground: "var(--color-muted-foreground)",
            terminalTitlebarDotsOpacity: "0",
            terminalTitlebarBorderBottomColor: "var(--color-border)",
            inlineButtonForeground: "var(--color-muted-foreground)",
            inlineButtonBackground: "var(--color-foreground)",
            inlineButtonBackgroundIdleOpacity: "0",
            inlineButtonBackgroundHoverOrFocusOpacity: "0.14",
            inlineButtonBackgroundActiveOpacity: "0.22",
            inlineButtonBorder: "var(--color-border)",
            inlineButtonBorderOpacity: "1",
            frameBoxShadowCssValue: "none",
            tooltipSuccessBackground: "var(--color-foreground)",
            tooltipSuccessForeground: "var(--color-background)"
          }
        }
      },
      head: [
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://rsms.me/"
          }
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://rsms.me/inter/inter.css"
          }
        },
        {
          // Synchronize Starlight theme (starlight-theme) with Tailwind v4 (.dark class)
          tag: "script",
          attrs: { is: "inline" },
          content: `(function(){
            var t = localStorage.getItem('starlight-theme') || localStorage.getItem('theme');
            var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var m = t ?? (d ? 'dark' : 'light');
            document.documentElement.dataset.theme = m;
            if (m === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }

            var obs = new MutationObserver(function(mutations) {
              mutations.forEach(function(m) {
                if (m.type === 'attributes' && m.attributeName === 'data-theme') {
                  var theme = document.documentElement.dataset.theme;
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  localStorage.setItem('starlight-theme', theme);
                  localStorage.setItem('theme', theme);
                }
              });
            });
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
          })();`,
        },
      ],
      // Bilingual routing, verified against the installed Starlight 0.32.6:
      // serving English at the root (`/`) requires the `root` locale key. The
      // literal alternative (`defaultLocale: "en"` + `locales: { en, es }`)
      // breaks this layout — `slugToLocale` tags every unprefixed doc as
      // locale "en", the English sidebar comes back empty (locale-scoped
      // route filters expect an `en/` prefix that no slugs carry) and no
      // Spanish fallback routes are generated (observed in `dist`:
      // zero sidebar links on `/components/button/`, no `/es/` pages). With
      // the `root` key: `/` is English, `/es/` is Spanish, the language
      // switcher renders through the default header, and untranslated `es`
      // pages fall back to English content behind Starlight's
      // "not yet available in your language" notice.
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        es: { label: "Español", lang: "es" }
      },
      sidebar: [
        {
          label: "Getting Started",
          translations: { es: "Primeros pasos" },
          autogenerate: { directory: "getting-started" }
        },
        {
          label: "Primitive Components",
          translations: { es: "Componentes primitivos" },
          autogenerate: { directory: "components" }
        },
        {
          label: "UI Blocks",
          translations: { es: "Bloques de UI" },
          autogenerate: { directory: "blocks" }
        }
      ]
    }),
    react()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
