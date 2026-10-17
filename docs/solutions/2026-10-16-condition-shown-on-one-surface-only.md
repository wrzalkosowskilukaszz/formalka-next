---
rule: A condition on a task, document or fee (onlyIf, not needed, alternative duties) shows on every surface that shows the item; search the code for each place that renders it before calling a fix done.
kind: content-safety
files: [prototype/src/js/**, packages/case-engine/src/advisor.ts]
check: prototype/test/e2e.mjs::I, the Teczka and the map sheet mark the family member's card as conditional; prototype/test/notes.test.mjs::fee amounts are added up or joined with "+" only in feeSum and feeLine
date: 2026-10-16
commits: []
---
**Problem.** F4's fix marked the EU family member's residence card as conditional ("sprawdź, czy Cię dotyczy", "Tylko dla członka rodziny obywatela UE"), but only on Teraz. The Teczka listed it as a plain document with "Mam?", so an EU citizen could think they need it (comparison row D1).

**Cause.** The Teczka renders tasks with its own markup, and the fix touched only `taskRow`.

**Fix.** The Teczka and the map's level sheet show the same condition and the onlyIf label; the Teczka also shows "Nie dotyczy albo masz dokument zamienny". The visit reminder already carried "(sprawdź, czy Cię dotyczy)".

**Caught now by** scenario I, which reads the EU citizen's Teczka. That check was shown to fail without the fix.

**Found again (17.10.2026, correctness audit K5).** The fix for alternative stamp duties (residence COMPARISON D21, 1391408) changed the three places it named: the map, the Teczka and the fees answer. Two more showed fees: the plan card before approval still said "Opłaty: 525 zł" for a short stay, and the guide's payment step said "Opłata: 340 zł + 85 zł + 100 zł". The browser walk in `audit/2026-10-17-correctness/` found the first; reading every use of `amountPln` found the second. Both now use `feeSum` and `feeLine`, and a unit test fails when any other module adds amounts up or joins them with "+". The test was shown to fail on the old code.
