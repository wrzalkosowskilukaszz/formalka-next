# 18. Formalka Next as a service: from arrival to registration and PESEL

**Status:** desk research and a plan, written by Claude for the owner on 16.10.2026. No interviews or usability tests have been run (doc 03). Nothing here is an independent review. Every claim carries a label: FACT (with source and date), INFERENCE, HYPOTHESIS, ASSUMPTION or OPEN.

**Scope:** one newcomer's journey, from arriving at an address in Poland to being registered and holding a PESEL, including the PESEL-without-registration route. This covers address registration and PESEL. Out of scope:
- residence permits;
- temporary protection (UKR);
- Polish citizens;
- UK Withdrawal Agreement citizens (excluded from the study, D6).

**Rule for this plan (owner):** no new features and no AI models before Phase 1. Where only research can settle a question, the function is restricted (§7), not guessed.

## 1. Raw material

| Kind | What | Where | Date |
|---|---|---|---|
| Act | Ustawa o ewidencji ludności, Dz.U. 2026 poz. 384 | Extracts:<br>- registration and foreigners: `audit/2026-10-16-round2/reference/sources/`<br>- PESEL and certificates: `research/2026-10-16-service/sources/` | Legal state 10.03.2026; retrieved 16.10.2026 |
| Act | Ustawa o wjeździe… obywateli UE, Dz.U. 2025 poz. 1164, art. 2 (family members) | `audit/…/reference/sources/` | Retrieved 16.10.2026 |
| gov.pl | "Zamelduj się na pobyt stały lub czasowy (dla cudzoziemców)" | `audit/…/reference/sources/` | Updated 11.03.2026 |
| gov.pl | "Uzyskaj numer PESEL – usługa dla cudzoziemców" | `research/…/sources/` | Updated 26.03.2026 |
| City helpline knowledge base | Warszawa 19115 cards:<br>- temporary registration (AO/02/07/K);<br>- permanent registration (AO/02/06/K);<br>- PESEL on application (EU) | `research/…/sources/` | Updated 06.07.2026 and 04.03.2026 |
| Form templates | Temporary-stay form, permanent-stay form, PESEL application: their fields and where they are hard | `research/…/FORMS.md`; field inventory in `spikes/s3-official-form-fill/` | Hashes checked 16.10.2026 |
| Public questions | 10 signals:<br>- forum questions from newcomers and landlords;<br>- the helpline's answered topics;<br>- an employers' letter on the PESEL in-person rule;<br>- a draft amendment | `research/…/PUBLIC-QUESTIONS.md` | 2008–2026 |
| Interview plan | 14 people and 2 experts; the guide, consent, analysis rule | `research/…/INTERVIEW-PLAN.md` | A draft |
| Our own | The registry snapshot (`reference/`, formalka@04057ef), the draft reference and its comparison D1–D10 | `audit/2026-10-16-round2/reference/` | 16.10.2026 |

**Gaps in the raw material:**
- Facebook groups, Telegram and Viber channels, and Reddit could not be reached (a login or a block).
- Helpline call logs are not public.
- No office's internal practice is documented: day count, closed days, translation of documents.

`PUBLIC-QUESTIONS.md` gives a protocol for a person to fill these gaps.

**What the raw material changed today:**
- **OPEN-5 is resolved for Warsaw (FACT, warszawa19115.pl, 06.07.2026):** "osobiście w dowolnej delegaturze Biura Administracji i Spraw Obywatelskich". Any district office accepts the filing. The reference, the checklist, comparison row D8 and the session script were corrected; the app already said "Wybierz najbliższy".
- **The same card puts the owner's confirmation ("pkt 6 wniosku") after both document cases.** INFERENCE: this leans towards "the owner always confirms on paper" for OPEN-12, but the card's layout does not settle it.

## 2. The service, not the app

**Actors.** These are the people and systems the journey depends on. Only the first one uses Formalka.

