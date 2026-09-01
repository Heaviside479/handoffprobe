export interface CrossingEffectSnapshot {
  readonly count: number;
}

export interface CrossingEffectDelta {
  readonly before: number;
  readonly after: number;
  readonly delta: number;
}

export class CrossingEffectRecorder {
  private countValue = 0;

  get count(): number {
    return this.countValue;
  }

  recordEffect(): void {
    this.countValue += 1;
  }

  snapshot(): CrossingEffectSnapshot {
    return {
      count: this.countValue,
    };
  }

  deltaSince(before: CrossingEffectSnapshot): CrossingEffectDelta {
    const after = this.countValue;

    if (!Number.isSafeInteger(before.count) || before.count < 0 || before.count > after) {
      throw new Error('Invalid crossing effect snapshot.');
    }

    return {
      before: before.count,
      after,
      delta: after - before.count,
    };
  }
}
