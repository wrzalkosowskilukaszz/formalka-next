// Walks every answer path of every blueprint through the built engine bundle (the one the prototype ships),
// then plays each finished plan forward step by step (tasks done, completing events recorded as the prototype
// records them, the office's request and the fix, both decision outcomes).
// It looks only for critical faults: an exception, a plan the engine's own checks reject, broken text
// (undefined, NaN, [object Object], Invalid Date), a never-say phrase, a negative or non-numeric fee (0 is a free step),
// an invalid due date, a plan that can never finish, and an agenda that throws or fires at an invalid time.
// Usage: node audit/2026-10-17-correctness/walk-engine.mjs [--selftest]   (prints a summary; exit 1 on any fault)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const bundle = readFileSync(join(root, 'packages/case-engine/dist/case-engine.browser.js'), 'utf8');
const ctx = vm.createContext({});
vm.runInContext(bundle, ctx);
const E = ctx.FormalkaEngine;
const U = E.UNKNOWN;
const PLACES = [{ teryt: '1465011', name: 'Warszawa' }, { teryt: '1261011', name: 'Kraków' }, { teryt: '0264011', name: 'Wrocław' }, { teryt: '2261011', name: 'Gdańsk' }];
const NOW = { date: '2026-10-19', time: '18:40' };
const faults = new Map();
const stats = {};
const ends = new Set();
const fault = (bp, kind, detail, path) => {
  const k = `${bp} | ${kind} | ${detail}`;
  if (!faults.has(k)) faults.set(k, { n: 0, path });
  faults.get(k).n++;
};
const BAD = /\bundefined\b|\bNaN\b|\[object Object\]|Invalid Date/;
const never = (E.PHRASES_NEVER || []).map((p) => (p instanceof RegExp ? p : new RegExp(String(p).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')));
function strings(o, out = []) {
  if (typeof o === 'string') out.push(o);
  else if (Array.isArray(o)) o.forEach((x) => strings(x, out));
  else if (o && typeof o === 'object') Object.values(o).forEach((x) => strings(x, out));
  return out;
}
const isDay = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(`${d}T00:00:00Z`)) && new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) === d;
const addDays = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10);

function checkPlan(bp, p, state, path, where) {
  const v = E.validate(p, state);
  if (!v.ok) for (const x of v.violations) fault(bp, `${where}: validator`, `${x.code} ${x.item ?? ''}`.trim(), path);
  for (const s of strings(p)) {
    if (BAD.test(s)) fault(bp, `${where}: broken text`, s.slice(0, 120), path);
    for (const re of never) if (re.test(s)) fault(bp, `${where}: never-say phrase`, s.slice(0, 120), path);
  }
  for (const l of p.levels) {
    for (const f of l.fees) if (!(Number.isFinite(f.amountPln) && f.amountPln >= 0)) fault(bp, `${where}: fee amount`, `${f.id}=${f.amountPln}`, path);
    for (const d of l.deadlines) {
      if (d.due) for (const k of ['earliest', 'latest']) if (d.due[k] !== undefined && !isDay(d.due[k])) fault(bp, `${where}: due date`, `${d.id}.${k}=${d.due[k]}`, path);
      if (d.due?.earliest && d.due?.latest && d.due.earliest > d.due.latest) fault(bp, `${where}: due range reversed`, d.id, path);
    }
    if (l.state === 'locked' && !l.reason) fault(bp, `${where}: lock without reason`, l.id, path);
  }
}
function checkAgenda(bp, p, state, path, now, where) {
  for (const consent of [false, true]) {
    let items;
    try {
      items = E.agenda({ caseId: 'c1', blueprintId: bp, plan: p, state, prefs: { ...E.DEFAULT_PREFS, consent }, now, lastActivity: now.date });
    } catch (e) { fault(bp, `${where}: agenda throws`, e.message, path); continue; }
    for (const it of items) {
      const [d, t] = String(it.fireAt).split('T');
      if (!isDay(d) || !/^\d{2}:\d{2}$/.test(t || '')) fault(bp, `${where}: agenda fireAt`, it.fireAt, path);
      for (const s of strings(it)) if (BAD.test(s)) fault(bp, `${where}: agenda broken text`, s.slice(0, 120), path);
    }
  }
}

