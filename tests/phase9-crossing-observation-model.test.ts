import { describe, expect, it } from 'vitest';

import {
  createCrossingObservationState,
  evaluateCrossingObservationReadiness,
  observedScalarsEqual,
  recordA2aCrossingObservation,
  recordMcpCrossingObservation,
  snapshotCrossingObservation,
  toExternalCrossingObservedShape,
} from '../src/phase9/crossing-corpus/observation.js';

describe('Phase 9.1C crossing observation model', () => {
  it('maps independently observed crossing fields to the external corpus shape', () => {
    const state = createCrossingObservationState();

    recordA2aCrossingObservation(state, {
      caller: 'agent-a',
      messageId: 'message-001',
      taskId: 'task-001',
      contextId: 'context-001',
      transportAuthenticated: true,
      taskServerResolved: true,
      contextServerResolved: true,
    });

    recordMcpCrossingObservation(state, {
      audience: 'https://mcp.example/interop',
      audienceDerivationSource: 'oauth_resource',
      tool: 'interop.echo',
      arguments: { message: 'hello' },
    });

    const observation = snapshotCrossingObservation(state);

    expect(toExternalCrossingObservedShape(observation)).toEqual({
      caller_id: 'agent-a',
      message_id: 'message-001',
      task_id: 'task-001',
      context_id: 'context-001',
      mcp_audience: {
        value: 'https://mcp.example/interop',
        source: 'oauth_resource',
      },
      tool: 'interop.echo',
      arguments: { message: 'hello' },
    });

    expect(evaluateCrossingObservationReadiness(observation)).toEqual({
      complete: true,
      missing: [],
    });
  });

  it('preserves provenance separately from observed values', () => {
    const state = createCrossingObservationState();

    recordA2aCrossingObservation(state, {
      caller: 'agent-a',
      messageId: 'message-001',
      taskId: 'task-001',
      contextId: 'context-001',
      transportAuthenticated: true,
      taskServerResolved: true,
      contextServerResolved: true,
    });

    recordMcpCrossingObservation(state, {
      audience: 'https://mcp.example/interop',
      audienceDerivationSource: 'oauth_resource',
      tool: 'interop.echo',
      arguments: { message: 'hello' },
    });

    expect(state.caller.source).toBe('a2a.transport_auth');
    expect(state.caller.transportAuthenticated).toBe(true);
    expect(state.messageId.source).toBe('a2a.user_message');
    expect(state.taskId.source).toBe('a2a.request_context');
    expect(state.taskId.serverResolved).toBe(true);
    expect(state.contextId.serverResolved).toBe(true);
    expect(state.mcpAudience.source).toBe('mcp.transport_url');
    expect(state.action.source).toBe('mcp.pre_dispatch');
  });

  it('marks the current incomplete provenance non-green', () => {
    const state = createCrossingObservationState();

    recordA2aCrossingObservation(state, {
      caller: 'agent-a',
      messageId: 'message-001',
      taskId: '',
      contextId: 'context-client-created',
      transportAuthenticated: false,
      taskServerResolved: false,
      contextServerResolved: false,
    });

    recordMcpCrossingObservation(state, {
      audience: 'https://mcp.example/interop',
      audienceDerivationSource: 'oauth_resource',
      tool: 'interop.echo',
      arguments: { message: 'hello' },
    });

    expect(state.caller.source).toBe('a2a.request_metadata');

    expect(evaluateCrossingObservationReadiness(state)).toEqual({
      complete: false,
      missing: ['caller.transport_authenticated', 'task_id', 'context_id.server_resolved'],
    });
  });

  it('never treats two missing values as evidence of equality', () => {
    expect(observedScalarsEqual(null, null)).toBe(false);
    expect(observedScalarsEqual('message-001', null)).toBe(false);
    expect(observedScalarsEqual(null, 'message-001')).toBe(false);
    expect(observedScalarsEqual('message-001', 'message-001')).toBe(true);
    expect(observedScalarsEqual('message-001', 'message-002')).toBe(false);
  });

  it('snapshots MCP arguments instead of retaining a mutable reference', () => {
    const state = createCrossingObservationState();
    const argumentsValue = { message: 'hello' };

    recordMcpCrossingObservation(state, {
      audience: 'https://mcp.example/interop',
      audienceDerivationSource: 'oauth_resource',
      tool: 'interop.echo',
      arguments: argumentsValue,
    });

    const snapshot = snapshotCrossingObservation(state);

    argumentsValue.message = 'changed-after-observation';

    expect(snapshot.action.arguments).toEqual({
      message: 'hello',
    });
  });
});
