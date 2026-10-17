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
| 3 | Temporary residence permit and residence card (work, study, family) | Voivode; MOS online, or paper for a family member abroad (FACT, `reference/residence`) | Yes (before legal stay ends; responding to calls for documents) | **High** (illegal stay, work) | Medium–high | Yes, with open inventory findings; legally audited on 2026-10-02 against the 2026 amendments (FACT, its header) | **R4 in progress** (17.10): sources (`research/2026-10-16-residence/`), a draft reference, the engine comparison and four prototype restrictions (`audit/2026-10-16-residence/`). Open: nine findings for the production guide (P1–P9), thirteen open questions, the lawyer's review |
| 4 | Waiting, delay remedies (ponaglenie), appeals in residence cases | Voivode, then the head of UdSC (FACT, registry `wait-*` notes) | Yes (the appeal period, the deadline in a call for documents; ASSUMPTION for residence until sourced) | High | Medium | Yes, partly | R3, in the prototype's waiting answer |
| 5 | Citizenship (recognition, grant) | Voivode; President (FACT) | Few | High but slow | Low | Yes, a first pass only | R3 |
| 6 | State certificate in Polish (B1) | The certification commission (FACT) | Exam dates | Low | Dates change | Yes, dates stale | R3 |
| 7 | CUKR card and UKR status (temporary protection for Ukrainian citizens) | Any municipality (PESEL UKR, protection act art. 110a); the voivode of the place of stay (CUKR card, special act art. 42o) (FACT, `research/2026-10-17-ukr/sources/`) | Yes (30 days from crossing the border to apply for PESEL UKR; CUKR applications by 4.03.2027) | **High** | **Very high** (moved between three acts in 2026; four later entry dates) | Partly (UKR notes in the PESEL guide) | **R1** (17.10): sources collected; no reference, as planned |
| 8 | Permanent residence, EU long-term resident status | Voivode (ASSUMPTION) | Some | High | Medium | No | R0 |
| 9 | Work: the employer's permit or notification, and what the person must check | Labour office, voivode; the employer files (ASSUMPTION) | Yes (for the employer) | High | High | No | R0 |
| 10 | E-government access: trusted profile, mObywatel, e-Doręczenia | Ministry of Digital Affairs (ASSUMPTION) | No | Low–medium (it blocks online services) | Medium | No (only mentions in the PESEL guide) | R0–R1 |
| 11 | Health insurance: through work, or a voluntary NFZ agreement; EHIC for EU citizens | ZUS, NFZ (ASSUMPTION) | Some | Medium–high (care refused or billed) | Medium | No | R0 |
| 12 | Taxes: tax identifier (PESEL or NIP), annual return, tax residency | Tax office, KAS (ASSUMPTION) | Yes (the annual return) | Medium | Medium | No | R0 |
| 13 | Family benefits (e.g. 800+) for foreigners | ZUS (ASSUMPTION) | Yes | Medium | **High** (FACT: an act of 12.09.2025 "w celu weryfikacji prawa do świadczeń na rzecz rodziny dla cudzoziemców", named in the Lewiatan letter, `PUBLIC-QUESTIONS.md` Q8) | No | R0 |
| 14 | Civil status: a child born in Poland, transcription of foreign certificates, marriage in Poland | Civil registry office (USC) (ASSUMPTION) | Some (registering a birth) | Medium | Low | No | R0 |
| 15 | Driving licence exchange; vehicle registration | District office (starostwo) (ASSUMPTION) | Yes (deadlines exist, to be checked) | Medium | Low | No | R0 |
| 16 | School or kindergarten for a child | Municipality, school (ASSUMPTION) | Recruitment dates | Medium | Low | No | R0 |
| 17 | Unemployment registration | Labour office (ASSUMPTION) | Some | Medium | Medium | No | R0 |
| 18 | Karta Polaka | Consul or voivode (ASSUMPTION) | Few | Medium | Low | No | R0 |
| 19 | Moving, deregistration, end of a temporary registration | Municipality (FACT, Warszawa 19115) | Yes (the declared period ends) | Low–medium | Low | Partly | R1, journey S9 in doc 18 |

Out of scope by design: matters that are not official procedures (bank accounts, private insurance, renting), and anything that needs a lawyer's judgement on the person's own case.

## 4. The order, and the gate before each wave reaches people

| Wave | Matters | May start now, in the lab | Gate before people see it (all required) |
|---|---|---|---|
| **1 (now)** | Address registration, PESEL | Everything (it is under way) | The doc 18 §6.3 gates, then the Phase 1 thresholds (doc 18 §6.1) |
| **2** | Temporary residence permit and card (3), with waiting and appeals (4) | **Yes:** sources, a draft reference, the engine comparison, restrictions (R1→R4) | Wave 1's Phase 1 thresholds met. H6 measured on wave 1 (≤4 h a month per procedure). The production guide's open findings closed (owner, production content). A migration lawyer's review (R5). A moderated test on fictional cases |
| **3** | CUKR card and UKR status (7) | Sources only (R1). The rules move too fast to draft a reference that will not go stale | Wave 2's gates, plus a change-monitoring routine that catches amendments within days, plus Ukrainian-language content and its test (doc 18 R11) |
| **4** | E-government access (10), health insurance (11), civil status (14) | Sources (R1) for the most frequent, once the interviews say which | A new registry domain in production (owner). The same R1→R5 path per matter. H2 measured in the private alpha (people return to their case) |
| **5** | Taxes (12), benefits (13), work (9), driving and vehicles (15), school (16), unemployment (17), permanent residence (8), Karta Polaka (18) | Nothing yet | The private alpha's decision (doc 13 phase 6). Each one is a new domain with its own experts (a tax adviser for 12, and so on) |

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
