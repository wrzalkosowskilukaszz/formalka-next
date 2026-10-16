# Formalka Next: experience prototype

A clickable, phone-first prototype of the "Living Case" experience (brief: `docs/formalka-next/15-PROTOTYPE-BRIEF.md`). It is not product code. It has no backend, makes no AI calls and sends no network requests. Maciek and Asia are scripted.

## Run it

- **Private link:** the owner shares the private Artifact link (see the session report). It is never deployed publicly (ADR-N001).
- **Locally:** run `node prototype/build.mjs` (Node 22, no dependencies), then open `prototype/dist/index.html` in any browser. It is one self-contained file (font and icons inlined), so it also works offline and can be copied to a phone. `dist/` is git-ignored; rebuild after editing `src/`. The build writes:
  - `dist/index.html`, the standalone page;
  - `dist/artifact.html`, the same page as a body fragment for the Artifact.

Layout:
- `src/tokens.css` holds Formalka's tokens, copied unchanged from `reference/formalka-design/tokens.css`; `src/tokens-dark.css` holds the dark values.
- `src/app.css` and `src/app.js` hold the prototype itself.
- `vendor/` holds Geist (SIL OFL) and 25 Phosphor icons (MIT), with their licences.

## v2: native-app redesign (owner feedback, 2026-10-16)

The owner asked for a native phone app rather than a web page: a living, animated case world, a modern look (references: DocSpot, EverSync, Meta's Muse), blue instead of green, and game mechanics only as a subtle accent.

- **Palette and chrome.** A cobalt-blue accent replaces Formalka's red everywhere except the logo (owner's decision; `src/tokens.css` says so). Type, spacing and layers stay Formalka's. A frosted tab bar has Start, Kalendarz, Czat and Teczka. On a wide screen the app sits in a phone frame, with the tester panel beside it.
- **The world builds live.** During the questions, a blue panel above the chat grows the case:
  - levels fly in, the road is drawn, and the grant route is crossed out;
  - changed levels ripple, and a ring shows how ready the plan is;
  - a caption says what changed and why.
- **Muse-style mechanics.**
  - Confirmations are approval cards with "Dodaj / Nie dodawaj", not chat questions.
  - A three-layer status sits under the chat header: now, the process, then detail and sources.
  - Tapping the assistant's avatar opens the activity log, where any action can be revoked.
- **Start.** "Masz dziś 1 zadanie", the case hero card with its next step (swipe to mark done), a week strip, the next event as an appointment card, and the case list.
- **Map.** A calm path with level tiles, side branches for parallel levels, a state chip on each level and a sheet with details. A "Lista" toggle gives a plain list. No points, badges or streaks.
- **Kalendarz and Teczka.** A month grid with the case's events, and the documents saved on the device.

The scripted content, facts and sources are unchanged from v1.

## Tester controls

On a phone, a dashed strip at the top; on a wide screen, a dashed panel beside the phone frame. Neither is part of the app:
- the simulated clock, which starts on Monday 19.10.2026, 18:40;
- **Przewiń o 3 dni** (time travel), active after the citizenship plan is approved;
- **Reset** (the round arrow), which clears everything back to the start animation.

Inside the chat, a dashed chip starting with "Tester:" moves time to the afternoon after the visit. All state is in memory; a page reload also resets it.

## What is scripted

