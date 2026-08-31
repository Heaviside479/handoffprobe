# Reproduzierbarer Research-Fall: HP-AUTH-001

Status: abgeschlossen am 2026-08-31

Fall: `HP-AUTH-001 — Delegated authority amplification`

Öffentliches Paket: `handoffprobe@0.1.0`

Protokoll-Baseline:

- A2A `1.0`
- MCP `2026-07-28`

Standard-Schweregrad: `HIGH`

Property Class: `composition_responsibility`

## Sicherheitsinvariante

Die effektive nachgelagerte Berechtigung darf die upstream delegierte Berechtigung nicht überschreiten.

Die synthetische Upstream-Delegation erlaubt ausschließlich `invoice.read` für `invoice:INV-1001`.

Die Research-Mutation erweitert die übersetzte Downstream-Berechtigung auf `invoice.update` und versucht anschließend das geschützte synthetische MCP-Tool `update_invoice` auszuführen, ohne dass dafür eine neue gültige Upstream-Delegation erteilt wurde.

## Warum dies ein Handoff-Sicherheitsfall ist

### A2A-lokale Beobachtung

Die Berechtigung auf der A2A-Seite bleibt auf `invoice.read` beschränkt. Dieser Fall behauptet ausdrücklich nicht, dass die A2A-Seite `invoice.update` autorisiert hat.

### Beobachtung an der Handoff-Grenze

Während der Übersetzung wird die effektive Downstream-Berechtigung absichtlich von `invoice.read` auf `invoice.update` erweitert. Es existiert keine neue gültige Upstream-Delegation, die diese Erweiterung autorisiert.

Genau diese Übersetzungsgrenze ist der sicherheitskritische Bestandteil des Falls.

### MCP-lokale Beobachtung

Der Downstream-Aufruf von `update_invoice` ist ein gültiger synthetischer MCP-Tool-Aufruf. Der Sicherheitsfehler ist daher kein MCP-Parser- oder Transportfehler, sondern ein protokollübergreifender Autorisierungsfehler an der A2A-zu-MCP-Handoff-Grenze.

## Erwartete Ergebnisse

Sicheres Ziel:

```text
PASS           HP-AUTH-001 Delegated authority amplification [HIGH]
SECURE_EXIT=0
```

Die unzulässig erweiterte Berechtigung wird abgelehnt und die synthetische Rechnung bleibt unverändert.

Absichtlich verwundbares Ziel:

```text
FAIL           HP-AUTH-001 Delegated authority amplification [HIGH]
VULNERABLE_EXIT=1
```

Die geschützte synthetische Mutation wird ohne neue gültige Upstream-Delegation ausgeführt.

Scanner-/Runtime-Fehler: `0`.

## Öffentliche Reproduktion

Die Reproduktion wird außerhalb eines HandoffProbe-Source-Checkouts ausgeführt, damit `npx` das öffentliche Paket `handoffprobe@0.1.0` verwendet.

Befehle:

`npm view handoffprobe@0.1.0 version`

`npm view handoffprobe@0.1.0 dist.shasum`

`npx --yes --package=handoffprobe@0.1.0 handoffprobe test --target secure --test HP-AUTH-001 --fail-on high`

`npx --yes --package=handoffprobe@0.1.0 handoffprobe test --target vulnerable --test HP-AUTH-001 --fail-on high`

Erwarteter öffentlicher npm-Shasum:

`2aa56211d7559cac2cf2052275af45331fba6663`

## Technische Vorabprüfung

Der Phase-8.4A-Preflight bestätigte:

- sicheres Ziel: PASS / Exit `0`
- absichtlich verwundbares Ziel: FAIL / Exit `1`
- Scanner-Fehler: `0`
- A2A: `1.0`
- MCP: `2026-07-28`
- getestetes Drittsystem: keines
- echte Zugangsdaten: keine
- echte Benutzerdaten: keine
- kostenpflichtige API: keine
- kostenpflichtige Cloud-Infrastruktur: keine
- Reproduktionskosten: `0 EUR`
- veröffentlichtes `handoffprobe@0.1.0`: unverändert

## Responsible-Disclosure-Einstufung

Dieser Research-Fall verwendet ausschließlich die gebündelten synthetischen HandoffProbe-Fixtures.

Es wurde kein produktives Drittsystem getestet, keine unautorisierte Aktivität durchgeführt und es wurden weder echte Zugangsdaten noch echte Benutzerdaten verwendet.

Daher ist für diesen Fall keine private Meldung an einen Drittanbieter erforderlich.

Dieser Fall behauptet keine Schwachstelle in den A2A- oder MCP-Spezifikationen.

Sollte dieselbe Invariantenverletzung später gegen ein reales externes System reproduziert werden, gilt vor einer Veröffentlichung von schwachstellenspezifischen Details der Responsible-Disclosure-Prozess aus `SECURITY.md`.

## Was dieser Fall beweist

Der Fall zeigt, dass HandoffProbe deterministisch zwischen einer sicheren A2A-zu-MCP-Komposition, welche die Upstream-Delegation bewahrt, und einer absichtlich verwundbaren Variante unterscheiden kann, welche die Berechtigung während der Übersetzung unzulässig erweitert.

Die entscheidende Sicherheitseigenschaft liegt an der Kompositions- und Handoff-Grenze und nicht isoliert in einem einzelnen Protokoll.

## Was dieser Fall nicht beweist

Dieser Fall beweist nicht, dass A2A `1.0` oder MCP `2026-07-28` grundsätzlich verwundbar sind, dass ein bestimmter Anbieter oder ein bestimmtes Framework verwundbar ist oder dass jede A2A-zu-MCP-Integration diesen Fehler enthält.

Es wurde kein reales Rechnungssystem aufgerufen oder verändert.

## Regressionsanker

Dieser Research-Fall basiert auf:

- `docs/P0_TEST_SPECIFICATION.md`
- `docs/ATTACK_CATALOG.md`
- `src/attacks/p0/authorization.ts`
- `tests/p0-authorization-attacks.test.ts`
- `SECURITY.md`
