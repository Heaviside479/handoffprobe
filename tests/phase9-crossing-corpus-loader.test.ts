import { cpSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_CROSSING_CORPUS_ROOT,
  PINNED_CROSSING_CORPUS_SHA256,
  loadPinnedCrossingCorpus,
} from '../src/phase9/crossing-corpus/loader.js';

const temporaryRoots: string[] = [];

function copyCorpus(): string {
  const root = mkdtempSync(join(tmpdir(), 'handoffprobe-crossing-corpus-'));
  const target = join(root, 'corpus');

  cpSync(DEFAULT_CROSSING_CORPUS_ROOT, target, { recursive: true });
  temporaryRoots.push(root);

  return target;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('Phase 9.1B offline pinned crossing-corpus loader', () => {
  it('loads the repository-owned pinned corpus entirely from local bytes', () => {
    const loaded = loadPinnedCrossingCorpus();

    expect(loaded.manifestSha256).toBe(PINNED_CROSSING_CORPUS_SHA256);
    expect(loaded.manifest.files).toHaveLength(14);
    expect(loaded.caseIds).toHaveLength(28);
    expect(loaded.caseIds[0]).toBe('valid_crossing');
    expect(loaded.caseIds.at(-1)).toBe('stage_evidence_omitted');
    expect(loaded.caseIds.some((id) => id.startsWith('HP-'))).toBe(false);
  });

  it('accepts an explicitly supplied local corpus directory', () => {
    const root = copyCorpus();
    const loaded = loadPinnedCrossingCorpus(root);

    expect(loaded.root).toBe(root);
    expect(loaded.caseIds).toContain('replay');
    expect(loaded.caseIds).toContain('audience_swap');
  });

  it('rejects a changed root digest declaration before execution', () => {
    const root = copyCorpus();

    writeFileSync(join(root, 'corpus-v2.sha256'), `${'0'.repeat(64)}\n`, 'utf8');

    expect(() => loadPinnedCrossingCorpus(root)).toThrowError(
      expect.objectContaining({
        code: 'IDENTITY_MISMATCH',
      }),
    );
  });

  it('rejects a tampered manifest before parsing cases', () => {
    const root = copyCorpus();

    writeFileSync(join(root, 'corpus-manifest.json'), '{}\n', 'utf8');

    expect(() => loadPinnedCrossingCorpus(root)).toThrowError(
      expect.objectContaining({
        code: 'DIGEST_MISMATCH',
      }),
    );
  });

  it('rejects a tampered manifest-bound corpus file', () => {
    const root = copyCorpus();

    writeFileSync(join(root, 'cases-v2.json'), '{"tampered":true}\n', 'utf8');

    expect(() => loadPinnedCrossingCorpus(root)).toThrowError(
      expect.objectContaining({
        code: 'DIGEST_MISMATCH',
      }),
    );
  });

  it('rejects a missing manifest-bound corpus file deterministically', () => {
    const root = copyCorpus();

    unlinkSync(join(root, 'vectors/status-current.json'));

    expect(() => loadPinnedCrossingCorpus(root)).toThrowError(
      expect.objectContaining({
        code: 'MISSING_FILE',
      }),
    );
  });

  it('preserves the external corpus case IDs without remapping them to attack IDs', () => {
    const loaded = loadPinnedCrossingCorpus();

    expect(loaded.caseIds).toEqual(loaded.cases.cases.map((item) => item.id));
    expect(loaded.caseIds).toContain('caller_swap');
    expect(loaded.caseIds).toContain('task_swap');
    expect(loaded.caseIds).toContain('arguments_swap');
    expect(loaded.caseIds).toContain('replay');
  });
});
