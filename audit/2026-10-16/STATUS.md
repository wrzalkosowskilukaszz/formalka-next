# Formalka Next: status for the auditor

**Date:** 16.10.2026.
**Repository:** `wrzalkosowskilukaszz/formalka-next` (private lab), branch `main`.
**Prepared by:** Claude for the owner, Łukasz.

Labels used throughout:
- **FACT:** checked, with its source or command;
- **INFERENCE:** follows from facts;
- **HYPOTHESIS:** to be tested;
- **ASSUMPTION:** not verified;
- **OPEN:** a decision not yet taken.

This package holds:
- this report;
- `screens/`: screenshots from the automated walkthrough;
- `evidence/`: the raw test outputs behind every number below.

## 1. What we ask you to judge

1. **Engine and plans.** Is the case engine's split right? The engine decides, the assistant explains, and the person approves. Is it enough to keep plans free of invented facts (rule 1)?
2. **The active assistant.** Is the experience honest? It proposes actions after every reply, reads typed answers on the device and keeps a memory on the phone, without crossing the privacy line (ADR-0009, ADR-N002)?
3. **Learning from use.** Is the proposal sound (ADR-N010)? The owner asked that the assistant learn from every user's answers. We propose a way that never collects cases.
4. **Readiness.** Is the lab ready for Phase 1 (interviews and the concept test with this prototype)? What must change first?

## 2. Where we are (summary)

- **Stage:** Phase 0, R&D (doc 13 §5). There is no product code in production, and nothing has been merged into Formalka (ADR-N001).
- **FACT:** the technical core works on Formalka's real content (snapshot formalka@04057ef). Three questions decide whether it is worth building, and none has been measured yet (doc 00 §2):
  - H1: are the plans more correct than a general chatbot's?
  - H2: do people come back to a case?
  - H6: can one person keep the rules current?
- **New since 15.10:** the experience prototype v4 runs on the real engine for all five case types. It adds:
  - one AI assistant per case;
  - an action under every reply;
  - typed answers read on the device;
  - official form links;
  - offices by district with maps and hours.

  It is tested end to end in a phone browser (section 6).
- **Verdict (unchanged, doc 00 §2):** feasible, but not proven worth building. The next step is validation with people, not more features.

## 3. What exists

