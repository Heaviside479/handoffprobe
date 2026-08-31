#!/usr/bin/env python3
"""Execute and validate the v2 crossing conformance corpus."""
from __future__ import annotations

import argparse
import copy
import hashlib
import importlib.util
import json
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NOW = datetime(2026, 8, 23, 12, 0, tzinfo=timezone.utc)

_spec = importlib.util.spec_from_file_location("a2a_mcp_crossing_v2_reference", Path(__file__).with_name("reference.py"))
_reference = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = _reference
_spec.loader.exec_module(_reference)
CrossingVerifier = _reference.CrossingVerifier
SQLiteReplayStore = _reference.SQLiteReplayStore
PROFILE = _reference.PROFILE
digest = _reference.digest

SUCCESS_REASON = "accepted"
NON_COMPARABLE_REASON = "adapter_non_comparable"
REJECT_REASONS = frozenset({
    "input_contract_invalid", "profile_mismatch", "authority_digest_mismatch", "authority_id_mismatch",
    "task_binding_unresolved", "stage_evidence_missing", "stage_evidence_unexpected",
    "stage_mode_invalid", "initial_authority_digest_mismatch", "initial_authority_id_mismatch",
    "initial_stage_invalid", "stage_link_mismatch", "stage_message_mismatch",
    "stage_reissue_mismatch", "caller_mismatch", "message_mismatch", "task_mismatch",
    "context_mismatch", "audience_mismatch", "action_digest_mismatch", "not_yet_valid",
    "expired", "status_reference_mismatch", "status_stale", "authority_not_current",
    "nonce_replay",
})
INDEPENDENT_GRADES = frozenset({"implementation_independent", "operator_independent"})
GRADE_ORDER = {
    "reference_fixture": 0,
    "transport_real": 1,
    "implementation_independent": 2,
    "operator_independent": 3,
}


def load(path):
    return _reference.strict_json_loads(Path(path).read_text(encoding="utf-8"))


def _get_target(bundle, status, target):
    if target == "bundle":
        return bundle
    if target == "status":
        return status
    if target not in bundle:
        raise ValueError(f"unknown mutation target: {target}")
    return bundle[target]


def _assign(container, path, value, *, delete=False):
    if not path:
        raise ValueError("mutation path cannot be empty")
    current = container
    for segment in path[:-1]:
        current = current[segment]
    if delete:
        del current[path[-1]]
    else:
        current[path[-1]] = copy.deepcopy(value)


def apply_mutation(bundle, status, mutation):
    operation = mutation["op"]
    target = _get_target(bundle, status, mutation["target"])
    if operation == "set":
        _assign(target, mutation["path"], mutation["value"])
    elif operation == "delete":
        _assign(target, mutation["path"], None, delete=True)
    elif operation == "rehash":
        source = _get_target(bundle, status, mutation["source"])
        _assign(target, mutation["path"], digest(source))
    else:
        raise ValueError(f"unsupported mutation operation: {operation}")


def bundle_for(case):
    corpus = load(ROOT / "cases-v2.json")
    bundle = copy.deepcopy(load(ROOT / corpus["base_vector"]))
    status = copy.deepcopy(load(ROOT / case["status_vector"]))
    for mutation in case["mutations"]:
        apply_mutation(bundle, status, mutation)
    return bundle, status


def attempt_rows(case, database):
    bundle, status = bundle_for(case)
    rows, effects = [], 0
    for number in range(1, case["attempts"] + 1):
        before = effects
        decision = CrossingVerifier(SQLiteReplayStore(database)).verify(
            reference=bundle["reference"],
            authority=bundle["authority"],
            status=status,
            observed=bundle["observed"],
            initial_reference=bundle.get("initial_reference"),
            initial_authority=bundle.get("initial_authority"),
            now=NOW,
        )
        if decision.outcome == "succeed":
            effects += 1
        rows.append({
            "attempt": number,
            "outcome": decision.outcome,
            "reason": decision.reason,
            "effect_before": before,
            "effect_after": effects,
            "effect_delta": effects - before,
        })
    return rows


