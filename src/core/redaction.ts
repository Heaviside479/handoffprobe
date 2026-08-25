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

const INLINE_KEY_VALUE_PATTERN =
  /\b([A-Za-z][A-Za-z0-9_-]*)(\s*[:=]\s*)(?:"[^"\r\n]*"|'[^'\r\n]*'|(?:Bearer|Basic)\s+[^\s,;"']+|[^\s,;"']+)/gi;

const AUTH_SCHEME_PATTERN = /\b(Bearer|Basic)(\s+)[^\s,;"']+/gi;

export function redactText(input: string): string {
  const keyed = input.replace(
    INLINE_KEY_VALUE_PATTERN,
    (match: string, key: string, separator: string) => {
      if (!isSensitiveKey(key)) {
        return match;
      }

      return `${key}${separator}${REDACTED_VALUE}`;
    },
  );

  return keyed.replace(AUTH_SCHEME_PATTERN, (_match: string, scheme: string, spacing: string) => {
    return `${scheme}${spacing}${REDACTED_VALUE}`;
  });
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
