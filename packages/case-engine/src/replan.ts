// A replan is a proposal the person approves (ADR-N003). After a plan is approved, a change (a confirmed
// fact, a new registry version) produces a proposed plan; `diffPlans` compares it with the approved one
// by stable ids, in words the person can check before saying yes. Done work is never undone: a task done
// in the approved plan that the proposal no longer has stays in the history, and `done` is never reset.
import type { CasePlan, CaseState, LevelState } from "./planner.ts";
import type { L10n } from "./registry.ts";

export interface ItemRef { id: string; levelId: string; title: L10n }
export interface PlanDiff {
  route?: { from?: string; to?: string };
  levels: { added: ItemRef[]; removed: ItemRef[]; state: (ItemRef & { from: LevelState; to: LevelState })[] };
  /** Tasks that now apply, or that no longer do. A removed task already done is kept as history instead. */
  tasks: { added: ItemRef[]; removed: ItemRef[]; nowCertain: ItemRef[]; keptAsHistory: ItemRef[] };
  fees: { added: (ItemRef & { amountPln: number })[]; removed: (ItemRef & { amountPln: number })[]; changed: (ItemRef & { from: number; to: number })[] };
  deadlines: { added: ItemRef[]; removed: ItemRef[]; changed: (ItemRef & { from?: string; to?: string })[] };
  offices: { levelId: string; title: L10n; from: string[]; to: string[] }[];
  empty: boolean;
}

export function diffPlans(approved: CasePlan, proposed: CasePlan, tasks: CaseState["tasks"]): PlanDiff {
  const d: PlanDiff = {
    levels: { added: [], removed: [], state: [] },
    tasks: { added: [], removed: [], nowCertain: [], keptAsHistory: [] },
    fees: { added: [], removed: [], changed: [] },
    deadlines: { added: [], removed: [], changed: [] },
    offices: [], empty: true,
  };
  if (approved.route.procedureId !== proposed.route.procedureId) d.route = { from: approved.route.procedureId, to: proposed.route.procedureId };
  const levelsA = new Map(approved.levels.map((l) => [l.id, l]));
  const levelsP = new Map(proposed.levels.map((l) => [l.id, l]));
  for (const [id, l] of levelsP) {
    const a = levelsA.get(id);
    if (!a) d.levels.added.push({ id, levelId: id, title: l.title });
    else if (a.state !== l.state) d.levels.state.push({ id, levelId: id, title: l.title, from: a.state, to: l.state });
  }
  for (const [id, l] of levelsA) if (!levelsP.has(id)) d.levels.removed.push({ id, levelId: id, title: l.title });

  const all = <T extends { id: string }>(p: CasePlan, pick: (l: CasePlan["levels"][number]) => T[]) =>
    new Map(p.levels.flatMap((l) => pick(l).map((x) => [x.id, { ...x, levelId: l.id }] as const)));
  const ref = (x: { id: string; levelId: string }, title: L10n): ItemRef => ({ id: x.id, levelId: x.levelId, title });

  const tA = all(approved, (l) => l.tasks), tP = all(proposed, (l) => l.tasks);
  for (const [id, t] of tP) {
    const a = tA.get(id);
    if (!a) d.tasks.added.push(ref(t, t.title));
    else if (a.outcome === "unknown" && t.outcome === "applies") d.tasks.nowCertain.push(ref(t, t.title));
  }
  for (const [id, t] of tA) {
    if (tP.has(id)) continue;
    (tasks[id] === "done" ? d.tasks.keptAsHistory : d.tasks.removed).push(ref(t, t.title));
  }

  const counts = (f: { optional: boolean; outcome: string; exemption?: { outcome: string } }) => !f.optional && f.outcome === "applies" && f.exemption?.outcome !== "applies";
  const fA = all(approved, (l) => l.fees.filter(counts)), fP = all(proposed, (l) => l.fees.filter(counts));
  for (const [id, f] of fP) {
    const a = fA.get(id);
    if (!a) d.fees.added.push({ ...ref(f, f.purpose), amountPln: f.amountPln });
    else if (a.amountPln !== f.amountPln) d.fees.changed.push({ ...ref(f, f.purpose), from: a.amountPln, to: f.amountPln });
  }
  for (const [id, f] of fA) if (!fP.has(id)) d.fees.removed.push({ ...ref(f, f.purpose), amountPln: f.amountPln });

  const dA = all(approved, (l) => l.deadlines.filter((x) => x.outcome === "applies"));
  const dP = all(proposed, (l) => l.deadlines.filter((x) => x.outcome === "applies"));
  for (const [id, x] of dP) {
    const a = dA.get(id);
    if (!a) d.deadlines.added.push(ref(x, x.description));
    else if (a.due?.earliest !== x.due?.earliest) d.deadlines.changed.push({ ...ref(x, x.description), from: a.due?.earliest, to: x.due?.earliest });
  }
  for (const [id, x] of dA) if (!dP.has(id)) d.deadlines.removed.push(ref(x, x.description));

  for (const [id, l] of levelsP) {
    const from = levelsA.get(id)?.office?.offices.map((o) => o.id) ?? [];
    const to = l.office?.offices.map((o) => o.id) ?? [];
    if (from.join() !== to.join()) d.offices.push({ levelId: id, title: l.title, from, to });
  }

  d.empty = !d.route && !d.offices.length && [d.levels, d.tasks, d.fees, d.deadlines]
    .every((g) => Object.values(g).every((xs) => xs.length === 0));
  return d;
}

/**
 * Task statuses after an approved replan: done stays done, ever. A task that left the plan loses any
 * other status, so if a later change brings it back it starts fresh instead of hidden as "not needed".
 */
export function applyReplan(tasks: CaseState["tasks"], d: PlanDiff): CaseState["tasks"] {
  const next = { ...tasks };
  for (const t of d.tasks.removed) if (next[t.id] !== "done") delete next[t.id];
  return next;
}
