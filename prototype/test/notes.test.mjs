// Registry content is never shown in a misleading way: a note cut from its provision, a sum of alternative fees;
// and the residence case says what it does not cover (audit/2026-10-16-residence/COMPARISON.md D1, D2, D5, D9, D21).
// Run: node --test prototype/test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { loadApp } from './load.mjs';

const app = loadApp();
const note = (proc, id) => app.E.procedure(proc).pitfalls.find((n) => n.id === id);

test('legal stay while waiting is shown with its conditions and its exception (art. 108 ust. 1-2)', () => {
  const n = note('temporary-residence', 'legal-stay-while-pending');
  assert.match(n.statement.value.pl, /^pobyt cudzoziemca/, 'the registry statement alone is the bare fragment');
  const t = app.noteText(n);
  assert.match(t, /^Jeżeli termin na złożenie wniosku .* został zachowany i wniosek nie zawiera braków formalnych/);
  assert.match(t, /uważa się za legalny od dnia złożenia wniosku/);
  assert.match(t, /nie stosuje się w razie zawieszenia postępowania .* na wniosek strony\.$/);
});

test('the card fee relief says whom it is for (art. 237 ust. 1)', () => {
  const t = app.noteText(note('temporary-residence', 'card-fee-relief'));
  assert.match(t, /50 %/);
  assert.match(t, /trudnej sytuacji materialnej/);
  assert.match(t, /szkole wyższej/);
  assert.match(t, /16\. roku życia/);
});

test('a statement ending in a colon gets its quotes; a whole sentence and a paraphrase stay as they are', () => {
  assert.match(app.noteText(note('temporary-residence', 'decision-time-suspended')), /dotyczących: 1\) udzielenia cudzoziemcowi: a\) zezwolenia na pobyt czasowy/);
  const whole = note('temporary-residence', 'online-only');
  assert.equal(app.noteText(whole), whole.statement.value.pl.trim());
  // Its statement is not among its quotes and ends without a colon: shown as written, never doubled.
  const own = note('citizenship-recognition', 'post-secondary-school');
  assert.equal(app.noteText(own), own.statement.value.pl.trim());
});

test('the residence scope names what the case does not cover, and states no rule of its own', () => {
  const s = [...app.RESIDENCE_SCOPE].join(' ');
  assert.match(s, /nie jest jeszcze niezależnie sprawdzona/);
  assert.match(s, /nie przypomni/);
  assert.match(s, /konto w MOS/);
  assert.match(s, /decyzji odmownej/);
  assert.doesNotMatch(s, /\d+ dni|art\.|zł/, 'no deadline, provision or amount from outside the registry');
});

test('two stamp duties for one permit are listed, never added up (residence COMPARISON D21)', () => {
  const fees = (purpose) => [...app.E.plan('residence-card', { facts: { 'pobyt_czasowy.purpose': purpose }, events: [], tasks: {}, approved: true })
    .levels.flatMap((l) => l.fees)].filter((f) => f.outcome === 'applies');
  assert.equal(app.feeSum(fees('work')), 540);
  assert.equal(app.feeSum(fees('study')), 440);
  assert.equal(fees('short').length, 3, 'the registry gives a short stay 85 zł and 340 zł, for different reasons, and the card');
  assert.equal(app.feeSum(fees('short')), null);
  // The guide's line for the payment step: the duties are alternatives, the card fee is paid with either.
  assert.match(app.feeLine(fees('short')), /^Opłata skarbowa: 340 zł albo 85 zł, zależnie od powodu pobytu; .*Do tego: 100 zł$/);
  assert.equal(app.feeLine(fees('work')), 'Opłata: 440 zł + 100 zł');
});

test('the "Nie wiem" help that promises the plan is not given when "Nie wiem" ends the case (correctness audit K2)', () => {
  const c = (bpId) => ({ bpId, state: { facts: {}, tasks: {}, events: [] }, asked: 0, voice: 'you' });
  assert.match(app.E.fact('pesel.stay_over_30').unknownHelp.pl, /Pokażemy obie drogi/, 'the registry promises both routes');
  assert.equal(app.stopsOnUnknown(c('pesel'), 'pesel.stay_over_30'), true, '"Nie wiem" here leaves no route and no question');
  assert.equal(app.stopsOnUnknown(c('address-registration'), 'zameldowanie.citizen_group'), false, 'here the plan shows every version');
  assert.doesNotMatch(app.STOP_HELP, /Pokażemy|w planie/);
});

test('fee amounts are added up or joined with "+" only in feeSum and feeLine (correctness audit K5)', () => {
  // The first fix of D21 changed three places and missed two (the plan card, the guide's payment step).
  const dir = new URL('../src/js/', import.meta.url);
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.js') && x !== '10-cases.js')) {
    const src = readFileSync(new URL(f, dir), 'utf8');
    assert.doesNotMatch(src, /reduce\([^;]*amountPln/, `${f} adds up fee amounts; use feeSum`);
    assert.doesNotMatch(src, /amountPln[^;]*join\(' \+ '\)/, `${f} joins fee amounts with "+"; use feeLine`);
  }
});
