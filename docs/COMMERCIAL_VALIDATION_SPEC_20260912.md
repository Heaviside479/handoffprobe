# HandoffProbe Commercial Validation Specification

Status: active  
Decision date: 2026-09-12  
Owner: Heaviside Solutions

## 1. Decision

HandoffProbe starts commercial validation now, in parallel with continued open-source adoption and technical development.

The open-source Core remains free and useful under Apache-2.0. The first revenue path is not a paid CLI or a speculative SaaS layer. It is a high-value, authorized service built around applying HandoffProbe to real agent handoffs.

The initial commercial product is the **HandoffProbe Founding Security Assessment**.

The commercial web presence will use:

`https://handoffprobe.heaviside-solutions.com`

The primary conversion page will be:

`https://handoffprobe.heaviside-solutions.com/security-assessment`

The subdomain is the long-term HandoffProbe product/commercial surface. GitHub and npm remain the canonical open-source code, package and technical-documentation surfaces.

## 2. Commercial principle

Monetize expertise, application, evidence, adapters and organization-specific work without weakening the open-source Core.

Do not introduce artificial limitations into the free scanner merely to force payment.

Do not build HandoffProbe Cloud before repeated organization-level demand exists.

Commercial validation may run before v1.0 because the service is scoped professional work around the current public Core, not a claim that HandoffProbe has reached GA maturity.

## 3. Primary offer — Founding Security Assessment

### Launch price

**EUR 1,490** for each of the first **3 accepted assessments**.

This is a validation price, not a permanent price promise.

After the first three paid assessments, review actual delivery effort, buyer objections, scope quality, conversion and follow-on demand before setting the standard price.

Working post-validation target: **EUR 2,490** for the same standard scope if delivery economics support it.

### Standard scope

One clearly defined, authorized agent / tool handoff boundary.

Examples may include a flow such as:

`Agent A -> A2A -> Agent B / translation layer -> MCP -> Tool`

The exact assessment scope must be accepted in writing before payment and testing.

### Included

- review of the submitted architecture and handoff boundary;
- mapping of the agreed boundary to relevant HandoffProbe test classes;
- relevant deterministic HandoffProbe testing against an authorized test surface;
- manual analysis of handoff/composition-specific behavior;
- evidence-backed findings;
- severity classification;
- technical remediation guidance;
- detailed written assessment report;
- one remediation retest within the agreed scope;
- asynchronous communication by email.

### Delivery format

There is **no mandatory sales call and no mandatory results call**.

The default experience is asynchronous.

The customer receives a detailed written result package, normally including:

- PDF assessment report;
- Markdown assessment report;
- optional safe machine-readable HandoffProbe JSON output where appropriate.

The written report should contain:

1. executive summary;
2. agreed scope and explicit out-of-scope boundaries;
3. architecture / handoff description;
4. protocol and relevant implementation versions;
5. test coverage;
6. findings with severity;
7. reproducible evidence where safe and appropriate;
8. technical remediation guidance;
9. prioritized remediation summary;
10. retest result after the included retest is used.

A finding should be understandable and actionable without requiring a meeting.

### Delivery target

Initial working target: **within 5 business days after payment and after all agreed test prerequisites are available**.

Do not promise a shorter SLA until real delivery data exists.

## 4. Assessment guardrails

Every commercial assessment is limited to systems the customer owns or is explicitly authorized to test.

The request flow must include an explicit authorization confirmation.

Do not request secrets through the public website form.

The website must warn customers not to submit passwords, API keys, tokens, private keys or undisclosed vulnerabilities through the ordinary intake form.

Testing scope and any required access mechanism must be agreed separately and handled according to appropriate security practices.

The assessment is not:

- a certification;
- a guarantee that the full AI system is secure;
- a complete penetration test of unrelated infrastructure;
- permission to test third-party systems;
- a universal AI-security audit;
- a claim that passing individual checks proves total security.

