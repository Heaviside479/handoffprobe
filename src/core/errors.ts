export type CoreErrorCode =
  | 'INVALID_ATTACK_ID'
  | 'DUPLICATE_ATTACK_ID'
  | 'ATTACK_NOT_FOUND'
  | 'INVALID_TIMEOUT'
  | 'TIMEOUT'
  | 'ADAPTER_ERROR'
  | 'EVALUATION_ERROR'
  | 'INTERNAL_ERROR';

export class HandoffProbeCoreError extends Error {
  override readonly name = 'HandoffProbeCoreError';

  constructor(
    readonly code: CoreErrorCode,
    message: string,
    readonly stage: string,
    readonly details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
  }

  toJSON(): {
    name: string;
    code: CoreErrorCode;
    message: string;
    stage: string;
    details: Readonly<Record<string, unknown>>;
  } {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      stage: this.stage,
      details: this.details,
    };
  }
}
