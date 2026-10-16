// Case engine v2 tests over the real registry snapshots (reference/, formalka@04057ef).
import assert from "node:assert/strict";
import { test } from "node:test";
import { runScenarios } from "../eval/run.ts";
import {
  addMonths, agenda, type AgendaItem, type Blueprint, type CaseState, checkBlueprint, DEFAULT_PREFS, dueDate,
  easter, loadBlueprint, loadRegistry, msg, nextQuestion, nextWorkingDayIfClosed, outOfQuiet, PHRASES_NEVER,
  planCase, polishHolidays, UNKNOWN, validatePlan,
} from "../src/index.ts";

const ROOT = new URL("../../../", import.meta.url).pathname;
const reg = loadRegistry(`${ROOT}reference`, "formalka@04057ef");
const bp = (id: string) => loadBlueprint(`${ROOT}blueprints/${id}.yaml`);
const CIT = bp("citizenship"), ADDR = bp("address-registration"), LANG = bp("language-certificate");
const S = (facts: CaseState["facts"], more: Partial<CaseState> = {}): CaseState => ({ facts, tasks: {}, events: [], ...more });
const RESIDENT = {
  "citizenship.permanent_title": "yes", "citizenship.group": "three_years",
  "citizenship.ever_polish": "no", "citizenship.where_lives": "poland_legal",
};
const state = (p: ReturnType<typeof planCase>) => Object.fromEntries(p.levels.map((l) => [l.id, l.state]));

test("blueprints: every step, document, fee and deadline lands on exactly one level", () => {
  for (const b of [CIT, ADDR, LANG]) assert.deepEqual(checkBlueprint(b, reg), [], b.id);
  const broken: Blueprint = structuredClone(CIT);
  delete broken.levels[1].steps!["citizenship-grant"];
  delete broken.deadlines.appeal;
  const codes = checkBlueprint(broken, reg).map((i) => i.code).sort();
  assert.deepEqual(codes, ["DEADLINE_NOT_PLACED", "FEES_NOT_PLACED_ONCE", "STEP_NOT_PLACED"]);
});

test("route: asks while a route is unsettled; a choice is the user's; Nie wiem leaves it unsure", () => {
  assert.equal(planCase(CIT, reg, S({})).route.status, "open");
  const both = planCase(CIT, reg, S({ ...RESIDENT, "citizenship.language": "yes" }));
  assert.equal(both.route.status, "choice", "recognition and grant both fit: the engine never picks");
  const noCert = planCase(CIT, reg, S({ ...RESIDENT, "citizenship.language": "no" }));
  assert.equal(noCert.route.status, "choice");
  const rec = noCert.route.candidates.find((c) => c.procedureId === "citizenship-recognition")!;
  assert.equal(rec.outcome, "reachable");
  assert.equal(rec.via?.[0].blueprint, "language-certificate");
  const unsure = planCase(CIT, reg, S({ ...RESIDENT, "citizenship.language": UNKNOWN, "citizenship.ever_polish": UNKNOWN }));
  assert.equal(unsure.route.status, "unsure");
  const none = planCase(CIT, reg, S({ "citizenship.permanent_title": "no", "citizenship.ever_polish": "yes" }));
  assert.equal(none.route.status, "none");
});

test("map: the certificate runs alongside the documents; submitting waits for both", () => {
  const p = planCase(CIT, reg, S({ ...RESIDENT, "citizenship.language": "no" }, { routeChoice: "citizenship-recognition" }));
  assert.equal(p.route.status, "decided");
  assert.deepEqual(state(p), {
    route: "done", "prerequisite:polish-language": "available", documents: "available",
    payment: "locked", filing: "locked", decision: "locked",
  });
  const docs = p.levels.find((l) => l.id === "documents")!;
  assert.deepEqual(docs.parallelWith, ["prerequisite:polish-language"]);
  assert.deepEqual(p.levels.find((l) => l.id === "filing")!.dependsOn, ["payment", "prerequisite:polish-language"]);
  assert.match(p.levels.find((l) => l.id === "filing")!.reason!.text.pl, /Opłata, Certyfikat z polskiego/);
  const proof = docs.tasks.find((t) => t.id.endsWith("language-proof"))!;
  assert.equal(proof.crossCase?.blueprint, "language-certificate");
  assert.deepEqual(validatePlan(p, reg, S({ ...RESIDENT, "citizenship.language": "no" })), { ok: true, violations: [] });
});

