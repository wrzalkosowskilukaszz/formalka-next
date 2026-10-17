# Correctness audit, 17.10.2026

**Asked by:** the owner, 17.10.2026: check that everything built so far works as it should, looking for critical errors and broken functions, not the smallest faults.
**Audited:** commit `651e7c4`. Two fixes the audit led to are in `f77a5ed` (the app) and `18565c6` (the source tools). The evidence in `evidence/` was produced on those two commits. The app there is prototype build `2f253c1ab1c1`, engine `eaede791ccda3d0e`, registry `formalka@04057ef`.
**Done by:** Claude in the lab. Nothing here is an independent verification: the tests and the walks below were written by the same assistant that built the app. Every fix below is "changed in the lab; not independently verified".

Labels: FACT (checked, with the command or file), INFERENCE, OPEN, PROPOSED.

## 1. Findings, most severe first

| # | Severity | Where | What is wrong | Evidence | Status |
|---|---|---|---|---|---|
| K1 | **Critical** | The shared private Artifact "Formalka Next" (last published 16.10.2026) | FACT: it is an older build. Its engine is `a0988a9702344e56`; today's is `eaede791ccda3d0e`. It lacks the changes of 17.10: f1a64d1, 1391408, 0514f2c and f77a5ed. Reproduced on a saved copy of the published page:<br>(a) Residence card, short stay: the map shows "525 zł opłat" and the Teczka "Opłaty w tej sprawie: 525 zł". That adds up two stamp duties that are alternatives (85 or 340 zł, by the reason for the stay) and the card fee.<br>(b) Residence card, family from abroad: after a granted decision the card step stays locked, "Najpierw: Wezwanie z urzędu".<br>(c) The residence scope note ("nie jest jeszcze niezależnie sprawdzona") and the refusal note with free legal aid are missing.<br>The current build has none of the three faults. | `evidence/artifact-vs-current.txt`, `evidence/artifact-after-republish.txt` | **Republished** at the owner's "Tak" (17.10): the same link now holds build `7aa86041c21e` (b3ae464), version 1792236405-483e. Read back and checked: none of (a)–(c). |
| K5 | **Critical** | The current app, residence card, short stay | FACT, found by the browser walk on `651e7c4`. The 1391408 fix stopped the sum on the map, the Teczka and the fees answer only. Two places still added the duties up:<br>- the plan card before approval said "Opłaty: 525 zł";<br>- the guide's payment step said "Opłata: 340 zł + 85 zł + 100 zł", which reads as paying both duties. | `evidence/walk-ui.txt` (rerun after the fix; the first run's fault is quoted in §2) | Changed in the lab in `f77a5ed`; not independently verified. The plan card says the duty depends on the reason. The guide says "340 zł albo 85 zł, zależnie od powodu pobytu … Do tego: 100 zł". A unit test fails when any other module adds fee amounts up or joins them with "+"; it failed on the old code. |
| K2 | High | PESEL, "Nie wiem" on the first question (also for someone else) | FACT. The app first shows the registry's help: "Pokażemy obie drogi do numeru PESEL, przez zameldowanie i przez wniosek, w oficjalnym brzmieniu, żeby łatwo było je porównać". Then it says "Bez tych odpowiedzi nie ustalę drogi z naszych źródeł, więc nie zgaduję". It never shows the two routes. It offers only the registration case, "Popraw odpowiedzi" and "Wróć do Startu", so the app announces something it does not do. The handoff itself is intended and tested (e2e C). | `evidence/pesel-nie-wiem.txt` (before the change) | Option (a), a restriction, at the owner's "Tak" (17.10); changed in the lab in `b3ae464`, not independently verified. Every "Nie wiem" help in the registry says what the plan will show. When "Nie wiem" ends the intake with no route and no further question, the help is not said. When an earlier help did promise something and the case stops later (citizenship), the stop message says that without a plan it will not show it. A unit test and e2e C check it; both failed on the old code. |
| K6 | High (tools behind every map) | `tools/sources/amendments.mjs`, `touched.mjs` | FACT. Two gaps:<br>- Given a consolidated text's own ELI (an obwieszczenie, e.g. DU/2025/734 for the Petty Offences Code), both tools printed "0 amending act(s)" with no warning; that act has 5.<br>- `touched.mjs` did not list transitional rules that apply an act without changing it. So the work map missed Dz.U. 2026 poz. 203 art. 41 (see K3).<br>FACT (api.sejm.gov.pl, 17.10): all 22 runs recorded in the repository used a base act, so no committed claim relied on a false zero. | `evidence/sources-tools.txt`; the commit message of `18565c6` | Changed in the lab in `18565c6`; not independently verified. Both tools resolve a consolidated text to its base act. `touched.mjs` lists transitional articles with "read it by hand"; on the work act it finds 203 art. 41 and 1794 art. 12, 14 and 17. Tests 11/11. The two lessons and the checking agent's step 3 say so. |
| K3 | High (not in the app) | `docs/formalka-next/maps/work.md` and its sources | The independent check (17.10) found legal errors in the work map, which no one has used yet:<br>- missing: the 3-year rule for Ukrainian citizens staying legally (2026/203 art. 41);<br>- missing: the visa requirement for Georgia, Colombia and Venezuela when entering for work (Dz.U. 2026 poz. 1086);<br>- one step is wrong (WS6);<br>- two inferences are contradicted (WL7, WL11). | `research/2026-10-17-work/sources/CHECK.md` | Corrections applied in a separate commit after this one. |
| K4 | Medium (process) | Three earlier maps: `residence-temporary.md`, `cukr-ukr.md`, `e-government-access.md` | None of the three has had the independent check that the lesson `docs/solutions/2026-10-16-read-the-whole-article.md` now requires before a map is relied on. Every check so far found material errors (vehicles, health, civil status, work). The 2026/203 art. 41 rule may also touch the CUKR and UKR map (INFERENCE). | `ls research/*/sources/CHECK.md` | **In progress** at the owner's "Tak" (17.10): the checker runs on each, one at a time, starting with the residence map. |

