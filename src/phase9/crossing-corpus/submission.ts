import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { executeFullPinnedCrossingCorpusWithEvidence } from './executor.js';
import {
  DEFAULT_CROSSING_CORPUS_ROOT,
  PINNED_CROSSING_CORPUS_PROFILE,
  PINNED_CROSSING_CORPUS_SHA256,
} from './loader.js';

export const CROSSING_SUBMISSION_GRADE = 'implementation_independent' as const;

export const FROZEN_CROSSING_CORPUS_COMMIT = '09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a';

const HANDOFFPROBE_REPOSITORY = 'https://github.com/Heaviside479/handoffprobe';
const FROZEN_CORPUS_REPOSITORY = 'https://github.com/Silentpartnercoding/minority-prophet-border';

const DEFAULT_OPERATOR = 'Heaviside479 / HandoffProbe';

const ARTIFACT_FILES = {
  corpus_manifest: 'corpus-manifest.json',
  result: 'result.json',
  raw_log: 'raw-log.jsonl',
  adapter_config: 'adapter-config.json',
  implementation: 'implementation.json',
  effect_recorder: 'effect-recorder.json',
  replay_store: 'replay-store.json',
  caller_source: 'caller-source.json',
  audience_source: 'audience-source.json',
  status_source_policy: 'status-source-policy.json',
  authority_authentication: 'authority-authentication.json',
  grade_evidence: 'grade-evidence.json',
} as const;

export interface CrossingSubmissionGenerationOptions {
  readonly outputDirectory: string;
  readonly implementationCommit: string;
  readonly operator?: string;
}

export interface CrossingSubmissionGenerationSummary {
  readonly outputDirectory: string;
  readonly submissionPath: string;
  readonly resultPath: string;
  readonly artifactCount: number;
  readonly resultCount: number;
  readonly attemptCount: number;
  readonly grade: typeof CROSSING_SUBMISSION_GRADE;
  readonly implementationCommit: string;
}

