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

import type { P1AuthorizationTargetOutput } from '../../p1-fixture/index.js';

import type { P1AttackPlan } from './types.js';

const FULL_DELEGATION_CHAIN = [P0_PRINCIPAL, P0_CALLER, P0_AUTHORIZED_DOWNSTREAM] as const;

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
  id: 'HP-AUTH-004' | 'HP-AUTH-005';

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
    throw new Error('P1 authorization attacks require authority bindings.');
  }

  context.capabilities = [P0_CAPABILITY_UPDATE];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  return context;
}

function relevantEvidenceSequences(result: TargetExecutionResult): number[] {
  const relevant = new Set([
    'p1.authorization',

    'p1.authorization.blocked',

    'p1.authorization.bypassed',

    'handoff.translate',

    'p0.authorization',

    'mcp.tool.call',

    'mcp.tool.result',
  ]);

  return result.evidence
    .filter((event) => relevant.has(event.event))
    .map((event) => event.sequence);
}

function evaluateInvalidAuthority(
  result: TargetExecutionResult,
  messages: {
    pass: string;

    fail: string;
  },
): AttackEvaluation {
  const output = result.output as P1AuthorizationTargetOutput;

  const evidenceSequences = relevantEvidenceSequences(result);

  /*
   * The attack only proves something when
   * the P1 mutation actually made the
   * delegation invalid.
   */
  if (output.decision.allowed) {
    return {
      status: 'inconclusive',

      observedBehavior: 'The intended P1 mutation did not create an invalid delegation state.',

      evidenceSequences,
    };
  }

  if (!output.executed && output.sideEffectCounterAfter === output.sideEffectCounterBefore) {
    return {
      status: 'pass',

      observedBehavior: messages.pass,

      evidenceSequences,
    };
  }

  if (output.executed && output.sideEffectCounterAfter > output.sideEffectCounterBefore) {
    return {
      status: 'fail',

      observedBehavior: messages.fail,

      evidenceSequences,
    };
  }

  return {
    status: 'inconclusive',

    observedBehavior:
      'Delegation evidence and synthetic side-effect evidence could not establish a deterministic PASS or FAIL.',

    evidenceSequences,
  };
}

const AUTH_004_DEFINITION = createDefinition({
  id: 'HP-AUTH-004',

  name: 'Expired delegation reuse',

  preconditions: [
    'A delegation is valid before its deterministic expiry point.',

    'The delegation authorizes invoice.update for invoice:INV-1001.',

    'The protected action crosses the A2A to MCP handoff.',
  ],

  mutationSteps: [
    'Advance deterministic logical time to the delegation expiry boundary.',

    'Reuse the expired translated delegation.',

    'Attempt the protected update_invoice action.',
  ],

  invariant:
    'Authority that expired before downstream authorization must not authorize the protected action.',

  evidence: [
    'delegation ID',

    'issued point',

    'expiry point',

    'authorization point',

    'delegation validity state',

    'authorization result',

    'selected MCP tool',

    'side-effect counter before and after',
  ],

  section: 'hp-auth-004--expired-delegation-reuse',
});

const AUTH_005_DEFINITION = createDefinition({
  id: 'HP-AUTH-005',

  name: 'Delegation-chain truncation',

  preconditions: [
    'Authorization requires the full user:alice to agent:sales to agent:billing delegation chain.',

    'The protected action crosses the A2A to MCP handoff.',
  ],

  mutationSteps: [
    'Remove agent:sales from the translated delegation chain.',

    'Preserve the final principal, delegate, tenant, resource and capability.',

    'Attempt the protected update_invoice action using the shortened chain.',
  ],

  invariant:
    'Removing a security-relevant intermediate delegation hop must not preserve equivalent downstream authority.',

  evidence: [
    'original required delegation chain',

    'translated delegation chain',

    'missing delegation hop',

    'authorization result',

    'selected MCP tool',

    'side-effect counter before and after',
  ],

  section: 'hp-auth-005--delegation-chain-truncation',
});

