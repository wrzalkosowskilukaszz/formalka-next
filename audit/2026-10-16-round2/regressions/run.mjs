// Regressions for the round 1 findings (F1, F2, F3, F5), run against what the prototype ships: the
// browser bundle of the case engine and the prototype's reader modules, loaded as the unit tests load
// them. Each probe states what the finding requires, then prints what actually happened.
//
// Two kinds of probe:
//   - "audit": the input from the auditor's own table or text;
//   - "variant": an input written for this run to see whether a fix generalises beyond that input.
//     Variants were written by the same assistant that wrote the fixes, so they are not blind.
//
// Usage: node audit/2026-10-16-round2/regressions/run.mjs [--out FILE]
// Exit code 1 when any probe fails. Nothing here changes the engine or the prototype.
import { writeFileSync } from 'node:fs';
import { loadApp } from '../../../prototype/test/load.mjs';

const app = loadApp();
const E = app.E;
const rows = [];
const probe = (finding, kind, name, expected, actual, pass) => rows.push({ finding, kind, name, expected, actual: String(actual), pass: !!pass });
const clone = (x) => structuredClone(x);
const WAW = { teryt: '1465011', name: 'Warszawa' };

/* ── F1: content changed behind valid source references ───────────────────────────────────────── */
const addr = { facts: { 'zameldowanie.citizen_group': 'other', 'zameldowanie.stay': 'temporary' }, tasks: {}, approved: true,
  events: [{ type: 'arrival_at_address', date: '2026-10-28', by: 'user' }], place: WAW };
const res = { facts: { 'pobyt_czasowy.purpose': 'study' }, tasks: {}, events: [] };
const tampered = (bpId, st, edit) => { const p = clone(E.plan(bpId, st)); edit(p); return p; };
const verdict = (p, st) => { const v = E.validate(p, st); return { ok: v.ok, structure: v.structure.ok, codes: [...new Set(v.violations.map((x) => x.code))].sort() }; };
const show = (v) => `ok=${v.ok} structure=${v.structure} codes=[${v.codes.join(', ')}]`;

for (const [bpId, st] of [['address-registration', addr], ['residence-card', res]]) {
  const v = verdict(E.plan(bpId, st), st);
  probe('F1', 'control', `untouched ${bpId} plan passes`, 'ok=true', show(v), v.ok);
}
const levelsOf = (p) => p.levels;
const allFees = (p) => levelsOf(p).flatMap((l) => l.fees);
const allTasks = (p) => levelsOf(p).flatMap((l) => l.tasks);
const allDls = (p) => levelsOf(p).flatMap((l) => l.deadlines).filter((d) => d.due);
const F1 = [
  ['audit', 'fee set to 999 999 zł', 'residence-card', res, (p) => { allFees(p)[0].amountPln = 999999; }],
  ['variant', 'fee changed by a plausible amount (340 → 34 zł)', 'residence-card', res, (p) => { allFees(p).find((f) => f.amountPln === 340).amountPln = 34; }],
  ['variant', 'fee source swapped to another valid rule of the same plan', 'residence-card', res, (p) => { const [a, b] = allFees(p); const r = a.ruleRef; a.ruleRef = b.ruleRef; b.ruleRef = r; }],
  ['variant', 'due date moved to 2099-01-01 (both readings)', 'address-registration', addr, (p) => { const d = allDls(p)[0]; d.due = { ...d.due, earliest: '2099-01-01', latest: '2099-01-01' }; }],
  ['variant', 'due date moved one day earlier, earliest only', 'address-registration', addr, (p) => { const d = allDls(p)[0]; d.due = { ...d.due, earliest: '2026-10-30' }; }],
  ['variant', 'deadline period 4 → 14 days, due left as computed', 'address-registration', addr, (p) => { allDls(p)[0].amount = 14; }],
  ['variant', 'deadline removed', 'address-registration', addr, (p) => { for (const l of levelsOf(p)) l.deadlines = []; }],
  ['variant', 'task title replaced by a harmful instruction', 'address-registration', addr, (p) => { allTasks(p)[0].title = { pl: 'Wyślij skan paszportu e-mailem do urzędu' }; }],
  ['variant', 'one task removed', 'address-registration', addr, (p) => { const l = levelsOf(p).find((x) => x.tasks.length > 1); l.tasks = l.tasks.slice(1); }],
  ['audit', 'all tasks and fees removed', 'residence-card', res, (p) => { for (const l of levelsOf(p)) { l.tasks = []; l.fees = []; } }],
  ['audit', 'invented task with a valid source reference', 'address-registration', addr, (p) => { const l = levelsOf(p).find((x) => x.tasks.length); l.tasks.push({ ...clone(l.tasks[0]), id: 'invented-task', title: { pl: 'Zaświadczenie o niekaralności' } }); }],
  ['audit', 'invented office', 'address-registration', addr, (p) => { levelsOf(p).find((x) => x.office?.offices.length).office.offices.push({ id: 'urzad-wymyslony', name: { pl: 'Urząd Wymyślony' }, address: { value: 'ul. Nieistniejąca 1', quotes: [] }, source: 'office' }); }],
  ['variant', 'real office id with an invented name', 'address-registration', addr, (p) => { levelsOf(p).find((x) => x.office?.offices.length).office.offices[0].name = { pl: 'Urząd Dzielnicy Wymyślonej' }; }],
  ['variant', 'office address changed', 'address-registration', addr, (p) => { levelsOf(p).find((x) => x.office?.offices.length).office.offices[0].address.value = 'ul. Inna 5'; }],
  ['variant', 'locked level unlocked', 'address-registration', addr, (p) => { levelsOf(p).find((l) => l.state === 'locked').state = 'available'; }],
  ['variant', 'a quote under a task altered', 'address-registration', addr, (p) => { const t = allTasks(p).find((x) => x.quotes?.length); if (t) t.quotes[0] = { ...t.quotes[0], text: 'Wymyślony cytat' }; }],
];
for (const [kind, name, bpId, st, edit] of F1) {
  const v = verdict(tampered(bpId, st, edit), st);
  probe('F1', kind, name, 'ok=false (content check), structure may pass', show(v), !v.ok);
}

