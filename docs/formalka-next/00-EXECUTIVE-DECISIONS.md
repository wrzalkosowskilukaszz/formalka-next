# 00 — Executive decisions (start here)

**Formalka Next**, R&D, 2026-10-15. Labels used throughout:
- **FACT:** verified on the date given, with its source;
- **INFERENCE:** a supported inference;
- **HYPOTHESIS:** a design hypothesis to test;
- **OPEN:** an open question;
- **ASSUMPTION:** an unverified assumption.

## 1. What we would build
A personal workspace for one administrative matter at a time (a "case"). The user describes the goal and answers a few non-identifying questions. They then get a plan built **only** from Formalka's verified registry, checked by an independent validator:
- what to do next and by when;
- which documents to bring and where to go;
- the official form filled on their phone;
- reminders from dates they confirmed.

The case lives on the device. AI helps only to understand free text and to explain, and it never decides tasks, documents or dates. (02, 04, 06)

## 2. Verdict

**Feasible, but not proven worth building.** The technical core is small and works:
- S1: a deterministic planner and validator, 14 tests, mutation-checked;
- S3: the official registration form filled and read back with 0 mismatches.

Three questions decide whether it is worth building, and nobody has measured any of them:
1. Are our plans measurably more correct than ChatGPT/Claude on the items that hurt people (H1/A2)?
2. Does someone come back to a case (H2/A1)?
3. Can one person keep plannable rules current (H6/A3)?

The biggest quiet risk is A5: people may arrive after the 4-day registration deadline has passed. (14 §1)

**Recommendation:** Phase 1 (validation) now, with no product code. Phase 2 only through the gates in 13 §5.