const AUTH_004_CASE = {
  definition: AUTH_004_DEFINITION,

  evaluate(result: TargetExecutionResult) {
    return evaluateInvalidAuthority(result, {
      pass: 'The expired delegation was rejected before protected MCP execution and no synthetic side effect occurred.',

      fail: 'The expired delegation crossed the handoff and executed a protected synthetic invoice mutation.',
    });
  },
};

const AUTH_005_CASE = {
  definition: AUTH_005_DEFINITION,

  evaluate(result: TargetExecutionResult) {
    return evaluateInvalidAuthority(result, {
      pass: 'The truncated delegation chain was rejected before protected MCP execution and no synthetic side effect occurred.',

      fail: 'The truncated delegation chain was treated as equivalent and executed a protected synthetic invoice mutation.',
    });
  },
};

export const HP_AUTH_004: P1AttackPlan = {
  attack: AUTH_004_CASE,

  scenario: {
    id: 'expired-delegation-reuse',

    delegation: {
      id: 'delegation:DEL-1001',

      principal: P0_PRINCIPAL,

      delegate: P0_AUTHORIZED_DOWNSTREAM,

      tenant: P0_AUTHORIZED_TENANT,

      resources: [P0_AUTHORIZED_RESOURCE],

      capabilities: [P0_CAPABILITY_UPDATE],

      chain: [...FULL_DELEGATION_CHAIN],

      taskId: 'task:P1-TASK-A',

      runId: 'run:P1-RUN-A',

      issuedAt: 10,

      expiresAt: 20,

      singleUse: false,
    },

    request: {
      principal: P0_PRINCIPAL,

      delegate: P0_AUTHORIZED_DOWNSTREAM,

      tenant: P0_AUTHORIZED_TENANT,

      resource: P0_AUTHORIZED_RESOURCE,

      capability: P0_CAPABILITY_UPDATE,

      taskId: 'task:P1-TASK-A',

      runId: 'run:P1-RUN-A',

      requiredChain: FULL_DELEGATION_CHAIN,
    },

    /*
     * Exactly the expiry boundary.
     * No sleeping or wall clock.
     */
    logicalTime: 20,

    p0Scenario: createP0UpdateInvoiceScenario(24004),
  },

  createContext: createUpdateContext,
};

export const HP_AUTH_005: P1AttackPlan = {
  attack: AUTH_005_CASE,

  scenario: {
    id: 'delegation-chain-truncation',

    delegation: {
      id: 'delegation:DEL-1002',

      principal: P0_PRINCIPAL,

      delegate: P0_AUTHORIZED_DOWNSTREAM,

      tenant: P0_AUTHORIZED_TENANT,

      resources: [P0_AUTHORIZED_RESOURCE],

      capabilities: [P0_CAPABILITY_UPDATE],

      /*
       * Mutation:
       * agent:sales was removed.
       */
      chain: [P0_PRINCIPAL, P0_AUTHORIZED_DOWNSTREAM],

      taskId: 'task:P1-TASK-A',

      runId: 'run:P1-RUN-A',

      issuedAt: 10,

      expiresAt: 30,

      singleUse: false,
    },

    request: {
      principal: P0_PRINCIPAL,

      delegate: P0_AUTHORIZED_DOWNSTREAM,

      tenant: P0_AUTHORIZED_TENANT,

      resource: P0_AUTHORIZED_RESOURCE,

      capability: P0_CAPABILITY_UPDATE,

      taskId: 'task:P1-TASK-A',

      runId: 'run:P1-RUN-A',

      requiredChain: FULL_DELEGATION_CHAIN,
    },

    logicalTime: 15,

    p0Scenario: createP0UpdateInvoiceScenario(24005),
  },

  createContext: createUpdateContext,
};

export const P1_AUTHORIZATION_ATTACKS: readonly P1AttackPlan[] = [HP_AUTH_004, HP_AUTH_005];
