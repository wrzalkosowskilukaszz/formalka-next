# 15 — Experience prototype brief: "Formalka 1.0: Living Case Experience"

**Status:** approved by the owner on 2026-10-15:
- concept: yes, prototype before any product code;
- phones first;
- built in a separate session.

This brief is the input for that session. It merges three sources:
- the owner's own user flow (quoted in §2);
- the independent advisor's corrections (§3);
- the rules from this blueprint (01–14).

## 1. What to build
A **clickable, phone-first experience prototype**. It is not product code:
- no backend, no database, no real AI calls, no network requests;
- every "AI" moment is scripted;
- data is synthetic, except the citizenship procedure content, which is real but labelled (`reference/citizenship/`).

It must run in a phone browser and be shareable as a **private** link that the owner opens and shows to people. Publish it as a private Artifact if the tool is available; never as a public deployment (ADR-N001).

The goal is to show it to 5–8 people and learn whether the experience removes real work, not whether it looks impressive (the advisor's criterion, §3.9).

## 2. The owner's flow (summary of his words, 2026-10-15)
1. **Start.** Open the app: a short start animation, then a minimal screen with one pill-shaped input in the hero: **"Co dziś załatwiamy?"**
2. **First message.** The user types: "przyszedł czas, abym złożył papiery na obywatelstwo polskie".
3. **Morph into a chat.** The pill morphs into a conversation, Messenger/WhatsApp-like. A message arrives: "Hej! Jestem Maciek. Pomogę Ci ogarnąć temat obywatelstwa…". Questions then come one at a time in the pill: answer, send, the answer slides up, the next question replaces it.
4. **Questions.** If an answer isn't enough, Maciek asks differently; if still unclear, he offers options.
5. **The advisor takes over.** Maciek "takes over the case" and the user's **ecosystem** appears: the case, its stages and tasks in order, what comes first. A small pill bar with Maciek's avatar stays at the bottom, so the user can always write to him.
6. **Next step and office.** Maciek says what to do first and which office to go to, asking for the district if needed.
7. **Filling the form.** Tapping the document opens the official form. The user fills it and saves a PDF, which lands in the case's **Teczka** (folder).
8. **Phone reminder.** Next step: "zadzwoń do urzędu" (call the office). Maciek offers a reminder: pick a day, then an hour, then the event is added to the phone calendar. Then he shows what to prepare: fee, documents, "bez tego Cię nie przyjmą" (they won't see you without it).
9. **Stages as game levels** (owner's addition). Locked levels can be previewed. Independent levels run in parallel. "Wszystko zależy od sprawy."
10. **Maciek writes first** (owner's key point). Three days later a phone notification: **"Wiadomość od Maciek · Obywatelstwo"**. Tapping it opens the chat: "Dziś masz jechać do urzędu. Weź: … Adresy: … Zapytam Cię po wizycie, jak poszło".
11. **A second case.** "Ogarnij mi temat karty pobytu" makes the pill morph again: "Asia dołączyła do chatu". The same flow follows for the new case.

The owner's definition of the difference:
> "Wirtualny urząd, ale już z dedykowanym doradcą, który działa, a nie czeka."

The advisor acts on its own: proposing calendar entries, preparing phone numbers, reminding before deadlines, without being asked and without the user opening the app.

## 3. Corrections that are part of the brief (advisor + blueprint)
1. **Hierarchy.** Use these terms consistently:
   - World (all cases);
   - Case (e.g. citizenship);
   - Milestone (a "level");
   - Task;
   - Artifact (Teczka item);
   - Event (reminder, visit);
   - Caretaker (Maciek, Asia).

   Cases can reuse each other's facts or documents only after the user confirms.
2. **Questions as needed, not "6–8".** The number of questions follows what the case still needs: 3 is fine, and more is fine. **"Nie wiem" is always an answer**, and the user is never forced to pick from three options when none fits.
3. **First, find the route.** Citizenship has different routes: recognition by the voivode, or grant by the President (see `reference/citizenship/`). Maciek's first job is to find the route, in plain words, not to promise "your application".
4. **The world builds live.** After the first message, the case appears ("Tworzymy Twoją sprawę: Obywatelstwo polskie"). Each answer visibly grows or prunes the map:
   - undecided levels are shown as **unconfirmed**;
   - at the end, Maciek summarises the assumptions and the user **approves the plan**;
   - only then does the case become active.

   There is no artificial one-minute wait. If something takes time, show the real steps.
5. **Two views of one case.**
   - **Focus** is the default on a phone: "co teraz", the next action, its documents and Maciek.
   - **Map** is the level path, one gesture away.

   Morphing is brand character, but it must never block reading or navigation.
6. **Level states** (game metaphor, honest content):

   | State | Meaning |
   |---|---|
   | locked 🔒 | Always with the reason from the source: "najpierw potrzebujesz X" |
   | available | Can be started now |
   | parallel | Available alongside another level |
   | waiting for the office | Can't be finished by the user's effort |
   | returned | "Urząd prosi o uzupełnienie": back to an earlier level, never "game over" |
   | done by you | The user marked it done |
   | confirmed by the office | Only with evidence the user has |

   Locks exist only where the procedure requires an order. No points, badges or streaks.
7. **Maciek never pretends.**
   - Calendar: "Nie mogę zarezerwować wizyty za Ciebie. Mogę dodać przypomnienie na czwartek 12:00, żebyś zadzwonił. Dodać?" After confirming: "Gotowe. Przypomnienie dodane. Wizyta nie jest jeszcze zarezerwowana."
   - Never "umówiłem", "wysłałem" or "złożyłem".
   - Never "wszystko już wiem". Instead: "Mam wystarczająco dużo informacji, żeby przygotować pierwszy plan. Dwie kwestie wymagają jeszcze potwierdzenia, zaznaczyłem je na mapie."
8. **Honest identity.**
   - Maciek and Asia are AI assistants and say so: in the first message and next to the avatar ("asystent AI").
   - Nothing implies a human ("Maciek zapoznaje się z Twoimi informacjami" is out).
   - The persona is never chosen by nationality or language.
   - No government look: no emblem, no gov.pl-like colours.
9. **Proactivity, the core of the product.**
   - One consent per case at plan approval: "Maciek może sam dodawać przypomnienia i wpisy w kalendarzu do tej sprawy". After that he acts without asking. Every action is shown in the case history and can be revoked.
   - Notifications are at most one per day per case (except on a deadline day), with quiet hours at night.
   - On the lock screen the default is generic ("Maciek: masz dziś jedno zadanie"). The topic is shown only if the user turns it on.
10. **Facts.**
    - Fees, documents and deadlines come only from `reference/citizenship/`, with a visible source link and check date, labelled as an example.
    - The owner's "140 zł" and "dowód osobisty" were illustrations, not facts. Don't use them.

## 4. Screens and moments the prototype must contain
1. Start animation, then "Co dziś załatwiamy?" with the pill.
2. First message, morph into conversation, Maciek introduces himself (AI disclosed).
3. Route finding (recognition vs grant), including one "Nie wiem" answer and one free-text answer Maciek rephrases.
4. The live-building map: unconfirmed levels, pruning after answers.
5. Plan summary with assumptions, then **approve** and the consent for proactive help.
6. Focus view of level 1 and the Map view (locked level with reason, parallel levels, a "waiting for the office" level).
7. Fill a form. This is a mock of an official form, clearly labelled; filling real official PDFs is proven separately in spike S3. Save to the **Teczka**.
8. The calendar moment with the honest wording (§3.7) and the "what to prepare" list from the reference content.
9. **"Przewiń czas o 3 dni"**, a visible tester control. It shows a lock-screen notification, Maciek writing first, and the "jak poszło?" follow-up with three answers that update the map.
10. One failure moment, so testers see honest limits, e.g. "Tego nie wiem z naszych źródeł. Oto oficjalna strona i infolinia urzędu."
11. A second case: "Ogarnij mi temat karty pobytu", "Asia dołączyła do chatu", and the World view with two cases.
12. Reduced motion: every animation has a calm alternative (`prefers-reduced-motion`).

## 5. Design direction
- **Character:** futuristic and minimal, "a bit like a game". Mobile first, one-handed use, thumb-reachable input.
- **Tokens and brand:** use Formalka's tokens and logo from `reference/formalka-design/`. Read `DESIGN-BRIEF.md` §6 (never the generic AI look) and `BRAND.md`.
- **Languages:** Polish first. Long German-style strings and Cyrillic must still fit if a second language is added.
- **Accessibility:** the map always has a list equivalent, with screen-reader labels and contrast per the UI rules.

## 6. Out of scope for the prototype
- real AI;
- a backend and real storage (in-memory state is fine; a reset button);
- real notifications;
- real calendar writes;
- real PDF filling;
- languages beyond Polish;
- store builds.

## 7. Done when
- It runs on a phone browser end to end through §4, in under 15 minutes for a tester.
- It has a reset button and a "przewiń czas" control.
- A short `prototype/README.md` explains how to run it, what is scripted and the test script for sessions with people. The test script includes:
  - the task;
  - three questions after it: what did Maciek do for you, what would you do next, would you come back tomorrow instead of asking ChatGPT;
  - what to observe.
- The owner has a private link.
