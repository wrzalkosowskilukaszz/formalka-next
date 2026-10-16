// The on-device reader of typed answers (src/js/35-understand.js): what it takes as said, what it asks
// back, what it refuses to guess. Run: node --test prototype/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadApp } from './load.mjs';

const app = loadApp();
// Options as the app shows them: "you" (the person's own case, the default) or "other" (the registry's wording).
const opts = (key, voice = 'other') => app.E.voiced(app.E.fact(key), voice).options.map((o) => ({ label: o.label.pl, value: o.value }));
const read = (text, key, voice) => { const r = app.readAnswer(text, opts(key, voice)); return { type: r.type, value: r.o?.value, sure: r.sure, values: r.os ? [...r.os.map((o) => o.value)] : undefined }; };

test('norm folds Polish letters and punctuation', () => {
  assert.equal(app.norm('Łódź, Kraków!'), 'lodz krakow');
  assert.equal(app.norm('  Nie   wiem. '), 'nie wiem');
});

test('polarity: yes, no and "Nie wiem"; strict mode for approval cards', () => {
  assert.equal(app.polarity('tak'), 'yes');
  assert.equal(app.polarity('chyba tak'), 'yes');
  assert.equal(app.polarity('nie'), 'no');
  assert.equal(app.polarity('niestety nie'), 'no');
  assert.equal(app.polarity('nie wiem'), 'dk');
  assert.equal(app.polarity('nie mam pojecia'), 'dk');
  assert.equal(app.polarity('mam certyfikat'), 'yes');
  assert.equal(app.polarity('mam pytanie', true), null);
  assert.equal(app.polarity('tak ale zmien godzine', true), null);
  assert.equal(app.polarity('dobrze dodaj', true), 'yes');
});

test('yes or no questions: a bare word is taken, a sentence is asked back', () => {
  assert.deepEqual(read('Tak', 'citizenship.permanent_title'), { type: 'option', value: 'yes', sure: true, values: undefined });
  assert.equal(read('nie', 'citizenship.permanent_title').value, 'no');
  const s = read('tak, mam od dwóch lat', 'citizenship.permanent_title');
  assert.equal(s.value, 'yes');
  assert.equal(s.sure, false);
  assert.equal(read('nie wiem', 'citizenship.permanent_title').type, 'dk');
});

test('options with words: the matching one, or the tied ones to choose from', () => {
  assert.equal(read('mam polskie obywatelstwo', 'citizenship.ever_polish').value, 'yes');
  assert.equal(read('straciłem je', 'citizenship.ever_polish').value, 'lost');
  assert.deepEqual(read('tak', 'citizenship.ever_polish').values, ['lost', 'yes']);
  const never = read('nigdy', 'citizenship.ever_polish');
  assert.equal(never.value, 'no');
  assert.equal(never.sure, true);
  assert.equal(read('jestem tu na wizie', 'citizenship.where_lives').value, 'poland_visa');
  assert.equal(read('Za granicą', 'citizenship.where_lives').sure, true);
  assert.equal(read('przyjechałem do pracy sezonowej', 'pobyt_czasowy.purpose').value, 'seasonal');
  assert.equal(read('studiuję', 'pobyt_czasowy.purpose').value, 'study');
  assert.equal(read('na stałe', 'zameldowanie.stay').value, 'permanent');
  assert.deepEqual(read('mieszkam w Polsce od 3 lat', 'citizenship.group').values, ['three_years', 'married_or_stateless']);
});

test('the same words read the same against the options that speak to the person ("Mieszkasz…", "masz")', () => {
  assert.equal(read('mam polskie obywatelstwo', 'citizenship.ever_polish', 'you').value, 'yes');
  assert.equal(read('straciłem je', 'citizenship.ever_polish', 'you').value, 'lost');
  assert.deepEqual(read('mieszkam w Polsce od 3 lat', 'citizenship.group', 'you').values, ['three_years', 'married_or_stateless']);
  assert.equal(read('na stałe', 'zameldowanie.stay', 'you').value, 'permanent');
  // Both family options mention Poland, so the reader offers the two instead of guessing.
  assert.deepEqual(read('jestem już w Polsce, chodzi o rodzinę', 'pobyt_czasowy.purpose', 'you').values, ['family', 'family_abroad']);
});

