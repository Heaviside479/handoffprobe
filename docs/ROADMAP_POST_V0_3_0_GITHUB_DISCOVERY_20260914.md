# HandoffProbe — v0.3.0 post-publication and GitHub-native discovery execution

Status: READY FOR EXECUTION — 2026-09-14

This execution note extends the roadmap with the immediate post-v0.3.0 work and is intended to be worked in order.

## Current verified release state

- `package.json` is at `0.3.0`.
- annotated tag `v0.3.0` exists and resolves to release commit `ef54b950b3ee333c406fa81087685d7f952a028d`.
- GitHub Release `HandoffProbe v0.3.0` is public.
- npm publication of `handoffprobe@0.3.0` is founder-confirmed and now needs normal post-publication verification before R3 closeout.
- stable public corpus remains 22 attacks.
- v0.3.0 refines semantic-authority evaluation under stable ID `HP-AUTH-001`; it does not create a new stable attack ID.

## A. R3 post-publication closeout

Work in this order:

- [x] create annotated `v0.3.0` tag after release gates passed;
- [x] publish `handoffprobe@0.3.0` to npm;
- [x] create public GitHub Release `HandoffProbe v0.3.0`;
- [ ] verify npm metadata, dist-tag/version, integrity and published tarball against the intended release;
- [ ] verify a clean external exact-version path: `npm exec --yes --package=handoffprobe@0.3.0 -- handoffprobe --version` and `npm exec --yes --package=handoffprobe@0.3.0 -- handoffprobe test`;
- [ ] verify the reusable GitHub Action from `v0.3.0` in a separate consumer repository;
- [ ] verify the reusable GitHub Action from immutable release commit `ef54b950b3ee333c406fa81087685d7f952a028d` in a separate consumer repository;
- [ ] verify GitHub Marketplace presents the correct v0.3.0 release truth and install/reference path;
- [ ] reconcile README / INSTALLATION / USAGE / supported-version references so they no longer present v0.2.0 as current;
- [ ] update and verify `https://handoffprobe.heaviside-solutions.com` against v0.3.0 release truth;
- [ ] update and verify the HandoffProbe project page on `https://heaviside-solutions.com` against v0.3.0 release truth;
- [ ] record post-publication evidence and mark R3 complete only when all public surfaces agree.

R3 closeout rule: npm publication alone is not enough. The release is complete only when npm, GitHub Release/tag, Action/Marketplace, public docs and both website surfaces describe and execute the same release.

## B. G-1 — GitHub-native discovery and presentation — NON-CODE

Goal: improve discovery and conversion inside GitHub without changing scanner/runtime behavior and without touching `action.yml` in this track.

### Repository About / discovery settings

- [ ] set the repository Website/Homepage field to `https://handoffprobe.heaviside-solutions.com`;
- [ ] review repository Description and prefer a concise value statement such as: `Open-source security testing for AI agent handoffs — test whether security guarantees survive A2A → MCP boundaries.`;
- [ ] verify/focus Topics around the existing high-fit set: `a2a`, `mcp`, `ai-agents`, `agent-security`, `security-testing`, `github-actions`, `security`, `cli`, `typescript`;
- [ ] add or refresh the GitHub social-preview image only if it can be done through repository presentation/settings without changing product code;
- [ ] verify the public repository About block resolves to the intended product website and does not use npm as the primary homepage anymore.

### Marketplace / release presentation

- [ ] inspect the public GitHub Marketplace entry after v0.3.0 publication;
- [ ] verify title, description, current release/reference and install/use path are understandable to a developer in a few seconds;
- [ ] verify the Marketplace path does not imply more than 22 stable attacks or unsupported protocol/product scope;
- [ ] verify the v0.3.0 GitHub Release links to the product website and Founding Security Assessment as appropriate;
- [ ] do not change `action.yml` branding/metadata under G-1. If a Marketplace improvement requires an `action.yml` change, record it as a separate future product-code task requiring explicit founder approval.

### Conversion path

Verify the intended path:

`GitHub Search / Marketplace → HandoffProbe repo/release → exact-version npx or GitHub Action → first deterministic test → product website / assessment only when real authorized help is relevant`

- [ ] ensure GitHub/npm/CLI remain the default destination for developers who only want to try the scanner;
- [ ] use the assessment page only for real authorized assessment demand;
- [ ] do not turn unrelated GitHub issues or maintainer threads into promotional placements;
- [ ] no copy-paste promotion, vote manipulation or unsolicited mass outreach.

### Measurement

Record a clean baseline before/when G-1 settings are changed, then review approximately 7 days later where data is available:

- repository stars/forks/watchers as directional discovery signals only;
- npm downloads as directional distribution evidence, not unique-user counts;
- GitHub/Marketplace/referral signals where natively available;
- assessment-page requests or qualified technical conversations;
- external Action/CI adoption or public integration evidence.

Do not classify views, stars or listing presence alone as adoption or revenue.

## G-1 exit gate

G-1 is complete when the non-code GitHub discovery surfaces point to the product website, the repository description/topics/social presentation are intentionally reviewed, the public Marketplace/release path is checked against v0.3.0 truth, and a measurement baseline is recorded.

No scanner code, `action.yml`, attack definitions, report schema, CLI behavior or release artifact is changed by this track.

## C. What follows

After R3 post-publication closeout and G-1 baseline execution:

1. continue CV-5 directory/product-website conversion work;
2. continue CV-6 first-revenue validation;
3. execute T-2 protocol-neutral Handoff Contract review from the existing roadmap/spec without duplicating T-1;
4. do not admit new attacks or start hosted SaaS without the existing evidence gates.
