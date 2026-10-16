// Content verification, kept apart from the structural check in validator.ts (audit F1, 2026-10-16).
// A plan can resolve every reference and still say the wrong thing: a fee of 999 999 zł with a valid
// ruleRef, a renamed task, missing items, an office that doesn't exist. This check compares what the
// plan says with two things the plan doesn't control:
// - the registry and the recorded events, directly: every amount, exemption, start event, date and
//   office, without going through the planner;
// - a plan recomputed from the same inputs (blueprint, registry, state): nothing missing, nothing extra,
//   and titles, outcomes and states as the inputs produce them.
import type { Blueprint } from "./blueprint.ts";
import { dueDate } from "./dates.ts";
import { type CasePlan, type CaseState, planCase, type PlanLevel } from "./planner.ts";
import type { Registry } from "./registry.ts";
import { evaluate } from "./rules.ts";
import type { Violation } from "./validator.ts";

const lastEvent = (state: CaseState, type: string) =>
  state.events.filter((e) => e.type === type).sort((a, b) => (a.date < b.date ? -1 : 1)).at(-1);
const parseRef = (ref: string) => /^([^@]+)@[^:]+:([\w-]+):(.+)$/.exec(ref);

export function verifyContent(plan: CasePlan, bp: Blueprint, reg: Registry, state: CaseState): { ok: boolean; violations: Violation[] } {
  const v: Violation[] = [];
  const add = (code: string, item: string, detail = "") => v.push({ code, item, detail });

  // 1. Against the registry and the recorded events.
  for (const l of plan.levels) {
    for (const f of l.fees) {
      const m = parseRef(f.ruleRef);
      const rf = m && reg.procedures.get(m[1])?.fees.find((x) => x.id === f.id);
      if (!rf) continue; // an unresolvable reference is the structural check's finding
      if (f.amountPln !== rf.amountPln.value) add("FEE_AMOUNT", `fee:${f.id}`, `${f.amountPln} ≠ ${rf.amountPln.value}`);
      if (f.exemption?.outcome === "applies") {
        const x = rf.exemptions?.find((e) => e.id === f.exemption!.id);
        if (!x?.rule || evaluate(x.rule, state.facts).outcome !== "applies") add("EXEMPTION_WITHOUT_BASIS", `fee:${f.id}`, f.exemption.id);
      }
    }
    for (const d of l.deadlines) {
      const m = parseRef(d.ruleRef);
      const rd = m && reg.procedures.get(m[1])?.deadlines.find((x) => x.id === d.id);
      const place = bp.deadlines[d.id];
      if (!rd || !place || rd.rule.value.kind !== "relative") continue;
      const r = rd.rule.value;
      const from = place.from ?? r.from;
      if (d.from !== from) add("DEADLINE_START", `deadline:${d.id}`, `${d.from} ≠ ${from}`);
      if (d.amount !== r.amount || d.unit !== r.unit) add("DEADLINE_RULE", `deadline:${d.id}`, `${d.amount} ${d.unit}`);
      const ev = lastEvent(state, from);
      const due = ev ? dueDate(ev.date, r.amount, r.unit, place.counting) : undefined;
      if (due?.earliest !== d.due?.earliest || due?.latest !== d.due?.latest) add("DEADLINE_DATE", `deadline:${d.id}`, `${d.due?.latest} ≠ ${due?.latest}`);
    }
    for (const o of l.office?.offices ?? []) {
      const office = reg.offices.find((x) => x.id === o.id);
      const inst = reg.institutions.get(o.id);
      if (!office && !inst) { add("OFFICE_NOT_IN_REGISTRY", `office:${o.id}`); continue; }
      if (o.address && o.address.value !== office?.address?.value) add("OFFICE_ADDRESS", `office:${o.id}`, o.address.value);
    }
  }

  // 2. Against a plan recomputed from the same inputs.
  const expected = planCase(bp, reg, state);
  if (expected.route.status !== plan.route.status || expected.route.procedureId !== plan.route.procedureId) {
    add("ROUTE_MISMATCH", "route", `${plan.route.status} ${plan.route.procedureId ?? ""}`);
  }
  const ids = (ls: PlanLevel[]) => ls.map((l) => l.id).join();
  if (ids(plan.levels) !== ids(expected.levels)) add("LEVELS_MISMATCH", plan.blueprintId, `${ids(plan.levels)} ≠ ${ids(expected.levels)}`);
  for (const want of expected.levels) {
    const got = plan.levels.find((l) => l.id === want.id);
    if (!got) continue;
    if (got.state !== want.state) add("LEVEL_STATE", want.id, `${got.state} ≠ ${want.state}`);
    const compare = <T extends { id: string }>(kind: string, a: T[], b: T[], key: (x: T) => string) => {
      for (const x of b) {
        const y = a.find((z) => z.id === x.id);
        if (!y) add("ITEM_MISSING", `${kind}:${x.id}`);
        else if (key(y) !== key(x)) add("ITEM_CHANGED", `${kind}:${x.id}`, `${key(y)} ≠ ${key(x)}`);
      }
      for (const y of a) if (!b.some((x) => x.id === y.id)) add("ITEM_EXTRA", `${kind}:${y.id}`);
    };
    compare("task", got.tasks, want.tasks, (t) => `${t.title.pl}|${t.outcome}|${t.status}`);
    compare("fee", got.fees, want.fees, (f) => `${f.amountPln}|${f.outcome}|${f.exemption?.outcome ?? ""}`);
    compare("deadline", got.deadlines, want.deadlines, (d) => `${d.from}|${d.due?.earliest ?? ""}|${d.due?.latest ?? ""}`);
    compare("note", got.notes, want.notes, (n) => `${n.important}`);
    compare("office", got.office?.offices ?? [], want.office?.offices ?? [], (o) => `${o.name.pl}|${o.address?.value ?? ""}`);
  }
  return { ok: v.length === 0, violations: v };
}