| Part | Path | What it is | Evidence |
|---|---|---|---|
| Design documents | `docs/formalka-next/00`–`16` | Thesis, domain model, intake, registry, companion, privacy, evaluation, cost, roadmap, adversarial review, prototype brief, Living Case engine | Doc 00 is the entry point |
| Decisions | `docs/formalka-next/adr/N001`–`N010` | All "Proposed". N010 (learning from use) is new | Table in section 9 |
| Verified content | `reference/` | Read-only snapshots of Formalka's procedures, offices and design tokens, each with its source commit | Never edited; nothing copied back |
| Case blueprints | `blueprints/*.yaml` | 5 case types over verified procedures: citizenship, residence card, address registration, PESEL, Polish language certificate | Loaded by the engine |
| Case engine | `packages/case-engine` | Pure TypeScript, about 1,600 lines:<br>• planner (levels, states, lock reasons);<br>• deadlines from recorded events (KPA counting);<br>• offices by city;<br>• validator;<br>• proactive agenda;<br>• intake from free text;<br>• replan diffs | FACT: 30/30 tests, including the 17 evaluation scenarios (`evidence/engine-tests.txt`) |
| Evaluation set | `packages/case-engine/eval/` | 17 scenarios with plain-Polish reference plans for the blind H1 benchmark | FACT: 17/17 pass (`eval/REPORT.md`). The owner's review is pending; the benchmark has not been run |
| Spike S1 | `spikes/s1-case-engine` | The first deterministic planner and validator | FACT: 14/14 tests, mutation-checked |
| Spike S3 | `spikes/s3-official-form-fill` | Filling the real registration PDF | FACT (15.10): 42 fields filled and read back with 0 mismatches, 0 forbidden fields filled |
| Functional slice | `slice/` | The engine on a plain phone screen (the coordinating session's build) | Private link reported earlier |
| Experience prototype v4 | `prototype/` | The design-led app over the engine (this report) | Section 6 |

## 4. How it works

### 4.1 The data path
```
Formalka registry snapshot (reference/, verified, with quotes)
        + case blueprints (blueprints/, which procedures, in what order, which events)
        │
        ▼
case engine (on the device, deterministic, no AI)
  nextQuestion → plan → validate → agenda
  intake (free text → fact candidates)        replan diff (proposal)
        │
        ▼
app (prototype/src/js): shows, explains, proposes actions, asks for approval
        │
        ▼
the person: answers, confirms, approves, records what happened
```

### 4.2 Who decides what
| Decision | Made by | Never by |
|---|---|---|
| Which questions, which route, which tasks, fees, deadlines and offices | The engine, from the verified registry | The assistant or a language model |
| Whether a plan may be shown | The validator (every item must have a source) | The UI |
| Which facts enter the case | The person, one card per fact | The reader or a future model |
| Route choice when several fit | The person, with the differences from the sources | The engine |
| Changes after approval | The person approves a diff (ADR-N003) | Automatic replanning |
| Reminders | The engine's agenda with the person's consent per case (ADR-N009) | The assistant on its own |

### 4.3 What leaves the device
- **FACT (prototype):** nothing. The e2e suite asserts 0 network requests on every screen (`evidence/e2e-*.txt`).
- **Links:** official form links, office websites, booking pages and Google Maps open only when the person taps them. A map link carries the office's public name and address, never the person's data.
- **Product (doc 10, ADR-N002):** registry downloads only. Optional AI calls (Phase 4) go through a gateway with masking and no content logs.

### 4.4 The assistant (prototype v4)
- **One per case.** Each case has its own assistant: the same engine and rules, with its own name and colour. It is never chosen by the person's language or origin (rule 4). It always says it is an AI assistant.
- **It proposes an action after every reply,** unless the plan is done:
  - fill the form here (a labelled mock to a draft PDF in the Teczka);
  - open the official form;
  - offices by district with address, hours, map, booking and website;
  - a visit or call reminder;
  - record a date the engine counts from;
  - the document list, the calendar, the map.
- **It never claims a booking, a sending or a filing.** The engine's `PHRASES_NEVER` list is asserted absent on every screen.
- **It reads typed answers on the device** (`prototype/src/js/35-understand.js`):
  - "Dobrze rozumiem?" when a sentence only suggests an answer;
  - the tied options when several fit;
  - "Dlaczego pytamy?" when asked;
  - days and hours in words;
  - "Jak poszło?" in words;
  - a PESEL or document number is noticed and not kept.

  Facts from free text still pass the engine's intake checks (verbatim and on-topic evidence) and are confirmed one by one.
- **Honest limits:**
  - prices of services are not in the sources, so they are not given;
  - phone numbers of offices are not in the sources, so they are not shown;
  - "Nie wiem" leads to a hand-off to free legal aid, not a guess.

## 5. Feature map (information architecture)

| Area | Now in v4 | Planned (phase) |
|---|---|---|
| **Home** | The question, the pill, 5 case types in a row, "Jak to działa" | Language choice (PL first, then UK/RU/EN) (Phase 3) |
| **Chat** (one log, one assistant per case) | Questions with options, "Nie wiem" and typed answers; approval cards; plan approval; actions under replies; three-layer status | Model-assisted extraction and explanations behind the same contract (Phase 4, ADR-N004, N010) |
| **Case: Teraz** | Current level, "… proponuje" card, tasks, fees, deadlines, offices, visit and call, events, the office's request and the fix | Real form filling from S3 (Phase 3) |
| **Case: Mapa** | Timeline with states, lock reasons, parallel levels, level sheets | The same, from the case store's event log (Phase 3) |
| **Start** | Today's count, the hero case, week strip, the next event, all cases with their assistants | Widgets on the phone (later) |
| **Kalendarz** | Month grid, the engine's agenda, visits, own reminders | OS calendar export (.ics) and local notifications (Phase 3, ADR-N009) |
| **Teczka** | Every document as one checklist with alternatives; draft PDFs | Encrypted device store, export and import (Phase 3, ADR-N002) |
| **History and memory** | Every action with undo; consent and lock-screen switches; "Co … pamięta" | Levels 2 and 3 of learning only if approved (ADR-N010) |
| **Notifications** | Simulated lock screen; topic hidden by default; quiet hours; one a day | Capacitor local notifications, Android first (Phase 3) |

## 6. Verification evidence

| Check | Command | Result |
|---|---|---|
| Engine tests (incl. 17 evaluation scenarios, intake, replan) | `cd packages/case-engine && npm test` | FACT: 30/30 pass (`evidence/engine-tests.txt`) |
| Engine bundle reproducible | `cd packages/case-engine && node tools/build-browser.mjs --locales pl`, then `git status` | FACT: byte-identical to the committed bundle when built from that folder. Built from the repository root, only the source-path comments differ (`evidence/bundle.txt`) |
| Spike S1 | `cd spikes/s1-case-engine && npm test` | FACT: 14/14 pass (`evidence/s1-tests.txt`) |
| Prototype reader unit tests | `node --test prototype/test/*.test.mjs` | FACT: 9/9 pass (`evidence/prototype-unit.txt`) |
| Prototype lint (modules as one script) | `node prototype/test/lint.mjs` | FACT: clean, 11 modules (`evidence/prototype-lint.txt`) |
| Prototype end to end, reduced motion | `node prototype/build.mjs && node prototype/test/e2e.mjs` | FACT: 5/5 scenarios (`evidence/e2e-reduced-motion.txt`) |
| Prototype end to end, full motion | `node prototype/test/e2e.mjs --motion` | FACT: 5/5 scenarios (`evidence/e2e-motion.txt`) |

The e2e scenarios check every screen for:
- no console errors and no network requests;
- no horizontal overflow at 390 px;
- every icon drawn;
- no never-say phrase, no em dash, no internal identifier.

They also run at 1280 px in the phone frame. They cover all five case types (scenarios A–E in `prototype/README.md`).

**Defects found and fixed by these tests** (they show what the suite catches):
- A typed "Mam certyfikat B1" in a citizenship case started a separate certificate case. Words now update the open case first.
- A change after approval that opened a second route produced a plan with no route. The person now picks the route first; a change that leaves no route keeps the plan.
- The office's request ("urząd prosi o uzupełnienie") could not be recorded while waiting for the office. Recorded dates could not be undone.
- Time travel stayed disabled right after approval. The tester panel overflowed on wide screens. The district filter did not hide offices.

## 7. Known limits

- **ASSUMPTION:** the on-device reader is a small deterministic matcher. It will miss many real phrasings. The engine's own Polish intake baseline scores 16 correct and 0 wrong, with 30 facts missed and simply asked (`packages/case-engine/eval/REPORT.md`). The miss rate for typed answers in the app has not been measured with people.
- **FACT:**
  - the interactive form is a mock;
  - filling the real PDF is proven only in spike S3 (synthetic data), not in the app;
  - inside the Artifact, file downloads are blocked by the sandbox, so "Pobierz" opens the official PDF in a new tab.
- **FACT:** district offices exist only for Warsaw and Kraków in the registry snapshot. Voivodeship offices have a name and website only. No office has a phone number.
- **Prototype shortcut:** the visit in the call flow is fixed three days ahead so that time travel lands on it.
- **Engine copy issues, worked around in the prototype and reported to the engine owner:**
  - the intro says "asystent" for every assistant;
  - dates after "do" use the nominative ("do środa" for "do środy");
  - reminder texts use the blueprint's caretaker name, not the case's assistant.

  Two earlier issues (exclamation marks; a promised phone number) were fixed in the engine on 16.10 (commit 565afcc).
- **Not verified (doc 00 §9):**
  - user need and willingness to pay;
  - H1;
  - whether offices accept software-filled forms;
  - the day-count reading;
  - legal classification.

## 8. Risks

| Risk | Why it matters | Mitigation in place | Still open |
|---|---|---|---|
| A5: people arrive after a deadline has passed | The plan is late before it starts | Deadlines only from recorded events; honest states | Interviews (Phase 1) |
| The reader misunderstands typed answers | A wrong fact in the case | Every inferred answer is asked back or confirmed on a card; facts from text pass the intake checks | Measure in sessions; ADR-N010 level 2 |
| Over-trust in the assistant | People treat it as an official | "asystent AI, nie urzędnik"; no government look; never-say list; sources on every fact | Observe in sessions (test script in `prototype/README.md`) |
| Content drift | Fees and rules change | Registry snapshot with quotes and check dates; validator blocks unsourced items | H6 (maintenance time) unmeasured |
| Learning from use | Collecting cases would break ADR-0009 | ADR-N010: device memory only; levels 2 and 3 opt-in, masked, reviewed | Owner and auditor decision |
| Scope creep in the prototype | Features outpace validation | The verdict stays "validate first" | Phase 1 go (O1) |

## 9. Decisions

**ADRs** (all Proposed; doc 00 §3):
- N001 lab isolation;
- N002 local-first case store;
- N003 versioned plan, changes as approved diffs;
- N004 deterministic planner and independent validator;
- N005 one stateless companion engine;
- N006 web-first with Capacitor shells;
- N007 pilot slice;
- N008 mapped case blueprints;
- N009 proactive advisor on the device;
- **N010 (new) learning from use without collecting cases.**

**Open for the owner** (doc 00 §7):
- O1 Phase 1 go;
- O2 pilot;
- O3 platform;
- O4 local-first;
- O5 no AI in slice 1;
- O6 day-count reading;
- O7 "Nie wiem" reminder;
- O9 budget;
- O10 weekly hours;
- **new:** O-L1 to O-L3 from ADR-N010.

**Owner decisions taken on 15.10–16.10:**
- the prototype first;
- phones first;
- one consent per case;
- blue instead of green;
- a modern look with game mechanics only as an accent;
- one assistant per case;
- an action after every reply;
- typed answers everywhere.

## 10. Plan

**Next two weeks (no product code):**
1. The owner reviews the 17 reference plans, then the blind H1 benchmark is run (doc 11).
2. Five to eight moderated sessions with the v4 prototype, using the test script in `prototype/README.md`. Measure:
   - task time;
   - the misunderstanding rate for typed answers;
   - comprehension of "AI, nie urzędnik";
   - use of the actions.
3. Interviews for A5 (timing), A4 and A9, and the office questions (O6, filled forms).
4. Engine copy fixes:
   - persona-aware intro and reminder texts;
   - the genitive after "do".
5. The owner decides O1 and ADR-N010 levels 2 and 3.

**Then, only through the gates in doc 13 §5:**
- Phase 2: the engine and registry PRs in Formalka;
- Phase 3: slice 1 without AI (address registration and PESEL), with real form filling, the device store and local notifications;
- Phase 4: the AI layer behind the same contracts;
- Phase 5: a private alpha.

## 11. Screens (`screens/`, from the automated walkthrough at 390×844)

| File | What it shows |
|---|---|
| 01 | Home: the question, the pill, case types, "Jak to działa" |
| 02, 03 | A typed answer confirmed on a card; a typed answer that fits two options |
| 04 | The plan card: route, fees, validator verdict, consent |
| 05, 06 | The assistant's guidance with actions; answers to the person's own questions |
| 07 | A change after approval, shown as a proposal |
| 08–17 (dark) | Address registration in Warsaw:<br>• official form links;<br>• 18 offices with map, hours and booking;<br>• the mock form;<br>• a visit set in words;<br>• Teraz with the assistant's card;<br>• Start, Kalendarz and Teczka;<br>• "Jak poszło?";<br>• the assistant's memory |
| 18 | "Nie wiem" leading to a hand-off and a related case |
| 19, 20 | Parallel levels on the map; four cases with four assistants |
| 21, 22 | Route choice with the differences from the sources; the office's request for missing items |
| 23 | The simulated lock screen, topic hidden by default |
| 24 | The phone frame and the tester panel on a wide screen |

## 12. How to reproduce

```
git clone https://github.com/wrzalkosowskilukaszz/formalka-next && cd formalka-next   # private: access via the owner
(cd packages/case-engine && npm ci && npm test)
(cd spikes/s1-case-engine && npm test)
node prototype/build.mjs && open prototype/dist/index.html
node --test prototype/test/*.test.mjs && node prototype/test/lint.mjs && node prototype/test/e2e.mjs
```
You need Node 22.18 or later. Playwright and ESLint can be global installs. The prototype is also available as a private link that the owner can share.
