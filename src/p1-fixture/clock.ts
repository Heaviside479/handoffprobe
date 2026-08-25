export interface P1LogicalClock {
  now(): number;

  advanceBy(delta: number): number;

  advanceTo(next: number): number;
}

function assertLogicalTick(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative safe integer.`);
  }
}

export function createP1LogicalClock(start = 0): P1LogicalClock {
  assertLogicalTick(start, 'Logical clock start');

  let current = start;

  return {
    now() {
      return current;
    },

    advanceBy(delta) {
      assertLogicalTick(delta, 'Logical clock delta');

      const next = current + delta;

      assertLogicalTick(next, 'Logical clock result');

      current = next;

      return current;
    },

    advanceTo(next) {
      assertLogicalTick(next, 'Logical clock target');

      if (next < current) {
        throw new Error('Logical clock cannot move backwards.');
      }

      current = next;

      return current;
    },
  };
}
