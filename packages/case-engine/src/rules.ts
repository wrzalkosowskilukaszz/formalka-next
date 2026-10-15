// Three-valued rule evaluation. Mirrors packages/rules/src/evaluate.ts at formalka@504a210
// (same semantics: unknown and unasked facts evaluate to "unknown"; Kleene and/or/not).
export const UNKNOWN = "__unknown__" as const;
export type FactValue = string | boolean;
export type Answers = Readonly<Record<string, FactValue | typeof UNKNOWN>>;
export type Rule =
  | { all: Rule[] }
  | { any: Rule[] }
  | { not: Rule }
  | { fact: string; eq: FactValue }
  | { fact: string; in: FactValue[] }
  | { fact: string; prefix: string }; // TERYT location prefix (spike-only shorthand for place layers)
export type Outcome = "applies" | "does_not_apply" | "unknown";

export function evaluate(rule: Rule | undefined, a: Answers): { outcome: Outcome; missing: string[] } {
  if (!rule) return { outcome: "applies", missing: [] };
  if ("all" in rule) return combine(rule.all.map((r) => evaluate(r, a)), "all");
  if ("any" in rule) return combine(rule.any.map((r) => evaluate(r, a)), "any");
  if ("not" in rule) {
    const c = evaluate(rule.not, a);
    const outcome = c.outcome === "unknown" ? "unknown" : c.outcome === "applies" ? "does_not_apply" : "applies";
    return { outcome, missing: c.missing };
  }
  const v = Object.hasOwn(a, rule.fact) ? a[rule.fact] : undefined;
  if (v === undefined || v === UNKNOWN) return { outcome: "unknown", missing: [rule.fact] };
  const ok = "eq" in rule ? v === rule.eq : "in" in rule ? rule.in.includes(v) : String(v).startsWith(rule.prefix);
  return { outcome: ok ? "applies" : "does_not_apply", missing: [] };
}

function combine(cs: { outcome: Outcome; missing: string[] }[], kind: "all" | "any") {
  const decisive = kind === "all" ? "does_not_apply" : "applies";
  if (cs.some((c) => c.outcome === decisive)) return { outcome: decisive as Outcome, missing: [] };
  if (cs.some((c) => c.outcome === "unknown"))
    return { outcome: "unknown" as Outcome, missing: [...new Set(cs.flatMap((c) => c.missing))] };
  return { outcome: (kind === "all" ? "applies" : "does_not_apply") as Outcome, missing: [] };
}
