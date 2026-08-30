# Phase 8.3A — Adapter Demand Research

Status: completed 2026-08-30

Repository baseline: `58c5377a18a37f6c06d4a6c481bb24d968f1143c`

## Purpose

Phase 8.3A ranks possible HandoffProbe adapters from real ecosystem evidence before any adapter implementation begins.

The ranking follows the Phase 8 admission criteria:

- meaningful handoff/composition path;
- real user, integration, or research evidence;
- handoff-specific security value rather than generic single-protocol scanning;
- deterministic local or explicitly authorized reproducibility;
- understood maintenance and versioning risk;
- no paid infrastructure requirement for the open-source core.

An ecosystem issue, sample, or framework capability is evidence to evaluate. It is not automatically evidence that a HandoffProbe user requested that adapter.

## HandoffProbe direct-demand snapshot

At the 2026-08-30 research snapshot, the new public opt-in channels had no external HandoffProbe issues titled with the `[Adapter]` or `[Adoption]` prefixes.

Therefore:

- no direct HandoffProbe-user adapter request is claimed;
- no direct HandoffProbe repeat-use report is claimed;
- the ranking below relies on public ecosystem and research evidence;
- maintainer-created synthetic audit repositories remain excluded from independent-adoption evidence.

## Ranking summary

| Rank | Candidate | Handoff security value | Demonstrated ecosystem demand | Local reproducibility | Maintenance/version risk | No-paid core path | Decision |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | Google ADK A2A agent with MCP toolset | Strong | Strong | Strong in principle; local probe still required | Medium-high | Strong in principle | First 8.3B admission candidate |
| 2 | IBM ContextForge A2A/MCP gateway path | Strong | Strong | Strong but operationally heavier | High | Strong | Research alternative |
| 3 | tRPC-Agent-Go A2A + MCP | Strong | Moderate | Strong | High protocol churn | Strong | Watch; demand evidence weaker |
| 4 | LangGraph A2A→MCP sample path | Strong | Moderate | Weak in current public sample | Medium | Weak in current public sample | Evidence only for now |
| 5 | fast-agent A2A + MCP | Moderate-strong | Weak for this exact boundary | Strong | Medium | Strong | Do not admit without demand |

The ranking is ordinal, not a synthetic user-count score.

## Rank 1 — Google ADK

### Evidence

`google/adk-python#5729` documents a real `to_a2a()` multi-agent deployment in which each A2A sub-agent owns one or more `McpToolset` sessions.

The report includes:

- an explicit A2A manager → A2A sub-agent → MCP tool path;
- production measurements;
- a minimal reproduction;
- tool discovery/session failures that cause MCP tools to disappear from the A2A-served agent;
- a hard A2A request failure after a tool becomes unavailable;
- a model-independent transport explanation.

This is direct evidence that the A2A→MCP composition boundary has real integration failure modes.

The issue was reported against ADK 1.33.0 and marked completed on 2026-07-29.

### Security value

The highest-value HandoffProbe properties for this candidate are not generic MCP availability checks.

The adapter can exercise whether cross-boundary properties survive A2A delegation into an MCP-capable agent, including:

- delegated authority;
- principal and user identity continuity;
- tenant continuity;
- credential audience and credential forwarding;
- resource/tool binding;
- approval context;
- retry/cancellation identity;
- audit lineage;
- deterministic handling when the MCP tool surface changes or becomes incomplete.

Tool-discovery transport reliability by itself is not sufficient HandoffProbe scope. It matters only where it causes a handoff/composition security invariant to be lost or misrepresented.

### Deterministic and no-paid feasibility

At Google ADK source commit `6d145180611956b2065704189517fd6a0ff1a063`:

- `BaseLlm` is a public abstraction that can be subclassed;
- ADK's own unit-test utility defines a deterministic `MockModel(BaseLlm)` with predefined responses;
- current package metadata exposes the A2A extra as `a2a-sdk[http-server]>=0.3.4,<2`;
- current package metadata includes `mcp>=1.24,<2` in the full runtime feature set.

This demonstrates that the model layer does not inherently require a paid Gemini/OpenAI call for a deterministic fixture.

HandoffProbe must not import Google's internal test helper as a production dependency. A future fixture can implement its own minimal deterministic `BaseLlm` subclass using the public abstraction.

The exact ADK/A2A/MCP version tuple and the local MCP fixture must still be executed in an isolated Phase 8.3B admission probe before implementation is authorized.

### Maintenance risk

ADK is moving quickly. The #5729 report itself describes behavior that changed across ADK releases, and the current dependency ranges span multiple A2A/MCP SDK versions.

Therefore an ADK adapter must:

