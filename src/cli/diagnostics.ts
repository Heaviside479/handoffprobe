import { HandoffProbeCoreError, redactText } from '../core/index.js';

export type CliRuntimeFailureKind = 'scanner' | 'output';

export function sanitizeCliLine(value: string): string {
  return redactText(value).replace(/[\r\n]+/g, ' ');
}

export function renderCliRuntimeDiagnostic(
  kind: CliRuntimeFailureKind,
  error: unknown,
): readonly string[] {
  if (kind === 'output') {
    return [
      'HandoffProbe: output write failure.',
      'Troubleshooting: check that the output parent directory exists and is writable.',
    ];
  }

  if (error instanceof HandoffProbeCoreError) {
    return [
      `HandoffProbe: scanner runtime failure (${error.code} at ${sanitizeCliLine(error.stage)}).`,
      'Troubleshooting: verify the selected target/adapter and rerun the same command.',
    ];
  }

  return [
    'HandoffProbe: scanner runtime failure.',
    'Troubleshooting: rerun the same command; if it repeats, report the command and HandoffProbe version.',
  ];
}