def corpus_digest():
    digest_path = ROOT / "corpus-v2.sha256"
    manifest_path = ROOT / "corpus-manifest.json"
    expected = digest_path.read_text(encoding="utf-8").strip()
    actual = hashlib.sha256(manifest_path.read_bytes()).hexdigest()
    if actual != expected:
        raise RuntimeError("corpus manifest digest mismatch")
    manifest = load(manifest_path)
    for entry in manifest["files"]:
        path = ROOT / entry["path"]
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != entry["sha256"]:
            raise RuntimeError(f"corpus file digest mismatch: {entry['path']}")
    return actual


def run():
    actual_digest = corpus_digest()
    corpus = load(ROOT / "cases-v2.json")
    results = []
    with tempfile.TemporaryDirectory(prefix="a2a-mcp-v2-") as temp:
        for case in corpus["cases"]:
            results.append({
                "case": case["id"],
                "native": {"measurement": "not_measured", "attempts": []},
                "bound": {
                    "measurement": "fixture_observed",
                    "attempts": attempt_rows(case, Path(temp) / f"{case['id']}.sqlite3"),
                },
            })
    return {
        "profile": PROFILE,
        "grade": "reference_fixture",
        "corpus_sha256": actual_digest,
        "implementation": {
            "a2a": "fixture objects; no transport",
            "mcp": "fixture effect counter",
            "verifier": "standalone Python reference; no Border runtime import",
            "operator": "originating project",
        },
        "results": results,
    }


def _validate_attempts(case, lane_name, lane):
    measurement = lane.get("measurement")
    attempts = lane.get("attempts")
    if measurement == "not_measured":
        if attempts:
            raise ValueError("not_measured lanes cannot contain invented attempts")
        return
    if measurement not in {"fixture_observed", "externally_observed"}:
        raise ValueError("unknown measurement provenance")
    if len(attempts) != case["attempts"]:
        raise ValueError("measured lane has wrong attempt count")
    previous_after = 0
    for expected_number, attempt in enumerate(attempts, start=1):
        if attempt.get("attempt") != expected_number:
            raise ValueError("attempt numbers must be contiguous and start at one")
        before = attempt.get("effect_before")
        after = attempt.get("effect_after")
        delta = attempt.get("effect_delta")
        if before != previous_after:
            raise ValueError("effect counters must be continuous across attempts")
        if not all(isinstance(value, int) and not isinstance(value, bool) and value >= 0 for value in (before, after, delta)):
            raise ValueError("effect counters must be non-negative integers")
        if after - before != delta or delta not in {0, 1}:
            raise ValueError("effect delta is inconsistent with before and after counters")
        outcome, reason = attempt.get("outcome"), attempt.get("reason")
        allowed = (
            (outcome == "succeed" and reason == SUCCESS_REASON and delta == 1)
            or (outcome == "reject" and reason in REJECT_REASONS and delta == 0)
            or (outcome == "non_comparable" and reason == NON_COMPARABLE_REASON and delta == 0)
        )
        if not allowed:
            raise ValueError("outcome, reason, and effect are semantically inconsistent")
        previous_after = after
    if lane_name == "bound" and case["id"] == "replay":
        first, second = attempts
        if (first["outcome"], first["reason"], first["effect_delta"]) != ("succeed", "accepted", 1):
            raise ValueError("bound replay attempt one must succeed with one effect")
        if (second["outcome"], second["reason"], second["effect_delta"], second["effect_after"]) != ("reject", "nonce_replay", 0, first["effect_after"]):
            raise ValueError("bound replay attempt two must reject without another effect")


