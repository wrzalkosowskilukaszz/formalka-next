# Formalka Next: experience prototype (v4, after the audit of 16.10)

A clickable, phone-first prototype of the "Living Case" app (brief: `docs/formalka-next/15-PROTOTYPE-BRIEF.md`). Since v4 it runs on the real case engine (`packages/case-engine`), not on a script. It is not product code:
- no backend, no language model, no network requests from its own code, no storage;
- the state lives in memory until "Reset" or a reload;
- every fee, document, deadline and office is an example from Formalka's verified content (`reference/`, formalka@04057ef), shown with its source and the check date.

**Not for real cases.** The external audit of 16.10 gave:
- GO for problem interviews;
- conditional GO for moderated tests on fictional cases;
- NO-GO for anyone relying on the app in their own case.

The answer to each finding is in `audit/2026-10-16/RESPONSE.md`.

## Run it

- **Private link:** the owner shares the private Artifact link from the session report. It is never deployed publicly (ADR-N001).
- **Locally:** `node prototype/build.mjs` (Node 22, no dependencies), then open `prototype/dist/index.html`. It is one self-contained file (font, icons and engine inlined), so it works offline and can be copied to a phone. `dist/` is git-ignored. The build writes:
  - `dist/index.html`: the standalone page;
  - `dist/artifact.html`: the same page as a body fragment for the Artifact;
  - `dist/manifest.json`: what the build is made of.

### Which build is this?
The manifest holds:
- the build id: a hash of every input file, so the same inputs give the same id and the same bytes, whatever the day;
- the engine and registry versions;
- the sha256 of both outputs.

The home footer shows the build id and the engine hash, so screenshots from a session tie to one build.

## Tests

| Command | What it checks |
|---|---|
| `node --test prototype/test/*.test.mjs` | The on-device reader of typed answers (14 tests):<br>• yes, no and "Nie wiem"; option words and ties; days and hours; "Jak poszło?"; case intents; whose case; options in the second person;<br>• the audit's cases: hedged or contradictory consent, negated actions, an explicit year, a refused day, masked numbers;<br>• an answer that fits no option: what the reply notices, and that it never picks for the person |
| `node prototype/test/lint.mjs` | ESLint over the modules joined as the browser runs them: unused or undefined names, shadowing, `prefer-const` |
| `node prototype/build.mjs && node prototype/test/e2e.mjs` | Six scenarios in Chromium at 390×844 (below). Add `--motion` for full animations, `--shots <dir>` for screenshots, `--only <A-F>` for one scenario |

The end-to-end scenarios:
- **A:** citizenship in the person's own words, consent on, a change after approval that opens a second route; a typed PESEL is masked and a not-understood question gets no action.
- **B:** address registration in Warsaw in dark mode: official form links, 18 offices with maps and a district filter, the form, call and visit in words, three days on, "Jak poszło?" in words, the assistant's memory.
- **C:** PESEL with "Nie wiem" handed off to a related case, a case for someone else ("dla mojej mamy") in the registry's wording, then four cases with four distinct assistants, and parallel levels on the map.
- **D:** route choice in words, every task up to filing, the office's request, the fix, undo.
- **E:** consent on, a visit, the lock screen with the topic hidden and then shown, the follow-up chip, and the desktop frame.
- **F:** study mode. It checks:
  - only address registration is offered;
  - the build id is shown;
  - the no-language-model notice appears;
  - an answer that fits no option ("Przyjechałem z Kolumbii, a co dalej?") gets a reply that explains, and no group is read from origin;
  - the plan card names its check without overclaiming;
  - memory is named as session memory.

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
| `00-base` | DOM, text and date helpers; masking of personal numbers; timers that stop on reset |
| `10-cases` | Case types, places, the assistants (one per case), the case model, session memory, study mode, level helpers |
| `20-chat` | The conversation: messages, the dock, questions, approval cards, panels, the live case bar |
| `25-shell` | Screens, navigation, tab bar, sheets, toasts, the tester clock |
| `30-intake` | Starting a case, whose case, questions, the person's words, route choice, plan approval, change proposals, the open conversation |
| `35-understand` | The on-device reader of typed answers |
| `40-case` | Start, Teraz, Mapa, history, calendar, Teczka, events, visits, the call flow, the mock form |
| `45-guide` | The active assistant: what it proposes now; offices and maps; answers to the person's questions |
| `50-time` | Time travel, the agenda's messages, the lock screen, "Jak poszło?" |
| `60-screens`, `90-boot` | The screen table, boot and reset |

