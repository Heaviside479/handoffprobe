import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const plan = readFileSync('docs/REPOSITORY_CLEANUP_PLAN_20260918.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
const installation = readFileSync('docs/INSTALLATION.md', 'utf8');
const architecture = readFileSync('docs/ARCHITECTURE.md', 'utf8');
const product = readFileSync('docs/PRODUCT.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };

describe('Cleanup E final repository verification', () => {
  it('records the cleanup track as complete', () => {
    expect(plan).toContain(
      'Status: **COMPLETE — Cleanup A through Cleanup E completed by 2026-09-19.**',
    );
    expect(plan).toContain('Cleanup E is complete.');
    expect(plan).toContain(
      'The repository cleanup and current-state reconciliation track is complete.',
    );
    expect(roadmap).toContain(
      'Status: **COMPLETE — Cleanup A through Cleanup E completed 2026-09-19.**',
    );
  });

  it('reconciles Linux CI from repository evidence', () => {
    expect(roadmap).toContain('- [x] enforce Linux CI coverage;');
    expect(ci).toContain('- ubuntu-latest');
    expect(ci).toContain('runs-on: ${{ matrix.os }}');
    expect(ci).toContain('node-version: 24');
    expect(ci).toContain('run: npm run check');
    expect(ci).toContain('run: npm run package:check');
    expect(installation).toContain(
      'Linux is CI-verified on the GitHub-hosted Ubuntu workflow with Node 24',
    );
  });

  it('tracks completed P10.4 platform and drift-gate work', () => {
    expect(roadmap).toContain('- [x] add macOS CI coverage;');
    expect(roadmap).toContain(
      '- [x] add Windows CI where practical and explicitly document exclusions where not;',
    );
    expect(roadmap).toContain('- [x] define the dependency upgrade process;');
    expect(roadmap).toContain(
      '- [x] ensure compatibility-matrix checks fail visibly on unsupported drift.',
    );
  });

  it('keeps current public product truth unchanged', () => {
    expect(packageJson.version).toBe('0.4.0');
    expect(product).toContain('**23 stable attacks**');
    expect(architecture).toContain('report schema: `1`');
    expect(plan).toContain(
      'cleanup produced no evidence-backed reason for a new stable attack, version bump',
    );
  });

  it('returns continuity to Phase 10 reliability work', () => {
    expect(plan).toContain(
      'Cleanup is complete. Return to Phase 10 reliability work with P10.3 reproducible',
    );
    expect(roadmap).toContain('- [x] add reproducible performance benchmarks;');
  });
});
