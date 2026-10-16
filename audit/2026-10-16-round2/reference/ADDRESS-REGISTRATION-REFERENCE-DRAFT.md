# Address registration of foreigners: draft reference (NOT independent)

**Status: DRAFT. It needs an independent subject-matter review before any use as a benchmark.**
- **Who wrote it:** Claude, on 16.10.2026. Claude is the same assistant that built the prototype being evaluated, and has seen the engine's plans before. This draft is therefore **not independent and not blind**. The independent review must be done by a person with expertise in the procedure (the owner, an office, or a law clinic), who checks every line against the sources below.
- **How it was written:**
  - only from primary sources, retrieved on 16.10.2026 and kept in `sources/` with their checksums;
  - not from the case engine, the blueprints, or Formalka's registry snapshot (`reference/`);
  - the comparison with the engine (`COMPARISON.md`) was made afterwards.

Labels: FACT (quoted from a source below), INFERENCE, OPEN (the sources do not settle it), ASSUMPTION.

## Sources

| Id | Source | Version |
|---|---|---|
| UEL | Ustawa z 24.09.2010 o ewidencji ludności, tekst jednolity Dz.U. 2026 poz. 384 | Legal state on 10.03.2026 (the announcement of 12.03.2026). Extract: `sources/ustawa-o-ewidencji-ludnosci-2026-384-extract.txt` |
| UE2006 | Ustawa z 14.07.2006 o wjeździe… obywateli państw członkowskich UE i członków ich rodzin, tekst jednolity Dz.U. 2025 poz. 1164 | Art. 2 pkt 3–4. Extract: `sources/ustawa-o-wjezdzie-ue-2025-1164-art2-extract.txt` |
| GOV | gov.pl, "Zamelduj się na pobyt stały lub czasowy (dla cudzoziemców)" | "Ostatnia aktualizacja: 11.03.2026". Text: `sources/gov-pl-zamelduj-sie-cudzoziemcy-2026-10-16.txt` |

Not consulted:
- the forms regulation (MSWiA, 13.12.2017), which GOV names as a legal basis;
- the KPA, for how deadlines are counted.

**OPEN: a reviewer should add both.**

## 1. Rules that apply to every case

| Rule | Content | Basis |
|---|---|---|
| Who must register | A foreigner staying in Poland registers at the place of permanent or temporary stay | UEL art. 40 ust. 1–2 (FACT) |
| No duty for short stays | No duty if the stay in Poland does not exceed 30 days | UEL art. 42 ust. 2; GOV "Nie musisz się meldować, jeśli … nie będzie trwał dłużej niż 30 dni" (FACT) |
| Permanent vs temporary | Permanent: living at an address with the intention to stay. Temporary: staying without the intention to change the place of permanent stay | UEL art. 25 ust. 1–2 (FACT). GOV adds for the EU group: temporary "przez ponad 3 miesiące" (FACT, GOV) |
| Competent office | The municipal office (organ gminy) where the property lies | UEL art. 28 ust. 1 pkt 1; GOV "W urzędzie gminy, na terenie której mieszkasz" (FACT) |
| Paper channel | The form signed by hand, at the office, showing an identity document. The owner (or the holder of a legal title) confirms the stay on the form, and their title document is shown for inspection | UEL art. 28 ust. 1 pkt 1, ust. 2; GOV (FACT) |
| Electronic channel | The form signed with a qualified, trusted or personal signature, subject to the e-delivery proof; the title or owner's statement is attached as an electronic document or a scan | UEL art. 28 ust. 1 pkt 2, ust. 2a, 2d (FACT) |
| Who may use the electronic channel | Per GOV: only EU/EFTA citizens and their family members. "Jeśli nie jesteś obywatelem państwa członkowskiego UE albo EFTA i nie jesteś członkiem rodziny takiego obywatela, nie możesz zameldować się przez Internet." | GOV (FACT). UEL art. 40 ust. 3 (in force since 1.01.2026) requires personal appearance for a foreigner without PESEL who is "niewymieniony w art. 41 ust. 1–2a **lub** niebędący obywatelem Zjednoczonego Królestwa … bądź członkiem jego rodziny" (FACT). GOV states the in-person rule only in the section for other states. How the "lub" combines the two groups is OPEN-11; read as "neither group" (INFERENCE), it does not apply to EU citizens |
| Without the owner's confirmation | The person files anyway, with a statement of why the documents are missing; the office runs an administrative procedure and, if it finds the person lives there, issues a decision on registration | GOV "Problem z zameldowaniem – co robić" (FACT). UEL art. 31 ust. 1: doubts about the data are resolved by an administrative decision (FACT) |
| Fees | The registration service is free. Registration certificate: permanent free; temporary 17 zł. For the EU group, it is free when the system registers automatically. A further copy costs 17 zł | GOV "Ile zapłacisz" (FACT) |
| Proxy | A person may register through a proxy (GOV: "pełnomocnictwa … wyłącznie na piśmie" for the in-person route). A non-EU person without PESEL must come in person | UEL art. 24 ust. 4, art. 40 ust. 3; GOV (FACT) |
| Penalty | A non-EU/EFTA/Swiss foreigner who does not register is liable to a fine. This does not apply to a family member of an EU/EFTA/Swiss citizen | UEL art. 59 (FACT) |

