import { createHash } from 'node:crypto';

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalize(item));
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(value).sort()) {
      result[key] = canonicalize((value as Record<string, unknown>)[key]);
    }

    return result;
  }

  return value;
}

export function hashApprovalPayload(payload: unknown): string {
  const serialized = JSON.stringify(canonicalize(payload));

  const digest = createHash('sha256').update(serialized).digest('hex');

  return `sha256:${digest}`;
}
