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
- **"kpa" counting:** days don't count the event day; months end on the same day number or the last day of the month; an end on a Saturday or a holiday moves to the next working day. This is KPA art. 57 §1, §3, §4 [UNVERIFIED: implemented from memory, to quote from the act via ELI before product use].
- **"nth-day" counting** ("najpóźniej w N dniu"): both readings (06 §7 Q3).
- **Holidays:** computed (Easter-based) [UNVERIFIED list, incl. 24 December from 2025].
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

## 7. Quality evidence (2026-10-16)
- **20 tests** on the real snapshots, all passing, including the 17 evaluation scenarios.
- **11 targeted faults** were injected, one at a time; each was caught:
  - an unknown deadline notifying;
  - quiet hours removed;
  - consent ignored;
  - a draft plan acting;
  - a prerequisite not blocking submission;
  - the engine picking a route;
  - "returned" never shown;
  - a date without its event;
  - "Nie wiem" asked again;
  - a holiday missing;
  - a step not placed.
- `checkBlueprint`: 0 issues for all 4 blueprints.
- `validatePlan` passes on every plan in the tests and rejects a tampered ref, an invented date, a guessed nationality, and a lock without basis.

## 7a. Warnings and the evaluation set
- **Warnings.** The guides' pitfalls ("Warto wiedzieć") become notes on the right level, important ones first (blueprint `notes` places them). A route that doesn't fit still carries the warnings written for that person:
  - restoration of citizenship for someone who lost it;
  - "zamelduj się zamiast tego" for a long stay.
- **Evaluation set** (`packages/case-engine/eval/`): 17 scenarios with expectations, run inside the test suite (17/17). `node eval/run.ts --write` exports a reference plan per scenario in plain Polish, with the source of every value, for the blind H1 benchmark (11 §5). The user texts are drafts for native writers, and the owner reviews each reference plan before any benchmark run.

## 8. Browser build
- `node tools/build-browser.mjs --locales pl` builds `dist/case-engine.browser.js`: 315 KB, the engine plus the registry snapshot and the 4 blueprints, global `FormalkaEngine`, no network.
- The experience prototype (`prototype/`) can render its map from it instead of a script. The prototype session was told on 2026-10-15 at about 23:40.

## 9. Not done / open
- **Unverified rules:** the KPA counting and the holiday list (§5).
- **Office data:** offices come from Formalka's office layer (`offices.ts`, added in the night): Warsaw (18 delegations) and Kraków (3 offices), with quoted addresses, hours and booking links, and the voivodeship office by its registry TERYT code. Gaps:
  - no phone numbers in the registry, so no "zadzwoń pod numer X" yet;
  - no municipal offices outside Warsaw and Kraków;
  - the Masovian Voivodeship Office has no website in the registry (a production content gap).
- **AI layer:** the AI intake (free text → fact candidates) is not built (Phase 4); the companion's free-form answers are not built.
- **Content:** citizenship and temporary residence carry open inventory findings, so their values appear as labelled examples only.
- **Gaps outside the engine:** the changes feed, persistence (case store), encryption and native notifications are outside the engine (09 §2).
