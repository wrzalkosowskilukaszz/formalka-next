# Formalka Next: experience prototype (v4)

A clickable, phone-first prototype of the "Living Case" app (brief: `docs/formalka-next/15-PROTOTYPE-BRIEF.md`). Since v4 it runs on the real case engine (`packages/case-engine`), not on a script. It is not product code:
- no backend, no language model, no network requests, no storage;
- the state lives in memory until "Reset" or a reload;
- every fee, document, deadline and office is an example from Formalka's verified content (`reference/`, formalka@04057ef), shown with its source and the check date.

## Run it

- **Private link:** the owner shares the private Artifact link from the session report. It is never deployed publicly (ADR-N001).
- **Locally:** `node prototype/build.mjs` (Node 22, no dependencies), then open `prototype/dist/index.html`. It is one self-contained file (font, icons and engine inlined), so it works offline and can be copied to a phone. `dist/` is git-ignored. The build writes:
  - `dist/index.html`: the standalone page;
  - `dist/artifact.html`: the same page as a body fragment for the Artifact.

## Tests

| Command | What it checks |
|---|---|
| `node --test prototype/test/*.test.mjs` | The on-device reader of typed answers: yes, no and "Nie wiem"; option words and ties; days and hours; "Jak poszło?"; case intents (9 tests) |
| `node prototype/test/lint.mjs` | ESLint over the modules joined as the browser runs them: unused or undefined names, shadowing, `prefer-const` |
| `node prototype/build.mjs && node prototype/test/e2e.mjs` | Five scenarios in Chromium at 390×844 (below). Add `--motion` for full animations, `--shots <dir>` for screenshots, `--only <A-E>` for one scenario |

The end-to-end scenarios:
- **A:** citizenship in the person's own words, consent on, a change after approval that opens a second route.
- **B:** address registration in Warsaw in dark mode: official form links, 18 offices with maps and a district filter, the form, call and visit in words, three days on, "Jak poszło?" in words, the assistant's memory.
- **C:** PESEL with "Nie wiem" handed off to a related case, then four cases with four distinct assistants, and parallel levels on the map.
- **D:** route choice in words, every task up to filing, the office's request, the fix, undo.
- **E:** consent on, a visit, the lock screen with the topic hidden and then shown, the follow-up chip, and the desktop frame.

Every screen in every scenario is checked for:
- no console errors and no network requests;
- no horizontal overflow and every icon drawn;
- none of the engine's never-say phrases (`PHRASES_NEVER`);
- no em dash and no internal identifier shown as text.

Playwright and ESLint come from a global install (`npm i -g playwright eslint`). In the cloud container they are preinstalled.

## Layout

- `src/index.html`: the shell (phone frame, tester strip and panel).
- `src/tokens.css`, `src/tokens-dark.css`, `src/app.css`: the visual values. Type, spacing and layers come from Formalka. Colour, radius and motion follow the owner's direction (blue, native-app feel).
- `src/js/*.js`: the app, as ordered modules that share one script scope:

| Module | Role |
|---|---|
| `00-base` | DOM, text and date helpers; timers that stop on reset |
| `10-cases` | Case types, places, the assistants (one per case), the case model, the on-device memory, level helpers |
| `20-chat` | The conversation: messages, the dock, questions, approval cards, panels, the live case bar |
| `25-shell` | Screens, navigation, tab bar, sheets, toasts, the tester clock |
| `30-intake` | Starting a case, questions, the person's words, route choice, plan approval, change proposals, the open conversation |
| `35-understand` | The on-device reader of typed answers |
| `40-case` | Start, Teraz, Mapa, history, calendar, Teczka, events, visits, the call flow, the mock form |
| `45-guide` | The active assistant: what it proposes now; offices and maps; answers to the person's questions |
| `50-time` | Time travel, the agenda's messages, the lock screen, "Jak poszło?" |
| `60-screens`, `90-boot` | The screen table, boot and reset |

