import { createP0FixtureState, snapshotP0FixtureState } from '../p0-fixture/state.js';

import type { P0FixtureSnapshot, P0FixtureState } from '../p0-fixture/state.js';

export interface P1DelegationRecord {
  id: string;

  principal: string;

  delegate: string;

  tenant: string;

  resources: string[];

  capabilities: string[];

  chain: string[];

  taskId: string;

  runId: string;

  issuedAt: number;

  expiresAt: number;

  singleUse: boolean;

  consumedAt?: number;

  invalidatedAt?: number;
}

export interface P1DelegationRequest {
  principal: string;

  delegate: string;

  tenant: string;

  resource: string;

  capability: string;

  taskId: string;

  runId: string;

  requiredChain?: readonly string[];
}

export interface P1DelegationDecision {
  allowed: boolean;

  reasons: string[];

  expired: boolean;

  consumed: boolean;

  invalidated: boolean;

  principalMatches: boolean;

  delegateMatches: boolean;

  tenantMatches: boolean;

  resourceMatches: boolean;

  capabilityMatches: boolean;

  taskMatches: boolean;

  runMatches: boolean;

  chainMatches: boolean;
}

export interface P1ActionRecord {
  actionId: string;

  attemptIds: string[];

  sideEffectCount: number;

  completed: boolean;
}

export interface P1AuditLineageRecord {
  correlationId: string;

  principal: string;

  taskId: string;

  delegationId: string;

  handoffId: string;

  mcpRequestId: string;

  sideEffectId?: string;
}

export interface P1FixtureState extends P0FixtureState {
  delegations: Record<string, P1DelegationRecord>;

  actions: Record<string, P1ActionRecord>;

  auditLineage: P1AuditLineageRecord[];
}

export interface P1FixtureSnapshot extends P0FixtureSnapshot {
  delegations: Record<string, P1DelegationRecord>;

  actions: Record<string, P1ActionRecord>;

  auditLineage: P1AuditLineageRecord[];
}

