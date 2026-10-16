# Regressions for the round 1 findings (F1, F2, F3, F5)

**Not an independent check.** The assistant that wrote the fixes also wrote these probes and fixed what they found. A pass here means only that these inputs behave as stated. It does not approve the fixes.

## How to run

```
node audit/2026-10-16-round2/regressions/run.mjs [--out FILE]
```

- The script loads what the prototype ships: the engine's browser bundle and the prototype's reader modules, the same way the unit tests load them.
- Each probe prints the expected behaviour, taken from the finding, and the actual output.
- The exit code is 1 when any probe fails.

## Results

| Run | File | Result |
|---|---|---|
| Round 2 version under review, `6b3d874` (the same probes, copied into a clean worktree) | `RESULTS-6b3d874.txt` | **64/71**: 7 failures |
| This branch, after the fixes below | `RESULTS-branch.txt` | 71/71 |

FACT (this run, 2026-10-16). These probes failed on `6b3d874`:

| Finding | Probe | Actual on `6b3d874` | Fixed on this branch by |
|---|---|---|---|
| F1 | The `ruleRef`s of two fees swapped. Both are valid rules of the same plan | `ok: true`. The plan cites the wrong source for each fee | The content check now compares each item's `ruleRef` and quotes (`packages/case-engine/src/verify.ts`) |
| F1 | The quoted words under a task altered | `ok: true` | The same change |
| F5 | "Wniosek nie został złożony" | `filed`: a filing that did not happen | A negated passive ("nie został/jest/był …") is read as negated |
| F5 | "Nie wiem, czy złożyłem" | `filed` | Any other "nie" in the answer means the filing is asked back, never taken |
| F5 | "Wniosek nie jest jeszcze złożony" | `filed` | The same change |
| F5 | "22.10.28" | 22.10.**2026** at **10:28** | `dd.mm.yy` is read as a date in 20yy and never as an hour |
| F5 | "w 2028 roku, 22 października" | 22.10.**2026**: the year was lost because it sits in another clause | A year written apart from its day is asked back (`ambiguous`), not joined by guess |

Each fix also has a unit test:
- `packages/case-engine/test/verify.test.ts`: 2 new mutations;
- `prototype/test/understand.test.mjs`: 1 new test.

The audit's own inputs passed on `6b3d874` as well. The failures were all in variants.

## What each group checks (scope)

- **F1. Content changed behind valid references.**
  - Probes: 16 edits of a real plan (address registration, Warsaw, non-EU; residence card, study). Each keeps every `ruleRef` valid. Each edit must make `E.validate(...).ok` false.
  - Edits: amounts (999 999 zł and a plausible 340 → 34 zł), due dates (2099, and one day earlier), the deadline period, a removed deadline, a harmful task title, one or all tasks removed, an invented task, an invented office, a real office with an invented name, a changed address, an unlocked level, a swapped source, an altered quote.
  - Controls: 2 untouched plans must pass.
- **F2. Decision events.**
  - A refused residence decision: no card level.
  - A granted decision: card level present (control).
  - No recorded outcome: the card is not available.
  - cit-06: the appeal is counted; the court complaint is not counted from the first decision.
  - cit-07: the court complaint is counted from the Minister's separately served decision (2027-09-09).
  - A grant at either instance leaves no appeal or court deadline.
- **F3. Exemptions.**
  - res-02: the exemption without a rule stays `unknown`, and the full 340 zł is counted.
  - For two other purposes, no exemption is shown as granted.
- **F5. Reader.**
  - Consent on approval cards (strict mode): 12 hedged or contradictory answers must not read as yes; 4 controls.
  - Negation: 12 answers must not read as filed; 3 controls.
  - Explicit years: 7 answers; asking back is accepted.
  - A ruled-out day: 5 answers; asking back is accepted.

## Limitations

- **Hand-picked, not blind.** The variants were written by the assistant that wrote the fixes, and three F5 variants and one control were added after the first failures. The 71/71 on this branch partly measures fitting to these inputs. A fair test needs inputs written by someone who has not seen the code, for example the auditor or real participants' wording from the sessions.
- **The content check only compares the plan with the registry and with a plan recomputed by the same engine.** It cannot find an error in the registry or in the engine's own rules. Wrong content that the engine itself produces passes. The draft reference (`../reference/`) exists to catch that, and it found D1–D8.
- **F1 tampering is a future risk.** Today the prototype's plans come only from the engine. The check matters once anything else, such as a model or a sync, can produce or change a plan.
- **The reader is pattern-based.** It reads Polish only, without a language model. Words outside its patterns are asked back, which is safe but may frustrate. One cost of the new caution: "Wszystko ok, nie było problemu, złożyłem" is now asked back instead of read as filed (a control in the run).
- **"2028-10-22" (ISO) is not read; it is asked back.**
- **Not covered here:**
  - F4 (address-registration document groups), which the reference comparison covers;
  - F6 (an independent reference), which is open;
  - F7 (privacy) and F8 (metrics);
  - the UI wording around these results (covered by the e2e scenarios, not here).
