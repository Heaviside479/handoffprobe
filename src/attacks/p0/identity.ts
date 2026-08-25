import { cloneSecurityContext } from '../../core/index.js';

import type {
  AttackCase,
  AttackDefinition,
  AttackEvaluation,
  HandoffAdapter,
  SecurityContext,
  TargetExecutionResult,
} from '../../core/index.js';

import {
  P0_AUTHORIZED_DOWNSTREAM,
  P0_CAPABILITY_UPDATE,
  P0_PRINCIPAL,
  P0_UNAUTHORIZED_DOWNSTREAM,
  createP0ReferenceContext,
  createP0UpdateInvoiceScenario,
} from '../../p0-fixture/index.js';

import type { P0TargetOutput } from '../../p0-fixture/index.js';

import type { P0AttackPlan } from './types.js';

function projectSources(section: string) {
  return [
    {
      kind: 'project' as const,
      title: 'P0 Security Test Specification',
      locator: `docs/P0_TEST_SPECIFICATION.md#${section}`,
    },
    {
      kind: 'project' as const,
      title: 'Attack Catalog',
      locator: 'docs/ATTACK_CATALOG.md#v01-p0--implement-first',
    },
  ];
}

function relevantEvidenceSequences(result: TargetExecutionResult): number[] {
  const relevant = new Set(['handoff.translate', 'p0.authorization', 'p0.tool.result']);

  return result.evidence
    .filter((event) => relevant.has(event.event))
    .map((event) => event.sequence);
}

function evaluateIdentityMutation(
  result: TargetExecutionResult,
  messages: {
    pass: string;
    fail: string;
    failSeverity?: 'high';
  },
): AttackEvaluation {
  const output = result.output as P0TargetOutput;

  const envelope = output.mcpResult.envelope;

  const authorization = envelope.authorization;

  const before = envelope.before.sideEffectCounter;

  const after = envelope.after.sideEffectCounter;

  const evidenceSequences = relevantEvidenceSequences(result);

  if (authorization.invariantAllowed) {
    return {
      status: 'inconclusive',

      observedBehavior:
        'The intended identity mutation did not create an invalid identity-bound authorization state.',

      evidenceSequences,
    };
  }

  if (!authorization.executed && after === before) {
    return {
      status: 'pass',

      observedBehavior: messages.pass,

      evidenceSequences,
    };
  }

  if (authorization.executed && after > before) {
    return {
      status: 'fail',

      observedBehavior: messages.fail,

      evidenceSequences,

      ...(messages.failSeverity === undefined
        ? {}
        : {
            severity: messages.failSeverity,
          }),
    };
  }

  return {
    status: 'inconclusive',

    observedBehavior:
      'Identity-binding and synthetic side-effect evidence could not establish a deterministic PASS or FAIL.',

    evidenceSequences,
  };
}

function createDefinition(input: {
  id: 'HP-ID-001' | 'HP-ID-002';

  name: string;

  defaultSeverity: 'medium' | 'high';

  preconditions: string[];

  mutationSteps: string[];

  invariant: string;

  evidence: string[];

  section: string;
}): AttackDefinition {
  return {
    id: input.id,

    name: input.name,

    category: 'identity',

    defaultSeverity: input.defaultSeverity,

    priority: 'P0',

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

function createUpdateAuthorizedContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('Identity P0 fixture requires authority bindings.');
  }

  context.capabilities = [P0_CAPABILITY_UPDATE];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  return context;
}

class LoseOriginalPrincipalAdapter implements HandoffAdapter {
  readonly id = 'p0-id-001:lose-original-principal';

  translate(context: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(context);

    if (translated.effectiveAuthority === undefined) {
      throw new Error('HP-ID-001 requires effective authority.');
    }

    /*
     * Model a handoff that loses user:alice and
     * rebases the downstream request onto the
     * generic executing agent identity.
     */
    translated.principal = P0_AUTHORIZED_DOWNSTREAM;

    translated.effectiveAuthority.principal = P0_AUTHORIZED_DOWNSTREAM;

    return translated;
  }
}

