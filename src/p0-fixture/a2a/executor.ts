import { Role } from '@a2a-js/sdk';
import type { Message } from '@a2a-js/sdk';
import { AgentEvent } from '@a2a-js/sdk/server';
import type { AgentExecutor, ExecutionEventBus, RequestContext } from '@a2a-js/sdk/server';

import { cloneSecurityContext } from '../../core/index.js';
import type { HandoffAdapter, SecurityContext } from '../../core/index.js';
import type { EvidenceRecorder } from '../../protocol-lab/evidence.js';
import { P0_MCP_AUDIENCE } from '../constants.js';
import { callP0ToolThroughMcp } from '../mcp/harness.js';
import type { P0EnforcementMode, P0McpExecutionResult } from '../mcp/types.js';
import type { P0Scenario } from '../scenario.js';
import type { P0FixtureState } from '../state.js';

export interface P0A2aRunState {
  translatedContext?: SecurityContext;

  mcpResult?: P0McpExecutionResult;
}

function readContext(value: unknown): SecurityContext {
  if (typeof value !== 'object' || value === null) {
    throw new Error('A2A request has no P0 security context.');
  }

  const candidate = value as Record<string, unknown>;

  const requiredStrings = ['principal', 'caller', 'downstream', 'tenant', 'resource'] as const;

  for (const key of requiredStrings) {
    if (typeof candidate[key] !== 'string') {
      throw new Error(`Invalid P0 security-context field: ${key}`);
    }
  }

  if (
    !Array.isArray(candidate.capabilities) ||
    !candidate.capabilities.every((item) => typeof item === 'string')
  ) {
    throw new Error('Invalid P0 security-context capabilities.');
  }

  return cloneSecurityContext(candidate as unknown as SecurityContext);
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

export class P0A2aExecutor implements AgentExecutor {
  constructor(
    private readonly handoffAdapter: HandoffAdapter,
    private readonly scenario: P0Scenario,
    private readonly enforcementMode: P0EnforcementMode,
    private readonly recorder: EvidenceRecorder,
    private readonly fixtureState: P0FixtureState,
    private readonly runState: P0A2aRunState,
  ) {}

  async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
    const original = readContext(requestContext.request.metadata?.handoffprobeContext);

    this.recorder.record({
      protocol: 'A2A',
      protocolVersion: '1.0',
      boundary: 'a2a-rest -> p0-agent-executor',
      event: 'a2a.receiver.receive',
      context: original,
      details: {
        messageId: requestContext.userMessage.messageId,
        scenarioId: this.scenario.id,
      },
    });

    const translated = await this.handoffAdapter.translate(original);

    this.runState.translatedContext = cloneSecurityContext(translated);

    this.recorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-p0-v1',
      boundary: 'a2a-receiver -> p0-mcp-client',
      event: 'handoff.translate',
      context: translated,
      details: {
        handoffAdapter: this.handoffAdapter.id,

        scenarioId: this.scenario.id,

        selectedTool: this.scenario.tool,

        originalPrincipal: original.principal,

        translatedPrincipal: translated.principal,

        originalDownstream: original.downstream,

        translatedDownstream: translated.downstream,

        originalTenant: original.tenant,

        translatedTenant: translated.tenant,

        originalResource: original.resource,

        translatedResource: translated.resource,

        upstreamAuthority: original.upstreamAuthority,

        translatedAuthority: translated.effectiveAuthority,

        upstreamCredential: original.upstreamCredential,

        forwardedCredential: translated.forwardedCredential,

        lifecycle: translated.lifecycle,
      },
    });

    const downstreamAudience = this.scenario.mcpAudience ?? P0_MCP_AUDIENCE;

    const mcpContext = cloneSecurityContext(translated);

    const requestedCredential = translated.forwardedCredential;

    /*
     * Upstream credential metadata belongs to
     * the upstream boundary and must never be
     * copied into MCP implicitly.
     */
    delete mcpContext.upstreamCredential;

    if (requestedCredential !== undefined) {
      const audienceMatches = requestedCredential.audience === downstreamAudience;

      const blockedBySecurePolicy =
        this.enforcementMode === 'enforce' &&
        (requestedCredential.credentialClass === 'bearer' || !audienceMatches);

      if (blockedBySecurePolicy) {
        delete mcpContext.forwardedCredential;
      }

      this.recorder.record({
        protocol: 'HANDOFF',

        protocolVersion: 'handoffprobe-p0-v1',

        boundary: 'handoff-credential-policy -> p0-mcp-client',

        event: 'p0.credential.forwarding',

        context: mcpContext,

        details: {
          credentialFingerprint: requestedCredential.fingerprint,

          credentialClass: requestedCredential.credentialClass,

          originalAudience: requestedCredential.audience,

          downstreamAudience,

          audienceMatches,

          forwardingDecision: blockedBySecurePolicy ? 'blocked' : 'forwarded',
        },
      });
    }

    if (this.scenario.lifecycleTracking === true) {
      const lifecycle = mcpContext.lifecycle;

      if (lifecycle === undefined) {
        throw new Error('Lifecycle tracking requested without lifecycle context.');
      }

      this.recorder.record({
        protocol: 'CORE',

        protocolVersion: 'p0-lifecycle-v1',

        boundary: 'a2a-task -> downstream-operation',

        event: 'lifecycle.start',

        context: mcpContext,

        details: {
          taskId: lifecycle.taskId,

          state: lifecycle.state,

          sideEffectCounterBefore: this.fixtureState.sideEffectCounter,
        },
      });
    }

    const argumentsForTool = this.scenario.buildArguments(mcpContext);

    const mcpResult = await callP0ToolThroughMcp({
      context: mcpContext,

      recorder: this.recorder,

      state: this.fixtureState,

      mode: this.enforcementMode,

      audience: downstreamAudience,

      cancelLifecycleBeforeTool: this.scenario.cancelLifecycleBeforeTool ?? false,

      tool: this.scenario.tool,

      arguments: argumentsForTool,
    });

    this.runState.mcpResult = mcpResult;

    const responseText = JSON.stringify(mcpResult.envelope);

    this.recorder.record({
      protocol: 'A2A',
      protocolVersion: '1.0',
      boundary: 'p0-agent-executor -> a2a-rest',
      event: 'a2a.receiver.respond',
      context: translated,
      details: {
        scenarioId: this.scenario.id,
        selectedTool: this.scenario.tool,
        authorizationResult: mcpResult.envelope.authorization.invariantAllowed,
        executed: mcpResult.envelope.authorization.executed,
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
