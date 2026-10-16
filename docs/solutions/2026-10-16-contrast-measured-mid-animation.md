---
rule: Measure colour contrast at rest: wait for finite animations to end before running axe.
kind: testing
files: [prototype/test/e2e.mjs]
check: prototype/test/e2e.mjs::axeIssues
date: 2026-10-16
commits: [63d497c]
---
**Problem.** axe reported contrast failures on a sheet and a toast. They were measured during their fade-in.

**Fix.** `axeIssues` waits for every finite animation; loops are left alone. The remaining finding (the chat log not reachable by keyboard) was real and was fixed.
