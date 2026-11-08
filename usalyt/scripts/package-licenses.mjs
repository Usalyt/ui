export const PACKAGE_LICENSE_CONTRACTS = Object.freeze({
  "@usalyt/ui": {
    license: "GPL-3.0-only",
    markers: ["GNU GENERAL PUBLIC LICENSE", "Version 3, 29 June 2007"],
  },
  "@usalyt/registry": {
    license: "GPL-3.0-only",
    markers: ["GNU GENERAL PUBLIC LICENSE", "Version 3, 29 June 2007"],
  },
  "@usalyt/cli": {
    license: "GPL-3.0-only",
    markers: ["GNU GENERAL PUBLIC LICENSE", "Version 3, 29 June 2007"],
  },
  "@usalyt/mcp-server": {
    license: "GPL-3.0-only",
    markers: ["GNU GENERAL PUBLIC LICENSE", "Version 3, 29 June 2007"],
  },
  "@usalyt/tsconfig": {
    license: "MIT",
    markers: ["MIT License"],
    bodyMarkers: [
      "Permission is hereby granted, free of charge",
      "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
      "copies of the Software, and to permit persons to whom the Software is furnished to do so",
      "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
      'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED',
      "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT",
      "IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY",
      "WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE",
      "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE",
    ],
  },
  "@usalyt/eslint-config": {
    license: "GPL-3.0-only",
    markers: ["GNU GENERAL PUBLIC LICENSE", "Version 3, 29 June 2007"],
  },
});

export function licenseContractFor(name) {
  return PACKAGE_LICENSE_CONTRACTS[name] ?? null;
}

/**
 * Validate one package's declared license and bundled LICENSE text against the
 * package-specific contract. Unknown packages and missing/arbitrary licenses
 * are rejected; this helper never falls back to a permissive default.
 */
function normalizeLicenseText(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").replace(/\s+/g, " ").trim();
}

export function validatePackageLicense(name, manifestLicense, licenseText) {
  const contract = licenseContractFor(name);
  if (!contract) {
    return [`no license contract for ${name}`];
  }

  const errors = [];
  if (manifestLicense !== contract.license) {
    errors.push(
      `manifest license is ${String(manifestLicense)}, expected ${contract.license}`,
    );
  }
  for (const marker of contract.markers) {
    if (typeof licenseText !== "string" || !licenseText.includes(marker)) {
      errors.push(`LICENSE is missing marker "${marker}"`);
    }
  }

  const normalizedLicense = normalizeLicenseText(licenseText);
  for (const marker of contract.bodyMarkers ?? []) {
    if (!normalizedLicense.includes(normalizeLicenseText(marker))) {
      errors.push(`LICENSE is missing MIT legal text "${marker}"`);
    }
  }

  return errors;
}
