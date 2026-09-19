import { describe, expect, it } from 'vitest';

import { HandoffProbeCoreError, REDACTED_VALUE } from '../src/core/index.js';
import {
  CLI_RUNTIME_DIAGNOSTIC_SCHEMA_VERSION,
  createCliRuntimeDiagnostic,
  renderCliRuntimeDiagnostic,
  serializeCliRuntimeDiagnostic,
} from '../src/cli/diagnostics.js';

describe('P10.3 structured runtime diagnostics', () => {
  it('creates deterministic secret-safe structured scanner diagnostics', () => {
    const error = new HandoffProbeCoreError(
      'ADAPTER_ERROR',
      'Bearer hp-message-secret',
      'target.adapter\nBearer hp-stage-secret',
      {
        token: 'hp-detail-secret',
      },
    );

    const first = createCliRuntimeDiagnostic('scanner', error);
    const second = createCliRuntimeDiagnostic('scanner', error);

    expect(first).toEqual(second);
    expect(first.schemaVersion).toBe(CLI_RUNTIME_DIAGNOSTIC_SCHEMA_VERSION);
    expect(first.kind).toBe('scanner');
    expect(first.code).toBe('scanner_runtime_failure');
    expect(first.severity).toBe('error');
    expect(first.coreCode).toBe('ADAPTER_ERROR');
    expect(first.stage).toContain(REDACTED_VALUE);

    const serialized = serializeCliRuntimeDiagnostic(first);

    expect(serialized).toBe(serializeCliRuntimeDiagnostic(second));
    expect(serialized).not.toContain('hp-message-secret');
    expect(serialized).not.toContain('hp-stage-secret');
    expect(serialized).not.toContain('hp-detail-secret');
  });

  it('does not expose raw output-system errors in structured diagnostics', () => {
    const diagnostic = createCliRuntimeDiagnostic(
      'output',
      new Error('ENOENT /private/tmp/Bearer hp-output-secret/report.json'),
    );

    expect(diagnostic).toEqual({
      schemaVersion: '1',
      kind: 'output',
      code: 'output_write_failure',
      severity: 'error',
      message: 'HandoffProbe: output write failure.',
      troubleshooting:
        'Troubleshooting: check that the output parent directory exists and is writable.',
    });

    const serialized = serializeCliRuntimeDiagnostic(diagnostic);

    expect(serialized).not.toContain('ENOENT');
    expect(serialized).not.toContain('/private/tmp');
    expect(serialized).not.toContain('hp-output-secret');
  });

  it('does not expose unknown raw scanner errors', () => {
    const diagnostic = createCliRuntimeDiagnostic('scanner', new Error('Bearer hp-unknown-secret'));

    expect(diagnostic.schemaVersion).toBe('1');
    expect(diagnostic.kind).toBe('scanner');
    expect(diagnostic.code).toBe('scanner_runtime_failure');
    expect(diagnostic.coreCode).toBeUndefined();
    expect(diagnostic.stage).toBeUndefined();
    expect(serializeCliRuntimeDiagnostic(diagnostic)).not.toContain('hp-unknown-secret');
  });

  it('preserves the existing human-readable stderr contract', () => {
    expect(
      renderCliRuntimeDiagnostic('output', new Error('ENOENT /private/tmp/report.json')),
    ).toEqual([
      'HandoffProbe: output write failure.',
      'Troubleshooting: check that the output parent directory exists and is writable.',
    ]);

    expect(renderCliRuntimeDiagnostic('scanner', new Error('untrusted raw scanner error'))).toEqual(
      [
        'HandoffProbe: scanner runtime failure.',
        'Troubleshooting: rerun the same command; if it repeats, report the command and HandoffProbe version.',
      ],
    );
  });
});
