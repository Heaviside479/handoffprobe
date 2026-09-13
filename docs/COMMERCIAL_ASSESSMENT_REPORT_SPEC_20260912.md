# HandoffProbe Commercial Assessment Report Specification — 2026-09-12

Status: **DRAFT — CV-4 implementation contract**

This document defines the customer-facing delivery contract for the paid HandoffProbe Founding Security Assessment.

It does not change the public Core finding model, CLI report schema or severity policy.

## 1. Goals

CV-4 must provide a reusable assessment report system that:

- delivers the reviewed assessment in Markdown and PDF;
- reuses HandoffProbe Core finding and severity semantics;
- clearly separates FAIL, PASS, INCONCLUSIVE and ERROR;
- includes scope, out-of-scope surfaces, limitations, findings, evidence, remediation and retest state;
- supports an optional safe JSON attachment;
- prevents raw secrets or unsafe evidence from entering customer deliverables;
- is validated with a fully synthetic end-to-end assessment before customer use.

## 2. Standard delivery package

The standard package is:

1. handoffprobe-security-assessment.md
2. handoffprobe-security-assessment.pdf
3. optional handoffprobe-safe-findings.json

Markdown and PDF must describe the same reviewed assessment.

The JSON attachment is optional and must never be a raw runtime-evidence dump.

## 3. Required report structure

Every standard assessment report must contain:

1. report title and identifier;
2. organization or assessment subject;
3. issue date;
4. HandoffProbe version and tested protocol baseline;
5. executive summary;
6. authorization and agreed assessment boundary;
7. in-scope surfaces;
8. explicit out-of-scope surfaces;
9. prerequisites and environment assumptions;
10. limitations;
11. assessment methodology;
12. result summary;
13. detailed findings;
14. useful PASS observations;
15. scanner or environment errors, if any;
16. remediation priorities;
17. retest state and results;
18. final limitations and non-certification statement.

## 4. Finding contract

Commercial findings derive from existing HandoffProbe Core semantics.

Each customer-facing finding must contain where applicable:

- assessment-local finding identifier;
- source HandoffProbe test ID or other clearly identified assessment source;
- title;
- status;
- severity;
- property class when relevant;
- affected handoff boundary;
- expected security invariant;
- observed behavior;
- evidence summary;
- safe evidence references;
- safe reproduction information;
- security impact within scope;
- recommended remediation;
- retest state;
- retest notes when applicable.

Assessment-local identifiers use this format:

HP-ASMT-F001

They must not replace or mutate stable HandoffProbe attack IDs.

## 5. Status handling

Use the existing HandoffProbe distinctions:

- pass — the tested invariant held;
- fail — the tested invariant was reproducibly violated;
- not_applicable — the required feature or precondition was absent;
- inconclusive — evidence was insufficient to claim PASS or FAIL;
- error — HandoffProbe or the environment could not execute or observe the test correctly.

ERROR must never be presented as a vulnerability.

## 6. Severity handling

Severity remains qualitative and evidence-backed.

The commercial report follows docs/SEVERITY.md.

Do not invent CVE or CVSS values.

Do not increase severity because the report is a paid assessment.

Severity describes demonstrated impact in the tested and authorized context.

## 7. Evidence rules

Allowed customer-facing evidence includes:

- redacted HandoffProbe evidence sequence references;
- safe counts and deterministic references;
- sanitized request and response characteristics;
- protocol and version information;
- safe configuration characteristics;
- hashes or fingerprints when underlying values must remain hidden;
- concise human-reviewed evidence summaries.

Do not include:

- passwords;
- API keys;
- bearer tokens;
- private keys;
- session cookies;
- raw credentials;
- unrestricted environment dumps;
- unrelated application data;
- raw evidence objects merely because they exist;
- unreviewed logs containing customer data.

## 8. Optional safe JSON attachment

The optional JSON attachment is a machine-readable remediation summary.

It uses its own allowlisted commercial schema and is separate from CLI JSON schema version 1.

Required top-level fields:

- schemaVersion;
- reportId;
- handoffProbeVersion;
- protocols;
- scope;
- summary;
- findings.

Allowed finding fields:

- id;
- sourceTestId;
- title;
- status;
- severity;
- propertyClass;
- affectedBoundary;
- expectedInvariant;
- observedBehavior;
- evidenceSummary;
- evidenceRefs;
- impact;
- remediation;
- retest.

Raw runtime evidence and arbitrary passthrough objects are forbidden.

## 9. Retest states

Supported commercial retest states:

- not_started;
- pending_customer_fix;
- passed;
- failed;
- inconclusive;
- not_applicable.

A performed retest records:

- original finding ID;
- retest date;
- tested condition;
- result;
- safe evidence summary;
- remaining limitation if any.

One remediation retest is included in the standard Founding Security Assessment.

## 10. PDF and Markdown consistency

Markdown is the editable review source for the validation assessments.

PDF is rendered from the reviewed report.

The PDF must not silently add, remove or reinterpret findings.

Before delivery:

1. generate Markdown;
2. review scope, findings, evidence and remediation;
3. render PDF;
4. verify headings, tables, page breaks and URLs;
5. verify matching findings and retest state;
6. perform a final no-secrets review.

Commercial PDF generation must not add a runtime dependency to the published HandoffProbe Core package.

## 11. Customer-data handling

Real customer reports, intake exports, raw evidence and customer-specific generated artifacts must not be committed to the public HandoffProbe repository.

Only synthetic fixtures, templates and synthetic generated examples belong in Git.

A local working location for real assessments must be gitignored before customer use.

## 12. Limitations and claims

Every report must state that:

- work covers only the written agreed scope;
- untested surfaces are not implicitly secure;
- results are evidence from the tested context;
- the assessment is not a certification;
- absence of findings does not prove absence of vulnerabilities;
- scanner or environment ERROR is not a vulnerability finding;
- third-party testing requires authorization.

## 13. Planned implementation

CV-4 implementation should add:

- reusable Markdown report template;
- structured synthetic assessment fixture;
- commercial report generator;
- Markdown output;
- PDF rendering outside the published Core runtime contract;
- optional allowlisted safe JSON output;
- tests for structure, status semantics and secret safety;
- one synthetic end-to-end generated assessment package.

## 14. CV-4 exit evidence

CV-4 can be marked complete only when:

- the reusable written template exists;
- Markdown delivery is generated and reviewed;
- PDF delivery is generated and reviewed;
- optional JSON rules are implemented and tested;
- finding ID, severity, evidence, remediation and retest state are represented;
- scope, out-of-scope and limitations are represented;
- generated artifacts pass secret-safety checks;
- a synthetic end-to-end example succeeds;
- no real customer data is committed.
