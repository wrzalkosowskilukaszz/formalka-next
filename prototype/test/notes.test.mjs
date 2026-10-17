// Registry notes are never shown as a cut fragment of a provision, and the residence case says what it does
// not cover (audit/2026-10-16-residence/COMPARISON.md D1, D2, D5, D9). Run: node --test prototype/test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
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
