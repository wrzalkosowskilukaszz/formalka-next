# Overnight report, 16–17.10.2026

**For:** the owner, on return. **By:** Claude, working alone on the owner's instruction "Kontynuuj bez przerw oraz nie czekaj na moje decyzje". Changed in the lab; not independently verified.

**Plan followed:** doc 19, wave 2 (temporary residence permit and card: sources, draft reference, engine comparison, restrictions, tests), then wave 3 (sources only).
- No AI model, no new feature, no paid service, nothing in production.
- Nothing was merged.
- **The branch `lab/quality-pass` was pushed several times. The repository is public, so this work is published.** It holds no personal data: fictional cases and public legal texts only.

## 1. What was done

| Step | Result | Commits |
|---|---|---|
| Wave 2 sources | The act on foreigners and its 2026 amendment, by point and date; the MOS account and outage rules; KPA; fees; the UdSC and voivode pages | d323266, 97a78b7, 2c301c3, 6bf5b74, f1a64d1 |
| Draft reference | `audit/2026-10-16-residence/RESIDENCE-REFERENCE-DRAFT.md`: rules, fees, deadlines with their basis, eleven fictional cases with what a plan must never say, thirteen open questions with a restriction each, a reviewer sheet | 6bf5b74, f1a64d1 |
| Engine comparison | `audit/2026-10-16-residence/COMPARISON.md`: twenty rows. Agreement on fees, offices, channel, the outage rule, the card, the time limits. Gaps on reminders, the MOS account, the refusal, the end of the purpose. One wording problem: the Polish legal-stay note drops its conditions | f1a64d1 |
| Restrictions in the prototype | Five, each with a test that fails without it. See §2 | f1a64d1, 1391408 |
| Evidence | All suites, on the commit (§4) | cc82317 |
| Wave 3 sources | `research/2026-10-17-ukr/sources/`: temporary protection (where it moved in 2026), PESEL UKR, the CUKR card and UdSC's questions and answers on it, the winding-down act's dates. No reference, as doc 19 plans | 43ebc87, 744cee3 |
| Open questions narrowed | Work while waiting (the act on employing foreigners, art. 3; finding P9); how calls and the card pickup date arrive at the Mazowiecki office (its e-Doręczenia page, which also starts with "Uzyskaj numer PESEL") | c387219 |
| Tools | `tools/sources/entry-dates.mjs` prints an act's entry-into-force article, flagging points with their own dates. It has a test, and the evidence script runs it with the residence engine output | 6bf5b74 |
| Lessons | Three new ones in `docs/solutions/`, each from a mistake below (§3) | 6bf5b74, f1a64d1 |

## 2. Restrictions in the prototype (residence case only)

1. **Teraz names what the case does not cover:**
   - it is not verified;
   - it will not remind about the last day of legal stay or the dates in the office's letters, because it does not know them;
   - it does not describe the MOS account;
   - it stops after a refusal.

   It states no rule of its own.
2. **A registry note whose Polish text is a cut fragment of a provision is shown with all its quotes.** The legal stay while waiting now shows its conditions: filed on time, no formal defects, not suspended at one's own request. Before, a person read only "pobyt … uważa się za legalny".
3. **The "czekam na urząd" answer now leads with the special act's art. 100d.** It is shown in full, not folded. Free legal aid is the main button and the ponaglenie template a secondary one. This changes the order of the answer you asked for on 16.10, not its content. When the registry drops the note, the old order returns. **Your call (D1 below).**
4. **After a refusal,** the decision step says the case goes no further and links the registry's free legal aid.
5. **Fees for a short stay are no longer added up.** The registry gives that purpose two alternative stamp duties, 85 zł or 340 zł by reason. The map, the Teczka and the fees answer showed "525 zł" with the card. They now list the fees and say they depend on the reason (COMPARISON D21, added later in the night).

## 3. Mistakes found and corrected overnight

