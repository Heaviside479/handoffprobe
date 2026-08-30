import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const decision = readFileSync('docs/PHASE8_ADAPTER_ADMISSION_DECISION_20260830.md', 'utf8');

describe('Phase 8.3B adapter admission decision contract', () => {
  it('closes the work package with an evidence-backed no-build decision', () => {
    expect(decision).toContain('Status: completed — no adapter admitted');
    expect(decision).toContain(
      'This is a deliberate no-build decision, not a failed implementation.',
    );
    expect(roadmap).toContain(
      '- [x] 8.3B — implement the first adapter only if the evidence gate is met',
    );
    expect(roadmap).toContain('Phase 8.3B completion record:');
  });

  it('records why every ranked candidate remains outside implementation', () => {
    expect(decision).toContain('| Google ADK | Strong ecosystem evidence |');
    expect(decision).toContain('| IBM ContextForge | Strong identity and delegation demand |');
    expect(decision).toContain('| tRPC-Agent-Go | Moderate ecosystem evidence |');
    expect(decision).toContain('| LangGraph A2A→MCP public sample |');
    expect(decision).toContain('| fast-agent | Weak demand for this exact boundary |');
  });

  it('preserves the successful fast-agent E2E evidence without inventing adoption or a vulnerability', () => {
    expect(decision).toContain('`fast-agent-mcp==0.10.10`');
    expect(decision).toContain('MCP Protocol `2026-07-28`');
    expect(decision).toContain('The incoming synthetic A2A bearer sentinel was not forwarded');
    expect(decision).toContain('HandoffProbe does not claim it is a vulnerability.');
    expect(decision).toContain('It is not independent adoption evidence');
  });

  it('keeps zero-paid and immutable-release constraints explicit', () => {
    expect(decision).toContain('no paid AI API');
    expect(decision).toContain('The published 0.1.0 release remains immutable.');
    expect(decision).toContain('Proceed to Phase 8.4A.');
  });
});
