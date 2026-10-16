---
rule: A registry note that qualifies a step is shown on that step; check where the plan puts each note, level by level, not only that the registry has it.
kind: content-safety
files: [prototype/src/js/40-case.js, blueprints/*.yaml, reference/*/procedure-*.yaml, audit/**/COMPARISON.md]
check: prototype/test/e2e.mjs::B and I, placedNotes for no-pesel-in-person, no-owner-procedure, legal-basis
date: 2026-10-16
commits: [bce9ff5, d568186]
---
**Problem.** Three notes that change what a person does sat on the route level, beyond the three notes the Teraz view shows:
- "bez PESEL przyjdź osobiście";
- "bez potwierdzenia właściciela urząd prowadzi postępowanie";
- the PESEL application's legal basis.

Meanwhile the last step said "Urzędnik melduje Cię od razu".

**Cause.** The blueprint placed only one note per procedure on a level; the rest stayed with the route, where nobody looks.

**Fix.** `NOTES_AT` in `40-case.js` places each note on the step it qualifies, in the registry's words, with a short lead-in.

**Caught now by** e2e B and I.
