// Prints what the case engine shows for the draft reference's cases, so the comparison can be checked.
// It runs the engine being evaluated; it was NOT used to write the reference.
// Usage: node audit/2026-10-16-round2/reference/engine-output.mjs [path to case-engine.browser.js]
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const bundle = process.argv[2] ?? new URL('../../../packages/case-engine/dist/case-engine.browser.js', import.meta.url).pathname;
const ctx = {};
vm.createContext(ctx);
vm.runInContext(`${readFileSync(bundle, 'utf8')};this.E=FormalkaEngine;`, ctx);
const E = ctx.E;
const WAW = { teryt: '1465011', name: 'Warszawa' };
const arrival = [{ id: 'a1', type: 'arrival_at_address', date: '2026-10-15', by: 'user' }];
const cases = [
  ['R1 EU citizen, permanent', { 'zameldowanie.citizen_group': 'eu_efta', 'zameldowanie.stay': 'permanent' }],
  ['R2 EU citizen, temporary', { 'zameldowanie.citizen_group': 'eu_efta', 'zameldowanie.stay': 'temporary' }],
  ['R3 family member of an EU citizen (same group in the engine)', { 'zameldowanie.citizen_group': 'eu_efta', 'zameldowanie.stay': 'temporary' }],
  ['R4/R5 non-EU, temporary', { 'zameldowanie.citizen_group': 'other', 'zameldowanie.stay': 'temporary' }],
  ['R6 non-EU, permanent', { 'zameldowanie.citizen_group': 'other', 'zameldowanie.stay': 'permanent' }],
  ['R7 group unknown', { 'zameldowanie.citizen_group': E.UNKNOWN, 'zameldowanie.stay': 'temporary' }],
  ['R9 family member of a Polish citizen (the option label puts them in "other")', { 'zameldowanie.citizen_group': 'other', 'zameldowanie.stay': 'permanent' }],
  ['R10 UK Withdrawal Agreement', { 'zameldowanie.citizen_group': 'uk_wa', 'zameldowanie.stay': 'temporary' }],
];
for (const [name, facts] of cases) {
  const state = { facts, events: arrival, tasks: {}, approved: true, place: WAW };
  const p = E.plan('address-registration', state);
  console.log(`\n## ${name}`);
  console.log(`route: ${p.route.status} ${p.route.procedureId ?? ''}`);
  for (const l of p.levels) {
    const tasks = l.tasks.map((t) => `${t.title.pl}${t.outcome === 'unknown' ? ' [sprawdź]' : ''}${t.onlyIf ? ` [${t.onlyIf.pl}]` : ''}${t.alternatives ? ` [albo: ${t.alternatives.length}]` : ''}`);
    const dls = l.deadlines.map((d) => `${d.id} ${d.amount} ${d.unit} from ${d.from}${d.due ? ` -> ${d.due.earliest}${d.due.latest !== d.due.earliest ? `..${d.due.latest}` : ''} (${d.due.counting}); text: "${E.dueRangePl(d.due.earliest, d.due.latest, d.due.counting)}"` : ''}${d.outcome === 'unknown' ? ' [może nie dotyczyć]' : ''}`);
    const fees = l.fees.map((f) => `${f.amountPln} zł ${f.purpose.pl}${f.optional ? ' (opcjonalnie)' : ''}`);
    // Every note, "!" marking the important ones (docs/solutions/2026-10-16-claimed-absence-without-searching.md).
    const notes = l.notes.map((n) => `${n.id}${n.important ? '!' : ''}${n.outcome === 'unknown' ? '?' : ''}`);
    const office = l.office ? `${l.office.offices.length} offices${l.office.needsPlace ? ' (needs place)' : ''}` : '';
    console.log(`- ${l.id} [${l.state}] ${l.title.pl}`);
    if (tasks.length) console.log(`    tasks: ${tasks.join('; ')}`);
    if (dls.length) console.log(`    deadlines: ${dls.join('; ')}`);
    if (fees.length) console.log(`    fees: ${fees.join('; ')}`);
    if (office) console.log(`    office: ${office}`);
    if (notes.length) console.log(`    notes: ${notes.join(', ')}`);
  }
  const steps = E.procedure(p.route.procedureId)?.steps.map((s) => `${s.id}:${(s.channels ?? []).join('/')}`).join(' ');
  console.log(`channels by step: ${steps}`);
}
