export const REDACTED_VALUE = '[REDACTED]';

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replaceAll('-', '').replaceAll('_', '');

  const markers = ['authorization', 'password', 'secret', 'token', 'apikey', 'cookie', 'setcookie'];

  return markers.some((marker) => normalized.includes(marker));
}

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(value)) {
      result[key] = isSensitiveKey(key) ? REDACTED_VALUE : redactValue(nested);
    }

    return result;
  }

  return value;
}

export function redactRecord(input: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    result[key] = isSensitiveKey(key) ? REDACTED_VALUE : redactValue(value);
  }

  return result;
}