test("map: fees and their source; the recognition fee is quoted", () => {
  const p = planCase(CIT, reg, S({ ...RESIDENT, "citizenship.language": "yes" }, { routeChoice: "citizenship-recognition" }));
  const fee = p.levels.find((l) => l.id === "payment")!.fees[0];
  assert.equal(fee.amountPln, 1000);
  assert.match(fee.quotes[0].text, /1000 zł/);
  const child = planCase(CIT, reg, S({ "citizenship.permanent_title": "yes", "citizenship.group": "minor_child", "citizenship.ever_polish": "no", "citizenship.where_lives": "poland_legal" }, { routeChoice: "citizenship-recognition" }));
  assert.equal(child.levels.find((l) => l.id === "payment")!.fees[0].exemption?.outcome, "applies");
});

test("events: filing starts the office's time; a refusal opens the appeal level with dates", () => {
  const facts = { ...RESIDENT, "citizenship.language": "yes" };
  const done = {
    "citizenship-recognition:document:application": "done", "citizenship-recognition:document:photos": "done",
    "citizenship-recognition:document:language-proof": "done", "citizenship-recognition:document:translations": "not_needed",
    "citizenship-recognition:step:pay": "done",
  } as const;
  const filed = S(facts, { routeChoice: "citizenship-recognition", tasks: { ...done }, events: [{ type: "filing", date: "2026-11-30", by: "user" }] });
  const p1 = planCase(CIT, reg, filed);
  assert.equal(state(p1).decision, "waiting_office");
  const office = p1.levels.find((l) => l.id === "decision")!.deadlines[0];
  assert.deepEqual([office.role, office.due?.earliest, office.due?.latest], ["office", "2027-05-30", "2027-05-31"]); // Sunday → Monday
  const refused = { ...filed, events: [...filed.events, { type: "decision_delivered", date: "2027-05-20", outcome: "refused", by: "user" as const }] };
  const p2 = planCase(CIT, reg, refused);
  const after = p2.levels.find((l) => l.id === "after-refusal")!;
  assert.deepEqual(after.deadlines.map((d) => [d.id, d.due?.latest]), [["appeal", "2027-06-03"], ["court", "2027-06-21"]]);
  const granted = { ...filed, events: [...filed.events, { type: "decision_delivered", date: "2027-05-20", outcome: "granted", by: "user" as const }] };
  assert.equal(planCase(CIT, reg, granted).levels.some((l) => l.id === "after-refusal"), false);
});

test("returned: a request to fill gaps sends the documents back until the fix is submitted", () => {
  const facts = { "citizenship.permanent_title": "no", "citizenship.ever_polish": "no", "citizenship.where_lives": "poland_legal" };
  const base = S(facts, { events: [{ type: "filing", date: "2026-12-01", by: "user" }, { type: "request_delivered", date: "2027-02-10", by: "evidence" }] });
  const p = planCase(CIT, reg, base);
  assert.equal(p.route.procedureId, "citizenship-grant");
  const docs = p.levels.find((l) => l.id === "documents")!;
  assert.equal(docs.state, "returned");
  assert.equal(docs.deadlines.find((d) => d.id === "fix-gaps")?.due?.earliest, "2027-03-12");
  assert.equal(state(p).decision, "waiting_office");
  const fixed = planCase(CIT, reg, { ...base, events: [...base.events, { type: "fix_submitted", date: "2027-02-20", by: "user" }] });
  assert.notEqual(fixed.levels.find((l) => l.id === "documents")!.state, "returned");
});

