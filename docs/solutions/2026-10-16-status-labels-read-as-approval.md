---
rule: Never write "Fixed" or "Verified" for our own change; write "changed in the lab; not independently verified" and say who checked.
kind: evidence-wording
files: [audit/**, docs/**]
check: tools/lint-docs.mjs
date: 2026-10-16
commits: [c3a9b00]
---
**Problem.** The round 2 package marked F1–F8 "Fixed". The auditor had not verified them, and a later regression run found 7 failures in variants.

**Cause.** Status words copied from a task tracker into a report for an independent reviewer.

**Fix.** The wording was changed in RESPONSE.md, the round 2 README and doc 00.

**Caught now by** `tools/lint-docs.mjs`, which fails on a bare status word in any table's "Status" column under `audit/` or `docs/`.
