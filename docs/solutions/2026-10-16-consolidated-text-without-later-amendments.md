---
rule: Never quote a consolidated text as in force without its later amendments (node tools/sources/amendments.mjs <ELI> <date>), the announcements that date them, and any EU decision it points to.
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

**Found again (17.10.2026, the CUKR map's check).** The UKR files gave 4.03.2027 as the end of temporary protection, from UdSC's CUKR Q&A. The protection act art. 106 ust. 1 ties the legal stay to the EU Council decision "for as long as it is in force", and Council Implementing Decision (EU) 2026/1912 had extended it to 4.03.2028 on 5.08.2026 (UdSC 06.08.2026). No Polish act changed, so `amendments.mjs` had nothing to find, and the Q&A page was never updated. A rule that points to an EU act changes when that act does. The UKR sources README now says that any monitoring needs UdSC's news page and Monitor Polski's announcements beside the tools.

**Not automatic yet:** nothing runs the tool by itself. A later step could run it in the evidence script for every act cited in `research/` and `reference/`.