test("questions: only what can change the plan; never twice; Nie wiem counts as an answer", () => {
  const asked: string[] = [];
  const facts: Record<string, string> = {};
  const answers: Record<string, string> = { ...RESIDENT, "citizenship.language": "no" };
  for (let q = nextQuestion(CIT, reg, S(facts), 0); q; q = nextQuestion(CIT, reg, S(facts), asked.length)) {
    assert.ok(!asked.includes(q), `asked twice: ${q}`);
    asked.push(q);
    facts[q] = answers[q] ?? UNKNOWN;
  }
  assert.ok(asked.length <= 5, `asked ${asked.length}`);
  assert.ok(asked.indexOf("citizenship.permanent_title") < asked.indexOf("citizenship.group"), `content order kept: ${asked.join(" > ")}`);
  assert.equal(planCase(CIT, reg, S(facts)).route.status, "choice");
  assert.equal(nextQuestion(CIT, reg, S({}), 12), null, "cap");
  assert.notEqual(nextQuestion(CIT, reg, S({ "citizenship.permanent_title": UNKNOWN })), "citizenship.permanent_title");
});

test("address registration (D-01): EU 30 days, others 4; both readings of the nth day", () => {
  const arrive = { events: [{ type: "arrival_at_address", date: "2026-10-28", by: "user" as const }] };
  const eu = planCase(ADDR, reg, S({ "zameldowanie.citizen_group": "eu_efta", "zameldowanie.stay": "temporary" }, arrive));
  const other = planCase(ADDR, reg, S({ "zameldowanie.citizen_group": "other", "zameldowanie.stay": "temporary" }, arrive));
  const due = (p: ReturnType<typeof planCase>) => p.levels.flatMap((l) => l.deadlines).map((d) => [d.id, d.due?.earliest, d.due?.latest]);
  assert.deepEqual(due(eu), [["eu-efta", "2026-11-26", "2026-11-27"]]);
  assert.deepEqual(due(other), [["other-citizens", "2026-10-31", "2026-11-01"]]);
  const unknown = planCase(ADDR, reg, S({ "zameldowanie.citizen_group": UNKNOWN, "zameldowanie.stay": "temporary" }, arrive));
  assert.deepEqual(unknown.levels.flatMap((l) => l.deadlines).map((d) => d.outcome), ["unknown", "unknown"]);
  assert.deepEqual(unknown.unsure.map((u) => u.fact), ["zameldowanie.citizen_group"]);
});

test("validator: tampered refs, invented dates, guessed nationality, locks without basis", () => {
  const st = S({ ...RESIDENT, "citizenship.language": "no" }, { routeChoice: "citizenship-recognition" });
  const p = planCase(CIT, reg, st);
  p.levels[2].tasks[0].ruleRef = "citizenship-recognition@formalka@04057ef:document:invented";
  p.levels[4].deadlines.push({ ...p.levels[5].deadlines[0], id: "invented", ruleRef: "citizenship-recognition@formalka@04057ef:deadline:invented", due: { earliest: "2027-01-01", latest: "2027-01-01", counting: "kpa" } });
  p.levels[3].reason = undefined;
  const bad = { ...st, facts: { ...st.facts, "citizenship.group": "ukrainian" } };
  const codes = validatePlan(p, reg, bad).violations.map((v) => v.code).sort();
  assert.deepEqual(codes, ["DATE_WITHOUT_EVENT", "FACT_VALUE_NOT_ALLOWED", "LOCK_WITHOUT_BASIS", "NO_RULE_REF", "NO_RULE_REF"]);
});