No other critical fault was found in the app. What was run is listed in §2.

## 2. What was run, and the results

The raw output is in `evidence/`, each file with its command, time, commit and Node version (v22.22.0).

| Check | Result | File |
|---|---|---|
| Engine unit tests | 39/39 | `engine-tests.txt` |
| Engine mutations (planted faults the tests must catch) | 40/40 caught | `engine-mutations.txt` |
| Engine evaluation scenarios | 24/24 | `engine-eval.txt` |
| Spike S1 | 14/14 | `s1-tests.txt` |
| Committed engine bundle equals a fresh build | identical (sha256 `5215000b…`) | `bundle.txt` |
| Prototype unit tests | 27/27 (one added for K5) | `prototype-unit.txt` |
| Prototype lint | clean, 13 modules | `prototype-lint.txt` |
| Prototype build, twice | identical; build `2f253c1ab1c1` | `prototype-build.txt` |
| End-to-end, reduced motion and full motion (12 scenarios each). Every step is checked for console errors, network requests, overflow, accessibility, never-say phrases and the screen contracts | 12/12 and 12/12 | `e2e-reduced-motion.txt`, `e2e-motion.txt` |
| Regressions of the round 1 and 2 findings | 71/71 | `regressions.txt` |
| Design rules | 0 violations | `design-rules.txt` |
| Lessons index | 4/4; 5 lessons still have no automatic check | `lessons.txt` |
| Docs lint | 83 files, clean | `docs-lint.txt` |
| Source tools | 11/11 (two added for K6) | `sources-tools.txt` |
| Residence engine output equals the committed one | identical | `residence-engine-output.txt` |
| **New: engine walk** (`walk-engine.mjs`):<br>- every answer path of all five cases, with "Nie wiem";<br>- every route choice and city;<br>- each plan played to its end: tasks done, each step's event, the office's request and the fix, both decision outcomes | 519 question states, 738 finished plans, 1 521 plays to the end; 0 faults. One end has nothing to record by design: citizenship "after-appeal", the court complaint. The self-test plants 5 faults and catches all 5 | `walk-engine.txt` |
| **New: browser walk** (`walk-ui.mjs --paths 6`):<br>- per case, the first, the last and 6 seeded random answers, not only the e2e test's fixed paths;<br>- after each plan: Teraz, Mapa, every step's sheet, Teczka, Kalendarz, Start and the chat;<br>- the clock moved 7 days, each step recorded, then every screen again;<br>- then all five cases at once | On `651e7c4`: 1 fault, "residence-card/random5 intake [chat]: alternative duties added up: 525 zł shown (340 + 85)" (K5). On `f77a5ed`: 30 runs to the end, 11 paths that stop with a stated handoff (PESEL and citizenship "Nie wiem"), 0 faults | `walk-ui.txt` |
| The published Artifact against the current build (`compare-builds.mjs`) | see K1 | `artifact-vs-current.txt` |
| Isolation:<br>- the `pre-push` hook allows only `github.com/wrzalkosowskilukaszz/formalka-next`;<br>- no storage or network calls in `prototype/src` or the engine source;<br>- `reference/` has only been added to | as stated; the walks also saw 0 network requests | this audit's session |

What the walks look for:
- an exception, or a plan the engine's own checks reject;
- broken text (`undefined`, `NaN`, `[object Object]`, `Invalid Date`) or a never-say phrase;
- a negative or missing fee, an impossible due date, or a lock with no reason;
- a plan that cannot go on, or an intake that stops without saying why;
- alternative stamp duties shown added up or joined with "+".

## 3. Limits

- The walks check that the app does not break. They do not check that the content is right. Content is checked against official texts by the separate checking agent (`.claude/agents/official-fact-checker.md`), one map at a time.
- The registry (`reference/`) is production's verified content at `04057ef`. This audit did not re-check it. Known lab findings on it are in `audit/2026-10-16-residence/COMPARISON.md`; the owner decides on them.
- The browser walk runs Chromium at phone size with reduced motion. Full motion and dark mode are covered only by the e2e scenarios.
- The person's free text is covered only by the e2e scenarios and the round 1 and 2 regressions, not by the walks.
- The saved copy of the Artifact is not committed, because the Artifact is private. Its sha256 is in `evidence/artifact-vs-current.txt`.
- The repository is public, so pushing this audit publishes it. It holds no personal data; every case in it is synthetic.

## 4. How to run it again

```
node prototype/build.mjs
node audit/2026-10-17-correctness/walk-engine.mjs --selftest
node audit/2026-10-17-correctness/walk-engine.mjs
node audit/2026-10-17-correctness/walk-ui.mjs --paths 6
node audit/2026-10-17-correctness/compare-builds.mjs prototype/dist/index.html [a saved copy of the Artifact]
node audit/2026-10-17-correctness/peek.mjs pesel '^Dla siebie$' '^Nie wiem$'
```
