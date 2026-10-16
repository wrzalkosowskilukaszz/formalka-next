---
rule: In a bulk text replacement, replace longer patterns before shorter ones, then diff the result and re-run the linters before building on it.
kind: tooling
files: [prototype/src/**, packages/**, tools/**]
check: prototype/test/design.test.mjs::the duration rule caught it
date: 2026-10-16
commits: [28a55c5]
---
**Problem.** Replacing "0ms !important" before "200ms !important" turned "200ms" into "200s" in the reduced-motion rules. Reduced-motion fades would have taken 200 seconds.

**Cause.** The order of string replacements in a one-off Python script.

**Fix.** Corrected by hand. The design lint's duration rule flagged it before any commit.
