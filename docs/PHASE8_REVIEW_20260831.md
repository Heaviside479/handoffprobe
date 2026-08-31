# Phase 8.6A — Adoption- und Research-Review

Status: abgeschlossen am 2026-08-31

Snapshot-Basis: `main` auf `fddba1fe376e146e726365cf17ae0c50c92cd7ba`

## Ziel

Phase 8.6A misst die Phase-8-Adoption erneut, vergleicht die Werte mit der 8.0A-Baseline unter den bestehenden Interpretationsregeln, fasst die Research-Evidenz zusammen und wählt den Phase-9-Zielpfad ausschließlich aus belegbarer Evidenz.

Die Rohzähler werden nicht als Nutzerzahlen interpretiert.

## Baseline 8.0A

Unmittelbar nach dem öffentlichen v0.1.0-Launch wurde folgende Baseline festgehalten:

| Signal | 8.0A-Baseline |
| --- | ---: |
| GitHub Stars | 0 |
| GitHub Forks | 0 |
| Watcher / Subscriber | 0 |
| GitHub Views | 4 |
| Unique Viewer | 1 |
| GitHub Clones | 87 |
| Unique Cloner | 55 |
| Release-Asset-Downloads | 3 |
| npm Download-Zähler | nicht verfügbar |
| offene Issues / Pull Requests | 0 |
| Code-Contributors | 1 |

## Snapshot 8.6A

Der Read-only-Snapshot vom 2026-08-31 ergab:

| Signal | 8.6A-Snapshot | Rohvergleich |
| --- | ---: | --- |
| GitHub Stars | 0 | unverändert |
| GitHub Forks | 0 | unverändert |
| Watcher / Subscriber | 0 | unverändert |
| GitHub Views | 6 | +2 |
| Unique Viewer | 1 | +0 |
| GitHub Clones | 244 | +157 |
| Unique Cloner | 103 | +48 |
| Release-Asset-Downloads | 3 | +0 |
| npm last-day | 142 | Baseline nicht numerisch verfügbar |
| npm last-week | 142 | Baseline nicht numerisch verfügbar |
| npm last-month | 142 | Baseline nicht numerisch verfügbar |
| Issues gesamt | 4 | Baseline 0 |
| externe Issues | 1 | neues externes Signal |
| Pull Requests gesamt | 21 | Maintainer-Workflow |
| externe Pull Requests | 0 | kein externes Code-Signal |
| Code-Contributors | 1 | unverändert |
| externe Code-Contributors | 0 | kein externes Code-Signal |

Top-Referrer im Snapshot:

- `github.com`: 3 Aufrufe / 1 Unique;
- `npmjs.com`: 1 Aufruf / 1 Unique.

Die öffentliche GitHub-Code-Suche nach `Heaviside479/handoffprobe@` lieferte keinen Treffer. Wegen möglicher Indexierungsverzögerung oder unvollständiger Code-Suche wird daraus nicht abgeleitet, dass keine öffentliche GitHub-Action-Nutzung existiert.

## Interpretationsgrenzen

GitHub Traffic ist ein rollierendes 14-Tage-Fenster. Die Rohdifferenzen bei Views und Clones sind deshalb keine kohortenstabilen Wachstumswerte.

Clone-Zähler können Maintainer-Aufrufe, CI, Automation, Caches und wiederholte Clones enthalten. `244` Clones oder `103` Unique Cloner werden nicht als 244 beziehungsweise 103 HandoffProbe-Nutzer bezeichnet.

Die npm-Punktzähler sind jetzt verfügbar und melden beim Snapshot `142` für last-day, last-week und last-month. Die 8.0A-Baseline hatte für diese Endpunkte HTTP 404. Deshalb gibt es keinen belastbaren numerischen npm-Delta-Wert. Der Wechsel von „nicht verfügbar“ zu einem messbaren Zähler ist jedoch ein reales öffentliches Adoption-Signal.

Release-Asset-Downloads blieben bei `3`. npm-Downloads und GitHub-Release-Downloads messen unterschiedliche Verteilungswege und dürfen nicht addiert oder gleichgesetzt werden.

Stars, Forks und Subscriber bleiben bei `0`. Das widerspricht den anderen Abrufsignalen nicht, zeigt aber, dass aus den Paket- und Clone-Zählern keine Community-Adoption behauptet werden darf.

## Research- und Contributor-Evidenz

Phase 8 hat inzwischen einen externen, qualitativ relevanten Research-Request:

- Issue `#20` von `Silentpartnercoding`;
- externer eingefrorener A2A-1.0-zu-MCP-2026-07-28-Crossing-Corpus;
- Commit `09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a`;
- Corpus SHA-256 `f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb`;
- 28 datengetriebene Fälle;
- deterministischer öffentlicher Research-Pfad ohne kostenpflichtige Modell-API;
- Handoff-spezifische Bindungen für Caller, A2A message/task/context, MCP audience, exaktes Tool und Argumente, Status/Freshness und Replay;
- externe Effektbeobachtung ist Teil des Evidenzvertrags.

Die externen Contributor-Issues `#22`, `#23` und `#24` wurden vom Maintainer angelegt. Sie verbessern den Contributor-Loop, zählen aber nicht als externe Nachfrage.

Zum Snapshot existieren keine externen Pull Requests und keine externen Code-Contributors.

