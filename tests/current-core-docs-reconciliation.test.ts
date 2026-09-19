import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const context = readFileSync('PROJECT_CONTEXT.md', 'utf8');
const agents = readFileSync('AGENTS.md', 'utf8');
const contributing = readFileSync('CONTRIBUTING.md', 'utf8');
const security = readFileSync('SECURITY.md', 'utf8');
const plan = readFileSync('docs/REPOSITORY_CLEANUP_PLAN_20260918.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('Cleanup B.2 current core documentation', () => {
  it('keeps current public product truth in the canonical context', () => {
    expect(context).toContain('Current verified release: `handoffprobe@0.4.0`');
    expect(context).toContain('Stable public corpus: **23 attacks**');
    expect(context).toContain('12 P0 + 10 P1 + 1 advanced (`HP-AUTH-006`)');
    expect(context).toContain('Public npm package / CLI: `handoffprobe`');
    expect(context).not.toContain('Planned npm package / CLI');
  });

  it('keeps coding-agent instructions aligned with the current repository', () => {
    expect(agents).toContain('verified public release: `handoffprobe@0.4.0`');
    expect(agents).toContain('stable public corpus: **23 attacks**');
    expect(agents).toContain('`npm run check`');
    expect(agents).toContain('`npm run package:check`');
    expect(agents).not.toContain('v0.1 supports A2A -> MCP only');
    expect(agents).not.toContain('during the core CLI phase');
  });

  it('keeps contributor guidance on the current public release', () => {
    expect(contributing).toContain('current verified public release is `handoffprobe@0.4.0`');
    expect(contributing).toContain('23 stable attacks');
    expect(contributing).toContain('Adapter and integration demand');
    expect(contributing).toContain(
      '[Phase-8.5A-Contributor-Quickstart](docs/PHASE8_CONTRIBUTOR_LOOP_20260831.md)',
    );
    expect(contributing).not.toContain('v0.3.0 release product scope remains deliberately narrow');
  });

  it('keeps the security policy on the current release safety boundary', () => {
    expect(security).toContain('current HandoffProbe v0.4.0 release safety boundary');
    expect(security).toContain('explicit authorization');
    expect(security).toContain('does not make a blanket authorization to scan arbitrary');
    expect(security).not.toContain('HandoffProbe v0.3.0 release safety boundary');
  });

  it('preserves the completed B.2 record after Cleanup B closes', () => {
    expect(plan).toContain('## Cleanup B.2 — current core instruction documents');
    expect(plan).toContain('B.2 updates current-facing release/corpus/product truth');
    expect(plan).toContain('Cleanup B is now complete.');
    expect(roadmap).toContain('Cleanup A through Cleanup E completed 2026-09-19.');
  });
});
