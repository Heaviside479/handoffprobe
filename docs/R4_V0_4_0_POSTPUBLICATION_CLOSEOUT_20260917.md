# R4 v0.4.0 Post-publication Closeout — 2026-09-17

Status: **COMPLETE — 2026-09-17.**

## Final released identity

HandoffProbe v0.4.0 completed coordinated publication and post-publication verification.

- released package: `handoffprobe@0.4.0`;
- release commit: `8ffdbec95e8ebe6fe1db1f3c2151d571461d596d`;
- annotated `v0.4.0` tag object: `82e1ba995243d0cab6d446c0667c1d4b3202ff81`;
- the annotated tag resolves to the exact release commit above;
- GitHub Release: `https://github.com/Heaviside479/handoffprobe/releases/tag/v0.4.0`;
- public stable corpus: **23 attacks** = 12 P0 + 10 P1 + 1 advanced;
- added stable capability: `HP-AUTH-006 — Stale task authorization reused for later effect`;
- Node policy remains `>=24 <25`;
- protocol baseline remains A2A 1.0 → MCP 2026-07-28;
- report schema remains `1`.

## npm verification

The public npm publication was verified independently after publication.

- exact package: `handoffprobe@0.4.0`;
- package tarball SHA-256: `7df0adcacb5e559ea9f7f77f348aaedbdfb6c23f1a5931424ab945d190c7a17a`;
- package tarball SHA-1: `2807c95fbc780d45212df730b8723387055a7a8a`;
- package file count: 295;
- clean external exact-version installation and CLI execution passed;
- secure full-corpus execution reported all 23 stable checks as PASS.

The already-published `0.4.0` package must not be republished merely for documentation reconciliation.

## GitHub release and Action verification

- the annotated `v0.4.0` tag was verified against the exact release commit;
- the GitHub Release was published and verified;
- external GitHub Action execution was verified using both the human-readable `v0.4.0` reference and the exact release commit;
- the temporary external consumer verification state was cleaned up after successful verification;
- GitHub Marketplace / reusable Action presentation was verified for the v0.4.0 release surface.

No claim is made that a Marketplace UI label such as `Latest` was observed unless that exact UI state was independently recorded.

## Public website verification

### Dedicated HandoffProbe site

`https://handoffprobe.heaviside-solutions.com`

The dedicated product site was synchronized and verified live in English and German with:

- v0.4.0 release identity;
- 23 stable attacks;
- `HP-AUTH-006`;
- current release links.

Verified production source commit:
`7813974d647c097706669df701ed8184307ec7a1`

### Heaviside Solutions project page

`https://heaviside-solutions.com/projekte/handoffprobe`

The corporate production page was verified live on 2026-09-17 with HTTP 200.

Observed production markers:

- `handoffprobe@0.4.0`;
- `v0.4.0 Release`;
- `23 stabil` / `23 stabile Angriffe`;
- `HP-AUTH-006`.

The live response contained no stale `handoffprobe@0.3.0` or 22-attack marker.

The READY Vercel production deployment is backed by corporate main commit:
`f80abcf293462ee3da2e56b049a109b1e031da5e`

## Historical-record rule

Historical documents and roadmap sections that truthfully describe the earlier 22-attack / v0.3.0 state remain historical evidence and are not mechanically rewritten.

In particular, T-1, T-3 and R3 records remain valid descriptions of their own checkpoints.

Current-facing installation, README, changelog, release-note and R4 roadmap wording are reconciled separately by this closeout.

## R4 exit decision

All coordinated R4 publication surfaces have now been verified against the same released v0.4.0 truth:

1. merged release commit;
2. annotated `v0.4.0` tag anchored to that commit;
3. GitHub Release;
4. public npm package;
5. reusable GitHub Action / Marketplace presentation;
6. dedicated HandoffProbe product site;
7. Heaviside Solutions project page;
8. clean external exact-version npm execution;
9. clean external Action execution.

R4 is therefore **COMPLETE**.

T-4 was not part of the v0.4.0 shipped capability. After this closeout is merged to `main`, T-4.1 may begin its independent freeze / preservation / verification work for the already queued A2A `#1769` inputs.

T-2.7 / Bayu remains independent and is not converted into external review by this release closeout.
