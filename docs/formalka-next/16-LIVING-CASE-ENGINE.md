# 16 — The Living Case engine (built 2026-10-15/16)

Labels used: FACT (verified, with source), HYPOTHESIS, OPEN, UNVERIFIED.

This document describes what exists in `packages/case-engine/` and `blueprints/`, why it is shaped this way, and what it doesn't do yet. It turns the owner's picture into running code, tested on Formalka's real content:
- "levels like in a game";
- "maps of roadmaps for every case";
- "an advisor who acts and doesn't wait".

## 1. Three layers

| Layer | What | Who writes it | Can it invent? |
|---|---|---|---|
| **Registry** (`reference/`) | Formalka's verified procedures: steps with order, documents, fees, deadlines, conditions, each with a verbatim official quote | Formalka's existing pipeline (quote gate, owner's check) | No: every value has a quote |
| **Blueprint** (`blueprints/*.yaml`) | The roadmap of one case: which steps become which levels, level names, events the user can record, links to other cases | Mapped once per case type by Claude and checked by the owner | No: `checkBlueprint` proves every registry item lands on exactly one level and nothing else is added |
| **Case state** (on the phone) | The person's answers (non-identifying), recorded events with dates, task statuses, approval and consent | The user (and the advisor, with consent) | — |

The planner joins the three into a **map of levels**. The AI's place (Phase 4) is outside this core:
- understanding free text and turning it into fact candidates the user confirms;
- explaining in Maciek's voice.

It never creates a level, a task, a fee or a date (ADR-N004).

## 2. Blueprints (the owner's "mapped roadmaps")
Five blueprints exist, all passing the static check against the snapshots:

| Blueprint | Procedures | What it shows |
|---|---|---|
| `citizenship` | recognition (voivode) and grant (President) as alternative routes | Route finding, the user's choice, a route **reachable through another case** (the language certificate), "Po odmowie" with the appeal and court deadlines, "returned" after a request to fill gaps |
| `residence-card` | temporary residence permit | One level standing for **alternative steps**: online in MOS, or on paper for a family member abroad, chosen by the procedure's own conditions. Documents ‖ fees ‖ employer attachment, then filing |
| `address-registration` | registration for foreigners (with D-01) | The two readings of "najpóźniej w 4./30. dniu" |
| `language-certificate` | the state certificate in Polish | The case that unlocks recognition. Its exam dates are stale (quote gate failed on 2026-10-15) |
| `pesel` | PESEL on application | Someone staying over 30 days is told by the guide's own warning to register an address instead (PESEL then comes from the office); the related case opens with one tap |

**Mapping cost** [FACT, tonight]: each blueprint took 20–40 minutes, because the registry already holds the steps' order and conditions. This supports estimate 12 §5 (6–16 h per procedure), where the hours go into making the *procedure* verified, not into the map.

## 3. Levels and their states (the owner's "levels like in a game")

| State | When | What the user sees |
|---|---|---|
| `unconfirmed` | The route isn't settled yet | A dashed level: "zależy od odpowiedzi" |
| `locked` | A level it depends on isn't done. **Only from the procedure's own step order** (or from a route condition met through another case, or from documents needed to submit) | 🔒 with the reason ("Najpierw: Opłata, Certyfikat z polskiego") and the source |
| `available` | Ready | "Możesz zacząć" |
| `in_progress` | A task started | Progress |
| `waiting_office` | The office decides | "Czekasz na urząd"; the effort is over |
| `returned` | A request to fill gaps was delivered, until `fix_submitted` | "Urząd prosi o uzupełnienie", with the deadline from the delivery. Never "game over" |
| `done` | All tasks done or not needed, or the level's event recorded | ✓ |

- **Parallel levels:** two levels are parallel when neither depends on the other. Example: the language certificate and the documents for citizenship; documents, fees and the employer's attachment for the residence card.
- **Level types the engine handles:** route, prerequisite (another case), step, alternative steps, documents-only, deadline-only (appeal and court after a refusal).

## 4. The route
The route is decided by the procedures' **own** applicability rules and conditions. It has these statuses:
- **open:** an unknown route still has an unanswered fact, so keep asking.
- **choice:** several routes fit; **the user chooses**, the engine never does. For citizenship this is the common case for long-term residents, and Maciek shows the official differences.
- **decided.**
- **reachable:** every unmet condition of a route can be met through another case, as declared in the blueprint's `fulfillable`. Recognition without B1 is reachable through the language certificate; that case becomes a **parallel prerequisite level**, and only submitting waits for it.
- **unsure:** "Nie wiem" leaves it open, so hand off.
- **none:** no route from our sources fits.

## 5. Dates (deadline counting)
- **Due dates:** only from an event the user recorded (`by: user`) or has evidence of (`by: evidence`). There is no date without its event, and the validator checks this.
- **"kpa" counting:** days don't count the event day; months end on the same day number or the last day of the month (years likewise, so 29 February ends on 28 February); an end on a Saturday or a day off work moves to the next working day. [FACT: KPA art. 57 §1, §3, §3a, §4, quoted from Dz.U. 2025 poz. 1691 via the Sejm ELI API on 2026-10-16, `verifications/DATES-2026-10-16.md`]
- **"nth-day" counting** ("najpóźniej w N dniu"): both readings (06 §7 Q3).
- **Holidays:** computed (Easter-based). [FACT: art. 1 of the act on days off work, Dz.U. 2025 poz. 296; 24 December since 1 February 2025, Dz.U. 2024 poz. 1965; checked on 2026-10-16.] Not modelled: an epidemic day off set by the Prime Minister (art. 1a).
- **Safety rule:** reminders always use the **earlier** date (`earliest`). A wrong shift can only make a reminder early, never late.

## 6. The advisor acts (`advisor.ts`)
This is the owner's key differentiator: "doradca, który działa, a nie czeka". The agenda is computed on the phone from the approved plan and handed to the phone's own scheduler, so it works with the app closed and no server knows the case.

| What | When | Basis |
|---|---|---|
| Deadline warning | 2, 5, 14 or 30 days before the safe date, depending on the period's length | The deadline rule |
| Safe last day | 09:00 on `earliest` | The deadline rule |
| Visit preparation | 18:00 the evening before a planned visit: what to bring (documents still in the plan) and fees | The documents and fees |
| Visit morning | 08:00 on the day | — |
| "Jak poszło?" | 3 h after the visit (moved out of quiet hours), with three answers that update the plan | — |
| Call reminder | At the time the user chose | — |
| Nudge | After a quiet week, at most once a week | The next level |
| Rule change | When a new registry version is published for the case's procedure | The changes feed (Phase 2) |
| Office's time passed | The day after the office's deadline, as information only ("możesz zapytać w urzędzie, na jakim etapie jest sprawa"), never "musisz" | The deadline rule |

Guards, each with a test:
- an approved plan only;
- never for a deadline that **may not apply** (unknown);
- quiet hours 20:00–08:00;
- **one notification per case per day**: the rest stay in the in-app list, except what the user timed and the deadline day;
- **without consent, everything stays in the app**;
- the lock screen shows no topic unless the user turned that on;
- stable ids, so rescheduling never duplicates;
- templates never claim "umówiłem / wysłałem / złożyłem / wszystko już wiem" (a test scans every message);
- "Wizyta nie jest jeszcze zarezerwowana" after a call reminder.

**Consent model** (owner, 2026-10-15): **one consent per case** at plan approval ("Maciek może sam dodawać przypomnienia i wpisy w kalendarzu do tej sprawy"). After that the advisor acts without asking; every action is in the case history and revocable.

## 6b. Changes after approval (`replan.ts`, ADR-N003)
After a plan is approved, a change becomes a **proposal** the person approves, never a silent rewrite. Examples:
- a fact confirmed from their words;
- a route choice;
- later, a new registry version.

`diffPlans(approved, proposed, tasks)` compares the two plans by stable ids and lists, in plain titles:
- the route, from → to;
- tasks added, tasks that **now certainly apply** (were "sprawdź, czy Cię dotyczy"), tasks no longer needed;
- **done tasks the new plan no longer has, kept as history**;
- fees and deadlines added, removed or changed (dates);
- a different office;
- level state changes.

`applyReplan` never resets `done`, even from a tampered diff. A removed task's other status is cleared, so if it ever comes back it starts fresh.

**In the slice:** after approval, words typed in the chat go through intake. Once the person confirms them, a "Ta zmiana zmieni Twój plan" card shows the diff, with "Zatwierdzam zmianę" and "Zostaw jak było". A change that alters nothing says so.

## 6c. Fixes after the external audit (2026-10-16)
An external audit of prototype v4 found engine errors the tests had not caught. Its verdict:
- GO for problem interviews;
- conditional GO for moderated tests on fictional cases;
- NO-GO for anyone relying on the app for a real case.

Each finding below was reproduced, fixed, then reverted once to prove its test catches it.

| Finding | What was wrong | Fix |
|---|---|---|
| F1 | The validator checked structure only: a plan with valid references passed with a fee of 999 999 zł, a renamed task, missing items or an invented office | `verifyContent` (separate from the structural `validatePlan`) checks amounts, exemptions, start events, dates and offices against the registry and the events, and the whole plan against one recomputed from the same inputs. `E.validate` returns both checks, kept apart |
| F2 | The court complaint was counted from the voivode's decision, and a refused residence decision opened the card level | Typed decision events with an instance (`appeal_decision_delivered` for the Minister's decision); the court complaint runs from it. The registry rule names the first decision, so the blueprint corrects the start event, allowed only with words from the rule's own quote. The card level has `requires: granted` |
| F3 | An exemption with no rule counted as granted ("zwolnienie" instead of 340 zł) | An exemption without a rule is "sprawdź, czy Cię dotyczy" and the full fee is shown; the evaluation compares the effective amount |
| F4 | Address registration: the EU family member's card was asked of every EU citizen; filing waited for the owner's confirmation; "albo" was lost in the plan text | `onlyIf`: the card shows as conditional, with who it is for. `optionalAfter`: filing doesn't wait for the owner, per the guide's own words. Both need a basis quoted from the registry. The plan text keeps "A albo B" |
| F6 | The "reference plans" were the engine's own output, and the scenarios carry richer facts than their texts | Renamed `engine-plans/`; each lists the facts it assumed, for both systems; `eval/independent/README.md` defines the independent reference (none written yet) |
| F8 | Dates said "zależnie od tego, jak liczyć dni" for a plain weekend shift; "kpa" counting was used without a basis; the bundle carried the build day | One legal date for KPA/PPSA, with the reason for a shift. Counting `ppsa` (verified) and `plain` (basis not verified: one date, never later). A content-hash manifest (`dist/manifest.json`, `E.manifest`) replaces `builtAt` |

