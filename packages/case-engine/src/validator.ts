// Independent plan validator: reads only the plan, the registry and the recorded state, never the
// planner's internals. A plan that fails is not shown (11 §4: release-blocking failures).
import type { CasePlan, CaseState } from "./planner.ts";
import type { Registry } from "./registry.ts";
import { UNKNOWN } from "./rules.ts";

export interface Violation { code: string; item: string; detail: string }

export function validatePlan(plan: CasePlan, reg: Registry, state: CaseState): { ok: boolean; violations: Violation[] } {
  const v: Violation[] = [];
  const add = (code: string, item: string, detail = "") => v.push({ code, item, detail });

  const resolve = (ref: string | undefined): string | null => {
    if (!ref) return "missing";
    const m = /^([^@]+)@([^:]+):([\w-]+):(.+)$/.exec(ref);
    if (!m) return "malformed";
    const [, pid, ver, kind, id] = m;
    if (ver !== reg.version) return `version ${ver} is not ${reg.version}`;
    const p = reg.procedures.get(pid);
    if (!p) return `no procedure ${pid}`;
    const found =
      kind === "step" ? p.steps.find((s) => s.id === id)?.quotes.length
      : kind === "document" ? p.documents.find((d) => d.id === id)?.namePl.quotes.length
      : kind === "fee" ? p.fees.find((f) => f.id === id)?.amountPln.quotes.length
      : kind === "fee-exemption" ? (() => { const [f, x] = id.split("/"); return p.fees.find((y) => y.id === f)?.exemptions?.find((e) => e.id === x)?.statement.quotes.length; })()
      : kind === "deadline" ? p.deadlines.find((d) => d.id === id)?.rule.quotes.length
      : kind === "condition" ? p.applicability.conditions?.find((c) => c.id === id)?.statement.quotes.length
      : kind === "applicability" ? 1
      : 0;
    return found ? null : `no quoted ${kind} ${id} in ${pid}`;
  };

  if (plan.registryVersion !== reg.version) add("REGISTRY_VERSION", plan.blueprintId, plan.registryVersion);
  if (plan.route.status === "decided") {
    const bad = resolve(plan.route.ruleRef);
    if (bad) add("NO_RULE_REF", "route", bad);
  }
  const ids = new Set(plan.levels.map((l) => l.id));
  for (const l of plan.levels) {
    for (const t of l.tasks) { const bad = resolve(t.ruleRef); if (bad) add("NO_RULE_REF", t.id, bad); }
    for (const f of l.fees) {
      const bad = resolve(f.ruleRef); if (bad) add("NO_RULE_REF", `fee:${f.id}`, bad);
      if (f.exemption) { const b2 = resolve(f.exemption.ruleRef); if (b2) add("NO_RULE_REF", `exemption:${f.id}`, b2); }
    }
    for (const d of l.deadlines) {
      const bad = resolve(d.ruleRef); if (bad) add("NO_RULE_REF", `deadline:${d.id}`, bad);
      if (d.due && !state.events.some((e) => e.type === d.from)) add("DATE_WITHOUT_EVENT", `deadline:${d.id}`, d.from);
    }
    for (const dep of l.dependsOn) if (!ids.has(dep)) add("UNKNOWN_DEPENDENCY", l.id, dep);
    if (l.state === "locked" && !l.reason?.ruleRef) add("LOCK_WITHOUT_BASIS", l.id);
    if (l.state === "returned" && !l.reason?.ruleRef) add("RETURN_WITHOUT_BASIS", l.id);
  }
  if (hasCycle(plan)) add("CYCLE", plan.blueprintId);
  for (const [key, value] of Object.entries(state.facts)) {
    const def = reg.facts.get(key);
    if (!def) { add("FACT_NOT_IN_CATALOGUE", key); continue; }
    if (key.startsWith("personal.")) add("IDENTIFYING_FACT", key);
    if (value !== UNKNOWN && def.options && !def.options.some((o) => o.value === value)) {
      add("FACT_VALUE_NOT_ALLOWED", key, String(value));
    }
  }
  for (const e of state.events) {
    if (e.by !== "user" && e.by !== "evidence") add("EVENT_WITHOUT_SOURCE", e.type);
  }
  return { ok: v.length === 0, violations: v };
}

function hasCycle(plan: CasePlan): boolean {
  const deps = new Map(plan.levels.map((l) => [l.id, l.dependsOn]));
  const state = new Map<string, 1 | 2>();
  const visit = (id: string): boolean => {
    if (state.get(id) === 1) return true;
    if (state.get(id) === 2) return false;
    state.set(id, 1);
    for (const d of deps.get(id) ?? []) if (visit(d)) return true;
    state.set(id, 2);
    return false;
  };
  return plan.levels.some((l) => visit(l.id));
}
