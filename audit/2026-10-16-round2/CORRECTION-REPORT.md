# Round 2 correction: report

- **Branch:** `lab/round2-correction`, from `6b3d874`. Not merged. Nothing was published: no Artifact and no deployment.
- **Requested by:** the owner, Łukasz, on 16.10.2026.
- **Written by:** Claude, the same assistant that built the prototype.

**Nothing in this report is an independent verification.** Every test below was written or run by the assistant whose work it checks. "Changed in the lab" means a change was made and its own checks pass.

## 1. Changes and evidence

| # | What | Commits | Checked by |
|---|---|---|---|
| C1 | **Correcting a confirmed answer after approval.** "Popraw" under "Twoje odpowiedzi", or typed words. The person sees the proposed plan diff and approves it or keeps the plan; the history keeps the old answer, the new one and the decision. Until the decision, the affected steps carry "Do ponownego sprawdzenia", the assistant offers no step there, and reminders wait. When the corrected answer leaves no route in the sources, the whole plan is marked and the person withdraws the correction or keeps it open | `5c87b72` | e2e I; unit test (`affectedBy`, `correctionIn`) |
| C2 | **Draft reference** from primary sources: UEL Dz.U. 2026 poz. 384; UE2006 art. 2; gov.pl, 11.03.2026. Written without the planner. It covers 11 cases and leaves OPEN-1 to OPEN-12 unresolved. It comes with the engine comparison (D1–D10) and two checklists: a plain participant list and a scoring sheet | `5f7ad89`, `f7318b8` | Not reviewed (see §3) |
| C2 | **Restrictions where the sources do not settle an issue:** | | |
| | D7: a day off on an open-reading deadline is named, and the date is not moved | `22183f2` | Engine and prototype unit tests |
| | D3 and D10: the no-PESEL rule and the no-owner notes are shown on the step they qualify; "melduje od razu" is no longer left unqualified | `bce9ff5` | e2e B, I |
| | Study scope notice; the D1, D2, D4, D5 and D6 groups are excluded from the study | `22183f2` | e2e F, I |
| C3 | **Regressions for F1, F2, F3 and F5.** 71 probes: the audit's inputs, variants and controls | `d2d0b7e` | `regressions/` |
| C3 | Results: **64/71 on `6b3d874`**. 7 failures, all in variants. The fixes cover a swapped fee source, an altered quote, "Wniosek nie został złożony", "Nie wiem, czy złożyłem", "Wniosek nie jest jeszcze złożony", "22.10.28" and a year in another clause. **71/71 on the branch** | `d2d0b7e` | `regressions/RESULTS-*.txt` |
| C4 | **Revised session script** (`prototype/README.md`): two fictional in-scope identity cards, a disclosure read aloud, one neutral task, the plain checklist as the first comparison with the order rotated, and three moments (correction, uncertainty, no owner). It measures the correct next action, error recovery, moderator help and understanding of the limits. "Fixed" became "changed in the lab; not independently verified" | `c3a9b00` | Not reviewed |

Evidence on `c3a9b00`, Node 22.22.0 (`evidence/`):

| Check | Result |
|---|---|
| Engine tests | 39/39 |
| Engine evaluation | 18/18 |
| Engine mutations | 36/36 |
| Spike S1 | 14/14 |
| Engine bundle | Rebuilt byte for byte |
| Prototype unit tests | 19/19 |
| Prototype lint | Clean |
| Prototype e2e | 9/9, reduced and full motion |
| Two prototype builds | Identical |
| Regressions | 71/71 |

## 2. Remaining blockers for moderated sessions

1. **No independent review** of the reference and the checklists (F6). Until a named person with expertise signs the review sheet (§6 of the reference), correctness cannot be scored.
2. **Open questions on the in-scope cards:**
   - OPEN-1 and OPEN-2 (day count, days off). Both dates are shown, with a warning.
   - OPEN-5 (which Warsaw district office). The moderator checks it before the sessions.
   - OPEN-8 (the no-owner procedure). Not scored.
   - OPEN-11 (in person without PESEL).
   - OPEN-12 (a lease without the owner's confirmation). Scored as uncertain.
3. **Registry and engine discrepancies.**
   - D1, D2, D4, D5 and D6 are excluded from the study, not fixed. Fixing them needs registry content, which is production content and the owner's decision.
   - D9 has a low risk.
   - D7 has a known limit: the "Dziś mija bezpieczny termin" reminder can still fire on a closed day.
4. **The regression probes are not blind.** Three variants and one control were added after the first failures. The auditor should run their own inputs.
5. **The repository is public.** ADR-N001 says private. Session notes and recordings must stay out of it.
6. **Engine changes on this branch** (`messages.ts`, `verify.ts`) need the engine session's agreement before any merge.

## 3. Materials that need human review

| Material | Reviewer |
|---|---|
| `reference/ADDRESS-REGISTRATION-REFERENCE-DRAFT.md`, with its source extracts | A subject-matter expert (an office, a law clinic) |
| `reference/COMPARISON.md` (D1–D10) | The same, and the engine session |
| `reference/CHECKLISTS.md`: A, the participant list in Polish, for accuracy and plain language; B, the scoring sheet | The expert, and the auditor |
| The session script (`prototype/README.md`) and its data handling (consent, retention) | The owner, and the auditor |
| The correction flow's wording, and the lead-ins in front of the placed notes | The owner (UX) |
| `packages/case-engine/src/voice.ts` (second-person wording) | The owner |

## 4. Recommendation (Phase 1 only)

- **Problem interviews:** they can go ahead now. They need no prototype.
- **Moderated sessions with the prototype, on fictional cards, address registration only.** Hold them until all of these are done:
  1. the reference and checklist A are independently reviewed and signed;
  2. the auditor has re-checked C1 and the regressions with their own inputs;
  3. the owner has approved the script and the data handling.

  Until then, run at most a usability pilot with one or two people, and do not report correctness.
- **Not approved:** no beta, no production, no real cases.
