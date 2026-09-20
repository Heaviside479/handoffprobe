import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const closeout = readFileSync('docs/P10_5_RELIABILITY_CLOSEOUT_20260920.md', 'utf8');
const index = readFileSync('docs/README.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };

describe('P10.5 reliability closeout', () => {
  it('records all P10.5 work as complete', () => {
    expect(roadmap).toContain('### P10.5 — reliability closeout');
    expect(roadmap).toContain('Status: **COMPLETE — 2026-09-20**');
    expect(roadmap).toContain('- [x] run the complete repository quality and security gates;');
    expect(roadmap).toContain('- [x] run package validation and exact payload inspection;');
    expect(roadmap).toContain(
      '- [x] verify compatibility and fixture matrices against recorded evidence;',
    );
    expect(roadmap).toContain(
      '- [x] reconcile README, installation, usage, security and contributor documentation;',
    );
    expect(roadmap).toContain(
      '- [x] decide from completed scope whether a public patch/minor release is justified;',
    );
    expect(roadmap).toContain(
      '- [x] create a separate controlled release track if publication is justified.',
    );
  });

  it('records the no-release decision without changing current product truth', () => {
    expect(packageJson.version).toBe('0.4.0');
    expect(closeout).toContain('Decision: **NO PUBLIC RELEASE JUSTIFIED**');
    expect(closeout).toContain('Current public release remains `handoffprobe@0.4.0`.');
    expect(closeout).toContain('Stable public corpus remains **23 attacks**.');
    expect(closeout).toContain('A2A 1.0 → MCP 2026-07-28');
    expect(closeout).toContain('No separate release track is created.');
  });

  it('records the compatibility classification of the only runtime source change', () => {
    expect(closeout).toContain('`src/cli/diagnostics.ts`');
    expect(closeout).toContain('existing human-readable stderr messages remain unchanged');
    expect(closeout).toContain('report schema `1`');
    expect(closeout).toContain('config schema `1`');
  });

  it('records the Phase 10 exit gate as satisfied', () => {
    expect(roadmap).toContain('Status: **COMPLETE — reliability hardening closed 2026-09-20.**');
    expect(roadmap).toContain('Phase 10 exit gate satisfied 2026-09-20');
  });

  it('indexes the closeout record', () => {
    expect(index).toContain(
      '[`P10_5_RELIABILITY_CLOSEOUT_20260920.md`](P10_5_RELIABILITY_CLOSEOUT_20260920.md)',
    );
  });
});
