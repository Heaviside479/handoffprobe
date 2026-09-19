import { describe, expect, it } from 'vitest';

import { REDACTED_VALUE, redactRecord, redactText } from '../src/core/index.js';

describe('P10.3 redaction regression matrix', () => {
  it('redacts nested secrets inside objects and arrays', () => {
    const result = redactRecord({
      safe: {
        tokenCount: 3,
        credentialFingerprint: 'sha256:safe-fingerprint',
      },
      items: [
        {
          refresh_token: 'hp-refresh-secret',
          apiKey: 'hp-api-secret',
          nested: {
            client_secret: 'hp-client-secret',
          },
        },
        {
          authorization: 'Bearer hp-auth-secret',
          password: 'hp-password-secret',
          authorizationResult: true,
        },
      ],
    });

    expect(result).toEqual({
      safe: {
        tokenCount: 3,
        credentialFingerprint: 'sha256:safe-fingerprint',
      },
      items: [
        {
          refresh_token: REDACTED_VALUE,
          apiKey: REDACTED_VALUE,
          nested: {
            client_secret: REDACTED_VALUE,
          },
        },
        {
          authorization: REDACTED_VALUE,
          password: REDACTED_VALUE,
          authorizationResult: true,
        },
      ],
    });
  });

  it('normalizes casing hyphens and underscores for sensitive keys', () => {
    const result = redactRecord({
      AUTHORIZATION: 'Bearer hp-upper-secret',
      'proxy-authorization': 'Basic hp-proxy-secret',
      API_KEY: 'hp-api-secret',
      'client-secret': 'hp-client-secret',
      Refresh_Token: 'hp-refresh-secret',
      Set_Cookie: 'session=hp-cookie-secret',
    });

    expect(Object.values(result)).toEqual([
      REDACTED_VALUE,
      REDACTED_VALUE,
      REDACTED_VALUE,
      REDACTED_VALUE,
      REDACTED_VALUE,
      REDACTED_VALUE,
    ]);
  });

  it('redacts multiple inline secret forms while preserving harmless text', () => {
    const input = [
      'prefix password="hp-quoted-secret" suffix',
      'api_key=hp-api-secret',
      'clientSecret=hp-client-secret',
      'Authorization: Bearer hp-bearer-secret',
      'fallback Basic hp-basic-secret',
      'tokenCount=3',
      'passwordPolicy=strict',
    ].join(' | ');

    const result = redactText(input);

    for (const secret of [
      'hp-quoted-secret',
      'hp-api-secret',
      'hp-client-secret',
      'hp-bearer-secret',
      'hp-basic-secret',
    ]) {
      expect(result).not.toContain(secret);
    }

    expect(result).toContain('tokenCount=3');
    expect(result).toContain('passwordPolicy=strict');
    expect(result).toContain(REDACTED_VALUE);
  });

  it('preserves similarly named non-secret structured fields', () => {
    const input = {
      tokenCount: 7,
      tokenType: 'synthetic',
      passwordPolicy: 'strict',
      secretRotationRequired: true,
      authorizationResult: false,
      authorizationReasons: ['scope_mismatch'],
      credentialFingerprint: 'sha256:safe',
    };

    expect(redactRecord(input)).toEqual(input);
  });

  it('is deterministic and idempotent for already-redacted text', () => {
    const input = 'Authorization: Bearer hp-repeat-secret password=hp-password-secret';

    const first = redactText(input);
    const second = redactText(first);

    expect(second).toBe(first);
    expect(first).not.toContain('hp-repeat-secret');
    expect(first).not.toContain('hp-password-secret');
  });
});
