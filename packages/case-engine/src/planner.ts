// The case planner: (blueprint, registry, case state) -> a map of levels with honest states.
// Pure and deterministic: no I/O, no clock, no LLM. Every task, fee and deadline points at the
// registry item it comes from (ruleRef); a level is locked only where the procedure's own step order
// says so; a date exists only after the user recorded the event it counts from.
import { type Blueprint, type LevelDef, stepsOf } from "./blueprint.ts";
import { type Due, dueDate, type Iso } from "./dates.ts";
import type { L10n, Procedure, Quote, Registry, Statement } from "./registry.ts";
import { ruleRef } from "./registry.ts";
import { type OfficeAnswer, officesFor, type Place } from "./offices.ts";
import { type Answers, evaluate, type Outcome, type Rule, UNKNOWN } from "./rules.ts";

export type TaskStatus = "todo" | "in_progress" | "done" | "not_needed";
export interface RecordedEvent {
  type: string; date: Iso; time?: string; outcome?: string;
  /** The level an event belongs to (a planned visit or call). */
  level?: string;
  /** Who says so: the user, or official evidence the user has (a stamp, a letter). */
  by: "user" | "evidence";
}
export interface CaseState {
  facts: Answers;
  /** The user's own choice when several routes apply. The engine never chooses. */
  routeChoice?: string;
  tasks: Record<string, TaskStatus>;
  events: RecordedEvent[];
  approved?: boolean;
  /** City-level place (TERYT), for the office. Not a catalogue fact; non-identifying; on the device. */
  place?: Place;
}
export type LevelState =
  | "unconfirmed" | "locked" | "available" | "in_progress" | "waiting_office" | "returned" | "done";

export interface PlanTask {
  id: string; levelId: string; kind: "document" | "step"; title: L10n; officialName?: string;
  description?: L10n; ruleRef: string; outcome: "applies" | "unknown"; missingFacts: string[];
  status: TaskStatus; quotes: Quote[];
  crossCase?: { procedure: string; blueprint?: string; label: L10n };
}
export interface PlanFee {
  id: string; ruleRef: string; purpose: L10n; amountPln: number; optional: boolean;
  outcome: "applies" | "unknown"; quotes: Quote[];
  exemption?: { id: string; ruleRef: string; outcome: "applies" | "unknown"; statement: Statement };
}
export interface PlanDeadline {
  id: string; ruleRef: string; levelId: string; role: "user" | "office"; outcome: "applies" | "unknown";
  description: L10n; from: string; amount: number; unit: string; due?: Due; quotes: Quote[];
}
export interface PlanLevel {
  id: string; order: number; title: L10n; state: LevelState; waiting: boolean;
  /** Why it is locked or returned, in plain words, with the registry item behind it. */
  reason?: { text: L10n; ruleRef?: string };
  dependsOn: string[]; parallelWith: string[];
  tasks: PlanTask[]; fees: PlanFee[]; deadlines: PlanDeadline[];
  stepRef?: string; completesWith?: string;
  /** Where to go for this level's step, from the registry's office layer. */
  office?: OfficeAnswer;
}
export interface RouteCandidate {
  procedureId: string; title: L10n;
  /** "reachable": every unmet condition can be met through another case (see `via`). */
  outcome: Outcome | "reachable"; missing: string[];
  via?: { condition: string; blueprint: string; title: L10n; label: L10n }[];
}
export interface RouteStatus {
  /** open: still asking; choice: several fit, the user picks; decided; unsure: "Nie wiem" leaves it open; none. */
  status: "open" | "choice" | "decided" | "unsure" | "none";
  procedureId?: string; ruleRef?: string; candidates: RouteCandidate[];
  /** Routes that may also apply but stay unsettled because of "Nie wiem" (offered, never forced). */
  alsoPossible: string[];
  /** The decided route needs another case first (e.g. the language certificate). */
  prerequisites: { condition: string; blueprint: string; title: L10n; label: L10n }[];
}
export interface CasePlan {
  blueprintId: string; registryVersion: string; status: "draft" | "active";
  route: RouteStatus; levels: PlanLevel[];
  /** Facts still asked about (missing), and facts answered "Nie wiem" that items depend on. */
  openFacts: string[]; unsure: { fact: string; affects: string[] }[];
  assumptions: { fact: string; value: string | boolean }[];
  inputsHash: string;
}

