// The verified procedure registry, read from Formalka's own content format (snapshots in
// reference/, formalka@04057ef). Read-only: the engine never changes a procedure. Only the fields the
// engine needs are typed; everything is checked at the boundary, and a malformed file fails loudly.
import type { Rule } from "./rules.ts";

export interface L10n { pl: string; en?: string; uk?: string; ru?: string }
export interface Quote { page: string; text: string }
export interface Quoted<T> { value: T; quotes: Quote[] }
export interface Statement { value: L10n; quotes: Quote[] }

export interface Step {
  id: string; title: L10n; description?: L10n; dependsOn?: string[]; channels?: string[];
  officeKind?: string; quotes: Quote[]; condition?: Rule;
}
export interface Doc {
  id: string; condition?: Rule; namePl: Quoted<string>; description: L10n; alternativeTo?: string[];
  form?: string;
}
export interface Fee {
  id: string; purpose: L10n; amountPln: Quoted<number>; optional?: boolean; condition?: Rule;
  exemptions?: { id: string; rule: Rule; statement: Statement }[];
}
export type DeadlineRule =
  | { kind: "relative"; amount: number; unit: "day" | "working_day" | "month" | "year"; from: string }
  | { kind: "fixed"; date: string };
export interface Deadline {
  id: string; condition?: Rule; description: L10n; rule: Quoted<DeadlineRule>; consequence?: Statement;
}
export interface Procedure {
  id: string; title: L10n; summary?: L10n; riskClass?: string; verificationLevel?: string;
  checkedAt?: string; applicability: { rule?: Rule; conditions?: { id: string; rule: Rule; statement: Statement }[] };
  requiredFacts?: string[]; steps: Step[]; documents: Doc[]; fees: Fee[]; deadlines: Deadline[];
  handoff?: { when: L10n; options: unknown[] }; related?: string[];
}
export interface FactOption { value: string; label: L10n }
export interface FactDef {
  key: string; kind: string; question: L10n; whyWeAsk?: L10n; unknownHelp?: L10n; options?: FactOption[];
}
export interface Registry {
  /** Where the content comes from, e.g. "formalka@04057ef"; part of every ruleRef. */
  version: string;
  procedures: Map<string, Procedure>;
  facts: Map<string, FactDef>;
}

function need(cond: unknown, what: string): asserts cond {
  if (!cond) throw new Error(`registry: ${what}`);
}

function checkProcedure(p: Procedure, file: string): Procedure {
  need(typeof p?.id === "string", `${file}: procedure without id`);
  need(p.title?.pl, `${p.id}: no Polish title`);
  for (const k of ["steps", "documents", "fees", "deadlines"] as const) {
    need(Array.isArray(p[k]), `${p.id}: ${k} is not a list`);
  }
  for (const s of p.steps) need(Array.isArray(s.quotes) && s.quotes.length > 0, `${p.id} step ${s.id}: no quote`);
  for (const d of p.documents) need(d.namePl?.quotes?.length, `${p.id} document ${d.id}: no quote`);
  for (const f of p.fees) need(typeof f.amountPln?.value === "number" && f.amountPln.quotes?.length, `${p.id} fee ${f.id}: no quoted amount`);
  for (const d of p.deadlines) need(d.rule?.value?.kind && d.rule.quotes?.length, `${p.id} deadline ${d.id}: no quoted rule`);
  return p;
}

/** Builds a registry from already-parsed content (the browser build embeds it as JSON). */
export function registryFromData(procedureLists: Procedure[][], factLists: FactDef[][], version: string): Registry {
  const procedures = new Map<string, Procedure>();
  const facts = new Map<string, FactDef>();
  for (const list of procedureLists) {
    for (const p of list) {
      need(!procedures.has(p.id), `duplicate procedure ${p.id}`);
      procedures.set(p.id, checkProcedure(p, p.id));
    }
  }
  for (const list of factLists) {
    for (const f of list) {
      need(typeof f?.key === "string" && f.question?.pl, `fact without key or question`);
      facts.set(f.key, f);
    }
  }
  return { version, procedures, facts };
}

/** `procedure@registryVersion:kind:item`: what every plan item points at. */
export const ruleRef = (reg: Registry, procedureId: string, kind: string, id: string) =>
  `${procedureId}@${reg.version}:${kind}:${id}`;
