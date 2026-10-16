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

## Evidence

Results on `4146ddb`, in `evidence/`:

| Check | Result |
|---|---|
| Engine tests | 39/39 |
| Mutations | 39/39 |
| Spike S1 | 14/14 |
| Engine bundle | Rebuilt byte for byte |
| Prototype unit tests | 21/21 |
| Lint | Clean |
| Design rules | 0 violations |
| e2e (reduced and full motion) | 11/11 |
| Regressions | 71/71 |

## Still open

- **Overlap** of elements at 320 px or 200% is checked only by eye on screenshots.
- **The automated accessibility rules** do not replace the external audit with screen-reader users (doc 18 §8).
- **Motion tokens exceed the design brief's 200 ms.** The owner's direction of 16.10 asked for a native-app feel. Reduced motion is respected.
