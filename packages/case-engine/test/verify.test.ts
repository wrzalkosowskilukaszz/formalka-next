// Content verification (audit F1): a plan with every reference intact but its content changed fails,
// while the structural check alone still passes it. Every mutation below keeps the ruleRefs valid.
import assert from "node:assert/strict";
import { test } from "node:test";
import { runScenarios } from "../eval/run.ts";
import { type CasePlan, type CaseState, loadBlueprint, loadRegistry, planCase, validatePlan, verifyContent } from "../src/index.ts";

const ROOT = new URL("../../../", import.meta.url).pathname;
const reg = loadRegistry(`${ROOT}reference`, "formalka@04057ef");
const bp = (id: string) => loadBlueprint(`${ROOT}blueprints/${id}.yaml`);
const ADDR = bp("address-registration"), RES = bp("residence-card");
const addrState: CaseState = {
  facts: { "zameldowanie.citizen_group": "other", "zameldowanie.stay": "temporary" }, tasks: {}, approved: true,
  events: [{ type: "arrival_at_address", date: "2026-10-28", by: "user" }], place: { teryt: "1465011", name: "Warszawa" },
};
const resState: CaseState = { facts: { "pobyt_czasowy.purpose": "study" }, tasks: {}, events: [] };
const codes = (plan: CasePlan, b = ADDR, st = addrState) => [...new Set(verifyContent(plan, b, reg, st).violations.map((x) => x.code))].sort();
const tamper = (b: typeof ADDR, st: CaseState, edit: (p: CasePlan) => void) => { const p = structuredClone(planCase(b, reg, st)); edit(p); return p; };

test("verify: the engine's own plans pass both checks (each evaluation scenario runs them too)", () => {
  assert.deepEqual(runScenarios().filter((r) => r.failures.some((f) => f.startsWith("content:"))).map((r) => r.id), []);
  assert.deepEqual(verifyContent(planCase(ADDR, reg, addrState), ADDR, reg, addrState).violations, []);
  assert.deepEqual(verifyContent(planCase(RES, reg, resState), RES, reg, resState).violations, []);
});

test("verify: content changed behind valid references is caught; the structural check alone passes it", () => {
  const cases: [string, CasePlan, string[], typeof ADDR?, CaseState?][] = [
    ["fee set to 999 999", tamper(RES, resState, (p) => { p.levels.flatMap((l) => l.fees)[0].amountPln = 999999; }), ["FEE_AMOUNT", "ITEM_CHANGED"], RES, resState],
    ["task renamed", tamper(ADDR, addrState, (p) => { p.levels.flatMap((l) => l.tasks)[0].title = { pl: "Cokolwiek" }; }), ["ITEM_CHANGED"]],
    ["all tasks and fees removed", tamper(RES, resState, (p) => { for (const l of p.levels) { l.tasks = []; l.fees = []; } }), ["ITEM_MISSING"], RES, resState],
    ["invented office", tamper(ADDR, addrState, (p) => {
      const l = p.levels.find((x) => x.office?.offices.length)!;
      l.office!.offices.push({ id: "urzad-wymyslony", name: { pl: "Urząd Wymyślony" }, address: { value: "ul. Nieistniejąca 1", quotes: [] }, source: "office" });
    }), ["ITEM_EXTRA", "OFFICE_NOT_IN_REGISTRY"]],
    ["office address changed", tamper(ADDR, addrState, (p) => { p.levels.find((x) => x.office?.offices.length)!.office!.offices[0].address!.value = "ul. Inna 5"; }), ["ITEM_CHANGED", "OFFICE_ADDRESS"]],
    ["exemption granted without a rule", tamper(RES, resState, (p) => {
      const f = p.levels.flatMap((l) => l.fees).find((x) => x.exemption)!; f.exemption!.outcome = "applies";
    }), ["EXEMPTION_WITHOUT_BASIS", "ITEM_CHANGED"], RES, resState],
    ["due date moved", tamper(ADDR, addrState, (p) => { const d = p.levels.flatMap((l) => l.deadlines).find((x) => x.due)!; d.due = { ...d.due!, latest: "2026-12-31" }; }), ["DEADLINE_DATE", "ITEM_CHANGED"]],
    ["level unlocked", tamper(ADDR, addrState, (p) => { p.levels.find((l) => l.state === "locked")!.state = "available"; }), ["LEVEL_STATE"]],
  ];
  for (const [name, plan, want, b = ADDR, st = addrState] of cases) {
    assert.equal(validatePlan(plan, reg, st).ok, true, `${name}: references stay valid, so structure alone passes`);
    assert.deepEqual(codes(plan, b, st), want, name);
  }
});
