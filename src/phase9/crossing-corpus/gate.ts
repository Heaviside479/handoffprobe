import type { BoundCrossingVerificationResult } from './binding.js';
import type { CrossingObservationState } from './observation.js';

export type CrossingPreDispatchGate = (
  observation: CrossingObservationState,
) => BoundCrossingVerificationResult;

export class CrossingPreDispatchRejectedError extends Error {
  constructor(readonly verification: BoundCrossingVerificationResult) {
    super(`Crossing pre-dispatch gate rejected: ${verification.decision.reason}`);
    this.name = 'CrossingPreDispatchRejectedError';
  }
}
