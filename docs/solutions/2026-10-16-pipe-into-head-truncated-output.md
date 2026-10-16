---
rule: Never pipe a generator that writes a file into head; write the file first, then read part of it.
kind: tooling
files: [audit/**, tools/**, packages/case-engine/eval/**]
check: none: a shell habit; candidate for a wrapper script that always writes the full file
date: 2026-10-16
commits: []
---
**Problem.** `node engine-output.mjs | tee out.txt | head -120` truncated `out.txt` when `head` closed the pipe (SIGPIPE). Evidence nearly went into the repository incomplete.

**Fix.** Rerun without `head`; read the file afterwards.
