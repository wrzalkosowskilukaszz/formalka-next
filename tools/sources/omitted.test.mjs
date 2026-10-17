// The reader of what an extract leaves out, on a fixture shaped like pdftotext output. Run: node --test tools/sources/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { units, omitted, ownRefs, norm } from './omitted.mjs';

// Shaped like the labour market act (Dz.U. 2025 poz. 620): art. 65 quoted, art. 66 and 219 ust. 2 left out.
const act = `     Art. 65. 1. Starosta pozbawia statusu bezrobotnego, który:
7)   był niezdolny do pracy przez nieprzerwany okres 180 dni.
2. Bezrobotny, o którym mowa w ust. 1, może zarejestrować się ponownie.
     Art. 66. 1. Starosta nie może pozbawić statusu bezrobotnego z przyczyny, o której mowa w art. 65 ust. 1 pkt 7, kobiety
w ciąży.
     2. Starosta nie może pozbawić statusu z przyczyny, o której mowa w art. 55 ust. 1 ustawy z dnia 26 czerwca 1974 r.
– Kodeks pracy.
     Art. 219. 1. Prawo do zasiłku nie przysługuje bezrobotnemu, który rozwiązał ostatni stosunek pracy za wypowie-
dzeniem.
Dziennik Ustaw                                  – 105 –                                     Poz. 620

     2. Przepisu ust. 1 nie stosuje się w przypadku gdy ostatni stosunek pracy nie stanowi podstawy nabycia prawa.
     3. (uchylony)
     Art. 300. W ustawie z dnia 12 marca 2004 r. o pomocy społecznej w art. 65 dodaje się ust. 3, który nie stosuje się.
`;
const extract = `[Art. 65]
     Art. 65. 1. Starosta pozbawia statusu bezrobotnego, który:
7)   był niezdolny do pracy przez nieprzerwany okres 180 dni.
2. Bezrobotny, o którym mowa w ust. 1, może zarejestrować się ponownie.
[Art. 219 ust. 1]
     Art. 219. 1. Prawo do zasiłku nie przysługuje bezrobotnemu, który rozwiązał ostatni stosunek pracy za wypowie-
dzeniem.
`;

test('splits articles and their paragraphs, joining broken words and dropping page headers', () => {
  const { unit, units: u } = units(act);
  assert.equal(unit, 'Art.');
  assert.deepEqual(u.map((x) => x.id), ['65', '66', '219', '300']);
  assert.deepEqual(u[2].paras.map((p) => p.n), ['1', '2', '3']);
  assert.equal(u[2].paras[0].text, 'Prawo do zasiłku nie przysługuje bezrobotnemu, który rozwiązał ostatni stosunek pracy za wypowiedzeniem.');
});

test('a number that starts a wrapped line is not a new paragraph', () => {
  const { units: u } = units('     Art. 5. 1. Termin wynosi\n30 dni od doręczenia.\n     2. Drugi ustęp.\n');
  assert.deepEqual(u[0].paras.map((p) => p.n), ['1', '2']);
  assert.equal(u[0].paras[0].text, 'Termin wynosi 30 dni od doręczenia.');
});

test('lists the paragraphs a quoted article leaves out, marking an exception, and skips repealed ones', () => {
  const r = omitted(act, extract);
  assert.deepEqual(r.quoted, ['65', '219']);
  assert.deepEqual(r.partial, [{ id: '219', missing: [{ n: '2', exception: 'nie stosuje się', head: 'Przepisu ust. 1 nie stosuje się w przypadku gdy ostatni stos' }] }]);
});

test('lists an article that names a quoted one, but not a reference to another act or an amending article', () => {
  const r = omitted(act, extract);
  assert.deepEqual(r.referring.map((x) => [x.id, x.n, x.names, x.exception]), [['66', '1', ['65'], 'nie może']]);
});

test('a reference closed by another act\'s title is not the act\'s own', () => {
  assert.deepEqual(ownRefs('o którym mowa w art. 55 ust. 1 albo art. 55a ust. 6 ustawy z dnia 25 czerwca 1999 r., oraz art. 65 ust. 1', 'Art.'), ['65']);
  assert.equal(norm('a-\n   b\nDziennik Ustaw – 1 – Poz. 2\nc'), 'ab c');
});

test('a regulation is read by its paragraphs (§)', () => {
  const reg = '§ 5. 1. Dyrektor przyjmuje ucznia.\n2. Nie stosuje się § 6.\n§ 6. Przepis § 5 ust. 1 stosuje się z wyjątkiem klasy I.\n§ 7. Inny.\n';
  const r = omitted(reg, '§ 5. 1. Dyrektor przyjmuje ucznia.');
  assert.equal(r.unit, '§');
  assert.deepEqual(r.partial[0], { id: '5', missing: [{ n: '2', exception: 'Nie stosuje się', head: 'Nie stosuje się § 6.' }] });
  assert.deepEqual(r.referring.map((x) => [x.id, x.names, x.exception]), [['6', ['5'], 'z wyjątkiem']]);
});

test('a shared opening does not make another article quoted', () => {
  const t = '     Art. 8e. Minister właściwy do spraw wewnętrznych określi, w drodze rozporządzenia: 1) wzór wniosku o świadczenie.\n     Art. 24d. Minister właściwy do spraw wewnętrznych określi, w drodze rozporządzenia: 1) sposób przekazywania informacji.\n';
  const r = omitted(t, 'Art. 8e. Minister właściwy do spraw wewnętrznych określi, w drodze rozporządzenia: 1) wzór wniosku o świadczenie.');
  assert.deepEqual(r.quoted, ['8e']);
});
