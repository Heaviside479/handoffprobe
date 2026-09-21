# HandoffProbe

**Open-source adversarial security testing for AI agent handoffs.**

HandoffProbe tests whether security properties survive when an AI-agent action crosses protocol and execution boundaries.

A system can be valid at the A2A layer and valid at the MCP layer while the composed handoff still loses authority, identity, approval, target or lifecycle constraints.

Current deterministic protocol baseline:

**A2A 1.0 → MCP 2026-07-28**

HandoffProbe is local-first, deterministic and open source. The bundled test path requires no paid AI service, telemetry or signup.

## Current release

| | |
| --- | --- |
| Release | `handoffprobe@0.4.0` |
| Stable corpus | **23 stable attacks total** |
| Composition | 12 P0 + 10 P1 + 1 advanced |
| Latest stable addition | `HP-AUTH-006` |
| Protocol baseline | A2A 1.0 → MCP 2026-07-28 |
| Report schema | `1` |
| Node.js | `>=24 <25` |
| License | Apache-2.0 |

Release metadata for this source/package is **`handoffprobe@0.4.0`**.

HandoffProbe v0.4.0 is the current verified public release. The package, `v0.4.0` tag, GitHub Release and reusable Action were verified after publication.

## What HandoffProbe tests

~~~text
Human / calling service
        |
        v
     Agent A
        | A2A
        v
     Agent B / translation layer
        | MCP
        v
       Tool
~~~

The stable corpus tests handoff properties including:

- delegated authority and authorization freshness;
- principal and agent identity continuity;
- tenant and resource binding;
- approval and consent continuity;
- credential audience;
- replay and retry behavior;
- cancellation and lifecycle propagation;
- cross-protocol audit lineage.

The admission rule is intentionally narrow: a stable HandoffProbe test must exercise a security property that can be lost because a handoff composes or translates protocol/security context.

HandoffProbe is not intended to replace the official A2A conformance/inspection tools, MCP Inspector, a generic LLM red-team platform, an identity provider or a production runtime firewall.

The current support boundary and product non-claims are documented in [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md).

## Quick start

Requirements:

- Node.js `>=24 <25`;
- npm.

Run the exact verified public release:

~~~bash
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe --version
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe test
~~~

Expected secure high-level result:

~~~text
Target: secure
Protocols: A2A 1.0 | MCP 2026-07-28
Selected attacks: 23

Summary:
  PASS: 23
  FAIL: 0
  ERROR: 0
  TOTAL: 23

Security gate: PASS
~~~

The default target is a bundled synthetic secure fixture.

### Reproduce a handoff failure

Run the intentionally vulnerable `HP-AUTH-001` demonstration:

~~~bash
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe test --target vulnerable --test HP-AUTH-001
~~~

Expected finding:

~~~text
FAIL           HP-AUTH-001 Delegated authority amplification [HIGH]

Security gate: FAIL
~~~

A security exit code `1` means HandoffProbe completed correctly and detected a qualifying security failure. It is not a scanner crash.

The current release also includes `HP-AUTH-006 — Stale task authorization reused for later effect`, which verifies that an earlier successful authorization cannot silently authorize a later distinct protected effect after the governing authority becomes non-current.

## CLI

The stable command surface is:

~~~text
handoffprobe test [options]
handoffprobe list
handoffprobe explain <HP-ID>
handoffprobe --version
handoffprobe --help
~~~

The full CLI contract — including attack selection, severity thresholds, configuration, terminal/JSON/Markdown reporters, output files, exit codes and troubleshooting — lives in:

- [`docs/USAGE.md`](docs/USAGE.md)
- [`docs/CLI_SPECIFICATION.md`](docs/CLI_SPECIFICATION.md)
- [`docs/INSTALLATION.md`](docs/INSTALLATION.md)
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md)

Keeping those details in their canonical documents avoids duplicating a second CLI manual in the repository landing page and npm README.

## GitHub Action

HandoffProbe includes a **source-backed composite GitHub Action** in [`action.yml`](action.yml).

For security-sensitive use, pin the Action to the reviewed immutable v0.4.0 release commit:

~~~yaml
name: HandoffProbe

on:
  pull_request:

permissions:
  contents: read

jobs:
  handoffprobe:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd
        with:
          persist-credentials: false

      - uses: Heaviside479/handoffprobe@8ffdbec95e8ebe6fe1db1f3c2151d571461d596d
        with:
          target: secure
          fail-on: high
          artifact-name: handoffprobe-report
~~~

The pin above is the reviewed exact release commit for HandoffProbe v0.4.0.

The human-readable `v0.4.0` tag is useful for discovery; immutable commit-SHA pinning is the stronger supply-chain choice.

