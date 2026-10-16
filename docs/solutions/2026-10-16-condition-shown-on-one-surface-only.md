---
rule: When a task or document carries a condition (sprawdź, onlyIf, not needed), every surface that lists it shows that condition: Teraz, the map's sheet, the Teczka and the visit reminder.
kind: content-safety
files: [prototype/src/js/40-case.js, prototype/src/js/45-guide.js, packages/case-engine/src/advisor.ts]
check: prototype/test/e2e.mjs::I, the Teczka and the map sheet mark the family member's card as conditional
date: 2026-10-16
commits: []
---
**Problem.** F4's fix marked the EU family member's residence card as conditional ("sprawdź, czy Cię dotyczy", "Tylko dla członka rodziny obywatela UE"), but only on Teraz. The Teczka listed it as a plain document with "Mam?", so an EU citizen could think they need it (comparison row D1).

**Cause.** The Teczka renders tasks with its own markup, and the fix touched only `taskRow`.

**Fix.** The Teczka and the map's level sheet show the same condition and the onlyIf label; the Teczka also shows "Nie dotyczy albo masz dokument zamienny". The visit reminder already carried "(sprawdź, czy Cię dotyczy)".

**Caught now by** scenario I, which reads the EU citizen's Teczka. That check was shown to fail without the fix.