test('whose case: someone else is named first; otherwise the person speaks of themselves', () => {
  assert.equal(app.readWhom('dla siebie'), 'you');
  assert.equal(app.readWhom('przyszedł czas, abym złożył papiery na obywatelstwo'), 'you');
  assert.equal(app.readWhom('Muszę się zameldować'), 'you');
  assert.equal(app.readWhom('dla mamy'), 'other');
  assert.equal(app.readWhom('chcę pomóc mamie z kartą pobytu'), 'other');
  assert.equal(app.readWhom('moja żona potrzebuje PESEL'), 'other');
  assert.equal(app.readWhom('dla kogoś innego'), 'other');
  assert.equal(app.readWhom('Ogarnij temat karty pobytu'), null);
});

test('what it does not follow stays unknown; questions about the question are recognised', () => {
  assert.equal(read('qwerty', 'citizenship.permanent_title').type, 'none');
  assert.equal(read('dlaczego o to pytasz?', 'citizenship.permanent_title').type, 'why');
  assert.equal(read('po co ci to', 'zameldowanie.stay').type, 'why');
});

test('days and hours in words (the clock starts on Monday 19.10.2026)', () => {
  assert.equal(app.S.clock.date, '2026-10-19');
  const w = (t) => app.readWhen(t);
  assert.equal(w('jutro').date, '2026-10-20');
  assert.equal(w('pojutrze').date, '2026-10-21');
  assert.equal(w('w czwartek').date, '2026-10-22');
  assert.equal(w('w poniedziałek').date, '2026-10-26');
  assert.equal(w('22.10').date, '2026-10-22');
  assert.equal(w('5 listopada').date, '2026-11-05');
  assert.equal(w('10.01').date, '2027-01-10');
  assert.equal(w('31.11').date, null);
  assert.equal(w('o 10').time, '10:00');
  assert.equal(w('10:30').time, '10:30');
  assert.equal(w('o 9.15').time, '09:15');
  assert.equal(w('14.45').time, '14:45');
  assert.equal(w('14.45').date, null);
  assert.equal(w('o 12.10').date, null);
  assert.equal(w('o 25').time, null);
  assert.equal(w('w południe').time, '12:00');
  assert.deepEqual({ ...w('w środę o 11') }, { date: '2026-10-21', time: '11:00' });
});

test('day and hour chips: a typed day or hour picks its chip; another one is reported', () => {
  const days = ['2026-10-20', '2026-10-21'].map((d) => ({ label: d, value: d, day: ['x', 'y', 'z'] }));
  const hours = ['09:00', '12:00'].map((t) => ({ label: t, value: t, time: true }));
  assert.equal(app.readAnswer('jutro', days).o.value, '2026-10-20');
  assert.equal(app.readAnswer('o 12', hours).o.value, '12:00');
  assert.equal(app.readAnswer('o 10:15', hours).type, 'when-miss');
  assert.equal(app.readAnswer('o 10:15', hours).when.time, '10:15');
});

test('"Jak poszło?" in the person\'s words', () => {
  assert.equal(app.readFollowUp('złożyłem wniosek'), 'filed');
  assert.equal(app.readFollowUp('Wszystko ok, przyjęli'), 'filed');
  assert.equal(app.readFollowUp('nie udało się, brakowało dokumentu'), 'missing');
  assert.equal(app.readFollowUp('nie poszedłem'), 'not_went');
  assert.equal(app.readFollowUp('byłem w kinie'), null);
});

test('case intents: a case that is part of another named case gives way to it', () => {
  assert.deepEqual([...app.intentsIn('Ogarnij mi temat karty pobytu')], ['residence-card']);
  assert.deepEqual([...app.intentsIn('Potrzebuję numeru PESEL')], ['pesel']);
  assert.deepEqual([...app.intentsIn('chcę zrobić pizzę')], []);
});