| Moment (brief §4) | What happens |
|---|---|
| 1. Start | Start animation (the logo's three sheets), then "Co dziś załatwiamy?" with the pill |
| 2. Morph | The pill becomes the chat (View Transitions where the browser supports them). Maciek introduces himself as an AI assistant, "nie urzędnik" |
| 3. Route finding | Q1, residence title: "Nie wiem" leads to a free-text answer, which Maciek rephrases ("Rozumiem to tak: …"). An unclear answer gets options. Q2, the act's group. Q3, Polish B1. Q4, voivodeship |
| 4. Live map | The strip under the chat header grows and prunes. Grant by the President is crossed out ("odłożone, zostaje możliwe"). Dashed markers are unconfirmed |
| 5. Plan | Assumptions, two items "do potwierdzenia", the fee and the decision time. The per-case consent switch is off by default. "Zatwierdzam plan" |
| 6. Focus and Map | "Teraz" shows the current level's tasks and the parallel "Umów wizytę". "Mapa" is a vertical route with a lock and its reason, a parallel branch, "czeka na urząd", and a legend. The map is an ordered list for screen readers |
| 7. Form | A labelled mock of the application ("Makieta, nie oficjalny formularz"), prefilled from the answers. "Zapisz PDF do Teczki" puts a draft in the Teczka. No real PDF is produced |
| 8. Calendar | "Nie mogę zarezerwować wizyty za Ciebie…", pick a day and an hour, "Gotowe. Przypomnienie dodane. Wizyta nie jest jeszcze zarezerwowana.", then the list of what to prepare from the guide. With consent, Maciek adds the morning reminder himself and logs it in the history, where it can be revoked |
| 9. Time travel | Lock screen with a generic notification (the topic is shown only after "Pokaż temat"). Maciek writes first, then "Jak poszło?" with three answers: filed (decision deadline, proof upgrades the level to "potwierdzone"), returned (back to "Zbierz dokumenty", not game over), or moved (the visit step comes back) |
| 10. Honest limit | "Ile kosztuje tłumacz przysięgły?": "Tego nie wiem z naszych źródeł", with the official page and free legal aid. Address and phone number are never given, because the sources don't have them |
| 11. Second case | "Ogarnij mi temat karty pobytu": "Asia dołączyła do chatu". She asks one question, asks before reusing the voivodeship from the citizenship case, and stops honestly: there is no verified residence-card guide in this prototype, so the case is saved as a draft. Then "Twoje sprawy" shows both cases |
| 12. Reduced motion | Under `prefers-reduced-motion`, nothing moves; short fades remain |

**Facts.** Every fee, document, deadline and condition comes from `reference/citizenship/` (recognition route; grant route for the comparison). Each one is labelled "Przykład z przewodnika Formalki, stan na 15.10.2026" with its source link. These include the 1000 zł stamp duty, the 6-month decision time, the 14-day appeal, the documents and the rule on breaks in the stay. The "call the office" step is marked as a practical step, not a requirement. Office addresses and phone numbers are not in the sources, so the prototype doesn't show them. The residence-card case shows no facts at all.

**Not real:** the AI, notifications, calendar writes, PDF filling, photo upload and storage. Free text is matched by keywords; anything outside the script gets "W tym prototypie odpowiadam tylko na przygotowane pytania."

## Test script for sessions with people (5–8 people, under 15 minutes each)

**Setup.** Use the tester's own phone if possible, and reset before each person. Say: "This is an early prototype. The assistant is scripted. We are testing the idea, not you. Please think aloud."

**The task** (read it out, then stay quiet):
> "Imagine you have lived in Poland for five years on a permanent residence permit, you speak Polish at B1 and you live in pomorskie. You've decided it's time to apply for Polish citizenship. Use the app to get going. At one point I will move time forward three days."

Help only when the person is stuck for over a minute. Steps the person may need a hint for:
- answer "Nie wiem" to the first question;
- tap "Pokaż temat" on the lock screen;
- ask about the residence card at the end: "Now ask it to handle your residence card".

**Three questions afterwards:**
1. What did Maciek do for you?
2. What would you do next?
3. Would you come back to this tomorrow instead of asking ChatGPT? Why or why not?

**What to observe:**
- Do they understand within the first minute that Maciek is an AI, not a clerk or a human?
- Do they understand that the reminder is not a booking? Do they say so in their own words?
- Do they find the Map, and can they say why a level is locked?
- How do they react to "Nie wiem" being accepted, and to Maciek rephrasing their free text?
- Do they trust the fee and documents? Do they notice "przykład" and the source link? Do they tap it?
- On the lock screen: does the generic text feel safe or useless?
- Does the proactive message (Maciek writes first) feel helpful or intrusive?
- The returned state: does it read as a setback or as "game over"?
- Where do they hesitate for more than 5 seconds? What do they tap that isn't tappable?
- Time to finish (target under 15 minutes).

Write down quotes verbatim. The criterion is whether the experience removes real work, not whether it looks impressive (brief §3.9).

## Known limits

- One scripted path per case. The grant route is shown on the map, but its full flow isn't scripted.
- The visit day is fixed to the day the time travel lands on, so the scenario always meets.
- "Popraw odpowiedzi" restarts the conversation instead of editing one answer.
- No language other than Polish.
