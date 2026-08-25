import type {
  AttackDefinition,
  AttackEvaluation,
  SecurityContext,
  TargetExecutionResult,
} from '../../core/index.js';

import {
  P0_AUTHORIZED_DOWNSTREAM,
  P0_AUTHORIZED_RESOURCE,
  P0_AUTHORIZED_TENANT,
  P0_CALLER,
  P0_CAPABILITY_UPDATE,
  P0_PRINCIPAL,
  createP0ReferenceContext,
  createP0UpdateInvoiceScenario,
} from '../../p0-fixture/index.js';

import type { P1RaceTargetOutput } from '../../p1-fixture/index.js';

import type { P1RaceAttackPlan } from './types.js';

const FULL_CHAIN = [P0_PRINCIPAL, P0_CALLER, P0_AUTHORIZED_DOWNSTREAM] as const;

function projectSources(section: string) {
  return [
    {
      kind: 'project' as const,
      title: 'P1 Security Test Specification',
      locator: `docs/P1_TEST_SPECIFICATION.md#${section}`,
    },
    {
      kind: 'project' as const,
      title: 'Attack Catalog',
      locator: 'docs/ATTACK_CATALOG.md#v01-p1--add-after-p0-engine-is-credible',
    },
  ];
}

function createDefinition(input: {
  id: 'HP-RACE-001' | 'HP-RACE-002';
  name: string;
  preconditions: string[];
  mutationSteps: string[];
  invariant: string;
  evidence: string[];
  section: string;
}): AttackDefinition {
  return {
    id: input.id,
    name: input.name,
    category: 'race',
    defaultSeverity: 'high',
    priority: 'P1',
    preconditions: input.preconditions,
    mutationSteps: input.mutationSteps,
    expectedInvariant: input.invariant,
    evidenceRequirements: input.evidence,
    applicability: {
      a2a: ['1.0'],
      mcp: ['2026-07-28'],
    },
    propertyClass: 'composition_responsibility',
    sourceReferences: projectSources(input.section),
    sideEffectClass: 'synthetic',
    destructive: false,
  };
}

function createUpdateContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('P1 race attacks require authority bindings.');
  }

  context.capabilities = [P0_CAPABILITY_UPDATE];
  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];
  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  return context;
}

function createDelegation(input: { id: string; singleUse: boolean }) {
  return {
    id: input.id,
    principal: P0_PRINCIPAL,
    delegate: P0_AUTHORIZED_DOWNSTREAM,
    tenant: P0_AUTHORIZED_TENANT,
    resources: [P0_AUTHORIZED_RESOURCE],
    capabilities: [P0_CAPABILITY_UPDATE],
    chain: [...FULL_CHAIN],
    taskId: 'task:P1-RACE-A',
    runId: 'run:P1-RACE-A',
    issuedAt: 10,
    expiresAt: 40,
    singleUse: input.singleUse,
  };
}

function createRequest() {
  return {
    principal: P0_PRINCIPAL,
    delegate: P0_AUTHORIZED_DOWNSTREAM,
    tenant: P0_AUTHORIZED_TENANT,
    resource: P0_AUTHORIZED_RESOURCE,
    capability: P0_CAPABILITY_UPDATE,
    taskId: 'task:P1-RACE-A',
    runId: 'run:P1-RACE-A',
    requiredChain: FULL_CHAIN,
  };
}

function relevantEvidenceSequences(result: TargetExecutionResult): number[] {
  const relevant = new Set([
    'p1.race.arrive',
    'p1.race.release',
    'p1.race.authorization',
    'p1.race.blocked',
    'p1.race.side_effect',
    'p1.partial.capture',
    'p1.partial.invalidate',
    'p1.partial.resume',
    'p1.partial.blocked',
    'p1.partial.side_effect',
    'handoff.translate',
    'mcp.tool.call',
    'mcp.tool.result',
  ]);

  return result.evidence
    .filter((event) => relevant.has(event.event))
    .map((event) => event.sequence);
}

function evaluateRace001(result: TargetExecutionResult): AttackEvaluation {
  const output = result.output as P1RaceTargetOutput;
  const evidenceSequences = relevantEvidenceSequences(result);

  if (output.barrierArrivals !== 2) {
    return {
      status: 'inconclusive',
      observedBehavior:
        'Both deterministic race attempts did not reach the synchronization barrier.',
      evidenceSequences,
    };
  }

  const delta = output.sideEffectCounterAfter - output.sideEffectCounterBefore;

  if (output.executedAttempts.length === 1 && delta === 1) {
    return {
      status: 'pass',
      observedBehavior:
        'Exactly one concurrent attempt consumed the one-time authority and only one synthetic protected side effect occurred.',
      evidenceSequences,
    };
  }

  if (output.executedAttempts.length === 2 && delta === 2) {
    return {
      status: 'fail',
      observedBehavior:
        'Both concurrent attempts reused the same one-time authority and produced two protected synthetic side effects.',
      evidenceSequences,
    };
  }

  return {
    status: 'inconclusive',
    observedBehavior:
      'Race evidence did not establish a deterministic single or double protected execution.',
    evidenceSequences,
  };
}

