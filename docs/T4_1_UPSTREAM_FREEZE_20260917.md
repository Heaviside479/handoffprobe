# T-4.1 upstream material freeze — 2026-09-17

Status: **COMPLETE — T-4.1 closed 2026-09-17; T-4.2 completed 2026-09-18.**

This record freezes the exact external inputs used for the T-4 comparison. It does not make an attack-admission decision, does not claim external HandoffProbe validation, and does not copy or adapt upstream code into HandoffProbe.

## 1. WitnessObservation provenance

- Origin: `a2aproject/A2A#1769`.
- Initial external signal: `#5694467702`, 2026-09-16.
- Canonical author pin: `#5712951510`, 2026-09-17.
- Author: Toshikatsu Oga / `ogasurfproject-jpg`.
- Repository: `ogasurfproject-jpg/horizon-shield`.
- Exact commit: `4d7c9c270c2846465fafdea9833869c5660c4ae2`.
- Path: `workers/hs-ledger/nenrin/task-delegation-bind-v0/`.
- Repository license at the pinned revision: MIT.

The exact commit was independently fetched into a temporary local repository and verified byte-for-byte by Git commit identity.

### Relevant frozen file SHA-256 values

- `EXTENSION.md`: `53894aee3032843cead3e7e80c7147278d023bbcda630299b685486d4a0477af`
- `bind.mjs`: `c067e1861d369ad895f94cf659e9e9e3c55895601dd5fe770c4ab804dd7e7f53`
- `sign.mjs`: `3002b62f5dbbc9df5b7e706a0230058f258487d84cdbd19f61e8a92bc9c39a16`
- `bind_adversarial.test.mjs`: `4f3dcdc4ac77ce8e29a43713b6006fca1dbe557af232d6766f0430caa657877c`
- `sign_adversarial.test.mjs`: `9870792cbb06076246bee4b17e061924798e4b13ab0a5e96de95d651b77529a7`
- `cross_lang_test.mjs`: `956d43e40db7f8279dcc2b0a78feaa5c2fd0f7695d3f626c9b7aec401a4253e8`
- `sign_cross_lang_test.mjs`: `759a4cb23261f3fc798ef5a1c461b8ac97d655facd90412e493b84a034bbede9`
- `task_witness_emit.py`: `8dbffa5c60375569021774c5bd74d5ca198506b93dd9452271e1402ef496992e`

### `signed.json` discrepancy

The canonical author comment described `signed.json` as a frozen signed example in the same directory. Independent inspection of the exact pinned commit found that `signed.json` is not tracked there. The directory `.gitignore` explicitly lists `signed.json` and `obs.json` as regenerated conformance vectors that are not part of the source.

HandoffProbe therefore does **not** treat `signed.json` as part of the immutable pinned repository material unless the author supplies a separate immutable published copy.

## 2. Post-pin author clarification

On 2026-09-17, Oga published clarification `a2aproject/A2A#1769` comment `#5719453107`.

The clarified boundary is frozen as follows:

- R2 is integrity/linkage verification, not provider-side execution reconciliation.
- R1-R4 do not establish authorized-action equivalence.
- WitnessObservation carries a conduct verdict and delegation/witness linkage, not target arguments plus governing authorization.
- R1-R4 can therefore remain valid while an executed target differs from the authorized target.
- WitnessObservation is a third-party observation / disagreement-preservation layer over delegation hops.
- It is not an action-binding layer and not an execution-evidence reconciliation layer.
- The WitnessObservation and VATE properties are treated as composable boundaries rather than one subsuming the other.

HandoffProbe acknowledged and preserved that boundary in comment `#5719641899` and reported the `signed.json` freeze discrepancy. At the time this freeze record was prepared, no substantive reply to that follow-up had been observed.


### Later author confirmation — 2026-09-17

A later substantive reply arrived in A2A `#1769` at `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5722127484`.

- Toshikatsu Oga / `ogasurfproject-jpg` explicitly confirmed the HandoffProbe boundary record from comment `#5719641899`.
- He explicitly corrected the earlier `signed.json` reference: `signed.json` and `obs.json` are regenerated gitignored conformance vectors and are not pinned repository source.
- He confirmed that the canonical WitnessObservation implementation pin remains `4d7c9c270c2846465fafdea9833869c5660c4ae2` and consists of tracked source and tests only.
- He confirmed that `4828da51cf3c865b989ede27a0d15d2acc234e25` / `boundary_case.test.mjs` is a supplemental boundary test, not an implementation change, so it does not replace the canonical pin.
- He offered a separately immutable signed record only if the later overlap analysis establishes a concrete need for one.
- T-4.2 therefore begins without requesting an additional signed fixture. Any later request must be tied to a specific evidence gap found during overlap analysis.

