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

    expect(evidence).toContain(digest);
    expect(evidence).toContain('Release artifact reproducibility: PASS');
    expect(evidence).toContain('The candidate payload contained 296 files.');
  });

  it('records SBOM and retained-artifact verification', () => {
    expect(evidence).toContain('e9c4bca76dab4c7a437f5a1726a81d12aa196d9565f4a2cc8d62063c28c9ada0');
    expect(evidence).toContain('d23f8358252fd51097bbbb582803fa050aa8476c84d645a1a4c90af992db5d10');
    expect(evidence).toContain('artifact ID: `10713541739`');
    expect(evidence).toContain('afd785ff2dc92596f8fa745e9c4d4bfa40adf6fd1fd6e9ae6da62f16eeaed253');
    expect(evidence).toContain('runtime package count: 74');
  });

  it('records exact-candidate external installation proof', () => {
    expect(evidence).toContain('## External exact-candidate installation and execution');
    expect(evidence).toContain('observed cross-environment digest equality: yes');
    expect(evidence).toContain('selected attacks: 23');
    expect(evidence).toContain('PASS: 23');
    expect(evidence).toContain('FAIL: 0');
    expect(evidence).toContain('ERROR: 0');
  });

  it('records separate consumer Action verification', () => {
    expect(evidence).toContain('audit PR: `#10`');
    expect(evidence).toContain('workflow run: `35772627004`');
    expect(evidence).toContain('workflow job: `106897794363`');
    expect(evidence).toContain('artifact ID: `10714971132`');
    expect(evidence).toContain(
      'sha256:4148969be14058898bc7add363518e5e7e8eeb1024a333ba56a572d0c29477ca',
    );
    expect(evidence).toContain('closed unmerged');
    expect(evidence).toContain('not independent adoption');
  });

  it('records exact-candidate user-guidance execution proof', () => {
    expect(evidence).toContain('## Upgrade, migration and troubleshooting guidance verification');
    expect(evidence).toContain('00c2bfd715cd3b7634c299ef1656ba39a477597023533c4be1d0b13fb79b27ad');
    expect(evidence).toContain('JSON report schema: `1`');
    expect(evidence).toContain('JSON selected attack count: 23');
    expect(evidence).toContain('vulnerable `HP-AUTH-001` demonstration: exit `1`');
    expect(evidence).toContain('invalid configuration: exit `2`');
    expect(evidence).toContain('output-write failure: exit `3`');
    expect(evidence).toContain('Markdown report path: success');
    expect(evidence).toContain('1ea17074fdcf6c34ef522adfba5809cf367d44c3');
    expect(evidence).toContain('2f72e59c9239a9d0b74a26072dfb650e9af155da');
    expect(evidence).toContain('6d4d6ab11d748ea0a61df54f122dd14fde2ec027');
    expect(evidence).toContain('source identity from package-version identity');
  });

  it('marks exactly eight completed P12.5 gates', () => {
    expect(p12_5).toContain(
      'Status: **IN PROGRESS — candidate / reproducibility / SBOM / external consumer / user-guidance / prerelease decision complete**',
    );

    expect(p12_5).toContain('- [x] freeze the exact candidate commit;');
    expect(p12_5).toContain('- [x] run the Release Candidate workflow from the exact candidate;');
    expect(p12_5).toContain('- [x] reproduce byte-identical candidate npm artifacts;');
    expect(p12_5).toContain('- [x] generate and verify the release SBOM;');
    expect(p12_5).toContain('- [x] install and execute the exact candidate externally;');
    expect(p12_5).toContain(
      '- [x] verify the reusable GitHub Action externally from the candidate identity;',
    );

    expect(p12_5).toContain(
      '- [x] verify upgrade/migration/troubleshooting guidance against the candidate;',
    );

    expect(p12_5).toContain(
      '- [x] decide whether prerelease publication materially improves final validation.',
    );

    expect(p12_5.match(/- \[x\]/g) ?? []).toHaveLength(8);
    expect(p12_5.match(/- \[ \]/g) ?? []).toHaveLength(2);
  });

  it('records the prerelease validation decision without authorizing publication', () => {
    expect(evidence).toContain('## Prerelease publication decision');
    expect(evidence).toContain(
      'an evidence-backed `1.0.0-rc.1` materially improves final validation before v1 GA',
    );
    expect(evidence).toContain(
      'exercise the real registry-backed installation path under an intended v1 prerelease identity',
    );
    expect(evidence).toContain(
      'obtain publication provenance from the real trusted-publishing path',
    );
    expect(evidence).toContain('authorize changing the package version to `1.0.0-rc.1`');
    expect(evidence).toContain('authorize npm stage publication');
    expect(evidence).toContain(
      'A concrete prerelease version transition and any real npm stage action remain separately controlled steps.',
    );
  });

  it('keeps publication and remaining validation gates open', () => {
    expect(p12_5).toContain('- [ ] exercise the real npm stage / Trusted Publishing path');
    expect(p12_5).toContain('- [ ] verify npm provenance from the real publishing path;');

    expect(evidence).toContain('- authorize `1.0.0-rc.1`;');
    expect(evidence).toContain('- authorize `1.0.0`;');
    expect(evidence).toContain('The public package remains `handoffprobe@0.4.0`.');
    expect(evidence).toContain('The stable public corpus remains 23 attacks.');
  });

  it('indexes the P12.5 evidence record', () => {
    expect(docsIndex).toContain('P12_5_GA_CANDIDATE_PROOF_20260922.md');
  });
});
