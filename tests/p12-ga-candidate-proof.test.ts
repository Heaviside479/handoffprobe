import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const evidence = readFileSync('docs/P12_5_GA_CANDIDATE_PROOF_20260922.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');

const start = roadmap.indexOf('## P12.5 — GA candidate and live release-engineering proof');
const end = roadmap.indexOf('## P12.6 — asynchronous external-use and adoption evidence');
const p12_5 = roadmap.slice(start, end);

describe('P12.5 GA candidate proof', () => {
  it('freezes the exact candidate and workflow identity', () => {
    expect(evidence).toContain('63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc');
    expect(evidence).toContain('run ID: `35769245125`');
    expect(evidence).toContain('job ID: `106886473053`');
    expect(evidence).toContain('event: `workflow_dispatch`');
    expect(evidence).toContain('result: `success`');
  });

  it('records byte-identical candidate artifact proof', () => {
    const digest = '00c2bfd715cd3b7634c299ef1656ba39a477597023533c4be1d0b13fb79b27ad';

    expect(evidence.split(digest)).toHaveLength(4);
    expect(evidence).toContain('Release artifact reproducibility: PASS');
    expect(evidence).toContain('The candidate payload contained 296 files.');
  });

  it('records SBOM and retained-artifact verification', () => {
    expect(evidence).toContain('e9c4bca76dab4c7a437f5a1726a81d12aa196d9565f4a2cc8d62063c28c9ada0');
    expect(evidence).toContain('d23f8358252fd51097bbbb582803fa050aa8476c84d645a1a4c90af992db5d10');
    expect(evidence).toContain('artifact ID: `10713541739`');
    expect(evidence).toContain('afd785ff2dc92596f8fa745e9c4d4bfa40adf6fd1fd6e9ae6da62f16eeaed253');
    expect(evidence).toContain('runtime package count: 74');
    expect(evidence).toContain('Independent verification observed:');
  });

  it('marks exactly the four completed P12.5 gates', () => {
    expect(p12_5).toContain(
      'Status: **IN PROGRESS — candidate / reproducibility / SBOM proof complete**',
    );
    expect(p12_5).toContain('- [x] freeze the exact candidate commit;');
    expect(p12_5).toContain('- [x] run the Release Candidate workflow from the exact candidate;');
    expect(p12_5).toContain('- [x] reproduce byte-identical candidate npm artifacts;');
    expect(p12_5).toContain('- [x] generate and verify the release SBOM;');

    expect(p12_5.match(/- \[x\]/g) ?? []).toHaveLength(4);
    expect(p12_5.match(/- \[ \]/g) ?? []).toHaveLength(6);
  });

  it('keeps publication and external-validation gates open', () => {
    expect(p12_5).toContain('- [ ] exercise the real npm stage / Trusted Publishing path');
    expect(p12_5).toContain('- [ ] verify npm provenance from the real publishing path;');
    expect(p12_5).toContain('- [ ] install and execute the exact candidate externally;');
    expect(p12_5).toContain(
      '- [ ] verify the reusable GitHub Action externally from the candidate identity;',
    );
    expect(evidence).toContain('- authorize `1.0.0-rc.1`;');
    expect(evidence).toContain('- authorize `1.0.0`;');
    expect(evidence).toContain('The public package remains `handoffprobe@0.4.0`.');
    expect(evidence).toContain('The stable public corpus remains 23 attacks.');
  });

  it('indexes the P12.5 evidence record', () => {
    expect(docsIndex).toContain('P12_5_GA_CANDIDATE_PROOF_20260922.md');
  });
});
