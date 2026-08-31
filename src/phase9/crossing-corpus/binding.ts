import {
  evaluateCrossingObservationReadiness,
  toExternalCrossingObservedShape,
  type CrossingObservationState,
  type ExternalCrossingObservedShape,
} from './observation.js';
import {
  evaluateFullCrossingProvenanceReadiness,
  type CrossingFullProvenanceReadiness,
  type CrossingProvenanceState,
} from './provenance.js';
import {
  verifyCrossingAuthority,
  type CrossingDecision,
  type CrossingVerificationInput,
  type SharedCrossingReplayStore,
} from './verifier.js';

export type CrossingVerificationTemplate = Omit<CrossingVerificationInput, 'observed'>;

export interface BoundCrossingVerificationResult {
  decision: CrossingDecision;
  observed: ExternalCrossingObservedShape;
  observationReady: boolean;
  provenanceReadiness: CrossingFullProvenanceReadiness;
}

export function verifyObservedCrossing(
  observation: CrossingObservationState,
  input: CrossingVerificationTemplate,
  replayStore: SharedCrossingReplayStore,
  provenance: CrossingProvenanceState,
): BoundCrossingVerificationResult {
  const observationReadiness = evaluateCrossingObservationReadiness(observation);
  const observed = toExternalCrossingObservedShape(observation);

  const decision = verifyCrossingAuthority(
    {
      ...input,
      observed,
    },
    replayStore,
    provenance,
  );

  return {
    decision,
    observed,
    observationReady: observationReadiness.complete,
    provenanceReadiness: evaluateFullCrossingProvenanceReadiness(observation, provenance),
  };
}
