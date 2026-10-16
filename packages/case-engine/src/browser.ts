// Browser entry: the whole engine plus the registry snapshot and blueprints, as one global
// `FormalkaEngine`. Built by tools/build-browser.mjs; the data comes from reference/ and blueprints/
// at build time, so the page needs no network (ADR-N002: everything runs on the device).
import data from "../dist/data.json" with { type: "json" };
import { agenda, type AgendaInput, DEFAULT_PREFS } from "./advisor.ts";
import { type Blueprint, blueprintFromData, checkBlueprint } from "./blueprint.ts";
import { confirmCandidates, intake, placeCandidate } from "./intake.ts";
import { dayPl, dueRangePl, msg, PHRASES_NEVER } from "./messages.ts";
import { type CasePlan, type CaseState, planCase } from "./planner.ts";
import { nextQuestion } from "./questions.ts";
import { applyReplan, diffPlans } from "./replan.ts";
import { type FactDef, type Institution, type Office, type Procedure, registryFromData } from "./registry.ts";
import { UNKNOWN } from "./rules.ts";
import { validatePlan } from "./validator.ts";

const reg = registryFromData(
  data.procedures as unknown as Procedure[][], data.facts as unknown as FactDef[][], data.version,
  data.offices as unknown as Office[][], data.institutions as unknown as Institution[],
);
const blueprints = new Map<string, Blueprint>(
  Object.entries(data.blueprints).map(([id, b]) => [id, blueprintFromData(b, id)]),
);
for (const [id, b] of blueprints) {
  const issues = checkBlueprint(b, reg);
  if (issues.length) throw new Error(`blueprint ${id}: ${JSON.stringify(issues)}`);
}
const bp = (id: string) => {
  const b = blueprints.get(id);
  if (!b) throw new Error(`unknown blueprint ${id}`);
  return b;
};

export const FormalkaEngine = {
  registryVersion: reg.version,
  builtAt: data.builtAt,
  blueprintIds: [...blueprints.keys()],
  blueprint: bp,
  procedure: (id: string) => reg.procedures.get(id),
  fact: (key: string) => reg.facts.get(key),
  plan: (blueprintId: string, state: CaseState): CasePlan => planCase(bp(blueprintId), reg, state),
  validate: (plan: CasePlan, state: CaseState) => validatePlan(plan, reg, state),
  /** The next question with its official wording, or null when nothing left can change the plan. */
  nextQuestion(blueprintId: string, state: CaseState, asked: number, cap = 12) {
    const key = nextQuestion(bp(blueprintId), reg, state, asked, cap);
    return key ? { key, ...reg.facts.get(key)! } : null;
  },
  /** Fact candidates from the person's own words (on the device); nothing changes until they confirm. */
  intake: (blueprintId: string, text: string, state?: CaseState) => intake(bp(blueprintId), reg, text, state),
  confirmCandidates, placeCandidate,
  /** After approval a change is a proposal: what it would change, by stable ids; done work is never undone. */
  diffPlans, applyReplan,
  agenda: (input: Omit<AgendaInput, "bp"> & { blueprintId: string }) => agenda({ ...input, bp: bp(input.blueprintId) }),
  msg, dayPl, dueRangePl, PHRASES_NEVER, DEFAULT_PREFS, UNKNOWN,
};
(globalThis as unknown as { FormalkaEngine: typeof FormalkaEngine }).FormalkaEngine = FormalkaEngine;
