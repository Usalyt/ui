import { existsSync, realpathSync } from "node:fs";
import path from "node:path";

export class UnsafePathError extends Error {
  readonly destination: string;
  readonly alias: string;

  constructor(alias: string, destination: string, message: string) {
    super(message);
    this.name = "UnsafePathError";
    this.alias = alias;
    this.destination = destination;
  }
}

const WINDOWS_ABSOLUTE = /^[A-Za-z]:[\\/]/;

/** Strip the `@/` or `~/` prefix and return the root-relative alias path. */
export function aliasToRelativePath(alias: string, label: string): string {
  if (typeof alias !== "string" || alias.trim() === "") {
    throw new UnsafePathError(alias, "", `The ${label} alias must be a non-empty string.`);
  }

  const original = alias.trim();
  let value = original;
  if (value.startsWith("@/") || value.startsWith("~/")) {
    value = value.slice(2);
  }

  if (value.includes("\0")) {
    throw new UnsafePathError(
      original,
      "",
      `The ${label} alias contains a null byte and cannot be used.`
    );
  }
  if (path.isAbsolute(value) || WINDOWS_ABSOLUTE.test(value)) {
    throw new UnsafePathError(
      original,
      value,
      `The ${label} alias "${original}" is absolute. Aliases must resolve inside the consumer root.`
    );
  }

  return value === "" ? "." : value;
}

export function isWithinRoot(root: string, destination: string): boolean {
  const relative = path.relative(root, destination);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

/**
 * Resolve an existing ancestor through `realpath` and append the missing
 * segments, so a symlinked parent that points outside the root is detected
 * before any directory or file is created.
 */
function realpathAllowMissing(target: string): string {
  let current = target;
  const missing: string[] = [];
  while (!existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    missing.unshift(path.basename(current));
    current = parent;
  }
  const base = existsSync(current) ? realpathSync(current) : current;
  return path.join(base, ...missing);
}

export function assertWithinRoot(root: string, destination: string, label: string): void {
  if (!isWithinRoot(root, destination)) {
    throw new UnsafePathError(
      label,
      destination,
      `The ${label} destination "${destination}" resolves outside the consumer root ${root}.`
    );
  }

  const realRoot = realpathSync(root);
  const realDestination = realpathAllowMissing(destination);
  if (!isWithinRoot(realRoot, realDestination)) {
    throw new UnsafePathError(
      label,
      destination,
      `The ${label} destination "${destination}" resolves outside the consumer root ${root} through a symbolic link.`
    );
  }
}

/** Resolve a configured alias against the consumer root and enforce containment. */
export function resolveAliasWithinRoot(root: string, alias: string, label: string): string {
  const relative = aliasToRelativePath(alias, label);
  const destination = path.resolve(root, relative);
  assertWithinRoot(root, destination, label);
  return destination;
}
