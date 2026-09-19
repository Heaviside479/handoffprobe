import { HandoffProbeCoreError, redactText } from '../core/index.js';

import type { CoreErrorCode } from '../core/index.js';

export const CLI_RUNTIME_DIAGNOSTIC_SCHEMA_VERSION = '1' as const;

export type CliRuntimeFailureKind = 'scanner' | 'output';

export type CliRuntimeDiagnosticCode = 'scanner_runtime_failure' | 'output_write_failure';

export interface CliRuntimeDiagnostic {
  readonly schemaVersion: typeof CLI_RUNTIME_DIAGNOSTIC_SCHEMA_VERSION;
  readonly kind: CliRuntimeFailureKind;
  readonly code: CliRuntimeDiagnosticCode;
  readonly severity: 'error';
  readonly coreCode?: CoreErrorCode;
  readonly stage?: string;
  readonly message: string;
  readonly troubleshooting: string;
}

export function sanitizeCliLine(value: string): string {
  return redactText(value).replace(/[\r\n]+/g, ' ');
}

export function createCliRuntimeDiagnostic(
  kind: CliRuntimeFailureKind,
  error: unknown,
): CliRuntimeDiagnostic {
  if (kind === 'output') {
    return {
      schemaVersion: CLI_RUNTIME_DIAGNOSTIC_SCHEMA_VERSION,
      kind,
      code: 'output_write_failure',
      severity: 'error',
      message: 'HandoffProbe: output write failure.',
      troubleshooting:
        'Troubleshooting: check that the output parent directory exists and is writable.',
    };
  }

  if (error instanceof HandoffProbeCoreError) {
    const stage = sanitizeCliLine(error.stage);

    return {
      schemaVersion: CLI_RUNTIME_DIAGNOSTIC_SCHEMA_VERSION,
      kind,
      code: 'scanner_runtime_failure',
      severity: 'error',
      coreCode: error.code,
      stage,
      message: 'HandoffProbe: scanner runtime failure (' + error.code + ' at ' + stage + ').',
      troubleshooting:
        'Troubleshooting: verify the selected target/adapter and rerun the same command.',
    };
  }

  return {
    schemaVersion: CLI_RUNTIME_DIAGNOSTIC_SCHEMA_VERSION,
    kind,
    code: 'scanner_runtime_failure',
    severity: 'error',
    message: 'HandoffProbe: scanner runtime failure.',
    troubleshooting:
      'Troubleshooting: rerun the same command; if it repeats, report the command and HandoffProbe version.',
  };
}

export function serializeCliRuntimeDiagnostic(diagnostic: CliRuntimeDiagnostic): string {
  return JSON.stringify(diagnostic);
}

export function renderCliRuntimeDiagnostic(
  kind: CliRuntimeFailureKind,
  error: unknown,
): readonly string[] {
  const diagnostic = createCliRuntimeDiagnostic(kind, error);

  return [diagnostic.message, diagnostic.troubleshooting];
}
