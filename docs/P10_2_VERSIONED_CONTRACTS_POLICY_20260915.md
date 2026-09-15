# P10.2 versioned contracts and compatibility policy

Date: 2026-09-15

Status: **COMPLETE**

## Purpose

Define how HandoffProbe versions its public report and configuration contracts and how future changes are classified before publication.

This policy preserves the released v0.3.0 behavior. It does not modify the published v0.3.0 artifact, the stable 22-attack corpus, the CLI command surface, the package-root API or the A2A 1.0 → MCP 2026-07-28 protocol baseline.

## Contract inventory

The reliability policy applies to these public surfaces:

- CLI commands and options;
- CLI exit codes;
- `handoffprobe.config.json`;
- JSON report output;
- package-root exports;
- GitHub Action inputs and outputs;
- stable HP attack IDs and their security meaning;
- documented protocol and runtime compatibility promises.

## Report schema version 1

The current JSON report schema version is the canonical string `"1"`.

The existing implementation exposes this as `CLI_REPORT_SCHEMA_VERSION`.

Report schema version 1 contains these top-level fields in deterministic order:

1. `schemaVersion`
2. `handoffProbeVersion`
3. `target`
4. `protocols`
5. `selection`
6. `threshold`
7. `summary`
8. `findings`

Existing nested contracts include:

- `protocols.a2a`
- `protocols.mcp`
- `selection.count`
- `selection.attackIds`
- summary counts for `pass`, `fail`, `notApplicable`, `inconclusive`, `error` and `total`
- finding identity, status, severity, property class, invariant, observed behavior and evidence references
- optional finding remediation

Raw internal evidence context, details and provenance are intentionally not serialized into the public JSON report.

### Report schema compatibility rule

A release may continue to claim report schema version `1` only while existing version-1 consumers can rely on the existing field names, types and meanings.

The following require an explicit report-schema version decision:

- removing or renaming a field;
- changing a field type;
- changing the security meaning of a field;
- changing required versus optional semantics;
- restructuring nested objects or arrays in a way that requires consumer adaptation.

Pure wording changes inside human-readable string values do not alone require a schema bump when their documented security meaning is preserved.

A new structural field must be reviewed explicitly before remaining within schema `1`. The default is to version the schema whenever strict consumers could require adaptation.

## Config schema version 1

The existing `handoffprobe.config.json` contract is designated **config schema version `1`**.

The implementation exposes the internal contract identifier as `CLI_CONFIG_SCHEMA_VERSION = "1"`.

Config schema version 1 has exactly these allowed keys:

- `target`
- `tests`
- `failOn`
- `reporter`
- `output`

All keys are optional. Absence of the file is valid and means an empty configuration.

The released v0.3.0 file format has no in-band `schemaVersion` property. That absence is part of the version-1 compatibility baseline and is preserved by P10.2.

Unknown keys are rejected rather than silently ignored.

### Config schema compatibility rule

A future release may continue to claim config schema version `1` only if every currently valid version-1 configuration remains valid with the same meaning.

Because the parser intentionally rejects unknown keys, any new allowed key, new enum value, changed value type, renamed key or changed semantic meaning requires an explicit config-schema compatibility decision.

Introducing an in-band `schemaVersion` property is itself a config-contract change and must not be slipped into a patch release without the required release and migration decision.

## Compatibility classification

Every planned public-contract change must be classified before publication.

### COMPATIBLE

A change is `COMPATIBLE` when existing documented inputs remain valid and existing consumers can continue relying on the documented contract without adaptation.

Examples include:

- bug fixes that restore already documented behavior;
- internal refactoring with unchanged observable contracts;
- security-evaluation refinements that preserve stable HP-ID meaning and external shapes;
- documentation clarification that does not alter runtime meaning.

### DEPRECATED

A change is `DEPRECATED` when a currently supported public surface remains available but is scheduled for replacement or removal.

Deprecation must record:

- the exact deprecated surface;
- the reason;
- the replacement, when one exists;
- the first release carrying the deprecation;
- the earliest release in which removal may occur;
- migration instructions.

Deprecation must not silently change current behavior.

### BREAKING

A change is `BREAKING` when a valid existing input, documented output, public identifier or supported behavior requires consumer adaptation.

Examples include:

- removing or renaming CLI commands or options;
- changing exit-code meaning;
- incompatible report or config schema changes;
- removing package-root exports;
- incompatible GitHub Action input or output changes;
- changing the security meaning of a stable HP attack ID;
- changing a documented compatibility baseline in a way that invalidates existing use.

Before v1.0, an intentional breaking public-contract change requires an evidence-backed minor-release decision. It must never be hidden in a patch release.

Accidental breaking changes are release blockers.

## Direction of compatibility

For configuration inputs, backward compatibility means a newer release that still claims the same config schema accepts every valid configuration from the earlier release with the same meaning.

For report outputs, backward compatibility means a consumer written against the claimed report schema does not require adaptation for a release that continues to emit that same schema version.

Compatibility does not mean that an older HandoffProbe binary must understand configuration features introduced by a newer schema.

## Test and attack deprecation policy

Stable HP attack IDs are public security identifiers and must not be silently repurposed.

When a stable attack is deprecated:

1. retain its ID and existing security meaning during the deprecation window;
2. document the reason and any replacement;
3. preserve deterministic behavior unless a correctness or security defect requires an evidence-backed fix;
4. keep removal separate from the deprecation decision;
5. classify removal as a public-contract change;
6. run normal attack-admission and release discipline for any replacement attack.

The stable attack count must not change merely to satisfy roadmap numbering.

Internal repository test files are not themselves public API. They may be reorganized when equivalent or stronger contract coverage remains.

## Migration expectations

Every intentional breaking schema or CLI change must have a migration record before release.

The migration record must contain:

- affected old contract and version;
- replacement contract and version;
- exact breaking difference;
- before and after examples where practical;
- required user or CI changes;
- effect on CLI, config, reports, Action usage or package API as applicable;
- rollback or pinning guidance when practical;
- SemVer classification;
- release notes reference.

No automated migration should silently guess when multiple interpretations are possible.

If compatibility cannot be demonstrated, publication is blocked until the change is either made compatible or released through the correct breaking-change process.

## Release rules

Patch releases before v1.0 must preserve existing public contracts.

Minor releases before v1.0 may intentionally change public contracts only when the scope is evidence-backed, explicitly classified and accompanied by migration guidance.

Published tags and artifacts remain immutable.

A roadmap milestone number does not force an npm version number.

## P10.2 exit gate

Future changes can now be classified as `COMPATIBLE`, `DEPRECATED` or `BREAKING` before publication.

The report schema and config schema have explicit version-1 contracts, deprecation rules are defined, and migration requirements are documented.