Public wording should describe it as a **security assessment of the agreed agent-handoff scope**.

## 5. Commercial site — minimum launch surface

Launch the commercial site quickly. Do not build a dashboard, customer account system or SaaS application for this phase.

### `/`

Purpose: HandoffProbe product and trust surface.

Primary positioning:

> **Handoffs are trust boundaries.**  
> Test whether your agent security guarantees survive the handoff.

Core proof points may include current verified release truth such as:

- 22 stable attacks;
- Apache-2.0;
- A2A 1.0 -> MCP 2026-07-28 current public baseline;
- CI / GitHub Action support;
- local-first;
- no paid AI service required for Core;
- no signup required for Core.

Primary actions:

- `Run HandoffProbe free` -> npm / GitHub path;
- `Get a Security Assessment` -> `/security-assessment`.

### `/security-assessment`

Purpose: revenue conversion page.

Hero direction:

> **HandoffProbe Security Assessment**  
> Find out whether security guarantees survive your real agent handoffs.

Supporting message:

> We assess an authorized agent or tool handoff using HandoffProbe and provide a detailed written security assessment with reproducible evidence and remediation guidance. Fully asynchronous. No mandatory meeting required.

The launch page must show the Founding Assessment price clearly:

**EUR 1,490 — first 3 accepted assessments**

It must clearly list the included scope and the written-delivery model.

Primary CTA:

`Request an Assessment`

Supporting trust statement:

`Payment is requested only after the scope has been reviewed and accepted.`

### `/security-assessment/received`

Purpose: confirmation after intake submission.

Required message:

- request received;
- scope will be reviewed;
- response will arrive by email;
- accepted requests receive confirmed scope, delivery estimate and payment instructions;
- no meeting is required by default.

## 6. Assessment intake

Keep the public request form short enough to convert while gathering enough information for scope qualification.

Required fields:

- name;
- work email;
- company / organization;
- agent or framework stack;
- handoff / protocol path;
- short description of what should be assessed;
- environment type (local, staging or other authorized test environment);
- explicit authorization checkbox confirming ownership or permission to test.

Optional:

- public repository or architecture-documentation link if safe to share.

The form must state:

`Do not submit passwords, API keys, tokens, private keys or other secrets through this form.`

No phone number is required.

No calendar booking is required.

## 7. Qualification and payment flow

The initial sales flow is intentionally human-reviewed and low-infrastructure:

1. request submitted;
2. Heaviside Solutions reviews product fit, authorization and scope clarity;
3. if suitable, customer receives a written scope confirmation by email;
4. email states the exact boundary, price, prerequisites and delivery estimate;
5. customer receives a secure Stripe payment link only after scope acceptance;
6. standard Founding Assessment is paid **100% before assessment work begins**;
7. testing and analysis are completed;
8. written report package is delivered by email;
9. customer may implement remediation;
10. one included retest is performed and documented;
11. relevant follow-on work may be offered only when there is a real need.

Do not build automated quoting, subscription billing or customer accounts for the first validation customers.

## 8. Secondary paid offers

These are valid follow-on offers, but the Founding Security Assessment remains the primary conversion product at launch.

### Custom Adapter

Working launch anchor: **from EUR 1,500**.

Use for proprietary or currently unsupported integration surfaces where there is a legitimate HandoffProbe-specific boundary and the work does not distort Core scope.

### Private Test Pack

Working launch anchor: **from EUR 1,500**.

Use for organization-specific handoff invariants and regression cases.

### Extended Assessment

Custom quote for multiple handoff boundaries or materially more complex scope.

Working pricing hypotheses after standard-scope validation:

- additional agreed handoff boundary: approximately **+ EUR 750**;
- additional retest beyond the included retest: approximately **+ EUR 390**.

These are hypotheses to validate, not permanent public commitments.

Do not offer express delivery until normal delivery effort is measured.

## 9. Written report quality bar

The report is part of the paid product, not an afterthought.