Five of these errors come from the production registry itself. They are proposed to the owner in `PRODUCTION-CONTENT-PROPOSALS-2026-10-16.md` and are not applied.

## 7. Quality evidence (2026-10-16)
- **39 tests** on the real snapshots, all passing, including the 18 evaluation scenarios (each now runs the content check too), the intake checks (§9a), the replan checks (§6b) and the audit fixes (§6c).
- **35 faults, reproducible.** `tools/mutations.mjs` lists them and `npm run mutate` applies each alone, runs the whole suite and restores the file. Result on 2026-10-16: 35 of 35 caught (`eval/MUTATIONS.md`, one row per fault; 35 since the `implied` marker). The faults:
  - the advisor's guards (4);
  - the planner's rules, including the audit fixes F2–F4 and the `implied` marker (9);
  - questions, dates and wording (5);
  - the blueprint, structural and content checks (4);
  - intake (9);
  - the replan (4).
- **Correction.** Before the runner existed, these claims came from one-off manual runs that left no log, so an auditor couldn't reproduce them (audit, 2026-10-16). The runner then showed that one of them was wrong: "'Nie wiem' asked again" was not caught, because no test covered a route that was decided and still asking. That test now exists.
- `checkBlueprint`: 0 issues for all 5 blueprints.
- `validatePlan` passes on every plan in the tests and rejects a tampered ref, an invented date, a guessed nationality, and a lock without basis.

