import { Role, type Message } from '@a2a-js/sdk';
import {
  AgentEvent,
  RequestContext,
  type AgentExecutor,
  type ExecutionEventBus,
} from '@a2a-js/sdk/server';

import type { HandoffAdapter } from '../../core/index.js';
import { recordA2aCrossingObservation } from '../../phase9/crossing-corpus/observation.js';
import type { EvidenceRecorder } from '../evidence.js';
import type { LabRunState, SecurityContext } from '../models.js';
import { callReadInvoiceThroughMcp } from '../mcp/harness.js';

function readContext(value: unknown): SecurityContext {
  if (
    typeof value === 'object' &&
    value !== null &&
    'principal' in value &&
    'caller' in value &&
    'downstream' in value &&
    'tenant' in value &&
    'resource' in value &&
    'capabilities' in value
  ) {
    const candidate = value;

    if (
      typeof candidate.principal === 'string' &&
      typeof candidate.caller === 'string' &&
      typeof candidate.downstream === 'string' &&
      typeof candidate.tenant === 'string' &&
      typeof candidate.resource === 'string' &&
      Array.isArray(candidate.capabilities) &&
      candidate.capabilities.every((item) => typeof item === 'string')
    ) {
      return {
        principal: candidate.principal,
        caller: candidate.caller,
        downstream: candidate.downstream,
        tenant: candidate.tenant,
        resource: candidate.resource,
        capabilities: [...candidate.capabilities],
      };
    }
  }

  throw new Error('A2A request does not contain a valid HandoffProbe security context.');
}

function createTextMessage(messageId: string, contextId: string, text: string): Message {
  return {
    messageId,
    contextId,
    taskId: '',
    role: Role.ROLE_AGENT,
    metadata: undefined,
    extensions: [],
    referenceTaskIds: [],
    parts: [
      {
        content: {
          $case: 'text',
          value: text,
        },
        mediaType: 'application/json',
        filename: '',
        metadata: undefined,
      },
    ],
  };
}

function createCrossingRuntimeRequestContext(
  requestContext: RequestContext,
  state: LabRunState,
): RequestContext {
  const taskId = state.crossingTaskIdOverride ?? requestContext.taskId;
  const contextId = state.crossingContextIdOverride ?? requestContext.contextId;

  if (taskId === requestContext.taskId && contextId === requestContext.contextId) {
    return requestContext;
  }

  const runtimeRequest = structuredClone(requestContext.request);
  const runtimeMessage = runtimeRequest.message;

  if (runtimeMessage === undefined) {
    throw new Error('Crossing runtime RequestContext requires request.message.');
  }

  runtimeMessage.taskId = taskId;
  runtimeMessage.contextId = contextId;

  // The A2A SDK has already bound its EventBus to the server-resolved task.
  // Clone only the downstream executor view so corpus perturbations cannot
  // rewrite SDK lifecycle state.
  return new RequestContext(
    runtimeRequest,
    taskId,
    contextId,
    requestContext.context,
    requestContext.task,
    requestContext.referenceTasks,
  );
}

export class HandoffLabExecutor implements AgentExecutor {
  constructor(
    private readonly handoffAdapter: HandoffAdapter,
    private readonly recorder: EvidenceRecorder,
    private readonly state: LabRunState,
  ) {}

  async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
    const authorityRequestContext = requestContext;

    const runtimeRequestContext =
      this.state.crossingObservation === undefined
        ? requestContext
        : createCrossingRuntimeRequestContext(requestContext, this.state);

    const original = readContext(runtimeRequestContext.request.metadata?.handoffprobeContext);

    if (this.state.crossingObservation !== undefined) {
      const requestIdentity = this.state.a2aRequestIdentity;
      const user = runtimeRequestContext.context.user;
      const authorityObservation = this.state.crossingAuthorityObservation;

      if (authorityObservation !== undefined) {
        recordA2aCrossingObservation(authorityObservation, {
          caller: this.state.a2aAuthorityCaller,
          messageId: this.state.a2aAuthorityMessageId,
          taskId: authorityRequestContext.taskId,
          contextId: authorityRequestContext.contextId,
          transportAuthenticated: user?.isAuthenticated === true,
          taskServerResolved: requestIdentity?.taskIdSuppliedByClient === false,
          contextServerResolved: requestIdentity?.contextIdSuppliedByClient === false,
        });
      }

      recordA2aCrossingObservation(this.state.crossingObservation, {
        caller: user?.userName,
        messageId: runtimeRequestContext.userMessage.messageId,
        taskId: runtimeRequestContext.taskId,
        contextId: runtimeRequestContext.contextId,
        transportAuthenticated: user?.isAuthenticated === true,
        taskServerResolved: requestIdentity?.taskIdSuppliedByClient === false,
        contextServerResolved: requestIdentity?.contextIdSuppliedByClient === false,
      });
    }

    this.recorder.record({
      protocol: 'A2A',
      protocolVersion: '1.0',
      boundary: 'a2a-rest -> agent-executor',
      event: 'a2a.receiver.receive',
      context: original,
      details: {
        messageId: runtimeRequestContext.userMessage.messageId,
      },
    });

    const translated = await this.handoffAdapter.translate(original);

    this.state.translatedContext = translated;

    this.recorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-v1',
      boundary: 'a2a-receiver -> mcp-client',
      event: 'handoff.translate',
      context: translated,
      details: {
        originalPrincipal: original.principal,
        translatedPrincipal: translated.principal,
        fixture: this.recorder.fixture,
        handoffAdapter: this.handoffAdapter.id,
      },
    });

    const mcp = await callReadInvoiceThroughMcp(
      translated,
      this.recorder,
      this.state.crossingObservation,
      this.state.crossingEffectRecorder,
      this.state.crossingPreDispatchGate,
      this.state.crossingAuthorityObservation,
    );

    this.state.mcpEra = mcp.era;
    this.state.toolResult = mcp.result;

    if (mcp.crossingVerification !== undefined) {
      this.state.crossingVerification = mcp.crossingVerification;
    }

    const responseText = JSON.stringify(mcp.result);

    this.recorder.record({
      protocol: 'A2A',
      protocolVersion: '1.0',
      boundary: 'agent-executor -> a2a-rest',
      event: 'a2a.receiver.respond',
      context: translated,
      details: {
        invoiceId: mcp.result.invoiceId,
      },
    });

    eventBus.publish(
      AgentEvent.message(
        createTextMessage(
          `${this.recorder.runId}-response`,
          requestContext.contextId,
          responseText,
        ),
      ),
    );

    eventBus.finished();
  }

  cancelTask(): Promise<void> {
    return Promise.resolve();
  }
}