Each finding should include, where applicable:

- finding identifier;
- severity;
- affected handoff boundary;
- expected security invariant;
- observed behavior;
- evidence summary;
- safe reproduction information;
- security impact within scope;
- recommended remediation;
- retest state when applicable.

The report must clearly distinguish:

- PASS / expected behavior;
- security FAIL / observed invariant failure;
- scanner or environment ERROR;
- limitations and untested surfaces.

Never turn scanner/runtime ERROR into a vulnerability claim.

## 10. Distribution funnel

Primary funnel:

```text
GitHub / npm / Peerlist / AlternativeTo / technical discussions
                         |
                         v
        handoffprobe.heaviside-solutions.com
                         |
                         v
             Security Assessment page
                         |
                         v
                  Request form
                         |
                         v
              Qualified written scope
                         |
                         v
               Stripe payment link
                         |
                         v
                  Paid assessment
                         |
                         v
              Written report + retest
                         |
                         v
     Adapter / private pack / extended work if needed
```

GitHub and npm commercial CTAs should point to the assessment page once the subdomain and intake flow are live.

Use source-aware URLs / UTMs where practical so the origin of qualified demand can be measured.

Do not force commercial links into unrelated technical conversations.

## 11. GitHub and npm conversion updates

After the assessment page is live and tested:

- update the README commercial-support section to point directly to the assessment page;
- retain GitHub as the canonical source repository;
- retain npm as the canonical package/install surface;
- make the commercial path visible without weakening the open-source positioning;
- update npm-visible README copy through the normal package/release process only when appropriate;
- do not republish an npm version solely to change a marketing link unless release policy justifies it.

Preferred CTA concept:

> Need help testing a real agent system? Heaviside Solutions offers authorized HandoffProbe Security Assessments with evidence-backed findings, detailed written remediation guidance and one retest.

Primary destination:

`https://handoffprobe.heaviside-solutions.com/security-assessment`

## 12. Analytics and commercial metrics

Keep analytics focused on the revenue funnel.

Desired events:

- `assessment_page_view`;
- `assessment_cta_click`;
- `assessment_form_start`;
- `assessment_form_submit`;
- `assessment_scope_accepted`;
- `assessment_payment_sent`;
- `assessment_paid`;
- `assessment_delivered`;
- `assessment_retest_completed`.

The most important commercial conversion is:

`qualified assessment request -> accepted scope -> paid assessment`

npm downloads, GitHub stars and directory views remain discovery/adoption signals, not revenue by themselves.

## 13. Commercial validation work packages

### CV-0 — contract freeze

- [x] commercial direction selected;
- [x] open-source Core remains free;
- [x] service-first monetization selected;
- [x] subdomain selected: `handoffprobe.heaviside-solutions.com`;
- [x] asynchronous written-results model selected;
- [x] Founding Assessment price hypothesis selected: EUR 1,490 for first 3 accepted assessments;
- [x] no mandatory call requirement;
- [x] one included retest selected;
- [x] no SaaS build required for launch.

### CV-1 — commercial web launch

- [ ] decide the safest deployment/repository placement for the commercial site without contaminating the published npm/Core surface;
- [ ] configure Vercel project and `handoffprobe.heaviside-solutions.com` DNS;
- [ ] build `/`;
- [ ] build `/security-assessment`;
- [ ] build `/security-assessment/received`;
- [ ] implement responsive, accessible design;
- [ ] show current release truth only;
- [ ] include legal / privacy links appropriate for the intake flow;
- [ ] verify production SSL and canonical URLs.

### CV-2 — intake and email path

- [ ] implement assessment request form;
- [ ] enforce required authorization confirmation;
- [ ] add no-secrets warning;
- [ ] route submissions to a controlled Heaviside Solutions inbox or approved backend;
- [ ] send customer confirmation email;
- [ ] test failure handling and spam/abuse controls;
- [ ] ensure sensitive disclosure is redirected to the existing security policy rather than ordinary intake.

