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
  P0_AUTHORIZED_RESOURCE,
  P0_CAPABILITY_UPDATE,
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

function evaluateProtectedMutation(
  result: TargetExecutionResult,
  messages: {
    pass: string;
    fail: string;
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
      observedBehavior: 'The intended mutation did not produce an invalid authorization state.',
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
    };
  }

  return {
    status: 'inconclusive',
    observedBehavior:
      'Authorization and synthetic side-effect evidence could not establish a deterministic PASS or FAIL.',
    evidenceSequences,
  };
}

function createDefinition(input: {
  id: 'HP-AUTH-001' | 'HP-AUTH-002' | 'HP-AUTH-003';

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

    category: 'authorization',

    defaultSeverity: 'high',

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

class AmplifyAuthorityAdapter implements HandoffAdapter {
  readonly id = 'p0-auth-001:amplify-authority';

  translate(context: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(context);

    if (translated.effectiveAuthority === undefined) {
      throw new Error('HP-AUTH-001 requires effective authority.');
    }

    translated.capabilities = [P0_CAPABILITY_UPDATE];

    translated.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

    return translated;
  }
}

class MissingAuthorityFailsOpenAdapter implements HandoffAdapter {
  readonly id = 'p0-auth-002:missing-authority-fallback';

  translate(context: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(context);

    delete translated.upstreamAuthority;

    translated.capabilities = [P0_CAPABILITY_UPDATE];

    translated.effectiveAuthority = {
      principal: translated.principal,

      delegate: translated.downstream,

      tenant: translated.tenant,

      resources: [P0_AUTHORIZED_RESOURCE],

      capabilities: [P0_CAPABILITY_UPDATE],
    };

    return translated;
  }
}

class CrossAgentReuseAdapter implements HandoffAdapter {
  readonly id = 'p0-auth-003:cross-agent-reuse';

  translate(context: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(context);

    translated.downstream = P0_UNAUTHORIZED_DOWNSTREAM;

    return translated;
  }
}

function createUpdateAuthorizedContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('HP-AUTH-003 requires authority bindings.');
  }

  context.capabilities = [P0_CAPABILITY_UPDATE];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  return context;
}

const AUTH_001_DEFINITION = createDefinition({
  id: 'HP-AUTH-001',

  name: 'Delegated authority amplification',

  preconditions: [
    'Upstream A2A authority grants invoice.read for invoice:INV-1001.',
    'The handoff reaches the protected update_invoice MCP tool.',
  ],

  mutationSteps: [
    'Broaden translated effective authority from invoice.read to invoice.update.',
    'Attempt update_invoice without a new valid upstream grant.',
  ],

  invariant: 'Downstream effective authority must not exceed upstream delegated authority.',

  evidence: [
    'upstream authority',
    'translated authority',
    'selected MCP tool',
    'authorization result',
    'resource state before',
    'resource state after',
  ],

  section: 'hp-auth-001--delegated-authority-amplification',
});

const AUTH_002_DEFINITION = createDefinition({
  id: 'HP-AUTH-002',

  name: 'Missing authority fails open',

  preconditions: [
    'The upstream request begins with narrow delegated authority.',
    'A protected downstream update is available only through the synthetic MCP fixture.',
  ],

  mutationSteps: [
    'Remove upstream authority metadata during handoff translation.',
    'Substitute invoice.update as downstream fallback authority.',
    'Attempt update_invoice using the fallback authority.',
  ],

  invariant: 'Missing authority must not become broader authority.',

  evidence: [
    'absence of upstream authority',
    'fallback behavior',
    'translated authority',
    'selected MCP tool',
    'authorization result',
    'synthetic side effect',
  ],

  section: 'hp-auth-002--missing-authority-fails-open',
});

const AUTH_003_DEFINITION = createDefinition({
  id: 'HP-AUTH-003',

  name: 'Cross-agent authorization reuse',

  preconditions: [
    'invoice.update authority is bound to agent:billing.',
    'agent:support is not the authorized downstream delegate.',
  ],

  mutationSteps: [
    'Replace the actual downstream agent with agent:support.',
    'Reuse authority still bound to agent:billing.',
    'Attempt the protected update_invoice action.',
  ],

  invariant: 'Authority delegated to one agent must not automatically authorize another agent.',

  evidence: [
    'authorized delegate',
    'actual delegate',
    'authorization binding',
    'selected action',
    'synthetic side effect',
  ],

  section: 'hp-auth-003--cross-agent-authorization-reuse',
});

const AUTH_001_CASE: AttackCase = {
  definition: AUTH_001_DEFINITION,

  evaluate(result) {
    return evaluateProtectedMutation(result, {
      pass: 'Amplified invoice.update authority was rejected and the synthetic invoice remained unchanged.',

      fail: 'Amplified invoice.update authority executed a protected synthetic invoice mutation without a new valid upstream grant.',
    });
  },
};

const AUTH_002_CASE: AttackCase = {
  definition: AUTH_002_DEFINITION,

  evaluate(result) {
    return evaluateProtectedMutation(result, {
      pass: 'Missing upstream authority failed closed; broader fallback authority could not execute the protected update.',

      fail: 'Missing upstream authority failed open and substituted broader invoice.update authority executed a protected synthetic mutation.',
    });
  },
};

const AUTH_003_CASE: AttackCase = {
  definition: AUTH_003_DEFINITION,

  evaluate(result) {
    return evaluateProtectedMutation(result, {
      pass: 'Authority bound to agent:billing was rejected after the downstream identity changed to agent:support.',

      fail: 'agent:support executed the protected synthetic update using authority still bound to agent:billing.',
    });
  },
};

export const HP_AUTH_001: P0AttackPlan = {
  attack: AUTH_001_CASE,

  scenario: createP0UpdateInvoiceScenario(23001),

  handoffAdapter: new AmplifyAuthorityAdapter(),

  createContext: createP0ReferenceContext,
};

export const HP_AUTH_002: P0AttackPlan = {
  attack: AUTH_002_CASE,

  scenario: createP0UpdateInvoiceScenario(23002),

  handoffAdapter: new MissingAuthorityFailsOpenAdapter(),

  createContext: createP0ReferenceContext,
};

export const HP_AUTH_003: P0AttackPlan = {
  attack: AUTH_003_CASE,

  scenario: createP0UpdateInvoiceScenario(23003),

  handoffAdapter: new CrossAgentReuseAdapter(),

  createContext: createUpdateAuthorizedContext,
};

export const P0_AUTHORIZATION_ATTACKS: readonly P0AttackPlan[] = [
  HP_AUTH_001,
  HP_AUTH_002,
  HP_AUTH_003,
];
