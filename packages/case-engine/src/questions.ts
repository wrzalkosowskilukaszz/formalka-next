// What to ask next: the fact that would change the most in the plan, never a fact already answered
// (a "Nie wiem" is an answer). No fixed number of questions: intake stops when nothing left can
// change the plan, or at the cap.
import type { Blueprint } from "./blueprint.ts";
import { factsOf, resolveRoute, type CaseState } from "./planner.ts";
import type { Registry } from "./registry.ts";
import type { Rule } from "./rules.ts";

const WEIGHT = { route: 10, deadline: 8, document: 6, fee: 4, step: 3 } as const;

export function scoreFacts(bp: Blueprint, reg: Registry, state: CaseState): Map<string, number> {
  const score = new Map<string, number>();
  const add = (rule: Rule | undefined, w: number) => {
    if (!rule) return;
    const fs = [...new Set(factsOf(rule))].filter((f) => state.facts[f] === undefined);
    for (const f of fs) score.set(f, (score.get(f) ?? 0) + w / fs.length);
  };
  const route = resolveRoute(bp, reg, state);
  if (route.status === "open") {
    for (const c of route.candidates) {
      if (c.outcome !== "unknown") continue;
      const p = reg.procedures.get(c.procedureId)!;
      add(p.applicability.rule, WEIGHT.route);
      for (const cond of p.applicability.conditions ?? []) add(cond.rule, WEIGHT.route);
    }
  } else if (route.status === "decided") {
    const p = reg.procedures.get(route.procedureId!)!;
    p.documents.forEach((d) => add(d.condition, WEIGHT.document));
    p.fees.forEach((f) => {
      add(f.condition, WEIGHT.fee);
      f.exemptions?.forEach((x) => add(x.rule, WEIGHT.fee));
    });
    p.deadlines.forEach((d) => add(d.condition, WEIGHT.deadline));
    p.steps.forEach((s) => add(s.condition, WEIGHT.step));
  }
  // "choice", "unsure", "none": no question can settle it; the user chooses or is handed off.
  return score;
}

/** The fact to ask next, or null when no answer could change the plan (or the cap is reached). */
export function nextQuestion(bp: Blueprint, reg: Registry, state: CaseState, asked: number, cap = 12): string | null {
  if (asked >= cap) return null;
  const order = bp.routes.flatMap((r) => reg.procedures.get(r)?.requiredFacts ?? []);
  const rank = (f: string) => (order.includes(f) ? order.indexOf(f) : order.length);
  const ranked = [...scoreFacts(bp, reg, state)].filter(([f, s]) => s > 0 && reg.facts.has(f))
    .sort((a, b) => b[1] - a[1] || rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]));
  return ranked[0]?.[0] ?? null;
}