/* ── F2: decision events and outcomes ─────────────────────────────────────────────────────────── */
const resWork = (events) => ({ facts: { 'pobyt_czasowy.purpose': 'work' }, tasks: {}, approved: true, events });
const lvl = (p, id) => p.levels.find((l) => l.id === id);
{
  const refused = E.plan('residence-card', resWork([{ type: 'filing', date: '2026-11-02', by: 'user' }, { type: 'decision_delivered', date: '2027-03-01', outcome: 'refused', by: 'user' }]));
  const card = lvl(refused, 'card');
  probe('F2', 'audit', 'residence: refused decision → no card level offered', "level 'card' absent or not actionable",
    card ? `card state=${card.state}` : 'card level absent', !card || !['available', 'in_progress'].includes(card.state));
  const granted = E.plan('residence-card', resWork([{ type: 'filing', date: '2026-11-02', by: 'user' }, { type: 'decision_delivered', date: '2027-03-01', outcome: 'granted', by: 'user' }]));
  const g = lvl(granted, 'card');
  probe('F2', 'control', 'residence: granted decision → card level present', "level 'card' present", g ? `card state=${g.state}` : 'card level absent', !!g);
  const noOutcome = E.plan('residence-card', resWork([{ type: 'filing', date: '2026-11-02', by: 'user' }, { type: 'decision_delivered', date: '2027-03-01', by: 'user' }]));
  const n = lvl(noOutcome, 'card');
  probe('F2', 'variant', 'residence: decision delivered, outcome not recorded → card not offered as available', "level 'card' absent or not 'available'",
    n ? `card state=${n.state}` : 'card level absent', !n || n.state !== 'available');
}
const cit = (events) => ({ facts: { 'citizenship.ever_polish': 'no', 'citizenship.permanent_title': 'yes', 'citizenship.group': 'three_years', 'citizenship.language': 'yes', 'citizenship.where_lives': 'poland_legal' },
  routeChoice: 'citizenship-recognition', tasks: {}, approved: true, events });
