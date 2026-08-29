# Research and Protocol Baseline

As of: 2026-08-29

HandoffProbe tests fast-moving protocols. This document pins the assumptions used by the project so tests do not silently target outdated behavior.

## Authoritative protocol baseline

### A2A

- Latest released specification: **1.0.0**
- Wire compatibility version: **1.0**
- Core official bindings: HTTP+JSON, JSON-RPC and gRPC
- v0.1 HandoffProbe implementation priority: HTTP+JSON first
- Agent Cards declare interfaces, skills/capabilities and security requirements and may be JWS-signed.
- A2A 1.0 requires callers to send/declare the appropriate protocol version and requires servers to authorize protocol operations within caller boundaries.
- The optional `tenant` value in an AgentInterface must be propagated to requests for that interface.

Authoritative sources:

- https://a2a-protocol.org/latest/specification/
- https://a2a-protocol.org/latest/announcing-1.0/
- https://github.com/a2aproject/A2A

### MCP

- Current specification revision: **2026-07-28**
- The 2026-07-28 core is stateless: the old protocol handshake/session model is no longer the conceptual baseline.
- Requests are self-describing; routing information can be mirrored into `Mcp-Method`, `Mcp-Name` and parameter headers.
- List responses can carry caching guidance and deterministic ordering.
- Authorization hardening includes audience/resource validation and issuer validation; bearer token passthrough is a known anti-pattern.
- Stateful applications may use explicit handles; possession of a state handle must not be treated as authorization.
- Multi Round-Trip Requests (MRTR) allow mid-operation input/confirmation flows and create new lifecycle/binding questions for composed systems.

Authoritative sources:

- https://blog.modelcontextprotocol.io/posts/2026-07-28/
- https://modelcontextprotocol.io/specification/2026-07-28
- https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28

## Tooling baseline

- Node.js release baseline: Node 24, enforced as `>=24 <25`.
- Official JavaScript/TypeScript SDK: **@a2a-js/sdk 1.1.0**, implementing A2A Protocol Specification 1.0.0.
- MCP TypeScript client/server SDK: **2.0.0** split packages implementing the 2026-07-28 revision.
- HandoffProbe explicitly pins MCP version negotiation to `2026-07-28` in the protocol lab.

The SDK versions are exact release inputs rather than floating ranges so protocol-lab behavior cannot silently move during the v0.1 release.

## Existing official testing tools

### A2A TCK

The official A2A Technology Compatibility Kit validates A2A protocol implementations across HTTP+JSON, JSON-RPC and gRPC, including mandatory/optional capability behavior.

- https://github.com/a2aproject/a2a-tck

### A2A Inspector

Interactive A2A debugging/validation tool.

- https://github.com/a2aproject/a2a-inspector

### MCP Inspector

Interactive/CLI tool for connecting to and debugging MCP servers.

- https://github.com/modelcontextprotocol/inspector

HandoffProbe should integrate with or reference these tools rather than reproduce their single-protocol validation scope.

## Security research baseline

### AgentRFC / AgentConform

`AgentRFC: Security Design Principles and Conformance Testing for Agent Protocols` (arXiv:2603.23801) introduces a Composition Safety principle and a formal/source-linked conformance framework.

- https://arxiv.org/abs/2603.23801

### AgentThread

`Formal Security Analysis of Agent Protocol Composition` (arXiv:2606.28690) reports failures that emerge only when protocols are composed and classifies cross-protocol enforcement gaps/responsibility gaps.

- https://arxiv.org/abs/2606.28690

HandoffProbe should treat these works as evidence that the problem is real and as design inspiration for traceability. It should not copy implementation/code or claim the underlying composition-safety concept as original.

## OWASP mapping

The OWASP Top 10 for Agentic Applications 2026 provides a useful external taxonomy. HandoffProbe is most relevant to:

- ASI02 — Tool Misuse & Exploitation
- ASI03 — Identity & Privilege Abuse
- ASI07 — Insecure Inter-Agent Communication
- ASI08 — Cascading Failures

Mappings are metadata/context, not proof of a vulnerability.

Sources:

- https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- https://genai.owasp.org/resource/a-practical-guide-for-secure-mcp-server-development/

## Source/provenance policy for tests

Every implemented `AttackDefinition` should record:

- stable `HP-*` ID
- applicable A2A version/range
- applicable MCP revision/range
- property class
- source references (spec sections, research, CVE/advisory, or HandoffProbe-derived invariant)
- whether the test is normative conformance, recommended hardening or composition-responsibility testing

Property classes:

- `spec_required` — directly tied to a normative MUST/MUST NOT
- `spec_recommended` — tied to SHOULD/SHOULD NOT guidance
- `hardening` — defensive property not required by the protocol
- `composition_responsibility` — end-to-end invariant whose enforcement is not assigned cleanly to one protocol

## v0.1 release drift review — 2026-08-29

The formal Phase 7.2A review classified upstream changes using the release contract categories.

- **A2A specification: no-impact** — the latest released specification remains 1.0.0 and the v0.1 wire baseline remains 1.0.
- **A2A JavaScript SDK: test-impact, resolved** — `@a2a-js/sdk` advanced from the HandoffProbe pin 1.0.1 to stable 1.1.0 on 2026-08-26. The SDK still implements A2A Protocol Specification 1.0.0. The release contains event-bus configurability plus fixes around task serialization, push configuration, compatibility translation and related SDK behavior. HandoffProbe upgrades to 1.1.0 and requires the full regression suite before release freeze.
- **A2A governance: documentation-only** — A2A joined the Agentic AI Foundation as a Growth Stage project on 2026-08-27. This does not change the released v1.0.0 protocol baseline.
- **MCP released specification: no-impact** — 2026-07-28 remains the released specification baseline used by HandoffProbe.
- **MCP roadmap: documentation-only** — the 2026-08-22 roadmap describes future work including agentic messaging, transport hardening, identity/security and composition review, but it does not introduce a newer released protocol revision.
- **MCP TypeScript SDK: no-impact** — `@modelcontextprotocol/client` 2.0.0 and `@modelcontextprotocol/server` 2.0.0 remain the stable v2 packages for the 2026-07-28 specification and are already pinned by HandoffProbe.
- **AgentRFC / AgentThread: no-impact** — the tracked arXiv sources remain the v1 research baseline used for the v0.1 source/provenance model.
- **Release-blocking drift: none found.**

Review sources:

- https://a2a-protocol.org/dev/specification/
- https://github.com/a2aproject/a2a-js/releases/tag/v1.1.0
- https://www.npmjs.com/package/@a2a-js/sdk
- https://a2a-protocol.org/latest/blog/2026/08/27/a-new-chapter-for-a2a-joining-the-agentic-ai-foundation/
- https://blog.modelcontextprotocol.io/posts/2026-07-28/
- https://blog.modelcontextprotocol.io/posts/mcp-roadmap/
- https://www.npmjs.com/package/@modelcontextprotocol/client
- https://www.npmjs.com/package/@modelcontextprotocol/server
- https://arxiv.org/abs/2603.23801
- https://arxiv.org/abs/2606.28690

## Upstream drift policy

Before each public release:

1. check current A2A specification/release notes;
2. check current MCP specification/release notes;
3. review official SDK breaking changes;
4. mark tests as active/deprecated/version-specific rather than silently rewriting their meaning;
5. retain regression fixtures for historical protocol versions only when maintenance value justifies it.

A protocol update must not silently change the security meaning of an existing stable HandoffProbe test ID.
