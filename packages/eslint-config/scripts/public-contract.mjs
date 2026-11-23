/**
 * Single source of truth for the published package shape.
 *
 * The coordinator owns `package.json`. These lists state the allowlist and
 * export map that the manifest must contain, and the automated checks verify
 * that every entry exists on disk.
 */
export const entryFiles = ["index.mjs", "index.js"];

export const publishedFiles = [
  "index.mjs",
  "index.js",
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  "NOTICE",
  "THIRD_PARTY_NOTICES.md"
];

export const publishedExports = {
  ".": {
    import: "./index.mjs",
    require: "./index.js",
    default: "./index.mjs"
  },
  "./package.json": "./package.json"
};

export const expectedPluginKeys = ["@typescript-eslint", "jsx-a11y", "react-hooks"];

export const expectedRules = {
  "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",
  "jsx-a11y/alt-text": "error"
};
