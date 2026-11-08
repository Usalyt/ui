import { consumerRoot, runConsumerCheck } from "./consumer-check.mjs";

let failed = false;

for (const result of runConsumerCheck()) {
  const ok = result.status === 0;
  if (!ok) {
    failed = true;
  }
  console.log(`${ok ? "PASS" : "FAIL"} preset=${result.preset}`);
  const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
  if (output) {
    console.log(output.trimEnd());
  }
}

console.log(`Consumer directory: ${consumerRoot}`);
process.exitCode = failed ? 1 : 0;
