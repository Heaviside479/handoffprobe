import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const workflow = readFileSync('.github/workflows/npm-stage.yml', 'utf8');
const disclosure = readFileSync('DISCLOSURE', 'utf8');
const record = readFileSync('docs/P11_2_NPM_STAGE_PUBLICATION_20260920.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('P11.2 npm stage-only publication', () => {
  it('uses a manual main-only OIDC staging workflow', () => {
    expect(workflow).toContain('workflow_dispatch:');
    expect(workflow).toContain('id-token: write');
    expect(workflow).toContain('contents: read');
    expect(workflow).toContain('test "$GITHUB_REF" = "refs/heads/main"');
    expect(workflow).toContain('npm install --global npm@11.19.1');
  });

  it('can stage but cannot directly publish or approve', () => {
    expect(workflow).toContain('npm stage publish --access public --tag "$REQUESTED_TAG"');
    expect(workflow).not.toMatch(/(^|\s)npm publish(\s|$)/mu);
    expect(workflow).not.toContain('npm stage approve');
    expect(workflow).not.toContain('npm stage reject');
    expect(workflow).not.toContain('NPM_TOKEN');
    expect(workflow).not.toContain('NODE_AUTH_TOKEN');
  });

  it('requires dual-use publication metadata and disclosure', () => {
    const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
      files?: string[];
      contentPolicy?: { class?: string };
    };

    expect(manifest.contentPolicy).toEqual({ class: 'dual-use' });
    expect(manifest.files).toContain('DISCLOSURE');
    expect(disclosure).toContain('HandoffProbe Dual-Use Disclosure');
    expect(disclosure).toContain('authorized to test');
  });

  it('does not change or authorize the current public version', () => {
    const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
      version?: string;
    };

    expect(manifest.version).toBe('0.4.0');
    expect(record).toContain('The public package remains `handoffprobe@0.4.0`.');
    expect(record).toContain('must not stage `0.4.0`');
  });

  it('records the completed npm trust and package-access gates', () => {
    expect(roadmap).toContain('### P11.2 — npm stage-only publication workflow');
    expect(roadmap).toContain('Status: **COMPLETE — 2026-09-20**');
    expect(roadmap).toContain(
      '- [x] configure npm trusted publishing for `npm-stage.yml` with stage-only permission;',
    );
    expect(roadmap).toContain(
      '- [x] read back and verify the exact npm trusted-publisher relationship;',
    );
    expect(roadmap).toContain(
      '- [x] require 2FA and disallow traditional publication tokens for the package.',
    );

    expect(record).toContain('## Completion evidence — 2026-09-20');
    expect(record).toContain('`d60bf3d79a83fb1f5fdcd7ec7b397c5ad613ef89`');
    expect(record).toContain('permission: `createStagedPackage`');
    expect(record).toContain('trust read-back exit code: `0`');
    expect(record).toContain('`npm stage list handoffprobe --json` returned `[]`');
    expect(record).toContain('public package version: `0.4.0`');
    expect(record).toContain('`latest` dist-tag: `0.4.0`');
    expect(record).toContain('`Require two-factor authentication and disallow tokens`');
  });
});