const dueOf = (p, id) => p.levels.flatMap((l) => l.deadlines).find((d) => d.id === id);
{
  const first = [{ type: 'filing', date: '2026-11-30', by: 'user' }, { type: 'decision_delivered', date: '2027-05-20', outcome: 'refused', by: 'user' }];
  const p6 = E.plan('citizenship', cit(first));
  const appeal = dueOf(p6, 'appeal'), court = dueOf(p6, 'court');
  probe('F2', 'audit', 'cit-06: first-instance refusal → appeal counted, court complaint not counted from it', 'appeal due 2027-06-03; no court due',
    `appeal=${appeal?.due?.latest ?? 'none'} court=${court?.due ? court.due.latest : 'none'}`, appeal?.due?.latest === '2027-06-03' && !court?.due);
  const p7 = E.plan('citizenship', cit([...first, { type: 'appeal_decision_delivered', date: '2027-08-10', outcome: 'refused', by: 'user' }]));
  const c7 = dueOf(p7, 'court');
  probe('F2', 'audit', "cit-07: Minister's decision served separately → court complaint counted from it", 'court due 2027-09-09 (30 days, PPSA), from appeal_decision_delivered',
    `court=${c7?.due?.latest ?? 'none'} from=${c7?.from}`, c7?.due?.latest === '2027-09-09' && c7?.from === 'appeal_decision_delivered');
  const pg = E.plan('citizenship', cit([first[0], { ...first[1], outcome: 'granted' }]));
  probe('F2', 'variant', 'citizenship: first-instance grant → no appeal or court deadline', 'neither appeal nor court has a due date',
    `appeal=${dueOf(pg, 'appeal')?.due ? 'due' : 'none'} court=${dueOf(pg, 'court')?.due ? 'due' : 'none'}`, !dueOf(pg, 'appeal')?.due && !dueOf(pg, 'court')?.due);
  const pm = E.plan('citizenship', cit([...first, { type: 'appeal_decision_delivered', date: '2027-08-10', outcome: 'granted', by: 'user' }]));
  probe('F2', 'variant', "citizenship: Minister grants on appeal → no court complaint", 'court has no due date', `court=${dueOf(pm, 'court')?.due ? dueOf(pm, 'court').due.latest : 'none'}`, !dueOf(pm, 'court')?.due);
}

/* ── F3: an exemption with no rule ────────────────────────────────────────────────────────────── */
{
  const p = E.plan('residence-card', res);
  const f = allFees(p).find((x) => x.exemption);
  probe('F3', 'audit', 'res-02 (study): exemption without a rule stays unknown; full 340 zł counted', 'exemption.outcome=unknown, amountPln=340',
    f ? `exemption.outcome=${f.exemption.outcome} amountPln=${f.amountPln}` : 'no fee with an exemption', f && f.exemption.outcome !== 'applies' && f.amountPln === 340);
  for (const purpose of ['work', 'family_abroad']) {
    const q = E.plan('residence-card', { ...res, facts: { 'pobyt_czasowy.purpose': purpose } });
    const granted = allFees(q).filter((x) => x.exemption?.outcome === 'applies');
    probe('F3', 'variant', `residence (${purpose}): no exemption shown as granted without a rule`, 'no fee with exemption.outcome=applies',
      granted.length ? granted.map((x) => x.id).join(', ') : 'none granted', !granted.length);
  }
}

