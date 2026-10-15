import type { Rule } from "./rules.ts";

export interface Quote { page: string; text: string }
export interface Item { id: string; condition?: Rule; quotes: Quote[] }
export interface Step extends Item { dependsOn: string[]; kind: TaskKind }
export interface Doc extends Item { alternativeTo?: string[]; disputed?: boolean }
export interface Fee extends Item { amountPln: number; optional?: boolean }
export interface Deadline extends Item { days: number; from: EventType }
export interface Variation extends Item { officeRef: string }
export type TaskKind = "prepare" | "get_document" | "fill_form" | "visit" | "pay" | "wait" | "respond" | "decide";
export type EventType = "move_in_date_set";

export interface Procedure {
  id: string; version: number; status: "published" | "withdrawn";
  route?: Rule; steps: Step[]; documents: Doc[]; fees: Fee[]; deadlines: Deadline[];
  variations: Variation[]; generalOffice: Item & { officeRef: string };
  produces?: { fact: string; value: string; quote: Quote }[];
}
export interface FactDef { key: string; options: string[]; identifying?: boolean }
export interface CaseTemplate { id: string; procedures: { procedureId: string; when?: Rule }[] }
export interface Registry { facts: FactDef[]; procedures: Procedure[]; templates: CaseTemplate[] }

export type RuleRef = string; // `${procedureId}@${version}:${kind}:${itemId}`
export interface PlanTask { id: string; kind: TaskKind; deps: string[]; officeRef?: string; ruleRef: RuleRef; outcome: "applies" | "unknown" }
export interface PlanItem { id: string; ruleRef: RuleRef; outcome: "applies" | "unknown"; disputed?: boolean; alternatives?: string[] }
export interface PlanDeadline extends PlanItem { days: number; from: EventType; due?: { earliest: string; latest: string } }
export interface Plan {
  templateId: string; inputsHash: string;
  tasks: PlanTask[]; documents: PlanItem[]; fees: (PlanItem & { amountPln: number; optional: boolean })[];
  deadlines: PlanDeadline[]; openFacts: string[];
}
export interface Events { move_in_date_set?: string } // ISO date (Europe/Warsaw calendar day), user-confirmed
