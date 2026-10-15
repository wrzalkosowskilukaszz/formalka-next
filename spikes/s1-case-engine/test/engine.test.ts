// Spike S1 tests. Scenario ids refer to docs/formalka-next/test-scenarios/scenarios.yaml.
import assert from "node:assert/strict";
import { test } from "node:test";
import { applyApproved, diff, type TaskStatus } from "../src/diff.ts";
import { registry } from "../src/fixture.ts";
import { addDays, byNthDay, plan } from "../src/planner.ts";
import { nextQuestion } from "../src/questions.ts";
import { reminders } from "../src/reminders.ts";
import { type Answers, evaluate, UNKNOWN } from "../src/rules.ts";
import type { Plan, Registry } from "../src/types.ts";
import { validate } from "../src/validator.ts";

const T = "arrive-register-address";
const G = "zameldowanie.citizen_group", S = "zameldowanie.stay", R = "zameldowanie.can_register";
const reg01: Answers = { [G]: "other", [S]: "temporary", location: "1261011", [R]: "yes" }; // Kraków, visa-free
const ids = (p: Plan) => p.tasks.map((t) => t.id);
const docIds = (p: Plan) => p.documents.map((d) => d.id).sort();
const clone = <T>(x: T): T => structuredClone(x);

test("rules: three-valued, Kleene and/or, unknown is never a match", () => {
  assert.equal(evaluate({ all: [{ fact: G, eq: "eu_efta" }, { fact: S, eq: "x" }] }, { [G]: "other" }).outcome, "does_not_apply");
  assert.deepEqual(evaluate({ all: [{ fact: G, eq: "other" }, { fact: S, eq: "temporary" }] }, { [G]: "other" }), { outcome: "unknown", missing: [S] });
  assert.equal(evaluate({ any: [{ fact: G, eq: "other" }, { fact: S, eq: "x" }] }, { [G]: "other" }).outcome, "applies");
  assert.equal(evaluate({ not: { fact: G, eq: "eu_efta" } }, { [G]: UNKNOWN }).outcome, "unknown");
  assert.equal(evaluate({ fact: "location", prefix: "1261" }, { location: "1261011" }).outcome, "applies");
});

test("reg-01: the plan has every task in order, each with a ruleRef, and passes the validator", () => {
  const p = plan(T, reg01, { move_in_date_set: "2026-10-28" }, registry);
  assert.deepEqual(ids(p), ["zameldowanie-foreigner:fill-in", "zameldowanie-foreigner:owner-confirms", "zameldowanie-foreigner:file", "zameldowanie-foreigner:registered"]);
  assert.ok(p.tasks.every((t) => /^zameldowanie-foreigner@10:step:/.test(t.ruleRef) && t.outcome === "applies"));
  assert.deepEqual(docIds(p), ["form-temporary", "lease", "owner-title", "travel-document", "visa", "visa-free-or-waiting"]);
  assert.equal(p.documents.find((d) => d.id === "visa-free-or-waiting")?.disputed, true);
  assert.deepEqual(p.documents.find((d) => d.id === "visa")?.alternatives, ["visa-free-or-waiting"]);
  assert.deepEqual(p.deadlines.map((d) => [d.id, d.days, d.due]), [["other-citizens", 4, { earliest: "2026-10-31", latest: "2026-11-01" }]]);
  assert.equal(p.tasks.find((t) => t.kind === "visit")?.officeRef, "office:krakow-by-district");
  assert.deepEqual(p.fees.map((f) => [f.id, f.amountPln, f.optional]), [["free", 0, false], ["temporary-certificate", 17, true]]);
  assert.deepEqual(p.openFacts, []);
  assert.deepEqual(validate(p, registry, reg01, { move_in_date_set: "2026-10-28" }), { status: "pass", violations: [] });
});

test("determinism: same inputs give the same plan and hash; fact order does not matter", () => {
  const a = plan(T, reg01, {}, registry);
  const reordered: Answers = Object.fromEntries(Object.entries(reg01).reverse());
  assert.deepEqual(plan(T, reordered, {}, registry), a);
  const bumped: Registry = clone(registry);
  bumped.procedures[0].version = 11;
  assert.notEqual(plan(T, reg01, {}, bumped).inputsHash, a.inputsHash, "a new registry version changes the hash");
});

