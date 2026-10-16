# User journeys in the prototype (round 2)

Each journey below is an automated end-to-end scenario in `prototype/test/e2e.mjs`. It runs in Chromium at 390×844, once with reduced motion and once with full animations. The screenshots in `screens/` come from those runs on the reported commit.

Every screen of every journey is checked for:
- no console errors and no network requests from the page;
- no horizontal overflow, and every icon drawn;
- none of the engine's never-say phrases (`PHRASES_NEVER`: no claimed booking, sending or filing);
- no em dash and no internal identifier shown as text.

All data is synthetic. Fees, deadlines and offices are examples from Formalka's guides (`reference/`, formalka@04057ef), labelled as such in the app.

| Journey | Case | What it shows | Screens |
|---|---|---|---|
| S | Any | The first screens of a case | S01–S03 |
| A | Citizenship | The person's own words, a change after approval | A01–A07 |
| B | Address registration, Warsaw (dark mode) | Forms, offices, call and visit, three days on, "Jak poszło?" | B01–B10 |
| C | PESEL, registration, residence card, certificate | "Nie wiem" and hand-off, someone else's case, four assistants | C01–C03 |
| D | Citizenship | Route choice, filing, the office's request, the fix, undo | D01–D03 |
| E | Address registration, Kraków | Consent, lock screen, follow-up, desktop | E01–E04 |
| F | Address registration (study mode) | The study path, an off-script answer, assumed and skipped steps | F01–F04 |
| G | Residence card | Waiting for the office: "przyspieszyć wydanie karty" | G01–G03 |
| H | None | Home input with words that name no case | H01 |

## S. The first screens of a case

1. The person taps a case on the home screen. Screen S01 shows:
   - one line: "Prototyp: asystent nie korzysta z modelu językowego.";
   - the assistant's short intro ("Dzień dobry, jestem Maciek, asystent AI Formalki. Poprowadzę Cię przez sprawę: … Przy każdej informacji pokażę źródło.");
   - one question: "Załatwiasz to dla siebie czy dla kogoś innego?".
2. After the first answer that builds the plan, a one-line case bar appears with progress and the case's name (S02, S03).
3. While a question is open:
   - the bar stays on one line;
   - a long question is set at body size;
   - the question panel takes at most 55% of the screen.

Changed after the owner's tests of 16.10 ("za dużo informacji naraz"). The type sizes are unchanged.

## A. Citizenship in the person's own words

1. **Home (A01):** "Co dziś załatwiamy?", one input, five case types and a footer that says what Formalka is and is not.
2. **Opening words.** The person types "przyszedł czas, abym złożył papiery na obywatelstwo polskie". Maciek (AI) introduces himself. "abym złożył" already says it is the person's own case, so that question is skipped.
3. **Answers in words (A02):**
   - "nigdy nie miałem polskiego obywatelstwa" becomes a proposal on its own card ("Z Twojego opisu"), confirmed by the person;
   - "tak" answers a yes/no question directly;
   - "mieszkam w Polsce od 3 lat" fits two options, and only those two are shown (A03);
   - "dlaczego o to pytasz?" gets the registry's "why we ask";
   - "nie wiem" is a valid answer;
   - "mam kartę pobytu" is asked back: "Dobrze rozumiem?".
4. **Plan card (A04).** It shows:
   - whose case it is, with "Zmień";
   - the route;
   - fees as an example with the check date;
   - "Plan zgodny z przewodnikami Formalki", with the note that this is not a legal verification;
   - the consent switch.

   The person types "włącz przypomnienia", then "zatwierdzam". Only a short list of complete answers counts as approval (audit F5).
5. **Guidance (A05).** "Teraz: Dokumenty" with actions from the plan. Typed questions:
   - fees: answered;
   - documents: answered;
   - a sworn translator's price: not in the sources, so the official page and free legal aid;
   - the office: answered.
6. **Honest limits (A06):**
   - "qwerty asdf" is asked back with no action (audit F8);
   - a typed PESEL is masked before it is shown, and the reply does not repeat it (audit F7).
7. **A change after approval (A07).** "Mam certyfikat B1" opens a second route. The person chooses it in words ("przez uznanie") and approves the change on a diff card.
8. **Three days on.** Consent is on, but nothing is due on this level.

**Gaps:**
- the reader is a word matcher, and real phrasing will often miss;
- after approval, an answer already given cannot be changed (RESPONSE §6).

## B. Address registration in Warsaw (dark mode)

1. **Questions.** Asia (AI); "Dla siebie"; the group "Żadna z tych grup"; the stay typed as "na stałe"; the city typed as "mieszkam w Warszawie". The plan is approved without consent.
2. **Form stage (B01):**
   - the official PDF link (gov.pl, opens outside the app);
   - "Wypełnij tutaj", a labelled mock;
   - "Urzędy i mapa".
3. **Offices (B02).** 18 district offices with addresses, hours, booking and website links, a Google Maps search link each, and a district filter ("Mokotów").
4. **Mock form (B03).** Sample data, then a draft PDF in the Teczka.
5. **Call and visit (B04).**
   - The assistant offers a call reminder: day typed "jutro", hour "o 10:15", confirmed.
   - "tak, mam": the person has an appointment and gives its day and hour.
   - The reply never claims a booking: "Nie mogę zarezerwować wizyty za Ciebie…".
