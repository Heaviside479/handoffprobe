import {
  verifyCrossingAuthorityIssuerAuthentication,
  type CrossingIssuerAuthentication,
  type CrossingTrustedIssuer,
} from './issuer-authentication.js';
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

export type CrossingVerificationTemplate = Omit<
  CrossingVerificationInput,
  'observed' | 'issuerAuthentication'
>;

export interface CrossingIssuerVerificationContext {
  readonly initial?: CrossingIssuerAuthentication;
  readonly resolved: CrossingIssuerAuthentication;
  readonly trustedIssuer: CrossingTrustedIssuer;
}

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
  issuerVerification: CrossingIssuerVerificationContext,
): BoundCrossingVerificationResult {
  const observationReadiness = evaluateCrossingObservationReadiness(observation);
  const observed = toExternalCrossingObservedShape(observation);

  const resolvedIssuerAuthenticated = verifyCrossingAuthorityIssuerAuthentication(
    input.authority,
    issuerVerification.resolved,
    issuerVerification.trustedIssuer,
  );

  const initialIssuerAuthenticated =
    input.initialAuthority !== undefined && issuerVerification.initial !== undefined
      ? verifyCrossingAuthorityIssuerAuthentication(
          input.initialAuthority,
          issuerVerification.initial,
          issuerVerification.trustedIssuer,
        )
      : undefined;

  const issuerAuthentication =
    initialIssuerAuthenticated === undefined
      ? {
          resolved: resolvedIssuerAuthenticated,
        }
      : {
          initial: initialIssuerAuthenticated,
          resolved: resolvedIssuerAuthenticated,
        };

  const decision = verifyCrossingAuthority(
    {
      ...input,
      observed,
      issuerAuthentication,
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
