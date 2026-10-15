// Deterministic planner: (template, confirmed facts, recorded events, registry) -> candidate plan.
// No LLM, no I/O. Every plan item carries a ruleRef to a published registry item.
import { type Answers, evaluate } from "./rules.ts";
import type { CaseTemplate, Events, Plan, PlanDeadline, PlanItem, PlanTask, Procedure, Registry } from "./types.ts";

export function plan(templateId: string, facts: Answers, events: Events, reg: Registry): Plan {
  const template = reg.templates.find((t) => t.id === templateId);
  if (!template) throw new Error(`unknown template ${templateId}`);
  const out: Plan = { templateId, inputsHash: hashInputs(templateId, facts, events, reg), tasks: [], documents: [], fees: [], deadlines: [], openFacts: [] };
  const open = new Set<string>();
  for (const { procedureId, when } of template.procedures) {
    const route = evaluate(when, facts);
    route.missing.forEach((f) => open.add(f));
    if (route.outcome === "does_not_apply") continue;
    const p = reg.procedures.find((x) => x.id === procedureId);
    if (!p || p.status !== "published") continue; // the validator reports a template that references it
    addProcedure(p, facts, events, out, open, route.outcome);
  }
  out.openFacts = [...open].sort();
  return out;
}

function addProcedure(p: Procedure, facts: Answers, events: Events, out: Plan, open: Set<string>, routeOutcome: "applies" | "unknown") {
  const ref = (kind: string, id: string) => `${p.id}@${p.version}:${kind}:${id}`;
  const office = officeFor(p, facts, open);
  for (const s of p.steps) {
    const e = evaluate(s.condition, facts);
    e.missing.forEach((f) => open.add(f));
    if (e.outcome === "does_not_apply") continue;
    const t: PlanTask = { id: `${p.id}:${s.id}`, kind: s.kind, deps: s.dependsOn.map((d) => `${p.id}:${d}`), ruleRef: ref("step", s.id), outcome: worst(e.outcome, routeOutcome) };
    if (s.kind === "visit") t.officeRef = office;
    out.tasks.push(t);
  }
  for (const d of p.documents) {
    const e = evaluate(d.condition, facts);
    e.missing.forEach((f) => open.add(f));
    if (e.outcome === "does_not_apply") continue;
    const item: PlanItem = { id: d.id, ruleRef: ref("document", d.id), outcome: worst(e.outcome, routeOutcome) };
    if (d.disputed) item.disputed = true;
    if (d.alternativeTo?.length) item.alternatives = d.alternativeTo;
    out.documents.push(item);
  }
  for (const f of p.fees) {
    const e = evaluate(f.condition, facts);
    e.missing.forEach((x) => open.add(x));
    if (e.outcome === "does_not_apply") continue;
    out.fees.push({ id: f.id, ruleRef: ref("fee", f.id), outcome: worst(e.outcome, routeOutcome), amountPln: f.amountPln, optional: !!f.optional });
  }
  for (const d of p.deadlines) {
    const e = evaluate(d.condition, facts);
    e.missing.forEach((x) => open.add(x));
    if (e.outcome === "does_not_apply") continue;
    const pd: PlanDeadline = { id: d.id, ruleRef: ref("deadline", d.id), outcome: worst(e.outcome, routeOutcome), days: d.days, from: d.from };
    const start = events[d.from];
    if (start) pd.due = byNthDay(start, d.days); // only from a recorded event, never guessed
    out.deadlines.push(pd);
  }
}

/**
 * "Najpóźniej w N dniu od X": whether day X counts as day 1 is not settled in our sources (06 §7 Q3).
 * Both readings are returned; reminders use the earlier one (safe), the UI shows the uncertainty.
 */
export function byNthDay(isoDate: string, n: number): { earliest: string; latest: string } {
  return { earliest: addDays(isoDate, n - 1), latest: addDays(isoDate, n) };
}
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days)); // calendar days, no time-of-day, no DST effects
  return t.toISOString().slice(0, 10);
}

function officeFor(p: Procedure, facts: Answers, open: Set<string>): string {
  for (const v of p.variations) {
    const e = evaluate(v.condition, facts);
    if (e.outcome === "applies") return v.officeRef;
    e.missing.forEach((f) => open.add(f));
  }
  return p.generalOffice.officeRef;
}

const worst = (a: "applies" | "unknown", b: "applies" | "unknown") => (a === "unknown" || b === "unknown" ? "unknown" : "applies");

function hashInputs(t: string, facts: Answers, events: Events, reg: Registry): string {
  const versions = reg.procedures.map((p) => `${p.id}@${p.version}:${p.status}`).sort();
  const s = JSON.stringify([t, Object.entries(facts).sort(), Object.entries(events).sort(), versions]);
  let h = 2166136261; // FNV-1a, enough for a spike (production: sha256)
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return h.toString(16);
}
export type { CaseTemplate };
