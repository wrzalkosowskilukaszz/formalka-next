// Replanning after approval (ADR-N003): a change is a diff the person approves; done work is never undone.
import assert from "node:assert/strict";
import { test } from "node:test";
import { applyReplan, type CaseState, diffPlans, loadBlueprint, loadRegistry, planCase, UNKNOWN, validatePlan } from "../src/index.ts";

const ROOT = new URL("../../../", import.meta.url).pathname;
const reg = loadRegistry(`${ROOT}reference`, "formalka@04057ef");
const ADDR = loadBlueprint(`${ROOT}blueprints/address-registration.yaml`);
const CIT = loadBlueprint(`${ROOT}blueprints/citizenship.yaml`);
const DOC = (id: string) => `zameldowanie-foreigner:document:${id}`;
const ids = (xs: { id: string }[]) => xs.map((x) => x.id).sort();
const base: CaseState = {
  facts: { "zameldowanie.citizen_group": "other", "zameldowanie.stay": UNKNOWN },
  tasks: { [DOC("travel-document")]: "done", [DOC("visa")]: "not_needed" }, events: [], approved: true,
  place: { teryt: "1465011", name: "Warszawa" },
};
const withFacts = (facts: CaseState["facts"]): CaseState => ({ ...base, facts: { ...base.facts, ...facts } });

test("replan: a confirmed stay narrows the documents, in words the person can check", () => {
  const before = planCase(ADDR, reg, base), after = planCase(ADDR, reg, withFacts({ "zameldowanie.stay": "temporary" }));
  const d = diffPlans(before, after, base.tasks);
  assert.equal(d.empty, false);
  assert.deepEqual(ids(d.tasks.removed), [DOC("form-permanent"), DOC("permanent-stay-document")]);
  assert.ok(ids(d.tasks.nowCertain).includes(DOC("form-temporary")));
  assert.deepEqual(d.tasks.added, []);
  assert.equal(d.tasks.removed[0].title.pl.length > 0, true, "every item has its plain title");
  for (const p of [before, after]) assert.equal(validatePlan(p, reg, base).ok, true);
});

test("replan: done work stays in the history and is never reset; other statuses of removed tasks are cleared", () => {
  const before = planCase(ADDR, reg, base), after = planCase(ADDR, reg, withFacts({ "zameldowanie.citizen_group": "eu_efta" }));
  const d = diffPlans(before, after, base.tasks);
  assert.deepEqual(ids(d.tasks.keptAsHistory), [DOC("travel-document")]);
  assert.ok(!ids(d.tasks.removed).includes(DOC("travel-document")));
  assert.ok(ids(d.tasks.added).includes(DOC("identity-eu")));
  assert.deepEqual(ids(d.deadlines.added), ["eu-efta"]);
  assert.deepEqual(ids(d.deadlines.removed), ["other-citizens"]);
  const tasks = applyReplan(base.tasks, d);
  assert.equal(tasks[DOC("travel-document")], "done", "done stays done");
  assert.equal(tasks[DOC("visa")], undefined, "a removed task starts fresh if it ever comes back");
  // A tampered diff that lists done work as removed still can't undo it.
  const tampered = { ...d, tasks: { ...d.tasks, removed: [...d.tasks.removed, ...d.tasks.keptAsHistory] } };
  assert.equal(applyReplan(base.tasks, tampered)[DOC("travel-document")], "done");
});

test("replan: no change is an empty diff; a route change is named", () => {
  const p = planCase(ADDR, reg, base);
  assert.equal(diffPlans(p, planCase(ADDR, reg, base), base.tasks).empty, true);
  const facts = {
    "citizenship.ever_polish": "no", "citizenship.permanent_title": "yes", "citizenship.group": "three_years",
    "citizenship.language": "yes", "citizenship.where_lives": "poland_legal",
  };
  const st = (routeChoice: string): CaseState => ({ facts, tasks: {}, events: [], approved: true, routeChoice });
  const d = diffPlans(planCase(CIT, reg, st("citizenship-recognition")), planCase(CIT, reg, st("citizenship-grant")), {});
  assert.deepEqual(d.route, { from: "citizenship-recognition", to: "citizenship-grant" });
  assert.deepEqual(d.fees.removed.map((f) => [f.id, f.amountPln]), [["decision", 1000]]);
});