// Plays an approved plan forward: each round, every task of every open level is marked done, then the first
// level that can be completed by an event gets it (a decision both ways, in separate branches).
function playForward(bp, start, path, budget) {
  const stack = [{ state: start, day: NOW.date, round: 0, path }];
  let runs = 0;
  while (stack.length && runs < budget) {
    const { state, day, round, path: pth } = stack.pop();
    let p;
    try { p = E.plan(bp, state); } catch (e) { fault(bp, 'play: plan throws', e.message, pth); continue; }
    checkPlan(bp, p, state, pth, 'play');
    checkAgenda(bp, p, state, pth, { date: day, time: '09:00' }, 'play');
    const open = p.levels.filter((l) => ['available', 'in_progress', 'returned', 'waiting_office'].includes(l.state));
    const settled = p.levels.every((l) => ['done', 'skipped'].includes(l.state) || (l.state === 'locked' && /odmow|refus/i.test(JSON.stringify(l.reason ?? ''))));
    if (!open.length) {
      runs++;
      const locked = p.levels.filter((l) => l.state === 'locked' || l.state === 'unconfirmed');
      if (!settled && locked.length && !p.levels.some((l) => l.state === 'done')) fault(bp, 'play: stuck', locked.map((l) => `${l.id}:${l.state}`).join(','), pth);
      continue;
    }
    if (round > 25) { fault(bp, 'play: no end after 25 rounds', open.map((l) => `${l.id}:${l.state}`).join(','), pth); runs++; continue; }
    const tasks = { ...state.tasks };
    for (const l of open) for (const t of l.tasks) tasks[t.id] = 'done';
    const next = addDays(day, 3);
    // The office's request for more (the prototype's "Urząd prosi o uzupełnienie"), then the fix.
    const evs = (type) => state.events.some((e) => e.type === type);
    const step = (ev, label) => stack.push({ state: { ...state, tasks, events: [...state.events, ev] }, day: next, round: round + 1, path: `${pth} > ${label}` });
    if (open.some((l) => l.state === 'returned') && !evs('fix_submitted')) { step({ type: 'fix_submitted', date: next, by: 'user' }, 'fix_submitted'); continue; }
    if (open.some((l) => l.state === 'waiting_office') && !evs('request_delivered') && p.levels.some((l) => l.deadlines.some((d) => d.from === 'request_delivered'))) {
      step({ type: 'request_delivered', date: next, by: 'user' }, 'request_delivered');
    }
    const lvl = open.find((l) => l.completesWith && !evs(l.completesWith));
    if (!lvl) {
      if (JSON.stringify(tasks) === JSON.stringify(state.tasks)) {
        // A last level with nothing to record (citizenship "after-appeal": the court complaint) is an end.
        runs++;
        const last = open.every((l) => !l.completesWith && !p.levels.some((m) => m.dependsOn.includes(l.id)));
        if (last) ends.add(`${bp}: ${open.map((l) => l.id).join(',')}`); else fault(bp, 'play: open level with no way forward', open.map((l) => `${l.id}:${l.state}`).join(','), pth);
        continue;
      }
      stack.push({ state: { ...state, tasks }, day: next, round: round + 1, path: pth });
      continue;
    }
    const outs = E.blueprint(bp).events?.[lvl.completesWith]?.outcomes ?? [undefined];
    for (const outcome of outs) {
      const ev = { type: lvl.completesWith, date: next, by: 'user', ...(outcome ? { outcome } : {}) };
      stack.push({ state: { ...state, tasks, events: [...state.events, ev] }, day: next, round: round + 1, path: `${pth} > ${lvl.completesWith}${outcome ? `:${outcome}` : ''}` });
    }
  }
  return runs;
}

