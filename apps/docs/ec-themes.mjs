/**
 * Expressive Code themes for the Usalyt docs site.
 *
 * Both themes map every syntax role to a shipped Usalyt token reference
 * (`var(--color-*)`) instead of stock editor palette values, so code blocks
 * track the design system in dark and light mode automatically:
 *
 *   comments     -> muted-foreground (fog on the dark substrate, ash on light; italic)
 *   keywords     -> lavender-foreground
 *   strings      -> pulse-green-foreground
 *   functions    -> signal-teal-foreground
 *   types/nums   -> iris-violet-foreground
 *   punctuation  -> muted-foreground
 *   plain text   -> foreground
 *   invalid      -> coral-red-foreground
 *
 * Token colors are CSS variables, not literals, which is why the docs site runs
 * Expressive Code with `minSyntaxHighlightingColorContrast: 0`: the automatic
 * contrast fixer works on parseable colors and would rewrite these references.
 * Contrast for every role is verified by the `docs-a11y` audit instead
 * (`pnpm --filter @usalyt/tests docs-a11y`), which asserts >= 4.5:1 in both themes.
 *
 * The themes intentionally declare no `colors` map: Expressive Code validates
 * every workbench color as hex (or as a hex reference), so UI chrome
 * (backgrounds, borders, tab bars, copy button) is expressed through
 * `styleOverrides` in `astro.config.mjs` with token references instead.
 */

const tokenColors = [
  {
    // Plain text catch-all (root scope). Deeper-scope rules below win their
    // tokens; unmatched tokens resolve to the shipped foreground token instead
    // of Expressive Code's default grey.
    scope: ["source"],
    settings: { foreground: "var(--color-foreground)" },
  },
  {
    scope: ["comment", "punctuation.definition.comment", "string.comment"],
    settings: { foreground: "var(--color-muted-foreground)", fontStyle: "italic" },
  },
  {
    scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.control", "keyword.operator.new"],
    settings: { foreground: "var(--color-lavender-foreground)" },
  },
  {
    scope: [
      "string",
      "string.quoted",
      "string.template",
      "string.regexp",
      "punctuation.definition.string",
      "punctuation.definition.template-expression",
      "punctuation.section.embedded",
    ],
    settings: { foreground: "var(--color-pulse-green-foreground)" },
  },
  {
    scope: [
      "entity.name.function",
      "entity.name.method",
      "support.function",
      "support.method",
      "meta.function-call",
      "meta.function-call.generic",
    ],
    settings: { foreground: "var(--color-signal-teal-foreground)" },
  },
  {
    scope: [
      "entity.name.tag",
      "entity.name.tag.namespace",
      "meta.tag",
      "punctuation.definition.tag",
      "support.class.component",
    ],
    settings: { foreground: "var(--color-signal-teal-foreground)" },
  },
  {
    scope: [
      "constant",
      "constant.numeric",
      "constant.language",
      "support.constant",
      "variable.language",
      "entity.name.type",
      "entity.name.class",
      "entity.other.inherited-class",
      "support.type",
      "support.class",
    ],
    settings: { foreground: "var(--color-iris-violet-foreground)" },
  },
  {
    scope: [
      "variable.parameter",
      "variable.other.property",
      "meta.object-literal.key",
      "support.type.property-name",
      "meta.property-name",
    ],
    settings: { foreground: "var(--color-foreground)" },
  },
  {
    scope: ["punctuation", "keyword.operator", "punctuation.separator", "punctuation.terminator", "meta.brace"],
    settings: { foreground: "var(--color-muted-foreground)" },
  },
  {
    scope: ["invalid", "invalid.illegal", "invalid.deprecated", "invalid.unimplemented", "message.error"],
    settings: { foreground: "var(--color-coral-red-foreground)" },
  },
  {
    scope: ["markup.heading", "markup.bold"],
    settings: { foreground: "var(--color-foreground)", fontStyle: "bold" },
  },
  {
    scope: ["markup.italic"],
    settings: { foreground: "var(--color-foreground)", fontStyle: "italic" },
  },
  {
    scope: ["markup.inline.raw", "markup.raw", "markup.quote"],
    settings: { foreground: "var(--color-pulse-green-foreground)" },
  },
  {
    scope: ["constant.other.reference.link", "string.other.link", "markup.underline.link"],
    settings: { foreground: "var(--color-foreground)", fontStyle: "underline" },
  },
];

/** Dark variant — Starlight activates it through `<html data-theme="dark">`. */
export const usalytDarkTheme = {
  name: "usalyt-dark",
  type: "dark",
  tokenColors,
};

/** Light variant — Starlight activates it through `<html data-theme="light">`. */
export const usalytLightTheme = {
  name: "usalyt-light",
  type: "light",
  tokenColors,
};
