import fs from "fs";
import path from "path";

const componentsDir = path.resolve(process.cwd(), "../../packages/ui/src/components");
const blocksDir = path.resolve(process.cwd(), "../../packages/ui/src/blocks");
const targetComponentsDir = path.resolve(process.cwd(), "src/content/docs/components");
const targetBlocksDir = path.resolve(process.cwd(), "src/content/docs/blocks");

fs.mkdirSync(targetComponentsDir, { recursive: true });
fs.mkdirSync(targetBlocksDir, { recursive: true });

const formatName = (str: string) =>
  str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const componentDirs = fs.readdirSync(componentsDir).filter((f) => fs.statSync(path.join(componentsDir, f)).isDirectory());

componentDirs.forEach((comp) => {
  const name = formatName(comp);
  const mdxPath = path.join(targetComponentsDir, `${comp}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    const content = `---
title: ${name}
description: ${name} component powered by Base UI and Tailwind v4.
---

import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropsTable } from '../../../components/PropsTable';

# ${name}

An accessible, unstyled-first ${name.toLowerCase()} primitive built for high-performance design systems.

## Installation

\`\`\`bash
npx tu-ui add ${comp}
\`\`\`

## Preview

<ComponentPreview title="${name} Example">
  <div className="p-4 text-center text-sm text-neutral-400">
    Interactive ${name} component preview
  </div>
</ComponentPreview>
`;
    fs.writeFileSync(mdxPath, content, "utf-8");
  }
});

const blockDirs = fs.readdirSync(blocksDir).filter((f) => fs.statSync(path.join(blocksDir, f)).isDirectory());

blockDirs.forEach((block) => {
  const name = formatName(block);
  const mdxPath = path.join(targetBlocksDir, `${block}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    const content = `---
title: ${name}
description: ${name} pre-built UI block.
---

import { ComponentPreview } from '../../../components/ComponentPreview';

# ${name}

A pre-built, production-ready ${name.toLowerCase()} UI block.

## Preview

<ComponentPreview title="${name} Block">
  <div className="p-4 text-center text-sm text-neutral-400">
    Interactive ${name} block preview
  </div>
</ComponentPreview>
`;
    fs.writeFileSync(mdxPath, content, "utf-8");
  }
});

console.log("✅ Generated missing .mdx documentation pages!");
