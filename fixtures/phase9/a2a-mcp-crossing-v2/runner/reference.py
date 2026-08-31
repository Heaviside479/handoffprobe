"""Standalone semantic verifier for crossing profile v2; imports no Border runtime."""
from __future__ import annotations

import hashlib
import json
import sqlite3
from contextlib import closing
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Mapping

PROFILE = "https://minorityprophet.org/conformance/a2a-mcp-crossing/v2"
MAX_STATUS_AGE_SECONDS = 300
MAX_SAFE_INTEGER = 9_007_199_254_740_991
AUDIENCE_SOURCES = frozenset({
    "oauth_resource", "authenticated_endpoint", "certificate_identity", "pinned_configuration",
})


class FixtureError(ValueError):
    pass


def _validate_json_value(value: Any) -> None:
    if isinstance(value, float):
        raise FixtureError("floating-point JSON is invalid fixture input")
    if isinstance(value, int) and not isinstance(value, bool) and abs(value) > MAX_SAFE_INTEGER:
        raise FixtureError("integer exceeds the interoperable safe range")
    if isinstance(value, str) and any(0xD800 <= ord(character) <= 0xDFFF for character in value):
        raise FixtureError("Unicode surrogate code points are invalid fixture input")
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise FixtureError("JSON object keys must be strings")
            _validate_json_value(key)
            _validate_json_value(child)
    elif isinstance(value, list):
        for child in value:
            _validate_json_value(child)