def validate_result(result):
    """Apply semantic invariants after Draft 2020-12 schema validation."""
    corpus = load(ROOT / "cases-v2.json")
    expected = [case["id"] for case in corpus["cases"]]
    actual = [row.get("case") for row in result.get("results", [])]
    if actual != expected:
        raise ValueError("results must contain each corpus case exactly once and in order")
    if result.get("corpus_sha256") != corpus_digest():
        raise ValueError("result does not identify the frozen executable corpus")
    for case, row in zip(corpus["cases"], result["results"]):
        for lane_name in ("native", "bound"):
            _validate_attempts(case, lane_name, row[lane_name])
        if case["kind"] == "valid_control":
            for lane in row.values():
                if not isinstance(lane, dict) or "measurement" not in lane or lane["measurement"] == "not_measured":
                    continue
                attempt = lane["attempts"][0]
                if (attempt["outcome"], attempt["reason"], attempt["effect_delta"]) != ("succeed", "accepted", 1):
                    raise ValueError("each measured valid-control lane must accept with one observed effect")


def derive_summary(result, *, confirmed_grade=None):
    validate_result(result)
    if confirmed_grade is not None:
        if confirmed_grade not in GRADE_ORDER:
            raise ValueError("unknown intake-confirmed grade")
        if GRADE_ORDER[confirmed_grade] > GRADE_ORDER[result["grade"]]:
            raise ValueError("intake-confirmed grade cannot exceed the submitted grade")
    corpus = load(ROOT / "cases-v2.json")
    rows = {row["case"]: row for row in result["results"]}
    complete_bound_external = all(
        rows[case["id"]]["bound"]["measurement"] == "externally_observed"
        and bool(rows[case["id"]]["bound"]["attempts"])
        for case in corpus["cases"]
    )
    complete_external_execution = all(
        rows[case["id"]][lane_name]["measurement"] == "externally_observed"
        and bool(rows[case["id"]][lane_name]["attempts"])
        for case in corpus["cases"]
        for lane_name in ("native", "bound")
    )
    valid_controls = [case for case in corpus["cases"] if case["kind"] == "valid_control"]
    valid_both = all(
        lane["measurement"] == "externally_observed"
        and (lane["attempts"][0]["outcome"], lane["attempts"][0]["reason"], lane["attempts"][0]["effect_delta"]) == ("succeed", "accepted", 1)
        for case in valid_controls
        for lane in (rows[case["id"]]["native"], rows[case["id"]]["bound"])
    )
    discriminating = []
    for case in corpus["cases"]:
        if case["kind"] == "valid_control":
            continue
        row = rows[case["id"]]
        if row["native"]["measurement"] != "externally_observed" or row["bound"]["measurement"] != "externally_observed":
            continue
        native, bound = row["native"]["attempts"][-1], row["bound"]["attempts"][-1]
        if native["outcome"] == "succeed" and native["effect_delta"] == 1 and bound["outcome"] == "reject" and bound["effect_delta"] == 0:
            discriminating.append(case["id"])
    mismatches = []
    unmeasured_bound_cases = []
    for case in corpus["cases"]:
        bound = rows[case["id"]]["bound"]
        if bound["measurement"] != "externally_observed" or not bound["attempts"]:
            unmeasured_bound_cases.append(case["id"])
            continue
        actual = bound["attempts"][-1]
        if (actual["outcome"], actual["reason"]) != (case["expected_bound"], case["expected_reason"]):
            mismatches.append({
                "case": case["id"],
                "expected_outcome": case["expected_bound"],
                "expected_reason": case["expected_reason"],
                "actual_outcome": actual["outcome"],
                "actual_reason": actual["reason"],
            })
    expectations_match = complete_bound_external and not mismatches
    green = (
        confirmed_grade in INDEPENDENT_GRADES
        and complete_external_execution
        and valid_both
        and bool(discriminating)
        and expectations_match
    )
    return {
        "submitted_grade": result["grade"],
        "confirmed_grade": confirmed_grade,
        "valid_both": valid_both,
        "discriminating_cases": discriminating,
        "observed_discrimination": bool(discriminating),
        "complete_bound_external": complete_bound_external,
        "complete_external_execution": complete_external_execution,
        "bound_expectations_match": expectations_match,
        "unmeasured_bound_cases": unmeasured_bound_cases,
        "expectation_mismatches": mismatches,
        "green_eligible": green,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    rendered = json.dumps(run(), indent=2, sort_keys=True, ensure_ascii=False) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
