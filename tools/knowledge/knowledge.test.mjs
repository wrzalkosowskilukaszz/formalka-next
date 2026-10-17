// The fact base tooling, and the state of knowledge/ itself.
// Run: node --test tools/knowledge/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { INDEX, ROOT, checkAll, checkMatter, found, indexText, load, readmeRows } from './knowledge.mjs';

test('found: a quote survives line breaks and words broken with a hyphen, never a header line', () => {
  const text = '# sha256 header: Odwołanie wnosi się w terminie 3 dni\n     2. Odwołanie od decyzji w sprawach, o których mowa w ust. 1, wnosi się w terminie 7 dni od dnia dorę-\nczenia decyzji.\n';
  assert.ok(found('Odwołanie od decyzji w sprawach, o których mowa w ust. 1, wnosi się w terminie 7 dni od dnia doręczenia decyzji.', text));
  assert.ok(!found('Odwołanie wnosi się w terminie 3 dni', text), 'a "#" line is the file header, not the source');
  assert.ok(!found('wnosi się w terminie 14 dni od dnia doręczenia', text));
  assert.ok(found('Ustawa o zmianie ustawy – Prawo o notariacie', 'Ustawa o zmianie ustawy – Prawo\no notariacie'));
  assert.ok(found('jednolity tekst ustawy o cudzo-ziemcach', 'jednolity tekst ustawy o cudzo-\nziemcach'), 'a real hyphen at a line end is kept in the second reading');
});

test('found: parts split at "…" must occur in order', () => {
  const text = 'Art. 321. 1. Organem wyższego stopnia jest Komendant Główny Straży Granicznej. 2. Odwołanie wnosi się w terminie 7 dni.';
  assert.ok(found('Organem wyższego stopnia … Komendant Główny Straży Granicznej', text));
  assert.ok(!found('Komendant Główny Straży Granicznej … Organem wyższego stopnia', text));
});

test('readmeRows: facts by section and topic, pages, inferences by their bold lead, OPEN ids', () => {
  const md = [
    '## What they say (FACT)', '', '### The return decision', '', '| Topic | Content | Basis |', '|---|---|---|',
    '| Who issues it | The Border Guard | UoC art. 310 |', '| **The appeal** | 7 days | UoC art. 321 |', '',
    '## What the pages add, and where they differ from the act', '', '| Point | Page | Act |', '|---|---|---|', '| Booking | phone | NPP art. 8 |', '',
    '## Inferences (to be confirmed)', '', '- **The appeal time is short:** 7 days.', '- A plain bullet with no bold lead', '',
    '## Open', '', '| Id | Question |', '|---|---|', '| OPEN-D1 | Who computes the day |', '',
    '## The tools', '', '| Topic | x |', '|---|---|', '| Not a fact | x |',
  ].join('\n');
  const r = readmeRows(md);
  assert.deepEqual(r.fact, [{ section: 'The return decision', topic: 'Who issues it' }, { section: 'The return decision', topic: 'The appeal' }]);
  assert.deepEqual(r.page, [{ topic: 'Booking' }]);
  assert.deepEqual(r.inference.map((x) => x.topic), ['The appeal time is short:', 'A plain bullet with no bold lead']);
  assert.deepEqual(r.open, [{ topic: 'OPEN-D1' }]);
  assert.equal(readmeRows('## Where the pages and the acts differ\n| Point | a |\n|---|---|\n| X | y |').page.length, 1);
});

test('checkMatter: a record that is not in its source, or a README row with no record, fails', () => {
  const readme = 'research/2026-10-17-return/sources/README.md';
  const base = {
    matter: 'return-decision', title: 't', doc19: 26, map: 'docs/formalka-next/maps/return-decision.md', readme, asOf: '2026-10-17',
    check: { status: existsSync(join(ROOT, 'research/2026-10-17-return/sources/CHECK.md')) ? 'checked' : 'unchecked', file: null },
    acts: { UoC: { name: 'act on foreigners', eli: 'DU/2025/1079' } }, coverage: false, coverageNote: 'a test fixture',
    records: [{ id: 'return-decision.appeal', kind: 'fact', section: 'The return decision', topic: 'The appeal', claim: '7 days',
      basis: [{ act: 'UoC', unit: 'art. 321 ust. 2' }],
      quotes: [{ file: 'research/2026-10-17-return/sources/uoc-return-extract.txt', text: 'Odwołanie od decyzji w sprawach, o których mowa w ust. 1, wnosi się w terminie 7 dni od dnia doręczenia decyzji.' }] }],
  };
  if (base.check.status === 'checked') base.check.file = 'research/2026-10-17-return/sources/CHECK.md';
  const file = join(ROOT, 'knowledge/facts/return-decision.json');
  assert.deepEqual(checkMatter(base, file), []);
  const wrong = structuredClone(base);
  wrong.records[0].quotes[0].text = 'Odwołanie od decyzji wnosi się w terminie 14 dni od dnia doręczenia decyzji.';
  assert.match(checkMatter(wrong, file).join('\n'), /not found verbatim/);
  const noAct = structuredClone(base);
  noAct.records[0].basis = [{ act: 'KPA', unit: 'art. 129' }];
  assert.match(checkMatter(noAct, file).join('\n'), /basis act "KPA" is not in "acts"/);
  const covered = structuredClone(base);
  delete covered.coverage;
  assert.match(checkMatter(covered, file).join('\n'), /the README's fact row "The return decision" \/ "Who issues it" has no record/);
  const status = structuredClone(base);
  status.check = { status: 'checked', file: 'research/2026-10-17-return/sources/CHECK.md' };
  if (base.check.status === 'unchecked') assert.match(checkMatter(status, file).join('\n'), /"check.status" must be "unchecked"/);
});

test('the fact base passes its own check, and its index is current', () => {
  const files = load();
  assert.deepEqual(checkAll(files), []);
  if (files.length) assert.equal(existsSync(INDEX) && readFileSync(INDEX, 'utf8'), indexText(files), 'run node tools/knowledge/index.mjs');
});
