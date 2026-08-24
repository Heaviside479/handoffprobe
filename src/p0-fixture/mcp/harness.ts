import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { createMcpHandler } from '@modelcontextprotocol/server';

import type { SecurityContext } from '../../core/index.js';
import type { EvidenceRecorder } from '../../protocol-lab/evidence.js';
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
  tool: P0McpToolName;
  arguments: Record<string, unknown>;
}

export async function callP0ToolThroughMcp(input: P0McpCallInput): Promise<P0McpExecutionResult> {
  const mode = input.mode ?? 'enforce';

  const handler = createMcpHandler(
    ({ era }) => createP0FakeToolServer(input.recorder, input.context, input.state, era, mode),
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
      },
    });

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
