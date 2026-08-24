import { describe, expect, it } from 'vitest';

import { REDACTED_VALUE, redactRecord } from '../src/core/index.js';

describe('evidence redaction policy', () => {
  it('preserves non-secret authorization evidence', () => {
    const result = redactRecord({
      authorizationResult: false,

      authorizationReasons: ['authority_amplification_or_binding_change'],

      authorizationBinding: {
        delegate: 'agent:billing',
        tenant: 'tenant:acme',
      },
    });

    expect(result).toEqual({
      authorizationResult: false,

      authorizationReasons: ['authority_amplification_or_binding_change'],

      authorizationBinding: {
        delegate: 'agent:billing',
        tenant: 'tenant:acme',
      },
    });
  });

  it('redacts actual authorization headers and credential secrets', () => {
    const result = redactRecord({
      authorization: 'Bearer super-secret',

      authorizationHeader: 'Bearer another-secret',

      proxyAuthorization: 'Basic secret',

      password: 'password-value',

      rawToken: 'token-value',

      api_key: 'api-key-value',

      clientSecret: 'client-secret-value',

      cookie: 'session=secret',

      'set-cookie': 'session=secret',

      nested: {
        refreshToken: 'refresh-value',

        credentialFingerprint: 'sha256:safe-fingerprint',
      },
    });

    expect(result.authorization).toBe(REDACTED_VALUE);

    expect(result.authorizationHeader).toBe(REDACTED_VALUE);

    expect(result.proxyAuthorization).toBe(REDACTED_VALUE);

    expect(result.password).toBe(REDACTED_VALUE);

    expect(result.rawToken).toBe(REDACTED_VALUE);

    expect(result.api_key).toBe(REDACTED_VALUE);

    expect(result.clientSecret).toBe(REDACTED_VALUE);

    expect(result.cookie).toBe(REDACTED_VALUE);

    expect(result['set-cookie']).toBe(REDACTED_VALUE);

    expect(result.nested).toEqual({
      refreshToken: REDACTED_VALUE,

      credentialFingerprint: 'sha256:safe-fingerprint',
    });
  });

  it('does not redact unrelated words merely containing security terminology', () => {
    const result = redactRecord({
      tokenCount: 3,
      secretRotationRequired: true,
      passwordPolicy: 'strict',
      authorizationResult: true,
    });

    expect(result).toEqual({
      tokenCount: 3,
      secretRotationRequired: true,
      passwordPolicy: 'strict',
      authorizationResult: true,
    });
  });
});
