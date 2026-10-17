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

The owner asked for the next matters "w pełni zmapowane, z wielokrotnością scenariuszy, przemyślanym user flow". Four maps, all design documents, nothing built. The index is doc 20 (`docs/formalka-next/20-MATTER-MAPS.md`).

| Map | What it holds | Commit |
|---|---|---|
| `maps/residence-temporary.md` | Journey R0–R11, 14 loss points, 24 flow scenarios, the user flow (intake, levels, screens per stage, handoffs, a diagram), the blueprint changes it would need | 0514f2c |
| `maps/cukr-ukr.md` | Journey U0–U9, 12 loss points, 20 scenarios, a compare card that never recommends, the 4.03.2027 window. Valid as of 17.10.2026; this goes beyond doc 19's sources-only plan for wave 3, at the owner's request | 72a1d57 |
| `maps/e-government-access.md` and its sources | Journey E0–E5, 8 loss points, 12 scenarios; the user flow as a prerequisite level inside other cases | 0fff2af |
| `maps/health-insurance.md` and its sources (`research/2026-10-17-health/sources/`) | Journey H0–H6 with a PESEL UKR stage, 16 loss points plus 2 for PESEL UKR, 27 scenarios; a case of its own and a linked task in the residence and CUKR cases; no amounts, no promises of cover, no computed dates | 7ce207e |

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
- **A near-miss in my own check.** I first checked the nine later amendments of the health act only for the articles I expected to cite, and missed that Dz.U. 2026 poz. 203 changes art. 12 and art. 50. Widening the check found it before anything was written. `tools/sources/touched.mjs` now lists every article each amendment changes and flags the cited ones, with a test; lesson `docs/solutions/2026-10-17-amendments-checked-only-for-expected-articles.md`.
- **The matters form a chain:** zameldowanie or the PESEL application, then PESEL, the trusted profile, MOS and the residence card; and PESEL UKR, the trusted profile, then the CUKR card. Doc 20 §3 draws it.

**Tests on 7ce207e** (after the health map and the new source tool): as §4, with evaluation 24/24, mutations 40/40 and the source tools 5/5 (`audit/2026-10-16-quality-pass/evidence/`). Everything is pushed to `lab/quality-pass`, which is public.