## 7a. Warnings and the evaluation set
- **Warnings.** The guides' pitfalls ("Warto wiedzieć") become notes on the right level, important ones first (blueprint `notes` places them). A route that doesn't fit still carries the warnings written for that person:
  - restoration of citizenship for someone who lost it;
  - "zamelduj się zamiast tego" for a long stay.
- **Evaluation set** (`packages/case-engine/eval/`): 18 scenarios with expectations, run inside the test suite (18/18). `node eval/run.ts --write` exports the engine's plan per scenario in plain Polish (`engine-plans/`), with the source of every value and the facts it assumed. These plans are not the benchmark reference (§6c F6); the H1 benchmark (11 §5) needs the independent reference in `eval/independent/`. The user texts are drafts for native writers.

## 8. Browser build
- `node tools/build-browser.mjs --locales pl` builds `dist/case-engine.browser.js`: 353 KB, the engine plus the registry snapshot and the 5 blueprints, global `FormalkaEngine`, no network.
- The experience prototype (`prototype/`) can render its map from it instead of a script. The prototype session was told on 2026-10-15 at about 23:40.

## 9. Not done / open
- **Rules:** the KPA counting and the holiday list were quoted from the acts on 2026-10-16 (§5). The reading of "najpóźniej w N dniu" for address registration is still open (06 §7 Q3).
- **Office data:** offices come from Formalka's office layer (`offices.ts`, added in the night): Warsaw (18 delegations) and Kraków (3 offices), with quoted addresses, hours and booking links, and the voivodeship office by its registry TERYT code. Gaps:
  - no phone numbers in the registry, so no "zadzwoń pod numer X" yet;
  - no municipal offices outside Warsaw and Kraków;
  - the Masovian Voivodeship Office has no website in the registry (a production content gap).