test("dates: Easter, holidays, month ends, KPA shift and the two nth-day readings", () => {
  assert.equal(easter(2026), "2026-04-05");
  assert.equal(easter(2027), "2027-03-28");
  assert.ok(polishHolidays(2026).has("2026-06-04"), "Corpus Christi 2026");
  assert.ok(polishHolidays(2026).has("2026-12-24"));
  assert.equal(addMonths("2026-08-31", 6), "2027-02-28");
  assert.equal(addMonths("2027-08-31", 6), "2028-02-29");
  assert.equal(nextWorkingDayIfClosed("2026-11-11"), "2026-11-12");
  assert.equal(nextWorkingDayIfClosed("2026-12-24"), "2026-12-28");
  assert.deepEqual(dueDate("2026-10-28", 4, "day", "nth-day"), { earliest: "2026-10-31", latest: "2026-11-01", counting: "nth-day" });
  assert.deepEqual(dueDate("2026-10-27", 14, "day", "kpa"), { earliest: "2026-11-10", latest: "2026-11-10", counting: "kpa" });
});

// ——— the advisor ———
const ACTIVE = { approved: true };
const NOW = { date: "2026-10-28", time: "12:00" };
const CONSENT = { ...DEFAULT_PREFS, consent: true };
function addressAgenda(extra: Partial<CaseState> = {}, prefs = CONSENT, now = NOW) {
  const st = S({ "zameldowanie.citizen_group": "other", "zameldowanie.stay": "temporary" },
    { ...ACTIVE, events: [{ type: "arrival_at_address", date: "2026-10-28", by: "user" }], ...extra });
  return agenda({ caseId: "c1", bp: ADDR, plan: planCase(ADDR, reg, st), state: st, prefs, now });
}
const allText = (items: AgendaItem[]) => items.map((i) => `${i.message.pl} ${i.lockScreen}`).join("\n").toLowerCase();

test("dates: the rules as quoted from KPA art. 57 and the act on days off work (verified 2026-10-16)", () => {
  // §1: the event day doesn't count; §4: an end on a Saturday moves to the next working day.
  assert.deepEqual(dueDate("2026-10-03", 14, "day", "kpa"), { earliest: "2026-10-17", latest: "2026-10-19", counting: "kpa", shifted: true });
  // §3: no such day in the last month, so its last day; §3a: 29 February a year on ends on 28 February.
  assert.equal(dueDate("2026-01-31", 1, "month", "kpa").earliest, "2026-02-28");
  assert.equal(dueDate("2028-02-29", 1, "year", "kpa").earliest, "2029-02-28");
  // Art. 1: 13 named days plus 24 December from 1 February 2025; Sundays by the weekday.
  assert.equal(polishHolidays(2024).size, 13);
  assert.ok(!polishHolidays(2024).has("2024-12-24"));
  assert.equal(polishHolidays(2026).size, 14);
  assert.ok(polishHolidays(2026).has("2026-05-24"), "Pentecost Sunday 2026");
  assert.equal(nextWorkingDayIfClosed("2026-10-18"), "2026-10-19", "Sunday");
});

test("advisor: a draft plan does nothing; an approved one plans the deadline by itself", () => {
  const st = S({ "zameldowanie.citizen_group": "other", "zameldowanie.stay": "temporary" }, { events: [{ type: "arrival_at_address", date: "2026-10-28", by: "user" }] });
  assert.deepEqual(agenda({ caseId: "c1", bp: ADDR, plan: planCase(ADDR, reg, st), state: st, prefs: CONSENT, now: NOW }), []);
  const items = addressAgenda();
  assert.deepEqual(items.map((i) => [i.kind, i.fireAt, i.channel]), [
    ["deadline_warning", "2026-10-29T09:00", "notification"],
    ["deadline_today", "2026-10-31T09:00", "notification"],
  ]);
  assert.match(items[0].message.pl, /31 października/);
});

