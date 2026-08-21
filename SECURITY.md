# Security Policy

BridgeBreak is a defensive security-testing project.

## Authorized use

Use BridgeBreak only against:

- systems you own
- local fixtures and demos
- intentionally vulnerable test environments
- systems for which you have explicit authorization to perform the relevant testing

Do not use the project to disrupt, damage or access third-party systems without authorization.

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
2. minimize the reproduction
3. contact the affected maintainer privately where feasible
4. allow reasonable remediation time before publication
5. coordinate public disclosure when appropriate
6. retain a safe regression case after the issue is fixed, without embedding real secrets or unnecessary exploit material

## Research principles

- minimize harm
- avoid unnecessary access to real user data
- use synthetic data and local fixtures where possible
- make claims only when evidence is reproducible
- distinguish protocol weakness, implementation weakness and configuration error
- credit reporters and affected maintainers appropriately
