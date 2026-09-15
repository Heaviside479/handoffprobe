export const T2_CANONICALIZATION_VERSION_RESEARCH_ID = 'T2-CANONICALIZATION-VERSION' as const;

export type T2CanonicalizationVersionOutcome = 'PASS' | 'FAIL' | 'INCONCLUSIVE';

export interface T2InterpretationObservation {
  representation?: string;
  interpretationVersion?: string;
  effectiveMeaning?: string;
  trusted: boolean;
}

export interface T2CanonicalizationVersionInput {
  upstream: T2InterpretationObservation;
  downstream: T2InterpretationObservation;
}

export interface T2CanonicalizationVersionWitness {
  upstreamRepresentation: string;
  upstreamInterpretationVersion: string;
  upstreamEffectiveMeaning: string;
  downstreamRepresentation: string;
  downstreamInterpretationVersion: string;
  downstreamEffectiveMeaning: string;
}

export interface T2CanonicalizationVersionResult {
  researchId: typeof T2_CANONICALIZATION_VERSION_RESEARCH_ID;
  outcome: T2CanonicalizationVersionOutcome;
  representationChanged: boolean | null;
  versionChanged: boolean | null;
  reason: string;
  witness?: T2CanonicalizationVersionWitness;
}

function nonEmpty(value: string | undefined): value is string {
  return value !== undefined && value.trim().length > 0;
}

function compareOptional(left: string | undefined, right: string | undefined): boolean | null {
  if (!nonEmpty(left) || !nonEmpty(right)) {
    return null;
  }

  return left !== right;
}

export function evaluateT2CanonicalizationVersion(
  input: T2CanonicalizationVersionInput,
): T2CanonicalizationVersionResult {
  const upstreamRepresentation = input.upstream.representation;
  const upstreamVersion = input.upstream.interpretationVersion;
  const upstreamMeaning = input.upstream.effectiveMeaning;
  const downstreamRepresentation = input.downstream.representation;
  const downstreamVersion = input.downstream.interpretationVersion;
  const downstreamMeaning = input.downstream.effectiveMeaning;

  const representationChanged = compareOptional(upstreamRepresentation, downstreamRepresentation);
  const versionChanged = compareOptional(upstreamVersion, downstreamVersion);

  const completeTrustedEvidence =
    input.upstream.trusted &&
    input.downstream.trusted &&
    nonEmpty(upstreamRepresentation) &&
    nonEmpty(upstreamVersion) &&
    nonEmpty(upstreamMeaning) &&
    nonEmpty(downstreamRepresentation) &&
    nonEmpty(downstreamVersion) &&
    nonEmpty(downstreamMeaning);

  if (!completeTrustedEvidence) {
    return {
      researchId: T2_CANONICALIZATION_VERSION_RESEARCH_ID,
      outcome: 'INCONCLUSIVE',
      representationChanged,
      versionChanged,
      reason:
        'Trusted representation, interpretation-version, and effective-meaning evidence is required on both sides.',
    };
  }

  if (upstreamMeaning === downstreamMeaning) {
    return {
      researchId: T2_CANONICALIZATION_VERSION_RESEARCH_ID,
      outcome: 'PASS',
      representationChanged,
      versionChanged,
      reason: 'The downstream interpretation preserves the trusted upstream security meaning.',
    };
  }

  return {
    researchId: T2_CANONICALIZATION_VERSION_RESEARCH_ID,
    outcome: 'FAIL',
    representationChanged,
    versionChanged,
    reason:
      'Trusted upstream and downstream interpretation evidence resolves to different security meanings.',
    witness: {
      upstreamRepresentation,
      upstreamInterpretationVersion: upstreamVersion,
      upstreamEffectiveMeaning: upstreamMeaning,
      downstreamRepresentation,
      downstreamInterpretationVersion: downstreamVersion,
      downstreamEffectiveMeaning: downstreamMeaning,
    },
  };
}
