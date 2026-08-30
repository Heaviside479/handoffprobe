import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readme = readFileSync('README.md', 'utf8');
const contributing = readFileSync('CONTRIBUTING.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const record = readFileSync('docs/PHASE8_ADOPTION_SIGNALS_20260830.md', 'utf8');
const adoptionForm = readFileSync('.github/ISSUE_TEMPLATE/adoption-feedback.yml', 'utf8');
const adapterForm = readFileSync('.github/ISSUE_TEMPLATE/adapter-request.yml', 'utf8');
const issueConfig = readFileSync('.github/ISSUE_TEMPLATE/config.yml', 'utf8');

describe('Phase 8.2B telemetry-free adoption signals', () => {
  it('offers voluntary public adoption feedback without hidden telemetry', () => {
    expect(readme).toContain('## Opt-in adoption and integration feedback');
    expect(readme).toContain(
      'https://github.com/Heaviside479/handoffprobe/issues/new?template=adoption-feedback.yml',
    );
    expect(adoptionForm).toContain('Repeated local use');
    expect(adoptionForm).toContain('Repeated CI use');
    expect(adoptionForm).toContain('Every pull request');
    expect(adoptionForm).toContain('Public repository URL');
    expect(adoptionForm).toContain('HandoffProbe does not collect hidden usage telemetry');
    expect(record).toContain('an adoption-feedback issue is one opt-in report');
    expect(record).toContain('not automatically one unique user');
  });

  it('collects adapter demand using the existing evidence gate', () => {
    expect(readme).toContain(
      'https://github.com/Heaviside479/handoffprobe/issues/new?template=adapter-request.yml',
    );
    expect(contributing).toContain('Adapter and integration demand');
    expect(adapterForm).toContain('Handoff-specific security value');
    expect(adapterForm).toContain('Reproducible test path');
    expect(adapterForm).toContain('Paid infrastructure requirement');
    expect(adapterForm).toContain('Maintenance and versioning risk');
    expect(adapterForm).toContain('does not guarantee implementation');
    expect(record).toContain('collection channel for that evidence');
  });

  it('keeps security-sensitive disclosure out of public feedback forms', () => {
    expect(issueConfig).toContain('blank_issues_enabled: true');
    expect(issueConfig).toContain('https://github.com/Heaviside479/handoffprobe/security/policy');
    expect(adoptionForm).toContain('undisclosed vulnerability report');
    expect(adapterForm).toContain('undisclosed vulnerability report');
    expect(record).toContain(
      'Phase 8.2B does not move vulnerability disclosure into public issues',
    );
  });

  it('closes 8.2B and keeps evidence-backed adapter research next', () => {
    expect(roadmap).toContain(
      '- [x] 8.2B — improve telemetry-free public or opt-in adoption signals',
    );
    expect(roadmap).toContain('- [ ] 8.3A — research and rank adapter demand using real evidence');
    expect(record).toContain('No scanner behavior');
    expect(record).toContain('already published `handoffprobe@0.1.0` artifact is changed');
  });
});
