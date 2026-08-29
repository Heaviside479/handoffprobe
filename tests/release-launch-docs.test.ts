import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const read = (path: string): Promise<string> => readFile(path, 'utf8');

describe('v0.1 research and launch documentation', () => {
  it('locks the research framing and sources', async () => {
    const article = await read('docs/RESEARCH_ARTICLE.md');

    for (const text of [
      'A2A 1.0 -> MCP 2026-07-28',
      'Conformance is not the same as composition safety',
      '`composition_responsibility`',
      'HP-AUTH-001 — Delegated authority amplification',
      'This is a composition failure demonstration',
      'AgentRFC',
      'AgentThread',
      'https://a2a-protocol.org/latest/specification/',
      'https://blog.modelcontextprotocol.io/posts/2026-07-28/',
      'https://arxiv.org/abs/2603.23801',
      'https://arxiv.org/abs/2606.28690',
      'does not replace the formal Phase 7.2A upstream drift review',
    ]) {
      expect(article).toContain(text);
    }
  });

  it('keeps launch examples honest before publication', async () => {
    const launch = await read('docs/LAUNCH_EXAMPLES.md');

    for (const text of [
      'The npm package is **not publicly released yet**.',
      'npx --yes --package=handoffprobe@0.1.0 handoffprobe --version',
      'npx --yes --package=handoffprobe@0.1.0 handoffprobe test',
      'handoffprobe test --target vulnerable --test HP-AUTH-001',
      'HandoffProbe 0.1.0',
      '22 stable attacks total',
      'report schema is version `1`',
      'immutable commit-SHA pinning',
      'Do not use `pull_request_target`',
      'explicit authorization',
    ]) {
      expect(launch).toContain(text);
    }
  });

  it('tracks remaining release gates', async () => {
    const checklist = await read('docs/RELEASE_CHECKLIST.md');

    for (const text of [
      'Status: in progress',
      'Target release: `handoffprobe@0.1.0` / `v0.1.0`',
      'stable corpus: exactly 22 attacks',
      '## 7.2A Upstream drift review',
      '## 7.2B Local release-candidate gate',
      '## 7.2C Protected remote PR gate and merge',
      '## 7.3B npm publication',
      '## 7.4A Git tag and GitHub release',
      '## 7.5A Public verification and completion',
      'tarball filename: `TBD`',
      'local SHA-256: `TBD`',
      'do not paste OTP, password or token into logs/chat',
      'Stop the release immediately if:',
    ]) {
      expect(checklist).toContain(text);
    }

    expect(checklist).not.toContain('- [x] npm package publicly published');
    expect(checklist).not.toContain('- [x] GitHub release `v0.1.0` created');
  });

  it('links launch docs from README without a public-release claim', async () => {
    const readme = await read('README.md');

    for (const text of [
      'docs/RESEARCH_ARTICLE.md',
      'docs/LAUNCH_EXAMPLES.md',
      'docs/RELEASE_CHECKLIST.md',
      'The npm package is **not publicly released yet**.',
    ]) {
      expect(readme).toContain(text);
    }
  });
});
