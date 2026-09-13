# T1 Semantic Authority Evidence Freeze

Status: **ACTIVE - T1.1 external evidence frozen 2026-09-13**

## 1. Sequencing decision

On 2026-09-13 the project owner explicitly approved starting T-1 before CV-5 item 4 is complete.

CV-5 item 4 remains open and is deferred to the marketing workflow. This exception does not mark CV-5 complete and does not change the CV-5 exit gate.

T-1 may proceed in parallel because the remaining CV-5 work is distribution/marketing execution rather than a technical prerequisite for this research.

## 2. Frozen external references

- A2A discussion: `https://github.com/a2aproject/A2A/discussions/2181`
- external repository: `https://github.com/arjun2075/a2a-mcp-authority-conformance`
- external PR #1: `https://github.com/arjun2075/a2a-mcp-authority-conformance/pull/1`
- external PR head SHA: `2174b7f22bdf2b188f5217b4311cc7be9fef8c03`
- external merge commit: `c365a7fef4b96f2b5ceae65cfec9deeae5db5bae`
- external failure class: `SEMANTIC_AUTHORITY_WIDENING`
- fixture-scoped invariant: `effective_authority(downstream) ⊆ delegated_authority(upstream)`

## 3. External artifacts reviewed

Review was anchored to external merge commit `c365a7fef4b96f2b5ceae65cfec9deeae5db5bae`.

Files/artifacts reviewed:

- `docs/SEMANTIC_AUTHORITY_TRANSLATION.md`
- `src/semantic_authority.py`
- `fixtures/semantic-authority-widening.json`
- `tests/test_semantic_authority.py`
- external PR description and diff

Observed external cases:

1. direct preservation - PASS
2. representation loss with equivalent trusted downstream enforcement - PASS
3. representation loss without equivalent enforcement that newly permits a concrete operation - FAIL candidate
4. invalid authenticated-leaf binding - separate FAIL class
5. stricter downstream authority - PASS

## 4. Key semantic distinctions

- field/representation loss alone is not a security failure;
- trusted downstream enforcement may preserve the same semantic restriction;
- the candidate failure is new effective downstream authority that was not permitted upstream;
- identity/authenticated-leaf binding failures remain separate;
- explicit attenuation/escalation failures remain separate;
- runtime/scanner ERROR must remain separate from security FAIL.

## 5. External model boundary

The external reference model is deterministic but fixture-scoped.

It compares sets of concrete protected operations over a finite, fixture-declared operation universe. It does not claim to solve arbitrary policy equivalence or to define a normative A2A/MCP authorization model.

## 6. License and provenance

The external repository was reviewed as MIT licensed.

Even though the license permits reuse, HandoffProbe will prefer an independent reproduction and implementation. No external source code is copied by default.

Provenance must be preserved if a concept, terminology or test shape is informed by the external work.

## 7. T1.1 decision

T1.1 external-evidence freeze is complete.

Next step: map the case against the current HandoffProbe corpus and produce the T1.2 overlap matrix.
