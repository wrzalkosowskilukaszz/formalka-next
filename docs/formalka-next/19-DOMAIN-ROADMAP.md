# 19. Beyond address registration and PESEL: which matters, in what order, when

**Status:** a plan written by Claude for the owner on 16.10.2026. It is not independent.
- Frequency, risk and volatility are **HYPOTHESIS** until the interviews and the public-question collection give evidence.
- Institutions and rules named for matters outside `reference/` are **ASSUMPTION** from general knowledge, to be checked against primary sources before any of it reaches a person.
- No AI model before Phase 1 (the owner, 16.10).

## 1. The answer in short

- The **bottleneck is verified content and its upkeep, not code.** The engine already plans the residence card, citizenship and the language certificate. Each new matter needs:
  - primary sources;
  - an independent reference;
  - a comparison with the engine;
  - restrictions where the sources are silent;
  - an expert's review;
  - a test with people;
  - someone to keep it current (H6: at most 4 hours a month per procedure).
- **What can start now, in the lab, without users:** preparing the next matter's content. This means sources, a draft reference and a comparison, for the temporary residence permit first. It touches no feature and no AI.
- **What waits for gates:** showing any new matter to people. The order and the gates are in §4. In calendar terms (doc 13 §4a, HYPOTHESIS):
  - Phase 1 takes about 3–6 weeks of real time;
  - H6 needs 2 months of measurement by definition;
  - so the residence permit reaches people **no earlier than about 3 months** after Phase 1 starts. The others come later.

## 2. Readiness levels

| Level | Meaning |
|---|---|
| R0 | Nothing in our sources |
| R1 | Primary sources collected with provenance (`research/`) |
| R2 | A production guide exists with quoted rules (`reference/` snapshot) |
| R3 | A blueprint plans it; engine tests and evaluation scenarios cover it |
| R4 | A draft independent reference and an engine comparison exist, with restrictions applied (the address-registration method of 16.10) |
| R5 | An expert has reviewed and signed the reference, and a moderated test met the doc 18 thresholds |

## 3. The matters foreigners handle, and where each stands

"Deadline-driven" means the case has a date the person can miss. "Volatility" is how often the rules seem to change (HYPOTHESIS). "Registry" is what we hold.

