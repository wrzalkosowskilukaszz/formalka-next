// Prints what the case engine shows for the residence draft reference's cases, so the comparison can be
// checked. It runs the engine being evaluated; it was NOT used to write the reference.
// Usage: node audit/2026-10-16-residence/engine-output.mjs [path to case-engine.browser.js] > engine-output.txt
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const bundle = process.argv[2] ?? new URL('../../packages/case-engine/dist/case-engine.browser.js', import.meta.url).pathname;
const ctx = {};
vm.createContext(ctx);
vm.runInContext(`${readFileSync(bundle, 'utf8')};this.E=FormalkaEngine;`, ctx);
const E = ctx.E;
const KRK = { teryt: '1261011', name: 'Kraków' };
const WAW = { teryt: '1465011', name: 'Warszawa' };
const ev = (type, date, extra = {}) => ({ id: `${type}-${date}`, type, date, by: 'user', ...extra });
const P = 'pobyt_czasowy.purpose';
const cases = [
  ['RC1 work, nothing done yet', { [P]: 'work' }, [], WAW],
  ['RC1 work, filed 2.11.2026', { [P]: 'work' }, [ev('filing', '2026-11-02')], WAW],
  ['RC2 study, Kraków', { [P]: 'study' }, [], KRK],
  ['RC3 spouse of a Polish citizen in Poland (the engine has no such option; "family" is the nearest)', { [P]: 'family' }, [], WAW],
  ['RC4 family reunification, the person abroad', { [P]: 'family_abroad' }, [], WAW],
  ['RC5 MOS down on the last day, fixed Monday 30.11.2026', { [P]: 'work' }, [ev('system_restored', '2026-11-30')], WAW],
  ['RC9 refusal delivered 27.10.2026', { [P]: 'work' }, [ev('filing', '2026-09-01'), ev('decision_delivered', '2026-10-27', { outcome: 'refused' })], WAW],
  ['RC10 permit granted, delivered 27.10.2026', { [P]: 'work' }, [ev('filing', '2026-09-01'), ev('decision_delivered', '2026-10-27', { outcome: 'granted' })], WAW],
  ['Purpose unknown', { [P]: E.UNKNOWN }, [], WAW],
];
const text = (x) => (x == null ? '' : typeof x === 'string' ? x : x.pl ?? '');
for (const [name, facts, events, place] of cases) {
  const state = { facts, events, tasks: {}, approved: true, place };
  const p = E.plan('residence-card', state);
  console.log(`\n## ${name}`);
  console.log(`route: ${p.route.status} ${p.route.procedureId ?? ''}`);
  for (const l of p.levels) {
    const tasks = l.tasks.map((t) => `${text(t.title)}${t.outcome === 'unknown' ? ' [sprawdź]' : ''}${t.onlyIf ? ` [${text(t.onlyIf)}]` : ''}${t.alternatives ? ` [albo: ${t.alternatives.length}]` : ''}`);
    const dls = l.deadlines.map((d) => `${d.id} ${d.amount} ${d.unit} from ${d.from}${d.due ? ` -> ${d.due.earliest}${d.due.latest !== d.due.earliest ? `..${d.due.latest}` : ''} (${d.due.counting}); text: "${E.dueRangePl(d.due.earliest, d.due.latest, d.due.counting)}"` : ' (no date yet)'}${d.outcome === 'unknown' ? ' [może nie dotyczyć]' : ''}`);
    const fees = l.fees.map((f) => `${f.amountPln} zł ${text(f.purpose)}${f.optional ? ' (opcjonalnie)' : ''}${f.outcome === 'unknown' ? ' [może nie dotyczyć]' : ''}`);
    // Every note, "!" marking the important ones (docs/solutions/2026-10-16-claimed-absence-without-searching.md).
    const notes = l.notes.map((n) => `${n.id}${n.important ? '!' : ''}${n.outcome === 'unknown' ? '?' : ''}`);
    const office = l.office ? `${l.office.offices.length} offices${l.office.needsPlace ? ' (needs place)' : ''}: ${l.office.offices.map((o) => text(o.name)).join(' | ')}` : '';
    console.log(`- ${l.id} [${l.state}] ${text(l.title)}`);
    if (tasks.length) console.log(`    tasks: ${tasks.join('; ')}`);
    if (dls.length) console.log(`    deadlines: ${dls.join('; ')}`);
    if (fees.length) console.log(`    fees: ${fees.join('; ')}`);
    if (office) console.log(`    office: ${office}`);
    if (notes.length) console.log(`    notes: ${notes.join(', ')}`);
  }
  // What the advisor would raise on 16.10.2026, with notifications allowed.
  const prefs = { ...E.DEFAULT_PREFS, consent: true };
  const agenda = E.agenda({ caseId: 'c1', blueprintId: 'residence-card', plan: p, state, prefs, now: { date: '2026-10-16', time: '09:00' } });
  console.log(`agenda on 16.10.2026: ${agenda.length ? agenda.map((a) => `${a.kind} ${a.fireAt}`).join('; ') : 'nothing'}`);
}
// The text of every note the plans above can carry, once, so a "does not mention" claim can be checked.
const proc = E.procedure('temporary-residence');
console.log('\n## Notes in the procedure (id: Polish text)');
for (const n of proc.pitfalls ?? []) console.log(`- ${n.id}: ${text(n.statement?.value ?? n.text ?? n.description)}`);
console.log('\n## Steps (id: channels; title)');
for (const s of proc.steps) console.log(`- ${s.id}: ${(s.channels ?? []).join('/')}; ${text(s.title)}`);