// --selftest: each check must catch a planted fault (a NaN fee, broken text, an impossible date, a lock
// with no reason, a plan the validator rejects), so a clean run means the checks ran, not that they are blind.
if (process.argv.includes('--selftest')) {
  const st = { facts: { 'zameldowanie.citizen_group': 'other', 'zameldowanie.stay': 'permanent' }, tasks: {}, events: [], place: PLACES[0] };
  const p = structuredClone(E.plan('address-registration', st));
  const l = p.levels.find((x) => x.fees.length) ?? p.levels[0];
  if (l.fees[0]) l.fees[0].amountPln = NaN; else l.fees.push({ id: 'x', amountPln: NaN, purpose: { pl: 'x' } });
  l.title.pl = 'Krok undefined';
  l.deadlines.push({ id: 'd', due: { latest: '2026-02-30' } });
  p.levels.push({ ...p.levels[0], id: 'zz', state: 'locked', reason: undefined, fees: [], deadlines: [], tasks: [] });
  checkPlan('selftest', p, st, '', 'self');
  const want = ['self: fee amount', 'self: broken text', 'self: due date', 'self: lock without reason', 'self: validator'];
  const got = [...faults.keys()].map((k) => k.split(' | ')[1]);
  const miss = want.filter((w) => !got.includes(w));
  console.log(miss.length ? `selftest FAILED: not caught ${miss.join(', ')}` : `selftest ok: ${want.length} planted faults caught`);
  process.exit(miss.length ? 1 : 0);
}

for (const bp of E.blueprintIds) {
  const s = (stats[bp] = { states: 0, leaves: 0, plays: 0, routes: new Set() });
  const walk = (state, asked, path) => {
    s.states++;
    let q, p;
    try { q = E.nextQuestion(bp, state, asked, 12, 'you'); E.nextQuestion(bp, state, asked, 12, 'other'); } catch (e) { fault(bp, 'nextQuestion throws', e.message, path); return; }
    try { p = E.plan(bp, state); } catch (e) { fault(bp, 'plan throws', e.message, path); return; }
    if (q) {
      const def = E.fact(q.key);
      const vals = def.options?.length ? def.options.map((o) => o.value) : [true, false];
      for (const v of [...vals, U]) walk({ ...state, facts: { ...state.facts, [q.key]: v } }, asked + 1, `${path} ${q.key}=${v === U ? '?' : v}`);
      return;
    }
    if (p.route.status === 'choice' && !state.routeChoice) {
      for (const c of p.route.candidates.filter((x) => x.outcome === 'applies')) walk({ ...state, routeChoice: c.procedureId }, asked, `${path} route=${c.procedureId}`);
      return;
    }
    const places = p.levels.some((l) => l.office?.needsPlace) && !state.place ? [undefined, ...PLACES] : [state.place];
    for (const place of places) {
      const st = { ...state, ...(place ? { place } : {}) };
      const pp = E.plan(bp, st);
      s.leaves++;
      s.routes.add(`${pp.route.status}:${pp.route.procedureId ?? '-'}`);
      const lp = `${path}${place ? ` place=${place.name}` : ''}`;
      checkPlan(bp, pp, st, lp, 'leaf');
      if (pp.route.status === 'decided' && !pp.levels.length) fault(bp, 'leaf: decided route without levels', pp.route.procedureId, lp);
      const approved = { ...st, approved: true };
      const ap = E.plan(bp, approved);
      checkAgenda(bp, ap, approved, lp, NOW, 'approved');
      if (pp.route.status === 'decided' && (place || !pp.levels.some((l) => l.office?.needsPlace))) s.plays += playForward(bp, approved, lp, 40);
    }
  };
  walk({ facts: {}, tasks: {}, events: [] }, 0, '');
}

for (const [bp, s] of Object.entries(stats)) console.log(`${bp}: ${s.states} states, ${s.leaves} finished plans, ${s.plays} played to the end; routes ${[...s.routes].join(' ')}`);
console.log(`ends at a last level with nothing to record: ${[...ends].join('; ') || 'none'}`);
console.log(`\n${faults.size} distinct faults`);
for (const [k, { n, path }] of faults) console.log(`- ${k}  (${n}×; e.g.${path})`);
process.exit(faults.size ? 1 : 0);
