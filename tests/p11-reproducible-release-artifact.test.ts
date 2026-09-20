import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const workflow = readFileSync('.github/workflows/release-candidate.yml', 'utf8');
const record = readFileSync('docs/P11_3_REPRODUCIBLE_RELEASE_ARTIFACT_20260920.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');

describe('P11.3 reproducible release artifact validation', () => {
  it('creates two isolated rebuilds from the exact workflow commit', () => {
    expect(workflow).toContain('Verify release artifact reproducibility');
    expect(workflow).toContain('git archive "$GITHUB_SHA" > "$SOURCE_TAR"');
    expect(workflow).toContain('cd "$BUILD_A"');
    expect(workflow).toContain('cd "$BUILD_B"');
    expect(workflow).toContain('npm pack --pack-destination "$OUT_A"');
    expect(workflow).toContain('npm pack --pack-destination "$OUT_B"');
  });

  it('requires matching SHA-256 and byte-identical tarballs', () => {
    expect(workflow).toContain('test "$SHA_A" = "$SHA_B"');
    expect(workflow).toContain('test "$RC_SHA" = "$SHA_A"');
    expect(workflow).toContain('cmp -s "$REPRO_A" "$REPRO_B"');
    expect(workflow).toContain('cmp -s "$TARBALL" "$REPRO_A"');
    expect(workflow).toContain('cmp -s "$MANIFEST_A" "$MANIFEST_B"');
    expect(workflow).toContain('Release artifact reproducibility: PASS');
  });

  it('records the successful local feasibility probe without overclaiming', () => {
    expect(record).toContain('a92c3debd5696e0189326384da95bb40cd1827beb6a633c9168292eb4440c013');
    expect(record).toContain('byte identity: `yes`');
    expect(record).toContain('manifest identity: `yes`');
    expect(record).toContain(
      'It does not claim:\n\n- byte identity across different operating systems;',
    );
  });

  it('records the completed protected P11.3 admission gates', () => {
    expect(roadmap).toContain('### P11.3 — reproducible release artifact validation');
    expect(roadmap).toContain('Status: **COMPLETE — 2026-09-20**');
    expect(roadmap).toContain(
      '- [x] pass the implementation through protected pull-request validation;',
    );
    expect(roadmap).toContain('- [x] merge the implementation through normal branch protection;');
    expect(roadmap).toContain('- [x] verify the reproducibility gate from merged `main`.');
    expect(record).toContain('## Completion evidence — 2026-09-20');
    expect(record).toContain('workflow run: `35520070640`');
    expect(record).toContain('job: `106102510361`');
    expect(record).toContain('`a50938eec77108fa4d2640109cc069c19001bc28`');
    expect(record).toContain('`a92c3debd5696e0189326384da95bb40cd1827beb6a633c9168292eb4440c013`');
    expect(record).toContain('`Release artifact reproducibility: PASS`');
  });

  it('indexes the P11.3 evidence record', () => {
    expect(docsIndex).toContain('P11_3_REPRODUCIBLE_RELEASE_ARTIFACT_20260920.md');
  });
});
