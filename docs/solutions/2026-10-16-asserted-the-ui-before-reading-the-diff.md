---
rule: Before asserting which steps a change marks or alters, print the engine's diff for that change; do not assume from what the screen shows.
kind: testing
files: [prototype/test/e2e.mjs, prototype/src/js/32-correct.js]
check: none: a habit; e2e I asserts the real diff now
date: 2026-10-16
commits: [5c87b72]
---
**Problem.** Scenario I expected the correction from permanent to temporary stay to mark "Formularz". The engine changes only the filing step: the permanent form becomes the temporary one there.

**Fix.** The assertion now targets "Wizyta w urzędzie gminy", and asserts that "Formularz" is not marked.