const worst = (...o: ("applies" | "unknown")[]) => (o.includes("unknown") ? "unknown" : "applies");

function routeEval(bp: Blueprint, p: Procedure, facts: Answers): Omit<RouteCandidate, "title"> {
  const fulfil = bp.fulfillable?.[p.id] ?? {};
  const base = p.applicability.rule ? evaluate(p.applicability.rule, facts) : { outcome: "applies" as Outcome, missing: [] };
  const conds = (p.applicability.conditions ?? []).map((c) => ({ id: c.id, ...evaluate(c.rule, facts) }));
  const all = [base, ...conds];
  const failing = conds.filter((c) => c.outcome === "does_not_apply");
  const missing = [...new Set(all.flatMap((c) => c.missing))];
  if (base.outcome === "does_not_apply" || failing.some((c) => !fulfil[c.id])) {
    return { procedureId: p.id, outcome: "does_not_apply", missing: [] };
  }
  if (all.some((c) => c.outcome === "unknown")) return { procedureId: p.id, outcome: "unknown", missing };
  if (failing.length) {
    return {
      procedureId: p.id, outcome: "reachable", missing: [],
      via: failing.map((c) => ({ condition: c.id, ...fulfil[c.id] })),
    };
  }
  return { procedureId: p.id, outcome: "applies", missing: [] };
}

export function resolveRoute(bp: Blueprint, reg: Registry, state: CaseState): RouteStatus {
  const candidates: RouteCandidate[] = bp.routes.map((id) => {
    const p = reg.procedures.get(id);
    if (!p) throw new Error(`blueprint ${bp.id}: unknown procedure ${id}`);
    return { ...routeEval(bp, p, state.facts), title: p.title };
  });
  const base = { candidates, alsoPossible: [] as string[], prerequisites: [] as RouteStatus["prerequisites"] };
  // Still askable: an unknown route with a fact nobody has answered yet (not even "Nie wiem").
  const unknown = candidates.filter((c) => c.outcome === "unknown");
  if (unknown.some((c) => c.missing.some((f) => state.facts[f] === undefined))) return { ...base, status: "open" };
  const options = candidates.filter((c) => c.outcome === "applies" || c.outcome === "reachable");
  const decided = (c: RouteCandidate): RouteStatus => ({
    ...base, status: "decided", procedureId: c.procedureId,
    ruleRef: ruleRef(reg, c.procedureId, "applicability", "route"),
    alsoPossible: unknown.map((u) => u.procedureId), prerequisites: c.via ?? [],
  });
  const chosen = options.find((c) => c.procedureId === state.routeChoice);
  if (chosen) return decided(chosen);
  if (options.length >= 2) return { ...base, status: "choice" };
  if (options.length === 1) return decided(options[0]);
  return { ...base, status: unknown.length ? "unsure" : "none" };
}

const lastEvent = (state: CaseState, type: string) =>
  state.events.filter((e) => e.type === type).sort((a, b) => (a.date < b.date ? -1 : 1)).at(-1);

