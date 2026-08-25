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
  P0_ALTERNATE_MCP_AUDIENCE,
  P0_CREDENTIAL_FINGERPRINT,
  P0_MCP_AUDIENCE,
  createP0ReferenceContext,
} from '../../p0-fixture/index.js';

import type { P0Scenario, P0TargetOutput } from '../../p0-fixture/index.js';

import type { P0AttackPlan } from './types.js';

class ForwardCredentialAdapter implements HandoffAdapter {
  readonly id = 'p0-credential:forward-upstream';

  translate(context: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(context);

    const credential = translated.upstreamCredential;

    if (credential === undefined) {
      throw new Error('Credential P0 requires upstream credential metadata.');
    }

    translated.forwardedCredential = {
      ...credential,
    };

    return translated;
  }
}

function credentialOnlyContext(): SecurityContext {
  const context = createP0ReferenceContext();

  delete context.upstreamAuthority;

  delete context.effectiveAuthority;

  context.capabilities = [];

  return context;
}

function forwardingEvent(result: TargetExecutionResult) {
  return result.evidence.find((event) => event.event === 'p0.credential.forwarding');
}

const CRED_001_DEFINITION: AttackDefinition = {
  id: 'HP-CRED-001',

  name: 'Broad upstream credential propagation',

  category: 'credential',

  defaultSeverity: 'medium',

  priority: 'P0',

  preconditions: [
    'The upstream request contains sanitized broad bearer credential metadata.',
    'The handoff contract expects delegated authority instead of bearer propagation.',
  ],

  mutationSteps: [
    'Attempt to forward the upstream bearer credential across the handoff.',
    'Observe whether it becomes visible on the MCP side.',
  ],

  expectedInvariant:
    'A broad upstream credential must not cross into MCP when fixture policy expects narrow delegated authority instead.',

  evidenceRequirements: [
    'credential fingerprint',
    'credential class',
    'original audience',
    'downstream audience',
    'forwarding decision',
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

      locator: 'docs/P0_TEST_SPECIFICATION.md#hp-cred-001--broad-upstream-credential-propagation',
    },
  ],

  sideEffectClass: 'none',

  destructive: false,
};

const CRED_002_DEFINITION: AttackDefinition = {
  id: 'HP-CRED-002',

  name: 'Cross-audience credential acceptance',

  category: 'credential',

  defaultSeverity: 'high',

  priority: 'P0',

  preconditions: [
    'Credential audience is mcp://billing.',
    'Synthetic alternate audience mcp://support is available.',
  ],

  mutationSteps: [
    'Forward the billing bearer credential toward mcp://support.',
    'Remove independent delegated authority.',
    'Attempt the synthetic MCP request.',
  ],

  expectedInvariant: 'A credential intended for one audience must not authorize another.',

  evidenceRequirements: [
    'credential fingerprint',
    'expected audience',
    'actual audience',
    'target resource',
    'authorization result',
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

      locator: 'docs/P0_TEST_SPECIFICATION.md#hp-cred-002--cross-audience-credential-acceptance',
    },
  ],

  sideEffectClass: 'none',

  destructive: false,
};

const CRED_001_CASE: AttackCase = {
  definition: CRED_001_DEFINITION,

  evaluate(result): AttackEvaluation {
    const event = forwardingEvent(result);

    const decision = event?.details.forwardingDecision;

    const evidenceSequences = event === undefined ? [] : [event.sequence];

    if (decision === 'blocked') {
      return {
        status: 'pass',

        observedBehavior: 'The broad bearer credential was blocked before MCP.',

        evidenceSequences,
      };
    }

    if (decision === 'forwarded') {
      return {
        status: 'fail',

        observedBehavior: 'The broad bearer credential crossed into MCP contrary to policy.',

        evidenceSequences,
      };
    }

    return {
      status: 'inconclusive',

      observedBehavior: 'Credential forwarding evidence was unavailable.',

      evidenceSequences,
    };
  },
};

const CRED_002_CASE: AttackCase = {
  definition: CRED_002_DEFINITION,

  evaluate(result): AttackEvaluation {
    const event = forwardingEvent(result);

    const output = result.output as P0TargetOutput;

    const auth = output.mcpResult.envelope.authorization;

    const mismatch = event?.details.audienceMatches === false;

    const forwarding = event?.details.forwardingDecision;

    const evidenceSequences = result.evidence
      .filter((candidate) =>
        ['p0.credential.forwarding', 'p0.authorization', 'p0.tool.result'].includes(
          candidate.event,
        ),
      )
      .map((candidate) => candidate.sequence);

    if (!mismatch) {
      return {
        status: 'inconclusive',

        observedBehavior: 'Cross-audience mismatch was not established.',

        evidenceSequences,
      };
    }

    if (forwarding === 'blocked') {
      return {
        status: 'pass',

        observedBehavior: 'The billing credential was blocked before the support audience.',

        evidenceSequences,
      };
    }

    if (forwarding === 'forwarded' && auth.credentialAccepted && auth.executed) {
      return {
        status: 'fail',

        observedBehavior:
          'The support audience accepted the billing credential and executed the request.',

        evidenceSequences,
      };
    }

    return {
      status: 'inconclusive',

      observedBehavior: 'Credential acceptance evidence could not establish PASS or FAIL.',

      evidenceSequences,
    };
  },
};

const CRED_001_SCENARIO: P0Scenario = {
  id: 'credential-forward-billing',

  tool: 'read_invoice',

  mcpAudience: P0_MCP_AUDIENCE,

  buildArguments(context) {
    return {
      resource: context.resource,
    };
  },
};

const CRED_002_SCENARIO: P0Scenario = {
  id: 'credential-cross-audience-support',

  tool: 'read_invoice',

  mcpAudience: P0_ALTERNATE_MCP_AUDIENCE,

  buildArguments(context) {
    return {
      resource: context.resource,
    };
  },
};

export const HP_CRED_001: P0AttackPlan = {
  attack: CRED_001_CASE,

  scenario: CRED_001_SCENARIO,

  handoffAdapter: new ForwardCredentialAdapter(),

  createContext: createP0ReferenceContext,
};

export const HP_CRED_002: P0AttackPlan = {
  attack: CRED_002_CASE,

  scenario: CRED_002_SCENARIO,

  handoffAdapter: new ForwardCredentialAdapter(),

  createContext: credentialOnlyContext,
};

export const P0_CREDENTIAL_ATTACKS: readonly P0AttackPlan[] = [HP_CRED_001, HP_CRED_002];

export const P0_CREDENTIAL_BASELINE = {
  fingerprint: P0_CREDENTIAL_FINGERPRINT,

  expectedAudience: P0_MCP_AUDIENCE,

  alternateAudience: P0_ALTERNATE_MCP_AUDIENCE,
} as const;
