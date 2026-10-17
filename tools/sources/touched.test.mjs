// The amended-articles reader, on a fixture shaped like pdftotext output. Run: node --test tools/sources/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { touchedArticles, citedBy } from './touched.mjs';

const title = 'Ustawa z dnia 27 sierpnia 2004 r. o świadczeniach opieki zdrowotnej finansowanych ze środków publicznych';
const fixture = `     Art. 6. W ustawie z dnia 24 września 2010 r. o ewidencji ludności w art. 8 dodaje się pkt 24b.
     Art. 7. W ustawie z dnia 27 sierpnia 2004 r. o świadczeniach opieki zdrowotnej finansowanych ze środków publicz-
nych (Dz. U. z 2025 r. poz. 1461) wprowadza się następujące zmiany:
1)    w art. 12:
      a)    uchyla się pkt 13,
      b) dodaje się pkt 14 w brzmieniu:
            „14) art. 112c ustawy z dnia 13 czerwca 2003 r. o udzielaniu cudzoziemcom ochrony.
     Art. 99. Quoted, so not the next article.ˮ;
Dziennik Ustaw                                   – 12 –                                        Poz. 203
2)    w art. 50 w ust. 2 uchyla się pkt 1a;
3)    po art. 23b dodaje się art. 23c–23i w brzmieniu:
      „Art. 23c. Nowy przepis.”;
     Art. 8. W ustawie z dnia 20 marca 2025 r. o rynku pracy w art. 1 dodaje się ust. 3.
`;

test('lists the articles an amending article changes, skipping quoted wording and stopping at the next article', () => {
  const r = touchedArticles(fixture, title);
  assert.equal(r.length, 1);
  assert.equal(r[0].article, 'Art. 7');
  assert.deepEqual(r[0].changes, ['12', '50', '23b', '23c–23i']);
});

test('a change to the annex is listed apart, with its part and paragraph', () => {
  const t = 'Art. 3. W ustawie z dnia 27 sierpnia 2004 r. o świadczeniach opieki (Dz. U. poz. 1) w załączniku do ustawy w części III w ust. 44 w kolumnie czwartej wyrazy „x” zastępuje się wyrazami „y”. Art. 4. Inna ustawa.';
  const r = touchedArticles(t, title);
  assert.deepEqual(r[0].changes, []);
  assert.deepEqual(r[0].annex, ['załącznik część III ust. 44']);
  assert.deepEqual(touchedArticles(fixture, title)[0].annex, []);
});

test('short titles and titles with a dash match the amending wording', () => {
  const t1 = 'Art. 5. W ustawie z dnia 12 grudnia 2013 r. o cudzoziemcach (Dz. U. poz. 1) w art. 160 uchyla się pkt 2. Art. 6. Inna.';
  assert.deepEqual(touchedArticles(t1, 'Ustawa z dnia 12 grudnia 2013 r. o cudzoziemcach')[0].changes, ['160']);
  const t2 = 'Art. 9. W ustawie z dnia 28 listopada 2014 r. – Prawo o aktach stanu cywilnego (Dz. U. poz. 1) w art. 55 ust. 1 otrzymuje brzmienie: „1. X.”. Art. 10. Inna.';
  assert.deepEqual(touchedArticles(t2, 'Ustawa z dnia 28 listopada 2014 r. Prawo o aktach stanu cywilnego')[0].changes, ['55']);
  const t3 = 'Art. 2. W ustawie z dnia 25 lutego 1964 r. – Kodeks rodzinny i opiekuńczy (Dz. U. poz. 1) w art. 4 dodaje się § 2. Art. 3. Inna.';
  assert.deepEqual(touchedArticles(t3, 'Ustawa z dnia 25 lutego 1964 r. - Kodeks rodzinny i opiekuńczy.')[0].changes, ['4']);
});

test('an act that does not amend this one gives an empty list; a bad title throws', () => {
  assert.deepEqual(touchedArticles('Art. 1. W ustawie z dnia 1 lipca 2000 r. o czymś innym w art. 5 uchyla się ust. 2.', title), []);
  assert.throws(() => touchedArticles(fixture, 'Rozporządzenie Ministra'));
});

test('citedBy matches ranges, lettered articles and either end of a range', () => {
  const cited = citedBy('2-4,12,50a');
  assert.equal(cited('3'), true);
  assert.equal(cited('12'), true);
  assert.equal(cited('50'), false);
  assert.equal(cited('50a'), true);
  assert.equal(cited('1–3'), true);
  assert.equal(cited('23c–23i'), false);
});