export function planCase(bp: Blueprint, reg: Registry, state: CaseState): CasePlan {
  const route = resolveRoute(bp, reg, state);
  const open = new Set<string>();
  for (const c of route.candidates) if (c.outcome === "unknown") c.missing.forEach((f) => open.add(f));
  const unsureMap = new Map<string, Set<string>>();
  const noteUnsure = (rule: Rule | undefined, item: string) => {
    if (!rule) return;
    for (const f of factsOf(rule)) if (state.facts[f] === UNKNOWN) {
      if (!unsureMap.has(f)) unsureMap.set(f, new Set());
      unsureMap.get(f)!.add(item);
    }
  };

  const routeLevel: PlanLevel = {
    id: bp.routeLevel.id, order: 0, title: bp.routeLevel.title,
    state: route.status === "decided" ? "done" : Object.keys(state.facts).length ? "in_progress" : "available",
    waiting: false, dependsOn: [], parallelWith: [], tasks: [], fees: [], deadlines: [],
    ...(route.status === "choice"
      ? { reason: { text: { pl: "Pasuje więcej niż jedna droga. Wybór należy do Ciebie." } } }
      : route.status === "unsure"
        ? { reason: { text: { pl: "Bez tych odpowiedzi nie da się ustalić drogi. Pokażemy, kto może to sprawdzić." } } }
        : route.status === "none"
          ? { reason: { text: { pl: "Żadna droga z naszych źródeł nie pasuje do Twoich odpowiedzi." } } }
          : {}),
  };
  const levels: PlanLevel[] = [routeLevel];

  if (route.status !== "decided") {
    // Skeleton: the levels any still-possible route would have, all unconfirmed.
    const possible = route.candidates.filter((c) => c.outcome !== "does_not_apply").map((c) => c.procedureId);
    let order = 1;
    for (const l of bp.levels) {
      if (l.when || !possible.some((r) => l.steps?.[r] !== undefined)) continue;
      levels.push({
        id: l.id, order: order++, title: l.title, state: "unconfirmed", waiting: !!l.waiting,
        dependsOn: order === 2 ? [routeLevel.id] : [levels.at(-1)!.id], parallelWith: [],
        tasks: [], fees: [], deadlines: [],
      });
    }
  } else {
    const p = reg.procedures.get(route.procedureId!)!;
    const ref = (kind: string, id: string) => ruleRef(reg, p.id, kind, id);
    let order = 1;
    for (const pre of route.prerequisites) {
      levels.push({
        id: `prerequisite:${pre.condition}`, order: order++, title: pre.title, state: "available",
        waiting: false, dependsOn: [routeLevel.id], parallelWith: [], fees: [], deadlines: [],
        reason: { text: pre.label, ruleRef: ruleRef(reg, p.id, "condition", pre.condition) },
        tasks: [{
          id: `${p.id}:condition:${pre.condition}`, levelId: `prerequisite:${pre.condition}`, kind: "step",
          title: pre.label, ruleRef: ruleRef(reg, p.id, "condition", pre.condition), outcome: "applies",
          missingFacts: [], status: state.tasks[`${p.id}:condition:${pre.condition}`] ?? "todo",
          quotes: p.applicability.conditions?.find((c) => c.id === pre.condition)?.statement.quotes ?? [],
          crossCase: { procedure: pre.blueprint, blueprint: pre.blueprint, label: pre.label },
        }],
      });
    }
    const firstLevelDeps = route.prerequisites.map((x) => `prerequisite:${x.condition}`);
    const stepLevel = new Map<string, string>();
    for (const l of bp.levels) for (const s of stepsOf(l, p.id)) stepLevel.set(s, l.id);
    const docLevels: string[] = [];
    for (const l of bp.levels) {
      if (l.when) {
        const ev = lastEvent(state, l.when.event);
        if (!ev || (l.when.outcome && ev.outcome !== l.when.outcome)) continue;
      }
      // Of the level's alternative steps, the first one whose own condition may apply.
      let step: (typeof p.steps)[number] | undefined;
      let stepEval = { outcome: "applies" as Outcome, missing: [] as string[] };
      const alternatives = stepsOf(l, p.id);
      for (const id of alternatives) {
        const s = p.steps.find((x) => x.id === id)!;
        const e = evaluate(s.condition, state.facts);
        if (e.outcome === "does_not_apply") continue;
        step = s; stepEval = e;
        e.missing.forEach((f) => open.add(f));
        noteUnsure(s.condition, `step:${s.id}`);
        break;
      }
      if (alternatives.length && !step) continue; // none of its steps applies to this person
      const deadlines = deadlinesFor(bp, reg, p, l, state, noteUnsure, open);
      const stepless = !alternatives.length;
      if (stepless && !deadlines.length && !l.documents && !l.fees) continue;
      const tasks: PlanTask[] = [];
      if (l.documents) {
        for (const d of p.documents) {
          const e = evaluate(d.condition, state.facts);
          if (e.outcome === "does_not_apply") continue;
          e.missing.forEach((f) => open.add(f));
          noteUnsure(d.condition, `document:${d.id}`);
          const id = `${p.id}:document:${d.id}`;
          const x = l.crossCase?.find((c) => c.document === d.id);
          tasks.push({
            id, levelId: l.id, kind: "document", title: l.taskTitles?.[d.id] ?? { pl: d.namePl.value },
            officialName: d.namePl.value, description: d.description, ruleRef: ref("document", d.id),
            outcome: e.outcome === "unknown" ? "unknown" : "applies", missingFacts: e.missing,
            status: state.tasks[id] ?? "todo", quotes: d.namePl.quotes,
            ...(x ? { crossCase: { procedure: x.procedure, blueprint: x.blueprint, label: x.label } } : {}),
          });
        }
      } else if (step) {
        const id = `${p.id}:step:${step.id}`;
        tasks.push({
          id, levelId: l.id, kind: "step", title: step.title, description: step.description,
          ruleRef: ref("step", step.id), outcome: stepEval.outcome === "unknown" ? "unknown" : "applies",
          missingFacts: stepEval.missing, status: state.tasks[id] ?? "todo", quotes: step.quotes,
        });
      }
      const fees: PlanFee[] = [];
      if (l.fees) {
        for (const f of p.fees) {
          const e = evaluate(f.condition, state.facts);
          if (e.outcome === "does_not_apply") continue;
          e.missing.forEach((x) => open.add(x));
          noteUnsure(f.condition, `fee:${f.id}`);
          const fee: PlanFee = {
            id: f.id, ruleRef: ref("fee", f.id), purpose: f.purpose, amountPln: f.amountPln.value,
            optional: !!f.optional, outcome: e.outcome === "unknown" ? "unknown" : "applies", quotes: f.amountPln.quotes,
          };
          for (const x of f.exemptions ?? []) {
            const ex = evaluate(x.rule, state.facts);
            if (ex.outcome === "does_not_apply") continue;
            noteUnsure(x.rule, `fee:${f.id}`);
            fee.exemption = {
              id: x.id, ruleRef: ref("fee-exemption", `${f.id}/${x.id}`),
              outcome: ex.outcome === "unknown" ? "unknown" : "applies", statement: x.statement,
            };
            break;
          }
          fees.push(fee);
        }
      }
      const deps = (step?.dependsOn ?? []).map((s) => stepLevel.get(s)).filter((x): x is string => !!x);
      if (l.when) {
        const parent = bp.levels.find((x) => x.completesWith === l.when!.event);
        if (parent) deps.push(parent.id);
      }
      if (!deps.length) deps.push(routeLevel.id);
      // A route condition met through another case is needed to submit, not to prepare; so are the
      // documents of a documents-only level (they are part of the application).
      if (l.submits) deps.push(...firstLevelDeps, ...docLevels.filter((d) => !deps.includes(d)));
      if (stepless && l.documents) docLevels.push(l.id);
      levels.push({
        id: l.id, order: order++, title: l.title, state: "available", waiting: !!l.waiting,
        dependsOn: deps, parallelWith: [], tasks, fees, deadlines,
        ...(step ? { stepRef: ref("step", step.id) } : {}),
        ...(step?.officeKind ? { office: officesFor(reg, step.officeKind, state.place) } : {}),
        ...(l.completesWith ? { completesWith: l.completesWith } : {}),
      });
    }
    settleStates(bp, levels, state);
  }
  markParallel(levels);
  return {
    blueprintId: bp.id, registryVersion: reg.version,
    status: state.approved && route.status === "decided" ? "active" : "draft",
    route, levels, openFacts: [...open].filter((f) => state.facts[f] === undefined).sort(),
    unsure: [...unsureMap].map(([fact, s]) => ({ fact, affects: [...s].sort() })),
    assumptions: Object.entries(state.facts)
      .filter(([, v]) => v !== UNKNOWN).map(([fact, value]) => ({ fact, value: value as string | boolean }))
      .sort((a, b) => a.fact.localeCompare(b.fact)),
    inputsHash: hashInputs(bp, reg, state),
  };
}