- The card articles of Dz.U. 2025 poz. 1794 take effect **by point**: 1.04.2026 for art. 226–229, and 27.04.2026 for art. 248. My source headers had said 27.04.2026 for all of them. The headers are corrected, and a tool and a lesson now cover this.
- The engine comparison showed that the draft had missed four provisions that the production registry cites:
  - **art. 225c**, the legal basis of the 3-working-day rule after an MOS outage;
  - **art. 225b**, under which the MOS account asks for a PESEL number;
  - **art. 100d of the special act**, under which the voivode's time limits in residence cases do not run until 4.03.2027, for every foreigner;
  - **art. 229 ust. 4**, under which, after family reunification from abroad, the first card is issued on application.

  Each was checked in the primary text before the draft changed (its §9). Two lessons record the misses.
- A single e2e run failed by 1 px (1281 > 1280) right after the desktop resize, with no element past the edge. The page check now has the same 1 px tolerance as the element checks. Five later full runs passed.

## 4. Tests on f1a64d1, and again on 1391408 after the fee fix (`audit/2026-10-16-quality-pass/evidence/`)

| Suite | Result |
|---|---|
| Engine tests | 39/39 |
| Evaluation | 18/18; 24/24 on f667778 (6 residence scenarios added) |
| Mutations | 39/39 caught; 40/40 on f667778 (one for the engine change) |
| Prototype unit | 25/25 (4 new); 26/26 on 1391408 (5 new) |
| e2e, reduced motion and full motion | 12/12 and 12/12 (scenario J new, G extended) |
| Regressions (round 2) | 71/71 |
| Lint, design rules, docs lint, lessons index | Clean |
| Sources tools | 2/2 |
| Residence engine output | Unchanged from the committed file |
| Two builds | Identical |

## 5. Decisions that are yours

| # | Decision | Why it matters |
|---|---|---|
| D1 | Keep the new order of the waiting answer (art. 100d first, legal aid as the main button)? | Until 4.03.2027 a ponaglenie meets a special act that disarms the inactivity rules. The old order made the template the obvious next step |
| D2 | The twelve findings for the production residence guide (COMPARISON §3, P1–P12; P12 came from the scenarios on 17.10) | The two most serious are P2 and P3. **P2:** the guide never says that the MOS account asks for a PESEL and needs a trusted profile, so PESEL (wave 1) is a precondition of the residence permit (wave 2). **P3:** the Polish legal-stay note drops its conditions |
| D3 | A weekly scheduled check of the four Ukrainian-status acts (`research/2026-10-17-ukr/sources/README.md`, Upkeep) | This is doc 19's gate for wave 3. It runs the two source tools and reports any change. I did not set it up, since it would run outside this session |
| D4 | Whether the service plan (doc 18) adds "PESEL before the MOS account" to the journey | It is a cross-matter dependency that interviews should probe |

## 6. Not done, and why

- **The migration lawyer's review (R5)** is what the draft reference needs next. A person must do it.
- **Thirteen residence questions and five wave 3 questions stay open,** among them travel while waiting and how calls arrive. Work while waiting was narrowed after the report's first version: the act on employing foreigners sets the rules (finding P9). The prototype says "Nie wiem" or restricts.
- **No reference for wave 3.** This is by plan: doc 19 keeps it at R1 until monitoring exists.
- **The reader's answers to "czy mogę wyjechać…" and "czy mój pobyt jest legalny…"** are safe but unhelpful (COMPARISON D17). Improving them would be new behaviour, which waits for Phase 1.

## 7. After the owner's second message: the next matters mapped (17.10)

The owner asked for the next matters "w pełni zmapowane, z wielokrotnością scenariuszy, przemyślanym user flow". Seven maps, all design documents, nothing built. The index is doc 20 (`docs/formalka-next/20-MATTER-MAPS.md`).

