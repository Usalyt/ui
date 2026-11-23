import {
  runConsumerCheck,
  runConsumerImportCheck
} from "./consumer-check.mjs";

let failed = false;

function report(label, ok, detail) {
  if (!ok) {
    failed = true;
  }
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (detail) {
    console.log(detail.trimEnd());
  }
}

const importCheck = runConsumerImportCheck();
report(
  `consumer import (flags: ${importCheck.flags.join(" ") || "none"})`,
  importCheck.status === 0 &&
    importCheck.stdout.includes("array=true") &&
    importCheck.stdout.includes("entries=1"),
  [importCheck.stdout, importCheck.stderr].filter(Boolean).join("\n")
);

const check = runConsumerCheck();

report(
  "valid.tsx lints without errors",
  check.valid.status === 0,
  [check.valid.stdout, check.valid.stderr].filter(Boolean).join("\n")
);

const invalidOutput = [check.invalid.stdout, check.invalid.stderr]
  .filter(Boolean)
  .join("\n");

report(
  "invalid.tsx reports jsx-a11y/alt-text",
  check.invalid.status === 1 && invalidOutput.includes("jsx-a11y/alt-text"),
  invalidOutput
);

console.log(`Consumer directory: ${check.consumerRoot}`);
process.exitCode = failed ? 1 : 0;
