import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const workflow = readFileSync('.github/workflows/release-candidate.yml', 'utf8');
const script = readFileSync('scripts/release-sbom.ts', 'utf8');
const record = readFileSync('docs/P11_4_RELEASE_SBOM_PROVENANCE_20260920.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');

describe('P11.4 release SBOM and provenance boundary', () => {
  it('pins the Release Candidate npm toolchain to the staging version', () => {
    expect(workflow).toContain('npm install --global npm@11.19.1');
    expect(workflow).toContain('test "$(npm --version)" = "11.19.1"');
  });

  it('generates real release SBOMs and compares deterministic projections', () => {
    expect(workflow).toContain('Generate and compare release SBOM');
    expect(workflow).toContain('./node_modules/.bin/tsx scripts/release-sbom.ts');
    expect(workflow).toContain('--comparison-output "$COMPARE_A"');
    expect(workflow).toContain('cmp -s "$COMPARE_A" "$COMPARE_B"');
    expect(workflow).toContain('Release SBOM SHA-256:');
    expect(workflow).toContain('Release SBOM dependency fingerprint SHA-256:');
    expect(workflow).toContain('Release SBOM dependency fingerprint reproducibility: PASS');
  });

  it('uses the runtime-only SPDX release boundary', () => {
    expect(script).toContain("'--package-lock-only'");
    expect(script).toContain("'--omit'");
    expect(script).toContain("'dev'");
    expect(script).toContain("'--sbom-format'");
    expect(script).toContain("'spdx'");
    expect(script).toContain("'--sbom-type'");
    expect(script).toContain("'library'");

    for (const required of [
      'handoffprobe',
      '@a2a-js/sdk',
      '@modelcontextprotocol/client',
      '@modelcontextprotocol/server',
      'express',
      'zod',
    ]) {
      expect(script).toContain(`'${required}'`);
    }

    for (const devOnly of ['eslint', 'prettier', 'tsx', 'typescript', 'vitest']) {
      expect(script).toContain(`'${devOnly}'`);
    }
  });

  it('preserves SPDX metadata and removes it only from comparison', () => {
    expect(script).toContain('structuredClone(document)');
    expect(script).toContain('delete comparisonDocument.documentNamespace');
    expect(script).toContain('delete comparisonCreationInfo.created');
    expect(script).toContain('stableObject(comparisonDocument)');
    expect(script).not.toContain('document.documentNamespace =');
    expect(script).not.toContain('.created = created');
  });

  it('retains only a real merged-main SPDX artifact', () => {
    expect(workflow).toContain('Upload merged-main release SBOM');
    expect(workflow).toContain(
      "if: ${{ github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/main' }}",
    );
    expect(workflow).not.toContain("if: ${{ github.event_name == 'workflow_dispatch' }}");
    expect(workflow).toContain('${{ runner.temp }}/handoffprobe-release-sbom/release-a.spdx.json');
    expect(workflow).toContain('retention-days: 7');
    expect(record).toContain('The comparison projection is not distributed as an SPDX document');
  });

  it('records the provenance boundary without claiming publication', () => {
    expect(record).toContain('raw SPDX outputs were not byte-identical');
    expect(record).toContain('`creationInfo`');
    expect(record).toContain('`documentNamespace`');
    expect(record).toContain('npm Trusted Publishing');
    expect(record).toContain('No package is staged or published by P11.4');
    expect(record).toContain('does not create a GitHub artifact attestation');
  });

  it('records protected completion gates as complete', () => {
    expect(roadmap).toContain('### P11.4 — release SBOM and provenance boundary');
    expect(roadmap).toContain('Status: **COMPLETE**');
    expect(roadmap).toContain(
      '- [x] pass the implementation through protected pull-request validation;',
    );
    expect(roadmap).toContain('- [x] merge the implementation through normal branch protection;');
    expect(roadmap).toContain(
      '- [x] verify release-SBOM generation and the deterministic dependency fingerprint from merged `main`.',
    );

    expect(record).toContain('Status: **COMPLETE**');
    expect(record).toContain('PR: `#164`');
    expect(record).toContain('`849824f8a2af0216d368a63a3592eea362724c11`');
    expect(record).toContain('`8cf9203638b56213494bfa0bee57f0e1b07cdffb`');
    expect(record).toContain('protected Release Candidate run: `35524723680`');
    expect(record).toContain('manual Release Candidate run: `35525048379`');
    expect(record).toContain('`ca05e02bbabe6344adf10184feea591c6d571f6cbf708e49d43604308d6127b9`');
    expect(record).toContain('`b095d287e0559f5e50a3f73fb70c673346827855ba1e2a6306bceab51eefb6f9`');
    expect(record).toContain('artifact ID: `10609950031`');

    expect(docsIndex).toContain('P11_4_RELEASE_SBOM_PROVENANCE_20260920.md');
  });
});
