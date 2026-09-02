import { createPrivateKey, createPublicKey, type KeyObject } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import {
  signCrossingAuthority,
  verifyCrossingAuthorityIssuerAuthentication,
  type CrossingIssuerIdentity,
  type CrossingTrustedIssuer,
} from '../src/phase9/crossing-corpus/issuer-authentication.js';
import {
  digestCrossingJson,
  type CrossingAuthority,
} from '../src/phase9/crossing-corpus/verifier.js';

const ED25519_PKCS8_SEED_PREFIX = '302e020100300506032b657004220420';
const ED25519_SPKI_PUBLIC_PREFIX = '302a300506032b6570032100';

const ISSUER_SEED_HEX = '9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60';
const ISSUER_PUBLIC_HEX = 'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a';

const ATTACKER_SEED_HEX = '4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb';
const ATTACKER_PUBLIC_HEX = '3d4017c3e843895a92b70aa74d1b7ebc9c982ccf2ec4968cc0cd55f12af4660c';

function privateKey(seedHex: string): KeyObject {
  return createPrivateKey({
    key: Buffer.from(ED25519_PKCS8_SEED_PREFIX + seedHex, 'hex'),
    format: 'der',
    type: 'pkcs8',
  });
}

function publicKey(publicHex: string): KeyObject {
  return createPublicKey({
    key: Buffer.from(ED25519_SPKI_PUBLIC_PREFIX + publicHex, 'hex'),
    format: 'der',
    type: 'spki',
  });
}

const issuerIdentity: CrossingIssuerIdentity = {
  issuer_id: 'https://issuer.example',
  key_id: 'rfc8032-ed25519-test-vector-1',
};

const trustedIssuer: CrossingTrustedIssuer = {
  ...issuerIdentity,
  public_key: publicKey(ISSUER_PUBLIC_HEX),
};

const issuerPrivateKey = privateKey(ISSUER_SEED_HEX);
const attackerPrivateKey = privateKey(ATTACKER_SEED_HEX);

function authority(): CrossingAuthority {
  return {
    issuer_id: 'https://issuer.example',
    authority_id: 'authority-1',
    requester_id: 'caller-1',
    a2a_binding: {
      stage: 'resolved',
      mode: 'existing_task',
      message_id: 'message-1',
      task_id: 'task-1',
      context_id: 'context-1',
    },
    mcp_audience: {
      value: 'https://mcp.example',
      source: 'pinned_configuration',
    },
    action_digest: 'a'.repeat(64),
    not_before: '2026-09-02T00:00:00Z',
    expires_at: '2026-09-03T00:00:00Z',
    status_ref: 'status-1',
    nonce: 'nonce-1',
  };
}

describe('crossing issuer authentication', () => {
  it('accepts an authority signed by the trusted issuer', () => {
    const value = authority();
    const authentication = signCrossingAuthority(value, issuerIdentity, issuerPrivateKey);

    expect(authentication.authority_digest).toBe(digestCrossingJson(value));
    expect(verifyCrossingAuthorityIssuerAuthentication(value, authentication, trustedIssuer)).toBe(
      true,
    );
  });

  it('rejects an authority changed after the trusted issuer signed it', () => {
    const original = authority();
    const authentication = signCrossingAuthority(original, issuerIdentity, issuerPrivateKey);

    const forged: CrossingAuthority = {
      ...original,
      requester_id: 'mallory',
    };

    expect(digestCrossingJson(forged)).not.toBe(authentication.authority_digest);
    expect(verifyCrossingAuthorityIssuerAuthentication(forged, authentication, trustedIssuer)).toBe(
      false,
    );
  });

  it('rejects a non-issuer that rewrites the authority and recomputes the unkeyed digest', () => {
    const forged: CrossingAuthority = {
      ...authority(),
      requester_id: 'mallory',
      action_digest: 'b'.repeat(64),
    };

    const attackerAuthentication = signCrossingAuthority(
      forged,
      issuerIdentity,
      attackerPrivateKey,
    );

    expect(attackerAuthentication.authority_digest).toBe(digestCrossingJson(forged));
    expect(
      verifyCrossingAuthorityIssuerAuthentication(forged, attackerAuthentication, trustedIssuer),
    ).toBe(false);
  });

  it('rejects authentication under the wrong trusted issuer identity', () => {
    const value = authority();
    const authentication = signCrossingAuthority(value, issuerIdentity, issuerPrivateKey);

    const wrongTrustedIssuer: CrossingTrustedIssuer = {
      issuer_id: 'https://other-issuer.example',
      key_id: issuerIdentity.key_id,
      public_key: publicKey(ATTACKER_PUBLIC_HEX),
    };

    expect(
      verifyCrossingAuthorityIssuerAuthentication(value, authentication, wrongTrustedIssuer),
    ).toBe(false);
  });
});
