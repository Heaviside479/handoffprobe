# HandoffProbe v0.1 Release Checklist

Status: in progress

Target release: `handoffprobe@0.1.0` / `v0.1.0`

## Locked identity

- [x] package `handoffprobe`
- [x] version `0.1.0`
- [x] Node `>=24 <25`
- [x] stable corpus: exactly 22 attacks
- [x] report schema `1`
- [x] candidate baseline A2A 1.0 -> MCP 2026-07-28
- [x] installation, usage, research and launch docs added

## Publication state

- [ ] npm package publicly published
- [ ] public npm registry verified
- [ ] annotated `v0.1.0` tag created
- [ ] GitHub release `v0.1.0` created
- [ ] public npx smoke tests complete

## 7.2A Upstream drift review

- [ ] verify latest released A2A version and security-relevant changes
- [ ] verify relevant A2A SDK/reference state
- [ ] verify MCP 2026-07-28 remains the intended released baseline
- [ ] review MCP changes/roadmap after 2026-07-28
- [ ] verify relevant Tier 1 MCP SDK state
- [ ] review AgentRFC and AgentThread source versions
- [ ] classify drift as no-impact, documentation-only, test-impact or release-blocking
- [ ] record URLs, dates and conclusions
- [ ] update `docs/RESEARCH_BASELINE.md` if needed

## 7.2B Local release-candidate gate

- [ ] exact RC commit recorded
- [ ] `npm run check` passes
- [ ] secure target is 22 PASS / 0 FAIL / 0 ERROR
- [ ] vulnerable corpus remains reproducible
- [ ] `HP-AUTH-001` exits `1`
- [ ] `npm audit --audit-level=high` passes
- [ ] secret safety passes
- [ ] `npm run package:check` passes
- [ ] exact tarball tested outside repository
- [ ] tarball CLI reports `HandoffProbe 0.1.0`
- [ ] tarball list exposes exactly 22 stable IDs
- [ ] tarball JSO`stays machine-readable

Release artifact evidence:

- tarball filename: `TBD`
- package size: `TBD`
- unpacked size: `TBD`
- file count: `TBD`
- npm shasum: `TBD`
- npm integrity: `TBD`
- local SHA-256: `TBD`
- release-candidate commit: `TBD`

## 7.2C Protected remote PR gate and merge

- [ ] PR #12 final body/evidence updated
- [ ] PR #12 marked ready only after local RC acceptance
- [ ] HandoffProbe, Quality and Dependency Review pass
- [ ] secure artifact is 22 PASS / 0 FAIL / 0 ERROR
- [ ] branch protection remains strict with admin enforcement
- [ ] protected merge uses exact expected head SHA
- [ ] merge commit parents verified

## 7.3A Post-merge release rebuild

- [ ] local `main` equals `origin/main`
- [ ] post-merge HandoffProbe and Quality pass
- [ ] secure post-merge artifact verified
- [ ] exact tarball rebuilt from protected `main`
- [ ] rebuilt digest recorded

## 7.3B npm publication

- [ ] re-check npm name immediately before publish
- [ ] verify intended npm account
- [ ] authenticate and satisfy 2FA interactively
- [ ] publish exactly `handoffprobe@0.1.0`
- [ ] verify `npm view handoffprobe@0.1.0`
- [ ] install registry package in clean temporary directory
- [ ] public version, secure and vulnerable smoke tests pass

Security rule: do not paste OTP, password or token into logs/chat.

## 7.4A Git tag and GitHub release

Only after npm verification:

- [ ] create annotated `v0.1.0` on exact release commit
- [ ] verify and push only that tag
- [ ] create non-draft GitHub release `v0.1.0`
- [ ] release notes state protocol baseline, 22 attacks, install command, demos, Action availability, safety scope and pre-1.0 limits
- [ ] record release URL

## 7.5A Public verification and completion

- [ ] public npm view resolves
- [ ] exact-version npx version check succeeds
- [ ] public secure run succeeds
- [ ] public vulnerable demo exits `1`
- [ ] tag and GitHub release point to exact release commit
- [ ] README public install text is accurate
- [ ] README no longer says npm is unreleased
- [ ] no release credential exists in history/artifacts
- [ ] `main` remains clean and protected
- [ ] Phase 7 completion record added
- [ ] Phase 7 feature branch removed after completion

## Stop conditions

Stop the release immediately if:

- expected branch/SHA moves;
- stable attack count differs from 22;
- secure control differs from 22 PASS / 0 FAIL / 0 ERROR;
- `HP-AUTH-001` no longer reproduces exit `1`;
- report or exit semantics drift;
- dependency audit or secret safety fails;
- an unexpected file enters the tarball;
- npm ownership/account identity is unclear;
- registry contents differ from accepted tarball;
- branch protection is weakened;
- any credential, OTP or token is exposed.

If npm publication succeeds but a later tag/release step fails, do not republish `0.1.0`.
