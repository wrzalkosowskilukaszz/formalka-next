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
  // Audit F5: consent with consequences only from a plain answer.
  assert.equal(app.polarity(app.norm('Tak, nie zgadzam się'), true), null);
  assert.equal(app.polarity(app.norm('Chyba tak'), true), null);
  assert.equal(app.polarity(app.norm('nie zatwierdzam'), true), 'no');
  assert.equal(app.polarity(app.norm('Tak, ale zmień godzinę'), true), null);
  assert.equal(app.polarity(app.norm('Tak, zapisz'), true), 'yes');
});

test('audit F5: a hedged yes is asked back; a yes that also says "nie" is not read', () => {
  assert.equal(read('chyba tak', 'citizenship.permanent_title').sure, false);
  assert.equal(read('Tak, nie zgadzam się', 'citizenship.permanent_title').type, 'none');
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
  // Audit F5: an explicit year is kept; a ruled-out day is skipped; two days are asked back.
  assert.equal(w('22.10.2028').date, '2028-10-22');
  assert.equal(w('5 listopada 2027').date, '2027-11-05');
  assert.deepEqual({ ...w('Jutro nie mogę, w piątek o 10') }, { date: '2026-10-23', time: '10:00' });
  assert.equal(w('w środę albo w czwartek').ambiguous, true);
  assert.equal(w('o 10 a nie o 12').time, '10:00');
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
  // Audit F5: a negated filing is not a filing.
  assert.equal(app.readFollowUp('Nie złożyłem wniosku'), 'not_went');
  assert.equal(app.readFollowUp('nie przyjęli wniosku'), null);
});

test('audit F7: personal numbers are masked before the person\'s words are shown', () => {
  assert.equal(app.maskPersonal('mój PESEL to 90010112345'), 'mój PESEL to •••');
  assert.equal(app.maskPersonal('dowód ABC123456, tel. +48 600 700 800'), 'dowód •••, tel. •••');
  assert.equal(app.maskPersonal('pisz na jan.kowalski@example.com'), 'pisz na •••');
  assert.equal(app.maskPersonal('jutro o 10:30, 22.10.2026'), 'jutro o 10:30, 22.10.2026');
  assert.equal(app.looksPersonal('Muszę się zameldować'), false);
});

test('case intents: a case that is part of another named case gives way to it', () => {
  assert.deepEqual([...app.intentsIn('Ogarnij mi temat karty pobytu')], ['residence-card']);
  assert.deepEqual([...app.intentsIn('Potrzebuję numeru PESEL')], ['pesel']);
  assert.deepEqual([...app.intentsIn('chcę zrobić pizzę')], []);
});

test('an answer that fits no option: the reply reasons over the words, never picks for the person', () => {
  const opt = (key) => [...app.E.fact(key).options.map((o) => ({ label: app.E.voiced(app.E.fact(key)).options.find((v) => v.value === o.value).label.pl, value: o.value })), { label: 'Nie wiem', value: '__dk__', dk: true }];
  const stay = opt('zameldowanie.stay');
  const group = opt('zameldowanie.citizen_group');
  // One-word keys only when the reader itself maps each to exactly one option.
  assert.deepEqual([...app.keyWords(stay)], ['Stały', 'Czasowy']);
  assert.equal(app.readAnswer('Czasowy', stay).o.value, 'temporary');
  assert.deepEqual([...app.keyWords(group)], [], 'two options start with "Obywatel": no key words');
  const c = { bpId: 'address-registration' };
  const help = app.E.fact('zameldowanie.citizen_group').unknownHelp?.pl;
  // Rule 4: where someone comes from never becomes a group.
  assert.equal(app.readAnswer('Przyjechałem z Kolumbii', group).type, 'none');
  const r = app.reflect({ c, why: 'Od odpowiedzi zależą dokumenty. Drugie zdanie.', options: group, help }, 'Przyjechałem z Kolumbii');
  assert.match(r, /niczego nie wybieram za Ciebie/);
  assert.match(r, /Dlaczego pytam: Od odpowiedzi zależą dokumenty\. Więcej pod „Dlaczego pytamy\?”/);
  assert.ok(!r.includes('Drugie zdanie'), 'only the first sentence of why');
  assert.match(r, /Jeśli nie wiesz, wybierz „Nie wiem”/);
  assert.ok(!group.filter((o) => !o.dk).some((o) => r.includes(o.label)), 'no option is put in the person\'s mouth');
  // What it notices: doubt, a question back, another case.
  assert.match(app.reflect({ c, options: stay }, 'to zależy od pracy'), /Jeśli nie masz pewności, wybierz „Nie wiem”/);
  assert.match(app.reflect({ c, options: stay }, 'a co jeśli zostanę tylko rok?'), /Jeśli to pytanie do mnie/);
  assert.match(app.reflect({ c, options: stay }, 'potrzebuję też numeru PESEL'), /Wspominasz o innej sprawie: PESEL/);
  assert.match(app.reflect({ c, options: stay }, 'wynajmuję od znajomego'), /Wystarczy jedno słowo, na przykład „Stały” albo „Czasowy”/);
});

test('waiting for the office: the need is read from the words, not as a new application', () => {
  for (const t of ['Potrzebuję przyspieszyć wydanie karty pobytu', 'Długo czekam na decyzję', 'kiedy będzie decyzja?', 'jak napisać ponaglenie', 'Nadal nie ma decyzji w mojej sprawie']) assert.ok(app.readWaiting(t), t);
  for (const t of ['Ogarnij mi temat karty pobytu', 'Chcę złożyć wniosek o kartę pobytu', 'Muszę się zameldować', 'czekam']) assert.ok(!app.readWaiting(t), t);
});
