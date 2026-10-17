---
rule: Never quote a consolidated text as in force without its later amendments (node tools/sources/amendments.mjs <ELI> <date>), the announcements that date them, and any EU decision it points to.
kind: legal-source
files: [audit/**/reference/**, research/**, docs/formalka-next/19-DOMAIN-ROADMAP.md]
check: tools/sources/amendments.mjs::lists amending acts from api.sejm.gov.pl, resolving a consolidated text to its base act, warning when a newer consolidated text replaced it, and adding earlier acts whose points apply later (tools/sources/touched.test.mjs)
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

**Found a third time (17.10.2026, the e-government map's check).** The map quoted the informatization act as Dz.U. 2025 poz. 1703 and the e-delivery act as Dz.U. 2024 poz. 1045. Newer consolidated texts had replaced both: 2026 poz. 1241 and 2026 poz. 3; the API marks the old ones "wygaśnięcie aktu". The cited articles read the same, so only the citations were wrong, but the tools had listed amendments from the old texts' dates without a word. `amendments.mjs` and `touched.mjs` now warn when the text given is not the newest consolidated text and name the newest; a test covers it. A scan of the 40 Dz.U. texts cited in the lab found one more: the act on EU citizens, 2025 poz. 1164, replaced by 2026 poz. 1065 (art. 2 pkt 3–4 unchanged).

**Found a fourth time (17.10.2026, the moving map's check).** Both tools listed amending acts by the API's general date only, so an act in force before the legal state but with points dated after it was dropped: Dz.U. 2025 poz. 1006 (general date 9.08.2025; UEL art. 49a, 53 and 56 from 30.06.2026) and Dz.U. 2024 poz. 854 (1.07.2024; UEL art. 8 from a date an announcement set at 4.05.2026). Neither touched a quoted article, but the extract header missed both. The tools now also read the entry-into-force article of each act whose general date falls in the 3 years before the date (`--lookback`), and list it when a point applies on or after the date or waits for an announcement; a test covers it. An act with any announcement point is listed even when the cited point took effect earlier, so read its entry article.

**Not automatic yet:** nothing runs the tool by itself. A later step could run it in the evidence script for every act cited in `research/` and `reference/`.
