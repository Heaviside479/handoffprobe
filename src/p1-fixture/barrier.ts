interface BarrierWaiter {
  resolve(releaseIndex: number): void;
}

export class P1DeterministicBarrier {
  private readonly expected: Set<string>;

  private readonly arrivals = new Set<string>();

  private readonly waiters = new Map<string, BarrierWaiter>();

  constructor(private readonly releaseOrder: readonly string[]) {
    if (releaseOrder.length < 2) {
      throw new Error('P1 barrier requires at least two participants.');
    }

    this.expected = new Set(releaseOrder);

    if (this.expected.size !== releaseOrder.length) {
      throw new Error('P1 barrier participants must be unique.');
    }
  }

  arrive(participantId: string): Promise<number> {
    if (!this.expected.has(participantId)) {
      return Promise.reject(new Error(`Unexpected P1 barrier participant: ${participantId}`));
    }

    if (this.arrivals.has(participantId)) {
      return Promise.reject(new Error(`P1 barrier participant arrived twice: ${participantId}`));
    }

    const promise = new Promise<number>((resolve) => {
      this.waiters.set(participantId, {
        resolve,
      });
    });

    this.arrivals.add(participantId);

    if (this.arrivals.size === this.releaseOrder.length) {
      this.releaseOrder.forEach((id, index) => {
        const waiter = this.waiters.get(id);

        if (waiter === undefined) {
          throw new Error(`Missing P1 barrier waiter: ${id}`);
        }

        waiter.resolve(index);
      });
    }

    return promise;
  }

  arrivedCount(): number {
    return this.arrivals.size;
  }
}