test("advisor: a deadline that may not apply never notifies; no consent keeps all in the app", () => {
  const st = S({ "zameldowanie.citizen_group": UNKNOWN, "zameldowanie.stay": "temporary" }, { ...ACTIVE, events: [{ type: "arrival_at_address", date: "2026-10-28", by: "user" }] });
  assert.deepEqual(agenda({ caseId: "c1", bp: ADDR, plan: planCase(ADDR, reg, st), state: st, prefs: CONSENT, now: NOW }), []);
  assert.ok(addressAgenda({}, DEFAULT_PREFS).every((i) => i.channel === "in_app"));
});

test("advisor: a planned visit gets preparation, the morning and a follow-up; quiet hours hold", () => {
  const items = addressAgenda({ events: [
    { type: "arrival_at_address", date: "2026-10-28", by: "user" },
    { type: "visit_planned", date: "2026-10-30", time: "18:30", level: "file", by: "user" },
  ] });
  const kinds = items.map((i) => [i.kind, i.fireAt, i.channel]);
  assert.deepEqual(kinds, [
    ["deadline_warning", "2026-10-29T09:00", "notification"],
    ["visit_prep", "2026-10-29T18:00", "notification"],
    ["visit_morning", "2026-10-30T08:00", "notification"],
    ["follow_up", "2026-10-31T08:00", "in_app"], // 21:30 is quiet; the morning after, one-a-day keeps the deadline
    ["deadline_today", "2026-10-31T09:00", "notification"],
  ]);
  const prep = items.find((i) => i.kind === "visit_prep")!;
  assert.match(prep.message.pl, /Weź ze sobą/);
  assert.match(prep.message.pl, /ważny dokument podróży|dokument podróży/i);
  assert.deepEqual(items.find((i) => i.kind === "follow_up")!.answers?.map((a) => a.id), ["filed", "missing", "not_went"]);
});

test("advisor: stable ids, generic lock screen, and never a claim of booking, sending or filing", () => {
  const a = addressAgenda(), b = addressAgenda();
  assert.deepEqual(a.map((i) => i.id), b.map((i) => i.id));
  assert.ok(a.every((i) => !/zameld/i.test(i.lockScreen)), "no topic on the lock screen by default");
  const detailed = addressAgenda({}, { ...CONSENT, lockScreenDetail: true });
  assert.match(detailed[0].lockScreen, /Zameldowanie/);
  const samples = [
    allText(addressAgenda({ events: [{ type: "arrival_at_address", date: "2026-10-28", by: "user" }, { type: "visit_planned", date: "2026-10-30", time: "10:00", level: "file", by: "user" }, { type: "call_planned", date: "2026-10-29", time: "12:00", level: "file", by: "user" }] })),
    msg.intro("Maciek", "Obywatelstwo polskie"), msg.planReady(0), msg.planReady(2), msg.cannotBook(),
    msg.reminderAdded("2026-10-29", "12:00", "call"), msg.nudge("Obywatelstwo", "Dokumenty"), msg.ruleChange("Uznanie"),
  ].join("\n").toLowerCase();
  for (const phrase of PHRASES_NEVER.filter((p) => p !== "masz umówioną wizytę")) assert.ok(!samples.includes(phrase), phrase);
  assert.match(msg.reminderAdded("2026-10-29", "12:00", "call"), /Wizyta nie jest jeszcze zarezerwowana/);
  assert.match(msg.intro("Maciek", "Obywatelstwo polskie"), /asystent AI/);
  // Formalka's copy rule V13: no exclamation marks. And no promise the registry can't keep: it has no phone numbers.
  assert.ok(!samples.includes("!"), "no exclamation marks");
  assert.match(samples, /pora zadzwonić/, "the call reminder is among the samples");
  assert.match(samples, /numeru telefonu urzędu nie mamy w naszych źródłach/);
});

