import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const releaseSha = '90fdd691b390c420e3288383ad7efa7e0fb69e6f';
const readme = readFileSync('README.md', 'utf8');
const installation = readFileSync('docs/INSTALLATION.md', 'utf8');
const usage = readFileSync('docs/USAGE.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const audit = readFileSync('docs/PHASE8_GITHUB_ACTION_AUDIT_20260830.md', 'utf8');

describe('Phase 8.2 external GitHub Action onboarding contract', () => {
  it('makes the v0.1.0 immutable action pin directly copy-pasteable', () => {
    for (const document of [readme, installation, usage]) {
      expect(document).toContain(`Heaviside479/handoffprobe@${releaseSha}`);
      expect(document).not.toContain('<pinned-handoffprobe-commit-sha>');
      expect(document).not.toContain('<reviewed-commit-sha>');
    }
  });

  it('records the real separate-repository action evidence without calling it adoption', () => {
    expect(audit).toContain('Heaviside479/handoffprobe-action-audit-20260830-134434');
    expect(audit).toContain('33309692665');
    expect(audit).toContain('9731591362');
    expect(audit).toContain('PASS: 22');
    expect(audit).toContain('FAIL: 0');
    expect(audit).toContain('ERROR: 0');
    expect(audit).toContain('report schema version: `"1"` as the canonical string type');
    expect(audit).toContain('This was a maintainer-created synthetic onboarding audit.');
    expect(audit).toContain('Its existence must not be counted as independent adoption.');
  });

  it('records only the demonstrated correction and keeps source-backed overhead observational', () => {
    expect(audit).toContain('Medium — F8-CI-001');
    expect(audit).toContain('total placeholder occurrences: 4');
    expect(audit).toContain('release SHA occurrences across those three public documents: 0');
    expect(audit).toContain('O8-CI-002 — source-backed install/build overhead');
    expect(audit).toContain('This is an observation, not a demonstrated onboarding failure.');
    expect(audit).toContain(
      'No `action.yml`, scanner behavior, attack behavior, protocol baseline, report schema or already published `handoffprobe@0.1.0` artifact is changed',
    );
  });

  it('keeps completed action onboarding while Phase 8 advances', () => {
    expect(roadmap).toContain('- [x] 8.2A — audit GitHub Action onboarding and CI adoption path');
    expect(roadmap).toContain(
      '- [x] 8.2B — improve telemetry-free public or opt-in adoption signals',
    );
    expect(roadmap).toContain('- [x] 8.3A — research and rank adapter demand using real evidence');
  });
});
