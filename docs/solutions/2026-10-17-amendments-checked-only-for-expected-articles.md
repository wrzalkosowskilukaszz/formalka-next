---
rule: After listing the later amendments, list every article each one changes (node tools/sources/touched.mjs <ELI> <date> --cite <articles>), not only the articles you expect to have changed.
kind: legal-source
files: [research/**, audit/**/reference/**, docs/formalka-next/maps/**]
check: tools/sources/touched.mjs::flags amending articles that touch the cited articles
date: 2026-10-17
commits: []
---
**Problem.** For the health insurance sources, the nine acts amending the act on health care benefits were checked by searching each for the articles the map would cite (art. 2, 3, 66–69, 81, 240). The working notes concluded that the others "do not touch" the cited articles. Dz.U. 2026 poz. 203 art. 7 in fact repeals art. 12 pkt 13 and art. 50 ust. 2 pkt 1a. The first is the care for Ukrainian citizens under the old special act; the second, their identity documents at the clinic. Both are cited in the map. The gap was found before anything was written to the repository, when the check was widened to list every article each amendment changes.

**Cause.** The search was shaped by expectation: it looked for the articles already on the list, so a change to an article added to the list later (art. 12, art. 50) could not show up.

**Fix.**
- `tools/sources/touched.mjs` lists the amending acts after a date (as `amendments.mjs` does) and, for each, the articles of the amended act that its "W ustawie z dnia …" article names. Quoted new wording is skipped, so an article quoted inside it is neither a change nor the next article. `--cite` flags the changes that touch the extract's articles.
- Its test (`tools/sources/touched.test.mjs`) covers quoted articles, page breaks, the other closing quote marks some PDFs use, and ranges.
- On the health act it flags 2025 poz. 1083 (art. 66, 68, 69, 81), 2026 poz. 203 (art. 12, 50) and 2026 poz. 791 (art. 49, 50, 51, 240). The extract header lists all three.

**Limits.** It reads only amending articles that open with "W ustawie z dnia …" and, for a regulation, amending paragraphs that open with "W rozporządzeniu … z dnia … w sprawie …". Other wordings are reported as "read it by hand". Changes to an annex name no article, so they are listed apart and flagged for reading by hand. It may over-list (an article named in an instruction's own text), which is the safe side.

**Found in use (17.10, civil status sources).** The first version failed on short titles ("o cudzoziemcach") and on titles that amending acts write with a dash ("– Prawo o aktach…", "– Kodeks…"). Both are changed in the lab, with tests; not independently verified.

**Found in use (17.10, vehicle sources).** The tool threw "not an act title" for regulations, so the amendment of the licence documents regulation (Dz.U. 2026 poz. 1162) was read by hand, and only for the points expected. The extract header then said 1162 did not change the quoted parts, when it changes the quoted § 5 ust. 6 and § 14 ust. 4. A separate checking agent found it (`research/2026-10-17-vehicles/sources/CHECK.md`). The tool now reads regulations too, listing the paragraphs (§) each amending paragraph changes, with tests; changed in the lab, not independently verified. It may over-list a paragraph named in a footnote that falls inside the amending text.
