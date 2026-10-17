// Page snapshots in research/*/sources keep no page editor's or author's name: gov.pl and BIP pages print them in their
// publication record and change history ("12.08.2019 13:32 <name>", "Autor: <name>"), and the lab repository is public
// (docs/solutions/2026-10-17-editor-names-in-page-snapshots.md). Run: node --test tools/sources/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// A line that names a person where a page's record does: a date and time followed by a capitalised name, or an
// "Autor:" / "Opublikował(a):" / "Wytworzył(a):" field holding two capitalised words that are not an office.
export function nameLines(text) {
  const office = /^(Departament|Wydział|Biuro|Urząd|Zespół|Redakcja|Ministerstwo|Centrum|Kancelaria|Sekretariat|Oddział)\b/;
  return text.split('\n').map((l, i) => ({ l: l.trim(), n: i + 1 })).filter(({ l }) => {
    const dated = /\b\d{2}\.\d{2}\.\d{4} \d{2}:\d{2} (\p{Lu}\p{Ll}+ \p{Lu}\p{Ll}+)/u.exec(l);
    const field = /(?:Autor|Opublikował[a]?|Wytworzył[a]?|Zmodyfikował[a]?)\s*:\s*(\p{Lu}\p{Ll}+ \p{Lu}[\p{Ll}-]+)/u.exec(l);
    const hit = dated?.[1] ?? field?.[1];
    return hit && !office.test(hit);
  });
}

test('a page record with a person is caught, an office is not', () => {
  assert.equal(nameLines('Pierwsza publikacja: 12.08.2019 13:32 Anna Kowalska').length, 1);
  assert.equal(nameLines('Autor: Jan Kowalski').length, 1);
  assert.equal(nameLines('Autor: Departament Rynku PracyData publikacji: 03.06.2025').length, 0);
  assert.equal(nameLines("12.08.2019 13:32 [editor's name removed]").length, 0);
});

test('no page snapshot in research/*/sources names a page editor or author', () => {
  const root = 'research';
  const hits = [];
  for (const d of readdirSync(root)) {
    const dir = join(root, d, 'sources');
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.txt') && !x.includes('extract'))) {
      for (const h of nameLines(readFileSync(join(dir, f), 'utf8'))) hits.push(`${join(dir, f)}:${h.n}: ${h.l.slice(0, 80)}`);
    }
  }
  assert.deepEqual(hits, []);
});