/* ── F5: the reader (ambiguous consent, negation, explicit years, a ruled-out day) ─────────────── */
const strict = (t) => app.polarity(app.norm(t), true);
const consent = [
  ['audit', 'Tak, nie zgadzam się'], ['audit', 'Chyba tak'],
  ['variant', 'Tak, ale się nie zgadzam'], ['variant', 'No chyba tak'], ['variant', 'Raczej tak'], ['variant', 'Może'],
  ['variant', 'Tak, chociaż nie wiem'], ['variant', 'Zgadzam się, ale nie jestem pewien'], ['variant', 'Tak? Nie wiem'],
  ['variant', 'Zatwierdzam, chyba'], ['variant', 'Nie wiem, chyba tak'], ['variant', 'ok, ale nie'],
];
for (const [kind, t] of consent) { const r = strict(t); probe('F5', kind, `consent (strict): "${t}"`, 'not yes (null, no or dk)', r, r !== 'yes'); }
for (const [t, want] of [['Tak', 'yes'], ['Zatwierdzam', 'yes'], ['Nie zatwierdzam', 'no'], ['Nie', 'no']]) {
  const r = strict(t); probe('F5', 'control', `consent (strict): "${t}"`, want, r, r === want);
}
const negations = [
  ['audit', 'Nie złożyłem wniosku'],
  ['variant', 'Jeszcze nie złożyłam wniosku'], ['variant', 'Wniosek nie został złożony'], ['variant', 'Nie, nie złożyłem'],
  ['variant', 'Nie zdążyłem złożyć wniosku'], ['variant', 'Nie udało mi się złożyć'], ['variant', 'Wniosku nie złożyłem'],
  ['variant', 'Nie poszłam, więc nie złożyłam'], ['variant', 'Nie przyjęli wniosku'],
  ['variant', 'Nie wiem, czy złożyłem'], ['variant', 'Wniosek nie jest jeszcze złożony'], ['variant', 'Dokumenty nie zostały przyjęte'],
];
for (const [kind, t] of negations) { const r = app.readFollowUp(t); probe('F5', kind, `negation: "${t}"`, "not 'filed'", r, r !== 'filed'); }
for (const [t, want] of [['Złożyłem wniosek', 'filed'], ['Wszystko ok, przyjęli', 'filed']]) {
  const r = app.readFollowUp(t); probe('F5', 'control', `follow-up: "${t}"`, want, r, r === want);
}
// The cost of caution: a filing said together with another "nie" may be asked back (null). Wrong only if read as not filed.
{ const t = 'Wszystko ok, nie było problemu, złożyłem'; const r = app.readFollowUp(t); probe('F5', 'control', `follow-up: "${t}"`, "'filed' or null (asked back)", r, r === 'filed' || r === null); }
const when = (t) => { const w = app.readWhen(t); return `date=${w.date ?? null} time=${w.time ?? null}${w.ambiguous ? ' ambiguous' : ''}`; };
const years = [
  ['audit', '22.10.2028', ['2028-10-22']],
  ['variant', '22 października 2028', ['2028-10-22']], ['variant', '2028-10-22', ['2028-10-22', null]],
  ['variant', '22.10.2025', ['2025-10-22', null]], ['variant', '22.10.28', ['2028-10-22', null]],
  ['variant', '5 listopada 2027 o 9', ['2027-11-05']], ['variant', 'w 2028 roku, 22 października', ['2028-10-22', null]],
];
for (const [kind, t, ok] of years) {
  const w = app.readWhen(t);
  probe('F5', kind, `explicit year: "${t}"`, `date in [${ok.map(String).join(', ')}] (null = asked back)`, when(t), ok.includes(w.date ?? null));
}
const ruled = [
  ['audit', 'Jutro nie mogę, w piątek o 10', '2026-10-23', '10:00'],
  ['variant', 'Nie jutro, tylko w piątek o 10', '2026-10-23', '10:00'],
  ['variant', 'W piątek o 10, jutro nie dam rady', '2026-10-23', '10:00'],
  ['variant', 'Jutro odpada. Piątek 10:00', '2026-10-23', '10:00'],
  ['variant', 'Nie w środę, w czwartek o 9', '2026-10-22', '09:00'],
];
for (const [kind, t, d, h] of ruled) {
  const w = app.readWhen(t);
  probe('F5', kind, `ruled-out day: "${t}" (clock: Mon 19.10.2026)`, `date=${d} time=${h}, or asked back (date=null)`, when(t), (w.date === d || w.date == null) && (w.date == null || w.time === h || w.time == null));
}

/* ── Report ───────────────────────────────────────────────────────────────────────────────────── */
const head = [
  `Regressions for round 1 findings, run ${new Date().toISOString().slice(0, 10)}`,
  `Engine bundle: ${E.manifest?.engine ?? '?'}; registry ${E.registryVersion}`,
  'Kinds: audit = the auditor\'s input; variant = written for this run (not blind); control = must still work.',
  '',
];
const lines = rows.map((r) => `${r.pass ? 'PASS' : 'FAIL'}  ${r.finding}  ${r.kind.padEnd(7)}  ${r.name}\n      expected: ${r.expected}\n      actual:   ${r.actual}`);
const sum = ['F1', 'F2', 'F3', 'F5'].map((f) => { const xs = rows.filter((r) => r.finding === f); return `${f}: ${xs.filter((r) => r.pass).length}/${xs.length} pass`; });
const out = [...head, ...lines, '', ...sum, `Total: ${rows.filter((r) => r.pass).length}/${rows.length} pass`].join('\n');
const at = process.argv.indexOf('--out');
if (at > 0) writeFileSync(process.argv[at + 1], `${out}\n`);
console.log(out);
process.exitCode = rows.every((r) => r.pass) ? 0 : 1;