function deadlinesFor(
  bp: Blueprint, reg: Registry, p: Procedure, l: LevelDef, state: CaseState,
  noteUnsure: (r: Rule | undefined, item: string) => void, open: Set<string>,
): PlanDeadline[] {
  const out: PlanDeadline[] = [];
  for (const d of p.deadlines) {
    const place = bp.deadlines[d.id];
    if (!place || place.level !== l.id) continue;
    const e = evaluate(d.condition, state.facts);
    if (e.outcome === "does_not_apply") continue;
    e.missing.forEach((f) => open.add(f));
    noteUnsure(d.condition, `deadline:${d.id}`);
    const r = d.rule.value;
    if (r.kind !== "relative") continue; // fixed dates: shown by the guide, not computed here
    const ev = lastEvent(state, r.from);
    out.push({
      id: d.id, ruleRef: ruleRef(reg, p.id, "deadline", d.id), levelId: l.id, role: place.role,
      outcome: e.outcome === "unknown" ? "unknown" : "applies", description: d.description,
      from: r.from, amount: r.amount, unit: r.unit, quotes: d.rule.quotes,
      ...(ev ? { due: dueDate(ev.date, r.amount, r.unit, place.counting) } : {}),
    });
  }
  return out;
}

function settleStates(bp: Blueprint, levels: PlanLevel[], state: CaseState) {
  const byId = new Map(levels.map((l) => [l.id, l]));
  const done = (l: PlanLevel): boolean => {
    if (l.order === 0) return l.state === "done";
    if (l.completesWith) return !!lastEvent(state, l.completesWith);
    if (!l.tasks.length) return false;
    return l.tasks.every((t) => t.status === "done" || t.status === "not_needed");
  };
  for (const l of levels) {
    if (l.order === 0) continue;
    const def = bp.levels.find((x) => x.id === l.id);
    const returning = l.deadlines.find((d) => bp.deadlines[d.id]?.returns && d.due);
    const fixed = returning && state.events.some((e) => e.type === "fix_submitted" && e.date >= dateOf(state, returning.from));
    const blocking = l.dependsOn.map((id) => byId.get(id)!).filter((d) => !done(d));
    if (returning && !fixed) {
      l.state = "returned";
      l.reason = { text: { pl: "Urząd prosi o uzupełnienie braków. Termin liczy się od doręczenia wezwania." }, ruleRef: returning.ruleRef };
    } else if (done(l)) l.state = "done";
    else if (blocking.length) {
      l.state = "locked";
      l.reason = { text: { pl: `Najpierw: ${blocking.map((b) => b.title.pl).join(", ")}.` }, ruleRef: l.stepRef };
    } else if (def?.waiting) l.state = "waiting_office";
    else if (l.tasks.some((t) => t.status !== "todo")) l.state = "in_progress";
    else l.state = "available";
  }
}

