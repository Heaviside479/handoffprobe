import { digestCrossingJson } from './verifier.js';
import type { CrossingCorpusCase } from './loader.js';
import type { ExternalCrossingObservedShape } from './observation.js';

export type CrossingMutationOperation = 'set' | 'delete' | 'rehash';

export type CrossingMutationTarget =
  | 'bundle'
  | 'status'
  | 'authority'
  | 'reference'
  | 'initial_authority'
  | 'initial_reference'
  | 'observed';

export interface CrossingCaseMutation {
  readonly op: CrossingMutationOperation;
  readonly target: CrossingMutationTarget;
  readonly path: readonly string[];
  readonly source?: CrossingMutationTarget;
  readonly value?: unknown;
}

export interface CrossingMutableCaseState {
  readonly bundle: Record<string, unknown>;
  readonly status: Record<string, unknown>;
  readonly observed: ExternalCrossingObservedShape;
}

const operations = new Set<CrossingMutationOperation>(['set', 'delete', 'rehash']);

const targets = new Set<CrossingMutationTarget>([
  'bundle',
  'status',
  'authority',
  'reference',
  'initial_authority',
  'initial_reference',
  'observed',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeMutation(value: unknown): CrossingCaseMutation {
  if (!isRecord(value)) {
    throw new Error('Crossing corpus mutation must be an object.');
  }

  const op = value.op;
  const target = value.target;
  const path = value.path;

  if (
    typeof op !== 'string' ||
    !operations.has(op as CrossingMutationOperation) ||
    typeof target !== 'string' ||
    !targets.has(target as CrossingMutationTarget) ||
    !Array.isArray(path) ||
    path.length === 0 ||
    !path.every((segment) => typeof segment === 'string' && segment.length > 0)
  ) {
    throw new Error('Crossing corpus mutation has invalid operation, target, or path.');
  }

  const normalized: CrossingCaseMutation = {
    op: op as CrossingMutationOperation,
    target: target as CrossingMutationTarget,
    path: [...(path as string[])],
  };

  if (op === 'set') {
    if (!Object.prototype.hasOwnProperty.call(value, 'value')) {
      throw new Error('Crossing corpus set mutation is missing value.');
    }

    return {
      ...normalized,
      value: structuredClone(value.value),
    };
  }

  if (op === 'rehash') {
    const source = value.source;

    if (typeof source !== 'string' || !targets.has(source as CrossingMutationTarget)) {
      throw new Error('Crossing corpus rehash mutation has invalid source.');
    }

    return {
      ...normalized,
      source: source as CrossingMutationTarget,
    };
  }

  return normalized;
}

export function normalizeCrossingCaseMutations(
  corpusCase: CrossingCorpusCase,
): readonly CrossingCaseMutation[] {
  return corpusCase.mutations.map((mutation) => normalizeMutation(mutation));
}

function mutableRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`Crossing corpus mutation target is not an object: ${label}`);
  }

  return value;
}

function selectTarget(
  state: CrossingMutableCaseState,
  target: CrossingMutationTarget,
): Record<string, unknown> {
  if (target === 'bundle') {
    return state.bundle;
  }

  if (target === 'status') {
    return state.status;
  }

  if (target === 'observed') {
    return mutableRecord(state.observed, 'observed');
  }

  return mutableRecord(state.bundle[target], target);
}

function parentForPath(
  container: Record<string, unknown>,
  path: readonly string[],
): {
  parent: Record<string, unknown>;
  key: string;
} {
  let current = container;

  for (const segment of path.slice(0, -1)) {
    current = mutableRecord(current[segment], segment);
  }

  const key = path[path.length - 1];

  if (key === undefined) {
    throw new Error('Crossing corpus mutation path cannot be empty.');
  }

  return {
    parent: current,
    key,
  };
}

function applyMutation(state: CrossingMutableCaseState, mutation: CrossingCaseMutation): void {
  const target = selectTarget(state, mutation.target);
  const location = parentForPath(target, mutation.path);

  if (mutation.op === 'set') {
    location.parent[location.key] = structuredClone(mutation.value);
    return;
  }

  if (mutation.op === 'delete') {
    if (!Object.prototype.hasOwnProperty.call(location.parent, location.key)) {
      throw new Error(`Crossing corpus delete path does not exist: ${mutation.path.join('.')}`);
    }

    delete location.parent[location.key];
    return;
  }

  if (mutation.source === undefined) {
    throw new Error('Crossing corpus rehash mutation is missing source.');
  }

  const source = selectTarget(state, mutation.source);
  location.parent[location.key] = digestCrossingJson(source);
}

export function applyCrossingCaseMutations(
  input: CrossingMutableCaseState,
  corpusCase: CrossingCorpusCase,
): CrossingMutableCaseState {
  const state = structuredClone(input);

  for (const mutation of normalizeCrossingCaseMutations(corpusCase)) {
    applyMutation(state, mutation);
  }

  return state;
}