- pin a tested framework version;
- state the tested A2A/MCP protocol compatibility;
- avoid binding HandoffProbe core abstractions to ADK internals;
- keep the framework-specific layer replaceable;
- fail closed when an unsupported version is detected.

## Rank 2 — IBM ContextForge

### Evidence

`IBM/mcp-context-forge#3621` reports a client-identified multi-agent orchestration problem: the original caller authentication context was not propagated through the chain.

The requested end-to-end identity path is:

`Caller → ContextForge → Orchestrator → ContextForge → Specialist Agent`

The issue explicitly asks for authorization-header passthrough and original-subject propagation for audit/governance.

Additional ContextForge security work covers A2A visibility, permissions, agent invocation, credential injection, token exchange, and delegation flows.

### Why it ranks second

This is exceptionally strong evidence for HandoffProbe's identity, delegation, credential-audience, tenant and audit-lineage properties.

It ranks below ADK for the first adapter because ContextForge is a larger gateway/platform integration surface with more deployment/runtime modes. That raises adapter maintenance and fixture complexity even though the security value is excellent and a local no-paid path is plausible.

ContextForge remains a strong candidate for a later research case or adapter if ADK fails its local admission probe.

## Rank 3 — tRPC-Agent-Go

At source commit `91bde85eb243333b2b33fe89061f2218ede00c99`, tRPC-Agent-Go contains first-class A2A and MCP surfaces and many local examples.

Its module metadata includes both:

- `trpc-a2a-go` 0.x;
- `trpc-a2a-go/v2` at an alpha 2.x revision;
- `trpc-mcp-go` 0.x.

The framework is credible and locally reproducible, but the simultaneous old/new A2A dependency families indicate protocol/version churn. The research snapshot also did not find handoff-specific security demand comparable to ADK #5729 or ContextForge #3621.

Do not implement this adapter from framework breadth alone.

## Rank 4 — LangGraph A2A→MCP paths

`a2aproject/a2a-samples#169` is an open request for an A2A-MCP example using LangGraph.

A public MongoDB developer sample, `mongodb-developer/a2a-mcp-mongodb-multiagents`, demonstrates a real architecture with an A2A host/routing path, LangGraph ReAct agent, and MCP scheduling server.

However, that public sample currently requires external configuration including MongoDB plus model/embedding API credentials. As-is, it does not satisfy HandoffProbe's deterministic no-paid fixture gate.

This is meaningful demand evidence but not yet the best first adapter.

## Rank 5 — fast-agent

At source commit `9be5169888688b280b411875d28f7221405c625d`, fast-agent advertises MCP/ACP/A2A support and pins both `mcp==2.0.0` and `a2a-sdk==1.1.0`.

Its local/testing design is attractive for reproducibility, but this research snapshot found no comparable public issue demonstrating handoff-specific A2A→MCP security or integration demand.

Technical convenience without demand is insufficient for Phase 8 admission.

## Evidence that does not admit an adapter by itself

The A2A ecosystem contains prompt-injection reports, generic MCP failures, transport bugs, framework feature breadth, stars, downloads, and sample repositories.

These can inform research, but they do not automatically admit an adapter.

In particular:

- a generic prompt-injection scanner remains outside HandoffProbe scope;
- generic MCP-only correctness remains outside the adapter admission gate;
- framework popularity is not a substitute for a handoff-specific invariant;
- one public sample is not proof of repeat HandoffProbe usage.

## Phase 8.3A decision

Google ADK is the first-ranked candidate for an admission probe.

This is not yet authorization to implement an ADK adapter.

Before Phase 8.3B writes framework adapter code, an isolated local probe must demonstrate all of the following together:

1. a pinned ADK version;
2. a stated A2A 1.x-compatible path and mapped MCP protocol behavior;
3. a local A2A agent served through ADK;
4. a local MCP server/tool fixture;
5. a HandoffProbe-relevant security context that crosses the A2A→MCP boundary;
6. a deterministic model substitute with no paid model API;
7. no unauthorized third-party activity;
8. a stable observation surface suitable for PASS/FAIL assertions;
9. maintenance/version risks documented;
10. no change to the already-published `handoffprobe@0.1.0` artifact.

If that probe fails, do not force an ADK adapter. Re-evaluate ContextForge as the next candidate.

## Next work package

Phase 8.3B remains open and evidence-gated.

Its first action is an isolated, read-only-to-HandoffProbe ADK admission probe. Adapter implementation begins only if the probe satisfies every admission condition.

No scanner behavior, attack behavior, protocol baseline, report schema, `action.yml`, package metadata, or already-published `handoffprobe@0.1.0` artifact is changed by Phase 8.3A.
