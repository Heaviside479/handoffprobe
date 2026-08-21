# Naming Checkpoint

Status: **working name only**

The GitHub repository is currently named `bridgebreak` and the project uses `BridgeBreak` internally.

## Discovered collision

In April 2026, Forescout Research / Vedere Labs published a high-profile OT security research campaign named **BRIDGE:BREAK** covering vulnerabilities in serial-to-IP converters.

Source:

- https://forescout.vederelabs.com/

This creates real risks for a security product using the same spoken/written name:

- search/SEO collision
- confusion in security discussions and press
- ambiguity when users search for CVEs/research
- potential naming/trademark concerns that require professional review if the project commercializes

## Decision

Do **not** spend money on branding or a domain yet.

Before any of the following, perform a dedicated naming check and choose whether to rename the public product/package while preserving repository history:

- npm publication
- dedicated domain purchase
- public Show HN launch
- commercial audit branding
- company incorporation around the product name

## Naming requirements if changed

A replacement should ideally be:

- short and pronounceable
- distinct in cybersecurity search results
- available enough across GitHub/npm/domain/social channels
- not tied only to A2A/MCP so future protocol expansion remains possible
- suitable for a CLI command

The repository can remain `bridgebreak` during pre-alpha research unless a rename materially reduces future migration cost.