## Änderung gegenüber der 8.3B-Entscheidung

Phase 8.3B endete bewusst ohne Adapter, weil kein Kandidat gleichzeitig den vollständigen Admission Gate erfüllte.

Die damalige Re-Evaluierungsregel erlaubt eine erneute Entscheidung, wenn ein realer `[Adapter]`-Request, ein reproduzierbarer Research-Fall oder neue Evidenz für die exakte Protokollgrenze erscheint.

Issue `#20` ist nach dieser Entscheidung entstanden und erfüllt genau diesen Re-Evaluierungstyp: Es ist ein externer Research-/Integrationsrequest für die aktuelle A2A-1.0-zu-MCP-2026-07-28-Grenze und liefert einen commit- und digest-gepinnten, deterministischen, no-paid Corpus.

## Phase-9-Entscheidung

**Phase 9 soll nicht mit einem breit angelegten Framework-Adapter beginnen.**

Der evidenzgestützte Primärpfad ist:

**Issue `#20` — eine schmale externe Crossing-Corpus-Conformance-Integration für den eingefrorenen A2A 1.0 → MCP 2026-07-28 Corpus.**

Das Ziel ist, HandoffProbes bestehende Engine beziehungsweise den Protocol-Lab-Pfad gegen den externen Corpus abzubilden und die Ergebnisse mit HandoffProbes eigener Beobachtung sowie einem vom Verifier getrennten Effect Recorder zu erzeugen.

Diese Auswahl ist keine Aussage, dass der externe Corpus korrekt oder HandoffProbe fehlerhaft ist. Matching-, refuting-, partial- oder non-green Ergebnisse sind zulässige Research-Evidenz.

## Phase-9-Admission für Issue #20

Die Auswahl besteht den aktuellen Evidence Gate in folgender Form:

1. **Meaningful handoff/composition path:** A2A 1.0 → Translation → MCP 2026-07-28 unmittelbar vor dem Effekt.
2. **Real demand / research evidence:** externes öffentliches Issue `#20` mit konkretem Research-Request.
3. **Handoff-specific security value:** Bindung zwischen Upstream-Identität/Aufgabe und Downstream-Audience/Tool/Argumenten statt generischem Single-Protocol-Scanning.
4. **Deterministic reproduction:** eingefrorener 28-Fälle-Corpus mit Commit- und Digest-Bindung.
5. **Maintenance/version risk understood:** Protokolltuple ist exakt angegeben; SDK-Abweichungen und Transformationen müssen dokumentiert werden.
6. **No paid infrastructure:** kein bezahltes Modell, keine bezahlte Cloud und keine unautorisierte Drittanbieter-Aktivität erforderlich.

## Verbindliche Phase-9-Grenzen

Für die erste Phase-9-Umsetzung gelten mindestens diese Grenzen:

- Corpus-Commit `09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a` und SHA-256 `f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb` bleiben gepinnt;
- jede notwendige Transformation zwischen externem Corpus und HandoffProbe wird explizit dokumentiert;
- externe Ergebnisse verwenden HandoffProbes eigenen Beobachtungspfad;
- native Effekte werden durch einen vom Verifier getrennten Effect Recorder beobachtet;
- Referenz-Fixture-Zeilen dürfen keine Lücken in externer Evidenz füllen;
- ein Adapter muss die bestehende HandoffProbe-Engine wiederverwenden;
- keine Schwachstelle in A2A, MCP, HandoffProbe oder dem externen Projekt wird ohne bestätigte Evidenz behauptet;
- bei einer bestätigten Drittanbieter-Schwachstelle gilt weiterhin `SECURITY.md` und der Responsible-Disclosure-Gate;
- kein bezahlter AI-Service, keine bezahlte Cloud und keine versteckte Telemetrie;
- das veröffentlichte `handoffprobe@0.1.0` bleibt unveränderlich.

## Nicht ausgewählte Phase-9-Pfade

`fast-agent` bleibt technisch interessant, besitzt aber weiterhin kein vergleichbar direktes externes Demand-Signal für einen HandoffProbe-Framework-Adapter.

Google ADK, IBM ContextForge, tRPC-Agent-Go und der betrachtete LangGraph-Pfad bleiben durch die in 8.3B dokumentierten Protokoll-, Reproduzierbarkeits- oder Infrastrukturgrenzen blockiert, solange keine neue Evidenz diese Grenzen verändert.

Breite Multi-Framework-Expansion, SaaS, Accounts, Billing, hidden telemetry und generisches MCP-only- oder Prompt-Injection-Scanning bleiben außerhalb dieser Entscheidung.

## Phase-8-Schlussfolgerung

Phase 8 zeigt noch keine belastbare breite Community- oder CI-Adoption: Stars, Forks, externe PRs und externe Code-Contributors bleiben bei null und die öffentliche Action-Suche ist nicht beweiskräftig.

Gleichzeitig existieren stärkere Abrufsignale als in der Launch-Baseline und erstmals ein konkretes externes Research-/Integrationssignal für die exakte HandoffProbe-Protokollgrenze.

Das reicht aus, um Phase 9 **gezielt** zu starten, aber nicht, um spekulativ mehrere Framework-Adapter zu bauen.

Phase 8.6A ist damit abgeschlossen.