| # | Matter | Who handles it (ASSUMPTION unless in `reference/`) | Deadline-driven | Risk if we are wrong | Volatility | Registry | Level |
|---|---|---|---|---|---|---|---|
| 1 | Address registration | Municipality (FACT, `reference/`) | Yes (4th or 30th day) | Medium (a fine) | Low | Yes | **R4** (R5 needs the expert review) |
| 2 | PESEL on application | Any municipality (FACT) | Partly (7 days to fix a gap) | Medium | Medium (in person since 1.01.2026) | Yes | **R3+** (a comparison exists, `audit/2026-10-16-quality-pass/PESEL-COMPARISON.md`) |
| 3 | Temporary residence permit and residence card (work, study, family) | Voivode; MOS online, or paper for a family member abroad (FACT, `reference/residence`) | Yes (before legal stay ends; responding to calls for documents) | **High** (illegal stay, work) | Medium–high | Yes, with open inventory findings; legally audited on 2026-10-02 against the 2026 amendments (FACT, its header) | **R4 in progress** (17.10): sources (`research/2026-10-16-residence/`), a draft reference, the engine comparison and four prototype restrictions (`audit/2026-10-16-residence/`). Open: twelve findings for the production guide (P1–P12), thirteen open questions, the lawyer's review. The draft and the map were checked by the separate agent on 17.10 (`research/2026-10-16-residence/sources/CHECK.md`); corrections changed in the lab |
| 4 | Waiting, delay remedies (ponaglenie), appeals in residence cases | Voivode, then the head of UdSC (FACT, registry `wait-*` notes) | Yes (the appeal period, the deadline in a call for documents; ASSUMPTION for residence until sourced) | High | Medium | Yes, partly | R3, in the prototype's waiting answer |
| 5 | Citizenship (recognition, grant) | Voivode; President (FACT) | Few | High but slow | Low | Yes, a first pass only | R3 |
| 6 | State certificate in Polish (B1) | The certification commission (FACT) | Exam dates | Low | Dates change | Yes, dates stale | R3 |
| 7 | CUKR card and UKR status (temporary protection for Ukrainian citizens) | Any municipality (PESEL UKR, protection act art. 110a); the voivode of the place of stay (CUKR card, special act art. 42o) (FACT, `research/2026-10-17-ukr/sources/`) | Yes (30 days from crossing the border to apply for PESEL UKR; CUKR applications by 4.03.2027, UdSC's date; protection runs to 4.03.2028 under EU decision 2026/1912) | **High** | **Very high** (moved between three acts and an EU decision in 2026; three later entry dates) | Partly (UKR notes in the PESEL guide) | **R1** (17.10): sources collected and checked by the separate agent (`research/2026-10-17-ukr/sources/CHECK.md`); no reference, as planned |
| 8 | Permanent residence, EU long-term resident status | The voivode of the place of stay, through MOS since 27.04.2026 (FACT, `research/2026-10-17-permanent/sources/`) | Yes (file by the last day of the legal stay; the next card at least 30 days before the old one expires) | High | Medium (rewritten for MOS from 27.04.2026) | No | **R1** (17.10): sources and a map (`maps/permanent-residence.md`), checked by the separate agent (`research/2026-10-17-permanent/sources/CHECK.md`); the corrections are changed in the lab, not independently verified |
| 9 | Work: the employer's permit or notification, and what the person must check | The voivode (work permit) or the starosta (declaration, seasonal permit); the employer files online at praca.gov.pl and is the only party (FACT, `research/2026-10-17-work/sources/`) | Yes (for the employer: 7-day notices; the next application before the permit ends) | High (a fine of at least 1 000 zł for the person; a later permit at risk) | High (four amendments in a year; the visa-free rules changed in August 2026; a Ukrainian transitional rule runs to 5.03.2029) | No | **R1** (17.10): sources and a map (`maps/work.md`), checked by the separate agent on 17.10 (`research/2026-10-17-work/sources/CHECK.md`); the corrections are changed in the lab, not independently verified |
| 10 | E-government access: trusted profile, mObywatel, e-Doręczenia | Ministry of Digital Affairs (ASSUMPTION) | No | Low–medium (it blocks online services) | Medium | No (only mentions in the PESEL guide) | **R1** (17.10): sources and a map (`maps/e-government-access.md`), checked by the separate agent (`research/2026-10-17-egov/sources/CHECK.md`) |
| 11 | Health insurance: through work, or a voluntary NFZ agreement; EHIC for EU citizens | The employer or the person reports to ZUS; the NFZ branch signs the voluntary agreement (FACT, `research/2026-10-17-health/sources/`) | Some (30 days after a job ends; 7 days to report the family) | Medium–high (care refused or billed) | Medium (for PESEL UKR holders it changed on 5.03.2026) | No (only the NFZ as an institution) | **R1** (17.10): sources and a map (`maps/health-insurance.md`); its facts checked once by a separate agent and corrected (`research/2026-10-17-health/sources/CHECK.md`); no expert review |
| 12 | Taxes: tax identifier (PESEL or NIP), annual return, tax residency | Tax office, KAS (ASSUMPTION) | Yes (the annual return) | Medium | Medium | No | R0; **set aside by the owner** (17.10.2026: "Podatki odstawmy") |
| 13 | Family benefits (e.g. 800+) for foreigners | ZUS, online only (FACT, the 800+ act art. 10, 13; `research/2026-10-17-benefits/sources/`) | Yes (applications from 1 February, by 30 April for payment by 30 June; changes within 7 days) | Medium | **High** (FACT: the act of 12.09.2025, Dz.U. 2025 poz. 1301, added a work condition and a school condition for most foreigners, applied from the period starting 1.06.2026; for PESEL UKR holders from 1.02.2026 under the special act, then from 5.03.2026 under Dz.U. 2026 poz. 203 art. 30) | No | **R1** (17.10): sources and a map for 800+ (`maps/child-benefit-800.md`), checked by the separate agent (`research/2026-10-17-benefits/sources/CHECK.md`); the corrections are changed in the lab, not independently verified; other family benefits not collected |
| 14 | Civil status: a child born in Poland, transcription of foreign certificates, marriage in Poland | The civil registry office (USC); the voivode for appeals; a court for a marriage exemption (FACT, `research/2026-10-17-civil/sources/`) | Yes (21 days to report a birth, 3 days a death) | Medium (a name chosen by the office; a wedding delayed) | Low (the act's consolidated text of 2026 has no later amendments) | No | **R1** (17.10): sources and a map (`maps/civil-status.md`); its facts checked once by a separate agent and corrected (`research/2026-10-17-civil/sources/CHECK.md`); no expert review |
| 15 | Vehicles: registering a car bought in Poland or brought from abroad, keeping or getting plates, reporting a sale or changed data; the driving licence: using a foreign one, exchanging it | The starosta of the place of permanent or temporary residence (FACT, `research/2026-10-17-vehicles/sources/`) | **Yes:** 30 days to register; 30 days to report a sale or changed data; a convention licence valid 6 months from the start of stay (FACT, PRD art. 73aa, 78; AVD art. 5 ust. 4) | Medium (fines of 250–1 000 zł; driving on an invalid licence) | Medium (two amending acts since 12.2025; online registration from 18.01.2027) | No | **R1** (17.10): sources and a map (`maps/vehicles-licence.md`); its facts checked once by a separate agent against the official texts and corrected (`research/2026-10-17-vehicles/sources/CHECK.md`); no expert review |
| 16 | School or kindergarten for a child | The head of the school; the municipality for preschool places and the recruitment dates (FACT, Prawo oświatowe art. 31, 130, 154; `research/2026-10-17-school/sources/`) | Yes (each municipality's recruitment dates, set by the end of January; appeals in 3 or 7 days) | Medium | Medium (the regulation on foreigners amended from 12.09.2026; the special act's school rules ended on 31.08.2026) | No | **R1** (17.10): sources and a map (`maps/school.md`), checked by the separate agent (`research/2026-10-17-school/sources/CHECK.md`); the corrections are changed in the lab, not independently verified |
| 17 | Unemployment registration | The county labour office (PUP) of the place of residence; the starosta decides, the voivode on appeal (FACT, the labour market act art. 31, 55; `research/2026-10-17-unemployment/sources/`) | Yes (changes within 7 days; contact every 90 days; trips up to 30 days) | Medium | Medium (a new act from 1.06.2025, changed in 2025 and 2026; amounts indexed each 1 June) | No | **R1** (17.10): sources and a map (`maps/unemployment.md`), checked by the separate agent (`research/2026-10-17-unemployment/sources/CHECK.md`); the corrections are changed in the lab, not independently verified |
| 18 | Karta Polaka | The consul of the place of residence; in Poland, any of the 16 voivodes for citizens of Ukraine, Belarus and Russia (FACT, the Karta Polaka act art. 12; Dz.U. 2022 poz. 2522; `research/2026-10-17-karta-polaka/sources/`) | Few (appeal in 30 days; renewal from 6 months before expiry) | Medium | Low (no amendment since the consolidated text of January 2026) | No | **R1** (17.10): sources and a map (`maps/karta-polaka.md`), checked by the separate agent (`research/2026-10-17-karta-polaka/sources/CHECK.md`); the corrections are changed in the lab, not independently verified. The settlement benefit is on hold since 15.01.2026 |
| 19 | Moving, deregistration, end of a temporary registration | Municipality (FACT, UEL art. 28 ust. 1, 33 ust. 2) | Yes (the fourth day after a move; 14 days for the card; the day of leaving) | Low–medium | Low | Partly | **R1** (17.10): sources and a map (`maps/moving.md`), journey S9 in doc 18; checked by the separate agent on 17.10.2026 and corrected (`research/2026-10-17-moving/sources/CHECK.md`) |
| 20 | Business registration (CEIDG) by a foreigner: who may, and what follows (ZUS; tax is matter 12, set aside) | Online; on paper at any municipality until 31.10.2026 for a new business, a minor's only on paper until 31.10.2028 (FACT, CEIDG art. 8 ust. 2; Dz.U. 2026 poz. 507 art. 15–16) | Yes (1.11.2026: a PESEL and online only; 7 days after a change or after passing the unregistered limit) | Medium–high | Medium | No | **R1** (17.10): sources and a map (`maps/business.md`); checked by the separate agent on 17.10.2026 and corrected (`research/2026-10-17-business/sources/CHECK.md`) |
| 21 | Buying real estate: the permit some foreigners need | The minister for internal affairs (FACT, REA art. 1 ust. 1) | Some (2 years' validity; 6-month-old property documents, 3-month-old company documents; a will's 2 years) | High (a void purchase, REA art. 6) | Low | No | **R1** (17.10): sources and a map (`maps/real-estate.md`); checked by the separate agent on 17.10.2026 and corrected (`research/2026-10-17-real-estate/sources/CHECK.md`) |
| 22 | Recognition of a foreign diploma or school certificate; a professional qualification | NAWA, a university, the school superintendent (FACT, PSWN art. 326 ust. 4, 327 ust. 4; USO art. 93b); a professional body (PAGES) | Some (the university's admission dates; the 90 days of nostrification; the interview date) | Medium | Low | No | **R1** (17.10): sources and a map (`maps/recognition.md`); regulated professions a handoff; checked by the separate agent on 17.10.2026 and corrected (`research/2026-10-17-recognition/sources/CHECK.md`) |
| 23 | Inviting a foreigner (an invitation for a visit) | The voivode of the inviter's residence (FACT, UoC art. 51 ust. 3) | Some (annulment 7 days before; validity up to 1 year; one month in the simplified procedure) | Medium (the inviter's promise to pay; the costs of an enforced return decision, set by the Border Guard) | Low | No | **R1** (17.10): sources and a map (`maps/invitation.md`); checked by the separate agent on 17.10.2026 and corrected (`research/2026-10-17-invitation/sources/CHECK.md`) |
| 24 | Certificates for other procedures: criminal record (KRK), an apostille on a Polish document | The KRK Information Bureau and its points at the courts (FACT, INFO § 2); the Ministry of Foreign Affairs for apostilles (FACT, the 2005 statement; others for education documents, PAGES) | No (work with children: before the start) | Low–medium | Low | No | **R1** (17.10): sources and a map (`maps/certificates.md`); not yet checked by the separate agent |
| 25 | EU citizens: entry in the register of voters | Municipality, on the person's application (FACT, Electoral Code art. 19a; UEL art. 17 ust. 1 pkt 2a) | Election dates (the list follows the register on the 3rd day before, Code art. 26 § 9) | Low | Low | No | **R1** (17.10): sources and a map (`maps/voters.md`); not yet checked by the separate agent |
| 26 | A return decision or voluntary return | A Border Guard unit or post commander (FACT, UoC art. 310 ust. 1) | **Yes** (the appeal in 7 days; 8–30 days for voluntary departure) | **Very high** | Medium | No | Handoff to legal aid only, never a plan. **R1** (17.10): sources and a handoff map (`maps/return-decision.md`); not yet checked by the separate agent |

Out of scope by design: matters that are not official procedures (bank accounts, private insurance, renting), and anything that needs a lawyer's judgement on the person's own case.

## 4. The order, and the gate before each wave reaches people

| Wave | Matters | May start now, in the lab | Gate before people see it (all required) |
|---|---|---|---|
| **1 (now)** | Address registration, PESEL | Everything (it is under way) | The doc 18 §6.3 gates, then the Phase 1 thresholds (doc 18 §6.1) |
| **2** | Temporary residence permit and card (3), with waiting and appeals (4) | **Yes:** sources, a draft reference, the engine comparison, restrictions (R1→R4) | Wave 1's Phase 1 thresholds met. H6 measured on wave 1 (≤4 h a month per procedure). The production guide's open findings closed (owner, production content). A migration lawyer's review (R5). A moderated test on fictional cases |
| **3** | CUKR card and UKR status (7) | Sources only (R1). The rules move too fast to draft a reference that will not go stale | Wave 2's gates, plus a change-monitoring routine that catches amendments within days, plus Ukrainian-language content and its test (doc 18 R11) |
| **4** | E-government access (10), health insurance (11), civil status (14) | Sources (R1) for the most frequent, once the interviews say which | A new registry domain in production (owner). The same R1→R5 path per matter. H2 measured in the private alpha (people return to their case) |
| **5** | Taxes (12), benefits (13), work (9), driving and vehicles (15), school (16), unemployment (17), permanent residence (8), Karta Polaka (18) | Sources and a map (R1) only, at the owner's request of 17.10 to continue with the list: so far 8, 9, 13, 15, 16, 17 and 18. Nothing reaches the prototype | The private alpha's decision (doc 13 phase 6). Each one is a new domain with its own experts (a tax adviser for 12, and so on) |
| **6** | Moving (19), business registration (20), real estate (21), recognition of diplomas (22), invitations (23), certificates (24), EU citizens' voter register (25); a return decision (26) as a handoff only | Sources and a map (R1) only, one at a time, at the owner's request of 17.10.2026 ("3. Tak": 19–26 in order). Taxes (12) stay set aside until the owner says otherwise. Nothing reaches the prototype | The private alpha's decision (doc 13 phase 6), as wave 5 |

**Why this order:**
- The residence permit is the most valuable next matter, and the engine and registry already hold it (doc 13 §1).
- CUKR matters to many people, but its volatility makes upkeep (H6) the first risk.
- Tax, health and benefits need institutions and experts that the registry does not cover yet.

**What could change the order:** the interviews (`research/2026-10-16-service/INTERVIEW-PLAN.md`, which now asks about other matters) and the public-question counts. If people report CUKR or health insurance far more often than the residence permit, wave 2 changes. That decision is the owner's, made with that evidence.

## 5. The same pipeline for every matter

It was proven on address registration (16.10):
1. Primary sources with provenance (act, gov.pl, the office's own card), in `research/`.
2. A draft reference: cases, required and alternative documents, channel, office, deadline with its legal basis, unresolved questions.
3. The engine comparison, D-rows. Each gap is restricted, not guessed.
4. Tests:
   - the engine's evaluation scenarios and mutations;
   - e2e scenarios with the screen contracts;
   - regression probes with variants.
5. Lessons: every mistake made on the way goes to `docs/solutions/`.
6. An expert's review (R5), then a moderated test with the doc 18 thresholds.
7. Upkeep: a change log and the hours it takes (H6).
