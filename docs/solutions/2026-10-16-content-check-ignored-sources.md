---
rule: The content check compares every field a person reads, the source reference and the quoted words included.
kind: engine
files: [packages/case-engine/src/verify.ts, packages/case-engine/test/verify.test.ts]
check: packages/case-engine/tools/mutations.mjs::verify-source-not-compared
date: 2026-10-16
commits: [d2d0b7e]
---
**Problem.** Swapping two fees' valid `ruleRef`s, or altering a quote, passed `E.validate`. The plan would cite the wrong source.

**Cause.** The item keys compared titles, amounts and dates, not sources.

**Fix.** Every key includes `ruleRef` and the quotes; notes include their statement.

**Caught now by** two verify tests and a mutation.
