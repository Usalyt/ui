import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

import type { Page } from "@playwright/test";

// Resolve through the Docs application so the injected CSS is the exact
// installed Starlight reset, never a handwritten approximation.
const requireFromDocs = createRequire(
  join(__dirname, "../../../../apps/docs/package.json")
);
const starlightPackageRoot = dirname(
  requireFromDocs.resolve("@astrojs/starlight")
);
const starlightReset = readFileSync(
  join(starlightPackageRoot, "style/reset.css"),
  "utf8"
);

export async function injectStarlightReset(page: Page) {
  await page.evaluate((css) => {
    if (document.querySelector("style[data-fixture-reset]")) return;
    const style = document.createElement("style");
    style.setAttribute("data-fixture-reset", "");
    style.textContent = css;
    document.head.appendChild(style);
  }, starlightReset);
}