- `vendor/`: Geist (SIL OFL) and the Phosphor icons used (MIT), with their licences.
- `build.mjs`: inlines everything, including `packages/case-engine/dist/case-engine.browser.js`. The engine bundle is rebuilt with `cd packages/case-engine && node tools/build-browser.mjs --locales pl`, which reproduces the committed file byte for byte.

## What comes from where

| Shown in the app | Source |
|---|---|
| Questions, options, "Dlaczego pytamy?", the "Nie wiem" help | `E.nextQuestion` (the registry's fact catalogue) |
| Routes, levels, states, lock reasons, tasks, fees, deadlines, office lists | `E.plan` over the blueprints in `blueprints/` and the procedures in `reference/` |
| "Plan sprawdzony" | `E.validate`: the plan is shown only when the validator passes |
| Reminders, quiet hours, one notification a day, lock-screen text | `E.agenda` with the case's consent |
| Facts from the person's own words | `E.intake`, every candidate confirmed on its own card (doc 16 §9a) |
| A change after approval | `E.diffPlans` and `E.applyReplan`; the person approves it (ADR-N003) |
| Form download links | the procedure's `links` in the registry (gov.pl PDFs for registration, for example) |
| Addresses, opening hours, booking links | the registry's office layer (Warsaw: 18 district offices; Kraków: 3) |
| Map links | built from the office's name and address (Google Maps search URL). Nothing is sent until the person taps it |

## What the v4 assistant does

1. **One assistant per case.** Each case gets its own assistant: one model with a different name and avatar colour (Maciek, Asia, Ola, Kuba, Ewa, Tomek). The blueprint suggests a name; if another case already uses it, the next free one is taken. It is never chosen by the person's language or origin (rule 4). It always says it is an AI assistant, "nie urzędnik".
2. **Every reply ends with an action.** The only exception is when the plan is done. Actions come from the plan:
   - fill the form here (a labelled mock that saves a draft PDF to the Teczka);
   - open the official form (the registry's download links; they open in a new tab);
   - offices by district, with the address, hours, a Google Maps button and the booking and website links;
   - a visit or call reminder, or recording a date the engine counts from;
   - the document list, the calendar or the map.
   No action ever claims a booking, a sending or a filing.
3. **Every answer can be typed** (`35-understand`). The reader:
   - takes a bare "tak" or "nie" when the question is yes or no;
   - asks back ("Dobrze rozumiem?") when a sentence only suggests an answer;
   - shows only the options that fit when several do;
   - explains why it asks when asked "po co?";
   - reads days and hours ("jutro", "w środę o 11", "22.10");
   - reads "Jak poszło?" in words ("złożyłem wniosek", "brakowało dokumentu");
   - notices a PESEL or document number and does not keep it.

   Words that answer the case's own questions ("mam certyfikat B1") update the case. They never start another case.
4. **Honest about what it doesn't know:**
   - service prices, such as a sworn translator, are not in the sources, so they are not given;
   - offices have no phone numbers in the sources, so none are shown;
   - "Nie wiem" leads to a hand-off with free legal aid, not a guess.
5. **On-device memory** ("Co Asia pamięta" in the case history) holds what the person confirmed from their own words, the city, and the hour they last picked, which is offered first next time. Nothing leaves the phone. Learning across people is a separate, open decision (ADR-N010).

## Tester controls

- **Phone:** a dashed strip at the top. **Wide screen:** a dashed panel beside the phone frame. Neither is part of the app.
- **The clock** starts on Monday 19.10.2026, 18:40.
- **Time travel:** "Przewiń o 3 dni" on the strip; +1, +3 and +7 days in the panel. It works once a plan is approved. It delivers the engine's agenda: lock-screen notifications with consent, otherwise in-app messages.
- **Reset** (the round arrow) clears everything back to the start animation.

## Test script for sessions with people (brief §7)

**Task (read aloud):** "Masz w telefonie aplikację Formalka. Chcesz się zameldować w nowym mieszkaniu w Warszawie. Załatw z nią, co się da, mówiąc do niej własnymi słowami tam, gdzie wolisz. Potem przewiń czas o 3 dni i odpowiedz na to, o co zapyta."
- A second task for those who finish: "Dodaj drugą sprawę: kartę pobytu."

**Three questions after it:**
1. What did the assistant do for you?
2. What would you do next in your case?
3. Would you come back to it tomorrow instead of asking ChatGPT? Why?

**What to observe:**
- Do they type or tap? Where does the reader misunderstand them?
- Do they notice the "Dobrze rozumiem?" cards and agree too fast?
- Do they understand that the assistant is AI and that nothing was booked or sent?
- Do they use the actions under the replies (form, offices, map), or look for things elsewhere?
- On the map: do they read locks and "Czekasz na urząd" correctly?
- Do they find the Teczka draft and the calendar entry?
- On the lock screen: do they expect the topic to be hidden?
- Time to finish the task (target: under 15 minutes).

## Brief §4 moments in v4

| # | Moment | Where |
|---|---|---|
| 1 | Start, "Co dziś załatwiamy?", the pill | Splash, then home: the question, the pill, five case types in a row, "Jak to działa" |
| 2 | The assistant introduces itself, AI disclosed | Chat header and the first message ("asystent AI", "asystentka AI") |
| 3 | Route finding with "Nie wiem" and free text | Citizenship: questions from the engine, typed answers, route choice in words or by card |
| 4 | The live-building map | The slim case bar above the chat and the "Mapa sprawy" notes |
| 5 | Plan, approve, consent | The plan card: route, open items, fees, validator verdict, consent switch. It also takes typed answers ("zatwierdzam", "włącz przypomnienia") |
| 6 | Focus and Map | Teraz with "… proponuje"; Mapa as a timeline with locks, reasons, parallel levels and waiting |
| 7 | Form to the Teczka | "Wypełnij tutaj": a labelled mock, a draft PDF in the Teczka |
| 8 | Calendar with honest wording | "Nie mogę zarezerwować wizyty za Ciebie…", day and hour (typed or tapped), what to bring |
| 9 | Time travel, lock screen, "Jak poszło?" | Engine agenda, lock screen (topic hidden by default), three answers or words, map update |
| 10 | A failure moment | "Ile kosztuje tłumacz przysięgły?": not in the sources, official page and free legal aid |
| 11 | A second case and the World view | Every new case gets its own assistant; Start lists them with their colours |
| 12 | Reduced motion | Every animation has a calm fade; the e2e suite runs in both modes |

## Limits (honest)

- **No language model.** The reader in `35-understand.js` is a small deterministic matcher (FACT: 9 unit tests). It will miss many real phrasings. A model replaces it later behind the same contract: proposals only, confirmed by the person (doc 16 §9a, ADR-N004).
- **Forms:**
  - the interactive form is a labelled mock;
  - filling the real official PDFs is proven separately in spike S3;
  - inside the Artifact, `<a download>` does not work, so "Pobierz" opens the official PDF in a new tab.
- **Places:** Warsaw, Kraków, Wrocław and Gdańsk.
  - Municipal offices with addresses and hours exist in the registry only for Warsaw (18) and Kraków (3).
  - Where the procedure goes to the voivode, every city gets its voivodeship office, with name and website only.
  - Otherwise the assistant says it has no address and points to the office's website.
- **Time.** The visit day in the call flow is fixed three days ahead, so that "Przewiń o 3 dni" lands on it (a prototype shortcut).
- **Engine copy, worked around in the prototype and reported to the engine:**
  - the intro says "asystent" for every assistant;
  - dates after "do" are in the nominative ("do środa");
  - reminder texts name the blueprint's caretaker, not the case's own assistant.
