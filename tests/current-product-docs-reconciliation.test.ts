import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const architecture = readFileSync('docs/ARCHITECTURE.md', 'utf8');
const product = readFileSync('docs/PRODUCT.md', 'utf8');
const commercial = readFileSync('docs/ROADMAP_COMMERCIAL_PRODUCT_TRACK_20260916.md', 'utf8');
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const plan = readFileSync('docs/REPOSITORY_CLEANUP_PLAN_20260918.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('Cleanup B.3 current product documentation', () => {
  it('describes current architecture', () => {
    expect(architecture).toContain('# HandoffProbe Architecture');
    expect(architecture).toContain('Current verified public release: `handoffprobe@0.4.0`');
    expect(architecture).toContain('23 attacks');
    expect(architecture).toContain('report schema: `1`');
    expect(architecture).not.toContain('# Planned Architecture');
    expect(architecture).not.toContain('v0.1 targets:');
    expect(architecture).not.toContain('## Proposed high-level modules');
  });

  it('describes the current public product', () => {
    expect(product).toContain('Current verified public release: `handoffprobe@0.4.0`');
    expect(product).toContain('**23 stable attacks**');
    expect(product).toContain('`HP-AUTH-006`');
    expect(product).toContain('reusable source-backed GitHub Action');
    expect(product).toContain('Teams/Cloud remains demand-gated');
    expect(product).not.toContain('## v0.1 problem');
    expect(product).not.toContain('## v0.1 user experience');
    expect(product).not.toContain('## v0.1 must-have capabilities');
  });

  it('reconciles the commercial track', () => {
    expect(commercial).toContain(
      'Status: **ACTIVE — C-1 / Phase 13; C-2 through C-5 remain demand-gated**',
    );
    expect(commercial).toContain(
      'current verified public product is `handoffprobe@0.4.0` with 23 stable attacks',
    );
    expect(commercial).toContain('T-3 and T-4 are now complete');
    expect(commercial).toContain('CV-6 remains the primary commercial proof target');
    expect(commercial).not.toContain('currently active T-3 work, the queued T-4 work');
    expect(commercial).not.toContain('The stable public corpus remains 22 attacks');
  });

  it('keeps shipped foundation work out of Unreleased', () => {
    const unreleased = changelog.split('## 0.4.0 — 2026-09-16')[0];

    expect(unreleased).toContain('## Unreleased');
    expect(unreleased).toContain('No new public package release is currently authorized.');
    expect(unreleased).not.toContain('reusable core security engine with attack registry');

    expect(changelog).toContain('## 0.4.0 — 2026-09-16');
    expect(changelog).toContain('## 0.3.0 — 2026-09-14');
    expect(changelog).toContain('## 0.2.0 — 2026-09-09');
    expect(changelog).toContain('## 0.1.1 — 2026-09-08');
  });

  it('records Cleanup B completion', () => {
    expect(plan).toContain(
      'Status: **COMPLETE — Cleanup A through Cleanup E completed by 2026-09-19.**',
    );
    expect(plan).toContain(
      '## Cleanup B.3 — architecture, product, commercial track and changelog',
    );
    expect(plan).toContain('Cleanup B is now complete.');
    expect(roadmap).toContain(
      'Status: **COMPLETE — Cleanup A through Cleanup E completed 2026-09-19.**',
    );
  });
});