## 2. Deadlines and their legal basis

| Group | Deadline in the act | Basis |
|---|---|---|
| EU, EFTA (EEA) or Swiss citizen | "najpóźniej w 30 dniu, licząc od dnia przybycia do tego miejsca" | UEL art. 41 ust. 1 (FACT) |
| Family member (not an EU/EFTA/Swiss citizen) of such a citizen | the same: 30th day | UEL art. 41 ust. 2 (FACT) |
| Family member of a Polish citizen **as defined in UE2006 art. 2 pkt 4 lit. b** | the same: 30th day | UEL art. 41 ust. 2a (FACT). The definition is narrow. For a spouse, for example, the Polish citizen held a right of residence over 3 months (or permanent residence) in another EU/EFTA state, Switzerland or the UK immediately before coming to Poland, and the other conditions in lit. b apply (FACT, UE2006 art. 2 pkt 4 lit. b) |
| Every other foreigner (including, by the act's text, UK citizens: see OPEN-3) | "najpóźniej czwartego dnia, licząc od dnia przybycia do tego miejsca" | UEL art. 41 ust. 3 (FACT). GOV: "Najpóźniej w 4 dniu od zamieszkania w Polsce" (FACT) |

**OPEN-1: the day count.** "najpóźniej czwartego dnia, licząc od dnia przybycia" can be read in two ways:
- (A) the arrival day is day 1;
- (B) counting starts on the next day.

Example, for arrival on Thursday 15.10.2026:
- 4th day: (A) Sunday 18.10.2026; (B) Monday 19.10.2026;
- 30th day: (A) Friday 13.11.2026; (B) Saturday 14.11.2026.

The sources here do not settle it. Until reviewed, both dates must be shown, with reminders on the earlier one.

**OPEN-2: weekends and holidays.** Does a deadline that ends on a day the office is closed move to the next working day?
- UEL does not say.
- Whether KPA art. 57 §4 applies to this duty was not checked.
- Practically, an office is closed on (A) Sunday 18.10.2026.

Until reviewed: do not move the date, and tell the person to plan before a closed day (the audit's point on addr-01).

**OPEN-3: UK citizens covered by the Withdrawal Agreement.** UEL art. 41 ust. 1–2a do not list them, so by the text art. 41 ust. 3 (the 4th day) applies. Two other provisions mention this group: art. 40 ust. 3 (in person without PESEL) and art. 43 ust. 1a, 3a (documents). GOV does not mention them. A reviewer must confirm the deadline.

## 3. Documents by group

Paper channel, from UEL art. 43 and GOV "Co musisz przygotować". "Albo" marks alternatives.

| Group | Permanent stay | Temporary stay |
|---|---|---|
| EU/EFTA/Swiss citizen | A valid travel document **albo** another valid document confirming identity and citizenship (art. 43 ust. 2) | The same (art. 43 ust. 4) |
| Family member of an EU/EFTA/Swiss citizen | A valid travel document **and** a valid karta stałego pobytu **albo** karta pobytowa (GOV: "karta stałego pobytu członka rodziny obywatela UE" / "karta pobytu członka rodziny obywatela UE"), **albo**, when that is not possible, another document confirming the family relationship (art. 43 ust. 2) | The same (art. 43 ust. 4) |
| UK citizen (Withdrawal Agreement) | A valid zaświadczenie o zarejestrowaniu pobytu **albo** a valid document confirming the right of permanent stay. A family member: a valid karta pobytowa **albo** karta stałego pobytu (art. 43 ust. 1a) | The same (art. 43 ust. 3a) |
| Any other foreigner | One of: a karta pobytu issued for permanent stay, long-term EU residence, humanitarian stay, subsidiary protection or refugee status; "zgoda na pobyt tolerowany"; the permit or decision itself (art. 43 ust. 1). GOV adds a valid travel document | A visa. If entry was visa-free, or the person stays under art. 108 ust. 1 pkt 2 / art. 206 ust. 1 pkt 2 of the Act on Foreigners (application filed on time): a travel document, a temporary identity certificate, a karta pobytu, "zgoda na pobyt tolerowany", or the permit or decision (art. 43 ust. 3). GOV: "ważny dokument podróży" **and** a visa, **or** in those situations a travel document **and** one of the listed documents |

Every group also needs:
- **The form:** "formularz zgłoszenia pobytu stałego" or "… czasowego" (GOV gives PDF links).
- **The title to the flat, if the person holds it:** one of a civil contract (e.g. a lease), an extract from the land register, an administrative decision, or a court ruling (UEL art. 28 ust. 2b; GOV).
- **If the person does not hold the title:** the owner confirms the stay on the form, and the owner's title document is shown (UEL art. 28 ust. 2; GOV).
- **If registering someone else:** a document showing the authority to act (GOV).

**Not yet in force (FACT, footnotes 25 and 27 of UEL):**
- a new wording of art. 43 ust. 3, which adds art. 222a of the Act on Foreigners;
- a new art. 43 ust. 5: "another identity document in a particularly justified case" when the person has no travel document.

Both enter into force on a date to be announced. Until then they must not be presented as current law (OPEN-4: check the announcement).

## 4. Cases

Each case uses fictional facts. "Confirmed facts" are what the person has said and confirmed. Everything else in the row follows from §1–3.

| Case | Confirmed facts | Documents (required, alternatives) | Channel | Office | Deadline and basis | Unresolved |
|---|---|---|---|---|---|---|
| **R1** EU citizen, permanent | German citizen; moved into a rented flat in Warsaw (Mokotów) on 15.10.2026 to live there permanently; the owner will confirm | Form (permanent). Passport **albo** another valid document confirming identity and citizenship. The owner confirms on the form and shows their title | In person at the office, **or** online (trusted profile or qualified signature; the owner's statement and title as electronic documents or scans) | Urząd gminy for the property (Warsaw: the district office handling registration; which one is OPEN-5) | 30th day: (A) 13.11.2026 / (B) 14.11.2026. UEL art. 41 ust. 1 | OPEN-1, OPEN-2 (14.11 is a Saturday) |
| **R2** EU citizen, temporary | Spanish citizen; 6-month contract; temporary stay in Kraków from 15.10.2026; the owner confirms | Form (temporary). The rest as R1 | As R1. The certificate costs 17 zł unless the system registers automatically | Urząd gminy for the property | 30th day, as R1. UEL art. 41 ust. 1 | OPEN-1, OPEN-2 |
| **R3** Non-EU family member of an EU citizen | Ukrainian citizen, spouse of a French citizen living in Poland; temporary stay; holds a karta pobytu członka rodziny obywatela UE | Form (temporary). A valid travel document **and** the karta pobytowa (**albo** karta stałego pobytu, **albo**, if not possible, another document confirming the relationship) | In person **or** online. GOV: family members may register online; documents confirming the relationship are shown at the office | Urząd gminy | 30th day. UEL art. 41 ust. 2 | OPEN-1. Whether the online route needs the karta shown in person: GOV says "musisz pokazać w urzędzie dokument" (OPEN-6) |
| **R4** Non-EU, visa, temporary, no PESEL | Indian citizen; national visa; arrived at a rented flat in Warsaw on 15.10.2026; no PESEL; owner confirms | Form (temporary). A valid travel document **and** the visa | **In person only** (no online route for this group; personal appearance without PESEL) | Urząd gminy | 4th day: (A) Sun 18.10.2026 / (B) Mon 19.10.2026. UEL art. 41 ust. 3 | OPEN-1, OPEN-2 (A falls on a Sunday) |
| **R5** Non-EU, visa-free, waiting for a temporary permit decision | Georgian citizen; entered visa-free; filed a temporary permit application on time and is waiting; temporary stay | Form (temporary). A valid travel document **and** one of: a temporary identity certificate, a karta pobytu, a permit or decision (per art. 43 ust. 3 as in force) | In person | Urząd gminy | 4th day. UEL art. 41 ust. 3. The declared period may not exceed the legal stay (art. 41 ust. 4) | OPEN-1. Which document a person waiting under art. 108 ust. 1 pkt 2 actually holds (OPEN-7: practice) |
| **R6** Non-EU, permanent | Vietnamese citizen with a permanent residence permit (karta pobytu) | Form (permanent). A valid travel document (GOV) **and** one of the art. 43 ust. 1 documents, e.g. the karta pobytu for the permanent permit | In person (online not for this group) | Urząd gminy | 4th day. UEL art. 41 ust. 3 | OPEN-1 |
| **R7** Uncertain answers | Does not know whether they count as a "family member" of an EU citizen; unsure whether the stay is permanent or temporary | Cannot be settled from the facts | Cannot be settled | Urząd gminy | Unknown group: either 30th or 4th day. **Show both and remind on the earlier** (INFERENCE: the safe side) | What the person can check: the karta they hold, the relationship. A wrong guess risks a fine for a non-EU person (art. 59). Ask the office |
| **R8** No owner confirmation | Non-EU citizen (visa), temporary; the owner refuses to confirm on the form | Form (temporary). Travel document **and** visa. **A statement explaining why** the owner's confirmation or the title is missing | In person (this group) | Urząd gminy for the property | 4th day. UEL art. 41 ust. 3. Filing does not wait for the owner | The office runs an administrative procedure and issues a decision if the person lives there (GOV; UEL art. 31). How long that takes, and whether filing on time is then enough, is not stated (OPEN-8) |
| **R9a** Family member of a Polish citizen, art. 2 pkt 4 lit. b | Belarusian spouse of a Polish citizen; the couple lived in Germany (the Polish citizen had a right of residence over 3 months) and moved back to Poland to stay | As for a family member: a travel document and a document confirming the relationship (INFERENCE from art. 41 ust. 2a referring to ust. 2; documents for this group are not listed separately in art. 43; OPEN-9) | OPEN: GOV's online rule names only EU/EFTA family members | Urząd gminy | 30th day. UEL art. 41 ust. 2a with UE2006 art. 2 pkt 4 lit. b | OPEN-9: documents and channel for this group |
| **R9b** Family member of a Polish citizen, not under lit. b | Belarusian spouse of a Polish citizen; they have always lived in Poland | As R4 or R6 (by stay type and residence document) | In person | Urząd gminy | 4th day. UEL art. 41 ust. 3 | The person may not know whether lit. b applies → treat as R7 (both deadlines) |
| **R10** UK citizen (Withdrawal Agreement) | British citizen with a zaświadczenie o zarejestrowaniu pobytu | Form. The zaświadczenie **albo** the document confirming permanent stay (art. 43 ust. 1a/3a) | OPEN | Urząd gminy | By the text: 4th day (art. 41 ust. 3) | OPEN-3 |
| **R11** Short stay | Any foreigner staying in Poland 3 weeks in total | None | — | — | No duty to register (art. 42 ust. 2) | If the stay is extended past 30 days, the duty starts. When the deadline then starts is OPEN-10 |

## 5. What this draft does not settle

| Id | Question | Who can settle it |
|---|---|---|
| OPEN-1 | Day count for "najpóźniej Nego dnia, licząc od dnia przybycia" | A law clinic or the ministry; an office's practice |
| OPEN-2 | Shift past weekends and holidays | The same |
| OPEN-3 | The deadline for UK Withdrawal Agreement citizens | The same |
| OPEN-4 | The date the new art. 43 ust. 3 and ust. 5 take effect | The ministry's announcement |
| OPEN-5 | Which Warsaw district office handles a given address | The city's website |
| OPEN-6 | Online registration for family members: what must still be shown in person | GOV, an office |
| OPEN-7 | Which document a person waiting for a permit decision actually holds | An office, UdSC |
| OPEN-8 | Without the owner: time and effect of the administrative procedure | An office, a law clinic |
| OPEN-9 | Documents and channel for family members of Polish citizens under art. 41 ust. 2a | An office, a law clinic |
| OPEN-10 | A stay that grows past 30 days: when the deadline starts | A law clinic |
| OPEN-11 | UEL art. 40 ust. 3: whether "lub" means either group or neither (who must appear in person without PESEL) | A law clinic, the ministry |

## 6. Review sheet for the independent reviewer

For each case R1–R11 and each column, mark one of:
- **agree**;
- **disagree**, with the correct content and source;
- **cannot tell**.

For each OPEN item, record the answer and its source. The reviewer signs with a name, role and date. Until then, every "FACT" above is only as good as the extract it quotes.
