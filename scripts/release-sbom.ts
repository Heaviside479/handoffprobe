import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const REQUIRED_RUNTIME_PACKAGES = [
  'handoffprobe',
  '@a2a-js/sdk',
  '@modelcontextprotocol/client',
  '@modelcontextprotocol/server',
  'express',
  'zod',
] as const;

const FORBIDDEN_DEV_PACKAGES = ['eslint', 'prettier', 'tsx', 'typescript', 'vitest'] as const;

function argumentValue(name: string): string {
  const index = process.argv.indexOf(name);

  if (index === -1 || index + 1 >= process.argv.length) {
    throw new Error(`Missing required argument: ${name}`);
  }

  const value = process.argv[index + 1];

  if (!value) {
    throw new Error(`Missing value for argument: ${name}`);
  }

  return value;
}

function stableObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stableObject(entry));
  }

  if (typeof value === 'object' && value !== null) {
    const object = value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(object)
        .sort()
        .map((key) => [key, stableObject(object[key])]),
    );
  }

  return value;
}

function packageNames(packages: unknown[]): Set<string> {
  const names = new Set<string>();

  for (const entry of packages) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }

    const name = (entry as { name?: unknown }).name;

    if (typeof name === 'string') {
      names.add(name);
    }
  }

  return names;
}

const outputPath = resolve(argumentValue('--output'));
const comparisonPath = resolve(argumentValue('--comparison-output'));

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  name?: unknown;
  version?: unknown;
};

if (packageJson.name !== 'handoffprobe' || typeof packageJson.version !== 'string') {
  throw new Error('Unexpected package identity.');
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const raw = execFileSync(
  npmCommand,
  [
    'sbom',
    '--package-lock-only',
    '--omit',
    'dev',
    '--sbom-format',
    'spdx',
    '--sbom-type',
    'library',
  ],
  {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  },
);

const document = JSON.parse(raw) as Record<string, unknown>;

if (document.spdxVersion !== 'SPDX-2.3') {
  throw new Error(`Unexpected SPDX version: ${String(document.spdxVersion)}`);
}

if (document.name !== `handoffprobe@${packageJson.version}`) {
  throw new Error(`Unexpected SPDX document name: ${String(document.name)}`);
}

if (typeof document.documentNamespace !== 'string' || document.documentNamespace.length === 0) {
  throw new Error('SPDX documentNamespace is missing or invalid.');
}

if (
  typeof document.creationInfo !== 'object' ||
  document.creationInfo === null ||
  Array.isArray(document.creationInfo)
) {
  throw new Error('SPDX creationInfo is missing or invalid.');
}

const creationInfo = document.creationInfo as Record<string, unknown>;

if (typeof creationInfo.created !== 'string' || creationInfo.created.length === 0) {
  throw new Error('SPDX creationInfo.created is missing or invalid.');
}

if (!Array.isArray(document.packages) || document.packages.length === 0) {
  throw new Error('SPDX document does not contain packages.');
}

const names = packageNames(document.packages);

for (const required of REQUIRED_RUNTIME_PACKAGES) {
  if (!names.has(required)) {
    throw new Error(`Required runtime package missing from SBOM: ${required}`);
  }
}

for (const forbidden of FORBIDDEN_DEV_PACKAGES) {
  if (names.has(forbidden)) {
    throw new Error(`Development-only package present in release SBOM: ${forbidden}`);
  }
}

/*
 * Keep the actual SPDX document untouched.
 *
 * npm intentionally generates document-identity metadata for each SBOM:
 * documentNamespace and creationInfo.created.
 *
 * Those fields are excluded only from the deterministic comparison projection.
 * The projection is not itself distributed or claimed to be an SPDX document.
 */
const comparisonDocument = structuredClone(document);

delete comparisonDocument.documentNamespace;

const comparisonCreationInfo = comparisonDocument.creationInfo as Record<string, unknown>;

delete comparisonCreationInfo.created;

const comparison = `${JSON.stringify(stableObject(comparisonDocument), null, 2)}\n`;

mkdirSync(dirname(outputPath), { recursive: true });
mkdirSync(dirname(comparisonPath), { recursive: true });

writeFileSync(outputPath, raw.endsWith('\n') ? raw : `${raw}\n`);
writeFileSync(comparisonPath, comparison);

console.log(`Release SBOM: ${outputPath}`);
console.log(`Comparison projection: ${comparisonPath}`);
console.log(`SPDX version: ${document.spdxVersion}`);
console.log(`Package: ${document.name}`);
console.log(`Packages: ${document.packages.length}`);
console.log(`Document namespace: ${document.documentNamespace}`);
console.log(`Created: ${creationInfo.created}`);
console.log('Release SBOM validation: PASS');