| Map | What it holds | Commit |
|---|---|---|
| `maps/residence-temporary.md` | Journey R0–R11, 14 loss points, 24 flow scenarios, the user flow (intake, levels, screens per stage, handoffs, a diagram), the blueprint changes it would need | 0514f2c |
| `maps/cukr-ukr.md` | Journey U0–U9, 12 loss points, 20 scenarios, a compare card that never recommends, the 4.03.2027 window. Valid as of 17.10.2026; this goes beyond doc 19's sources-only plan for wave 3, at the owner's request | 72a1d57 |
| `maps/e-government-access.md` and its sources | Journey E0–E5, 8 loss points, 12 scenarios; the user flow as a prerequisite level inside other cases | 0fff2af |
| `maps/health-insurance.md` and its sources (`research/2026-10-17-health/sources/`) | Journey H0–H6 with a PESEL UKR stage, 16 loss points plus 2 for PESEL UKR, 27 scenarios; a case of its own and a linked task in the residence and CUKR cases; no amounts, no promises of cover, no computed dates; every FACT checked once by a separate agent and corrected (`CHECK.md` in the sources) | 7ce207e; corrections b15c72b |
| `maps/civil-status.md` and its sources (`research/2026-10-17-civil/sources/`), after the owner's "Działaj dalej, stan cywilny" | Birth B0–B5, marriage M0–M5, death D0–D2, foreign records F0–F1; 24 loss points, 25 scenarios; a birth case, a marriage case, a calm death page; no chosen names or laws, no computed dates; every FACT checked once by a separate agent and corrected (`CHECK.md` in the sources) | 48cf1d4; corrections in a later commit |
| `maps/vehicles-licence.md` and its sources (`research/2026-10-17-vehicles/sources/`), after the owner's "Działaj, pojazdy i prawo jazdy" | Vehicle V0–V5, licence L0–L4; 15 loss points, 21 scenarios; fees listed and never summed; every FACT checked once by a separate agent (`.claude/agents/official-fact-checker.md`) and corrected (`CHECK.md` in the sources) | d41b626; corrections d74759a |
| `maps/work.md` and its sources (`research/2026-10-17-work/sources/`), after the owner's "Później kontynuuj z pracą" | Journey W0–W6, 11 loss points, 22 scenarios; the two conditions of legal work, never one alone; citizenship asked only where the law turns on it; the independent check of its facts to be run | 5326734 |

**Found on the way:**
- **The scenarios found an engine bug.** On the paper route (family reunification from abroad), a granted decision left the card locked behind a conditional call for missing papers. The planner now treats a required event (a granted decision) as implying the steps before it, as a recorded later step already did.
  - It has an engine test, a mutation, and evaluation scenario res-08.
  - It is changed in the lab and not independently verified (COMPARISON D25).
  - Production's guide has a related gap: on the paper route, paying is not a step before filing (P12).
- **The trusted profile holds a PESEL** (act on informatization art. 20ad), and confirming it requires one in every way the act allows (art. 20c). So "no PESEL, no trusted profile, no MOS account" is now sourced, not inferred.
- **An e-Doręczenia address for a person needs a PESEL** or an EU cross-border identifier (act on electronic deliveries art. 14). Once the address is entered, public bodies deliver there (art. 7), so an unread mailbox means missed letters.
- **Health care for PESEL UKR holders changed on 5.03.2026.** Without insurance, it now covers four groups (victims of torture or rape, children, residents of collective accommodation, pregnancy) and emergencies (protection act art. 112c, added by Dz.U. 2026 poz. 203). The CUKR card gives the same access as any permit holder (UdSC). The CUKR compare card now names this.
- **The clinic confirms the right by PESEL** (act on health care benefits art. 50 ust. 3; the insurance card was repealed from 1.07.2026 by Dz.U. 2026 poz. 791). Without a PESEL, a person needs a document or the written statement, and a false statement may be billed.
- **The NFZ page and the act differ** on the foreign students' contribution base: the page names the care benefit (świadczenie pielęgnacyjne), the act the special care allowance (specjalny zasiłek opiekuńczy, art. 68 ust. 4 pkt 3). The map states neither amount (OPEN-H1).
- **The road traffic act changed under the map's feet:** Dz.U. 2025 poz. 1734 changes registration in three steps (24.12.2025, 10.06.2026, 18.01.2027), and the act on drivers changed on 17.12.2025 and 3.09.2026 (Dz.U. 2025 poz. 1676). gov.pl's registration page still carries a COVID-era note about 60 days; the act says 30.
- **The separate check of the vehicle map found real errors.** The licence regulation's extract header was wrong (2026 poz. 1162 changes the quoted § 5 ust. 6 itself), the licence intake asked about the wrong conventions, and the map undercounted the road traffic act's amendments. It also found rules the sources had missed:
  - since 4.07.2026 an office takes registration applications through an e-Doręczenia address (regulation 2024/1709 § 20 as given by 2026/891);
  - a licence exchange needs no confirmation of the licence's data for refugee status, asylum, subsidiary protection, a humanitarian or tolerated stay, and two other cases; temporary protection is not among them (regulation 2025/1073 § 14 ust. 12);
  - for a licence the regulation asks a foreigner for a right-of-stay document or a study certificate (§ 14 ust. 4), while gov.pl asks for an address registration;
  - the registration penalties cannot be waived with a warning (road traffic act art. 140n ust. 6; KPA art. 189f);
  - a category B licence from an exchange may start a probation period (act on drivers art. 91 ust. 3 pkt 3, from 3.03.2026).
  The lab re-read each text before changing anything; the changes are not independently verified (`research/2026-10-17-vehicles/sources/CHECK.md`).
