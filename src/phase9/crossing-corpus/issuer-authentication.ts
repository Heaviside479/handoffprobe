import {
  createPrivateKey,
  createPublicKey,
  sign as signMessage,
  verify as verifyMessage,
  type KeyObject,
} from 'node:crypto';

import { digestCrossingJson, type CrossingAuthority } from './verifier.js';

export const CROSSING_ISSUER_SIGNATURE_ALGORITHM = 'Ed25519' as const;
export const CROSSING_ISSUER_SIGNATURE_DOMAIN =
  'handoffprobe:phase9:crossing-authority:v1' as const;

export interface CrossingIssuerIdentity {
  readonly issuer_id: string;
  readonly key_id: string;
}

export interface CrossingIssuerAuthentication extends CrossingIssuerIdentity {
  readonly algorithm: typeof CROSSING_ISSUER_SIGNATURE_ALGORITHM;
  readonly authority_digest: string;
  readonly signature: string;
}

export interface CrossingTrustedIssuer extends CrossingIssuerIdentity {
  readonly public_key: KeyObject;
}

export interface SyntheticCrossingIssuerFixture {
  readonly identity: CrossingIssuerIdentity;
  readonly privateKey: KeyObject;
  readonly trustedIssuer: CrossingTrustedIssuer;
}

const ED25519_PKCS8_SEED_PREFIX = '302e020100300506032b657004220420';
const ED25519_SPKI_PUBLIC_PREFIX = '302a300506032b6570032100';

const SYNTHETIC_ISSUER_SEED_HEX =
  '9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60';

const SYNTHETIC_ISSUER_PUBLIC_HEX =
  'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a';

function syntheticPrivateKey(): KeyObject {
  return createPrivateKey({
    key: Buffer.from(ED25519_PKCS8_SEED_PREFIX + SYNTHETIC_ISSUER_SEED_HEX, 'hex'),
    format: 'der',
    type: 'pkcs8',
  });
}

function syntheticPublicKey(): KeyObject {
  return createPublicKey({
    key: Buffer.from(ED25519_SPKI_PUBLIC_PREFIX + SYNTHETIC_ISSUER_PUBLIC_HEX, 'hex'),
    format: 'der',
    type: 'spki',
  });
}

export function createSyntheticCrossingIssuerFixture(
  issuerId = 'https://issuer.example',
): SyntheticCrossingIssuerFixture {
  const identity: CrossingIssuerIdentity = {
    issuer_id: issuerId,
    key_id: 'rfc8032-ed25519-test-vector-1',
  };

  return {
    identity,
    privateKey: syntheticPrivateKey(),
    trustedIssuer: {
      ...identity,
      public_key: syntheticPublicKey(),
    },
  };
}

export interface SyntheticCrossingIssuerVerificationContext {
  readonly initial?: CrossingIssuerAuthentication;
  readonly resolved: CrossingIssuerAuthentication;
  readonly trustedIssuer: CrossingTrustedIssuer;
}

export function createSyntheticCrossingIssuerVerificationContext(
  authority: CrossingAuthority,
  initialAuthority?: CrossingAuthority,
): SyntheticCrossingIssuerVerificationContext {
  const fixture = createSyntheticCrossingIssuerFixture();

  const resolved = signCrossingAuthority(authority, fixture.identity, fixture.privateKey);

  if (initialAuthority === undefined) {
    return {
      resolved,
      trustedIssuer: fixture.trustedIssuer,
    };
  }

  return {
    initial: signCrossingAuthority(initialAuthority, fixture.identity, fixture.privateKey),
    resolved,
    trustedIssuer: fixture.trustedIssuer,
  };
}

function signingPayload(authorityDigest: string): Buffer {
  return Buffer.from(CROSSING_ISSUER_SIGNATURE_DOMAIN + '\n' + authorityDigest, 'utf8');
}

function decodeBase64Url(value: string): Buffer | null {
  if (/^[A-Za-z0-9_-]+$/u.test(value) === false) {
    return null;
  }

  const decoded = Buffer.from(value, 'base64url');

  if (decoded.length === 0) {
    return null;
  }

  if (decoded.toString('base64url') === value) {
    return decoded;
  }

  return null;
}

export function signCrossingAuthority(
  authority: CrossingAuthority,
  issuer: CrossingIssuerIdentity,
  privateKey: KeyObject,
): CrossingIssuerAuthentication {
  const issuerMatches = authority.issuer_id === issuer.issuer_id;

  if (issuerMatches === false) {
    throw new Error('Authority issuer does not match signing issuer.');
  }

  const authorityDigest = digestCrossingJson(authority);
  const signature = signMessage(null, signingPayload(authorityDigest), privateKey);

  return {
    issuer_id: issuer.issuer_id,
    key_id: issuer.key_id,
    algorithm: CROSSING_ISSUER_SIGNATURE_ALGORITHM,
    authority_digest: authorityDigest,
    signature: signature.toString('base64url'),
  };
}

export function verifyCrossingAuthorityIssuerAuthentication(
  authority: CrossingAuthority,
  authentication: CrossingIssuerAuthentication,
  trustedIssuer: CrossingTrustedIssuer,
): boolean {
  const trustedIdentity =
    authentication.algorithm === CROSSING_ISSUER_SIGNATURE_ALGORITHM &&
    authority.issuer_id === authentication.issuer_id &&
    authentication.issuer_id === trustedIssuer.issuer_id &&
    authentication.key_id === trustedIssuer.key_id;

  if (trustedIdentity === false) {
    return false;
  }

  const authorityDigest = digestCrossingJson(authority);

  const digestMatches = authentication.authority_digest === authorityDigest;

  if (digestMatches === false) {
    return false;
  }

  const signature = decodeBase64Url(authentication.signature);

  if (signature === null) {
    return false;
  }

  return verifyMessage(null, signingPayload(authorityDigest), trustedIssuer.public_key, signature);
}
