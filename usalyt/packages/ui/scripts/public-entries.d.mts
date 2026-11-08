export interface PublicEntry {
  /** Package export subpath: ".", "./button", or "./blocks/auth-form". */
  subpath: string;
  /** Repository-relative tsdown input file. */
  source: string;
  /** Emitted file base without an extension: "dist/index". */
  distBase: string;
}

export declare const publicEntries: PublicEntry[];

export declare const entryExtensions: {
  esm: "mjs";
  cjs: "cjs";
  esmTypes: "d.mts";
  cjsTypes: "d.cts";
};

export declare const styleFiles: {
  compiled: string;
  raw: string;
  theme: string;
};

export declare function buildExportsMap(): Record<string, unknown>;