- **Work has a new act since 1.06.2025 and changed four times since** (Dz.U. 2025 poz. 621, no consolidated text). Two things are easy to miss:
  - a tourist or visiting visa does not allow work even with a permit (art. 3 ust. 3 pkt 1 with the foreigners act art. 60), and since 22.08.2026 citizens of Georgia, Colombia and Venezuela may not work on a permit during a visa-free stay (Dz.U. 2026 poz. 1072);
  - the regulation on work without a permit (Dz.U. 2025 poz. 1620) is missing from the API's list of the act's implementing acts; a title search found it.
  A biznes.gov.pl page says visas for cultural, sport or humanitarian purposes do not allow work; the act lets a permit holder work on them.
- **The checks of the health and civil status maps** (the owner's "Tak", 17.10) found no outdated rule but many missing exceptions in later paragraphs, and one wrong scenario:
  - health: the municipality's decision gives the right for 90 days only; primary care is not billed after a statement made without the right; the NFZ opens no case for 500 zł or less; a child with a severe disability is family with no age limit;
  - civil status: transcription is mandatory only for a citizen with an earlier Polish record, so the born-abroad scenario was wrong; the outside-office wedding fee is 1 000 zł by regulation; if no one reports a death, the municipality of the place of death does.
  The lab re-read each text before changing anything; the changes are not independently verified (`CHECK.md` in each sources folder).
- **Registering a birth online needs e-Doręczenia** since 1.01.2026, per gov.pl, and so a PESEL and a trusted profile. Parents without them report in person.
- **The office registers a newborn's address only for children of Polish citizens** (act on population records art. 29); gov.pl's opening sentence says it does for everyone. Foreign parents register the child themselves, which brings wave 1 back. The child's own residence title (foreigners act art. 160 pkt 2, 195) is not in the residence map yet.
- **The source tool had two gaps,** found while using it: short act titles and titles with a dash did not match, and annex changes showed as "(none named)". Both are changed in the lab, with tests. A third gap, found by the vehicle check: it did not read regulations, and a hand reading missed that an amendment changed a quoted paragraph. It now lists the paragraphs (§) a regulation's amendment changes, with tests (lesson `docs/solutions/2026-10-17-amendments-checked-only-for-expected-articles.md`).
- **A near-miss in my own check.** I first checked the nine later amendments of the health act only for the articles I expected to cite, and missed that Dz.U. 2026 poz. 203 changes art. 12 and art. 50. Widening the check found it before anything was written. `tools/sources/touched.mjs` now lists every article each amendment changes and flags the cited ones, with a test; lesson `docs/solutions/2026-10-17-amendments-checked-only-for-expected-articles.md`.
- **The matters form a chain:** zameldowanie or the PESEL application, then PESEL, the trusted profile, MOS and the residence card; and PESEL UKR, the trusted profile, then the CUKR card. Doc 20 §3 draws it.

**Tests on 48cf1d4** (after the civil status map and the source tool's changes): as §4, with evaluation 24/24, mutations 40/40 and the source tools 7/7 (`audit/2026-10-16-quality-pass/evidence/`). The later commits (d41b626 and the check's corrections) change documents, source extracts, an agent definition and the source tool `touched.mjs`; on them the docs lint, the prototype lint, the lessons check and the source tools' tests (9/9) were re-run. The engine and the prototype did not change, so their tests were not re-run. Everything is pushed to `lab/quality-pass`, which is public.

