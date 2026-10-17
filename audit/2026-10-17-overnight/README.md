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
| Restrictions in the prototype | Four, each with a test that fails without it. See §2 | f1a64d1 |
| Evidence | All suites, on the commit (§4) | cc82317 |
| Wave 3 sources | `research/2026-10-17-ukr/sources/`: temporary protection (where it moved in 2026), PESEL UKR, the CUKR card, the winding-down act's dates. No reference, as doc 19 plans | 43ebc87 |
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

## 3. Mistakes found and corrected overnight

- The card articles of Dz.U. 2025 poz. 1794 take effect **by point**: 1.04.2026 for art. 226–229, and 27.04.2026 for art. 248. My source headers had said 27.04.2026 for all of them. The headers are corrected, and a tool and a lesson now cover this.
- The engine comparison showed that the draft had missed four provisions that the production registry cites:
  - **art. 225c**, the legal basis of the 3-working-day rule after an MOS outage;
  - **art. 225b**, under which the MOS account asks for a PESEL number;
  - **art. 100d of the special act**, under which the voivode's time limits in residence cases do not run until 4.03.2027, for every foreigner;
  - **art. 229 ust. 4**, under which, after family reunification from abroad, the first card is issued on application.

  Each was checked in the primary text before the draft changed (its §9). Two lessons record the misses.
- A single e2e run failed by 1 px (1281 > 1280) right after the desktop resize, with no element past the edge. The page check now has the same 1 px tolerance as the element checks. Five later full runs passed.

## 4. Tests on f1a64d1 (`audit/2026-10-16-quality-pass/evidence/`)

| Suite | Result |
|---|---|
| Engine tests | 39/39 |
| Evaluation | 18/18 |
| Mutations | 39/39 caught |
| Prototype unit | 25/25 (4 new) |
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
| D2 | The eight findings for the production residence guide (COMPARISON §3, P1–P8) | The two most serious are P2 and P3. **P2:** the guide never says that the MOS account asks for a PESEL and needs a trusted profile, so PESEL (wave 1) is a precondition of the residence permit (wave 2). **P3:** the Polish legal-stay note drops its conditions |
| D3 | A weekly scheduled check of the four Ukrainian-status acts (`research/2026-10-17-ukr/sources/README.md`, Upkeep) | This is doc 19's gate for wave 3. It runs the two source tools and reports any change. I did not set it up, since it would run outside this session |
| D4 | Whether the service plan (doc 18) adds "PESEL before the MOS account" to the journey | It is a cross-matter dependency that interviews should probe |

## 6. Not done, and why

- **The migration lawyer's review (R5)** is what the draft reference needs next. A person must do it.
- **Thirteen residence questions and five wave 3 questions stay open,** among them work and travel while waiting, and how calls arrive. The prototype says "Nie wiem" or restricts.
- **No reference for wave 3.** This is by plan: doc 19 keeps it at R1 until monitoring exists.
- **The reader's answers to "czy mogę wyjechać…" and "czy mój pobyt jest legalny…"** are safe but unhelpful (COMPARISON D17). Improving them would be new behaviour, which waits for Phase 1.
