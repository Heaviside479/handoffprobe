import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { applyCrossingCaseMutations, normalizeCrossingCaseMutations } from './case-builder.js';
import { verifyObservedCrossing, type BoundCrossingVerificationResult } from './binding.js';
import { CrossingEffectRecorder, type CrossingEffectDelta } from './effects.js';
import { CrossingPreDispatchRejectedError, type CrossingPreDispatchGate } from './gate.js';
import {
  loadPinnedCrossingCorpus,
  type CrossingCorpusCase,
  type LoadedCrossingCorpus,
} from './loader.js';
import {
  toExternalCrossingObservedShape,
  type ExternalCrossingObservedShape,
} from './observation.js';
import { createCrossingProvenanceState } from './provenance.js';
import {
  rebindCrossingCorpusBase,
  type CrossingAuthorityBundle,
  type CrossingStatusRecord,
} from './rebinding.js';
import {
  digestCrossingJson,
  SharedCrossingReplayStore,
  type CrossingAuthority,
  type CrossingReference,
} from './verifier.js';
import { runProtocolFixture, type ProtocolFixtureOptions } from '../../protocol-lab/fixture.js';

const NOW = '2026-08-23T12:00:00Z';

export const FIRST_CROSSING_EXECUTION_SLICE = [
  'valid_crossing',
  'caller_swap',
  'message_swap',
  'task_swap',
  'context_swap',
] as const;

export type CrossingExecutionOutcome = 'succeed' | 'reject' | 'non_comparable';

export interface CrossingExecutionAttempt {
  readonly attempt: number;
  readonly outcome: CrossingExecutionOutcome;
  readonly reason: string;
  readonly effect_before: number;
  readonly effect_after: number;
  readonly effect_delta: number;
}

export interface CrossingExecutionLane {
  readonly measurement: 'externally_observed';
  readonly attempts: readonly CrossingExecutionAttempt[];
}

export interface CrossingCaseExecutionResult {
  readonly case: string;
  readonly native: CrossingExecutionLane;
  readonly bound: CrossingExecutionLane;
}

type RuntimeObservedField = 'caller_id' | 'message_id' | 'task_id' | 'context_id';

interface RuntimeObservedMutation {
  readonly field: RuntimeObservedField;
  readonly value: string;
}

interface CrossingRuntimeOverrides {
  crossingCallerOverride?: string;
  crossingMessageIdOverride?: string;
  crossingTaskIdOverride?: string;
  crossingContextIdOverride?: string;
}

const runtimeMutationFields = {
  caller_swap: 'caller_id',
  message_swap: 'message_id',
  task_swap: 'task_id',
  context_swap: 'context_id',
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(label + ' must be an object.');
  }

  return value;
}

function loadPinnedAuthorityBundle(path: string): CrossingAuthorityBundle {
  const base = requireRecord(readJson(path), 'Pinned crossing base vector');

  return {
    initial_reference: structuredClone(
      requireRecord(base.initial_reference, 'initial_reference'),
    ) as unknown as CrossingReference,
    initial_authority: structuredClone(
      requireRecord(base.initial_authority, 'initial_authority'),
    ) as unknown as CrossingAuthority,
    reference: structuredClone(
      requireRecord(base.reference, 'reference'),
    ) as unknown as CrossingReference,
    authority: structuredClone(
      requireRecord(base.authority, 'authority'),
    ) as unknown as CrossingAuthority,
  };
}

function loadPinnedStatus(path: string): CrossingStatusRecord {
  return structuredClone(
    requireRecord(readJson(path), 'Pinned crossing status'),
  ) as unknown as CrossingStatusRecord;
}

function requireAdaptedBundle(value: Record<string, unknown>): CrossingAuthorityBundle {
  return {
    initial_reference: requireRecord(
      value.initial_reference,
      'adapted initial_reference',
    ) as unknown as CrossingReference,
    initial_authority: requireRecord(
      value.initial_authority,
      'adapted initial_authority',
    ) as unknown as CrossingAuthority,
    reference: requireRecord(value.reference, 'adapted reference') as unknown as CrossingReference,
    authority: requireRecord(value.authority, 'adapted authority') as unknown as CrossingAuthority,
  };
}

function requireAdaptedStatus(value: Record<string, unknown>): CrossingStatusRecord {
  return requireRecord(value, 'adapted status') as unknown as CrossingStatusRecord;
}

function requireCorpusCase(corpus: LoadedCrossingCorpus, caseId: string): CrossingCorpusCase {
  const matches = corpus.cases.cases.filter((corpusCase) => corpusCase.id === caseId);

  if (matches.length !== 1 || matches[0] === undefined) {
    throw new Error('Expected exactly one crossing corpus case: ' + caseId);
  }

  return matches[0];
}

