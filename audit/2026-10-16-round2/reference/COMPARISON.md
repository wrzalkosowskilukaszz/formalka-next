# The engine's plans against the draft reference (address registration)

**This comparison is not independent.** Claude made it, the same assistant that built the prototype, and the reference it compares against is itself an unreviewed draft (`ADDRESS-REGISTRATION-REFERENCE-DRAFT.md`). It finds candidate problems for a person to confirm. It does not certify anything.

**How:**
- `engine-output.mjs` prints the engine's plan for each reference case (arrival 15.10.2026, Warsaw).
- The output on this branch is in `engine-output.txt`.
- Each row below compares that output with the draft reference.

## Where they agree (on the draft's reading)

| Item | Cases | Note |
|---|---|---|
| Deadline for EU/EFTA/Swiss citizens: the 30th day, with both readings shown (13.11 / 14.11) | R1, R2 | Matches UEL art. 41 ust. 1 and OPEN-1 |
| Deadline for other foreigners: the 4th day, with both readings shown (18.10 / 19.10) | R4, R6 | Matches UEL art. 41 ust. 3 and OPEN-1 |
| Unknown group: both deadlines shown as "may not apply"; every group's documents marked "sprawdź" | R7 | Matches the reference's "show both". Whether to remind on the earlier date is the owner's open decision O7 |
| Filing does not wait for the owner; the confirmation becomes "Pominięte" after filing | R8 | Matches GOV "Problem z zameldowaniem". Only the first no-owner note sits on the filing step; the others are on the route level (see D10) |
| No online route for other foreigners (important note `no-online`) | R4, R6 | Matches GOV |
| Fees: registration free; certificate for temporary stay 17 zł (optional); a further copy 17 zł | R1–R6 | Matches GOV |
| UK Withdrawal Agreement: the 4th day | R10 | Matches the act's text; still OPEN-3 for a reviewer |

## Candidate problems

