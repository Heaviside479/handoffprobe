import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const research = readFileSync('docs/PHASE8_ADAPTER_DEMAND_RESEARCH_20260830.md', 'utf8');

describe('Phase 8.3A adapter demand research contract', () => {
  it('ranks Google ADK first from real A2A-to-MCP evidence', () => {
    expect(research).toContain('| 1 | Google ADK A2A agent with MCP toolset |');
    expect(research).toContain('`google/adk-python#5729`');
    expect(research).toContain('production measurements');
    expect(research).toContain('A2A manager → A2A sub-agent → MCP tool path');
    expect(research).toContain('Google ADK is the first-ranked candidate for an admission probe.');
  });

  it('does not invent direct HandoffProbe demand or admit an adapter from popularity', () => {
    expect(research).toContain('no direct HandoffProbe-user adapter request is claimed');
    expect(research).toContain('maintainer-created synthetic audit repositories remain excluded');
    expect(research).toContain(
      'framework popularity is not a substitute for a handoff-specific invariant',
    );
    expect(research).toContain('This is not yet authorization to implement an ADK adapter.');
  });

  it('keeps the first adapter behind deterministic no-paid and version gates', () => {
    expect(research).toContain('`BaseLlm` is a public abstraction that can be subclassed');
    expect(research).toContain('deterministic `MockModel(BaseLlm)`');
    expect(research).toContain('a local MCP server/tool fixture');
    expect(research).toContain('a deterministic model substitute with no paid model API');
    expect(research).toContain('If that probe fails, do not force an ADK adapter.');
  });

  it('closes 8.3A and records the completed evidence gate', () => {
    expect(roadmap).toContain('- [x] 8.3A — research and rank adapter demand using real evidence');
    expect(roadmap).toContain(
      '- [x] 8.3B — implement the first adapter only if the evidence gate is met',
    );
  });
});