function runtimeMutationForCase(
  corpusCase: CrossingCorpusCase,
): RuntimeObservedMutation | undefined {
  if (corpusCase.id === 'valid_crossing') {
    if (
      corpusCase.kind !== 'valid_control' ||
      corpusCase.attempts !== 1 ||
      corpusCase.mutations.length !== 0
    ) {
      throw new Error('valid_crossing must be the unmutated one-attempt valid control.');
    }

    return undefined;
  }

  const expectedField = runtimeMutationFields[corpusCase.id as keyof typeof runtimeMutationFields];

  if (expectedField === undefined) {
    throw new Error(
      'Crossing corpus case is not supported by the identity executor slice: ' + corpusCase.id,
    );
  }

  const mutations = normalizeCrossingCaseMutations(corpusCase);

  if (mutations.length !== 1 || mutations[0] === undefined) {
    throw new Error(corpusCase.id + ' must contain exactly one runtime mutation.');
  }

  const mutation = mutations[0];

  if (
    mutation.op !== 'set' ||
    mutation.target !== 'observed' ||
    mutation.path.length !== 1 ||
    mutation.path[0] !== expectedField ||
    typeof mutation.value !== 'string'
  ) {
    throw new Error(corpusCase.id + ' does not contain the expected observed runtime mutation.');
  }

  return {
    field: expectedField,
    value: mutation.value,
  };
}

function runtimeOverridesForCase(corpusCase: CrossingCorpusCase): CrossingRuntimeOverrides {
  const mutation = runtimeMutationForCase(corpusCase);

  if (mutation === undefined) {
    return {};
  }

  if (mutation.field === 'caller_id') {
    return {
      crossingCallerOverride: mutation.value,
    };
  }

  if (mutation.field === 'message_id') {
    return {
      crossingMessageIdOverride: mutation.value,
    };
  }

  if (mutation.field === 'task_id') {
    return {
      crossingTaskIdOverride: mutation.value,
    };
  }

  return {
    crossingContextIdOverride: mutation.value,
  };
}

function assertRuntimeMutation(
  corpusCase: CrossingCorpusCase,
  observed: ExternalCrossingObservedShape,
): void {
  const mutation = runtimeMutationForCase(corpusCase);

  if (mutation === undefined) {
    return;
  }

  if (observed[mutation.field] !== mutation.value) {
    throw new Error(
      corpusCase.id + ' runtime observation does not contain the declared corpus mutation.',
    );
  }
}

function assertObservedMatchesExpected(
  corpusCase: CrossingCorpusCase,
  actual: ExternalCrossingObservedShape,
  expected: ExternalCrossingObservedShape,
): void {
  if (digestCrossingJson(actual) !== digestCrossingJson(expected)) {
    throw new Error(
      corpusCase.id + ' declarative observed row does not match HandoffProbe runtime observation.',
    );
  }
}

function createAttempt(
  attempt: number,
  outcome: CrossingExecutionOutcome,
  reason: string,
  effect: CrossingEffectDelta,
): CrossingExecutionAttempt {
  const row: CrossingExecutionAttempt = {
    attempt,
    outcome,
    reason,
    effect_before: effect.before,
    effect_after: effect.after,
    effect_delta: effect.delta,
  };

  const valid =
    (row.outcome === 'succeed' && row.reason === 'accepted' && row.effect_delta === 1) ||
    (row.outcome === 'reject' && row.effect_delta === 0) ||
    (row.outcome === 'non_comparable' &&
      row.reason === 'adapter_non_comparable' &&
      row.effect_delta === 0);

  if (!valid) {
    throw new Error('Crossing execution produced an inconsistent outcome/reason/effect row.');
  }

  return row;
}

function fixtureRunId(
  corpusCase: CrossingCorpusCase,
  lane: 'native' | 'bound',
  attempt: number,
): string {
  return [
    'hp-phase9',
    corpusCase.id.replaceAll('_', '-'),
    lane,
    String(attempt).padStart(3, '0'),
  ].join('-');
}

async function executeNativeLane(
  corpusCase: CrossingCorpusCase,
  overrides: CrossingRuntimeOverrides,
): Promise<CrossingExecutionLane> {
  const effects = new CrossingEffectRecorder();
  const attempts: CrossingExecutionAttempt[] = [];

  for (let attempt = 1; attempt <= corpusCase.attempts; attempt += 1) {
    const before = effects.snapshot();

    const options: ProtocolFixtureOptions = {
      runId: fixtureRunId(corpusCase, 'native', attempt),
      crossingObservation: true,
      crossingEffectRecorder: effects,
      ...overrides,
    };

    const result = await runProtocolFixture('secure', options);
    const observation = result.crossingObservation;

    if (observation === undefined) {
      throw new Error(corpusCase.id + ' native lane produced no crossing observation.');
    }

    if (result.crossingVerification !== undefined) {
      throw new Error(corpusCase.id + ' native lane unexpectedly executed the bound verifier.');
    }

    const observed = toExternalCrossingObservedShape(observation);

    assertRuntimeMutation(corpusCase, observed);

    const effect = effects.deltaSince(before);

    attempts.push(createAttempt(attempt, 'succeed', 'accepted', effect));
  }

  return {
    measurement: 'externally_observed',
    attempts,
  };
}

