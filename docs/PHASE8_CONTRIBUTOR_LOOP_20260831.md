# Phase 8.5A — Contributor-Loop

Status: in Arbeit

Basis: `d51f01b61153ece6d0305020d9a421eb42565001`

## Ziel

Phase 8.5A senkt die Einstiegshürde für externe Beiträge, ohne den Scanner-Scope zu erweitern.

Ein externer Beitrag soll vor Beginn klar erkennen können:

- welche Änderung klein genug für einen ersten Beitrag ist;
- welche bestehenden Fixtures und Tests als Referenz dienen;
- welche Sicherheits- und Reproduzierbarkeitsregeln gelten;
- welche Prüfungen vor einem Pull Request erwartet werden;
- welche Aufgaben ausdrücklich nicht als Einsteigeraufgabe geeignet sind.

## Schneller Einstieg

Voraussetzung ist Node.js 24.

```bash
node --version
npm --version
npm ci
npm run typecheck
npx vitest run tests/p0-end-to-end.test.ts
```

Vor einem Pull Request muss die vollständige lokale Qualitätsprüfung erfolgreich sein:

```bash
npm run check
npm run package:check
git diff --check
```

Die bestehende CI bleibt die verbindliche Merge-Grenze.

## Beitragswege

### 1. Dokumentation

Geeignet für einen ersten kleinen Beitrag:

- eine bestehende Anleitung präzisieren;
- ein reproduzierbares Beispiel ergänzen;
- einen klar begrenzten Troubleshooting-Fall dokumentieren;
- eine vorhandene Fixture oder einen vorhandenen Test erklären.

Dokumentationsbeiträge dürfen keine neue Scanner-Funktion vortäuschen.

Wenn eine Dokumentationsaussage einen stabilen Projektvertrag beschreibt, soll sie durch einen gezielten Dokumentations-Regressionstest abgesichert werden.

### 2. Fixture oder Test

Fixture- und Testbeiträge verwenden ausschließlich lokale und synthetische Daten.

Ein kleiner Beitrag soll möglichst nur eine klar abgegrenzte Invariante oder Regression abdecken.

Bestehende Referenzflächen:

- `src/p0-fixture`
- `src/p1-fixture`
- `src/protocol-lab`
- `tests/p0-end-to-end.test.ts`
- `tests/p0-fixture-domain.test.ts`
- `tests/p1-fixture-foundation.test.ts`
- `tests/protocol-lab.integration.test.ts`

### 3. Research- oder Integrationsarbeit

Research- und Integrationsarbeit ist grundsätzlich willkommen, aber nicht automatisch eine Einsteigeraufgabe.

Das externe Issue `#20` ist ein Beispiel für wertvolle, reproduzierbare Research-Evidenz. Es beschreibt einen eingefrorenen A2A-1.0-zu-MCP-2026-07-28-Corpus mit externer Effektbeobachtung.

Issue `#20` wird in Phase 8.5A nicht als `good first issue` behandelt und löst keinen automatischen Adapter-Bau aus.

## Fixture-Vertrag

Ein neuer oder erweiterter Fixture-Pfad muss folgende Regeln erfüllen:

1. ausschließlich synthetische oder ausdrücklich autorisierte Daten;
2. keine echten Zugangsdaten;
3. keine unnötige Netzwerkabhängigkeit;
4. keine kostenpflichtige KI-API oder kostenpflichtige Cloud-Pflicht;
5. deterministische Eingaben und deterministische Assertions;
6. klar benannte Sicherheitsinvariante;
7. klar benannte Mutation oder Fehlkonfiguration;
8. getrennte Beobachtung von sicherem und absichtlich verwundbarem Verhalten, wenn beide Varianten relevant sind;
9. Protokollversionen müssen explizit angegeben werden;
10. Handoff-/Kompositionsfehler müssen von rein protokoll-lokalen Fehlern getrennt werden.

Die aktuelle Protokoll-Baseline bleibt A2A `1.0` → MCP `2026-07-28`.

## Test-Erwartungen

### Dokumentationsänderung

Mindestens:

```bash
npx vitest run <betroffener-dokumentationstest>
git diff --check
```

Vor dem Pull Request zusätzlich:

```bash
npm run check
npm run package:check
```

### Fixture- oder Verhaltensänderung

Mindestens:

```bash
npx vitest run <gezielter-test>
npm run typecheck
npm run lint
```

Vor dem Pull Request zusätzlich:

```bash
npm run check
npm run package:check
git diff --check
```

### Kein grüner Test durch Abschwächung

Ein bestehender Sicherheits- oder Regressionstest darf nicht lediglich gelockert, übersprungen oder entfernt werden, um eine Änderung grün zu machen.

Wenn sich ein stabiler Vertrag bewusst ändern muss, müssen Begründung, Dokumentation und Regression gemeinsam angepasst werden.

## Vertrag für fokussierte Contributor-Issues

Ein extern gut bearbeitbares Issue soll enthalten:

- ein einzelnes klar begrenztes Ziel;
- konkrete Ausgangsdateien oder Referenzpfade;
- überprüfbare Akzeptanzkriterien;
- mindestens einen gezielten Prüf-Befehl;
- explizite Nicht-Ziele;
- Kennzeichnung, ob Runtime-Verhalten verändert werden darf;
- keine Abhängigkeit von privaten Systemen oder kostenpflichtiger Infrastruktur.

Ein Issue ist nicht allein deshalb ein `good first issue`, weil es kurz beschrieben ist.

## Kleine externe Aufgaben für Phase 8.5A

Die ersten fokussierten Aufgaben sollen bewusst risikoarm bleiben.

### Aufgabe A — Clean-Clone-Quickstart verifizieren

Ziel:

- Contributor-Quickstart aus einem frischen Clone mit Node 24 ausführen;
- Abweichungen oder unnötige Entscheidungen dokumentieren;
- nur nachgewiesene Reibung korrigieren.

Nicht-Ziel:

- keine Scanner-Funktion ändern.

### Aufgabe B — Windows-PowerShell-Beitragspfad dokumentieren

Ziel:

- äquivalente PowerShell-Befehle für den Contributor-Quickstart dokumentieren;
- keine plattformspezifische Runtime-Abzweigung einführen.

Nicht-Ziel:

- keine zusätzliche Plattform-Abhängigkeit.

### Aufgabe C — Bestehende synthetische Fixture erklären

Ziel:

- einen vorhandenen Fixture-Pfad aus `src/p0-fixture`, `src/p1-fixture` oder `src/protocol-lab` dokumentieren;
- Invariante, Mutation, Beobachtung und gezielten Testpfad nachvollziehbar machen.

Nicht-Ziel:

- keine neue Attack-ID und kein neuer Scanner-Scope.

## Sicherheitsgrenze

Öffentliche Issues und Pull Requests dürfen keine Geheimnisse, privaten Daten oder noch nicht offengelegten Drittanbieter-Schwachstellen enthalten.

Sicherheitskritische Meldungen folgen weiterhin `SECURITY.md`.

## Abschlusskriterium für 8.5A

Phase 8.5A wird erst als abgeschlossen markiert, wenn:

- dieser Contributor-Vertrag öffentlich erreichbar ist;
- `CONTRIBUTING.md` auf den schnellen Einstieg verweist;
- das README einen sichtbaren Contributor-Einstieg enthält;
- der Vertrag durch einen Regressionstest abgesichert ist;
- mindestens zwei konkrete, kleine externe Aufgaben als GitHub-Issues veröffentlicht wurden;
- das externe Research-Issue `#20` ausdrücklich als fortgeschrittene Research-Evidenz und nicht als Einsteigeraufgabe klassifiziert bleibt.

## Veröffentlichte externe Aufgaben

Am 2026-08-31 wurden drei fokussierte externe Contributor-Aufgaben veröffentlicht:

- [Issue #22 — Verify the clean-clone quickstart on Node 24](https://github.com/Heaviside479/handoffprobe/issues/22)
- [Issue #23 — Document the Windows PowerShell contributor path](https://github.com/Heaviside479/handoffprobe/issues/23)
- [Issue #24 — Explain one existing synthetic fixture](https://github.com/Heaviside479/handoffprobe/issues/24)

Alle drei Aufgaben sind öffentlich, klein abgegrenzt und mit `documentation`, `help wanted` und `good first issue` gekennzeichnet.

Das externe Research-Issue `#20` bleibt davon getrennt und wird weiterhin nicht als `good first issue` behandelt.

Damit sind die definierten Abschlusskriterien für Phase 8.5A erfüllt.
