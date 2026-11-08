/**
 * Single source of truth for the published preset set.
 *
 * The coordinator owns `package.json`. The manifest must publish exactly these
 * presets and expose them under the same subpaths; the checks verify that every
 * declared target exists on disk.
 */
export const presets = ["base", "react", "next"];

export const publishedFiles = [
  "base.json",
  "react.json",
  "next.json",
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  "NOTICE",
  "THIRD_PARTY_NOTICES.md"
];

export const publishedExports = Object.fromEntries(
  presets.map((preset) => [`./${preset}.json`, `./${preset}.json`])
);
