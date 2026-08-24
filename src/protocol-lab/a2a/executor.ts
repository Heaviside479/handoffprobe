import { Role, type Message } from '@a2a-js/sdk';
import {
  AgentEvent,
  type AgentExecutor,
  type ExecutionEventBus,
  type RequestContext,
} from '@a2a-js/sdk/server';

import type { EvidenceRecorder } from '../evidence.js';
import type { FixtureMode, LabRunState, SecurityContext } from '../models.js';
import { translateSecurityContext } from '../handoff/translate.js';
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

export class HandoffLabExecutor implements AgentExecutor {
  constructor(
    private readonly fixture: FixtureMode,
    private readonly recorder: EvidenceRecorder,
    private readonly state: LabRunState,
  ) {}

  async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
    const original = readContext(requestContext.request.metadata?.handoffprobeContext);

    this.recorder.record({
      protocol: 'A2A',
      protocolVersion: '1.0',
      boundary: 'a2a-rest -> agent-executor',
      event: 'a2a.receiver.receive',
      context: original,
      details: {
        messageId: requestContext.userMessage.messageId,
      },
    });

    const translated = translateSecurityContext(original, this.fixture);

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
        fixture: this.fixture,
      },
    });

    const mcp = await callReadInvoiceThroughMcp(translated, this.recorder);

    this.state.mcpEra = mcp.era;
    this.state.toolResult = mcp.result;

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
