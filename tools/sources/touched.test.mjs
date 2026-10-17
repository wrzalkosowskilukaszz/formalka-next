// The amended-articles reader, on a fixture shaped like pdftotext output. Run: node --test tools/sources/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { touchedArticles, citedBy, amendingAfter, actWithAmendments, appliedBy } from './touched.mjs';

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

// Shaped like Dz.U. 2026 poz. 1162 and 2026 poz. 891, which amend regulations by paragraph (§).
const regTitle = 'Rozporządzenie Ministra Infrastruktury z dnia 5 sierpnia 2025 r. w sprawie wydawania dokumentów stwierdzających uprawnienia do kierowania pojazdami';
const regFixture = `    § 1. W rozporządzeniu Ministra Infrastruktury z dnia 5 sierpnia 2025 r. w sprawie wydawania dokumentów stwierdza-
jących uprawnienia do kierowania pojazdami (Dz. U. poz. 1073) wprowadza się następujące zmiany:
1)    w § 5:
      a)    po ust. 2 dodaje się ust. 2a w brzmieniu:
                 „2a. W przypadku złożenia oświadczenia stosuje się § 15 ust. 1 pkt 4.”,
      c)    w ust. 6 wyrazy „art. 4 ust. 1 pkt 2 lit. a i b” zastępuje się wyrazami „art. 4 ust. 1 pkt 2 lit. b”;
4)    w § 14 w ust. 4 wyrazy „art. 11 ust. 1 pkt 5” zastępuje się wyrazami „art. 11 ust. 1a pkt 2”;
6)   § 20 otrzymuje brzmienie:
           „§ 20. Organ rejestrujący obsługuje wnioski.”;
8)    uchyla się § 22;
9)   w załączniku nr 13 do rozporządzenia w tabeli wyrazy „x” zastępuje się wyrazami „y”;
     § 2. Rozporządzenie wchodzi w życie z dniem 3 września 2026 r.
`;

test('a regulation: the paragraphs its amending paragraph changes, skipping quoted wording', () => {
  const r = touchedArticles(regFixture, regTitle);
  assert.equal(r.length, 1);
  assert.equal(r[0].article, '§ 1');
  assert.equal(r[0].unit, '§');
  assert.deepEqual(r[0].changes, ['5', '14', '20', '22']);
  assert.deepEqual(r[0].annex, ['załącznik 13']);
  assert.equal(touchedArticles(fixture, title)[0].unit, 'art.');
});

test('a regulation of another subject or date is not matched', () => {
  assert.deepEqual(touchedArticles(regFixture, 'Rozporządzenie Ministra Infrastruktury z dnia 8 listopada 2024 r. w sprawie rejestracji i oznaczania pojazdów'), []);
  assert.deepEqual(touchedArticles(regFixture, 'Rozporządzenie Ministra Infrastruktury z dnia 5 sierpnia 2025 r. w sprawie egzaminowania osób'), []);
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

test('a consolidated text is resolved to its base act, whose amendments are listed; a bare obwieszczenie throws', async () => {
  const meta = {
    'DU/2025/734': { type: 'Obwieszczenie', title: 'Obwieszczenie … Kodeks wykroczeń', references: { 'Tekst jednolity dla aktu': [{ id: 'DU/1971/114' }] } },
    'DU/1971/114': { type: 'Ustawa', title: 'Kodeks wykroczeń', references: { 'Akty zmieniające': [
      { id: 'DU/2025/1872', date: '2026-01-29' }, { id: 'DU/2025/1814', date: '2026-01-02' }, { id: 'DU/2024/1', date: '2024-05-01' }] } },
    'DU/2000/1': { type: 'Obwieszczenie', title: 'Obwieszczenie bez aktu', references: {} },
  };
  const get = async (id) => meta[id];
  const r = await actWithAmendments('DU/2025/734', get);
  assert.equal(r.eli, 'DU/1971/114');
  assert.match(r.note, /consolidated text of DU\/1971\/114/);
  assert.deepEqual(amendingAfter(r.act, '2025-06-02').map((x) => x.id), ['DU/2025/1814', 'DU/2025/1872']);
  assert.equal((await actWithAmendments('DU/1971/114', get)).note, null);
  await assert.rejects(actWithAmendments('DU/2000/1', get), /names no base act/);
});

test('transitional articles that apply the amended act are found, with the articles they name', () => {
  const text = `     Art. 19. W ustawie z dnia 20 marca 2025 r. o warunkach dopuszczalności powierzania pracy cudzoziemcom
wprowadza się zmiany: 1) po art. 5 dodaje się art. 5a w brzmieniu: „Art. 5a. 1. Nowy przepis, ustawy zmienianej w art. 2.”;
     Art. 40. Jeżeli podmiot złożył powiadomienie przed dniem wejścia w życie niniejszej ustawy, zgodnie z przepisami art. 22
ustawy zmienianej w art. 17, stosuje się przepisy art. 22 ust. 1 tej ustawy.
      Art. 41. W okresie 3 lat od dnia wejścia w życie niniejszej ustawy do obywateli Ukrainy przebywających legalnie na
terytorium Rzeczypospolitej Polskiej stosuje się odpowiednio przepisy art. 3 ust. 1 pkt 12 i art. 5a ustawy zmienianej w art. 19.
      Art. 42. Do postępowań w sprawach uregulowanych w ustawach zmienianych niniejszą ustawą wszczętych i niezakończonych
przed dniem wejścia w życie art. 19 stosuje się przepisy dotychczasowe.
      Art. 54. Ustawa wchodzi w życie z dniem 5 marca 2026 r.
`;
  assert.deepEqual(appliedBy(text, ['Art. 19']), [{ article: 'Art. 41', names: ['3', '5a'] }, { article: 'Art. 42', names: [] }]);
  // It may over-list: art. 19 here is the amending act's own article. The output says to read each hit by hand.
  assert.deepEqual(appliedBy(text, ['Art. 17']), [{ article: 'Art. 40', names: ['22'] }, { article: 'Art. 42', names: ['19'] }]);
  assert.deepEqual(appliedBy(text, ['Art. 54']).map((x) => x.article), ['Art. 42']);
});
