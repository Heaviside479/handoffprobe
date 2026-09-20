import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

const roadmap = read('docs/ROADMAP.md');
const docsIndex = read('docs/README.md');
const record = read('docs/P11_6_EXTERNAL_FEEDBACK_ROUND_20260920.md');
const packageJson = JSON.parse(read('package.json')) as { version: string };

describe('P11.6 external feedback round', () => {
  it('records the public feedback round without claiming completion early', () => {
    expect(roadmap).toContain('### P11.6 — external feedback round');
    expect(roadmap).toContain('Status: **ACTIVE — fresh external feedback pending**');
    expect(roadmap).toContain('GitHub issue #168');
    expect(roadmap).toContain(
      '- [ ] receive and triage fresh external feedback, or close a clearly bounded',
    );
    expect(record).toContain('Status: **ACTIVE — fresh external feedback pending**');
    expect(record).toContain('`PENDING`');
  });

  it('keeps historical review separate from fresh Phase 11 feedback', () => {
    expect(record).toContain('Earlier independent review remains valid historical');
    expect(record).toContain(
      'The earlier Phase 9 confirmation is not counted as a P11.6 response.',
    );
    expect(record).toContain('Silence is not validation');
  });

  it('records the current safe public test path and release facts', () => {
    expect(record).toContain(
      'npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe --version',
    );
    expect(record).toContain('npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe test');
    expect(record).toContain('23 PASS, 0 FAIL, 0 ERROR');
    expect(packageJson.version).toBe('0.4.0');
  });

  it('defines evidence-based feedback classification', () => {
    expect(record).toContain('documentation or onboarding defect');
    expect(record).toContain('CLI or runtime defect');
    expect(record).toContain('CI / GitHub Action integration defect');
    expect(record).toContain('release-engineering or supply-chain concern');
    expect(record).toContain('Any claimed defect must be reproduced or otherwise evidenced');
  });

  it('keeps a no-response outcome distinct from external validation', () => {
    expect(record).toContain('A no-response outcome may close the round');
    expect(record).toContain('`NO RESPONSE`');
    expect(record).toContain('be presented as validation, approval or successful external testing');
  });

  it('keeps the release boundary unchanged', () => {
    expect(record).toContain('package-version changes');
    expect(record).toContain('npm staging or publication');
    expect(record).toContain('Git tag creation or movement');
    expect(record).toContain('GitHub Release creation');
    expect(record).toContain('stable-attack admission');
    expect(record).toContain('The public package remains `handoffprobe@0.4.0`.');
  });

  it('indexes the P11.6 evidence record', () => {
    expect(docsIndex).toContain(
      '[`P11_6_EXTERNAL_FEEDBACK_ROUND_20260920.md`](P11_6_EXTERNAL_FEEDBACK_ROUND_20260920.md)',
    );
  });
});
