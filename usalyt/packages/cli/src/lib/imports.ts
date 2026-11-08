import path from "node:path";

const IMPORT_PATTERN = /(\bfrom\s*|\bimport\s*)(["'])([^"'\n]+)\2/g;

const SOURCE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".mts", ".cts", ".mjs", ".cjs"];

function resolveSourceFile(
  sourcePath: string,
  specifier: string,
  knownSources: ReadonlySet<string>
): string | null {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const base = pathPosixNormalize(
    pathPosixJoin(pathPosixDirname(sourcePath), specifier)
  );
  const candidates = [base];
  for (const extension of SOURCE_EXTENSIONS) {
    candidates.push(`${base}${extension}`);
  }
  for (const extension of SOURCE_EXTENSIONS) {
    candidates.push(`${base}/index${extension}`);
  }

  return candidates.find((candidate) => knownSources.has(candidate)) ?? null;
}

// The registry stores POSIX-style paths on every platform.
function pathPosixNormalize(value: string): string {
  return value.replace(/\\/g, "/").split("/").reduce<string[]>((segments, segment) => {
    if (segment === "" || segment === ".") {
      return segments;
    }
    if (segment === ".." && segments.length > 0 && segments[segments.length - 1] !== "..") {
      segments.pop();
      return segments;
    }
    segments.push(segment);
    return segments;
  }, []).join("/");
}

function pathPosixJoin(...parts: string[]): string {
  return parts.filter((part) => part !== "").join("/");
}

function pathPosixDirname(value: string): string {
  const index = value.lastIndexOf("/");
  return index === -1 ? "" : value.slice(0, index);
}

function toImportSpecifier(fromFile: string, toFile: string): string {
  const relative = path.relative(path.dirname(fromFile), toFile).split(path.sep).join("/");
  let specifier = relative.replace(/\.(tsx?|jsx?|mts?|cts?|mjs?|cjs?)$/, "");
  specifier = specifier.replace(/\/index$/, "");
  if (!specifier.startsWith(".")) {
    specifier = `./${specifier}`;
  }
  return specifier;
}

/**
 * Rewrite registry-internal relative imports so references between installed
 * files keep resolving at their configured destinations. Bare package imports
 * are left untouched.
 */
export function rewriteRelativeImports(options: {
  content: string;
  sourcePath: string;
  destPath: string;
  sourceToDest: ReadonlyMap<string, string>;
}): string {
  const { content, sourcePath, destPath, sourceToDest } = options;
  const knownSources = new Set(sourceToDest.keys());

  return content.replace(
    IMPORT_PATTERN,
    (match, prefix: string, quote: string, specifier: string) => {
      const resolved = resolveSourceFile(sourcePath, specifier, knownSources);
      if (!resolved) {
        return match;
      }
      const targetDest = sourceToDest.get(resolved);
      if (!targetDest || targetDest === destPath) {
        return match;
      }
      return `${prefix}${quote}${toImportSpecifier(destPath, targetDest)}${quote}`;
    }
  );
}
