import { createHash } from 'node:crypto';
import { lstatSync, readFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PINNED_CROSSING_CORPUS_PROFILE =
  'https://minorityprophet.org/conformance/a2a-mcp-crossing/v2';

export const PINNED_CROSSING_CORPUS_SHA256 =
  'f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb';

export const DEFAULT_CROSSING_CORPUS_ROOT = fileURLToPath(
  new URL('../../../fixtures/phase9/a2a-mcp-crossing-v2/', import.meta.url),
);

export type CrossingCorpusErrorCode =
  | 'MISSING_FILE'
  | 'DIGEST_MISMATCH'
  | 'INVALID_JSON'
  | 'INVALID_MANIFEST'
  | 'INVALID_CASES'
  | 'PATH_ESCAPE'
  | 'IDENTITY_MISMATCH';

export class CrossingCorpusError extends Error {
  constructor(
    readonly code: CrossingCorpusErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'CrossingCorpusError';
  }
}

export interface CrossingCorpusManifestEntry {
  readonly path: string;
  readonly sha256: string;
}

export interface CrossingCorpusManifest {
  readonly profile: string;
  readonly identity: string;
  readonly files: readonly CrossingCorpusManifestEntry[];
}

export interface CrossingCorpusCase {
  readonly id: string;
  readonly kind: string;
  readonly attempts: number;
  readonly status_vector: string;
  readonly mutations: readonly unknown[];
  readonly expected_bound: string;
  readonly expected_reason: string;
}

export interface CrossingCorpusCases {
  readonly profile: string;
  readonly status: string;
  readonly base_vector: string;
  readonly cases: readonly CrossingCorpusCase[];
}

export interface LoadedCrossingCorpus {
  readonly root: string;
  readonly manifestSha256: string;
  readonly manifest: CrossingCorpusManifest;
  readonly cases: CrossingCorpusCases;
  readonly caseIds: readonly string[];
}

function sha256(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

function readRequiredFile(path: string): Buffer {
  try {
    if (!lstatSync(path).isFile()) {
      throw new CrossingCorpusError('MISSING_FILE', `Corpus file is not a regular file: ${path}`);
    }

    return readFileSync(path);
  } catch (error) {
    if (error instanceof CrossingCorpusError) {
      throw error;
    }

    throw new CrossingCorpusError('MISSING_FILE', `Required corpus file is missing: ${path}`);
  }
}

function parseJson(path: string, content: Buffer): unknown {
  try {
    return JSON.parse(content.toString('utf8')) as unknown;
  } catch {
    throw new CrossingCorpusError('INVALID_JSON', `Corpus JSON is malformed: ${path}`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireString(record: Record<string, unknown>, key: string, label: string): string {
  const value = record[key];

  if (typeof value !== 'string' || value.length === 0) {
    throw new CrossingCorpusError('INVALID_MANIFEST', `${label} has invalid ${key}`);
  }

  return value;
}

function validateManifest(value: unknown): CrossingCorpusManifest {
  if (!isRecord(value)) {
    throw new CrossingCorpusError('INVALID_MANIFEST', 'Corpus manifest must be an object');
  }

  const profile = requireString(value, 'profile', 'Corpus manifest');
  const identity = requireString(value, 'identity', 'Corpus manifest');
  const files = value.files;

  if (!Array.isArray(files) || files.length !== 14) {
    throw new CrossingCorpusError(
      'INVALID_MANIFEST',
      'Corpus manifest must contain exactly 14 pinned file entries',
    );
  }

  const entries: CrossingCorpusManifestEntry[] = [];
  const seen = new Set<string>();

  for (const item of files) {
    if (!isRecord(item)) {
      throw new CrossingCorpusError('INVALID_MANIFEST', 'Corpus manifest file entry is invalid');
    }

    const path = requireString(item, 'path', 'Corpus manifest file entry');
    const digest = requireString(item, 'sha256', 'Corpus manifest file entry');

    if (!/^[a-f0-9]{64}$/u.test(digest)) {
      throw new CrossingCorpusError(
        'INVALID_MANIFEST',
        `Corpus manifest contains an invalid SHA-256 for ${path}`,
      );
    }

    if (seen.has(path)) {
      throw new CrossingCorpusError('INVALID_MANIFEST', `Duplicate corpus manifest path: ${path}`);
    }

    seen.add(path);
    entries.push({ path, sha256: digest });
  }

  return { profile, identity, files: entries };
}

function validateCases(value: unknown, expectedProfile: string): CrossingCorpusCases {
  if (!isRecord(value)) {
    throw new CrossingCorpusError('INVALID_CASES', 'Corpus cases document must be an object');
  }

  const profile = value.profile;
  const status = value.status;
  const baseVector = value.base_vector;
  const cases = value.cases;

  if (profile !== expectedProfile) {
    throw new CrossingCorpusError(
      'IDENTITY_MISMATCH',
      'Corpus cases profile does not match the pinned manifest profile',
    );
  }

  if (typeof status !== 'string' || typeof baseVector !== 'string' || !Array.isArray(cases)) {
    throw new CrossingCorpusError('INVALID_CASES', 'Corpus cases document has invalid metadata');
  }

  if (cases.length !== 28) {
    throw new CrossingCorpusError('INVALID_CASES', 'Corpus must contain exactly 28 external cases');
  }

  const parsed: CrossingCorpusCase[] = [];
  const ids = new Set<string>();

  for (const row of cases) {
    if (!isRecord(row)) {
      throw new CrossingCorpusError('INVALID_CASES', 'Corpus case entry must be an object');
    }

    const id = row.id;
    const kind = row.kind;
    const attempts = row.attempts;
    const statusVector = row.status_vector;
    const mutations = row.mutations;
    const expectedBound = row.expected_bound;
    const expectedReason = row.expected_reason;

    if (
      typeof id !== 'string' ||
      id.length === 0 ||
      typeof kind !== 'string' ||
      !Number.isInteger(attempts) ||
      typeof attempts !== 'number' ||
      attempts < 1 ||
      typeof statusVector !== 'string' ||
      !Array.isArray(mutations) ||
      typeof expectedBound !== 'string' ||
      typeof expectedReason !== 'string'
    ) {
      throw new CrossingCorpusError('INVALID_CASES', 'Corpus case entry has invalid fields');
    }

    if (ids.has(id)) {
      throw new CrossingCorpusError('INVALID_CASES', `Duplicate external corpus case ID: ${id}`);
    }

    if (id.startsWith('HP-')) {
      throw new CrossingCorpusError(
        'INVALID_CASES',
        `External corpus case ID must not use the HandoffProbe attack namespace: ${id}`,
      );
    }

    ids.add(id);
    parsed.push({
      id,
      kind,
      attempts,
      status_vector: statusVector,
      mutations,
      expected_bound: expectedBound,
      expected_reason: expectedReason,
    });
  }

  return {
    profile,
    status,
    base_vector: baseVector,
    cases: parsed,
  };
}

function resolveManifestPath(root: string, manifestPath: string): string {
  if (isAbsolute(manifestPath)) {
    throw new CrossingCorpusError(
      'PATH_ESCAPE',
      `Corpus manifest path is absolute: ${manifestPath}`,
    );
  }

  const rootPath = resolve(root);
  const candidate = resolve(rootPath, manifestPath);
  const relativePath = relative(rootPath, candidate);

  if (
    relativePath === '' ||
    relativePath === '..' ||
    relativePath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) ||
    isAbsolute(relativePath)
  ) {
    throw new CrossingCorpusError(
      'PATH_ESCAPE',
      `Corpus manifest path escapes the corpus root: ${manifestPath}`,
    );
  }

  return candidate;
}

export function loadPinnedCrossingCorpus(
  root = DEFAULT_CROSSING_CORPUS_ROOT,
): LoadedCrossingCorpus {
  const resolvedRoot = resolve(root);
  const digestPath = resolve(resolvedRoot, 'corpus-v2.sha256');
  const manifestPath = resolve(resolvedRoot, 'corpus-manifest.json');

  const declaredDigest = readRequiredFile(digestPath).toString('utf8').trim();

  if (declaredDigest !== PINNED_CROSSING_CORPUS_SHA256) {
    throw new CrossingCorpusError(
      'IDENTITY_MISMATCH',
      'Corpus digest declaration does not match the pinned HandoffProbe corpus',
    );
  }

  const manifestBytes = readRequiredFile(manifestPath);
  const manifestSha256 = sha256(manifestBytes);

  if (manifestSha256 !== PINNED_CROSSING_CORPUS_SHA256) {
    throw new CrossingCorpusError(
      'DIGEST_MISMATCH',
      'Corpus manifest SHA-256 does not match the pinned HandoffProbe corpus',
    );
  }

  const manifest = validateManifest(parseJson(manifestPath, manifestBytes));

  if (
    manifest.profile !== PINNED_CROSSING_CORPUS_PROFILE ||
    manifest.identity !== 'complete executable corpus and intake contract'
  ) {
    throw new CrossingCorpusError(
      'IDENTITY_MISMATCH',
      'Corpus manifest identity does not match the pinned crossing corpus',
    );
  }

  if (!manifest.files.some((entry) => entry.path === 'cases-v2.json')) {
    throw new CrossingCorpusError(
      'INVALID_MANIFEST',
      'Corpus manifest does not bind cases-v2.json',
    );
  }

  for (const entry of manifest.files) {
    const candidate = resolveManifestPath(resolvedRoot, entry.path);
    const content = readRequiredFile(candidate);
    const actualDigest = sha256(content);

    if (actualDigest !== entry.sha256) {
      throw new CrossingCorpusError(
        'DIGEST_MISMATCH',
        `Corpus file SHA-256 mismatch: ${entry.path}`,
      );
    }
  }

  const casesPath = resolveManifestPath(resolvedRoot, 'cases-v2.json');
  const cases = validateCases(parseJson(casesPath, readRequiredFile(casesPath)), manifest.profile);

  return {
    root: resolvedRoot,
    manifestSha256,
    manifest,
    cases,
    caseIds: cases.cases.map((item) => item.id),
  };
}
