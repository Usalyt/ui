import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";

const COMPONENTS_DIR = path.resolve(process.cwd(), "src/components");

const COMPLEX_COMPONENTS = new Set([
  "data-table",
  "command",
  "combobox",
  "calendar",
  "date-picker",
  "chart"
]);

const MEDIUM_COMPONENTS = new Set([
  "dialog",
  "alert-dialog",
  "popover",
  "drawer",
  "sheet",
  "dropdown-menu",
  "form"
]);

function getGzipSizeInKb(content: string): number {
  const compressed = zlib.gzipSync(Buffer.from(content, "utf-8"));
  return Number((compressed.length / 1024).toFixed(2));
}

function auditBundleSizes() {
  console.log("📦 Auditing Component Bundle Sizes...");
  let totalChecked = 0;
  let totalViolations = 0;

  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`Error: Components directory not found at ${COMPONENTS_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    const tsxFile = path.join(COMPONENTS_DIR, name, `${name}.tsx`);

    if (!fs.existsSync(tsxFile)) continue;

    const content = fs.readFileSync(tsxFile, "utf-8");
    const gzipKb = getGzipSizeInKb(content);
    totalChecked++;

    let limitKb = 5.0;
    let category = "simple";

    if (COMPLEX_COMPONENTS.has(name)) {
      limitKb = 30.0;
      category = "complex";
    } else if (MEDIUM_COMPONENTS.has(name)) {
      limitKb = 15.0;
      category = "medium";
    }

    if (gzipKb > limitKb) {
      console.error(`❌ [${name}] Size ${gzipKb} KB exceeds ${category} threshold of ${limitKb} KB!`);
      totalViolations++;
    } else {
      console.log(`✅ [${name}] ${gzipKb} KB (Category: ${category}, Limit: ${limitKb} KB)`);
    }
  }

  console.log(`\nAudit Complete: ${totalChecked} components checked, ${totalViolations} violations.`);

  if (totalViolations > 0) {
    process.exit(1);
  }
}

auditBundleSizes();