| Actor | Role in the journey | What Formalka can do for them today |
|---|---|---|
| The newcomer, or a helper acting for them | Must register and, through registration, gets PESEL | The case: plan, deadlines, documents, offices |
| The landlord (owner or another title holder) | Confirms the stay on the form and shows their title document; may refuse or fear the registration (Q3–Q5) | Nothing for the landlord directly. The newcomer sees the no-owner route (D10) |
| The clerk at the district office | Checks documents, registers "niezwłocznie", requests PESEL ex officio (art. 17 ust. 1 pkt 2) | Nothing. A "show the clerk" screen is a later design item (DESIGN-BRIEF §8), not before Phase 1 |
| The employer, bank or other institution | Asks for PESEL, sometimes without a legal basis (Q7) | Nothing. The app quotes gov.pl: the institution should give the basis |
| The state's systems | Booking system (Warsaw), gov.pl e-registration (EU only), e-Doręczenia, ePUAP, PESEL register | Links from the registry only. No integration, no account, nothing filed |
| Helpers outside the state | Friends, groups, NGOs, Migrant Info Points, 19115 | A pointer to free legal help (registry note), nothing more |

**Channels:**
- the phone, where the app is;
- paper (the form, signatures, document originals);
- the office desk;
- the city's booking site;
- gov.pl (online registration for the EU group);
- e-Doręczenia (online certificates since 1.01.2026; FACT, 19115);
- the cash desk or a transfer (17 zł for the temporary certificate).

**The service's promise, and its boundary:** Formalka helps a person know what to do, by when, where and with what, from verified sources, and keeps their case on the device. It never files, books, sends or pays (product rule 6). It does not speak to the landlord, the office or the employer.

## 3. The journey (stages S0–S9), with steps outside the phone

Each "where people get lost" item is a loss point (L1–L14). Its evidence label says how much we actually know. Most are HYPOTHESIS until the interviews.

| Stage | The person's goal | Steps (on the phone / **off the phone**) | Sources | Where people get lost |
|---|---|---|---|---|
| **S0** Before moving | Know whether and when they must register | Phone: read. **Off: arrange a flat; agree the registration with the landlord** | — | **L5** (the landlord, see S3), raised too late |
| **S1** Arrival at the address (day 0) | Know that the clock has started | Phone: record the move-in date. **Off: nothing yet** | UEL art. 41–42: 4th day for non-EU, 30th day for EU/EFTA/CH and family; no duty up to 30 days of stay | **L1:** does not know registration is required, or confuses it with a residence permit (Q1, HYPOTHESIS). **L2:** does not know the deadline, or when it starts. The count is unclear (OPEN-1), and the last day may fall on a closed day (OPEN-2, D7) |
| **S2** Which rules apply | Know their group and kind of stay | Phone: answer the questions; "Nie wiem" | UEL art. 25, 41; UE2006 art. 2 | **L3:** wrong group: family members, UK, dual citizens (Q2), family of a Polish citizen (D5). **L4:** permanent vs temporary ("intention", HYPOTHESIS) |
| **S3** The owner's confirmation | Get the owner's signature on the form and their title document, or take the no-owner route | Phone: see what is needed. **Off: talk to the landlord; get the signature; borrow the title document or its copy** | UEL art. 28 ust. 2, 2b; GOV "Problem z zameldowaniem"; 19115 | **L5:** the landlord refuses, is unreachable, or fears the registration (Q3–Q5). Even an office by phone gave a different answer than the act (Q3). **L6:** the lease is in someone else's name (Q1); whether a tenant's lease is enough (OPEN-12) |
| **S4** The form | A correct form for each person | Phone: practise on a mock (sample data). **Off: print or fetch the official form; fill it in capitals; sign** | `FORMS.md` | **L7:** the PESEL box when the person has none; "kraj miejsca zamieszkania"; address fields; one form per person, children included (FACT, 19115). **L8:** a declared end date beyond the legal stay (art. 41 ust. 4; FACT rule, HYPOTHESIS that people err) |
| **S5** Getting to the office | Arrive at an open office, in time, with everything | Phone: offices, hours, booking link, what to bring (Teczka). **Off: book (optional); travel; queue** | 19115: any Warsaw delegatura; hours Mon 8–18, Tue–Fri 8–16 (registry) | **L9:** which office (any in Warsaw, FACT); the 4th day on a weekend (D7); in person only without PESEL (art. 40 ust. 3, D3) |
| **S6** At the desk | Leave registered | Phone: Teczka as a checklist. **Off: show documents; answer the clerk; sign** | GOV: registered "od razu"; 19115: "niezwłocznie" | **L10:** a missing original, or the owner's title document. Without the owner there is an administrative procedure and a decision, not "od razu" (D10; how long is OPEN-8) |
| **S7** After registration | Have proof and the PESEL number | Phone: mark done. **Off: collect the certificate (permanent: ex officio; temporary: on request, 17 zł); learn the PESEL** | UEL art. 17, 21, 32; 19115 | **L13:** the temporary certificate is a separate request (FACT, Warsaw); online it needs an e-Doręczenia box (FACT since 1.01.2026). How and when the person learns the PESEL after registration is OPEN |
| **S8** PESEL without registration | Get PESEL when registration is not possible | Phone: the PESEL case. **Off: get a legal basis from whoever requires PESEL; fill the application; appear in person (non-EU); fix gaps within 7 days** | UEL art. 16–18, 21; gov.pl; 19115 | **L11:** no legal basis, the most common failure (Q7). **L12:** since 1.01.2026 in person, no proxy, for non-EU (Q8). Notification on paper or via ePUAP, and newcomers rarely have ePUAP (HYPOTHESIS) |
| **S9** Living with it | Keep the registration right | Phone: nothing yet. **Off: re-register when moving (a new temporary address replaces the old one, FACT 19115); mind the end of the declared period** | UEL art. 32 ust. 4; 19115 | **L14:** registration is mistaken for legal stay (Q1, HYPOTHESIS). The temporary registration expires with the declared period. PESEL is the gateway to trusted profile, e-Doręczenia, ZUS and tax (Q8) |