async function executeBoundLane(
  corpusCase: CrossingCorpusCase,
  pinnedBundle: CrossingAuthorityBundle,
  pinnedStatus: CrossingStatusRecord,
  overrides: CrossingRuntimeOverrides,
): Promise<CrossingExecutionLane> {
  const effects = new CrossingEffectRecorder();
  const attempts: CrossingExecutionAttempt[] = [];

  const replayStore = new SharedCrossingReplayStore('phase9-corpus-' + corpusCase.id + '-bound');

  for (let attempt = 1; attempt <= corpusCase.attempts; attempt += 1) {
    const before = effects.snapshot();
    const provenance = createCrossingProvenanceState();

    let gateCalls = 0;

    const gate: CrossingPreDispatchGate = (observation, authorityObservation) => {
      gateCalls += 1;

      if (authorityObservation === undefined) {
        throw new Error(corpusCase.id + ' requires a pre-mutation authority observation.');
      }

      const rebound = rebindCrossingCorpusBase(pinnedBundle, pinnedStatus, authorityObservation);

      const mutated = applyCrossingCaseMutations(rebound, corpusCase);

      const liveObserved = toExternalCrossingObservedShape(observation);

      assertRuntimeMutation(corpusCase, liveObserved);

      assertObservedMatchesExpected(corpusCase, liveObserved, mutated.observed);

      const bundle = requireAdaptedBundle(mutated.bundle);
      const status = requireAdaptedStatus(mutated.status);

      return verifyObservedCrossing(
        observation,
        {
          reference: bundle.reference,
          authority: bundle.authority,
          status,
          initialReference: bundle.initial_reference,
          initialAuthority: bundle.initial_authority,
          now: NOW,
          attempt,
        },
        replayStore,
        provenance,
      );
    };

    let verification: BoundCrossingVerificationResult;

    try {
      const result = await runProtocolFixture('secure', {
        runId: fixtureRunId(corpusCase, 'bound', attempt),
        crossingObservation: true,
        crossingEffectRecorder: effects,
        crossingPreDispatchGate: gate,
        ...overrides,
      });

      if (result.crossingVerification === undefined) {
        throw new Error(corpusCase.id + ' bound lane produced no verification result.');
      }

      verification = result.crossingVerification;
    } catch (error) {
      if (!(error instanceof CrossingPreDispatchRejectedError)) {
        throw error;
      }

      verification = error.verification;
    }

    if (gateCalls !== 1) {
      throw new Error(corpusCase.id + ' bound attempt must invoke the gate exactly once.');
    }

    if (!verification.observationReady) {
      throw new Error(corpusCase.id + ' bound attempt has incomplete runtime observation.');
    }

    const effect = effects.deltaSince(before);

    attempts.push(
      createAttempt(attempt, verification.decision.outcome, verification.decision.reason, effect),
    );
  }

  return {
    measurement: 'externally_observed',
    attempts,
  };
}

export async function executePinnedCrossingCorpusCases(
  caseIds: readonly string[],
): Promise<readonly CrossingCaseExecutionResult[]> {
  if (new Set(caseIds).size !== caseIds.length) {
    throw new Error('Crossing corpus execution case IDs must be unique.');
  }

  const corpus = loadPinnedCrossingCorpus();

  const pinnedBundle = loadPinnedAuthorityBundle(resolve(corpus.root, corpus.cases.base_vector));

  const results: CrossingCaseExecutionResult[] = [];

  for (const caseId of caseIds) {
    const corpusCase = requireCorpusCase(corpus, caseId);

    const overrides = runtimeOverridesForCase(corpusCase);

    const pinnedStatus = loadPinnedStatus(resolve(corpus.root, corpusCase.status_vector));

    results.push({
      case: corpusCase.id,
      native: await executeNativeLane(corpusCase, overrides),
      bound: await executeBoundLane(corpusCase, pinnedBundle, pinnedStatus, overrides),
    });
  }

  return results;
}

export async function executeFirstCrossingCorpusSlice(): Promise<
  readonly CrossingCaseExecutionResult[]
> {
  return executePinnedCrossingCorpusCases(FIRST_CROSSING_EXECUTION_SLICE);
}