test("no confirmed move-in date: no due date and no reminder (dates are never guessed)", () => {
  const p = plan(T, reg01, {}, registry);
  assert.equal(p.deadlines[0].due, undefined);
  assert.deepEqual(reminders("c1", p), []);
});

test("reg-02: 'Nie wiem' keeps both deadline branches, marked unknown, and no reminder fires", () => {
  const facts: Answers = { [G]: UNKNOWN, [S]: "temporary", location: "1261011", [R]: "yes" };
  const p = plan(T, facts, { move_in_date_set: "2026-10-28" }, registry);
  assert.deepEqual(p.deadlines.map((d) => [d.id, d.outcome]).sort(), [["eu-efta", "unknown"], ["other-citizens", "unknown"]]);
  assert.ok(p.openFacts.includes(G));
  assert.deepEqual(reminders("c1", p), []);
  assert.equal(nextQuestion(T, facts, registry, 4), null, "a 'Nie wiem' answer is not asked again");
});

test("questions: what changes the plan most comes first; stop when nothing left can change it", () => {
  const asked: string[] = [];
  const facts: Record<string, string> = {};
  const answers: Record<string, string> = { [G]: "other", [S]: "temporary", [R]: "yes", location: "1465011" };
  for (let q = nextQuestion(T, facts, registry, 0); q; q = nextQuestion(T, facts, registry, asked.length)) {
    asked.push(q);
    facts[q] = answers[q];
  }
  assert.deepEqual(asked, [G, S, R, "location"]);
  assert.ok(!asked.includes("personal.surname"), "identifying facts are never asked by intake");
  assert.equal(nextQuestion(T, {}, registry, 12), null, "the cap stops intake");
});

test("adv-02: the validator rejects a value outside the catalogue (e.g. a nationality guessed from language)", () => {
  const facts: Answers = { ...reg01, [G]: "russian" };
  const r = validate(plan(T, facts, {}, registry), registry, facts, {});
  assert.ok(r.violations.some((v) => v.code === "FACT_VALUE_NOT_ALLOWED" && v.itemId === G));
});

test("validator: an injected task, a fabricated due date, an unknown fact and identifying data all fail", () => {
  const p = plan(T, reg01, {}, registry);
  p.tasks.push({ id: "llm:pay-fee", kind: "pay", deps: [], ruleRef: "", outcome: "applies" });
  p.tasks.push({ id: "llm:extra", kind: "visit", deps: ["llm:missing"], ruleRef: "zameldowanie-foreigner@10:step:invented", outcome: "applies" });
  p.deadlines[0].due = { earliest: "2027-01-01", latest: "2027-01-01" };
  const facts: Answers = { ...reg01, "zameldowanie.deadline_days": "60", "personal.surname": "Kowalska" };
  const codes = validate(p, registry, facts, {}).violations.map((v) => `${v.code}:${v.itemId}`).sort();
  assert.deepEqual(codes, [
    "DEADLINE_WITHOUT_BASIS:other-citizens",
    "FACT_NOT_IN_CATALOGUE:zameldowanie.deadline_days",
    "IDENTIFYING_FACT:personal.surname",
    "NO_RULE_REF:llm:extra",
    "NO_RULE_REF:llm:pay-fee",
    "UNKNOWN_DEPENDENCY:llm:extra",
  ]);
});

test("validator: a cycle and a withdrawn procedure version fail", () => {
  const p = plan(T, reg01, {}, registry);
  p.tasks[0].deps = ["zameldowanie-foreigner:registered"];
  assert.ok(validate(p, registry, reg01, {}).violations.some((v) => v.code === "CYCLE"));
  const withdrawn: Registry = clone(registry);
  withdrawn.procedures[0].status = "withdrawn";
  const codes = new Set(validate(plan(T, reg01, {}, registry), withdrawn, reg01, {}).violations.map((v) => v.code));
  assert.deepEqual([...codes], ["RULE_WITHDRAWN"]);
  assert.deepEqual(plan(T, reg01, {}, withdrawn).tasks, [], "the planner itself never plans from a withdrawn version");
});