- `vendor/`: Geist (SIL OFL) and the Phosphor icons used (MIT), with their licences.
- `build.mjs`: inlines everything, including `packages/case-engine/dist/case-engine.browser.js`. The engine bundle is rebuilt with `cd packages/case-engine && node tools/build-browser.mjs --locales pl`. It reproduces the committed file byte for byte; its own manifest is `packages/case-engine/dist/manifest.json`.

## What comes from where

| Shown in the app | Source |
|---|---|
| Questions, options, "Dlaczego pytamy?", the "Nie wiem" help | `E.nextQuestion` (the registry's fact catalogue, in the person's voice: `E.voiced`) |
| Routes, levels, states, lock reasons, tasks, fees, deadlines, office lists | `E.plan` over the blueprints in `blueprints/` and the procedures in `reference/` |
| "Plan zgodny z przewodnikami Formalki" | `E.validate`, two checks kept apart (audit F1):<br>• structure: every reference resolves;<br>• content: amounts, exemptions, dates and offices against the registry, and the plan against one recomputed from the same inputs.<br>The plan is shown only when both pass. It is not a legal verification: the guides themselves can be incomplete |
| Reminders, quiet hours, one notification a day, lock-screen text | `E.agenda` with the case's consent |
| Facts from the person's own words | `E.intake`, every candidate confirmed on its own card (doc 16 §9a) |
| A change after approval | `E.diffPlans` and `E.applyReplan`; the person approves it (ADR-N003) |
| Form download links | the procedure's `links` in the registry (gov.pl PDFs for registration, for example) |
| Addresses, opening hours, booking links | the registry's office layer (Warsaw: 18 district offices; Kraków: 3) |
| Map links | built from the office's name and address (Google Maps search URL). Nothing is sent until the person taps it; then the map service gets the request |

## What the v4 assistant does

1. **One assistant per case.** Each case gets its own assistant: one model with a different name and avatar colour (Maciek, Asia, Ola, Kuba, Ewa, Tomek).
   - The blueprint suggests a name; if another case already uses it, the next free one is taken.
   - It is never chosen by the person's language or origin (rule 4).
   - It always says it is an AI assistant, "nie urzędnik". The first case also says that the prototype uses no language model: a small reader on the phone reads typed answers.
   - Named assistants are a hypothesis (audit F8): continuity of the case comes first. No more personas are added.
2. **Whose case.** After the introduction the assistant asks: "Załatwiasz to dla siebie czy dla kogoś innego?".
   - The person's first words may already say it ("abym złożył…", "dla mamy").
   - For the person's own case, questions speak to them ("Czy mieszkasz…").
   - For someone else's case, they use the registry's own wording ("Czy ta osoba mieszka…"), and the case is marked "sprawa kogoś innego".
   - The plan card can change it.
   - The wording comes from the engine (`E.nextQuestion(…, voice)`, `E.voiced`). The owner has not yet reviewed the second-person texts.
