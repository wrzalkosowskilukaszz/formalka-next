---
rule: For every reader fix, add variants beyond the reported input (passive voice, a separate clause, a two-digit year) and run the regression runner.
kind: reader
files: [prototype/src/js/35-understand.js, prototype/test/understand.test.mjs]
check: audit/2026-10-16-round2/regressions/run.mjs
date: 2026-10-16
commits: [d2d0b7e]
---
**Problem.** Round 1 fixed the auditor's five inputs. Variants still failed on `6b3d874`:
- "Wniosek nie został złożony" read as filed;
- "22.10.28" read as 10:28;
- "w 2028 roku, 22 października" lost its year.

**Cause.** The fixes were tested only on the reported strings.

**Fix.**
- A negated passive is negated.
- Any other "nie" asks back.
- dd.mm.yy is a date.
- A detached year asks back.

**Caught now by** unit tests and the regression runner (71 probes). The variants are not blind: the auditor should add their own.
