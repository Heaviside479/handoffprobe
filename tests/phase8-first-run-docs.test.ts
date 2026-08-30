import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readme = readFileSync('README.md', 'utf8');
const installation = readFileSync('docs/INSTALLATION.md', 'utf8');
const usage = readFileSync('docs/USAGE.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const audit = readFileSync('docs/PHASE8_FIRST_RUN_AUDIT_20260830.md', 'utf8');

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

describe('Phase 8.1 first-run friction regression', () => {
  it('keeps exact project installation deterministic', () => {
    const exactInstall = 'npm install --save-dev --save-exact handoffprobe@0.1.0';

    expect(installation.split(exactInstall).length - 1).toBe(2);
    expect(installation).not.toContain('npm install --save-dev handoffprobe@0.1.0');
  });

  it('does not regress to pre-release public documentation', () => {
    const publicDocs = normalizeWhitespace([readme, installation, usage].join('\n'));

    expect(publicDocs).not.toContain('Before the npm package is publicly released');
    expect(publicDocs).not.toContain('After `v0.1.0` is released');
    expect(publicDocs).not.toContain('until a versioned public release exists');
  });

  it('records the measured first-run evidence without inventing blockers', () => {
    expect(audit).toContain('cold version check completed in 13 seconds');
    expect(audit).toContain(
      'automated time from the cold version-check start through first successful secure scan was 23 seconds',
    );
    expect(audit).toContain('npm saved the dependency as `"handoffprobe": "^0.1.0"`');
    expect(audit).toContain('### High\n\nNone.');
    expect(audit).toContain(
      'No CLI behavior, attack behavior, protocol baseline, report schema or published `handoffprobe@0.1.0` artifact is changed',
    );
  });

  it('keeps completed first-run work while Phase 8 advances', () => {
    expect(roadmap).toContain(
      '- [x] 8.1A — audit first-run friction from a clean external-user perspective',
    );
    expect(roadmap).toContain(
      '- [x] 8.1B — fix the highest measurable first-run friction with regression coverage',
    );
    expect(roadmap).toContain('- [x] 8.2A — audit GitHub Action onboarding and CI adoption path');
    expect(roadmap).toContain(
      '- [x] 8.2B — improve telemetry-free public or opt-in adoption signals',
    );
    expect(roadmap).toContain('- [x] 8.3A — research and rank adapter demand using real evidence');
  });
});