test("advisor: the office's time passing is told once, as information; a quiet week gets a nudge", () => {
  const facts = { ...RESIDENT, "citizenship.language": "yes" };
  const st = S(facts, { ...ACTIVE, routeChoice: "citizenship-recognition", events: [{ type: "filing", date: "2026-11-30", by: "user" }] });
  const plan = planCase(CIT, reg, st);
  const items = agenda({ caseId: "c2", bp: CIT, plan, state: st, prefs: CONSENT, now: { date: "2027-01-10", time: "12:00" }, lastActivity: "2026-12-01" });
  const passed = items.find((i) => i.kind === "office_deadline_passed")!;
  assert.equal(passed.fireAt, "2027-06-01T09:00");
  assert.doesNotMatch(passed.message.pl, /musisz|odwołaj/i);
  assert.ok(!items.some((i) => i.kind === "nudge"), "after filing nothing is the user's to do: no nudge");
  const idle = S(facts, { ...ACTIVE, routeChoice: "citizenship-recognition" });
  const idleItems = agenda({ caseId: "c2", bp: CIT, plan: planCase(CIT, reg, idle), state: idle, prefs: CONSENT, now: { date: "2027-01-10", time: "12:00" }, lastActivity: "2026-12-01" });
  assert.deepEqual(idleItems.map((i) => [i.kind, i.fireAt]), [["nudge", "2027-01-11T10:00"]]);
  assert.equal(outOfQuiet("2026-10-30T21:30", DEFAULT_PREFS.quiet), "2026-10-31T08:00");
  assert.equal(outOfQuiet("2026-10-30T06:00", DEFAULT_PREFS.quiet), "2026-10-30T08:00");
});

test("residence card: the purpose picks MOS or paper; documents are needed to submit", () => {
  const RES = bp("residence-card");
  assert.deepEqual(checkBlueprint(RES, reg), []);
  const work = planCase(RES, reg, S({ "pobyt_czasowy.purpose": "work" }));
  assert.deepEqual(work.levels.map((l) => l.id), ["route", "documents", "payment", "attachment", "filing", "confirmation", "summons", "decision", "card"]);
  assert.deepEqual(work.levels.find((l) => l.id === "payment")!.fees.map((f) => [f.id, f.amountPln]), [["stamp-duty-work", 440], ["card", 100]]);
  assert.deepEqual(work.levels.find((l) => l.id === "filing")!.dependsOn, ["payment", "documents"]);
  assert.deepEqual(work.levels.find((l) => l.id === "documents")!.parallelWith, ["payment", "attachment"]);
  const abroad = planCase(RES, reg, S({ "pobyt_czasowy.purpose": "family_abroad" }));
  assert.deepEqual(abroad.levels.map((l) => l.id), ["route", "documents", "payment", "who-files", "filing", "summons", "card"]);
  assert.ok(abroad.levels.flatMap((l) => l.tasks).every((t) => !/mos/i.test(t.id)), "no MOS step on the paper path");
  for (const p of [work, abroad]) assert.equal(validatePlan(p, reg, S({})).ok, true);
  assert.equal(nextQuestion(RES, reg, S({}), 0), "pobyt_czasowy.purpose");
});