function sameOrderedValues(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function requireDelegation(state: P1FixtureState, delegationId: string): P1DelegationRecord {
  const delegation = state.delegations[delegationId];

  if (delegation === undefined) {
    throw new Error(`P1 delegation not found: ${delegationId}`);
  }

  return delegation;
}

function requireAction(state: P1FixtureState, actionId: string): P1ActionRecord {
  const action = state.actions[actionId];

  if (action === undefined) {
    throw new Error(`P1 action not found: ${actionId}`);
  }

  return action;
}

export function createP1FixtureState(): P1FixtureState {
  return {
    ...createP0FixtureState(),

    delegations: {},

    actions: {},

    auditLineage: [],
  };
}

export function registerP1Delegation(
  state: P1FixtureState,
  input: P1DelegationRecord,
): P1DelegationRecord {
  if (state.delegations[input.id] !== undefined) {
    throw new Error(`P1 delegation already exists: ${input.id}`);
  }

  if (input.expiresAt <= input.issuedAt) {
    throw new Error('P1 delegation expiry must be after issue time.');
  }

  const stored: P1DelegationRecord = {
    ...input,

    resources: [...input.resources],

    capabilities: [...input.capabilities],

    chain: [...input.chain],
  };

  state.delegations[input.id] = stored;

  return {
    ...stored,

    resources: [...stored.resources],

    capabilities: [...stored.capabilities],

    chain: [...stored.chain],
  };
}

export function evaluateP1Delegation(
  state: P1FixtureState,
  delegationId: string,
  logicalTime: number,
  request: P1DelegationRequest,
): P1DelegationDecision {
  const delegation = requireDelegation(state, delegationId);

  const expired = logicalTime >= delegation.expiresAt;

  const invalidated =
    delegation.invalidatedAt !== undefined && logicalTime >= delegation.invalidatedAt;

  const consumed = delegation.singleUse && delegation.consumedAt !== undefined;

  const principalMatches = delegation.principal === request.principal;

  const delegateMatches = delegation.delegate === request.delegate;

  const tenantMatches = delegation.tenant === request.tenant;

  const resourceMatches = delegation.resources.includes(request.resource);

  const capabilityMatches = delegation.capabilities.includes(request.capability);

  const taskMatches = delegation.taskId === request.taskId;

  const runMatches = delegation.runId === request.runId;

  const chainMatches =
    request.requiredChain === undefined ||
    sameOrderedValues(delegation.chain, request.requiredChain);

  const reasons: string[] = [];

  if (logicalTime < delegation.issuedAt) {
    reasons.push('delegation_not_yet_valid');
  }

  if (expired) {
    reasons.push('delegation_expired');
  }

  if (invalidated) {
    reasons.push('delegation_invalidated');
  }

  if (consumed) {
    reasons.push('single_use_delegation_consumed');
  }

  if (!principalMatches) {
    reasons.push('principal_mismatch');
  }

  if (!delegateMatches) {
    reasons.push('delegate_mismatch');
  }

  if (!tenantMatches) {
    reasons.push('tenant_mismatch');
  }

  if (!resourceMatches) {
    reasons.push('resource_mismatch');
  }

  if (!capabilityMatches) {
    reasons.push('capability_mismatch');
  }

  if (!taskMatches) {
    reasons.push('task_mismatch');
  }

  if (!runMatches) {
    reasons.push('run_mismatch');
  }

  if (!chainMatches) {
    reasons.push('delegation_chain_mismatch');
  }

  return {
    allowed: reasons.length === 0,

    reasons,

    expired,

    consumed,

    invalidated,

    principalMatches,

    delegateMatches,

    tenantMatches,

    resourceMatches,

    capabilityMatches,

    taskMatches,

    runMatches,

    chainMatches,
  };
}

export function consumeP1Delegation(
  state: P1FixtureState,
  delegationId: string,
  logicalTime: number,
  request: P1DelegationRequest,
): P1DelegationDecision {
  const decision = evaluateP1Delegation(state, delegationId, logicalTime, request);

  if (!decision.allowed) {
    return decision;
  }

  const delegation = requireDelegation(state, delegationId);

  if (delegation.singleUse) {
    delegation.consumedAt = logicalTime;
  }

  return decision;
}

export function invalidateP1Delegation(
  state: P1FixtureState,
  delegationId: string,
  logicalTime: number,
): void {
  const delegation = requireDelegation(state, delegationId);

  if (delegation.invalidatedAt !== undefined) {
    throw new Error(`P1 delegation already invalidated: ${delegationId}`);
  }

  delegation.invalidatedAt = logicalTime;
}

export function registerP1Action(state: P1FixtureState, actionId: string): P1ActionRecord {
  if (state.actions[actionId] !== undefined) {
    throw new Error(`P1 action already exists: ${actionId}`);
  }

  const action: P1ActionRecord = {
    actionId,

    attemptIds: [],

    sideEffectCount: 0,

    completed: false,
  };

  state.actions[actionId] = action;

  return {
    ...action,

    attemptIds: [...action.attemptIds],
  };
}

export function recordP1Attempt(state: P1FixtureState, actionId: string, attemptId: string): void {
  const action = requireAction(state, actionId);

  if (action.attemptIds.includes(attemptId)) {
    throw new Error(`P1 attempt already recorded: ${attemptId}`);
  }

  action.attemptIds.push(attemptId);
}

export function recordP1ActionSideEffect(state: P1FixtureState, actionId: string): void {
  const action = requireAction(state, actionId);

  action.sideEffectCount += 1;

  action.completed = true;
}

export function recordP1AuditLineage(state: P1FixtureState, record: P1AuditLineageRecord): void {
  state.auditLineage.push({
    ...record,
  });
}

export function snapshotP1FixtureState(state: P1FixtureState): P1FixtureSnapshot {
  const p0 = snapshotP0FixtureState(state);

  return {
    ...p0,

    delegations: Object.fromEntries(
      Object.entries(state.delegations).map(([id, delegation]) => [
        id,
        {
          ...delegation,

          resources: [...delegation.resources],

          capabilities: [...delegation.capabilities],

          chain: [...delegation.chain],
        },
      ]),
    ),

    actions: Object.fromEntries(
      Object.entries(state.actions).map(([id, action]) => [
        id,
        {
          ...action,

          attemptIds: [...action.attemptIds],
        },
      ]),
    ),

    auditLineage: state.auditLineage.map((record) => ({
      ...record,
    })),
  };
}
