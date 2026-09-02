import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  CROSSING_SUBMISSION_GRADE,
  generateCrossingCorpusSubmission,
} from '../src/phase9/crossing-corpus/submission.js';

interface ResultFile {
  readonly grade: string;
  readonly corpus_sha256: string;
  readonly implementation: {
    readonly operator: string;
  };
  readonly results: readonly {
    readonly case: string;
    readonly native: {
      readonly measurement: string;
    };
    readonly bound: {
      readonly measurement: string;
    };
  }[];
}

interface SubmissionManifest {
  readonly profile: string;
  readonly artifacts: Readonly<
    Record<
      string,
      {
        readonly path: string;
        readonly sha256: string;
      }
    >
  >;
}

interface AdapterConfig {
  readonly corpus_consumption: string;
  readonly transformations: readonly string[];
}

interface EffectRecorderEvidence {
  readonly outside_verifier: boolean;
  readonly effect_semantics: string;
  readonly production_world_effect: boolean;
}

interface ReplayStoreEvidence {
  readonly shared_scope: string;
  readonly durability: string;
}

interface GradeEvidence {
  readonly claimed_grade: string;
  readonly relationship: string;
}

interface AuthorityAuthenticationEvidence {
  readonly initial: {
    readonly issuer_id: string;
    readonly mechanism: string;
    readonly policy: string;
    readonly verified: boolean;
  };
  readonly resolved: {
    readonly issuer_id: string;
    readonly mechanism: string;
    readonly policy: string;
    readonly verified: boolean;
  };
}

const roots: string[] = [];

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function sha256(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

describe('Phase 9 crossing submission generator', () => {
  it('generates an issuer-authenticated 12-artifact submission from HandoffProbe runtime evidence', async () => {
    const root = mkdtempSync(join(tmpdir(), 'handoffprobe-phase9-submission-'));

    roots.push(root);

    const output = join(root, 'submission');
    const implementationCommit = 'a'.repeat(40);

    const summary = await generateCrossingCorpusSubmission({
      outputDirectory: output,
      implementationCommit,
      operator: 'HandoffProbe test operator',
    });

    expect(summary.artifactCount).toBe(12);
    expect(summary.resultCount).toBe(28);
    expect(summary.attemptCount).toBe(58);
    expect(summary.grade).toBe(CROSSING_SUBMISSION_GRADE);
    expect(summary.implementationCommit).toBe(implementationCommit);

    expect(readdirSync(output).sort()).toEqual([
      'adapter-config.json',
      'audience-source.json',
      'authority-authentication.json',
      'caller-source.json',
      'corpus-manifest.json',
      'effect-recorder.json',
      'grade-evidence.json',
      'implementation.json',
      'raw-log.jsonl',
      'replay-store.json',
      'result.json',
      'status-source-policy.json',
      'submission.json',
    ]);

    const result = readJson<ResultFile>(resolve(output, 'result.json'));

    expect(result.grade).toBe('implementation_independent');
    expect(result.results).toHaveLength(28);
    expect(result.implementation.operator).toBe('HandoffProbe test operator');

    for (const row of result.results) {
      expect(row.native.measurement).toBe('externally_observed');
      expect(row.bound.measurement).toBe('externally_observed');
    }

    const rawLines = readFileSync(resolve(output, 'raw-log.jsonl'), 'utf8').trim().split('\n');

    expect(rawLines).toHaveLength(58);

    const firstRaw = JSON.parse(rawLines[0] ?? '{}') as {
      readonly sequence?: number;
      readonly evidence_origin?: string;
      readonly effect_semantics?: string;
    };

    expect(firstRaw.sequence).toBe(1);
    expect(firstRaw.evidence_origin).toBe('handoffprobe_runtime');
    expect(firstRaw.effect_semantics).toBe('local_synthetic_mcp_receiver_execution');

    const manifest = readJson<SubmissionManifest>(resolve(output, 'submission.json'));

    expect(Object.keys(manifest.artifacts)).toHaveLength(12);

    for (const artifact of Object.values(manifest.artifacts)) {
      expect(sha256(resolve(output, artifact.path))).toBe(artifact.sha256);
    }

    expect(manifest.artifacts.corpus_manifest?.sha256).toBe(result.corpus_sha256);

    const adapter = readJson<AdapterConfig>(resolve(output, 'adapter-config.json'));

    expect(adapter.corpus_consumption).toBe('identified_transformation');
    expect(adapter.transformations.length).toBeGreaterThanOrEqual(1);
    expect(adapter.transformations.join(' ')).toContain('never filled from reference-fixture rows');

    const effect = readJson<EffectRecorderEvidence>(resolve(output, 'effect-recorder.json'));

    expect(effect.outside_verifier).toBe(true);
    expect(effect.production_world_effect).toBe(false);
    expect(effect.effect_semantics).toBe('local_synthetic_mcp_receiver_execution');

    const replay = readJson<ReplayStoreEvidence>(resolve(output, 'replay-store.json'));

    expect(replay.shared_scope).toContain('shared continuously across every attempt');
    expect(replay.durability).toContain('not persisted across process restart');

    const authority = readJson<AuthorityAuthenticationEvidence>(
      resolve(output, 'authority-authentication.json'),
    );

    expect(authority.initial).toEqual(
      expect.objectContaining({
        issuer_id: 'https://issuer.example',
        mechanism: 'Ed25519 signature verification against a pinned synthetic issuer public key',
        verified: true,
      }),
    );
    expect(authority.initial.policy).toContain('domain-separated digest');
    expect(authority.initial.policy).toContain('pinned trusted issuer public key');
    expect(authority.initial.policy).toContain('before replay consumption and effect');
    expect(authority.initial.policy).toContain('public non-production conformance material');

    expect(authority.resolved).toEqual(
      expect.objectContaining({
        issuer_id: 'https://issuer.example',
        mechanism: 'Ed25519 signature verification against a pinned synthetic issuer public key',
        verified: true,
      }),
    );
    expect(authority.resolved.policy).toContain('domain-separated digest');
    expect(authority.resolved.policy).toContain('pinned trusted issuer public key');
    expect(authority.resolved.policy).toContain('before replay consumption and effect');

    const grade = readJson<GradeEvidence>(resolve(output, 'grade-evidence.json'));

    expect(grade.claimed_grade).toBe('implementation_independent');
    expect(grade.relationship).toContain('operator_independent is not claimed');
    expect(grade.relationship).toContain('Intake reviewer confirmation is not asserted');
  }, 20_000);
});
