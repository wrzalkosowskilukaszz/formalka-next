# @formalka-next/case-engine (lab)

The Living Case engine:

**verified procedures** (`reference/`, Formalka's own content at formalka@04057ef) **+ case blueprints** (`blueprints/`) → **a map of levels with honest states, deadlines from recorded events, the next question, and the advisor's proactive agenda.**

- Pure functions: no I/O, no clock, no LLM, no network.
- It runs on the phone (ADR-N002).
- It is a lab prototype, not product code: production would port it into Formalka as `packages/case-engine` through normal pull requests (13 §6).

```bash
npm install                      # yaml (runtime in Node), esbuild (browser build)
npm test                         # 39 tests incl. 18 evaluation scenarios, intake, replan, content verification and the audit fixes
npm run mutate                   # applies each fault in tools/mutations.mjs alone, runs the tests, restores; eval/MUTATIONS.md (36/36)
npm run eval                     # eval/REPORT.md + eval/engine-plans/*.md (the engine's plans in plain Polish; not a benchmark reference, see eval/independent/README.md)
node tools/build-browser.mjs --locales pl   # dist/case-engine.browser.js: engine + data, global FormalkaEngine (omit --locales for pl,en,uk,ru)
```

The committed `dist/case-engine.browser.js` reproduces byte for byte only when built from `packages/case-engine` with `--locales pl`: esbuild writes source paths relative to the working directory into the bundle's comments. `dist/manifest.json` identifies a build by content: the registry version, the hash of every source file and of the engine, and the bundle's sha256 (no build date).

## What it does

| Module | Job |
|---|---|
| `blueprint.ts` | Places every step, document, fee and deadline of a procedure on a level. `checkBlueprint` proves nothing is lost or invented (all 5 blueprints pass) |
| `planner.ts` | Settles the route and builds levels with honest states, dependencies and parallel levels (below) |
| `questions.ts` | The next question: the fact that would change the most in the plan. No fixed count; "Nie wiem" is an answer and never asked twice; a cap of 12 |
| `validator.ts` | Independent check: every item resolves to a quoted registry item of this registry version; no date without its event; no lock or "returned" without a basis; facts in the catalogue with allowed values (no nationality guessed from language) |
| `advisor.ts` | What Maciek does without being asked (below) |
| `messages.ts` | Polish templates. Gender-neutral, "asystent AI", never "umówiłem / wysłałem / złożyłem / wszystko już wiem" (a test scans every message) |
| `dates.ts` | Calendar days, months ending on the same day or the last day of the month, a weekend/holiday shift (KPA art. 57, quoted from the act on 2026-10-16), the two readings of "najpóźniej w N dniu", Polish days off (Easter-based; art. 1 of the act on days off work, quoted) |
| `offices.ts` | Which office, from the registry's office layer and the user's city (TERYT, on the device): quoted addresses, hours, booking links; voivodeship offices by their registry TERYT code. Never a guessed address |
| `intake.ts` | The person's own words → fact candidates they confirm one by one. Any extractor (the Polish baseline today, an LLM later) passes `checkCandidates`: only facts this case asks, only allowed values, evidence quoted verbatim from the text and on the fact's topic (so language or origin never becomes citizenship or protection). Compound facts (`citizenship.group`) are always asked |
| `voice.ts` | Whose case it is (owner, 2026-10-16). Questions speak to the person by default ("Czy masz…"). For a case handled for someone else they keep the registry's wording ("Czy ta osoba ma…"). Only the grammatical person changes: same conditions, options and numbers, nothing gendered, quotes untouched. A test checks all of this for every fact a blueprint can ask. Owner review of the wording: pending |
| `replan.ts` | After approval a change is a proposal (ADR-N003): `diffPlans` lists, by stable ids, what it adds, removes, makes certain, keeps as history (done work) and changes in fees, deadlines, offices and the route. `applyReplan` never resets `done` |
| `verify.ts` | Content verification, apart from the structural check (audit F1): amounts, exemptions, start events, dates and offices against the registry and the events, and the plan against one recomputed from the same inputs |
| `browser.ts` | The browser entry with the data embedded |

**Route** (`planner.ts`) can be:
- **open:** still asking;
- **choice:** several routes fit, so the user picks;
- **decided;**
- **unsure:** "Nie wiem" leaves it open, so hand off;
- **none;**
- **reachable:** e.g. recognition after the language certificate, a separate case that runs **in parallel** with the documents; submitting waits for both.

**Level states** (`planner.ts`):
- `unconfirmed`;
- `locked`: with the reason and the procedure step behind it;
- `available`;
- `in_progress`;
- `waiting_office`;
- `returned`: "urząd prosi o uzupełnienie", until `fix_submitted`;
- `done`.

**Advisor** (`advisor.ts`):
- **What it schedules:** deadline warnings and the safe last day; for a planned visit, preparation the evening before, a morning reminder and a "jak poszło?" follow-up; call reminders at the time the user chose; a nudge after a quiet week; rule-change notices; the office's time passing, as information only.
- **Only when:** for an approved plan, from recorded events, and never for a deadline that may not apply.
- **Limits:** quiet 20:00–08:00; one notification a day per case; everything in-app without consent; no topic on the lock screen unless turned on; stable ids.

## Browser API (`dist/case-engine.browser.js`, global `FormalkaEngine`)

```js
const E = window.FormalkaEngine;
E.registryVersion            // "formalka@04057ef"
E.blueprintIds               // ["address-registration", "citizenship", "language-certificate", "pesel", "residence-card"]
const state = { facts: {}, tasks: {}, events: [], approved: false, place: { teryt: "1465011", name: "Warszawa" } }; // routeChoice when the user picks a route
const q = E.nextQuestion("citizenship", state, askedCount);       // { key, question, whyWeAsk, options, unknownHelp } | null, speaking to the person
const q2 = E.nextQuestion("citizenship", state, askedCount, 12, "other"); // for someone else: the registry's "ta osoba" wording
E.voiced(E.fact("pesel.stay_over_30"), "you");                    // any fact's texts in either voice
state.facts[q.key] = "yes" /* or E.UNKNOWN for "Nie wiem" */;
const plan = E.plan("citizenship", state);                          // { route, levels[], openFacts, unsure, assumptions, status }
E.validate(plan, state);                                            // { ok, violations, structure, content }: both checks, apart; never show a plan that fails either
E.dueRangePl(due.earliest, due.latest, due.counting);               // "do poniedziałku, 31 maja (…dzień wolny…)"; two readings only for nth-day
E.manifest;                                                         // { registry, locales, engine, sources }: what this build is made of
state.approved = true;                                              // after "Zatwierdzam plan"
state.events.push({ type: "filing", date: "2026-11-30", by: "user" });
state.tasks["citizenship-recognition:document:photos"] = "done";
E.agenda({ caseId: "c1", blueprintId: "citizenship", plan: E.plan("citizenship", state), state,
  prefs: { ...E.DEFAULT_PREFS, consent: true }, now: { date: "2026-10-19", time: "18:40" } });
// -> [{ id, kind, fireAt, channel: "notification"|"in_app", lockScreen, message: {pl}, basis: [ruleRef], answers? }]
const { candidates } = E.intake("citizenship", "Mam pobyt stały i certyfikat B1.", state);
// -> [{ fact, value, evidence: "Mam pobyt stały", by: "baseline-pl-1" }, …]: show each with the question and option label
Object.assign(state, E.confirmCandidates(state, candidates, ["citizenship.permanent_title"])); // only what the person confirmed
E.placeCandidate("Przeprowadziłem się do Warszawy", [{ teryt: "1465011", name: "Warszawa", forms: ["Warszawa", "Warszawie", "Warszawy"] }]);
// -> { place: { teryt, name }, evidence: "Warszawy" } | null (null when no city or two cities are named)
const diff = E.diffPlans(E.plan("address-registration", state), E.plan("address-registration", proposed), state.tasks);
// -> { route?, tasks: { added, nowCertain, removed, keptAsHistory }, fees, deadlines, offices, levels, empty }
if (approvedByPerson) state = { ...proposed, tasks: E.applyReplan(state.tasks, diff) };
```

Events the blueprints accept:

| Case | Events |
|---|---|
| Citizenship | `filing`, `decision_delivered` (outcome `granted` or `refused`), `request_delivered`, `fix_submitted` |
| Address registration | `arrival_at_address`, `registered` |
| Language certificate | `result_notice` |
| Any case (advisor) | `visit_planned` and `call_planned`, each with `{ date, time, level }` |

## Limits (honest)
- **Content.** Only 6 procedures are snapshotted: address registration, PESEL, citizenship by recognition and by grant, the language certificate, and temporary residence (the residence card).
- **Dates.** The KPA counting and the holiday list were checked against the acts' consolidated texts on 2026-10-16 (`docs/formalka-next/verifications/DATES-2026-10-16.md`). The "najpóźniej w N dniu" reading is still open, so both dates are kept. Reminders always use the earlier date, so a wrong shift can only make a reminder early, never late.
- **Citizenship content.** It was checked in a first pass only (October inventory). Show values as labelled examples.
- **Office data.** Offices exist only for Warsaw and Kraków (municipal) and the 16 voivodeship offices (name and website only). The registry has no phone numbers.
- **Intake.** The baseline reads Polish only and proposes only what a sentence states outright (recall 35%, precision 100% on the 17 scenarios, `eval/REPORT.md`). Everything it misses is simply asked.
- **Hashing.** The FNV-1a hash is for the lab; production would use SHA-256.
