import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

interface PackageManifest {
  dependencies?: Record<string, string>;
}

interface PackageLock {
  packages?: Record<
    string,
    {
      version?: string;
    }
  >;
}

const read = (path: string): Promise<string> => readFile(path, 'utf8');

describe('v0.1 upstream drift review', () => {
  it('pins the reviewed protocol SDK versions', async () => {
    const manifest = JSON.parse(await read('package.json')) as PackageManifest;
    const lock = JSON.parse(await read('package-lock.json')) as PackageLock;

    expect(manifest.dependencies?.['@a2a-js/sdk']).toBe('1.1.0');
    expect(manifest.dependencies?.['@modelcontextprotocol/client']).toBe('2.0.0');
    expect(manifest.dependencies?.['@modelcontextprotocol/server']).toBe('2.0.0');

    expect(lock.packages?.['node_modules/@a2a-js/sdk']?.version).toBe('1.1.0');
    expect(lock.packages?.['node_modules/@modelcontextprotocol/client']?.version).toBe('2.0.0');
    expect(lock.packages?.['node_modules/@modelcontextprotocol/server']?.version).toBe('2.0.0');
  });

  it('records the formal 2026-08-29 protocol and SDK review', async () => {
    const baseline = await read('docs/RESEARCH_BASELINE.md');

    for (const text of [
      'As of: 2026-08-29',
      'Latest released specification: **1.0.0**',
      'Official JavaScript/TypeScript SDK: **@a2a-js/sdk 1.1.0**',
      'MCP TypeScript client/server SDK: **2.0.0**',
      '## v0.1 release drift review — 2026-08-29',
      '**A2A specification: no-impact**',
      '**A2A JavaScript SDK: test-impact, resolved**',
      '**MCP released specification: no-impact**',
      '**MCP roadmap: documentation-only**',
      '**MCP TypeScript SDK: no-impact**',
      '**AgentRFC / AgentThread: no-impact**',
      '**Release-blocking drift: none found.**',
    ]) {
      expect(baseline).toContain(text);
    }
  });

  it('keeps the completed 7.2A evidence after public release', async () => {
    const checklist = await read('docs/RELEASE_CHECKLIST.md');

    for (const text of [
      '- [x] verify latest released A2A version and security-relevant changes',
      '- [x] verify relevant A2A SDK/reference state',
      '- [x] verify MCP 2026-07-28 remains the intended released baseline',
      '- [x] review MCP changes/roadmap after 2026-07-28',
      '- [x] verify relevant Tier 1 MCP SDK state',
      '- [x] review AgentRFC and AgentThread source versions',
      '- [x] classify drift as no-impact, documentation-only, test-impact or release-blocking',
      '- [x] record URLs, dates and conclusions',
      '- [x] update `docs/RESEARCH_BASELINE.md` if need',
      '7.2A conclusion: no release-blocking upstream drift.',
      'A2A SDK drift: test-impact resolved by 1.0.1 -> 1.1.0 upgrade and full regression.',
    ]) {
      expect(checklist).toContain(text);
    }

    expect(checklist).toContain('- [x] npm package publicly published');
    expect(checklist).toContain('- [x] GitHub release `v0.1.0` created');
  });
});