- **AI layer:** the intake harness exists with a non-AI baseline (§9a). An LLM extractor and the companion's free-form answers are not built (Phase 4).
- **Content:** citizenship and temporary residence carry open inventory findings, so their values appear as labelled examples only.
- **Gaps outside the engine:** the changes feed, persistence (case store), encryption and native notifications are outside the engine (09 §2).

## 9a. Intake: the person's words → facts they confirm (`intake.ts`, 2026-10-16)
The owner's picture starts with a conversation ("pill bar morphing into a chat"). This is the part of the conversation that turns words into a plan, built so an LLM can later replace the extractor without being trusted.

**The flow:**
1. The person describes the situation in their own words.
2. An extractor proposes **fact candidates**: a fact, a value and the words it came from.
3. `checkCandidates` drops what fails the checks below.
4. The person sees each survivor as their words, the official question and the option, and confirms or rejects it.
5. Only confirmed facts enter the case. Everything else is asked as usual, so a missed fact costs one question, never a wrong plan.

**What the checker enforces, whatever the extractor:**
- **Asked facts only.** A fact this case doesn't ask is dropped.
- **Compound facts are always asked.** An option that joins several conditions (`citizenship.group`: years, income, housing) is never proposed; the person picks it from the official list.
- **Allowed values only.** "Nie wiem" is never proposed; that answer is the person's to give.
- **Verbatim evidence.** The evidence must appear in the person's text word for word.
- **On topic.** The evidence must be about the fact. **Language and origin are not citizenship** (rule 5): a citizenship group needs the word "obywatel", and temporary protection needs "ochrona czasowa" or "UKR". "Jestem z Indii", "Jestem Niemką" or "piszę po ukraińsku" propose nothing. The extractor never receives the interface language or the place.
- **Ambiguity.** Two values for one fact propose neither ("studiuję i pracuję").
- **No overwrite.** An answer already given is never overwritten.

**The baseline** (`baseline-pl-1`) is deliberately narrow:
- it is Polish only;
- it maps only phrases that state a fact outright to words in the option's own label;
- it skips a phrase negated by "nie" (as a word: "mieszkanie na rok" is not a negation).

On the 17 scenarios it scores 16 correct, 0 wrong, 1 extra and 30 missed: recall 35%, precision 100% (`eval/REPORT.md`, intake section).

What the scores show:
- **Precision is the number that matters** [INFERENCE]: a wrong candidate might be confirmed in a hurry, while a missed one costs a single question.
- **Recall is the LLM's job in Phase 4.** It is measured on the same harness, with the same checker in front of it, under the 11 §2 thresholds.

**In the slice:** the first description on the home screen runs intake. The card "Z Twojego opisu rozumiem tyle" shows each candidate with the person's clause, the official question and the option, and Tak / Nie buttons.

**Privacy:** the text is read on the device and is not stored in the case; only confirmed facts are (ADR-0009).

**Added on 2026-10-16:**
- **The city.** `placeCandidate` proposes the city (TERYT, for the office) only when exactly one known city is named, by its own name forms ("do Warszawy"). A street ("ulicy Gdańskiej") never counts.
- **Later words.** Words typed under any question before approval run the same intake. A confirmed fact may replace an earlier "Nie wiem" (the person now knows), never an answer they gave.
- **On the device.** The slice keeps the case in the browser. The free text and its fragments are never stored, only confirmed facts.

**Open:**
- the Ukrainian, Russian and English baselines (or an LLM extractor);
- a TERYT dictionary for all places (the slice knows four cities).

