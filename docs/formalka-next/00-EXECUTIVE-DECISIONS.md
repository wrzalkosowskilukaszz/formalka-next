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

## 6. Estimates (13, uncalibrated)
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
1. Calibrate the estimates against Formalka's BUILD-PLAN and git history; update 13 §2.
2. Port S1 to the real address-registration content at 504a210, and later at the D-01 merge: load the YAML, not the fixture; run reg-01…05.
3. Write verified quotes for the PESEL branch of the template (replace the S1 placeholders) via `source-researcher`.
4. Add the validator's identifying-fact and allowed-value checks as a property test over every published fact catalogue (offline).
5. Port S3 to pdf-lib with generated appearance streams; test in Android WebView and iOS Safari (synthetic data).
6. Inventory the permanent-stay registration form (hash, fields, never-fill list).
7. Draft the concept-test wireflow (structured vs. free-text intake; named vs. unnamed companion) as static HTML in the lab, with no backend.
8. Write 10 of the 40 benchmark scenarios with the reference plans; leave the four-language texts to native writers.
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
| `adr/` | N001–N007 |
| `diagrams/` | Slice 1 sequence; what leaves the device |
| `schemas/` | Case store, registry additions, LLM output schemas, validator report |
| `test-scenarios/` | Draft scenarios |
| `../../spikes/` | S1 case engine (`npm test`), S3 official form fill |
