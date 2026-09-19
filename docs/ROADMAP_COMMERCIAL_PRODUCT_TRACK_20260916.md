# HandoffProbe commercial product track

Status: **ACTIVE — C-1 / Phase 13; C-2 through C-5 remain demand-gated**
Date added: 2026-09-16

## Purpose

This document extends the existing HandoffProbe roadmap with a commercial-product track without replacing, renumbering or weakening any existing phase, release track or technical work package.

The authoritative product principles remain unchanged:

- open-source first;
- local first;
- near-zero infrastructure cost;
- evidence before UI;
- adoption before SaaS;
- service-first commercial validation may run in parallel with open-source maturation;
- no hosted SaaS before repeated organization-level demand.

This track is intentionally additive. T-3 and T-4 are now complete, the T-2.7/Bayu review remains independently waiting for an external response, and the current verified public product is `handoffprobe@0.4.0` with 23 stable attacks. None of those updates weakens the existing Phase 13 commercial-validation or Cloud/SaaS demand gates.

## Relationship to existing roadmap phases

This commercial track overlays the existing roadmap rather than replacing it:

- **C-1** maps to and clarifies Phase 13 commercial validation;
- **C-2 / C-3 / C-4** define the evidence and business gates around Phase 14 HandoffProbe Cloud beta;
- **C-5** clarifies the commercial proof required before or during Phase 15 Enterprise Product expansion;
- **C-6** adds long-term strategic optionality and acquisition-readiness hygiene without making a sale or exit a roadmap requirement.

The existing Phase 13 Cloud / SaaS gate remains binding. HandoffProbe Cloud is not authorized merely because this document exists.

## Current commercial checkpoint — 2026-09-18

- C-1 / Phase 13 commercial validation is active.
- CV-1 commercial web launch is complete.
- CV-2 intake/email path is complete.
- CV-3 payment is prepared and activates just in time after the first accepted written scope.
- CV-4 report delivery is complete with synthetic end-to-end verification.
- CV-5 distribution/conversion work can continue in parallel.
- CV-6 remains the primary commercial proof target: first 3 paid accepted assessments.
- C-2 and hosted recurring-product work remain blocked until the existing demand gates are satisfied.

---

# C-1 — Paid validation before productization

Status: **ACTIVE THROUGH PHASE 13**

## Goal

Learn what real organizations will repeatedly pay HandoffProbe to do before building a recurring software layer.

## Current path

Use the existing Founding Security Assessment and related authorized commercial work to learn:

- which handoff boundaries organizations actually care about;
- which evidence they repeatedly need;
- which parts of delivery are manual today;
- which outputs recur across customers;
- which integrations or private adapters are repeatedly requested;
- which problems are one-off consulting and which are repeatable product needs.

## Evidence to record

For each real organization, record only safe commercial/product evidence such as:

- requested outcome;
- repeated workflow or pain;
- recurring evidence/report need;
- requested integration surface;
- whether the need repeats after the first assessment;
- willingness to pay for repeat delivery;
- whether the same capability appears across independent organizations.

Do not treat views, stars, directory listings, social engagement or free feedback as proof of recurring commercial demand.

## C-1 exit signal

C-1 becomes sufficiently informative when Phase 13 has produced real paid evidence and at least one repeated or clearly recurring organization-level need that can be evaluated under C-2.

---

# C-2 — Recurring-product proof

Status: **CONDITIONAL — DO NOT START PRODUCT BUILDING FROM THIS SECTION ALONE**

## Existing Cloud / SaaS gate remains authoritative

Treat HandoffProbe Cloud as a serious product-development candidate only when either:

- **3 independent organizations** request materially the same centralized capability; or
- **2 paying customers** request the same centralized capability with a credible ongoing use case.

Examples already contemplated by the main roadmap include centralized scan history, scheduled scans, organization policies, GitHub organization integration, evidence retention, SSO/RBAC or audit/compliance exports.

## Additional business-model question

Passing the Cloud gate proves repeated need. It does **not** yet prove what customers will pay for on a recurring basis.

Before a broad Cloud build, answer:

> What repeated organizational job is valuable enough that customers prefer an ongoing product or subscription over repeated manual assessments?

Candidate recurring jobs may include:

- continuous regression detection across handoff changes;
- organization-wide policy enforcement;
- scheduled or event-triggered HandoffProbe runs;
- retained evidence and change history;
- private adapters kept compatible as internal stacks evolve;
- private attack/policy packs maintained over time;
- compliance/audit evidence exports;
- centralized GitHub organization controls;
- team workflows and access control.

Do not assume a dashboard, scan history or generic SaaS UI is itself the paid value.

## C-2 exit gate

Document one narrow recurring product hypothesis backed by qualifying organization-level demand and identify the smallest paid workflow that could test it.

---

# C-3 — HandoffProbe Teams / Cloud minimum product

Status: **CONDITIONAL — ALIGNED WITH PHASE 14**

Build only after the existing Phase 13 Cloud / SaaS gate and C-2 recurring-product proof are satisfied.

## Product rule

The open-source Core remains independently useful. Cloud must add organization-level coordination, retained evidence or recurring workflow value rather than artificially removing Core capabilities.

## Minimum product candidates

Choose only the subset directly supported by observed demand. Candidate capabilities include:

- accounts;
- organizations;
- projects;
- private scan history;
- scheduled scans;
- centralized policies;
- GitHub organization integration;
- alerts;
- evidence retention;
- basic team roles.

Additional candidates are allowed only when backed by the same demand discipline.

## Cost rule

Preserve near-zero infrastructure cost until real customers justify incremental recurring spend. Avoid expensive hosted execution, AI inference or data-retention architecture before the paid workflow requires it.

