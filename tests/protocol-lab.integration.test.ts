import { describe, expect, it } from 'vitest';

import { runProtocolFixture } from '../src/protocol-lab/fixture.js';

const EXPECTED_EVENTS = [
  'a2a.client.send',
  'a2a.receiver.receive',
  'handoff.translate',
  'mcp.client.connected',
  'mcp.tool.call',
  'fake_tool.execute',
  'mcp.tool.result',
  'a2a.receiver.respond',
  'a2a.client.receive',
];

describe('A2A to MCP protocol laboratory', () => {
  it('preserves the original principal in the secure fixture', async () => {
    const result = await runProtocolFixture('secure');

    expect(result.a2aProtocolVersion).toBe('1.0');

    expect(result.mcpProtocolVersion).toBe('2026-07-28');

    expect(result.mcpEra).toBe('modern');

    expect(result.originalContext.principal).toBe('user:alice');

    expect(result.translatedContext.principal).toBe('user:alice');

    expect(result.toolResult.principalObserved).toBe('user:alice');

    expect(result.toolResult.invoiceId).toBe('INV-1001');

    expect(result.evidence.map((event) => event.event)).toEqual(EXPECTED_EVENTS);

    expect(result.evidence.map((event) => event.sequence)).toEqual(
      EXPECTED_EVENTS.map((_, index) => index + 1),
    );
  });

  it('reproduces principal loss in the vulnerable fixture', async () => {
    const result = await runProtocolFixture('vulnerable');

    expect(result.originalContext.principal).toBe('user:alice');

    expect(result.translatedContext.principal).toBe('agent:billing');

    expect(result.toolResult.principalObserved).toBe('agent:billing');

    expect(result.toolResult.invoiceId).toBe('INV-1001');

    expect(result.evidence.map((event) => event.event)).toEqual(EXPECTED_EVENTS);
  });

  it('produces identical structured results across repeated runs', async () => {
    for (const fixture of ['secure', 'vulnerable'] as const) {
      const first = await runProtocolFixture(fixture);

      const second = await runProtocolFixture(fixture);

      expect(second).toEqual(first);

      const serializedEvidence = JSON.stringify(first.evidence);

      expect(serializedEvidence).not.toContain('127.0.0.1:');

      expect(serializedEvidence).not.toMatch(/localhost:\d+/);
    }
  });
});