6. **Case screens:**
   - Teraz with the assistant's card (B05);
   - Start with all cases (B06);
   - calendar with a reminder added (B07);
   - Teczka with the draft (B08).
7. **Three days on, no consent (B09).** No lock-screen notification. The question "Jak poszło w urzędzie?" waits in the chat. The person types "złożyłem wniosek, wszystko ok", which is confirmed on a card and saved.
8. **Session memory (B10).** "Co Asia pamięta w tej sesji": facts confirmed from words, the city, the last hour picked. It lasts until reload or reset.

**Gaps:**
- the visit day in the call flow is fixed three days ahead (a prototype shortcut);
- offices with addresses exist only for Warsaw and Kraków.

## C. "Nie wiem", hand-off, someone else's case, four assistants

1. **PESEL with "Nie wiem" (C01).** The route cannot be set from the sources, so the assistant says so and offers:
   - free legal aid;
   - the related case "Zamelduj się".

   The registration case joins with its own assistant.
2. **Residence card for "mojej mamy".** The case is someone else's, so the questions use the registry's own wording ("W jakim celu ta osoba chce mieszkać w Polsce?"). "przyjechała do pracy sezonowej" becomes a proposal.
3. **Map (C02):** parallel levels, "Teraz", and "Sprawa kogoś innego".
4. **Language certificate.** The snapshot marks exam dates as possibly outdated, and the plan card and guidance say so, with the official page.
5. **World (C03):** four cases, four assistants, four colours. The residence card is marked as someone else's case.

**Gap:** named assistants are a hypothesis (audit F8); the owner decides whether to test them.

## D. Route choice, filing, the office's request, the fix, undo

1. **Two routes (D01).** The answers leave two routes: recognition and grant. The person picks one in words ("przez nadanie") and confirms.
2. **The case screen.** The city is Kraków; the plan is approved with consent. The person ticks tasks until the filing step, then records the filing date.
3. **The office's request (D02).** Recording the request sends the documents level back ("Urząd prosi o uzupełnienie"). Marking the fix as submitted moves the case to "Czekasz na urząd".
4. **Undo and chat.** History offers undo. The chat reflects the state (D03).

**Gap:** a recorded later step implies earlier ones. Such levels show "Zakładamy, że zrobione" (journey F), not "Zrobione".

## E. Consent, lock screen, follow-up, desktop

1. **The visit.** Address registration in Kraków, consent on. "Mam umówioną wizytę" gets an honest reply ("Nie mogę zarezerwować wizyty…") and a visit sheet, then a visit reminder.
2. **Lock screen.** Three days on, a notification appears with the topic hidden by default (E01). The person can show the topic (E02).
3. **Follow-up.** Tapping the notification opens the chat. "Jak poszło?" by chip: "Wniosek złożony" (E03).
4. **Desktop (E04).** At 1280 px: the phone frame with the tester panel (+1, +3, +7 days, reset, study mode).

**Gap:** notifications, the lock screen and calendar writes are simulated.

## F. Study mode (the path for moderated sessions)

1. **Study mode (F01).** "Badanie" on the tester strip: only address registration is offered, and a notice asks for made-up data. The footer shows the build id.
2. **Another case (F02).** Typed from home, "Ogarnij mi temat karty pobytu" leads into the chat. The chat says only registration is studied and offers it.
3. **Off-script answer (F03).** "Przyjechałem z Kolumbii, a co dalej?" fits no option. The reply:
   - picks nothing for the person;
   - says why the question matters (the registry's own words);
   - says what "Nie wiem" does.

   Where someone comes from never becomes a group (rule 4).
4. **Plan, memory, steps (F04).**
   - The plan card names its check without overclaiming.
   - The history names session memory.
   - A filing recorded with the form never ticked leaves the form level "Zakładamy, że zrobione". The owner's confirmation becomes "Pominięte" (struck through, with the engine's reason) and is never the current step.

## G. Waiting for the office

1. **The need first (G01).** From home: "Potrzebuję przyspieszyć wydanie karty pobytu". The person filed and wants it faster, so:
   - the assistant says it cannot speed the office up;
   - it asks the registry's question: "Na co teraz czekasz w tej sprawie?" (decision or card);
   - no question about a new application comes before that.
2. **Decision stage (G02).** The answer quotes the law:
   - where a ponaglenie goes;
   - who rules on it;
   - that one filed too early is left unexamined.

   It adds:
   - the official template (biznes.gov.pl, a free service);
   - a folded caveat on art. 100d, with the ministry's and the RPO's reading, attributed, with no conclusion of our own;
   - free legal aid.

   At the card stage, it shows the guides' notes on the card.
3. **The plan only on request (G03).**
   - "Ułożyć plan całej sprawy?" "Nie teraz": the case stays, without a case bar.
   - "Ułóż jednak plan" resumes the questions.
   - From home, words that name the open case go to it.

**OPEN (for the auditor):** is the art. 100d caveat right for people in this situation, or too complex?

## H. Home input with words that name no case

"cześć, mam pytanie" leads into the chat. The chat offers the five cases (in study mode, only registration), and back returns home (H01). Before 16.10 the home input showed a toast and stopped ("nie mogę nic wpisać").
