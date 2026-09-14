import { describe, expect, it } from 'vitest';

import {
  evaluateP0SemanticAuthority,
  type P0ProtectedOperation,
  type P0SemanticAuthorityInput,
} from '../src/p0-fixture/index.js';

const OPERATIONS: readonly P0ProtectedOperation[] = [
  {
    id: 'invoice:INV-1001:update:memo',
    capability: 'invoice.update',
    resource: 'invoice:INV-1001',
    effect: 'set_memo',
  },
  {
    id: 'invoice:INV-1001:update:due-date',
    capability: 'invoice.update',
    resource: 'invoice:INV-1001',
    effect: 'change_due_date',
  },
  {
    id: 'invoice:INV-1001:read',
    capability: 'invoice.read',
    resource: 'invoice:INV-1001',
    effect: 'read_invoice',
  },
];

function input(overrides: Partial<P0SemanticAuthorityInput> = {}): P0SemanticAuthorityInput {
  return {
    universe: OPERATIONS,
    upstreamAllowed: ['invoice:INV-1001:update:memo'],
    translatedAllowed: ['invoice:INV-1001:update:memo'],
    ...overrides,
  };
}

describe('P0 semantic authority evaluator', () => {
  it('passes direct semantic preservation', () => {
    const decision = evaluateP0SemanticAuthority(input());

    expect(decision.status).toBe('pass');
    expect(decision.effectiveDownstreamAllowed).toEqual(['invoice:INV-1001:update:memo']);
    expect(decision.wideningWitnesses).toEqual([]);
  });

  it('passes lossy translation when trusted downstream enforcement preserves authority', () => {
    const decision = evaluateP0SemanticAuthority(
      input({
        translatedAllowed: ['invoice:INV-1001:update:memo', 'invoice:INV-1001:update:due-date'],
        trustedDownstreamAllowed: ['invoice:INV-1001:update:memo'],
      }),
    );

    expect(decision.status).toBe('pass');
    expect(decision.translatedAllowed).toEqual([
      'invoice:INV-1001:update:due-date',
      'invoice:INV-1001:update:memo',
    ]);
    expect(decision.effectiveDownstreamAllowed).toEqual(['invoice:INV-1001:update:memo']);
    expect(decision.wideningWitnesses).toEqual([]);
  });

  it('fails lossy translation when effective downstream authority widens', () => {
    const decision = evaluateP0SemanticAuthority(
      input({
        translatedAllowed: ['invoice:INV-1001:update:memo', 'invoice:INV-1001:update:due-date'],
      }),
    );

    expect(decision.status).toBe('fail');
    expect(decision.wideningWitnesses).toEqual(['invoice:INV-1001:update:due-date']);
  });

  it('passes stricter downstream authority', () => {
    const decision = evaluateP0SemanticAuthority(
      input({
        upstreamAllowed: ['invoice:INV-1001:update:memo', 'invoice:INV-1001:update:due-date'],
        translatedAllowed: ['invoice:INV-1001:update:memo'],
      }),
    );

    expect(decision.status).toBe('pass');
    expect(decision.wideningWitnesses).toEqual([]);
  });

  it('normalizes duplicate and reordered operation IDs deterministically', () => {
    const first = evaluateP0SemanticAuthority(
      input({
        upstreamAllowed: ['invoice:INV-1001:update:memo', 'invoice:INV-1001:update:memo'],
      }),
    );
    const second = evaluateP0SemanticAuthority(input());

    expect(first).toEqual(second);
  });

  it('returns ERROR for unknown operations instead of a security FAIL', () => {
    const decision = evaluateP0SemanticAuthority(
      input({
        translatedAllowed: ['operation:not-in-universe'],
      }),
    );

    expect(decision.status).toBe('error');
    expect(decision.wideningWitnesses).toEqual([]);
    expect(decision.reason).toContain('unknown operation');
  });

  it('returns ERROR for duplicate operation-universe IDs', () => {
    const duplicate: P0ProtectedOperation = {
      ...OPERATIONS[0]!,
    };

    const decision = evaluateP0SemanticAuthority(
      input({
        universe: [...OPERATIONS, duplicate],
      }),
    );

    expect(decision.status).toBe('error');
    expect(decision.wideningWitnesses).toEqual([]);
  });
});