### CV-3 — payment path

- [ ] create the Founding Assessment product/payment mechanism in Stripe after the scope flow is ready;
- [ ] use a manual secure payment link after written scope acceptance;
- [ ] collect 100% before standard assessment work begins;
- [ ] document payment/refund/cancellation handling before the first payment;
- [ ] do not add subscriptions or automatic recurring billing in this phase.

### CV-4 — report delivery system

- [ ] create a reusable written assessment report template;
- [ ] support PDF + Markdown delivery;
- [ ] define optional safe JSON attachment rules;
- [ ] define finding ID, severity, evidence, remediation and retest sections;
- [ ] define explicit scope / out-of-scope and limitations sections;
- [ ] test a synthetic end-to-end example before a customer delivery.

### CV-5 — distribution conversion

Only after CV-1 through CV-3 are live and verified:

- [ ] update GitHub README commercial CTA;
- [ ] update HandoffProbe project / portfolio links where appropriate;
- [ ] update future npm/release-visible commercial link through normal release discipline;
- [ ] use the subdomain as the product website in future directories where allowed;
- [ ] keep technical-community promotion value-first and non-spammy.

### CV-6 — first revenue validation

Target: first **3 paid accepted assessments**.

For each one record:

- acquisition source;
- request-to-qualification outcome;
- objections / questions;
- agreed handoff scope;
- delivery effort;
- testing effort;
- report effort;
- retest effort;
- price acceptance;
- requested follow-on work;
- whether a repeated product need emerges.

After three paid assessments, explicitly decide:

- whether the standard price should move toward EUR 2,490;
- whether scope should become narrower or broader;
- whether Custom Adapter / Private Test Pack demand is real;
- whether any repeatable onboarding or reporting work should be productized.

## 14. Cloud / SaaS gate

Do not build HandoffProbe Cloud merely because commercial validation has started.

A hosted/team product becomes a serious product-development candidate only after repeated centralized-operation demand exists.

Strong trigger examples:

- **3 independent organizations** request materially the same centralized capability; or
- **2 paying customers** request the same central feature and have a credible ongoing use case.

Examples of qualifying demand:

- centralized scan history;
- scheduled scans across repositories;
- organization policy management;
- GitHub organization integration;
- team evidence retention;
- SSO / RBAC;
- audit / compliance export needs.

Until a gate is met, prefer services and the open-source Core over speculative Cloud work.

## 15. Success criteria

Commercial validation succeeds when HandoffProbe demonstrates real willingness to pay around the Core.

Near-term success signals, in priority order:

1. one qualified assessment request;
2. one accepted written scope;
3. first paid assessment;
4. first completed written report and retest;
5. three paid assessments;
6. repeat or follow-on paid work;
7. repeated organization-level demand that justifies a productized commercial layer.

The first paid assessment is more commercially meaningful than a large number of unqualified page views.

## 16. Explicit non-goals for this phase

- paid CLI tier;
- crippled Community Edition;
- attack IDs hidden behind a generic paywall;
- mandatory sales calls;
- mandatory results calls;
- customer dashboard;
- user accounts;
- recurring SaaS subscription;
- automated quoting engine;
- speculative SSO/RBAC;
- broad generic AI-security consultancy positioning;
- unauthorized third-party testing;
- security certification claims;
- guarantees that an assessed system is fully secure.

## 17. Exit gate

This commercial-validation specification is complete when:

- the commercial subdomain and assessment conversion path are live;
- the intake and authorization flow is verified;
- a written scope can be accepted cleanly;
- secure payment can be requested after scope acceptance;
- the written report/retest delivery process is ready;
- GitHub and other approved discovery surfaces can route qualified users into the funnel;
- at least one real paid assessment has been completed, after which the plan is updated from measured delivery evidence.

The broader Phase 13 commercial-validation gate remains: **real organizations demonstrate willingness to pay**.
