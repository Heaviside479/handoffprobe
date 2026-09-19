import { readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const index = readFileSync('docs/README.md', 'utf8');
const rootReadme = readFileSync('README.md', 'utf8');
const plan = readFileSync('docs/REPOSITORY_CLEANUP_PLAN_20260918.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

const docsFiles = readdirSync('docs')
  .filter((name) => name !== 'README.md')
  .sort();

describe('Cleanup C documentation navigation', () => {
  it('provides the required navigation groups', () => {
    expect(index).toContain('# HandoffProbe documentation index');
    expect(index).toContain('## Current product documentation');
    expect(index).toContain('## Current roadmap / active planning');
    expect(index).toContain('## Research / evidence records');
    expect(index).toContain('## Historical release records');
    expect(index).toContain('## Supporting reference');
  });

  it('links every existing top-level docs file', () => {
    for (const name of docsFiles) {
      expect(index, `missing docs index entry for ${name}`).toContain(`](${name})`);
    }
  });

  it('is discoverable from the root README', () => {
    expect(rootReadme).toContain('[full documentation index](docs/README.md)');
  });

  it('records Cleanup C completion and Cleanup D as next', () => {
    expect(plan).toContain('Status: **COMPLETE — 2026-09-19**');
    expect(plan).toContain('Cleanup C is complete.');
    expect(plan).toContain(
      'Continue with Cleanup D by auditing the 16 preserved divergent branches',
    );
    expect(roadmap).toContain(
      'Cleanup C complete; Cleanup D issue and branch reconciliation next.',
    );
  });

  it('keeps cleanup non-product-expanding', () => {
    expect(plan).toContain(
      'did not change runtime behavior, stable attack identity, package version',
    );
    expect(index).toContain('Documentation cleanup alone does not authorize a release');
  });
});