function sha256Bytes(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

function sha256File(path: string): string {
  return sha256Bytes(readFileSync(path));
}

function requireCommit(value: string): string {
  if (!/^[0-9a-f]{40}$/u.test(value)) {
    throw new Error('Implementation commit must be a lowercase 40-character Git SHA.');
  }

  return value;
}

function prepareOutputDirectory(path: string): void {
  if (existsSync(path)) {
    if (!statSync(path).isDirectory()) {
      throw new Error('Submission output path already exists and is not a directory.');
    }

    if (readdirSync(path).length > 0) {
      throw new Error('Submission output directory must be empty.');
    }

    return;
  }

  mkdirSync(path, { recursive: true });
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function artifactPath(outputDirectory: string, name: keyof typeof ARTIFACT_FILES): string {
  return resolve(outputDirectory, ARTIFACT_FILES[name]);
}

export async function generateCrossingCorpusSubmission(
  options: CrossingSubmissionGenerationOptions,
): Promise<CrossingSubmissionGenerationSummary> {
  const implementationCommit = requireCommit(options.implementationCommit);
  const operator = options.operator ?? DEFAULT_OPERATOR;
  const outputDirectory = resolve(options.outputDirectory);

  if (operator.trim().length === 0) {
    throw new Error('Submission operator must be non-empty.');
  }

  prepareOutputDirectory(outputDirectory);

  const capture = await executeFullPinnedCrossingCorpusWithEvidence();

  if (capture.results.length !== 28) {
    throw new Error('Full crossing submission must contain exactly 28 results.');
  }

  if (capture.attempts.length !== 58) {
    throw new Error('Full crossing submission must capture exactly 58 runtime attempts.');
  }

  const corpusManifestSource = resolve(DEFAULT_CROSSING_CORPUS_ROOT, 'corpus-manifest.json');

  const corpusManifestBytes = readFileSync(corpusManifestSource);
  const corpusManifestSha256 = sha256Bytes(corpusManifestBytes);

  if (corpusManifestSha256 !== PINNED_CROSSING_CORPUS_SHA256) {
    throw new Error('Pinned corpus manifest digest changed before submission generation.');
  }

  writeFileSync(artifactPath(outputDirectory, 'corpus_manifest'), corpusManifestBytes);

  const result = {
    profile: PINNED_CROSSING_CORPUS_PROFILE,
    grade: CROSSING_SUBMISSION_GRADE,
    corpus_sha256: corpusManifestSha256,
    implementation: {
      a2a: 'HandoffProbe protocol-lab using @a2a-js/sdk 1.1.0 with transport-authenticated caller observation and server-resolved task/context',
      mcp: 'HandoffProbe protocol-lab using MCP TypeScript SDK 2.0.0 with transport audience and exact pre-dispatch tool/arguments observation',
      verifier: 'HandoffProbe crossing authority verifier at commit ' + implementationCommit,
      operator,
    },
    results: capture.results,
  };

  writeJson(artifactPath(outputDirectory, 'result'), result);

  const rawLog = capture.attempts
    .map((attempt, index) =>
      JSON.stringify({
        sequence: index + 1,
        profile: PINNED_CROSSING_CORPUS_PROFILE,
        implementation_commit: implementationCommit,
        evidence_origin: 'handoffprobe_runtime',
        effect_semantics: 'local_synthetic_mcp_receiver_execution',
        ...attempt,
      }),
    )
    .join('\n');

  writeFileSync(artifactPath(outputDirectory, 'raw_log'), rawLog + '\n', 'utf8');

  const adapterConfig = {
    adapter: 'HandoffProbe protocol-lab A2A 1.0 to MCP 2026-07-28 crossing adapter',
    version: 'phase9-1e-v2@' + implementationCommit,
    corpus_consumption: 'identified_transformation',
    transformations: [
      'Rebind frozen requester, message, task, and context authority/observed values to the HandoffProbe transport-authenticated caller and server-resolved A2A runtime identifiers before applying each frozen case mutation.',
      'Rebind the frozen MCP audience and action baseline to the HandoffProbe pinned local MCP transport URL and read_invoice synthetic receiver before applying each frozen case mutation.',
      'Recompute action and authority digest references after runtime rebinding while preserving frozen mutation order and the expected bound outcome/reason.',
      'Map frozen observed set/delete mutations onto HandoffProbe runtime seams; paired omissions remain actual null runtime observations and are never filled from reference-fixture rows.',
    ],
  };

  writeJson(artifactPath(outputDirectory, 'adapter_config'), adapterConfig);

  const implementation = {
    components: [
      {
        name: 'handoffprobe-protocol-lab',
        repository: HANDOFFPROBE_REPOSITORY,
        commit: implementationCommit,
      },
      {
        name: 'handoffprobe-crossing-verifier',
        repository: HANDOFFPROBE_REPOSITORY,
        commit: implementationCommit,
      },
      {
        name: 'handoffprobe-crossing-effect-recorder',
        repository: HANDOFFPROBE_REPOSITORY,
        commit: implementationCommit,
      },
      {
        name: 'minority-prophet-border-frozen-corpus',
        repository: FROZEN_CORPUS_REPOSITORY,
        commit: FROZEN_CROSSING_CORPUS_COMMIT,
      },
    ],
  };

  writeJson(artifactPath(outputDirectory, 'implementation'), implementation);

  const effectRecorder = {
    source:
      'HandoffProbe CrossingEffectRecorder at src/phase9/crossing-corpus/effects.ts, incremented from the productive synthetic MCP receiver path in src/protocol-lab/mcp/fake-tools.ts',
    outside_verifier: true,
    effect_semantics: 'local_synthetic_mcp_receiver_execution',
    production_world_effect: false,
    recording_policy:
      'Exactly one effect increment occurs only on a productive synthetic receiver execution after the bound pre-dispatch gate accepts; rejected attempts retain delta zero.',
  };

  writeJson(artifactPath(outputDirectory, 'effect_recorder'), effectRecorder);

  const replayStore = {
    backend: 'HandoffProbe SharedCrossingReplayStore in-memory Set',
    shared_scope:
      'One bound replay-store instance per corpus case, shared continuously across every attempt in that case.',
    durability:
      'Process-local state retained for the deterministic corpus execution; not persisted across process restart.',
    replay_case_policy:
      'The replay case uses the same store for attempt 1 and attempt 2, producing accepted/delta=1 followed by nonce_replay/delta=0.',
  };

  writeJson(artifactPath(outputDirectory, 'replay_store'), replayStore);

  const callerSource = {
    source:
      'HandoffProbe local A2A protocol-lab transport authentication observation (a2a.transport_auth)',
    transport_authenticated: true,
    observation_point:
      'Caller identity is recorded from the A2A transport-authentication seam before translation and before MCP dispatch.',
  };

  writeJson(artifactPath(outputDirectory, 'caller_source'), callerSource);

  const audienceSource = {
    source: 'pinned_configuration',
    transport_bound: true,
    observation_point:
      'The actual StreamableHTTPClientTransport URL is observed immediately before MCP dispatch.',
    local_endpoint: 'http://handoffprobe.local/mcp',
    network_semantics:
      'The transport URL is exercised through the MCP client with a local intercepted fetch handler; no production or third-party endpoint is contacted.',
  };

  writeJson(artifactPath(outputDirectory, 'audience_source'), audienceSource);

  const statusSourcePolicy = {
    source: 'Frozen corpus status vector selected by each case status_vector',
    verification_policy:
      'HandoffProbe verifies status_ref and authority_id binding, status=current, and observed_at freshness against the fixed conformance clock before replay consumption and effect.',
    max_age_seconds: 300,
  };

  writeJson(artifactPath(outputDirectory, 'status_source_policy'), statusSourcePolicy);

  const authorityAuthentication = {
    initial: {
      issuer_id: 'https://issuer.example',
      mechanism: 'Ed25519 signature verification against a pinned synthetic issuer public key',
      policy:
        'For the valid-control initial authority, HandoffProbe recomputes the authority digest and verifies an Ed25519 signature over the domain-separated digest with the pinned trusted issuer public key before replay consumption and effect. The fixed RFC 8032 fixture key is public non-production conformance material.',
      verified: true,
    },
    resolved: {
      issuer_id: 'https://issuer.example',
      mechanism: 'Ed25519 signature verification against a pinned synthetic issuer public key',
      policy:
        'For the valid-control resolved authority, HandoffProbe recomputes the authority digest and verifies an Ed25519 signature over the domain-separated digest with the pinned trusted issuer public key after the existing binding/status checks and before replay consumption and effect.',
      verified: true,
    },
  };

  writeJson(artifactPath(outputDirectory, 'authority_authentication'), authorityAuthentication);

  const gradeEvidence = {
    claimed_grade: CROSSING_SUBMISSION_GRADE,
    implementation_operator: operator,
    adapter_operator: operator,
    relationship:
      'The HandoffProbe implementation, verifier, runtime observation, and effect recording are independent of the frozen Python reference implementation. Adapter operation and execution use the same HandoffProbe operator, so operator_independent is not claimed. Intake reviewer confirmation is not asserted by this submission.',
  };

  writeJson(artifactPath(outputDirectory, 'grade_evidence'), gradeEvidence);

  const artifacts = Object.fromEntries(
    Object.entries(ARTIFACT_FILES).map(([name, path]) => [
      name,
      {
        path,
        sha256: sha256File(resolve(outputDirectory, path)),
      },
    ]),
  );

  if (Object.keys(artifacts).length !== 12) {
    throw new Error('Submission manifest must bind exactly 12 artifacts.');
  }

  const submission = {
    profile: PINNED_CROSSING_CORPUS_PROFILE,
    artifacts,
  };

  const submissionPath = resolve(outputDirectory, 'submission.json');

  writeJson(submissionPath, submission);

  return {
    outputDirectory,
    submissionPath,
    resultPath: artifactPath(outputDirectory, 'result'),
    artifactCount: Object.keys(artifacts).length,
    resultCount: capture.results.length,
    attemptCount: capture.attempts.length,
    grade: CROSSING_SUBMISSION_GRADE,
    implementationCommit,
  };
}
