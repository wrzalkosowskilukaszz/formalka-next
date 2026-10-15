// Independent plan validator: reads only the plan and the registry, never the planner's internals.
import { type Answers, UNKNOWN } from "./rules.ts";
import type { Plan, Registry } from "./types.ts";

export interface Violation { code: string; itemId: string; detail: string }

export function validate(plan: Plan, reg: Registry, facts: Answers, events: Record<string, string | undefined>): { status: "pass" | "fail"; violations: Violation[] } {
  const v: Violation[] = [];
  const lookup = (ruleRef: string | undefined) => {
    if (!ruleRef) return undefined;
    const m = /^([^@]+)@(\d+):(\w+):(.+)$/.exec(ruleRef);
    if (!m) return undefined;
    const [, pid, ver, kind, id] = m;
    const p = reg.procedures.find((x) => x.id === pid && x.version === Number(ver));
    if (!p) return { p: undefined, item: undefined };
    const list = { step: p.steps, document: p.documents, fee: p.fees, deadline: p.deadlines }[kind as "step"] as { id: string; quotes: unknown[] }[] | undefined;
    return { p, item: list?.find((x) => x.id === id) };
  };
  const all = [
    ...plan.tasks.map((t) => ({ id: t.id, ruleRef: t.ruleRef })),
    ...plan.documents, ...plan.fees, ...plan.deadlines,
  ];
  for (const it of all) {
    const found = lookup(it.ruleRef);
    if (!found) v.push({ code: "NO_RULE_REF", itemId: it.id, detail: "item has no registry reference" });
    else if (!found.p) v.push({ code: "RULE_NOT_PUBLISHED", itemId: it.id, detail: `${it.ruleRef} not in registry` });
    else if (found.p.status === "withdrawn") v.push({ code: "RULE_WITHDRAWN", itemId: it.id, detail: it.ruleRef });
    else if (!found.item) v.push({ code: "NO_RULE_REF", itemId: it.id, detail: `${it.ruleRef} names no item` });
    else if (!found.item.quotes.length) v.push({ code: "QUOTE_MISSING", itemId: it.id, detail: it.ruleRef });
  }
  for (const d of plan.deadlines) {
    if (d.due && !events[d.from]) v.push({ code: "DEADLINE_WITHOUT_BASIS", itemId: d.id, detail: `due date without a recorded ${d.from}` });
  }
  const ids = new Set(plan.tasks.map((t) => t.id));
  for (const t of plan.tasks) for (const d of t.deps) if (!ids.has(d)) v.push({ code: "UNKNOWN_DEPENDENCY", itemId: t.id, detail: d });
  if (hasCycle(plan)) v.push({ code: "CYCLE", itemId: plan.templateId, detail: "task graph has a cycle" });
  const defs = new Map(reg.facts.map((f) => [f.key, f]));
  for (const key of Object.keys(facts)) {
    const def = defs.get(key);
    if (!def) v.push({ code: "FACT_NOT_IN_CATALOGUE", itemId: key, detail: "not a catalogue fact" });
    else if (def.identifying) v.push({ code: "IDENTIFYING_FACT", itemId: key, detail: "identifying data must not enter planning" });
    else if (def.options.length && facts[key] !== UNKNOWN && !def.options.includes(String(facts[key])))
      v.push({ code: "FACT_VALUE_NOT_ALLOWED", itemId: key, detail: `${String(facts[key])} is not one of ${def.options.join(", ")}` });
  }
  return { status: v.length ? "fail" : "pass", violations: v };
}

function hasCycle(plan: Plan): boolean {
  const deps = new Map(plan.tasks.map((t) => [t.id, t.deps]));
  const state = new Map<string, 1 | 2>();
  const visit = (id: string): boolean => {
    if (state.get(id) === 1) return true;
    if (state.get(id) === 2) return false;
    state.set(id, 1);
    for (const d of deps.get(id) ?? []) if (visit(d)) return true;
    state.set(id, 2);
    return false;
  };
  return plan.tasks.some((t) => visit(t.id));
}
