# Security Policy

BridgeBreak is a defensive security-testing project.

## Authorized use

Use BridgeBreak only against:

- systems you own
- local fixtures and demos
- intentionally vulnerable test environments
- systems for which you have explicit authorization to perform the relevant testing

Do not use the project to disrupt, damage or access third-party systems without authorization.

## Safe defaults

BridgeBreak v0.1 should default active tests to local/loopback fixtures. Bundled tools must use harmless synthetic side effects wherever possible.

If remote active testing is added later, it must require explicit operator opt-in. Destructive/high-impact tests should remain disabled by default and require clear configuration plus authorization.

Test reports/evidence must redact bearer tokens, credentials and other secrets before writing them to disk or CI artifacts.

## Reporting a vulnerability in BridgeBreak

Please do not publish an unpatched vulnerability in BridgeBreak as a public issue if disclosure could put users at risk. Use GitHub's private vulnerability reporting / security-advisory mechanism when enabled for this repository.

A useful report includes:

- affected version/commit
- impact
- minimal reproduction
- expected vs observed behavior
- suggested mitigation if known

## Vulnerabilities found with BridgeBreak

When BridgeBreak identifies a likely vulnerability in another project:

1. verify it in an authorized environment
2. distinguish composition gap, protocol requirement, implementation bug and configuration/hardening issue
3. minimize the reproduction and remove real credentials/data
4. contact the affected maintainer privately where feasible
5. allow reasonable remediation time before publication
6. coordinate public disclosure when appropriate
7. retain a safe regression case after the issue is fixed, without embedding real secrets or unnecessary weaponized exploit material

## Research principles

- minimize harm
- avoid unnecessary access to real user data
- use synthetic data and local fixtures where possible
- make claims only when evidence is reproducible
- state protocol versions and preconditions
- distinguish protocol weakness, implementation weakness, configuration error and composition-responsibility gap
- do not overstate conformance-tool results as a security certification
- credit prior research, reporters and affected maintainers appropriately
