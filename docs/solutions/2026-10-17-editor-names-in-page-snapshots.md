---
rule: Before saving a page snapshot, remove the names of page editors and authors from its publication record and change history; keep offices, and note the removal in the header.
kind: content-safety
files: [research/**]
check: tools/sources/no-names.test.mjs::fails when a page snapshot in research/*/sources holds a date and time followed by a person's name, or an "Autor:" field naming a person
date: 2026-10-17
commits: []
---
**Problem.** Two page snapshots kept the names of the officials who edited them: the Warmińsko-Mazurski office's page on temporary permits (its publication record and a change history of 46 entries) and a zielonalinia.gov.pl article (its "Autor:" field). The lab repository is public, so a push published them. They are not the people the app serves, but they are named people who did not ask to be in the lab.

**Cause.** The page converter keeps the whole main element, and gov.pl and BIP pages print the editor's name under "Informacje o publikacji dokumentu" and in "Pokaż historię zmian". The newer snapshots had the names removed by hand; the older ones were never looked at.

**Fix.** The names were replaced by "[editor's name removed]" or "[author's name removed]", with a note in each header (17.10.2026, at the owner's request). The names stay in the branch's earlier commits (from 2c301c3 and f685fd4); removing them from history needs a force-push, which is the owner's decision.

**How it is caught now.** `tools/sources/no-names.test.mjs` scans every page snapshot; run on the files as committed before the fix, it finds 47 and 1 lines. A minister's signature on an official letter and the signatures on acts are not page records and stay.
