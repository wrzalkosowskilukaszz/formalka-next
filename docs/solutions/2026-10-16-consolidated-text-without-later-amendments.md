---
rule: Never quote a consolidated text as the law in force without listing the amendments after it (node tools/sources/amendments.mjs <ELI> <its date>) and the announcements that set their dates.
kind: legal-source
files: [audit/**/reference/**, research/**, docs/formalka-next/19-DOMAIN-ROADMAP.md]
check: tools/sources/amendments.mjs::lists amending acts from api.sejm.gov.pl, resolving a consolidated text to its base act (tools/sources/touched.test.mjs)
date: 2026-10-16
commits: []
---
**Problem.** The address-registration reference called the new art. 43 ust. 3 and ust. 5 of the act on population records "not yet in force" (OPEN-4). They had applied since 27.04.2026: Dz.U. 2025 poz. 1794 art. 5, with the date set by Komunikat MSWiA, M.P. 2026 poz. 370. The production guide already quoted ust. 5.

**Cause.** The draft used the consolidated text (Dz.U. 2026 poz. 384, legal state 10.03.2026) and its footnotes, and did not look for later amending acts or the announcement.

**Fix.**
- The reference was corrected, and OPEN-4 is resolved.
- `tools/sources/amendments.mjs` lists the acts amending a given act after a date (api.sejm.gov.pl ELI references). Run on the act on foreigners and on the act on population records, it found Dz.U. 2025 poz. 1794 and 2026 poz. 203.

**Found in use (17.10.2026, correctness audit).** Given a consolidated text's own ELI (an obwieszczenie, such as DU/2025/734 for the Petty Offences Code), both tools printed "0 amending act(s)": the API lists amendments only on the act the text consolidates. No committed claim relied on it (every recorded run used the base act), but the trap was silent. Both tools now resolve a consolidated text to its base act and say so; a test covers it.

**Not automatic yet:** nothing runs the tool by itself. A later step could run it in the evidence script for every act cited in `research/` and `reference/`.
