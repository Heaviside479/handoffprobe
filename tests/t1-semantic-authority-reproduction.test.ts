import { describe, expect, it } from 'vitest';

import {
  evaluateSemanticAuthority,
  type ProtectedOperation,
  type SemanticAuthorityInput,
} from './research/semantic-authority-model.js';

const OPERATION_UNIVERSE: readonly ProtectedOperation[] = [
  {
    id: 'invoice-read',
    capability: 'invoice.read',
    resource: 'invoice:INV-1001',
    effect: 'read_invoice',
  },
  {
    id: 'invoice-update-memo',
    capability: 'invoice.update',
    resource: 'invoice:INV-1001',
    effect: 'set_memo',
  },
  {
    id: 'invoice-update-due-date',
    capability: 'invoice.update',
    resource: 'invoice:INV-1001',
    effect: 'change_due_date',
  },
];

function scenario(overrides: Partial<SemanticAuthorityInput> = {}): SemanticAuthorityInput {
  return {
    universe: OPERATION_UNIVERSE,
    upstreamAllowed: ['invoice-update-memo'],
    translatedAllowed: ['invoice-update-memo'],
    representationLost: false,
    bindingValid: true,
    explicitEscalation: false,
    ...overrides,
  };
}

describe('T1.4 semantic authority widening reproduction', () => {
  it.each([
    ['direct preservation', scenario(), 'pass', 'preserved_or_narrowed', []],
    [
      'representation loss with equivalent trusted downstream enforcement',
      scenario({
        representationLost: true,
        translatedAllowed: ['invoice-update-memo', 'invoice-update-due-date'],
        trustedDownstreamAllowed: ['invoice-update-memo'],
      }),
      'pass',
      'preserved_or_narrowed',
      [],
    ],
    [
      'representation loss without equivalent enforcement',
      scenario({
        representationLost: true,
        translatedAllowed: ['invoice-update-memo', 'invoice-update-due-date'],
      }),
      'fail',
      'semantic_authority_widening',
      ['invoice-update-due-date'],
    ],
    [
      'stricter downstream authority',
      scenario({
        upstreamAllowed: ['invoice-update-memo', 'invoice-update-due-date'],
        translatedAllowed: ['invoice-update-memo'],
      }),
      'pass',
      'preserved_or_narrowed',
      [],
    ],
    [
      'identity or binding invalid',
      scenario({
        bindingValid: false,
      }),
      'fail',
      'binding_failure',
      [],
    ],
    [
      'explicit structured escalation',
      scenario({
        upstreamAllowed: ['invoice-read'],
        translatedAllowed: ['invoice-update-memo'],
        explicitEscalation: true,
      }),
      'fail',
      'explicit_authority_escalation',
      [],
    ],
  ] as const)(
    '%s is deterministic and separately classified',
    (_name, input, status, classification, witnesses) => {
      const first = evaluateSemanticAuthority(input);
      const second = evaluateSemanticAuthority(input);

      expect(first).toEqual(second);
      expect(first.status).toBe(status);
      expect(first.classification).toBe(classification);
      expect(first.wideningWitnesses).toEqual(witnesses);
    },
  );

  it('does not treat representation loss alone as a security failure', () => {
    const result = evaluateSemanticAuthority(
      scenario({
        representationLost: true,
        translatedAllowed: ['invoice-update-memo', 'invoice-update-due-date'],
        trustedDownstreamAllowed: ['invoice-update-memo'],
      }),
    );

    expect(result.representationLost).toBe(true);
    expect(result.status).toBe('pass');
    expect(result.effectiveDownstreamAllowed).toEqual(['invoice-update-memo']);
  });

  it('reports a concrete newly permitted operation as the widening witness', () => {
    const result = evaluateSemanticAuthority(
      scenario({
        representationLost: true,
        translatedAllowed: ['invoice-update-memo', 'invoice-update-due-date'],
      }),
    );

    expect(result.status).toBe('fail');
    expect(result.classification).toBe('semantic_authority_widening');
    expect(result.wideningWitnesses).toEqual(['invoice-update-due-date']);
  });

  it('keeps model/runtime errors separate from security FAIL', () => {
    const result = evaluateSemanticAuthority(
      scenario({
        translatedAllowed: ['operation-not-in-universe'],
      }),
    );

    expect(result.status).toBe('error');
    expect(result.classification).toBe('error');
    expect(result.wideningWitnesses).toEqual([]);
  });
});
