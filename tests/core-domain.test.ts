import { describe, expect, it } from 'vitest';

import {
  AttackRegistry,
  HandoffProbeCoreError,
  REDACTED_VALUE,
  cloneSecurityContext,
  isSecurityFailure,
  redactRecord,
} from '../src/core/index.js';
import type { AttackDefinition, AttackId, Finding, SecurityContext } from '../src/core/index.js';
import { EvidenceRecorder } from '../src/protocol-lab/evidence.js';

const CONTEXT: SecurityContext = {
  principal: 'user:alice',
  caller: 'agent:sales',
  downstream: 'agent:billing',
  tenant: 'tenant:acme',
  resource: 'invoice:INV-1001',
  capabilities: ['invoice.read'],
};

function definition(id: AttackId): AttackDefinition {
  return {
    id,
    name: `Test attack ${id}`,
    category: 'identity',
    defaultSeverity: 'medium',
    priority: 'P0',
    preconditions: ['local fixture'],
    mutationSteps: ['mutate handoff context'],
    expectedInvariant: 'Security context remains bound.',
    evidenceRequirements: ['upstream context', 'downstream context'],
    applicability: {
      a2a: ['1.0'],
      mcp: ['2026-07-28'],
    },
    propertyClass: 'composition_responsibility',
    sourceReferences: [],
    sideEffectClass: 'synthetic',
    destructive: false,
  };
}

function finding(status: Finding['status']): Finding {
  return {
    testId: 'HP-ID-001',
    runId: 'run-001',
    correlationId: 'run-001',
    title: 'Original principal continuity loss',
    severity: 'medium',
    status,
    propertyClass: 'composition_responsibility',
    applicability: {
      a2a: ['1.0'],
      mcp: ['2026-07-28'],
    },
    expectedInvariant: 'Principal continuity is preserved.',
    observedBehavior: 'Synthetic test observation.',
    evidenceSequences: [1, 2],
    sources: [],
  };
}

describe('core security domain', () => {
  it('clones security context without sharing capabilities', () => {
    const clone = cloneSecurityContext(CONTEXT);

    clone.capabilities.push('invoice.update');

    expect(CONTEXT.capabilities).toEqual(['invoice.read']);
  });

  it('keeps attack registration deterministic and rejects duplicates', () => {
    const registry = new AttackRegistry();

    registry.register(definition('HP-ZZZ-001'));

    registry.register(definition('HP-AAA-001'));

    expect(registry.list().map((attack) => attack.id)).toEqual(['HP-AAA-001', 'HP-ZZZ-001']);

    expect(() => registry.register(definition('HP-AAA-001'))).toThrowError(HandoffProbeCoreError);
  });

  it('never treats runner error status as a security failure', () => {
    expect(isSecurityFailure(finding('error'))).toBe(false);

    expect(isSecurityFailure(finding('fail'))).toBe(true);
  });

  it('redacts nested secrets while preserving fingerprints', () => {
    expect(
      redactRecord({
        authorization: 'Bearer secret-value',
        nested: {
          accessToken: 'token-value',
          password: 'password-value',
          credentialFingerprint: 'sha256:abc123',
        },
        safe: 'visible',
      }),
    ).toEqual({
      authorization: REDACTED_VALUE,
      nested: {
        accessToken: REDACTED_VALUE,
        password: REDACTED_VALUE,
        credentialFingerprint: 'sha256:abc123',
      },
      safe: 'visible',
    });
  });

  it('adds correlation metadata and redaction to protocol evidence', () => {
    const recorder = new EvidenceRecorder('hp-core-test-001', 'secure');

    recorder.record({
      protocol: 'MCP',
      protocolVersion: '2026-07-28',
      boundary: 'test -> fixture',
      event: 'test.secret.redaction',
      context: CONTEXT,
      details: {
        apiKey: 'raw-api-key',
        credentialFingerprint: 'sha256:def456',
      },
    });

    const event = recorder.events[0];

    expect(event).toBeDefined();

    expect(event?.correlationId).toBe('hp-core-test-001');

    expect(event?.details).toEqual({
      apiKey: REDACTED_VALUE,
      credentialFingerprint: 'sha256:def456',
    });

    expect(event?.provenance).toEqual([]);
  });
});
