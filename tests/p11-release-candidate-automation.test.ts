import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const workflow = readFileSync('.github/workflows/release-candidate.yml', 'utf8');
const record = readFileSync('docs/P11_1_RELEASE_CANDIDATE_AUTOMATION_20260920.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const index = readFileSync('docs/README.md', 'utf8');

describe('P11.1 release-candidate automation', () => {
  it('provides manual and pull-request candidate validation', () => {
    expect(workflow).toContain('name: Release Candidate');
    expect(workflow).toContain('workflow_dispatch:');
    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('name: Release Candidate');
  });

  it('uses the established pinned checkout and Node setup actions', () => {
    expect(workflow).toContain('actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd');
    expect(workflow).toContain('actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38');
    expect(workflow).toContain('node-version: 24');
  });

  it('builds and executes an actual package candidate', () => {
    expect(workflow).toContain('npm ci');
    expect(workflow).toContain('npm run check');
    expect(workflow).toContain(`PACKAGE_VERSION=$(node -p "require('./package.json').version")`);
    expect(workflow).toContain('npm pack --pack-destination');
    expect(workflow).toContain('sha256sum');
    expect(workflow).toContain('grep -Fx "package/DISCLOSURE"');
    expect(workflow).toContain('npm install --ignore-scripts');
    expect(workflow).toContain('handoffprobe test --target secure');
  });

  it('cannot publish or create release state', () => {
    expect(workflow).toContain('permissions:\n  contents: read');
    expect(workflow).not.toContain('contents: write');
    expect(workflow).not.toContain('id-token: write');
    expect(workflow).not.toContain('packages: write');
    expect(workflow).not.toContain('npm publish');
    expect(workflow).not.toContain('npm stage publish');
    expect(workflow).not.toContain('NPM_TOKEN');
    expect(workflow).not.toContain('NODE_AUTH_TOKEN');
    expect(workflow).not.toContain('gh release create');
  });

  it('records the candidate state without changing the public release', () => {
    expect(record).toContain('Status: **COMPLETE — 2026-09-20**');
    expect(record).toContain('Protected implementation PR #153 passed all six checks');
    expect(record).toContain('35501202431');
    expect(record).toContain('5b48eb953a3005b338208896a607fa7e7afb37a3');
    expect(record).toContain('The current public version remains `handoffprobe@0.4.0`.');
    expect(record).toContain('It is **not publication authorization**.');
    expect(roadmap).toContain('Status: **ACTIVE — release engineering started 2026-09-20.**');
    expect(roadmap).toContain('### P11.1 — non-publishing release-candidate automation');
    expect(roadmap).toContain('Status: **COMPLETE — 2026-09-20**');
    expect(roadmap).toContain(
      '- [x] pass the workflow on its protected implementation pull request;',
    );
    expect(roadmap).toContain('- [x] merge the workflow through normal branch protection;');
    expect(roadmap).toContain('- [x] verify the workflow from `main`.');
    expect(index).toContain(
      '[`P11_1_RELEASE_CANDIDATE_AUTOMATION_20260920.md`](P11_1_RELEASE_CANDIDATE_AUTOMATION_20260920.md)',
    );
  });
});
