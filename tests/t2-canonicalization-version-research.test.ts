import { describe, expect, it } from 'vitest';

import {
  T2_CANONICALIZATION_VERSION_RESEARCH_ID,
  evaluateT2CanonicalizationVersion,
  type T2CanonicalizationVersionInput,
} from '../src/research/t2-handoff-contract/canonicalization-version.js';

const EQUIVALENT_TRANSFORMATION: T2CanonicalizationVersionInput = {
  upstream: {
    representation: 'Invoice.Read',
    interpretationVersion: 'mapping-v1',
    effectiveMeaning: 'invoice.read@invoice:INV-1001',
    trusted: true,
  },
  downstream: {
    representation: 'read_invoice',
    interpretationVersion: 'mapping-v1',
    effectiveMeaning: 'invoice.read@invoice:INV-1001',
    trusted: true,
  },
};

const DIVERGENT_VERSION_INTERPRETATION: T2CanonicalizationVersionInput = {
  upstream: {
    representation: 'Invoice.Read',
    interpretationVersion: 'mapping-v1',
    effectiveMeaning: 'invoice.read@invoice:INV-1001',
    trusted: true,
  },
  downstream: {
    representation: 'read_invoice',
    interpretationVersion: 'mapping-v0',
    effectiveMeaning: 'invoice.update@invoice:INV-1001',
    trusted: true,
  },
};

describe('T-2.4 canonicalization/version research case', () => {
  it('keeps the research label separate from stable HP attack IDs', () => {
    expect(T2_CANONICALIZATION_VERSION_RESEARCH_ID).toBe('T2-CANONICALIZATION-VERSION');
    expect(T2_CANONICALIZATION_VERSION_RESEARCH_ID.startsWith('HP-')).toBe(false);
  });

  it('passes when representation changes but trusted security meaning stays equivalent', () => {
    expect(evaluateT2CanonicalizationVersion(EQUIVALENT_TRANSFORMATION)).toEqual({
      researchId: 'T2-CANONICALIZATION-VERSION',
      outcome: 'PASS',
      representationChanged: true,
      versionChanged: false,
      reason: 'The downstream interpretation preserves the trusted upstream security meaning.',
    });
  });

  it('fails with a concrete witness when interpretation-version drift changes security meaning', () => {
    expect(evaluateT2CanonicalizationVersion(DIVERGENT_VERSION_INTERPRETATION)).toEqual({
      researchId: 'T2-CANONICALIZATION-VERSION',
      outcome: 'FAIL',
      representationChanged: true,
      versionChanged: true,
      reason:
        'Trusted upstream and downstream interpretation evidence resolves to different security meanings.',
      witness: {
        upstreamRepresentation: 'Invoice.Read',
        upstreamInterpretationVersion: 'mapping-v1',
        upstreamEffectiveMeaning: 'invoice.read@invoice:INV-1001',
        downstreamRepresentation: 'read_invoice',
        downstreamInterpretationVersion: 'mapping-v0',
        downstreamEffectiveMeaning: 'invoice.update@invoice:INV-1001',
      },
    });
  });

  it('stays inconclusive when trusted downstream interpretation evidence is missing', () => {
    const result = evaluateT2CanonicalizationVersion({
      upstream: EQUIVALENT_TRANSFORMATION.upstream,
      downstream: {
        representation: 'read_invoice',
        interpretationVersion: 'mapping-v1',
        trusted: false,
      },
    });

    expect(result).toEqual({
      researchId: 'T2-CANONICALIZATION-VERSION',
      outcome: 'INCONCLUSIVE',
      representationChanged: true,
      versionChanged: false,
      reason:
        'Trusted representation, interpretation-version, and effective-meaning evidence is required on both sides.',
    });
  });

  it('is deterministic across repeated evaluation', () => {
    const first = evaluateT2CanonicalizationVersion(DIVERGENT_VERSION_INTERPRETATION);
    const second = evaluateT2CanonicalizationVersion(
      structuredClone(DIVERGENT_VERSION_INTERPRETATION),
    );

    expect(second).toEqual(first);
  });
});
