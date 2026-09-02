import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const spec = readFileSync('docs/PHASE9_CROSSING_CORPUS_INTEGRATION_SPEC_20260831.md', 'utf8');

const completion = readFileSync('docs/PHASE9_CROSSING_CORPUS_EXECUTION_20260901.md', 'utf8');

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('Phase 9 crossing-corpus documentation', () => {
  it('pins the selected external corpus and protocol tuple', () => {
    expect(spec).toContain('09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a');
    expect(spec).toContain('f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb');
    expect(spec).toContain('A2A Protocol 1.0');
    expect(spec).toContain('MCP Protocol 2026-07-28');
    expect(spec).toContain('28 data-driven external case identities');
  });

  it('preserves the contract-lock gaps as historical context', () => {
    expect(spec).toContain('Baseline HandoffProbe gaps at contract lock');
    expect(spec).toContain('UserBuilder.noAuthentication');
    expect(spec).toContain('empty `taskId`');
    expect(spec).toContain('request `contextId` itself');
    expect(spec).toContain('These were integration gaps, not vulnerability findings.');
    expect(spec).toContain('PHASE9_CROSSING_CORPUS_EXECUTION_20260901.md');
  });

  it('retains the immutable offline corpus contract', () => {
    expect(spec).toContain('offline pinned-corpus loader');
    expect(spec).toContain('verify the pinned SHA-256 before execution');
    expect(spec).toContain('must not require network access');
    expect(spec).toContain('perform no implicit download during a test run');
    expect(spec).toContain('must not rename them into existing HandoffProbe attack IDs');
  });

  it('retains the runtime provenance and effect-observation contract', () => {
    expect(spec).toContain('effect recorder is outside the verifier');
    expect(spec).toContain('before/after effect count');
    expect(spec).toContain('transport-authenticated A2A caller source');
    expect(spec).toContain('exact MCP audience');
    expect(spec).toContain('Reference-fixture rows cannot be copied into HandoffProbe output');
  });

  it('records 9.1D, 9.1E, and externally confirmed 9.1F completion', () => {
    expect(roadmap).toContain(
      '- [x] 9.1D — add an external effect recorder and execute the complete 28-case corpus',
    );
    expect(roadmap).toContain(
      '- [x] 9.1E — produce and validate reviewable external submission artifacts',
    );
    expect(roadmap).toContain(
      '- [x] 9.1F — publish the evidence outcome, update Issue #20 and review broader adapter demand',
    );
    expect(roadmap).toContain('Phase 9.1D / 9.1E completion record — 2026-09-01');
    expect(roadmap).toContain('Phase 9.1F completion record — 2026-09-02');
    expect(completion).toContain('Phase 9.1F external review completion — 2026-09-02');
    expect(completion).toContain('eba15db3510ef9e5769bf7e81479422c2dc44103');
    expect(completion).toContain('284a8af66b6dc5923e8e3e48b45558832fe794ec');
    expect(completion).toContain('5516189138');
    expect(completion).toContain('`implementation_independent`');
    expect(completion).toContain('`green_eligible: true`');
    expect(completion).toContain('`initial_issuer_authentication_failed`');
  });

  it('records the full HandoffProbe-owned execution', () => {
    expect(completion).toContain('28 result rows in exact frozen order');
    expect(completion).toContain('58 total attempt-level evidence records');
    expect(completion).toContain('26 discriminating cases');
    expect(completion).toContain('externally observed native attempts');
    expect(completion).toContain('externally observed bound attempts');
  });

  it('records the exact archived submission checkpoints', () => {
    expect(completion).toContain('931a0868e4effcb0768169880656b870173f2ffb');
    expect(completion).toContain('0ccf24e6387812b324148d03f4bef15a66ad5d1a');
    expect(completion).toContain('a91110245c3932fd98b3156b2595836927566ede');
    expect(completion).toContain('f5e73c7b194ba0d53a94c85ae79d6338939f63e6');
    expect(completion).toContain(
      'artifacts/phase9/a2a-mcp-crossing-v2/handoffprobe-a91110245c3932fd98b3156b2595836927566ede/',
    );
  });

  it('records a successful frozen intake without self-certifying Green', () => {
    expect(completion).toContain('verifier returned exit code `0`');
    expect(completion).toContain('`confirmed_grade`: `null`');
    expect(completion).toContain('`green_eligible`: `false`');
    expect(completion).toContain('`complete_external_execution`: `true`');
    expect(completion).toContain('`bound_expectations_match`: `true`');
    expect(completion).toContain('does not self-award `--confirmed-grade`');
  });

  it('states the local synthetic effect limitation explicitly', () => {
    expect(completion).toContain('`outside_verifier: true`');
    expect(completion).toContain('`production_world_effect: false`');
    expect(completion).toContain('local_synthetic_mcp_receiver_execution');
    expect(completion).toContain('It does not claim a production-world or third-party effect.');
  });

  it('does not claim operator independence', () => {
    expect(completion).toContain('`implementation_independent`');
    expect(completion).toContain('The submission does not claim:');
    expect(completion).toContain('`operator_independent`');
  });
});
