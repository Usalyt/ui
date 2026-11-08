import pc from "picocolors";

/** Print an actionable error to stderr and mark the process as failed. */
export function printError(message: string): void {
  console.error(pc.red(`usalyt: ${message}`));
  process.exitCode = 1;
}