3. **Replies that answer propose the next step.** Its actions come from the plan:
   - fill the form here (a labelled mock that saves a draft PDF to the Teczka);
   - open the official form (the registry's download links; they open in a new tab);
   - offices by district, with the address, hours, a Google Maps button and the booking and website links;
   - a visit or call reminder, or recording a date the engine counts from;
   - the document list, the calendar or the map.

   When the reader is unsure, the answer is refused, or the text holds personal numbers, the reply asks to clarify, or stops, and offers no action (audit F8). No action ever claims a booking, a sending or a filing.
4. **Every answer can be typed** (`35-understand`). The reader:
   - takes "tak" or "nie" when the question is yes or no;
   - asks back ("Dobrze rozumiem?") when a sentence only suggests an answer;
   - treats hedges ("chyba", "raczej") and contradictions ("tak, nie zgadzam się") as unclear and asks;
   - for approvals with consequences (the plan, a change) accepts only a short list of complete answers ("tak", "zatwierdzam", "akceptuję plan"); anything else asks for the button;
   - shows only the options that fit when several do;
   - explains why it asks when asked "po co?";
   - reads days and hours ("jutro", "w środę o 11", "22.10.2027"):
     - it keeps an explicit year;
     - it skips a negated day ("jutro nie mogę, w piątek o 10" means Friday);
     - it asks when two days remain;
     - the confirmation always shows the full date with the year;
   - reads "Jak poszło?" in words ("złożyłem wniosek", "brakowało dokumentu"). A negated action ("nie złożyłem") is never read as done;
   - when the words fit no option, it does not stop at "Nie jestem pewien" (owner, 16.10). It says that it chooses nothing for the person, then:
     - names what it noticed: another case ("Wspominasz o innej sprawie: PESEL"), a question back, or doubt;
     - says why it asks: the first sentence of the registry's "Dlaczego pytamy?";
     - offers one-word answers ("Stały" albo "Czasowy"), only words the reader itself maps to exactly one option;
     - says what "Nie wiem" does, in the registry's words.

     It still matches words; it does not reason like a language model. Where someone comes from never becomes a group (rule 4).

   Words that answer the case's own questions ("mam certyfikat B1") update the case. They never start another case.
5. **Personal numbers are masked before they are shown.** A typed PESEL, IBAN, ID card or passport number, phone number or e-mail appears as "•••" in the chat, and the reply does not repeat it. The patterns are narrow: other personal data (a name, an address) is not caught, so sessions use fictional data only (audit F7).
6. **Honest about what it doesn't know:**
   - service prices, such as a sworn translator, are not in the sources, so they are not given;
   - offices have no phone numbers in the sources, so none are shown;
   - "Nie wiem" leads to a hand-off with free legal aid, not a guess;
   - an exemption the answers don't establish is quoted as something to check, and the full fee stays (audit F3);
   - content the snapshot marks as possibly outdated (the language exam dates) is flagged wherever it appears, with the official page to check.
7. **Session memory** ("Co Asia pamięta w tej sesji" in the case history) holds:
   - what the person confirmed from their own words;
   - the city;
   - the hour they last picked, offered first next time.

   It lasts until a reload or "Reset"; it is not product memory, and nothing is saved for the next day. The last hour is shared by all cases in the session. Learning beyond the device is off (ADR-N010: levels 2 and 3 are NO-GO for now).

## Tester controls

- **Phone:** a dashed strip at the top. **Wide screen:** a dashed panel beside the phone frame. Neither is part of the app.
- **The clock** starts on Monday 19.10.2026, 18:40.
- **Time travel:** "Przewiń o 3 dni" on the strip; +1, +3 and +7 days in the panel. It works once a plan is approved. It delivers the engine's agenda: lock-screen notifications with consent, otherwise in-app messages.
- **Study mode** ("Badanie"; locally also `#badanie` at the end of the file's address):
  - only address registration is offered;
  - other case types are hidden, and asking for them says so;
  - a notice asks for made-up data only.

  Reset keeps the mode; the same button turns it off.
- **Reset** (the round arrow) clears everything back to the start animation.

## Test script for sessions with people (audit of 16.10, Phase 1)

**What this round can show:** qualitative problems with 5 to 8 people, in Polish. It cannot show:
- a statistical advantage;
- retention (H2: there is no lasting memory, and time travel is not a return);
- that the UA, RU or EN versions work.

Recruit future users, including people with lower digital skills.

**Problem interviews** (GO now, no prototype needed): ask about their last real case:
- when they looked for help;
- what was missing;
- what caused a second visit;
- what they did after a letter from the office;
- how much time it cost.

Never ask for document numbers or copies of letters. Notes stay out of this repository: it is public at the time of writing.

### Before each session
- Study mode on. A separate browser profile with no saved logins. A fresh page (reset or reload) for each participant.
- Give the participant a card with a **fictional identity**: name, citizenship group, address in Warsaw, move-in date. No real data: the masking catches only some numbers.
- Agree what is recorded, where it is kept and when it is deleted. Keep recordings and notes out of the repository.
- Say, in these words or close to them: "To prototyp. Asystent nie korzysta z modelu językowego: to, co napiszesz, czyta prosty czytnik w telefonie. Formularz, przypomnienia, ekran blokady i pamięć są symulowane. Nic nie zostanie zarezerwowane, wysłane ani złożone, a po odświeżeniu strony wszystko znika."
- If the goal is to learn what people expect from a language model, run that as a separate session. This one measures the prototype as it is.

### The task (read aloud; a concrete goal)
"Od 15 października mieszkasz w wynajętym mieszkaniu w Warszawie, na Mokotowie. Chcesz się tam zameldować. Dowiedz się z aplikacji, co trzeba zrobić, do kiedy i w którym urzędzie."

Observe without leading. Help only when the participant is stuck, and count each time you do.

During the session, bring in these moments when the participant gets there:
1. **A wrong answer to correct.** The identity card leaves the length of stay to the moderator. When the plan card appears, before approval, say: "Okazuje się, że zostajesz tam tylko na rok." The participant corrects it: "Popraw odpowiedzi" asks the questions again.
   - After approval, the prototype cannot change an answer already given: the reader proposes only facts not yet answered (OPEN, `audit/2026-10-16/RESPONSE.md`).
   - So keep this moment before approval.
2. **"Nie wiem".** The card does not say which citizenship group applies; see whether "Nie wiem" is found and what the participant does next.
3. **The owner will not confirm.** "Właściciel nie chce podpisać potwierdzenia na formularzu. Co teraz?" The plan lets filing go ahead without it, as the guide says (engine fix 35f22bf).
4. **A return after a break.** Talk about something else for five minutes, then: "Wróć do sprawy. Co jest teraz do zrobienia?" Then move the clock three days on and let the participant answer "Jak poszło?".

### What to measure (audit, five measures)
1. Does the participant name the right next step, office, documents and deadline conditions?
   - Score it against the independent reference for this path (`packages/case-engine/eval/independent/`, addr-01 to addr-04).
   - OPEN: the reference is not written yet, and correctness cannot be scored until it is.
2. How often did the moderator help? How many misreadings by the reader? How many confirmations were accepted without reading?
3. Does the participant know that nothing was sent, booked or saved for tomorrow?
4. The time to the first correct, useful result, not to a success screen.
5. Can the participant safely find their way again after a changed fact or an office's request?

High confidence without a correct next step counts as a negative result.

### Questions after the task
1. "Co trzeba teraz zrobić w tej sprawie, do kiedy i gdzie?" (measure 1)
2. "Co aplikacja zrobiła, a czego nie zrobiła?" (measure 3)
3. "Co było niejasne albo co trzeba było zgadywać?"

### Comparison
First compare with a **plain checklist** of the same verified information for this path. Only then compare with a general chatbot that gets the same facts. Otherwise it is unclear whether the value comes from the case's memory and state, or just from ordered content. OPEN: the checklist is not prepared yet.

### The gate after this round
- Go on with this one procedure only with evidence of:
  - useful progress;
  - understanding of the limits;
  - a maintenance cost that can be borne.
- Any unfixed critical error in the studied path blocks wider use.
- The targets in doc 11 are working goals, not proven standards.
- A round of 5 to 8 people approves neither an alpha nor production.
- H6 (maintenance cost) is measured separately, with a log of content changes and the time to verify and republish them.

## Brief §4 moments in v4

| # | Moment | Where |
|---|---|---|
| 1 | Start, "Co dziś załatwiamy?", the pill | Splash, then home: the question, the pill, five case types in a row, "Jak to działa" |
| 2 | The assistant introduces itself, AI disclosed | Chat header and the first message ("asystent AI", "asystentka AI"), and the notice that the prototype uses no language model |
| 3 | Route finding with "Nie wiem" and free text | Citizenship: questions from the engine, typed answers, route choice in words or by card |
| 4 | The live-building map | The slim case bar above the chat and the "Mapa sprawy" notes |
| 5 | Plan, approve, consent | The plan card: whose case, route, open items, fees, the check, consent switch. It also takes a short list of typed answers ("zatwierdzam", "włącz przypomnienia") |
| 6 | Focus and Map | Teraz with "… proponuje"; Mapa as a timeline with locks, reasons, parallel levels and waiting |
| 7 | Form to the Teczka | "Wypełnij tutaj": a labelled mock, a draft PDF in the Teczka |
| 8 | Calendar with honest wording | "Nie mogę zarezerwować wizyty za Ciebie…", day and hour (typed or tapped), what to bring |
| 9 | Time travel, lock screen, "Jak poszło?" | Engine agenda, lock screen (topic hidden by default), three answers or words, map update |
| 10 | A failure moment | "Ile kosztuje tłumacz przysięgły?": not in the sources, official page and free legal aid |
| 11 | A second case and the World view | Every new case gets its own assistant; Start lists them with their colours |
| 12 | Reduced motion | Every animation has a calm fade; the e2e suite runs in both modes |

## Limits (honest)

- **Not for real cases.** The engine's audit findings F1 to F4, F6 and F8 are fixed (doc 16 §6c). Three things are still open:
  - the independent reference is not written yet;
  - five registry errors behind the findings are only proposed to production (`docs/formalka-next/PRODUCTION-CONTENT-PROPOSALS-2026-10-16.md`);
  - only address registration is meant for sessions.
- **No language model.** The reader in `35-understand.js` is a small deterministic matcher (FACT: 14 unit tests). It will miss many real phrasings. A model may replace it later behind the same contract: proposals only, confirmed by the person (doc 16 §9a, ADR-N004).
- **Privacy, by environment.**
  - Locally: the prototype's code makes no requests in the tested scenarios (FACT: e2e).
  - Not shown: what the hosting platform of the private Artifact logs.
  - Official pages, booking and map links are outside connections when tapped.
  - The claims for each environment are in `audit/2026-10-16/RESPONSE.md`.
- **Forms:**
  - the interactive form is a labelled mock;
  - filling the real official PDFs is proven separately in spike S3 (which does not show that an office accepts the result);
  - inside the Artifact, `<a download>` does not work, so "Pobierz" opens the official PDF in a new tab.
- **Places:** Warsaw, Kraków, Wrocław and Gdańsk.
  - Municipal offices with addresses and hours exist in the registry only for Warsaw (18) and Kraków (3).
  - Where the procedure goes to the voivode, every city gets its voivodeship office, with name and website only.
  - Otherwise the assistant says it has no address and points to the office's website.
- **Time.** The visit day in the call flow is fixed three days ahead, so that "Przewiń o 3 dni" lands on it (a prototype shortcut).
- **Engine copy:** the prototype found three issues:
  - the intro said "asystent" for every assistant;
  - dates after "do" were in the nominative;
  - reminders used the blueprint's caretaker name.

  All three were fixed in the engine on 16.10 (6af321f). The prototype passes each case's assistant to the engine as a `Persona` and needs no workaround.
