import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { createMcpHandler } from '@modelcontextprotocol/server';

import type { SecurityContext } from '../../core/index.js';
import type { EvidenceRecorder } from '../../protocol-lab/evidence.js';
import { P0_MCP_AUDIENCE } from '../constants.js';
import type { P0FixtureState } from '../state.js';
import { createP0FakeToolServer } from './fake-tools.js';
import type {
  P0EnforcementMode,
  P0McpExecutionResult,
  P0McpToolName,
  P0ToolEnvelope,
} from './types.js';

type McpContentBlock =
  | {
      type: 'text';
      text: string;
    }
  | Record<string, unknown>;

function readTextContent(content: McpContentBlock[]): string {
  for (const block of content) {
    if (block.type === 'text' && typeof block.text === 'string') {
      return block.text;
    }
  }

  throw new Error('P0 MCP fake tool returned no text content.');
}

export interface P0McpCallInput {
  context: SecurityContext;
  recorder: EvidenceRecorder;
  state: P0FixtureState;
  mode?: P0EnforcementMode;

  audience?: string;

  cancelLifecycleBeforeTool?: boolean;

  tool: P0McpToolName;
  arguments: Record<string, unknown>;
}

export async function callP0ToolThroughMcp(input: P0McpCallInput): Promise<P0McpExecutionResult> {
  const mode = input.mode ?? 'enforce';

  const downstreamAudience = input.audience ?? P0_MCP_AUDIENCE;

  const handler = createMcpHandler(
    ({ era }) =>
      createP0FakeToolServer(
        input.recorder,
        input.context,
        input.state,
        era,
        mode,
        downstreamAudience,
      ),
    {
      legacy: 'reject',
    },
  );

  const transport = new StreamableHTTPClientTransport(new URL('http://handoffprobe.local/p0-mcp'), {
    fetch: (requestInput, init) => handler.fetch(new Request(requestInput, init)),
  });

  const client = new Client(
    {
      name: 'handoffprobe-p0-fixture',
      version: '0.0.0',
    },
    {
      versionNegotiation: {
        mode: {
          pin: '2026-07-28',
        },
      },
    },
  );

  try {
    await client.connect(transport);

    const era = client.getProtocolEra();

    if (era !== 'modern') {
      throw new Error(`Expected modern MCP era but received ${String(era)}.`);
    }

    input.recorder.record({
      protocol: 'MCP',
      protocolVersion: '2026-07-28',
      boundary: 'handoff-translation -> p0-mcp-client',
      event: 'mcp.client.connected',
      context: input.context,
      details: {
        era,
        enforcementMode: mode,
        downstreamAudience,
      },
    });

    input.recorder.record({
      protocol: 'MCP',
      protocolVersion: '2026-07-28',
      boundary: 'p0-mcp-client -> p0-mcp-server',
      event: 'mcp.tool.call',
      context: input.context,
      details: {
        selectedTool: input.tool,
        targetResource: input.arguments.resource,
        enforcementMode: mode,
        downstreamAudience,
      },
    });

    if (input.cancelLifecycleBeforeTool === true) {
      const lifecycle = input.context.lifecycle;

      if (lifecycle === undefined) {
        throw new Error('Lifecycle cancellation requested without lifecycle context.');
      }

      const previousState = lifecycle.state;

      lifecycle.state = 'cancelled';

      input.recorder.record({
        protocol: 'CORE',

        protocolVersion: 'p0-lifecycle-v1',

        boundary: 'governing-a2a-task -> p0-mcp-tool',

        event: 'lifecycle.cancel',

        context: input.context,

        details: {
          taskId: lifecycle.taskId,

          previousState,

          state: lifecycle.state,

          delayPoint: 'after_mcp_request_before_tool_execution',

          sideEffectCounterBefore: input.state.sideEffectCounter,
        },
      });
    }

    const result = await client.callTool({
      name: input.tool,

      arguments: input.arguments,
    });

    const envelope = JSON.parse(readTextContent(result.content)) as P0ToolEnvelope;

    input.recorder.record({
      protocol: 'MCP',
      protocolVersion: '2026-07-28',
      boundary: 'p0-mcp-server -> handoff-translation',
      event: 'mcp.tool.result',
      context: input.context,
      details: {
        selectedTool: input.tool,
        authorizationResult: envelope.authorization.invariantAllowed,
        executed: envelope.authorization.executed,
        sideEffectCounterBefore: envelope.before.sideEffectCounter,
        sideEffectCounterAfter: envelope.after.sideEffectCounter,
      },
    });

    return {
      era,
      envelope,
    };
  } finally {
    await client.close();
    await handler.close();
  }
}