| Id | Cases | What the engine shows | What the draft reference says | Risk | Restriction until reviewed |
|---|---|---|---|---|---|
| D1 | R3 | One group for EU citizens and their family members. For a non-EU family member it shows "ważny dokument podróży **lub inny ważny dokument** (tożsamość i obywatelstwo)" as required, and only "ważną kartę pobytu członka rodziny obywatela UE" as conditional | A family member needs a valid travel document **and** a karta stałego pobytu **albo** karta pobytowa, **albo** another document confirming the relationship (art. 43 ust. 2 and 4; GOV) | A family member may bring the wrong identity document, or think they lack the card when another document would do | **Excluded from the study.** Fictional identities are EU citizens only, never family members |
| D2 | R5 | For temporary stay, the alternatives to a visa are only "tymczasowe zaświadczenie tożsamości cudzoziemca" | Also a karta pobytu, "zgoda na pobyt tolerowany", the permits and the decisions listed in art. 43 ust. 3 (GOV lists them too) | A person entering visa-free or waiting for a permit may think they lack a required document | **Excluded from the study.** Fictional non-EU identities hold a national visa |
| D3 | R4–R6 | The registry has the note `no-pesel-in-person` ("Jeśli jednak nie masz numeru PESEL – przyjdź do urzędu osobiście"), but the plan keeps it on the route level, not marked important. The prototype showed at most 3 notes there, so the person was unlikely to see it. *Corrected on this branch: an earlier version of this row said the engine did not mention it at all* | Personal appearance without PESEL; no proxy then (UEL art. 40 ust. 3, since 1.01.2026; GOV) | A person may send a proxy and miss the deadline | **Restricted in the prototype:** the note is shown on the step "Wizyta w urzędzie gminy" for other foreigners (e2e B). The study uses in-person filing only |
| D4 | R6 | Non-EU permanent stay: one required document, "kartę pobytu wydaną w związku z udzieleniem zezwolenia na pobyt stały" | Any one of the art. 43 ust. 1 documents (long-term EU resident, humanitarian, subsidiary protection, refugee, tolerated stay, or the permit or decision) | A person with another valid title may think they cannot register | **Excluded from the study** (no permanent non-EU identities) |
| D5 | R9 | The group option "Żadna z tych grup (także członek rodziny obywatela polskiego, który sam nie jest obywatelem UE)" gives the 4th day | Family members of a Polish citizen under UE2006 art. 2 pkt 4 lit. b have the 30th day (UEL art. 41 ust. 2a); others, the 4th | The deadline errs early, which is safe for the date. Documents, channel and the fine (art. 59) may differ | **Excluded from the study.** Proposed for the registry: the option label contradicts art. 41 ust. 2a for lit. b family members |
| D6 | R10 | UK Withdrawal Agreement: "ważny dokument podróży" plus the registration certificate | Art. 43 ust. 1a/3a list the certificate **albo** the permanent-residence document; a travel document is not listed there | Possibly an extra requirement; the source of the registry's line was not checked | **Excluded from the study** |
| D7 | R4, R6 (and R1, R2 for the later reading) | The earliest date 18.10.2026 is a Sunday, and 14.11.2026 (the later 30-day reading) a Saturday. Nothing tells the person that the office may be closed | OPEN-2: whether the deadline moves is unresolved; practically the office is closed | A person plans the visit for the last day and finds the office closed | **Restricted on this branch** (engine `dueRangePl`, so the plan, the guide and the warning reminder all carry it). When a date of an open-reading ("nth-day") deadline falls on a weekend or public holiday, the text adds that it is a day off, the office may be closed, and to do it earlier. The date is not moved: no legal shift is assumed (OPEN-2). Checked by an engine unit test, a prototype unit test (incl. 11 November) and `engine-output.txt`. The last reminder comes on the last working day before a closed safe date ("Dziś jest ostatni dzień roboczy przed nim"; branch `lab/quality-pass`, engine test and mutation `advisor-reminder-on-closed-day`). *An earlier version of this row listed that as an open limit* |
| D8 | R1–R10 | Warsaw: all 18 district offices listed, with a district filter; the assistant says "Wybierz najbliższy według dzielnicy" | **Resolved 16.10: agreement.** In Warsaw any district office accepts the filing (warszawa19115.pl cards AO/02/07/K and AO/02/06/K, updated 2026-07-06; extracts in `research/2026-10-16-service/sources/`). *An earlier version of this row assumed the property's district office (OPEN-5)* | Low: the filter may suggest that only the home district counts | None needed. The scoring accepts any Warsaw district office (CHECKLISTS B, item 2) |
| D9 | R1, R2, R4 | A step "Poproś właściciela o potwierdzenie na formularzu" (optional), and at the filing the lease **albo** the owner's title document | OPEN-12: whether a tenant with a written lease still needs the owner's confirmation on the paper form | Low for the person: the engine follows GOV's in-person wording and the safe course. The step may be unnecessary work | None in the app. The scoring never marks either reading as wrong (CHECKLISTS B, item 8) |
| D10 | R8 | The last step reads "Urzędnik melduje Cię od razu" (registry quote: "Urzędnik zamelduje cię od razu po otrzymaniu twojego zgłoszenia"). The registry's notes on the statement and the administrative procedure (`no-owner-statement`, `no-owner-procedure`) sit on the route level | Without the owner's confirmation: a statement of why, then an administrative procedure and a decision on registration (GOV "Problem z zameldowaniem"; UEL art. 31) | The person expects to be registered at the desk and does not prepare the statement | **Restricted in the prototype:** while the owner's confirmation is not done, "Wizyta w urzędzie gminy" shows the statement note and "Zameldowanie" shows the procedure note, each under "Jeśli właściciel nie potwierdzi…" (the registry's words; only the lead-in is the prototype's; e2e I). How long the procedure takes stays OPEN-8 |

## Not compared

- The online route's details for EU citizens: trusted profile, land-register number, automatic registration. The engine shows only that filing can be online.
- The forms regulation (13.12.2017), which neither side used.
- Offices outside Warsaw and Kraków.
