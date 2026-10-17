// The entry-into-force reader, on a fixture shaped like pdftotext output. Run: node --test tools/sources/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entryArticle } from './entry-dates.mjs';

const fixture = `      Art. 18. 1. Dotychczasowe przepisy wykonawcze zachowują moc.
      Art. 19. Ustawa wchodzi w życie po upływie 14 dni od dnia ogłoszenia, z wyjątkiem:
1)   art. 9 i art. 17, które wchodzą w życie z dniem następującym po dniu ogłoszenia;
2)   art. 1 pkt 3–5, 8–41, które wchodzą w życie z dniem określonym w komunikacie, o którym mowa w art. 17;
Dziennik Ustaw                                   – 42 –                                        Poz. 1794
3)   art. 1 pkt 42, 43, 44 lit. a, pkt 45, 46, które wchodzą w życie
     z dniem 1 kwietnia 2026 r.;


                                                         Prezydent Rzeczypospolitej Polskiej: K. Nawrocki
`;

test('returns the last entry-into-force article with its exceptions, across page breaks', () => {
  const r = entryArticle(fixture);
  assert.ok(r.article.startsWith('Art. 19. Ustawa wchodzi w życie'));
  assert.match(r.article, /pkt 42, 43, 44 lit\. a, pkt 45, 46, które wchodzą w życie z dniem 1 kwietnia 2026 r\./);
  assert.doesNotMatch(r.article, /Prezydent|Dziennik Ustaw/);
  assert.equal(r.exceptions, true);
  assert.equal(r.announcement, true);
});

test('an act with one date has no exceptions; text without the article returns null', () => {
  const r = entryArticle('Art. 5. Ustawa wchodzi w życie z dniem 1 stycznia 2027 r.\n Prezydent Rzeczypospolitej Polskiej: X');
  assert.equal(r.exceptions, false);
  assert.equal(r.announcement, false);
  assert.equal(entryArticle('Art. 1. Coś innego.'), null);
});

test('a regulation\'s entry-into-force paragraph is found', () => {
  const r = entryArticle('§ 1. W rozporządzeniu wprowadza się zmiany.\n     § 2. Rozporządzenie wchodzi w życie po upływie 14 dni od dnia ogłoszenia.\n                    Minister Edukacji: wz. K. Lubnauer');
  assert.ok(r.article.startsWith('§ 2. Rozporządzenie wchodzi w życie po upływie 14 dni'));
  assert.doesNotMatch(r.article, /Minister Edukacji/);
  assert.equal(r.exceptions, false);
});