function dateOf(state: CaseState, type: string): Iso {
  return lastEvent(state, type)?.date ?? "0000-00-00";
}

function markParallel(levels: PlanLevel[]) {
  const byId = new Map(levels.map((l) => [l.id, l]));
  const reach = (from: string, to: string, seen = new Set<string>()): boolean => {
    if (from === to) return true;
    if (seen.has(from)) return false;
    seen.add(from);
    return (byId.get(from)?.dependsOn ?? []).some((d) => reach(d, to, seen));
  };
  const open = levels.filter((l) => l.state === "available" || l.state === "in_progress");
  for (const a of open) {
    a.parallelWith = open.filter((b) => b !== a && !reach(a.id, b.id) && !reach(b.id, a.id)).map((b) => b.id);
  }
}

export function factsOf(rule: Rule): string[] {
  if ("all" in rule) return rule.all.flatMap(factsOf);
  if ("any" in rule) return rule.any.flatMap(factsOf);
  if ("not" in rule) return factsOf(rule.not);
  return [rule.fact];
}

function hashInputs(bp: Blueprint, reg: Registry, s: CaseState): string {
  const text = JSON.stringify([
    bp.id, reg.version, s.routeChoice ?? null, !!s.approved, s.place?.teryt ?? null,
    Object.entries(s.facts).sort(), Object.entries(s.tasks).sort(),
    [...s.events].map((e) => [e.type, e.date, e.time ?? "", e.outcome ?? "", e.by]).sort(),
  ]);
  let h = 2166136261; // FNV-1a; production would use SHA-256
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619) >>> 0;
  return h.toString(16);
}