This is external author confirmation of the recorded scope and provenance boundaries. It is not a new stable attack, a HandoffProbe validation claim, or a release trigger.

A subsequent A2A `#1769` confirmation arrived at `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5728468834`.

- Oga again confirmed `4d7c9c270c2846465fafdea9833869c5660c4ae2` as the canonical WitnessObservation pin.
- He again confirmed that `signed.json` and `obs.json` are regenerated non-source material.
- He again classified `4828da51cf3c865b989ede27a0d15d2acc234e25` as supplemental rather than the canonical pin.
- He will not create an additional immutable signed fixture unless the HandoffProbe overlap analysis identifies a concrete property that requires one.
- This reply introduces no new T-4 scope.


## 3. VATE provenance

- Author: Takao Sato / `Poke-nushi`.
- Canonical input comment: A2A `#1769` comment `#5713423719`.
- Repository revision: `4a63adb4ade9d6e1affe622744a49056413a8c86`.
- Archive: `vate-reproduction-local-draft-01.zip`.
- Archive size: `22842060` bytes.
- Archive SHA-256: `5f1fe2d4bf656cc02c25c04757180fc3d6111296e157abfc61f5b3e7715d3f7e`.
- Manifest SHA-256: `d603a1638ee3160a20dc0cda3b84664ae1de937fd5705b0a35dca1ee2ac82279`.
- VATE source pin: `a15b9f5e64413f7a1312ec8e9e7731e8ebdb1f60`.
- Vaara source pin: `cfb5495c0c8d08fb34a99501c670f4ed225e7870`.
- `rfc8785`: `0.1.4`.

The archive was independently downloaded. Its exact size and SHA-256 matched the published package identity. The extracted `MANIFEST.json` SHA-256 also matched.

The package checker was run with local Python `3.12.14` using `python3.12 -I -S -B starter.py check` and returned exit code `0`.

The checker preserved the published evidence distinctions including successful control, changed-target rejection before handler execution, response-loss incompleteness, and incomplete disclosed effect evidence. A checker exit code of zero means the package and recomputed reports agree; it does not mean every operation succeeded.

## 4. VATE licensing and scope

- VATE reference/reproduction material: Apache-2.0.
- Vaara included source: AGPL-3.0-or-later.
- `rfc8785` 0.1.4: Apache-2.0.
- The combined reproduction package must not be described as wholly Apache-2.0.

The package scope remains a single-operator local stdio experiment with public synthetic material, unsigned VATE records and adapter-derived output hashes. A2A transport, external identity assurance, external-SUT conformance and production approval are outside the reproduced scope.

## 5. T-4.1 outcome

Both canonical upstream inputs are now independently pinned and preserved by exact commit/package identity, practical hashes, provenance and license boundaries.

The material is ready for T-4.2 overlap and boundary analysis.

No stable attack is added by this freeze. The public stable corpus remains 23 attacks unless a separate normal admission and release decision changes it.

## 6. Upstream change between queue creation and T-4 freeze

The T-4 queue was created in HandoffProbe by commit `0618ce0ee37c5c8f138a496e3b6a7985202810ec` at `2026-09-16T10:47:14+02:00`.

The canonical WitnessObservation commit `4d7c9c270c2846465fafdea9833869c5660c4ae2` was created later on 2026-09-16 at `13:07:56Z` (`15:07:56+02:00`) and was subsequently supplied by the author as the immutable comparison pin.

After that canonical pin and after the author clarification recorded above, the upstream repository changed again.

### Supplemental boundary vector

- Upstream commit: `4828da51cf3c865b989ede27a0d15d2acc234e25`.
- Commit time: `2026-09-17T18:50:05Z` (`20:50:05+02:00`).
- Added file: `workers/hs-ledger/nenrin/task-delegation-bind-v0/boundary_case.test.mjs`.
- SHA-256: `c8f53c9c3d2ddfc55f1860a7da30639689a3ade3d52afd898c1c89174b6c1590`.
- The original frozen `bind.mjs` remained byte-identical at SHA-256 `c067e1861d369ad895f94cf659e9e9e3c55895601dd5fe770c4ab804dd7e7f53`.

The supplemental vector was independently fetched by exact commit and executed locally with Node. All assertions passed with exit code `0`.

It demonstrates by construction that:

- a matching authorized/executed target and a diverging executed target map to the same WitnessObservation v0 evidence identity;
- a completed hop and a response-lost / outcome-unknown hop map to the same WitnessObservation v0 evidence identity;
- those scenarios can remain valid under the existing R1-R4 checks.

The supplemental vector therefore makes the already-recorded scope boundary testable. It does not extend WitnessObservation v0 with action binding or execution-outcome reconciliation, and it does not replace the original canonical pin.

For T-4.2, the original canonical commit remains the primary WitnessObservation input. The supplemental commit is preserved separately as post-pin boundary evidence.
