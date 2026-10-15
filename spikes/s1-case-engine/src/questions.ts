// Next question: deterministic, from what the plan still depends on (05 §2).
import { type Answers, evaluate, UNKNOWN } from "./rules.ts";
import type { Registry } from "./types.ts";

const WEIGHT = { route: 10, deadline: 8, document: 6, fee: 4, step: 3, office: 3 } as const;

export function scoreFacts(templateId: string, facts: Answers, reg: Registry): Map<string, number> {
  const t = reg.templates.find((x) => x.id === templateId)!;
  const score = new Map<string, number>();
  const add = (missing: string[], w: number) => {
    for (const f of missing) {
      if (facts[f] === UNKNOWN) continue; // "Nie wiem" is an answer: never asked again in intake
      score.set(f, (score.get(f) ?? 0) + w * (missing.length === 1 ? 1 : 0.5));
    }
  };
  for (const { procedureId, when } of t.procedures) {
    const r = evaluate(when, facts);
    add(r.missing, WEIGHT.route);
    if (r.outcome === "does_not_apply") continue;
    const p = reg.procedures.find((x) => x.id === procedureId);
    if (!p) continue;
    p.steps.forEach((s) => add(evaluate(s.condition, facts).missing, WEIGHT.step));
    p.documents.forEach((d) => add(evaluate(d.condition, facts).missing, WEIGHT.document));
    p.fees.forEach((f) => add(evaluate(f.condition, facts).missing, WEIGHT.fee));
    p.deadlines.forEach((d) => add(evaluate(d.condition, facts).missing, WEIGHT.deadline));
    p.variations.forEach((v) => add(evaluate(v.condition, facts).missing, WEIGHT.office));
  }
  return score;
}

/** The fact to ask next, or null when nothing asked could change the plan (stop criterion B/C). */
export function nextQuestion(templateId: string, facts: Answers, reg: Registry, asked: number, cap = 12): string | null {
  if (asked >= cap) return null;
  const order = reg.facts.map((f) => f.key);
  const ranked = [...scoreFacts(templateId, facts, reg).entries()]
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1] || order.indexOf(a[0]) - order.indexOf(b[0]));
  return ranked[0]?.[0] ?? null;
}
