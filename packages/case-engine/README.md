# @formalka-next/case-engine (lab)

The Living Case engine:

**verified procedures** (`reference/`, Formalka's own content at formalka@04057ef) **+ case blueprints** (`blueprints/`) → **a map of levels with honest states, deadlines from recorded events, the next question, and the advisor's proactive agenda.**

- Pure functions: no I/O, no clock, no LLM, no network.
- It runs on the phone (ADR-N002).
- It is a lab prototype, not product code: production would port it into Formalka as `packages/case-engine` through normal pull requests (13 §6).

```bash
npm install                      # yaml (runtime in Node), esbuild (browser build)
npm test                         # 16 tests on the real snapshots (Node 22.18+, no build step)
node tools/build-browser.mjs --locales pl   # dist/case-engine.browser.js: engine + data, global FormalkaEngine (omit --locales for pl,en,uk,ru)
```

## What it does

| Module | Job |
|---|---|
| `blueprint.ts` | Places every step, document, fee and deadline of a procedure on a level. `checkBlueprint` proves nothing is lost or invented (all 3 blueprints pass) |
| `planner.ts` | Settles the route and builds levels with honest states, dependencies and parallel levels (below) |
| `questions.ts` | The next question: the fact that would change the most in the plan. No fixed count; "Nie wiem" is an answer and never asked twice; a cap of 12 |
| `validator.ts` | Independent check: every item resolves to a quoted registry item of this registry version; no date without its event; no lock or "returned" without a basis; facts in the catalogue with allowed values (no nationality guessed from language) |
| `advisor.ts` | What Maciek does without being asked (below) |
| `messages.ts` | Polish templates. Gender-neutral, "asystent AI", never "umówiłem / wysłałem / złożyłem / wszystko już wiem" (a test scans every message) |
| `dates.ts` | Calendar days, months ending on the same day or the last day of the month, a weekend/holiday shift (KPA art. 57 [UNVERIFIED]), the two readings of "najpóźniej w N dniu", Polish holidays (Easter-based [UNVERIFIED list]) |
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
E.blueprintIds               // ["address-registration", "citizenship", "language-certificate", "residence-card"]
const state = { facts: {}, tasks: {}, events: [], approved: false }; // routeChoice when the user picks a route
const q = E.nextQuestion("citizenship", state, askedCount);       // { key, question, whyWeAsk, options, unknownHelp } | null
state.facts[q.key] = "yes" /* or E.UNKNOWN for "Nie wiem" */;
const plan = E.plan("citizenship", state);                          // { route, levels[], openFacts, unsure, assumptions, status }
E.validate(plan, state);                                            // { ok, violations } — don't show a failing plan
state.approved = true;                                              // after "Zatwierdzam plan"
state.events.push({ type: "filing", date: "2026-11-30", by: "user" });
state.tasks["citizenship-recognition:document:photos"] = "done";
E.agenda({ caseId: "c1", blueprintId: "citizenship", plan: E.plan("citizenship", state), state,
  prefs: { ...E.DEFAULT_PREFS, consent: true }, now: { date: "2026-10-19", time: "18:40" } });
// -> [{ id, kind, fireAt, channel: "notification"|"in_app", lockScreen, message: {pl}, basis: [ruleRef], answers? }]
```

Events the blueprints accept:

| Case | Events |
|---|---|
| Citizenship | `filing`, `decision_delivered` (outcome `granted` or `refused`), `request_delivered`, `fix_submitted` |
| Address registration | `arrival_at_address`, `registered` |
| Language certificate | `result_notice` |
| Any case (advisor) | `visit_planned` and `call_planned`, each with `{ date, time, level }` |

## Limits (honest)
- **Content.** Only 5 procedures are snapshotted. The residence card has no verified guide here.
- **Dates.** The KPA counting and the holiday list are implemented from memory and marked [UNVERIFIED]. Quote them from the acts (ELI) before any product use. Reminders always use the earlier date, so a wrong shift can only make a reminder early, never late.
- **Citizenship content.** It was checked in a first pass only (October inventory). Show values as labelled examples.
- **Office data.** No office addresses or phone numbers (not in the snapshots).
- **Hashing.** The FNV-1a hash is for the lab; production would use SHA-256.
