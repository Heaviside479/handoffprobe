export const REDACTED_VALUE = '[REDACTED]';

function normalizeKey(key: string): string {
  return key.toLowerCase().replaceAll('-', '').replaceAll('_', '');
}

function isSensitiveKey(key: string): boolean {
  const normalized = normalizeKey(key);

  const exactSensitiveKeys = new Set([
    'authorization',
    'authorizationheader',
    'proxyauthorization',
    'password',
    'passwd',
    'secret',
    'token',
    'apikey',
    'cookie',
    'setcookie',
    'clientsecret',
  ]);

  if (exactSensitiveKeys.has(normalized)) {
    return true;
  }

  const sensitiveSuffixes = ['password', 'secret', 'token', 'apikey'];

  return sensitiveSuffixes.some((suffix) => normalized.endsWith(suffix));
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