function evaluateRace002(result: TargetExecutionResult): AttackEvaluation {
  const output = result.output as P1RaceTargetOutput;
  const evidenceSequences = relevantEvidenceSequences(result);

  if (
    !output.initialDecision.allowed ||
    output.currentDecision.allowed ||
    !output.currentDecision.reasons.includes('delegation_invalidated')
  ) {
    return {
      status: 'inconclusive',
      observedBehavior:
        'The fixture did not establish a valid captured state followed by deterministic invalidation.',
      evidenceSequences,
    };
  }

  const delta = output.sideEffectCounterAfter - output.sideEffectCounterBefore;

  if (output.executedAttempts.length === 0 && delta === 0) {
    return {
      status: 'pass',
      observedBehavior:
        'The resumed operation revalidated current security state and rejected the stale captured authority.',
      evidenceSequences,
    };
  }

  if (output.executedAttempts.length === 1 && output.capturedStateUsed && delta === 1) {
    return {
      status: 'fail',
      observedBehavior:
        'The interrupted operation resumed using stale captured authority after that authority had been invalidated.',
      evidenceSequences,
    };
  }

  return {
    status: 'inconclusive',
    observedBehavior:
      'Partial-failure evidence could not establish a deterministic stale-state PASS or FAIL.',
    evidenceSequences,
  };
}

const RACE_001_DEFINITION = createDefinition({
  id: 'HP-RACE-001',
  name: 'Parallel one-time authority consumption',
  preconditions: [
    'One valid delegation is explicitly single-use.',
    'Two execution attempts target the same protected logical action.',
  ],
  mutationSteps: [
    'Start both attempts before either consumes the authority.',
    'Hold both at a deterministic synchronization barrier.',
    'Release them in fixed order against the same single-use delegation.',
  ],
  invariant: 'One-time authority must authorize at most one successful protected side effect.',
  evidence: [
    'delegation ID',
    'single-use marker',
    'both attempt IDs',
    'barrier arrival and release events',
    'consumption state',
    'authorization result per attempt',
    'synthetic side-effect counter',
  ],
  section: 'hp-race-001--parallel-one-time-authority-consumption',
});

const RACE_002_DEFINITION = createDefinition({
  id: 'HP-RACE-002',
  name: 'Partial-failure stale execution',
  preconditions: [
    'A protected operation begins with valid authority.',
    'The translated security state can be captured before protected execution.',
  ],
  mutationSteps: [
    'Pause after translation but before protected execution.',
    'Invalidate the governing delegation during the interruption.',
    'Resume using the previously captured state.',
  ],
  invariant:
    'A resumed operation must revalidate security state that may have changed during an interruption.',
  evidence: [
    'logical action ID',
    'interruption point',
    'captured authorization state',
    'invalidation event',
    'resume attempt',
    'current revalidation result',
    'deterministic sequence ordering',
    'synthetic side-effect counter',
  ],
  section: 'hp-race-002--partial-failure-stale-execution',
});

const RACE_001_CASE = {
  definition: RACE_001_DEFINITION,
  evaluate: evaluateRace001,
};

const RACE_002_CASE = {
  definition: RACE_002_DEFINITION,
  evaluate: evaluateRace002,
};

export const HP_RACE_001: P1RaceAttackPlan = {
  attack: RACE_001_CASE,

  scenario: {
    id: 'parallel-one-time-authority',
    kind: 'parallel-one-time-authority',
    actionId: 'action:ACT-RACE-1001',
    firstAttemptId: 'attempt:ATT-1',
    secondAttemptId: 'attempt:ATT-2',

    delegation: createDelegation({
      id: 'delegation:DEL-ONCE-1001',
      singleUse: true,
    }),

    request: createRequest(),
    logicalTime: 15,
    p0Scenario: createP0UpdateInvoiceScenario(24701),
  },

  createContext: createUpdateContext,
};

export const HP_RACE_002: P1RaceAttackPlan = {
  attack: RACE_002_CASE,

  scenario: {
    id: 'partial-failure-stale-execution',
    kind: 'partial-failure-stale-execution',
    actionId: 'action:ACT-STALE-1001',
    firstAttemptId: 'attempt:ATT-1',
    secondAttemptId: 'attempt:ATT-2',

    delegation: createDelegation({
      id: 'delegation:DEL-STALE-1001',
      singleUse: false,
    }),

    request: createRequest(),
    logicalTime: 15,
    invalidationTime: 16,
    p0Scenario: createP0UpdateInvoiceScenario(24702),
  },

  createContext: createUpdateContext,
};

export const P1_RACE_ATTACKS: readonly P1RaceAttackPlan[] = [HP_RACE_001, HP_RACE_002];