**The critical moments** (DESIGN-BRIEF §7) are where design and testing effort goes first:
1. **S1→S2, knowing the deadline and its start:** L2. For a non-EU person, a mistake costs days.
2. **S3, the owner:** L5, L6. The step is outside the person's control, and the app cannot act.
3. **S6, the desk:** L10. A second visit is the cost the product exists to prevent.

## 4. The six functions: need, assumption, harm, test, confirmer

The same table for each function. "Restriction now" is what holds until the assumption is confirmed (detail in §7).

### 4.1 Rozmowa (the chat, a deterministic reader; no language model)

| | |
|---|---|
| **Need** | S1–S2: state the situation in one's own words and get the right questions; L3, L4 |
| **Assumptions** | **A1:** people can answer in words the reader takes, or use the options. **A2:** people find and use "Nie wiem" when unsure. **A3:** people understand they are talking to an AI program, not an official or a lawyer |
| **Harm if wrong** | A misread answer becomes a confirmed fact: wrong group, wrong deadline (L3). Over-trust (A3) leads to acting on a hedged answer as if certain. The regressions found 5 reader failures on `6b3d874`, all now changed in the lab, none independently checked |
| **Test with people** | Phase 1 sessions:<br>- log every typed answer and what the app understood (misread rate);<br>- count M2 "Nie wiem" uses;<br>- ask the limits questions (script).<br>Interviews: how people describe their situation (the words feed the reader's tests, never a model) |
| **Who confirms, besides us** | A plain-language reviewer (the questions' Polish). A migration lawyer or law clinic (that the questions separate the groups correctly). The auditor (misread analysis on blind inputs) |
| **Restriction now** | Polish only. Hedged or contradictory answers are asked back. Nationality never sets the group. No language model |

### 4.2 Mapa (the route of steps, their states and order)

| | |
|---|---|
| **Need** | S1–S7: see the order and what blocks what; know which step is now, including steps off the phone (S3, S6) |
| **Assumptions** | **A4:** seeing the order helps people act on the next step, rather than distracting from it. **A5:** people read the states correctly: locked, skipped ("Pominięte"), implied ("Zakładamy, że zrobione"), "Do ponownego sprawdzenia". **A6:** people recognise the off-phone steps (the landlord, the desk) as theirs to do |
| **Harm if wrong** | An implied step read as done hides a missing document. A locked step read as forbidden stops a person who may act (D10: filing without the owner). Too much at once causes the overload the owner reported on 16.10 |
| **Test with people** | Sessions:<br>- after M1 and M3, ask "Który krok jest teraz?" and "Co oznacza ten znak?" for two states;<br>- score the answers. Interviews: how people tracked their steps before (paper, notes) |
| **Who confirms** | An accessibility auditor (states not by colour alone; screen-reader order). A plain-language reviewer (state names) |
| **Restriction now** | The map stays secondary to "Teraz". No information exists only on the map. The step states come from the engine; there are no new states |

### 4.3 Teczka (the documents, as a checklist on the device)

| | |
|---|---|
| **Need** | S5–S6: arrive with every document, so there is no second visit (L10) |
| **Assumptions** | **A7:** a checklist named as the office names the documents reduces missing items. **A8:** people need no photos or scans in the app to benefit; a privacy risk is avoided (ADR-0009). **A9:** people understand where the list lives: on this phone only, and in the prototype gone after reset |
| **Harm if wrong** | A wrong or missing item causes a second visit, or a missed 4th day. Examples: the owner's title document; the visa for non-EU (D2); a family member's card (D1). A stored passport photo would put sensitive data on a device the person may share |
| **Test with people** | Sessions: score the "what to bring" items (checklist B, items 7–8) against the reviewed reference. Interviews: what was missing at their last visit (L10) |
| **Who confirms** | A registration clerk (the documents' names, what the desk asks for in practice). A lawyer (alternatives, D1–D6). A privacy reviewer (nothing stored beyond the list) |
| **Restriction now** | A checklist only: no uploads, photos or scans. The groups with unresolved document rules (D1, D2, D4–D6) are out of the study |

### 4.4 Formularze (the official forms)

| | |
|---|---|
| **Need** | S4: a correct form, once (L7, L8); the PESEL application (L11) |
| **Assumptions** | **A10:** offices accept an official form filled by software (OPEN since spike S3). **A11:** practising on a mock helps fill in the real form correctly. **A12:** the hard fields are the ones in `FORMS.md` (declared end date, owner's statement, PESEL box, legal basis) |
| **Harm if wrong** | A refused form means a second visit. A declared end date past the legal stay breaks art. 41 ust. 4 (HYPOTHESIS on consequence: OPEN). A suggested legal basis on the PESEL application would be an invented requirement (product rule 2) |
| **Test with people** | Interviews: show the blank official form and ask where they struggled (A12). Sessions: not tested; the form is a mock |
| **Who confirms** | 2–3 registration clerks (A10: do they accept it; which fields fail most). A lawyer (art. 41 ust. 4 consequence). An accessibility auditor (the mock form's labels and errors) |
| **Restriction now** | The mock is labelled "Makieta, nie oficjalny formularz", with sample data only. The app links the official blank PDF. No filled official PDF is produced. No legal basis is ever suggested |

### 4.5 Przypomnienia (reminders and calendar entries; simulated)

| | |
|---|---|
| **Need** | S1–S5: do not miss the 4th or 30th day (L2); the visit (S5) |
| **Assumptions** | **A13:** people want reminders for a short procedure and give consent knowingly (one switch per case). **A14:** the dates are right: both readings, and closed days (D7). **A15:** a reminder never reads as a legal guarantee ("bezpieczny termin" is not "the law says") |
| **Harm if wrong** | A reminder on a Sunday for a closed office sent a person to a closed door (fixed on `lab/quality-pass`: the last reminder comes on the last working day before). A reminder read as a guarantee lets them file on the later reading and risk the fine (art. 59, non-EU) |
| **Test with people** | Sessions: whether consent was given by reading or by reflex (a confirmation under 2 s), and the limits question "Czy coś zostało zapisane na jutro?". Interviews: who reminded them before, and how they would want it (A13) |
| **Who confirms** | A lawyer (the safe reading and wording of the fine). A privacy reviewer (lock-screen detail off by default; no topic on the lock screen) |
| **Restriction now** | Simulated, in-app only; nothing is scheduled on a real device. The lock screen shows no topic unless the person chooses. A safe date on a day off gets its last reminder on the working day before; the date itself never moves |

### 4.6 Czekanie na urząd (waiting for the office)

| | |
|---|---|
| **Need** | S6–S8: know whether they are waiting, for what, and what they may do. For registration this is short, except the no-owner procedure (OPEN-8). For a PESEL application: "przyjmie od razu" and then a notification (gov.pl), with no time stated |
| **Assumptions** | **A16:** the app cannot know how long the office takes when the sources give no time, and says so. **A17:** people tell "Urząd ma czas" (the office's time) from their own deadline. **A18:** people know whom to ask when nothing happens, without the app suggesting remedies its sources do not give |
| **Harm if wrong** | An invented waiting time or remedy, for example a ponaglenie for registration, sends a person on a wrong formal route. Worse is a false "you are registered" |
| **Test with people** | Sessions: M3, "Co dzieje się po złożeniu bez potwierdzenia właściciela?", scored "a procedure and a decision; time unknown". Interviews: what happened after their filing |
| **Who confirms** | A registration clerk (OPEN-8 in practice; how people learn their PESEL). A lawyer (art. 31 decisions) |
| **Restriction now** | The waiting answers (ponaglenie) exist only for the residence card. Registration and PESEL show no waiting time and no remedy. D10 notes are placed on the steps they qualify |

## 5. A design system and structure that tests can check

No new components. The work is to **name what exists, state its rules, and test every rule**. A rule that no test or named person checks is not a rule.

### 5.1 Rules and how each is checked

| # | Rule (from DESIGN-BRIEF §3, §6 and CLAUDE.md) | Check | Status on this branch |
|---|---|---|---|
| D1 | Every visual value comes from `tokens.css` | `prototype/test/design.test.mjs`: no raw colour, font size, weight, radius, duration or z-index in `app.css`; no text token below 12 px | **Met on `lab/quality-pass`.** It was not met on 16.10: 103 raw values, including 9–11 px text |
| D2 | Text contrast at WCAG 2.2 AA; states never by colour alone | axe-core 4.13.0 in e2e on every checked step (WCAG 2.0–2.2 A/AA rules), light and dark, both motion modes; a manual check by an accessibility auditor | **Automated on `lab/quality-pass`:** 0 serious or critical. The automated rules cannot judge everything; the manual audit stays |
| D3 | Touch targets ≥ 44 px | e2e: every control measures ≥ 44×44 px; links inside running text and the tester's controls are exempt | **Met and tested on `lab/quality-pass`** |
| D4 | Motion ≤ 200 ms and only to explain; reduced motion respected | e2e in both modes (exists: 9/9 each); a duration lint (D1) | Partly met (D1) |
| D5 | Never claim an action that did not happen | `checkScreen`: the never-say list on every screen (exists) | Met for listed phrases |
| D6 | No internal identifiers, no em dash, no horizontal overflow | `checkScreen` (exists) | Met |
| D7 | Every fact shown has a source | Engine content check (exists); e2e: every fee, deadline and office card carries a source link | Engine met; the UI side is not asserted per card |
| D8 | The assistant says it is an AI | e2e: intro and persona (exists, scenario B) | Met |
| D9 | One primary action per screen on mobile | e2e: at most one control with the accent fill in view (selected states and covered screens excluded) | **Met and tested on `lab/quality-pass`** |
| D10 | Plain Polish: short sentences, second person, no jargon without its everyday word | A copy lint (sentence length, a banned-jargon list), plus a plain-language reviewer | Not tested |
| D11 | Reflow and text resize without loss (WCAG 1.4.10 at 320 CSS px; 1.4.4 text at 200%) | e2e scenarios Z1 and Z2: no sideways overflow and nothing cut off, on every step | **Met and tested on `lab/quality-pass`.** Overlap of elements is not measured; screenshots are checked by eye |
| D12 | No government look-alike | A manual review against the owner's brand rules | Manual |

### 5.2 Components (what exists, named once)

Each component gets a contract: what it shows, its states, the rules above that apply, and the test that holds it.

| Component | Shows | States | Rules | Test |
|---|---|---|---|---|
| StateChip | A step's state | unconfirmed, locked, available, in_progress, waiting_office, returned, done, skipped; plus the implied flag and the recheck mark | D2 (text and icon), D10 | e2e F, I (state text) |
| DeadlineCard | The rule, the date or both readings, a closed-day warning, the source | applies, may not apply, no date yet (form to record) | D7, D10 | Unit (dueRange), e2e B |
| TaskRow / FeeRow | A document or fee, its condition, alternatives, source | applies, "sprawdź", done | D7 | e2e A, B |
| OfficeCard | Name, address, hours, booking link, map link | one, many (filter) | D7, D3 | e2e B, D |
| PlacedNote | A registry note on the step it qualifies, with a lead-in | shown, hidden once its condition is done | D7, D10 | e2e B, I |
| ApprovalCard (plan / change / correction) | What changes; Tak / Nie | plan, diff, empty diff, unrouted | D5, D9 | e2e A, I; unit (strict consent) |
| AnswerList | The answers with "Popraw" | normal, a correction pending (disabled) | D9 | e2e I |
| Banner (recheck, stale, study) | A pending decision, an outdated source, study scope | — | D2, D10 | e2e F, I |
| Teczka list | The documents per case, as checkboxes | empty, partly ticked | D3, D7 | e2e B (opened; items not asserted) |
| Sheet, Toast, Dock | Containers | open, closed | D3, D4 | e2e (all) |

### 5.3 Structure (information architecture), and what each screen must always show

| Screen | Must always show (the proposed contract) | Coverage today |
|---|---|---|
| Start | The input; the study notice and scope in study mode; the build id | e2e F, H |
| Case → Teraz | The current step and its state; the deadline with both readings; what to bring; where; the AI's limits through the study note; a pending correction, if any | e2e B, F, I |
| Case → Mapa | Every step with a state in words; the current one; off-phone steps named as the person's | e2e F, I |
| Case → Historia (sheet) | What the person did and decided; corrections, with old and new values | e2e I |
| Czat | Who is speaking (AI); the open question with "Nie wiem"; never a claim of action | e2e A–I (checkScreen) |
| Teczka | The documents by case; "Tylko na tym telefonie" | e2e B opens it; the contract is not asserted |
| Kalendarz | Only dates the person recorded or the plan computed, each with its source | e2e B opens it; per-item sources are not asserted |

**Proposal (no new feature):** turn these contracts into one e2e test per screen, run on every scenario state. Today the checks are spread across the scenarios.

## 6. Measures, with thresholds set before any session

**Rule:** these thresholds are fixed now, before data. A result is reported against them, whichever way it falls. Changing a threshold later needs a written reason in this file, dated, and the auditor told.

### 6.1 Phase 1 moderated sessions (6–8 people; the script in `prototype/README.md`)

| Measure | Definition | Threshold to continue | If missed |
|---|---|---|---|
| **Critical errors** | The app shows a wrong deadline group, a wrong office, a wrong required document for an in-scope group, or claims something was sent, booked or filed | **0** | Stop the sessions; fix; re-check by someone other than the author |
| **Correct next action (app)** | Checklist B item 1, scored against the reviewed reference | ≥ 6 of 8 (≥ 5 of 6 if 6 people) | Revise the Teraz and Mapa content; no new features |
| **Non-inferiority vs. checklist** | Correct next action, app vs. checklist A | The app is not worse than the checklist by more than 1 participant | The app's value over a page is not shown: stop the expansion |
| **Confident and wrong** | Confidence 4–5 with a wrong next action | ≤ 1 participant | Revise where the over-trust came from (wording, card) |
| **Error recovery (M1)** | After the correction, names the right form with the deadline unchanged | ≥ 6 of 8 | Revise the correction flow's wording |
| **Approval read** | In M1, the proposed change was looked at for ≥ 2 s before "Tak" | ≥ 6 of 8 | Revise the diff card |
| **Moderator help** | Level 3 (pointing) per task | Median 0; no task with more than 2 | Mark the step where it happened as a design problem |
| **Limits: nothing sent or booked** | Says no | 8 of 8 | Any miss: change the copy before the next session |
| **Limits: session only** | Says the case will not be there tomorrow | ≥ 7 of 8 | Revise the memory wording |
| **Limits: an AI, not advice** | Says it is an AI program and not legal advice | ≥ 7 of 8 | Revise the intro |
| **Reader misreads** | A typed answer read as a different value | Logged, with no threshold. A misread that leads to a wrong action counts as a **critical error** | — |
| **Time to the first correct next action** | From the task's start | Recorded and compared with the checklist; **no threshold** (exploratory) | — |

### 6.2 Phase 1 interviews

See `research/…/INTERVIEW-PLAN.md` §4:
- a loss point is **confirmed** at ≥ 3 of 12 unprompted reports, or 1 expert reporting it as frequent;
- it is **not seen** after 12 with none.

### 6.3 Gates outside sessions (before any session that scores correctness)

| Gate | Threshold |
|---|---|
| Reference review (an expert, signed) | Every in-scope row "agree", or its function restricted. Every OPEN item on the in-scope cards answered, or scored as uncertain |
| Accessibility (automated) | axe-core: 0 serious or critical issues on every screen, light and dark |
| Accessibility (an external auditor; before a beta, not before Phase 1) | 0 blockers against WCAG 2.2 AA, with screen-reader users in the test |
| Design rules (§5.1) | D1, D3, D5–D7 tests pass on the build used in the sessions |

### 6.4 Service measures for later (they need real cases, NO-GO now)

These are listed so nobody measures success by app use alone. They are not collected before a pilot with real cases is approved:
- registered within the deadline, as the person reports it;
- second visits to the office;
- time from arrival to registration;
- PESEL application left unexamined (the 7-day gap);
- the person's own confidence that they did it right, compared with what happened.

## 7. What only research can settle, and the restriction until then

| # | Question | Why we cannot settle it at a desk | Research that settles it | Restriction now | In place? |
|---|---|---|---|---|---|
| R1 | Day count and closed days for the 4th and 30th day (OPEN-1, OPEN-2) | The act's text allows two readings | A law clinic or the ministry; office practice from a clerk | Both dates shown; plan for the earlier; closed-day warning; the date never moved | Yes (D7). The last reminder moves to the last working day before a closed safe date (`lab/quality-pass`) |
| R2 | Must a tenant with a lease still get the owner's confirmation (OPEN-12)? | The act and the cards do not settle it | A clerk, a lawyer | The app keeps the owner's step (safe course); the scoring never marks the lease alone wrong | Yes |
| R3 | How long the no-owner procedure takes, and whether filing on time is enough (OPEN-8) | No source gives a time | A clerk, a lawyer | No time and no remedy shown; the procedure note placed on the step | Yes (D10) |
| R4 | Do offices accept software-filled forms (A10)? | Office practice | 2–3 clerks | The form is a mock with sample data; the official blank is linked | Yes |
| R5 | Do people want reminders, and do they consent knowingly (A13)? | Preference and behaviour | Interviews; sessions (approval read) | Simulated, in-app only; one switch, off by default | Yes |
| R6 | Is the map useful or overload (A4, A5)? | Behaviour | Sessions | Teraz first; the map secondary; nothing only on the map | Yes |
| R7 | How and when a person learns their PESEL after registration | Practice; art. 21 says only "powiadamia" | A clerk; interviews (S7) | The app does not say how or when. The registry's note says only "Dostaniesz numer PESEL z urzędu – jeśli zameldujesz się…", and the app adds no time | Yes |
| R8 | Which legal basis applies to a PESEL application | The person's own obligation; only the requiring institution knows | Not a research question; the institution answers it | Never suggested; gov.pl's sentence quoted | Yes (registry note `legal-basis`) |
| R9 | Group-specific documents and rules for D1, D2, D4–D6 | Registry content disagrees with the act | A lawyer; registry fixes (owner, production content) | Those groups are out of the study | Yes |
| R10 | Whether the landlord needs content of their own | Unknown need (Q3–Q5) | Interviews with landlords | None for landlords; no new function | — |
| R11 | Whether UA, RU or EN users understand the Polish-only flow | Untested | Sessions in those languages, later | Polish only in the study | Yes |
| R12 | Whether a draft change on PESEL and the trusted profile is in force (Q9) | Draft status | The Sejm's tracker | Nothing said about it | Yes |

## 8. Who outside us confirms what

Each confirmer is a named person and role, chosen by the owner. Any cost needs the owner's approval.

| Confirmer | What they confirm | When |
|---|---|---|
| A migration lawyer or a university law clinic | The reference (R1, R2, R3, R9), the deadline and fine wording (A14, A15), that the questions separate the groups (A1) | Before any session that scores correctness |
| A registration clerk (a Warsaw delegatura, and one other municipality) | Documents in practice (A7), form acceptance (A10), PESEL notification in practice (R7), the no-owner procedure (R3) | Before Phase 1 sessions; an expert interview |
| An NGO adviser or helpline (Migrant Info Point, 19115) | The loss points they hear most; public-question coding | During the interviews |
| An accessibility auditor, with screen-reader users | D2, D3, D11; the states (A5) | Automated before Phase 1; the external audit before a beta |
| A plain-language reviewer | D10; the questions and state names | Before Phase 1 |
| A privacy reviewer | A8, the lock screen, notes and recordings handling | Before the interviews |
| The external auditor | Blind inputs for the reader (A1); this plan's thresholds; re-check of C1 and the regressions | Before Phase 1 sessions |

## 9. Next steps (Phase 1 only)

1. **Owner:** approve the interview plan and its data handling; choose the confirmers in §8.
2. **Interviews (GO now):** 14 people and 2 experts. Code against L1–L14 and A1–A18.
3. **Tests that hold the design rules (no new features):**
   - the token lint (D1), and fixing the raw values it finds;
   - axe-core in e2e (D2);
   - the touch-target check (D3);
   - the per-screen contracts (§5.3).
4. **Moderated sessions:** only after the gates in §6.3. The thresholds in §6.1 hold.
5. **No beta, no production, no real cases.** No new features and no AI models before Phase 1 ends.
