---
rule: Before writing that the engine "does not mention" something, list every note and task on every level of the plan; a printout of the important ones is not the whole plan.
kind: evidence-wording
files: [audit/**/COMPARISON.md, audit/**/engine-output.mjs]
check: audit/2026-10-16-round2/reference/engine-output.mjs::prints every note per level
date: 2026-10-16
commits: [f7318b8]
---
**Problem.** Comparison row D3 said the engine never mentions that a person without PESEL must come in person. The registry had that note; it was hidden on the route level.

**Cause.** `engine-output.mjs` printed only important notes, and the claim was made from that printout.

**Fix.**
- D3 was corrected.
- The note is now placed on its step.
- `engine-output.mjs` prints every note, with `!` for the important ones.
