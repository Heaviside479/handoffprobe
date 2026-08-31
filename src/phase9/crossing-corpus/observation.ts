export type CrossingObservationSource =
  | 'a2a.transport_auth'
  | 'a2a.request_metadata'
  | 'a2a.user_message'
  | 'a2a.request_context'
  | 'mcp.transport_url'
  | 'mcp.pre_dispatch'
  | 'not_observed';

export interface CrossingCallerObservation {
  value: string | null;
  source: CrossingObservationSource;
  transportAuthenticated: boolean;
}

export interface CrossingIdentifierObservation {
  value: string | null;
  source: CrossingObservationSource;
  serverResolved: boolean;
}

export interface CrossingAudienceObservation {
  value: string | null;
  source: CrossingObservationSource;
  derivationSource: string | null;
}

export interface CrossingActionObservation {
  tool: string | null;
  arguments: Record<string, unknown> | null;
  source: CrossingObservationSource;
}

export interface CrossingObservationState {
  caller: CrossingCallerObservation;
  messageId: CrossingIdentifierObservation;
  taskId: CrossingIdentifierObservation;
  contextId: CrossingIdentifierObservation;
  mcpAudience: CrossingAudienceObservation;
  action: CrossingActionObservation;
}

export interface ExternalCrossingObservedShape {
  caller_id: string | null;
  message_id: string | null;
  task_id: string | null;
  context_id: string | null;
  mcp_audience: {
    value: string | null;
    source: string | null;
  };
  tool: string | null;
  arguments: Record<string, unknown> | null;
}

export type CrossingObservationGap =
  | 'caller.transport_authenticated'
  | 'caller_id'
  | 'message_id'
  | 'task_id'
  | 'task_id.server_resolved'
  | 'context_id'
  | 'context_id.server_resolved'
  | 'mcp_audience.value'
  | 'mcp_audience.source'
  | 'tool'
  | 'arguments';

export interface CrossingObservationReadiness {
  complete: boolean;
  missing: readonly CrossingObservationGap[];
}

function nonEmpty(value: string | undefined): string | null {
  if (value === undefined) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

function cloneArguments(
  value: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (value === null || value === undefined) {
    return null;
  }

  return structuredClone(value);
}

export function createCrossingObservationState(): CrossingObservationState {
  return {
    caller: {
      value: null,
      source: 'not_observed',
      transportAuthenticated: false,
    },
    messageId: {
      value: null,
      source: 'not_observed',
      serverResolved: false,
    },
    taskId: {
      value: null,
      source: 'not_observed',
      serverResolved: false,
    },
    contextId: {
      value: null,
      source: 'not_observed',
      serverResolved: false,
    },
    mcpAudience: {
      value: null,
      source: 'not_observed',
      derivationSource: null,
    },
    action: {
      tool: null,
      arguments: null,
      source: 'not_observed',
    },
  };
}

export function recordA2aCrossingObservation(
  state: CrossingObservationState,
  input: {
    caller: string | undefined;
    messageId: string | undefined;
    taskId: string | undefined;
    contextId: string | undefined;
    transportAuthenticated: boolean;
    taskServerResolved: boolean;
    contextServerResolved: boolean;
  },
): void {
  state.caller = {
    value: nonEmpty(input.caller),
    source: input.transportAuthenticated ? 'a2a.transport_auth' : 'a2a.request_metadata',
    transportAuthenticated: input.transportAuthenticated,
  };

  state.messageId = {
    value: nonEmpty(input.messageId),
    source: 'a2a.user_message',
    serverResolved: false,
  };

  state.taskId = {
    value: nonEmpty(input.taskId),
    source: 'a2a.request_context',
    serverResolved: input.taskServerResolved,
  };

  state.contextId = {
    value: nonEmpty(input.contextId),
    source: 'a2a.request_context',
    serverResolved: input.contextServerResolved,
  };
}

export function recordMcpCrossingObservation(
  state: CrossingObservationState,
  input: {
    audience: string | undefined;
    audienceDerivationSource: string | undefined;
    tool: string | undefined;
    arguments: Record<string, unknown> | undefined;
  },
): void {
  state.mcpAudience = {
    value: nonEmpty(input.audience),
    source: 'mcp.transport_url',
    derivationSource: nonEmpty(input.audienceDerivationSource),
  };

  state.action = {
    tool: nonEmpty(input.tool),
    arguments: cloneArguments(input.arguments),
    source: 'mcp.pre_dispatch',
  };
}

export function snapshotCrossingObservation(
  state: CrossingObservationState,
): CrossingObservationState {
  return {
    caller: { ...state.caller },
    messageId: { ...state.messageId },
    taskId: { ...state.taskId },
    contextId: { ...state.contextId },
    mcpAudience: { ...state.mcpAudience },
    action: {
      ...state.action,
      arguments: cloneArguments(state.action.arguments),
    },
  };
}

export function toExternalCrossingObservedShape(
  observation: CrossingObservationState,
): ExternalCrossingObservedShape {
  return {
    caller_id: observation.caller.value,
    message_id: observation.messageId.value,
    task_id: observation.taskId.value,
    context_id: observation.contextId.value,
    mcp_audience: {
      value: observation.mcpAudience.value,
      source: observation.mcpAudience.derivationSource,
    },
    tool: observation.action.tool,
    arguments: cloneArguments(observation.action.arguments),
  };
}

export function evaluateCrossingObservationReadiness(
  observation: CrossingObservationState,
): CrossingObservationReadiness {
  const missing: CrossingObservationGap[] = [];

  if (observation.caller.value === null) {
    missing.push('caller_id');
  } else if (observation.caller.transportAuthenticated === false) {
    missing.push('caller.transport_authenticated');
  }

  if (observation.messageId.value === null) {
    missing.push('message_id');
  }

  if (observation.taskId.value === null) {
    missing.push('task_id');
  } else if (observation.taskId.serverResolved === false) {
    missing.push('task_id.server_resolved');
  }

  if (observation.contextId.value === null) {
    missing.push('context_id');
  } else if (observation.contextId.serverResolved === false) {
    missing.push('context_id.server_resolved');
  }

  if (observation.mcpAudience.value === null) {
    missing.push('mcp_audience.value');
  }

  if (observation.mcpAudience.derivationSource === null) {
    missing.push('mcp_audience.source');
  }

  if (observation.action.tool === null) {
    missing.push('tool');
  }

  if (observation.action.arguments === null) {
    missing.push('arguments');
  }

  return {
    complete: missing.length === 0,
    missing,
  };
}

export function observedScalarsEqual(left: string | null, right: string | null): boolean {
  if (left === null || right === null) {
    return false;
  }

  return left === right;
}
