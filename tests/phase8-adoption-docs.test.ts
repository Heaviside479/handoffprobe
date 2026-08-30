import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const specification = readFileSync('docs/PHASE8_ADOPTION_RESEARCH_SPECIFICATION.md', 'utf8');

describe('Phase 8 adoption and research contract', () => {
  it('records the immutable public v0.1.0 baseline without inventing npm downloads', () => {
    expect(specification).toContain('Baseline date: 2026-08-29');
    expect(specification).toContain('stars: 0');
    expect(specification).toContain('clones: 87 total');
    expect(specification).toContain('unique cloners: 55');
    expect(specification).toContain('release asset downloads: 3');
    expect(specification).toContain(
      'the unavailable npm download counters are recorded as unavailable, not as zero',
    );
    expect(specification).toContain('2aa56211d7559cac2cf2052275af45331fba6663');
  });

  it('keeps Phase 8 evidence-driven and telemetry-free', () => {
    expect(specification).toContain(
      'HandoffProbe must not add hidden usage telemetry merely to improve these metrics.',
    );
    expect(specification).toContain(
      'Implement an adapter only if 8.3A establishes a clear winner.',
    );
    expect(specification).toContain(
      'If no candidate meets the evidence gate, do not build an adapter merely to satisfy the roadmap.',
    );
    expect(specification).toContain('SaaS dashboard');
    expect(specification).toContain('paid LLM APIs');
  });

  it('tracks completed Phase 8 work and keeps the evidence-driven contract', () => {
    expect(roadmap).toContain(
      'Implementation contract: `docs/PHASE8_ADOPTION_RESEARCH_SPECIFICATION.md`',
    );
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
    expect(roadmap).toContain('- [x] 8.0B — freeze adoption and research operating contract');
    expect(roadmap).toContain('no hidden usage telemetry');
    expect(roadmap).toContain('no republishing changed contents as `handoffprobe@0.1.0`');
  });
});
