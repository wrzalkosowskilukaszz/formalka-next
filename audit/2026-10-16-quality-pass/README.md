# Quality pass (branch `lab/quality-pass`, from `lab/service-plan`), 16.10.2026

**Not an independent check.** Claude made the changes and ran the tests.

## What changed

- **Design rules held by tests** (doc 18 §5.1):
  - D1, tokens only: 103 raw values moved to tokens; no text below 12 px (it was 9–11 px).
  - D2, accessibility: axe-core, 0 serious or critical issues. One real fix: the chat log can be reached by keyboard.
  - D3, touch targets of at least 44 px.
  - D9, one primary action in view.
  - D11, reflow at 320 px and text at 200%. Rows wrap; the case title wraps.
- **Screen contracts** (doc 18 §5.3) asserted on every e2e step.
- **The in-app form is practice only** (doc 18 R4):
  - it no longer ticks the form task;
  - nothing calls it a PDF to print;
  - the official blank is the primary action.
- **The last deadline reminder never falls on a day off** (D7): it comes on the last working day before; the date itself never moves.
- **Three new engine mutations** (39/39 caught).
- **Lessons from mistakes** (`docs/solutions/`, the owner's suggestion of 16.10):
  - 17 lessons, each with a one-line rule, the files it concerns and the check that holds it;
  - a generated index, not loaded at session start;
  - `tools/lessons/slice.mjs`, which prints only the rules for the files at hand.

  Two rules became checks: `tools/lint-docs.mjs` (no bare "Fixed" in a Status column) and `engine-output.mjs`, which prints every note. The pre-commit hook keeps it all fresh.
- **A document's condition on every surface:** the Teczka and the map sheet now show "sprawdź, czy Cię dotyczy" and who the document is for. Until now only Teraz did (D1).
- **The PESEL plan against the sources:** `PESEL-COMPARISON.md`. It agrees with the sources on the essentials, with four minor gaps (P1–P4).

## Evidence

Results on the branch's latest evidence commit, in `evidence/` (each file names its commit):

| Check | Result |
|---|---|
| Engine tests | 39/39 |
| Mutations | 39/39 |
| Spike S1 | 14/14 |
| Engine bundle | Rebuilt byte for byte |
| Prototype unit tests | 21/21 |
| Lessons tooling | 4/4; index fresh |
| Docs lint | 0 bare status cells |
| Lint | Clean |
| Design rules | 0 violations |
| e2e (reduced and full motion) | 11/11 |
| Regressions | 71/71 |

## Still open

- **Overlap** of elements at 320 px or 200% is checked only by eye on screenshots.
- **The automated accessibility rules** do not replace the external audit with screen-reader users (doc 18 §8).
- **Motion tokens exceed the design brief's 200 ms.** The owner's direction of 16.10 asked for a native-app feel. Reduced motion is respected.