## 2a. Progress on 2026-10-15/16 (night)
- **Owner decisions:** concept approved with the prototype first; phones first (Android and iOS); prototype in a separate session; one consent per case for the proactive advisor.
- **Experience prototype:** v1 covers brief 15 §4 end to end; private link reported to the owner (`prototype/`).
- **Living Case engine** (`packages/case-engine`, doc 16):
  - blueprints for 5 case types over Formalka's real content (citizenship, residence card, address registration, language certificate, PESEL);
  - a level map with honest states (locked only with a reason from the procedure's own order);
  - routes the user chooses, or reaches through another case;
  - deadlines only from recorded events;
  - offices from the registry's office layer, by the user's city (Warsaw, Kraków);
  - the guides' warnings placed on the right level;
  - an independent validator;
  - the proactive advisor agenda (quiet hours, one notification a day, consent per case);
  - 39 tests and 18 evaluation scenarios, all passing; 36 faults caught, reproducible with `npm run mutate` (`eval/MUTATIONS.md`);
  - a browser build used by the slice and offered to the prototype.
- **Functional slice** (`slice/`): the engine driving a phone screen end to end (questions with "Nie wiem", route choice, map, "Teraz", events, the advisor's agenda with time travel). Private link reported to the owner.
- **Evaluation set** (`packages/case-engine/eval/`): 18 scenarios. The engine's plans in plain Polish are in `engine-plans/`; they are the generator's output, not the benchmark reference. The independent reference (`eval/independent/`) is not written yet (audit F6).
- **External audit (2026-10-16), engine findings F1–F4, F6, F8 fixed** (doc 16 §6c). Five registry errors behind them are proposed for production in `PRODUCTION-CONTENT-PROPOSALS-2026-10-16.md`, not applied.
- **Intake harness** (doc 16 §9a): free text → fact candidates the person confirms one by one. The checker holds for any future LLM (verbatim, on-topic evidence; language and origin never become citizenship). The non-AI Polish baseline scores 0 wrong of 16 proposed on the scenarios.
- **Deadline rules verified:** KPA art. 57 and the days-off list quoted from the acts via ELI (`verifications/DATES-2026-10-16.md`); the code already matched.
- **Teczka** in the slice: every document in one checklist, with alternatives, fees and the case history.
- **The case lives on the device** (slice): kept in the browser only; free text is never stored, only confirmed facts. The city and later words go through intake as well.
- **Changes after approval are proposals** (ADR-N003, doc 16 §6b): the person sees what a change would add, remove or make certain, with done work kept as history, and approves it or keeps the plan.
- **Experience prototype v4** (16.10, `prototype/`): the design-led app now runs on the case engine for all five case types.
  - One AI assistant per case.
  - Questions speak to the person ("Czy masz…"). The app first asks whether the case is the person's own or someone else's; only for someone else's case is the registry's "ta osoba" wording used (owner, 16.10; `packages/case-engine/src/voice.ts`, owner review of the wording pending).
  - Replies that answer propose the next step: the form here or the official form; offices by district with maps, hours and booking; visits, calls and dates. Unclear or refused answers ask to clarify, with no action (audit F8).
  - Every answer can be typed, read on the device and confirmed. Consent with consequences is taken only from a short list of full answers (audit F5).
  - Session memory, until a reload or reset; the prototype's code sends no case data.
  - Study mode: address registration only, for moderated sessions on fictional cases.
  - Waiting for the office ("przyspieszyć wydanie karty"): the registry's own answer first (a ponaglenie, the official template, the art. 100d caveat), the plan only on request.
  - Tests: 15 unit tests, lint, and 7 end-to-end scenarios in both motion modes.
  - Auditor package: `audit/2026-10-16/STATUS.md`.
- **External audit (2026-10-16), the verdict accepted** (`audit/2026-10-16/RESPONSE.md`):
  - GO for problem interviews;
  - conditional GO for moderated tests on fictional cases;
  - NO-GO for real cases.

  The prototype's findings (F1 wording, F5, F7, F8) are fixed, and the test script follows the audit's Phase 1 section. Waiting on the owner:
  - **the repository is public, while ADR-N001 says private;**
  - the independent reference for address registration;
  - the review of the second-person wording;
  - the ADR-N010 decisions.
- **Learning from use** (ADR-N010, Proposed): the owner asked that the assistant learn from every user's answers. The proposal:
  - the device memory (session memory in the prototype);
  - reviewed, masked phrases with one-tap consent;
  - anonymous outcome counters that trigger content checks.

  Never training on conversations, never facts from users. The audit proposes: level 1 GO as session memory; levels 2 and 3 NO-GO for now. The owner decides.

## 3. Decisions recommended (ADRs in `adr/`, all "Proposed")

| ADR | Decision |
|---|---|
| N001 | Separate private lab repository; nothing merges into production; accepted designs move as normal Formalka PRs |
| N002 | Local-first: the case and personal details stay on the device; ADR-0009 kept; export/import instead of sync |
| N003 | Versioned plan with stable task ids and dependencies; a replan is a diff the user approves; `done` is never undone |
| N004 | The planner is code over the registry; an independent validator gates every plan; the LLM never creates tasks or dates |
| N005 | The companion is an optional persona over one stateless engine, capped; no external actions (no level 3) |
| N006 | One React web app + Capacitor shells (Android first); the guide site unchanged |
| N007 | Slice 1 = address registration + PESEL, without AI; slice 2 = residence permit, only if H1 and H6 hold |
| N008 | Each case type is a blueprint over verified procedures; locks only from the procedure's order, shown with their reason |
| N009 | The advisor acts by itself on the device (one consent per case), with quiet hours, one notification a day and no claimed actions |
| N010 | The assistant learns from use without collecting cases: session memory on the device now; reviewed phrases and outcome counters NO-GO for now (audit, 16.10) |

## 4. Reuse of today's Formalka (01 §4)
Reused largely as is:
- the rules engine (three-valued);
- the procedure model with quotes, verification levels and withdrawals;
- the facts catalogue with "Nie wiem";
- the source registry and change detection;
- the localization gate and termbase;
- masking (`packages/domain/privacy`);
- `.ics` alarms;
- design tokens;
- the worker.

New:
- the case engine (from S1);
- task, case and form templates in the registry;
- the device case store;
- the case app;
- the form filler;
- an AI gateway (Phase 4).

## 5. Costs (12)
- **AI (FACT prices, HYPOTHESIS usage):**
  - base usage on Haiku 5.5 + Sonnet 5.5 is about $0.14 per active user per month, which is $137 at 1k MAU;
  - on Haiku for both, it is about $0.008, or $7.70 at 1k MAU;
  - the companion is about 99% of the bill;
  - under the current €10/month cap, a mid-size companion fits only about 70–100 MAU, so it must be small-model, capped, paid through Plus, or off.
- **Fixed:**
  - Vercel Pro $20/month before any sale (Hobby is non-commercial);
  - Google Play $25 once;
  - Apple $99/year at the iOS phase.
- **The real cost is people's time:** 6–16 h to make one guide plannable, then 0.5–2 h a month to keep it current.

## 6. Estimates (13)
**Recalibrated (13 §4a):** Formalka itself was built in about 2.5 weeks with Claude writing the code. On that pace:
- slice 1 without AI takes about 2–4 weeks of engineering;
- a private alpha takes about **2–3 months of calendar**, bound by the interviews, the owner's reviews and usage limits, not by the coding.

The hand-coding figures below are kept for comparison.


- **Slice 1 without AI:** 255 / 470 / 855 h (optimistic / realistic / pessimistic).
- **To a private alpha:** 370 / 690 / 1,270 h, plus about 120–180 owner hours.
- **Calendar:**
  - about 55–60 weeks at 15 h/week;
  - about 34 weeks at 25 h/week;
  - about 12–16 weeks with a small team.
- **Cuts in 14 §2** (no app-level encryption, no companion or AI intake in slice 1, iOS later) save about 150–250 h.

## 7. What the owner decides (14 §5)
- **O1** Phase 1 go.
- **O2** Pilot.
- **O3** Platform.
- **O4** Local-first.
- **O5** No AI in slice 1.
- **O6** Day-count reading.
- **O7** The "Nie wiem" reminder.
- **O8** Create the private `formalka-next` repository and grant the Claude GitHub app access.
- **O9** Budget at the Phase 3 gate.
- **O10** Your weekly hours.

## 8. Next 10 engineering actions (no production changes)
1. ~~Calibrate the estimates against Formalka's BUILD-PLAN and git history; update 13 §2.~~ Done: 13 §4a, with a second data point in 13 §4c.
2. ~~Port S1 to the real address-registration content at 504a210, and later at the D-01 merge: load the YAML, not the fixture; run reg-01…05.~~ Done in the case engine, against the snapshots at formalka@04057ef (after the D-01 merge); the address-registration scenarios are in the evaluation set.
3. ~~Write verified quotes for the PESEL branch of the template (replace the S1 placeholders) via `source-researcher`.~~ Superseded: the PESEL blueprint uses Formalka's published PESEL procedure and its quotes; no new quotes were needed.
4. Add the validator's identifying-fact and allowed-value checks as a property test over every published fact catalogue (offline).
5. Port S3 to pdf-lib with generated appearance streams; test in Android WebView and iOS Safari (synthetic data).
6. Inventory the permanent-stay registration form (hash, fields, never-fill list).
7. Draft the concept-test wireflow (structured vs. free-text intake; named vs. unnamed companion) as static HTML in the lab, with no backend. Partly done: the experience prototype and the functional slice exist; the A/B variants for the concept test do not.
8. ~~Write 10 of the 40 benchmark scenarios with the reference plans; leave the four-language texts to native writers.~~ Done: 18 scenarios with engine plans (`packages/case-engine/eval/`). They are not a reference: the independent reference is still to be written (audit F6).
9. Measure the registry bundle size for `arrive-register-address` and design the version check (ETag) that replaces a changes feed for slice 1.
10. Draft the interview guide (A5 timing first, A4, A9) and the office questions (A6, O6) for the owner to run.

## 9. Not verified
- Users' needs and willingness to pay: no interviews.
- H1: no benchmark run.
- Offices' acceptance of software-filled forms.
- The day-count reading.
- Neon's current plan and prices, which were read secondhand.
- The cache-write premium.
- iOS viewers' rendering of filled forms.
- The Vercel Pro included-usage limits.
- The AI Act dates, read from secondary sources only.
- Whether a private self-help tool is outside Annex III point 7: an inference, not legal advice.

## Map
| Doc | Content |
|---|---|
| 01 | Isolation and reuse |
| 02 | Product thesis, market, hypotheses H1–H7 |
| 03 | Jobs, validation plan, experience model, flows |
| 04 | Case domain model |
| 05 | Intake and questioning |
| 06 | Verified procedure registry, planner, validator, legal questions |
| 07 | Companion, actions, autonomy |
| 08 | Documents, events, notifications |
| 09 | Architecture and platform |
| 10 | Privacy, security, trust |
| 11 | Evaluation and quality gates |
| 12 | Cost model (`tools/cost-model.mjs`) |
| 13 | Estimates, pilot choice, roadmap, PR sequence |
| 14 | Adversarial review, risks, open decisions |
| `adr/` | N001–N010 |
| 15 | Prototype brief |
| 16 | The Living Case engine (built) |
| `diagrams/` | Slice 1 sequence; what leaves the device |
| `schemas/` | Case store, registry additions, LLM output schemas, validator report |
| `test-scenarios/` | Draft scenarios |
| `../../spikes/` | S1 case engine (`npm test`), S3 official form fill |
