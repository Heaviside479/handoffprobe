# P10.1 compatibility baseline

Date: 2026-09-15

Status: **COMPLETE**

## Goal

Define the compatibility baseline that HandoffProbe can support with recorded evidence after the v0.3.0 release.

This record distinguishes supported or validated surfaces from environments that remain unverified. It does not broaden the stable 22-attack corpus or change the published v0.3.0 artifact.

## Runtime compatibility

The package contract remains:

- Node.js `>=24 <25`;
- npm as the package/runtime workflow;
- package version `0.3.0`.

Recorded runtime evidence:

| Environment                              | Evidence status                       |
| ---------------------------------------- | ------------------------------------- |
| Node 24.x                                | Supported package runtime contract    |
| Node 24.17.0                             | Locally verified on macOS             |
| Node below 24                            | Not supported by the package contract |
| Node 25 or newer                         | Not supported by the package contract |
| GitHub-hosted Ubuntu + Node 24           | CI verified                           |
| GitHub-hosted `macos-latest` + Node 24   | CI verified under P10.4 on 2026-09-19 |
| macOS 14.8.9 x86_64 + Node 24.17.0       | Locally validated                     |
| GitHub-hosted `windows-latest` + Node 24 | CI verified under P10.4 on 2026-09-19 |

The current CI quality workflow runs an OS matrix of `ubuntu-latest`, `macos-latest` and `windows-latest` with Node 24. GitHub-hosted macOS and Windows CI were added and validated under P10-4 on 2026-09-19.

The reusable GitHub Action also configures Node 24 and uses `shell: bash`. Existing release evidence therefore supports the current GitHub-hosted Linux Action path. Native Windows Action compatibility is not claimed by this baseline.

## Protocol and fixture compatibility

The released HandoffProbe public protocol baseline remains:

**A2A 1.0 → MCP 2026-07-28**

Current locked implementation dependencies:

| Surface                        | Locked dependency or wire version |
| ------------------------------ | --------------------------------- |
| A2A wire protocol              | `1.0`                             |
| `@a2a-js/sdk`                  | `1.1.0`                           |
| MCP wire protocol              | `2026-07-28`                      |
| `@modelcontextprotocol/client` | `2.0.0`                           |
| `@modelcontextprotocol/server` | `2.0.0`                           |

SDK package versions and protocol wire versions are separate compatibility dimensions. The A2A SDK version `1.1.0` does not change the HandoffProbe wire claim from A2A `1.0`.

The bundled protocol laboratory, P0 fixtures, stable attack metadata and release-facing CLI output consistently pin MCP `2026-07-28`.

## Upstream specification drift review

Reviewed on 2026-09-15.

### A2A

Official sources:

- `https://a2a-protocol.org/dev/specification/`
- `https://github.com/a2aproject/A2A/blob/main/CHANGELOG.md`
- `https://github.com/a2aproject/A2A/blob/main/docs/specification.md`

The A2A specification remains on the `1.0` protocol line.

The specification changelog contains patch release `1.0.1`. A2A versioning explicitly defines the protocol version using `Major.Minor` and states that specification patch versions do not affect protocol compatibility and are not used for protocol negotiation.

Conclusion: no HandoffProbe A2A wire-baseline change is required.

### MCP

Official sources:

- `https://github.com/modelcontextprotocol/modelcontextprotocol/releases`
- `https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/changelog.mdx`

The stable published MCP specification revision remains `2026-07-28`.

Conclusion: no HandoffProbe MCP wire-baseline change is required.

## Compatibility promises

HandoffProbe currently promises only what this evidence supports:

- Node 24.x is the supported Node runtime line.
- The public wire baseline is A2A `1.0` → MCP `2026-07-28`.
- Linux is continuously CI verified through the GitHub-hosted Ubuntu quality workflow.
- macOS is continuously CI verified through the GitHub-hosted `macos-latest` quality workflow and also has a recorded local validation on macOS 14.8.9 x86_64 with Node 24.17.0.
- Windows is continuously CI verified through the GitHub-hosted `windows-latest` quality workflow for the package/repository quality path; native Windows compatibility for the reusable composite GitHub Action is not claimed because that Action uses `shell: bash`.
- Node versions outside `>=24 <25` are not supported.
- Other A2A or MCP protocol versions are not implied to be compatible.
- Platform-aware path handling in individual code paths is not evidence of full platform support.
- Published release tags and artifacts remain immutable.

## P10.1 exit gate

The supported compatibility baseline is now explicit, reproducible and reviewable without relying on undocumented assumptions.

P10.1 is complete. Broader CI platform coverage belongs to P10.4.

## P12.4 v1 freeze reconciliation — 2026-09-22

The P10.1 evidence above remains a historical record of the earlier `0.3.0` / 22-attack baseline.

The current frozen v1 candidate baseline is now:

- source/package version `0.4.0`;
- 23 stable attacks;
- Node.js `>=24 <25`;
- repository CI on `ubuntu-latest`, `macos-latest` and `windows-latest` with Node 24;
- A2A `1.0` -> MCP `2026-07-28`;
- `@a2a-js/sdk@1.1.0`;
- `@modelcontextprotocol/client@2.0.0`;
- `@modelcontextprotocol/server@2.0.0`.

The reusable GitHub Action continues to configure Node 24 and `shell: bash`. Repository/package Windows CI does not independently prove native Windows compatibility for that composite Action.

Other Node lines and other A2A/MCP protocol revisions remain outside the frozen v1 compatibility promise unless separately admitted.

This reconciliation does not rewrite the historical P10.1 evidence and does not authorize a version, runtime or protocol expansion.
