import { describe, expect, it } from 'vitest';

import {
  applyCrossingCaseMutations,
  normalizeCrossingCaseMutations,
  type CrossingMutableCaseState,
} from '../src/phase9/crossing-corpus/case-builder.js';
import {
  loadPinnedCrossingCorpus,
  type CrossingCorpusCase,
} from '../src/phase9/crossing-corpus/loader.js';
import { digestCrossingJson } from '../src/phase9/crossing-corpus/verifier.js';

const corpus = loadPinnedCrossingCorpus();

function caseById(id: string): CrossingCorpusCase {
  const corpusCase = corpus.cases.cases.find((item) => item.id === id);

  if (corpusCase === undefined) {
    throw new Error(`Missing crossing corpus case: ${id}`);
  }

  return corpusCase;
}

function runtimeState(): CrossingMutableCaseState {
  const initialAuthority = {
    issuer_id: 'https://issuer.example',
    authority_id: 'authority-002',
    requester_id: 'runtime-caller',
    a2a_binding: {
      stage: 'initial',
      message_id: 'runtime-message',
    },
    mcp_audience: {
      value: 'http://handoffprobe.local/mcp',
      source: 'pinned_configuration',
    },
    action_digest: 'runtime-action-digest',
    not_before: '2026-08-23T00:00:00Z',
    expires_at: '2026-08-24T00:00:00Z',
    status_ref: 'https://issuer.example/status/authority-002',
    nonce: 'nonce-002',
  };

  const initialReference = {
    profile: 'https://minorityprophet.org/conformance/a2a-mcp-crossing/v2',
    authority_id: 'authority-002',
    authority_digest: digestCrossingJson(initialAuthority),
  };

  const authority = {
    ...structuredClone(initialAuthority),
    a2a_binding: {
      stage: 'resolved',
      mode: 'first_turn_reissued',
      message_id: 'runtime-message',
      task_id: 'runtime-task',
      context_id: 'runtime-context',
      previous_stage_digest: initialReference.authority_digest,
    },
  };

  const reference = {
    profile: initialReference.profile,
    authority_id: 'authority-002',
    authority_digest: digestCrossingJson(authority),
  };

  return {
    bundle: {
      initial_authority: initialAuthority,
      initial_reference: initialReference,
      authority,
      reference,
    },
    status: {
      status_ref: 'https://issuer.example/status/authority-002',
      authority_id: 'authority-002',
      status: 'current',
      observed_at: '2026-08-23T11:59:00Z',
    },
    observed: {
      caller_id: 'runtime-caller',
      message_id: 'runtime-message',
      task_id: 'runtime-task',
      context_id: 'runtime-context',
      mcp_audience: {
        value: 'http://handoffprobe.local/mcp',
        source: 'pinned_configuration',
      },
      tool: 'read_invoice',
      arguments: {
        message: 'runtime',
      },
    },
  };
}

describe('Phase 9 crossing corpus case builder', () => {
  it('keeps the HandoffProbe-owned observation for an unmutated valid control', () => {
    const input = runtimeState();
    const output = applyCrossingCaseMutations(input, caseById('valid_crossing'));

    expect(output).not.toBe(input);
    expect(output.observed).toEqual(input.observed);
    expect(output.observed.caller_id).toBe('runtime-caller');
    expect(output.observed.task_id).toBe('runtime-task');
  });

  it('applies an observed task mutation to the runtime observation instead of an external base row', () => {
    const input = runtimeState();
    const output = applyCrossingCaseMutations(input, caseById('task_swap'));

    expect(output.observed).toMatchObject({
      caller_id: 'runtime-caller',
      message_id: 'runtime-message',
      task_id: 'task-999',
      context_id: 'runtime-context',
    });
    expect(input.observed.task_id).toBe('runtime-task');
  });

  it('applies stage mutation before independently rehashing the adapted authority', () => {
    const output = applyCrossingCaseMutations(runtimeState(), caseById('stage_message_swap'));

    const authority = output.bundle.authority as Record<string, unknown>;
    const binding = authority.a2a_binding as Record<string, unknown>;
    const reference = output.bundle.reference as Record<string, unknown>;

    expect(binding.message_id).toBe('message-999');
    expect(reference.authority_digest).toBe(digestCrossingJson(authority));
  });

  it('models the existing-task transition without inventing initial-stage evidence', () => {
    const output = applyCrossingCaseMutations(runtimeState(), caseById('existing_task_valid'));

    const authority = output.bundle.authority as Record<string, unknown>;
    const binding = authority.a2a_binding as Record<string, unknown>;
    const reference = output.bundle.reference as Record<string, unknown>;

    expect(binding.mode).toBe('existing_task');
    expect(binding).not.toHaveProperty('previous_stage_digest');
    expect(output.bundle).not.toHaveProperty('initial_authority');
    expect(output.bundle).not.toHaveProperty('initial_reference');
    expect(reference.authority_digest).toBe(digestCrossingJson(authority));
  });

  it('preserves paired omission semantics without treating two missing values as equality evidence', () => {
    const output = applyCrossingCaseMutations(runtimeState(), caseById('requester_omitted_both'));

    const authority = output.bundle.authority as Record<string, unknown>;
    const initialAuthority = output.bundle.initial_authority as Record<string, unknown>;
    const reference = output.bundle.reference as Record<string, unknown>;

    expect(initialAuthority).not.toHaveProperty('requester_id');
    expect(authority).not.toHaveProperty('requester_id');
    expect(output.observed).not.toHaveProperty('caller_id');
    expect(reference.authority_digest).toBe(digestCrossingJson(authority));
  });

  it('normalizes all pinned corpus mutations without depending on the external runner', () => {
    const normalized = corpus.cases.cases.flatMap((item) => normalizeCrossingCaseMutations(item));

    expect(corpus.cases.cases).toHaveLength(28);
    expect(normalized.some((mutation) => mutation.op === 'set')).toBe(true);
    expect(normalized.some((mutation) => mutation.op === 'delete')).toBe(true);
    expect(normalized.some((mutation) => mutation.op === 'rehash')).toBe(true);
    expect(normalized.filter((mutation) => mutation.target === 'observed')).toHaveLength(11);
  });
});
