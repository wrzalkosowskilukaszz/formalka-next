# Residence permit and card: the engine compared with the draft reference

**Status:** written by Claude on 16–17.10.2026; not independent. Changed in the lab; not independently verified.
- **The reference** is `RESIDENCE-REFERENCE-DRAFT.md`, which is not blind.
- **The engine output** is `engine-output.txt`, produced by `node audit/2026-10-16-residence/engine-output.mjs`. It prints every note, so a claim that the engine "does not mention" something can be checked.
- **The engine and its registry** are production's guide `temporary-residence` (`reference/residence/`, legally audited on 2026-10-02). The lab does not edit it. Where the guide should change, this file lists a finding for the owner (§3). Where a person could be harmed meanwhile, the prototype is restricted (§2).

Reading the engine's notes found four provisions the draft had missed: art. 225c, 225b, the special act's art. 100d, and art. 229 ust. 4. The draft was corrected after each was checked in its primary text (its §9).

## 1. Rows

"Agreement" means the engine and the reference say the same thing, with the same basis.

| # | Topic | Reference | Engine (plan, notes) | Result | Harm if wrong | What the lab did |
|---|---|---|---|---|---|---|
| D1 | Filing deadline: the last day of legal stay (art. 105 ust. 1) | The rule; a date only if the person gives it; reminders before it | The rule as an important route note (`file-in-legal-stay`, `dont-wait`). No fact for the date, so no dated deadline and no reminder: the agenda is empty (RC1) | Agreement on the rule. **Gap:** no reminder for the most important date | **High:** illegal stay | Restricted: the case says it does not know the date and will not remind (`RESIDENCE_SCOPE`). Finding P1 |
| D2 | The MOS account: trusted profile (QA 2), PESEL on the account form (art. 225b ust. 3 pkt 6) | The plan names it first; OPEN-R1 | The filing step points to a separate MOS guide (`seeProcedures: mos-filing`) that the lab's snapshot does not hold. No residence note names PESEL or the trusted profile as a condition for the account; one Mazowiecki note names both, for e-Doręczenia | **Gap** | **High:** the person learns on the last day that they cannot file | Restricted: the case says the account is not described and to check it early (`RESIDENCE_SCOPE`). Finding P2 |
| D3 | Fees | 440 zł work, 340 zł study and family, 100 zł card; exemptions; 50% card relief | The same amounts and exemptions; the relief as a note | Agreement. The relief's Polish wording is a fragment (see D5) | Low | The relief note is shown with its quotes (D5) |
| D4 | MOS down on the last day | Art. 225c: by the 3rd working day after the repair; filed on the outage's first day | The same rule, quoting art. 225c; repair on Monday 30.11.2026 gives Thursday 3.12.2026, with a warning on 1.12 | Agreement. The engine was ahead: the draft had no basis (K1) | Medium | Draft corrected |
| D5 | Legal stay while waiting (art. 108 ust. 1 pkt 2, ust. 2) | Only if filed on time and without formal defects (or remedied in time); not if suspended at the person's request | The Polish statement is the bare clause "pobyt cudzoziemca … uważa się za legalny od dnia złożenia wniosku…", without the conditions or the exception. The English text and the quotes have them | **Disagreement in Polish** | **High:** "your stay is legal" read without its conditions | Restricted: a note whose Polish text is a fragment is shown with all its quotes, in the registry's words (`noteText`). Finding P3 |
| D6 | Calls: to appear (≥7 days), for documents (≥14 days), formal defects (≥7 days), fee (7–14 days) | Dates only from the letter; missing a call ends the case | The call step, `no-show-ends-case`, `fee-in-advance`; no event to record a call, so no dates | Agreement on content. **Gap:** no reminder | **High:** the case is discontinued | Covered by the same scope line as D1 |
| D7 | The 60-day decision limit | No date; until 4.03.2027 the limits do not run (SA art. 100d) | `decision-time-suspended` (art. 100d, important); no date | Agreement. The engine was ahead (K3) | Medium | Draft corrected |
| D8 | Delay: ponaglenie while art. 100d applies | Not offered as a step before 4.03.2027; the special act first; free legal aid | The registry's waiting notes are complete: the ponaglenie, art. 100d, and how MSWiA, the RPO and the NSA read it. **The prototype's** waiting answer led with the ponaglenie, made its template the primary action, and folded art. 100d away | **Disagreement (prototype)** | Medium: effort spent on a step the special act disarms; false hope | Restricted: while the plan carries `decision-time-suspended`, the answer leads with it in full, and free legal aid is the primary action. When the registry drops the note, the old order returns. Content unchanged |
| D9 | Refusal and appeal | 14 days from delivery (KPA art. 129 § 2), to the Szef UdSC through the voivode, outside MOS | No step after a refusal; the card level is hidden; nothing about an appeal | **Gap** | **High:** a missed appeal | Restricted: on a refusal, the decision step says the case goes no further and links the registry's own handoff (free legal aid). Finding P4 |
| D10 | The first card | Ex officio, except art. 229 ust. 4 (family reunification from abroad and others: on application) | `wait-card-ex-officio`; for family abroad, "o pierwszą kartę pobytu ta osoba składa osobny wniosek", quoting art. 229 ust. 4 | Agreement. The engine was ahead (K4) | Medium | Draft corrected |
| D11 | Collecting the card | In person with a valid travel document; child rules | The same (`wait-card-in-person`, the card step); the Mazowiecki office sends pickup information to the e-Doręczenia box | Agreement; the engine answers OPEN-R9 for one voivode | Low | — |
| D12 | Office | The voivode of the place of stay; for family abroad, of the family member in Poland | Mazowiecki for Warsaw, Małopolski for Kraków; for family abroad, the place given | Agreement | — | — |
| D13 | Channel | MOS; paper for the art. 106l cases | MOS; paper for `family_abroad`; `paper-scope` separates art. 158 | Agreement | — | — |
| D14 | A Polish citizen's spouse (RC3) | Art. 158, MOS, 340 zł | No own option; "family" is labelled "połączenie z rodziną", which is art. 159. Fee and channel right | Label mismatch | Low | Finding P5 |
| D15 | The attachment level for purposes with no third-party attachment (family) | No such step | Shown as available: "Jeśli trzeba, poproś pracodawcę, uczelnię albo organizatora stażu o załącznik" | Noise | Low | Finding P6 |
| D16 | The end of the purpose (art. 113: notify within 15 working days); a lost job on a single permit: in writing, art. 121, with the 30-day protection of art. 123 (added after the check of 17.10.2026) | In the plan after the permit | Nothing after the card | **Gap** | Medium–high | No restriction: the case ends at the card, and the lab adds no rule of its own. Finding P7 |
| D17 | Work and travel while waiting | Travel: "Nie wiem", and where to ask. Work (added 17.10): it depends on the basis before filing (act on employing foreigners art. 3 ust. 1 pkt 18, ust. 3 pkt 2), the person's own case for the voivode or a lawyer | No notes. The prototype's reader: "czy mogę wyjechać…" and "czy mogę pracować…" get "Nie jestem pewna, co masz na myśli" and the list of what it can help with; "czy mój pobyt jest legalny po złożeniu wniosku?" is routed to the form answer (the word "wniosku") | Safe (no rule claimed), but unhelpful | — | Noted for the reader's next pass; no feature before Phase 1 |
| D18 | Changes after filing; letters outside MOS | QA 42, 49–52 | `wait-mos-not-channel`, `wait-electronic-address`, the Mazowiecki notes | Agreement | — | — |
| D19 | Purpose unknown | Every fee and attachment, marked as possibly not applying | The same, with "sprawdź" | Agreement | — | — |
| D20 | The employer's link (30 days) and unsigned drafts (45 days) | QA 30; art. 225h | Not mentioned | Gap | Low–medium | Finding P8 |
| D21 | Short stay fees (RC15, added 17.10) | One of 85 zł or 340 zł, by reason (OS item 2a) | Both stamp duties apply at once, each with its own description; **the prototype added them up**: "525 zł opłat" with the card | **Disagreement (prototype)** | Medium: a wrong total, an overpayment | Restricted: two stamp duties for one permit are listed, never summed (`feeSum`). Finding P11 |
| D22 | Business (RC13) | An employer's attachment only for board, partner or proxy work (art. 106 ust. 2) | The employer's attachment for every business purpose, without a condition | Over-requirement | Low–medium: a sole trader looks for an employer | Finding P10 |
| D23 | Traineeship or volunteering (RC12) | The organiser's attachment; 340 zł | The same | Agreement | — | — |
| D24 | Seasonal work (RC14) | 170 zł | 170 zł | Agreement on the fee; nothing else compared (OPEN-R15) | — | — |
| D25 | The card after a granted decision on the paper route (RC4, found by evaluation scenario res-08 on 17.10) | The card follows the decision (on application, art. 229 ust. 4) | The card stayed locked: "Najpierw: Wezwanie z urzędu", a conditional call for missing papers that may never come. The paper route has no decision level, so nothing implied the earlier steps | **Disagreement (lab engine)** | Medium: the person waits for a call that is not coming | Changed in the lab's engine: the event a level requires (a granted decision) now implies the steps before it, as a recorded later step already did. Engine test, mutation `planner-required-event-implies-nothing`, scenario res-08 |
| D26 | Paying on the paper route | The fee comes before filing (the registry's own step title says so) | The paper filing step does not depend on paying, so "Opłaty" stays open after the application was filed and decided | Stale to-do | Low | Finding P12 |

## 2. Restrictions in the prototype, and the test that fails without each

| Restriction | Rows | Code | Test |
|---|---|---|---|
| The residence case names what it does not cover: not verified; no reminders for dates it does not know; the MOS account not described; nothing after a refusal | D1, D2, D6, D9 | `RESIDENCE_SCOPE` (`10-cases.js`), shown on Teraz (`40-case.js`) | `prototype/test/notes.test.mjs` (the scope test); e2e J; the Teraz screen contract in `checkScreen` |
| A registry note whose Polish text is a fragment of a provision is shown with all its quotes | D5, D3 | `noteText` (`10-cases.js`), used for level notes, placed notes and the waiting answer | `notes.test.mjs` (three tests; with `noteText` returning the bare statement, three fail); e2e J (the route notes) |
| While the special act's suspension is in the plan, the waiting answer leads with it and free legal aid is primary | D8 | `suspensionNote`, `waitStageHTML`, `waitActions` (`46-waiting.js`) | e2e G: the order, the open list, which link is primary |
| After a refusal, the decision step says the case stops here and links the registry's handoff | D9 | `refusalHTML` (`40-case.js`) | e2e J |
| Two stamp duties for one permit are listed, never summed (the map, the Teczka, the fees answer) | D21 | `feeSum` (`10-cases.js`), used in `40-case.js` and `45-guide.js` | `notes.test.mjs` (with the sum always taken, it fails) |

The rest of the suite ran after these changes: unit tests 26/26; e2e 12/12 in both modes; regressions 71/71; lint, design rules and docs lint clean (`audit/2026-10-16-quality-pass/evidence/`).

## 3. Findings for production's guide (the owner decides; the lab changes nothing there)

| # | Finding | Source |
|---|---|---|
| P1 | No fact for the end of legal stay, so the filing deadline has no date and no reminder | UOC art. 105 ust. 1 |
| P2 | The guide never says the MOS account asks for a PESEL, or how to log in. Wave 1 (PESEL) is then a condition of wave 2. QA 2 says a trusted profile; the act accepts the methods of the informatization act art. 20a ust. 1 (corrected after the check of 17.10.2026: the act does not require a trusted profile as such) | UOC art. 225b ust. 2–3; UdSC QA 2 |
| P3 | The Polish text of `legal-stay-while-pending` drops the conditions and the exception that its English text and quotes carry; `card-fee-relief` points to "ust. 1" without saying who it covers | UOC art. 108 ust. 1–2, art. 237 |
| P4 | No step after a refusal: the appeal, its 14 days, where it goes, and that it does not go through MOS | KPA art. 127–129; UOC art. 22 ust. 2; QA 52 |
| P5 | The "family" option is labelled as reunification (art. 159), which does not describe a Polish citizen's spouse (art. 158) | UOC art. 158–159 |
| P6 | The attachment level shows for purposes that have no third-party attachment | UOC art. 106 ust. 2, 5, 7 |
| P7 | Nothing after the card: the duty to notify the end of the purpose within 15 working days; for a lost job on a single permit, the written notice and the 30-day protection | UOC art. 113, 121, 123 (art. 121 and 123 added after the check of 17.10.2026) |
| P8 | The employer's link lasts 30 days; an unsigned application is deleted after 45 days | QA 30; UOC art. 225h |
| P9 | Nothing on work while the case is pending, although the act on employing foreigners sets when it is allowed (added 17.10) | Act of 20.03.2025 art. 3 ust. 1 pkt 18, ust. 3 pkt 2, as amended by Dz.U. 2025 poz. 1794 art. 11 |
| P10 | The employer's attachment is required for every business purpose; the act requires it only for board, partner or proxy work (added 17.10) | UOC art. 106 ust. 2 as amended |
| P11 | A short stay gets both stamp duties (85 zł and 340 zł) at once; they are alternatives by reason and need a condition (added 17.10) | Stamp duty act, part III item 2a |
| P12 | On the paper route the filing step does not depend on paying, although the payment step's title says to pay before filing (added 17.10) | Production's guide, steps `paper-pay` and `paper-attachments` |

## 4. What this does not settle

- The reference is still a draft. A migration lawyer must review it, together with these rows (R5).
- Thirteen OPEN questions remain in the reference (§7), one of them narrowed (work while waiting), among them travel while waiting and how calls arrive.
- The comparison covers fictional cases RC1–RC15. For business, seasonal work, traineeships and short stays it compares the channel, the attachments and the fees only; "other" was not compared.
