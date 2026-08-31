import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const spec = readFileSync('docs/PHASE9_CROSSING_CORPUS_INTEGRATION_SPEC_20260831.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('Phase 9.1A crossing-corpus integration contract', () => {
  it('pins the selected external corpus and protocol tuple', () => {
    expect(spec).toContain('09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a');
    expect(spec).toContain('f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb');
    expect(spec).toContain('A2A Protocol 1.0');
    expect(spec).toContain('MCP Protocol 2026-07-28');
    expect(spec).toContain('28 data-driven external case identities');
  });

  it('records the current protocol-lab gaps without treating them as findings', () => {
    expect(spec).toContain('UserBuilder.noAuthentication');
    expect(spec).toContain('empty `taskId`');
    expect(spec).toContain('request `contextId` itself');
    expect(spec).toContain('These are integration gaps, not vulnerability findings.');
  });

  it('requires an offline immutable corpus loader before execution work', () => {
    expect(spec).toContain('offline pinned-corpus loader');
    expect(spec).toContain('verify the pinned SHA-256 before execution');
    expect(spec).toContain('must not require network access');
    expect(spec).toContain('perform no implicit download during a test run');
  });

  it('preserves external case identity instead of inventing attack IDs', () => {
    expect(spec).toContain('must not rename them into existing HandoffProbe attack IDs');
    expect(spec).toContain('without remapping them to attack IDs');
  });

  it('requires independent effect observation and explicit provenance', () => {
    expect(spec).toContain('effect recorder is outside the verifier');
    expect(spec).toContain('before/after effect count');
    expect(spec).toContain('transport-authenticated A2A caller source');
    expect(spec).toContain('exact MCP audience');
  });

  it('keeps the work local, authorized, deterministic and no-paid', () => {
    expect(spec).toContain(
      'All Phase 9 work remains local, synthetic, public, or explicitly authorized.',
    );
    expect(spec).toContain('paid model API');
    expect(spec).toContain('hidden telemetry');
  });

  it('locks 9.1A and leaves the runtime packages open in the roadmap', () => {
    expect(roadmap).toContain('- [x] 9.1A — lock the crossing-corpus integration contract');
    expect(roadmap).toContain(
      '- [x] 9.1B — implement the offline pinned-corpus loader and digest verification',
    );
    expect(roadmap).toContain(
      '- [x] 9.1C — map external crossing fields and provenance into HandoffProbe-owned observations',
    );
    expect(roadmap).toContain(
      '- [ ] 9.1D — add an external effect recorder and execute the complete 28-case corpus',
    );
  });
});