test("reg-03: changing the city changes only the office of the visit task", () => {
  const before = plan(T, reg01, {}, registry);
  const after = plan(T, { ...reg01, location: "1465011" }, {}, registry);
  const d = diff(before, after, { "zameldowanie-foreigner:fill-in": "done" }, "location changed");
  assert.deepEqual(d.changed, [{ id: "zameldowanie-foreigner:file", field: "office", from: "office:krakow-by-district", to: "office:warszawa-any-delegatura" }]);
  assert.deepEqual([d.added, d.notNeeded, d.keptAsHistory, d.documents.added, d.documents.removed], [[], [], [], [], []]);
});

test("reg-04: changing the stay type swaps documents; the done task stays done", () => {
  const before = plan(T, reg01, {}, registry);
  const after = plan(T, { ...reg01, [S]: "permanent" }, {}, registry);
  const d = diff(before, after, { "zameldowanie-foreigner:fill-in": "done" }, "stay changed");
  assert.deepEqual(d.documents.removed.sort(), ["form-temporary", "visa", "visa-free-or-waiting"]);
  assert.deepEqual(d.documents.added.sort(), ["form-permanent", "permanent-stay-document"]);
  assert.deepEqual([d.added, d.notNeeded, d.changed], [[], [], []]);
});

test("route change: done work is kept as history, open work becomes not needed only on approval", () => {
  const before = plan(T, reg01, {}, registry);
  const after = plan(T, { ...reg01, [R]: "no" }, {}, registry);
  const status: Record<string, TaskStatus> = { "zameldowanie-foreigner:fill-in": "done", "zameldowanie-foreigner:owner-confirms": "in_progress" };
  const d = diff(before, after, status, "cannot register");
  assert.deepEqual(d.added, ["pesel-application:apply"]);
  assert.deepEqual(d.keptAsHistory, ["zameldowanie-foreigner:fill-in"]);
  assert.deepEqual(d.mayNoLongerBeNeeded, ["zameldowanie-foreigner:owner-confirms"]);
  assert.deepEqual(d.notNeeded.map((x) => x.id), ["zameldowanie-foreigner:file", "zameldowanie-foreigner:registered"]);
  const next = applyApproved(status, d);
  assert.equal(next["zameldowanie-foreigner:fill-in"], "done");
  assert.equal(next["zameldowanie-foreigner:owner-confirms"], "in_progress", "the user decides about work in progress");
  assert.equal(next["zameldowanie-foreigner:file"], "not_needed");
  const tampered = { ...d, notNeeded: [{ id: "zameldowanie-foreigner:fill-in", reason: "tampered diff" }] };
  assert.equal(applyApproved(status, tampered)["zameldowanie-foreigner:fill-in"], "done", "even a bad diff cannot undo done work");
});

test("reminders: the day before the earliest reading, 09:00 Warsaw, generic text, stable ids", () => {
  const p = plan(T, reg01, { move_in_date_set: "2026-10-28" }, registry);
  const [r, ...rest] = reminders("case-1", p);
  assert.equal(rest.length, 0);
  assert.equal(r.fireAt, "2026-10-30T09:00:00 Europe/Warsaw");
  assert.equal(r.text, "Formalka: masz jutro jedno zadanie");
  assert.ok(!/zameld|meld|pesel/i.test(r.text), "nothing on the lock screen names the procedure");
  assert.deepEqual(reminders("case-1", plan(T, reg01, { move_in_date_set: "2026-10-28" }, registry)), [r], "rescheduling is idempotent");
  const moved = reminders("case-1", plan(T, reg01, { move_in_date_set: "2026-10-29" }, registry));
  assert.notEqual(moved[0].id, r.id, "a new move-in date replaces the reminder");
});

test("byNthDay: both readings, across month ends, leap days and the DST change", () => {
  assert.deepEqual(byNthDay("2026-10-28", 4), { earliest: "2026-10-31", latest: "2026-11-01" });
  assert.deepEqual(byNthDay("2028-02-27", 4), { earliest: "2028-03-01", latest: "2028-03-02" });
  assert.deepEqual(byNthDay("2026-10-24", 4), { earliest: "2026-10-27", latest: "2026-10-28" }); // DST ends 25 Oct 2026
  assert.deepEqual(byNthDay("2026-12-15", 30), { earliest: "2027-01-13", latest: "2027-01-14" });
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
});
