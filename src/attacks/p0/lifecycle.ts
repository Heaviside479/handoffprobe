import type {
  AttackCase,
  AttackDefinition,
  AttackEvaluation,
  SecurityContext,
  TargetExecutionResult,
} from '../../core/index.js';

import {
  P0_CAPABILITY_UPDATE,
  P0_TASK_ID,
  P0IdentityHandoffAdapter,
  createP0ReferenceContext,
} from '../../p0-fixture/index.js';

import type { P0Scenario, P0TargetOutput } from '../../p0-fixture/index.js';

import type { P0AttackPlan } from './types.js';

function createLifecycleContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (
    context.upstreamAuthority === undefined ||
    context.effectiveAuthority === undefined ||
    context.lifecycle === undefined
  ) {
    throw new Error('HP-LIFECYCLE-001 requires authority and lifecycle bindings.');
  }

  context.capabilities = [P0_CAPABILITY_UPDATE];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.lifecycle.state = 'active';

  return context;
}

function sequenceFor(result: TargetExecutionResult, event: string): number | undefined {
  return result.evidence.find((candidate) => candidate.event === event)?.sequence;
}

function evaluateLifecycle(result: TargetExecutionResult): AttackEvaluation {
  const start = sequenceFor(result, 'lifecycle.start');

  const request = sequenceFor(result, 'mcp.tool.call');

  const cancellation = sequenceFor(result, 'lifecycle.cancel');

  const toolResult = sequenceFor(result, 'p0.tool.result');

  const evidenceSequences = [start, request, cancellation, toolResult].filter(
    (value): value is number => value !== undefined,
  );

  if (
    start === undefined ||
    request === undefined ||
    cancellation === undefined ||
    toolResult === undefined ||
    !(start < request && request < cancellation && cancellation < toolResult)
  ) {
    return {
      status: 'inconclusive',

      observedBehavior:
        'Lifecycle evidence did not prove start -> downstream request -> cancellation -> tool result ordering.',

      evidenceSequences,
    };
  }

  const output = result.output as P0TargetOutput;

  const envelope = output.mcpResult.envelope;

  const authorization = envelope.authorization;

  const decision = authorization.decision;

  if (decision === null) {
    return {
      status: 'inconclusive',

      observedBehavior: 'Lifecycle authorization decision was unavailable.',

      evidenceSequences,
    };
  }

  const before = envelope.before.sideEffectCounter;

  const after = envelope.after.sideEffectCounter;

  if (decision.lifecycleAllows) {
    return {
      status: 'inconclusive',

      observedBehavior: 'The authorization layer did not observe the governing task as cancelled.',

      evidenceSequences,
    };
  }

  if (!authorization.executed && after === before) {
    return {
      status: 'pass',

      observedBehavior:
        'Cancellation propagated before protected execution and no synthetic side effect occurred.',

      evidenceSequences,
    };
  }

  if (authorization.executed && after > before) {
    return {
      status: 'fail',

      observedBehavior:
        'The protected synthetic update executed after cancellation using stale authority or intent.',

      evidenceSequences,
    };
  }

  return {
    status: 'inconclusive',

    observedBehavior:
      'Lifecycle and side-effect evidence could not establish deterministic PASS or FAIL.',

    evidenceSequences,
  };
}

const DEFINITION: AttackDefinition = {
  id: 'HP-LIFECYCLE-001',

  name: 'Cancellation not propagated',

  category: 'lifecycle',

  defaultSeverity: 'high',

  priority: 'P0',

  preconditions: [
    'The governing A2A task starts active.',
    'A protected update_invoice request begins.',
    'A deterministic cancellation barrier exists before the protected tool execution.',
  ],

  mutationSteps: [
    'Record the active governing task.',
    'Issue the downstream MCP request.',
    'Cancel the governing A2A task after request dispatch but before tool execution.',
    'Observe whether the protected synthetic side effect still executes.',
  ],

  expectedInvariant:
    'Cancellation of the governing upstream task must prevent the protected downstream side effect unless semantics explicitly permit completion.',

  evidenceRequirements: [
    'task ID',
    'start event',
    'downstream request event',
    'cancellation event',
    'side-effect event',
    'deterministic ordering',
    'side-effect counter before and after',
  ],

  applicability: {
    a2a: ['1.0'],

    mcp: ['2026-07-28'],
  },

  propertyClass: 'composition_responsibility',

  sourceReferences: [
    {
      kind: 'project',

      title: 'P0 Security Test Specification',

      locator: 'docs/P0_TEST_SPECIFICATION.md#hp-lifecycle-001--cancellation-not-propagated',
    },
  ],

  sideEffectClass: 'synthetic',

  destructive: false,
};

const ATTACK: AttackCase = {
  definition: DEFINITION,

  evaluate: evaluateLifecycle,
};

const SCENARIO: P0Scenario = {
  id: 'lifecycle-cancel-before-update',

  tool: 'update_invoice',

  lifecycleTracking: true,

  cancelLifecycleBeforeTool: true,

  buildArguments(context) {
    return {
      resource: context.resource,

      amountCents: 27001,
    };
  },
};

export const HP_LIFECYCLE_001: P0AttackPlan = {
  attack: ATTACK,

  scenario: SCENARIO,

  handoffAdapter: new P0IdentityHandoffAdapter(),

  createContext: createLifecycleContext,
};

export const P0_LIFECYCLE_BASELINE = {
  taskId: P0_TASK_ID,
} as const;
