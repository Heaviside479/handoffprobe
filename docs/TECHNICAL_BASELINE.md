# HandoffProbe Technical Baseline

Status: implementation baseline
Last reviewed: 2026-08-24

## Purpose

This document freezes the initial implementation environment for HandoffProbe
so that protocol behavior does not silently drift during early development.

## Runtime

Initial implementation target:

- Node.js 24 LTS
- TypeScript
- ESM-first
- local-first execution
- no database
- no hosted backend
- no paid AI API
- no GPU dependency

Node 24 remains the baseline major version for v0.x unless an explicit
architecture decision changes it.

## Package manager

Use npm initially.

Reasons:

- HandoffProbe will ultimately be distributed through npm
- minimal contributor setup
- no monorepo complexity is currently required
- package-lock.json provides reproducible dependency resolution

## A2A baseline

Protocol:

- A2A 1.0

Initial transport:

- HTTP+JSON

Official SDK family:

- `@a2a-js/sdk`
- 1.0.x baseline

The first laboratory must use the official protocol semantics rather than a
custom approximation.

JSON-RPC may be added later.

gRPC is deferred until the engine is proven.

## MCP baseline

Protocol revision:

- MCP 2026-07-28

Official TypeScript SDK:

- v2 package line

Initial package families:

- `@modelcontextprotocol/client`
- `@modelcontextprotocol/server`

Important:

HandoffProbe fixtures must explicitly use the intended MCP 2026-07-28 behavior.
Do not rely on assumptions from older MCP session-oriented revisions.

## Initial developer tooling

Preferred:

- TypeScript
- Vitest
- ESLint
- Prettier
- tsx

Add a bundler only when CLI packaging actually requires it.

Avoid framework dependencies that do not directly support the security engine.

## Architecture constraints

The implementation must remain:

- deterministic where possible
- modular
- local-first
- safe by default
- CI-friendly
- protocol-version-aware
- evidence-driven
- independent of paid model APIs

## Version drift policy

Before installing or materially upgrading dependencies:

1. verify current Node 24 LTS patch
2. verify the current compatible A2A SDK 1.x release
3. verify the current stable MCP TypeScript SDK 2.x release
4. review upstream release notes
5. review relevant security advisories
6. record exact resolved versions in package-lock.json

Protocol revisions must not silently change during v0.1 implementation.

## Authoritative references

A2A:

- https://a2a-protocol.org/latest/specification/
- https://github.com/a2aproject/A2A
- https://github.com/a2aproject/a2a-js

MCP:

- https://modelcontextprotocol.io/specification/2026-07-28
- https://github.com/modelcontextprotocol/typescript-sdk

Node:

- https://nodejs.org/