## Security/privacy rule

The hosted layer must not silently weaken the local-first safety model. Explicitly define what remains local, what is uploaded, retention, tenant isolation, deletion, secrets handling and authorization boundaries before accepting sensitive customer data.

## C-3 exit gate

A smallest viable Teams/Cloud workflow is in real use by qualifying organizations and produces evidence about recurring value rather than merely feature interest.

---

# C-4 — Subscription proof

Status: **CONDITIONAL — NEW COMMERCIAL GATE**

## Goal

Prove recurring willingness to pay before expanding Cloud into a broad SaaS surface.

## Required evidence

Do not call the subscription model validated from one purchase or one month of usage.

Track evidence such as:

- multiple paying organizations;
- repeated use across more than one billing/renewal period where practical;
- retention or explicit renewal intent;
- repeated scans, policy checks, evidence retrieval or private-pack usage;
- expansion from one repository/project/team to more scope;
- which exact capability customers would notice if removed;
- support burden and gross delivery cost;
- whether recurring revenue is software-driven or still mostly founder labor.

## Pricing discipline

Do not freeze long-term pricing before observed value is clear. Test packaging around the recurring job rather than copying generic SaaS tiers.

Possible future packaging may include:

- Team subscription;
- usage/organization-based plan;
- annual enterprise contract;
- recurring private adapter or policy-pack maintenance;
- hybrid subscription + assessment/support.

These are hypotheses, not current public prices.

## C-4 exit gate

The recurring layer demonstrates credible repeat usage and recurring willingness to pay from multiple organizations, with founder/manual service clearly separable from the software value being purchased.

---

# C-5 — Enterprise expansion

Status: **CONDITIONAL — ALIGNED WITH PHASE 15**

## Goal

Add enterprise capabilities only when they unblock larger real contracts or materially reduce organization-level friction.

Candidate capabilities already present in the main roadmap include:

- SSO;
- SCIM if demanded;
- granular RBAC;
- audit logs;
- data-retention controls;
- compliance evidence;
- organization policy packs;
- private adapters;
- private attack packs;
- support SLA;
- enterprise deployment options;
- security/compliance documentation.

## Enterprise rule

Do not build checklist enterprise features speculatively. Tie each major capability to a concrete customer/prospect requirement or a necessary security/compliance prerequisite for accepted business.

## C-5 exit gate

Enterprise features contribute to repeatable paid deployment rather than one-off bespoke implementation only.

---

# C-6 — Strategic optionality and acquisition readiness

Status: **LONG-TERM HYGIENE — NOT AN EXIT COMMITMENT**

## Goal

Preserve the ability to either continue growing HandoffProbe independently or evaluate a future strategic acquisition from a position of strength.

A sale is not a roadmap objective and no valuation or acquisition outcome is assumed.

## Strategic asset quality

Long-term strategic value should come from evidence-backed assets such as:

- respected and actively used open-source Core;
- reproducible CI adoption;
- external contributors and maintainer credibility;
- defensible handoff-security research and corpus quality;
- repeatable protocol/framework integrations;
- recurring commercial customers;
- proprietary organization policy packs, private adapters or enterprise workflow value where appropriate;
- strong brand association with testing security continuity across agent handoffs;
- clean separation between OSS value, recurring software revenue and founder-delivered services.

## Acquisition-readiness hygiene

Maintain clean records over time for:

- repository, trademark/brand and domain ownership;
- third-party licenses and provenance;
- contributor provenance and contribution terms;
- release/tag/package integrity;
- customer contracts and revenue classification;
- security/privacy/compliance documentation;
- infrastructure and vendor dependencies;
- recurring revenue vs. one-time services;
- customer concentration;
- material integrations and adoption evidence;
- IP created for private commercial work and the rights associated with it.

Do not create artificial bureaucracy before it is useful; preserve enough evidence that future diligence does not require reconstructing years of history.

## Strategic decision rule

If a future acquisition approach occurs, evaluate it against the alternative of continuing independently. Do not optimize product decisions for a hypothetical buyer at the expense of current users, security quality or real recurring revenue.

---

# Commercial-track sequencing

The intended sequence is:

1. **now:** continue Phase 10 reliability hardening and real-integration product proof while Phase 13 / C-1 commercial validation runs in parallel; T-3 and T-4 remain closed unless genuinely new evidence justifies a separate follow-up;
2. **C-1:** obtain paid and repeat-use evidence through real authorized organization work, beginning with the first accepted and paid Founding Security Assessments;
3. **C-2:** identify one repeated organization-level job and pass the existing Cloud / SaaS gate;
4. **C-3:** build only the smallest demanded Teams/Cloud workflow;
5. **C-4:** prove recurring use and recurring willingness to pay before broad SaaS expansion;
6. **C-5:** add enterprise capabilities only from real contract/deployment demand;
7. **C-6:** preserve optionality to remain independent or evaluate a strategic transaction later.

## Non-interference guardrails

- T-3 and T-4 are complete; do not reopen them merely to keep a research queue active.
- T-2.7/Bayu remains a separate external-review wait; lack of response must never be treated as validation.
- This document does not authorize a new stable attack, release, SaaS build, pricing change or public claim.
- The current verified public corpus remains 23 attacks at `handoffprobe@0.4.0` unless the normal admission/release process changes it.
- Existing Phase 13, Phase 14 and Phase 15 requirements remain valid.
- No current assessment offer, pricing or public landing-page claim changes merely because this commercial track exists.

## Success condition

The commercial track is successful only if HandoffProbe develops from a useful open-source security tool into a repeatably valuable organization-level product **because real users and paying organizations pull it there**, not because the roadmap predicted a SaaS business in advance.
