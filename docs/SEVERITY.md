# Finding Classification and Severity

BridgeBreak should not assign dramatic severity labels without evidence. Severity describes the demonstrated composition impact in the tested fixture/context; it is not automatically a CVSS score for every real deployment.

## Finding status

- `pass` — invariant held under the test
- `fail` — invariant was reproducibly violated
- `not_applicable` — required protocol/feature/precondition is absent
- `inconclusive` — evidence is insufficient to claim pass or fail
- `error` — BridgeBreak could not execute/observe the test correctly

`error` must never be presented as a security failure.

## Property class

- `spec_required` — tied directly to normative MUST/MUST NOT behavior
- `spec_recommended` — tied to SHOULD/SHOULD NOT guidance
- `hardening` — defensive best practice beyond protocol requirements
- `composition_responsibility` — end-to-end security property not cleanly owned by a single protocol

This distinction prevents BridgeBreak from incorrectly calling every composition gap a protocol violation.

## Suggested severity dimensions

Severity should consider:

1. **Authority delta** — how much additional privilege/action became possible?
2. **Side-effect impact** — read-only, data mutation, external action, destructive/financial/admin effect.
3. **Binding bypass** — identity, tenant, tool, resource, amount/recipient or consent constraints bypassed.
4. **Exploit preconditions** — trusted caller only vs attacker-influenced input/context.
5. **Repeatability** — deterministic, race-dependent or highly environment-specific.
6. **Blast radius** — single task/resource vs cross-tenant/systemic.

## Default qualitative guide

### Critical

Use sparingly for demonstrated composition failures enabling broad unauthorized destructive/admin/financial action, cross-tenant compromise or equivalent high-impact authority amplification with realistic preconditions.

### High

Unauthorized protected mutation/action, meaningful privilege escalation, credential crossing with actionable impact, or repeatable bypass of important consent/resource boundaries.

### Medium

Security-context loss or misuse with meaningful but constrained impact, strong preconditions, or limited scope.

### Low

Defense-in-depth weakness, audit degradation or low-impact leakage without a demonstrated protected action.

### Info

Observation/recommendation with no demonstrated security invariant violation.

## External mappings

BridgeBreak may attach:

- OWASP Agentic Application risk IDs
- CWE identifiers
- relevant protocol-spec references

Do not invent a CVE or CVSS score. If a real vulnerability is responsibly disclosed, use the affected project's/security authority's final identifiers and scoring where appropriate.