For all Action inputs, outputs, artifact behavior, exit semantics and CI integration details, see [`docs/GITHUB_INTEGRATION_SPECIFICATION.md`](docs/GITHUB_INTEGRATION_SPECIFICATION.md).

## External technical evidence

HandoffProbe treats research provenance as part of the product rather than as marketing material.

[`EVIDENCE.md`](EVIDENCE.md) records external technical inputs, reproducible HandoffProbe results, external response state and scope limitations.

Historical reproducible example:

[Reproduzierbarer Research-Fall HP-AUTH-001](docs/PHASE8_RESEARCH_CASE_HP_AUTH_001_20260831.md)

A HandoffProbe reproduction is not automatically external confirmation. Silence is not treated as agreement, and research results are not promoted to stable attacks without the normal overlap, evidence and admission process.

The project deliberately preserves historical research and release records instead of rewriting old snapshot facts to match the newest release.

## Safety

Use HandoffProbe only against:

- bundled synthetic fixtures;
- systems you own;
- controlled staging/test environments;
- targets for which you have explicit authorization.

Bundled fixtures use harmless synthetic effects. Reports apply secret redaction and avoid exposing raw evidence context unnecessarily.

Do not put credentials, private customer data or undisclosed vulnerabilities into public issues.

See [`SECURITY.md`](SECURITY.md) for authorized-use and disclosure rules.

## Commercial support

HandoffProbe Core remains free and open source under Apache-2.0.

Teams that want HandoffProbe applied to a real authorized agent/tool boundary can request a **Founding Security Assessment** from Heaviside Solutions.

The standard founding scope covers one agreed handoff boundary and includes written evidence-backed findings, remediation guidance and one retest.

- [HandoffProbe product website](https://handoffprobe.heaviside-solutions.com)
- [Request a Founding Security Assessment](https://handoffprobe.heaviside-solutions.com/security-assessment)

Custom adapters, private test packs and broader authorized assessment work remain possible when justified by real demand.

## Opt-in adoption and integration feedback

HandoffProbe does not collect hidden usage telemetry.

If you choose to share real usage or integration demand:

- [Share adoption / integration feedback](https://github.com/Heaviside479/handoffprobe/issues/new?template=adoption-feedback.yml)
- [Request an adapter / integration](https://github.com/Heaviside479/handoffprobe/issues/new?template=adapter-request.yml)

These reports are public and optional. An adapter request is evidence for evaluation; it does not guarantee implementation.

Do not include secrets, private data or undisclosed vulnerabilities in these forms.

## Contributing

Small, reproducible and safely testable contributions are preferred.

- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [Contributor-Quickstart](docs/PHASE8_CONTRIBUTOR_LOOP_20260831.md)

Stable attack proposals should identify the handoff-specific invariant, secure behavior, failure condition, protocol applicability, evidence requirements and provenance.

## Documentation

For the complete documentation map, see the [full documentation index](docs/README.md).

Current product documentation:

- [Installation](docs/INSTALLATION.md)
- [Usage](docs/USAGE.md)
- [Upgrading](docs/UPGRADING.md)
- [Migration guide](docs/MIGRATION.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [FAQ](docs/FAQ.md)
- [Attack catalog](docs/ATTACK_CATALOG.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Threat model](docs/THREAT_MODEL.md)
- [Limitations](docs/LIMITATIONS.md)
- [CLI specification](docs/CLI_SPECIFICATION.md)
- [GitHub integration specification](docs/GITHUB_INTEGRATION_SPECIFICATION.md)
- [Evidence index](EVIDENCE.md)
- [Roadmap](docs/ROADMAP.md)
- [Product definition](docs/PRODUCT.md)
- [Mature-product definition](docs/FINAL_PRODUCT_DEFINITION.md)

Historical v0.1 research/release records remain available in
[`docs/RESEARCH_ARTICLE.md`](docs/RESEARCH_ARTICLE.md),
[`docs/LAUNCH_EXAMPLES.md`](docs/LAUNCH_EXAMPLES.md) and
[`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md).

The repository cleanup and current-state reconciliation track is recorded in
[`docs/REPOSITORY_CLEANUP_PLAN_20260918.md`](docs/REPOSITORY_CLEANUP_PLAN_20260918.md).

## Principles

- Local-first.
- Open-source Core under Apache-2.0.
- Deterministic evidence before heuristic judgement.
- No paid AI API required for the bundled Core path.
- Safe and explicitly authorized testing only.
- Stable attack IDs require evidence-backed admission.
- Research provenance and limitations stay visible.
- Real integration demand should drive adapter expansion.
- Cloud/SaaS remains demand-gated.

## License

Apache License 2.0. See [`LICENSE`](LICENSE).
