# Phase 8.3B adapter admission decision — 2026-08-30

Status: completed — no adapter admitted

## Decision

Phase 8.3B is complete without framework-adapter implementation.

No researched candidate currently satisfies the full HandoffProbe admission gate across all of these requirements at the same time:

- meaningful A2A 1.0 → MCP 2026-07-28 composition;
- real user, integration, or research demand for the exact boundary;
- handoff-specific security value rather than generic protocol scanning;
- deterministic local or authorized reproduction;
- understood framework and protocol-version maintenance risk;
- no paid infrastructure or paid model API requirement for the open-source core.

This is a deliberate no-build decision, not a failed implementation.

## Candidate results

| Candidate | Demand evidence | A2A 1.0 | MCP 2026-07-28 | Deterministic local / no-paid | Admission result |
| --- | --- | --- | --- | --- | --- |
| Google ADK | Strong ecosystem evidence | Not on the tested 1.33.0 path; newer ADK supports A2A 1.x | Current supported MCP line remains pre-2.x | Feasible in principle | Not admitted: exact protocol tuple not satisfied |
| IBM ContextForge | Strong identity and delegation demand | Proven on the reviewed v1 wire path | Not satisfied by the reviewed MCP `<2` runtime line | Plausible but operationally heavier | Not admitted: current protocol gate fails |
| tRPC-Agent-Go | Moderate ecosystem evidence | Proven | Not proven; reviewed `trpc-mcp-go` supports 2024-11-05 and 2025-03-26 | Strong | Not admitted: current protocol gate fails |
| LangGraph A2A→MCP public sample | Moderate ecosystem evidence | Composition exists but dependencies are broadly ranged | Exact 2026-07-28 pin not established | Public sample requires MongoDB plus Google and Voyage credentials | Not admitted: exact-version and no-paid gates fail |
| fast-agent | Weak demand for this exact boundary | Proven | Proven | Proven with a local deterministic zero-paid E2E probe | Not admitted: demand gate fails |

## fast-agent execution evidence

fast-agent was the only candidate that satisfied the technical protocol and zero-paid execution gates together.

The isolated local probe used:

- `fast-agent-mcp==0.10.10`;
- `a2a-sdk==1.1.0`;
- `mcp==2.0.0`;
- A2A Protocol 1.0;
- MCP Protocol `2026-07-28`;
- a localhost-only MCP server and A2A endpoint;
- fast-agent's deterministic `passthrough` model path;
- no paid model provider;
- no provider API key;
- no cloud service.

The real A2A → fast-agent → MCP tool execution preserved the synthetic marker, tenant and approval arguments and the MCP tool observed protocol version `2026-07-28`.

The incoming synthetic A2A bearer sentinel was not forwarded to the MCP HTTP requests. This observation is classified as boundary behavior only. HandoffProbe does not claim it is a vulnerability. The reviewed fast-agent source stores incoming bearer context request-scoped and does not establish that arbitrary automatic credential delegation to MCP is required.

The fast-agent probe is maintainer-run research evidence. It is not independent adoption evidence and is not counted as a HandoffProbe user.

## Other candidate conclusions

### Google ADK

The ADK admission work demonstrated a real version-maintenance risk.

`google-adk==1.33.0` required the A2A 0.3.x integration surface for `to_a2a()` compatibility, which does not satisfy HandoffProbe's A2A 1.0 baseline. A later ADK line supports A2A SDK 1.x, but its supported MCP runtime line remains below MCP SDK 2.x, so the exact A2A 1.0 + MCP 2026-07-28 tuple is not currently admitted.

No ADK adapter was implemented.

### IBM ContextForge

ContextForge has strong public evidence for identity propagation, delegation and audit/governance value across multi-agent paths.

The reviewed release exposes A2A v1-compatible wire behavior, but its runtime dependency remains on `mcp<2`. The reviewed MCP 1.x line does not implement HandoffProbe's MCP 2026-07-28 baseline.

No ContextForge installation or adapter implementation was justified.

### tRPC-Agent-Go

The reviewed `trpc-a2a-go/v2` source explicitly implements A2A Protocol 1.0.

The reviewed `trpc-mcp-go` source supports protocol constants `2024-11-05` and `2025-03-26`, with `2025-03-26` as the default compatible version. No `2026-07-28` support was established.

No tRPC adapter was implemented.

### LangGraph

A public LangGraph sample demonstrates a real A2A routing → LangGraph ReAct → MCP scheduling-server composition.

However, its dependency declarations are broad rather than an exact protocol lock, and the public reproduction requires external configuration including MongoDB, `GOOGLE_API_KEY`, and `VOYAGE_API_KEY`.

That sample therefore fails the deterministic zero-paid admission gate as published.

No LangGraph adapter was implemented.

## Security and disclosure classification

The Phase 8.3B probes did not establish a confirmed third-party security vulnerability.

No responsible-disclosure process is triggered by the current evidence.

If a future authorized probe establishes a real security defect, HandoffProbe must apply the existing responsible-disclosure gate before publishing exploit detail.

## Cost and authorization

Phase 8.3B required no paid AI API, paid analytics, paid cloud service, SaaS account, billing integration, or hidden telemetry.

Runtime probes were local and authorized. Source-only evaluations used public upstream repositories.

The open-source core remains compatible with the zero-paid development constraint.

## Re-evaluation triggers

An adapter can be reconsidered when one or more of these evidence changes occur:

1. a real HandoffProbe `[Adapter]` request identifies the exact framework and handoff path;
2. repeated public or opt-in use establishes demand for the same boundary;
3. an upstream candidate reaches the exact A2A 1.0 + MCP 2026-07-28 protocol baseline;
4. a reproducible authorized research case establishes handoff-specific security value;
5. maintenance and fixture-version risk becomes acceptably bounded.

fast-agent should be reconsidered first if direct demand appears while its tested protocol tuple remains valid.

ContextForge or Google ADK should be reconsidered if their supported MCP line reaches the current HandoffProbe baseline while their strong demand evidence remains relevant.

## Product immutability

Phase 8.3B changes no scanner runtime, attack behavior, protocol implementation, report schema, CLI behavior, GitHub Action runtime, package metadata, or published `handoffprobe@0.1.0` artifact.

The published 0.1.0 release remains immutable.

## Next work package

Proceed to Phase 8.4A.

Phase 8.4A should publish one reproducible research case under the existing responsible-disclosure rules. It should favor a case that demonstrates HandoffProbe's cross-protocol security value without requiring a speculative framework adapter or paid infrastructure.