def _reject_duplicate_keys(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise FixtureError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def strict_json_loads(value: str) -> Any:
    result = json.loads(value, object_pairs_hook=_reject_duplicate_keys)
    _validate_json_value(result)
    return result


def _utf16_sort_key(value: str) -> bytes:
    return value.encode("utf-16-be")


def _canonical_text(value: Any) -> str:
    if value is None:
        return "null"
    if value is True:
        return "true"
    if value is False:
        return "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    if isinstance(value, list):
        return "[" + ",".join(_canonical_text(child) for child in value) + "]"
    if isinstance(value, dict):
        return "{" + ",".join(
            f"{_canonical_text(key)}:{_canonical_text(value[key])}"
            for key in sorted(value, key=_utf16_sort_key)
        ) + "}"
    raise FixtureError(f"unsupported JSON value: {type(value).__name__}")


def canonical_bytes(value: Any) -> bytes:
    _validate_json_value(value)
    return _canonical_text(value).encode("utf-8")


def digest(value: Any) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def _require_mapping(container: Mapping[str, Any], field: str) -> Mapping[str, Any]:
    value = container.get(field)
    if not isinstance(value, Mapping):
        raise FixtureError(f"{field} must be an object")
    return value


def _require_string(container: Mapping[str, Any], field: str) -> str:
    value = container.get(field)
    if not isinstance(value, str) or not value:
        raise FixtureError(f"{field} must be a non-empty string")
    return value


def _require_digest(container: Mapping[str, Any], field: str) -> str:
    value = _require_string(container, field)
    if len(value) != 64 or any(character not in "0123456789abcdef" for character in value):
        raise FixtureError(f"{field} must be a lowercase SHA-256 digest")
    return value


def _validate_audience(container: Mapping[str, Any]) -> None:
    audience = _require_mapping(container, "mcp_audience")
    _require_string(audience, "value")
    source = _require_string(audience, "source")
    if source not in AUDIENCE_SOURCES:
        raise FixtureError("mcp_audience.source is not transport-bound")


def _validate_authority(authority: Mapping[str, Any], *, initial: bool) -> None:
    for field in (
        "issuer_id", "authority_id", "requester_id", "not_before", "expires_at", "status_ref", "nonce",
    ):
        _require_string(authority, field)
    _require_digest(authority, "action_digest")
    _validate_audience(authority)
    parse_time(authority["not_before"])
    parse_time(authority["expires_at"])
    binding = _require_mapping(authority, "a2a_binding")
    _require_string(binding, "stage")
    _require_string(binding, "message_id")
    if initial:
        return
    _require_string(binding, "mode")
    _require_string(binding, "task_id")
    _require_string(binding, "context_id")
    if binding["mode"] == "first_turn_reissued":
        _require_digest(binding, "previous_stage_digest")
    elif binding["mode"] == "existing_task" and "previous_stage_digest" in binding:
        raise FixtureError("existing_task cannot carry previous_stage_digest")


def _validate_reference(reference: Mapping[str, Any]) -> None:
    _require_string(reference, "profile")
    _require_string(reference, "authority_id")
    _require_digest(reference, "authority_digest")


def _validate_inputs(
    *,
    reference: Mapping[str, Any],
    authority: Mapping[str, Any],
    status: Mapping[str, Any],
    observed: Mapping[str, Any],
    initial_reference: Mapping[str, Any] | None,
    initial_authority: Mapping[str, Any] | None,
) -> None:
    for name, value in (
        ("reference", reference), ("authority", authority), ("status", status), ("observed", observed),
    ):
        if not isinstance(value, Mapping):
            raise FixtureError(f"{name} must be an object")
        _validate_json_value(value)
    _validate_reference(reference)
    _validate_authority(authority, initial=False)
    for field in ("status_ref", "authority_id", "observed_at", "status"):
        _require_string(status, field)
    parse_time(status["observed_at"])
    for field in ("caller_id", "message_id", "task_id", "context_id", "tool"):
        _require_string(observed, field)
    _validate_audience(observed)
    arguments = observed.get("arguments")
    if not isinstance(arguments, Mapping):
        raise FixtureError("arguments must be an object")
    if initial_reference is not None:
        if not isinstance(initial_reference, Mapping):
            raise FixtureError("initial_reference must be an object")
        _validate_json_value(initial_reference)
        _validate_reference(initial_reference)
    if initial_authority is not None:
        if not isinstance(initial_authority, Mapping):
            raise FixtureError("initial_authority must be an object")
        _validate_json_value(initial_authority)
        _validate_authority(initial_authority, initial=True)


def action_digest(observed: Mapping[str, Any]) -> str:
    return digest({"arguments": observed["arguments"], "mcp_audience": observed["mcp_audience"], "tool": observed["tool"]})


def parse_time(value: str) -> datetime:
    result = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if result.tzinfo is None:
        raise FixtureError("timestamps require an offset")
    return result.astimezone(timezone.utc)


def replay_key(authority: Mapping[str, Any]) -> str:
    return digest([authority["issuer_id"], authority["authority_id"], authority["nonce"]])


@dataclass(frozen=True)
class Decision:
    outcome: str
    reason: str


class SQLiteReplayStore:
    def __init__(self, path: Path):
        self.path = path
        with closing(sqlite3.connect(path)) as db:
            with db:
                db.execute("CREATE TABLE IF NOT EXISTS consumed (replay_key TEXT PRIMARY KEY, retain_until TEXT NOT NULL, consumed_at TEXT NOT NULL)")

    def consume(self, key: str, now: datetime, retain_until: datetime) -> bool:
        with closing(sqlite3.connect(self.path, isolation_level=None, timeout=5)) as db:
            db.execute("BEGIN IMMEDIATE")
            try:
                db.execute("INSERT INTO consumed VALUES (?, ?, ?)", (key, retain_until.isoformat(), now.isoformat()))
            except sqlite3.IntegrityError:
                db.execute("ROLLBACK")
                return False
            db.execute("COMMIT")
            return True


class CrossingVerifier:
    def __init__(self, replay_store: SQLiteReplayStore):
        self.replay_store = replay_store

    def verify(
        self,
        *,
        reference: Mapping[str, Any],
        authority: Mapping[str, Any],
        status: Mapping[str, Any],
        observed: Mapping[str, Any],
        now: datetime,
        initial_reference: Mapping[str, Any] | None = None,
        initial_authority: Mapping[str, Any] | None = None,
    ) -> Decision:
        try:
            _validate_inputs(
                reference=reference,
                authority=authority,
                status=status,
                observed=observed,
                initial_reference=initial_reference,
                initial_authority=initial_authority,
            )
        except (FixtureError, KeyError, TypeError, ValueError):
            return Decision("reject", "input_contract_invalid")
        if reference.get("profile") != PROFILE:
            return Decision("reject", "profile_mismatch")
        if reference.get("authority_digest") != digest(authority):
            return Decision("reject", "authority_digest_mismatch")
        if reference.get("authority_id") != authority.get("authority_id"):
            return Decision("reject", "authority_id_mismatch")
        binding = authority.get("a2a_binding", {})
        if binding.get("stage") != "resolved":
            return Decision("reject", "task_binding_unresolved")
        binding_mode = binding.get("mode")
        if binding_mode == "first_turn_reissued":
            if not initial_reference or not initial_authority:
                return Decision("reject", "stage_evidence_missing")
            if initial_reference.get("profile") != PROFILE:
                return Decision("reject", "profile_mismatch")
            if initial_reference.get("authority_digest") != digest(initial_authority):
                return Decision("reject", "initial_authority_digest_mismatch")
            if initial_reference.get("authority_id") != initial_authority.get("authority_id"):
                return Decision("reject", "initial_authority_id_mismatch")
            initial_binding = initial_authority.get("a2a_binding", {})
            if initial_binding.get("stage") != "initial":
                return Decision("reject", "initial_stage_invalid")
            if binding.get("previous_stage_digest") != digest(initial_authority):
                return Decision("reject", "stage_link_mismatch")
            if binding.get("message_id") != initial_binding.get("message_id"):
                return Decision("reject", "stage_message_mismatch")
            immutable_fields = (
                "issuer_id", "authority_id", "requester_id", "mcp_audience", "action_digest",
                "not_before", "expires_at", "status_ref", "nonce",
            )
            if any(authority.get(field) != initial_authority.get(field) for field in immutable_fields):
                return Decision("reject", "stage_reissue_mismatch")
        elif binding_mode == "existing_task":
            if initial_reference is not None or initial_authority is not None:
                return Decision("reject", "stage_evidence_unexpected")
        else:
            return Decision("reject", "stage_mode_invalid")
        if observed.get("caller_id") != authority.get("requester_id"):
            return Decision("reject", "caller_mismatch")
        if observed.get("message_id") != binding.get("message_id"):
            return Decision("reject", "message_mismatch")
        if observed.get("task_id") != binding.get("task_id"):
            return Decision("reject", "task_mismatch")
        if observed.get("context_id") != binding.get("context_id"):
            return Decision("reject", "context_mismatch")
        if observed.get("mcp_audience") != authority.get("mcp_audience"):
            return Decision("reject", "audience_mismatch")
        if action_digest(observed) != authority.get("action_digest"):
            return Decision("reject", "action_digest_mismatch")
        if now < parse_time(authority["not_before"]):
            return Decision("reject", "not_yet_valid")
        expires = parse_time(authority["expires_at"])
        if now >= expires:
            return Decision("reject", "expired")
        if status.get("status_ref") != authority.get("status_ref") or status.get("authority_id") != authority.get("authority_id"):
            return Decision("reject", "status_reference_mismatch")
        observed_at = parse_time(status["observed_at"])
        age = (now - observed_at).total_seconds()
        if age < 0 or age > MAX_STATUS_AGE_SECONDS:
            return Decision("reject", "status_stale")
        if status.get("status") != "current":
            return Decision("reject", "authority_not_current")
        if not self.replay_store.consume(replay_key(authority), now, expires):
            return Decision("reject", "nonce_replay")
        return Decision("succeed", "accepted")