class SubstituteAgentIdentityAdapter implements HandoffAdapter {
  readonly id = 'p0-id-002:substitute-agent-identity';

  translate(context: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(context);

    /*
     * Delegation remains bound to agent:billing,
     * but the executing downstream identity
     * becomes agent:support.
     */
    translated.downstream = P0_UNAUTHORIZED_DOWNSTREAM;

    return translated;
  }
}

const ID_001_DEFINITION = createDefinition({
  id: 'HP-ID-001',

  name: 'Original principal continuity loss',

  defaultSeverity: 'medium',

  preconditions: [
    'The original A2A principal is user:alice.',
    'A protected invoice.update action depends on principal-bound authority.',
  ],

  mutationSteps: [
    'Drop user:alice during handoff translation.',
    'Replace the downstream principal representation with agent:billing.',
    'Attempt the protected update_invoice action without a new principal-bound grant.',
  ],

  invariant:
    'Protected actions requiring principal-bound policy must remain attributable to the original principal.',

  evidence: [
    'original principal',
    'downstream identity',
    'authorization decision',
    'protected action',
    'synthetic side effect',
  ],

  section: 'hp-id-001--original-principal-continuity-loss',
});

const ID_002_DEFINITION = createDefinition({
  id: 'HP-ID-002',

  name: 'Agent identity substitution',

  defaultSeverity: 'high',

  preconditions: [
    'Delegated invoice.update authority is bound to agent:billing.',
    'The delegation has already been accepted before the identity mutation.',
  ],

  mutationSteps: [
    'Replace the executing downstream identity agent:billing with agent:support.',
    'Retain the original authority binding to agent:billing.',
    'Attempt the protected update_invoice action.',
  ],

  invariant: 'Identity-bound authority must not survive replacement of the authorized agent.',

  evidence: ['expected agent', 'actual agent', 'authority binding', 'tool invocation', 'result'],

  section: 'hp-id-002--agent-identity-substitution',
});

const ID_001_CASE: AttackCase = {
  definition: ID_001_DEFINITION,

  evaluate(result) {
    return evaluateIdentityMutation(result, {
      pass: 'The protected action was rejected after user:alice was lost during handoff translation.',

      fail: 'The protected synthetic update executed after user:alice was replaced by a generic agent identity, proving a principal-bound authorization bypass.',

      failSeverity: 'high',
    });
  },
};

const ID_002_CASE: AttackCase = {
  definition: ID_002_DEFINITION,

  evaluate(result) {
    return evaluateIdentityMutation(result, {
      pass: 'The protected action was rejected after agent:billing was replaced by agent:support.',

      fail: 'agent:support executed the protected synthetic update while relying on authority still bound to agent:billing.',
    });
  },
};

export const HP_ID_001: P0AttackPlan = {
  attack: ID_001_CASE,

  scenario: createP0UpdateInvoiceScenario(24001),

  handoffAdapter: new LoseOriginalPrincipalAdapter(),

  createContext: createUpdateAuthorizedContext,
};

export const HP_ID_002: P0AttackPlan = {
  attack: ID_002_CASE,

  scenario: createP0UpdateInvoiceScenario(24002),

  handoffAdapter: new SubstituteAgentIdentityAdapter(),

  createContext: createUpdateAuthorizedContext,
};

export const P0_IDENTITY_ATTACKS: readonly P0AttackPlan[] = [HP_ID_001, HP_ID_002];

export const P0_IDENTITY_BASELINE = {
  originalPrincipal: P0_PRINCIPAL,

  authorizedAgent: P0_AUTHORIZED_DOWNSTREAM,

  unauthorizedAgent: P0_UNAUTHORIZED_DOWNSTREAM,
} as const;
