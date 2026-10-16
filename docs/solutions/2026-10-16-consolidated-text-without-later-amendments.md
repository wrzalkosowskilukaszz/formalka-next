---
rule: Never quote a consolidated text as the law in force without listing the amendments after it (node tools/sources/amendments.mjs <ELI> <its date>) and the announcements that set their dates.
kind: legal-source
files: [audit/**/reference/**, research/**, docs/formalka-next/19-DOMAIN-ROADMAP.md]
check: tools/sources/amendments.mjs::lists amending acts from api.sejm.gov.pl
date: 2026-10-16
commits: []
---
**Problem.** The address-registration reference called the new art. 43 ust. 3 and ust. 5 of the act on population records "not yet in force" (OPEN-4). They had applied since 27.04.2026: Dz.U. 2025 poz. 1794 art. 5, with the date set by Komunikat MSWiA, M.P. 2026 poz. 370. The production guide already quoted ust. 5.

**Cause.** The draft used the consolidated text (Dz.U. 2026 poz. 384, legal state 10.03.2026) and its footnotes, and did not look for later amending acts or the announcement.

**Fix.**
- The reference was corrected, and OPEN-4 is resolved.
- `tools/sources/amendments.mjs` lists the acts amending a given act after a date (api.sejm.gov.pl ELI references). Run on the act on foreigners and on the act on population records, it found Dz.U. 2025 poz. 1794 and 2026 poz. 203.

**Not automatic yet:** nothing runs the tool by itself. A later step could run it in the evidence script for every act cited in `research/` and `reference/`.