test("offices: only from the registry's office layer, by the user's city; visit messages carry them", () => {
  const WAW = { teryt: "1465011", name: "Warszawa" }, KRK = { teryt: "1261011", name: "Kraków" };
  const facts = { "zameldowanie.citizen_group": "other", "zameldowanie.stay": "temporary" };
  const fileLevel = (place?: typeof WAW) => planCase(ADDR, reg, S(facts, { place })).levels.find((l) => l.id === "file")!;
  assert.equal(fileLevel().office?.needsPlace, true);
  const waw = fileLevel(WAW).office!;
  assert.equal(waw.offices.length, 18);
  assert.ok(waw.offices.every((o) => o.address?.quotes.length && o.booking === "https://rezerwacje.um.warszawa.pl/"));
  assert.equal(fileLevel(KRK).office!.offices.length, 3);
  assert.equal(fileLevel({ teryt: "0264011", name: "Wrocław" }).office!.noneForPlace, true);
  const vo = (place: typeof WAW) => planCase(CIT, reg, S({ ...RESIDENT, "citizenship.language": "yes" }, { routeChoice: "citizenship-recognition", place })).levels.find((l) => l.id === "filing")!.office!.offices[0];
  assert.deepEqual([vo(WAW).id, vo(WAW).source, vo(WAW).website], ["uw-mazowiecki", "institution", undefined]); // the registry has no website for it
  assert.deepEqual([vo(KRK).id, vo(KRK).website], ["uw-malopolski", "https://www.malopolska.uw.gov.pl/"]);
  const st = S(facts, { ...ACTIVE, place: WAW, events: [
    { type: "arrival_at_address", date: "2026-10-28", by: "user" },
    { type: "visit_planned", date: "2026-10-30", time: "10:00", level: "file", by: "user" },
  ] });
  const prep = agenda({ caseId: "c3", bp: ADDR, plan: planCase(ADDR, reg, st), state: st, prefs: CONSENT, now: NOW }).find((i) => i.kind === "visit_prep")!;
  assert.match(prep.message.pl, /Urzędy dla miejscowości Warszawa: 18/);
  assert.match(prep.message.pl, /Rezerwacja wizyty: https:\/\/rezerwacje\.um\.warszawa\.pl\//);
});

test("alternatives travel together; a later step done closes the steps before it", () => {
  const facts = { "zameldowanie.citizen_group": "other", "zameldowanie.stay": "temporary" };
  const st = S(facts, { ...ACTIVE, events: [
    { type: "arrival_at_address", date: "2026-10-28", by: "user" },
    { type: "visit_planned", date: "2026-10-30", time: "10:00", level: "file", by: "user" },
  ] });
  const p = planCase(ADDR, reg, st);
  const visa = p.levels.flatMap((l) => l.tasks).find((t) => t.id.endsWith(":visa"))!;
  assert.deepEqual(visa.alternatives, ["zameldowanie-foreigner:document:visa-free-or-waiting"]);
  const prep = agenda({ caseId: "c4", bp: ADDR, plan: p, state: st, prefs: CONSENT, now: NOW }).find((i) => i.kind === "visit_prep")!;
  assert.match(prep.message.pl, /wizę albo /);
  assert.match(prep.message.pl, /umowę cywilnoprawną[^\n]* albo /);
  const filed = planCase(ADDR, reg, { ...st, events: [...st.events, { type: "filing", date: "2026-10-30", by: "user" }] });
  assert.deepEqual(filed.levels.map((l) => [l.id, l.state]), [
    ["route", "done"], ["fill-in", "done"], ["owner-confirms", "done"], ["file", "done"], ["registered", "available"],
  ]);
});

test("warnings: the guide's own notes for this person, on the right level, important first", () => {
  const visa = planCase(CIT, reg, S({ "citizenship.permanent_title": "no", "citizenship.ever_polish": "no", "citizenship.where_lives": "poland_visa" }));
  const notesOf = (p: ReturnType<typeof planCase>, id: string) => p.levels.find((l) => l.id === id)!.notes.map((n) => n.id);
  assert.ok(notesOf(visa, "filing").includes("visa-consul"));
  assert.deepEqual(notesOf(visa, "decision").slice(0, 2), ["no-appeal", "no-time-limit"]);
  assert.ok(!notesOf(visa, "decision").includes("keep-documents-valid"), "a note for legal residents only stays out");
  const lost = planCase(CIT, reg, S({ "citizenship.permanent_title": "no", "citizenship.ever_polish": "lost", "citizenship.where_lives": "abroad" }));
  assert.equal(lost.route.status, "none");
  assert.ok(notesOf(lost, "route").includes("restoration"), "no route, but the restoration warning reaches the person");
  for (const p of [visa, lost]) assert.equal(validatePlan(p, reg, S({})).ok, true);
});

test("evaluation scenarios: every reference plan meets its expectations", () => {
  const failed = runScenarios().filter((r) => !r.ok).map((r) => `${r.id}: ${r.failures.join("; ")}`);
  assert.deepEqual(failed, []);
});
