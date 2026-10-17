# Independent check: health insurance, 17.10.2026

**What:** a check of every FACT in `README.md` (this folder), the extract headers, and the map `docs/formalka-next/maps/health-insurance.md` as committed in 3030115, against the law in force on 17.10.2026 and the official pages.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run at the owner's request ("Pamiętaj by zlecać sprawdzanie informacje zgodnie ze stanem faktycznym urzędowym"; "Tak", 17.10.2026, to running it on the earlier maps). It is read-only: it downloaded every text itself from api.sejm.gov.pl and the official pages, ran the lessons slice and the source tools, and changed nothing in the repository. It also scanned all 290 statutes published in Dz.U. from 1.08.2025 to 15.10.2026 for amendments the API does not list: none amends the health act, the protection act, the foreigners act or the special act beyond what the API lists.

**Limits:** it is a second reading by the same kind of tool, not an expert's review. The corrections below were changed in the lab; not independently verified.

## Result in brief

- No verdict of WRONG, OUTDATED or CANNOT CHECK.
- The lab's hashes match the agent's downloads (1461, 791, 203, 862, 1079 and the NFZ, pacjent.gov.pl and UdSC pages). Every body line of the three act extracts is in its own `pdftotext -layout` output.
- The gaps were exceptions in later paragraphs of the same articles, one label mismatch, and one unsourced statement.

## Verdicts and what changed

### Sources README

| Ids | Verdict | What the lab changed |
|---|---|---|
| R1, R3, R4, R6, R8, R9, R13, R14, R17–R19, R22, R24, R26, R29, R33, R35–R39, R41–R47 | CONFIRMED (some with an addition) | R13: "or international obligations"; R22: the employer named from the NFZ page, art. 75 ust. 4 added; R29: "eWUŚ" attributed to the NFZ page, art. 50 ust. 1 pkt 2 and ust. 2a–2b added; R35: PA art. 112c ust. 2 and 5, and special act art. 34–37 repealed by 2026/203 art. 17 pkt 17; R36: "a citizen of Ukraine, under special act art. 37"; R37: special act art. 42r ust. 1 cited; R38: "the temporary residence and work permit (art. 114)"; R5, R7: the NFZ page's other outdated citations, and 1794 named |
| R2, R10, E1 | PARTLY | The legal state is 25.09.2025; 2025 poz. 1083 is printed in the consolidated text (from 1.01.2026), so two later acts change the cited articles. The extract now quotes art. 73–75 and art. 188 ust. 4 pkt 9, which the README relies on, and its header lists every other change (1083 art. 4 pkt 5, 203 art. 7 pkt 3, 791 art. 3 pkt 4, 1537 art. 1 pkt 11) |
| R11 | PARTLY | Added the residence condition, the art. 12 social assistance condition, no income test for children and pregnancy, and the family-pension children abroad |
| R12 | PARTLY | Added: the decision "powinna zawierać numer PESEL"; ex officio on the NFZ's application; the art. 12 check; **the right lasts 90 days** (art. 54 ust. 7–8) |
| R15 | PARTLY | "On this title, only if voluntary"; the residence condition of art. 68 ust. 1; the other titles (work, family); pkt 3 described correctly |
| R16 | PARTLY | Cited art. 73 pkt 4 (the duty arises with the statement of no other title), art. 75 ust. 4 (the university reports), art. 66 ust. 2 (family status exempts) |
| R20 | CONFIRMED | "Usually the employer" attributed to the NFZ page; grandparents (ust. 3a) |
| R21 | PARTLY | Added art. 67 ust. 6–8 and art. 68 ust. 12 |
| R23 | PARTLY | Art. 69 ust. 4 quoted: "na zasadach określonych w art. 68", so with the residence condition |
| R25 | PARTLY | The rate's exceptions named (art. 79a, 80, 82, 242) |
| R27, R28 | PARTLY (minor) | "In justified cases, on request"; the second starting point of the 7 days |
| R30 | PARTLY | The order: another document, and only without one the statement; ust. 7a; art. 188 ust. 4 pkt 9 described |
| R31 | PARTLY | **Primary care is excluded** from the duty to pay (ust. 16 with art. 15 ust. 2 pkt 1); both 30-day starting points (ust. 18a); waiver, deferral, instalments (ust. 22); **no proceedings for 500 zł or less** (ust. 23) |
| R32 | PARTLY | The start points; the case where health prevents a statement; **a document or statement up to 1 year later still counts** (ust. 12) |
| R34 | PARTLY | Art. 52–53 as worded; the EHIC and "w przypadku zamieszkiwania" attributed to the NFZ page; art. 53 ust. 1a–2 |
| R40 | PARTLY | "Most common" separated from the "other reasons" |
| R48–R56 | Labels correct | R49 (short stay) was a FACT in the map: see M18. OPEN-H3 and H5 notes added |

### The map (as in 3030115)

| Ids | Verdict | What the lab changed |
|---|---|---|
| M1, M4–M7, M12, M16, M20, M22, M24, M27–M29, M31, M38, M39, M41, M42, M46, M47, M49–M51, M54 | CONFIRMED (some with a note) | M6: art. 3 ust. 1 pkt 2 and the NFZ's words; M12: ust. 9 and the family route; M16: art. 42r ust. 1; M29: ust. 5 |
| M2, M15 | PARTLY | "Only" qualified by the care art. 12 keeps free (OPEN-H9) |
| M3 | CONFIRMED for the cited articles | HA's legal state and 1083; FA given as Dz.U. 2025 poz. 1079 with 1794 and 203 |
| M8 | PARTLY | The suspended-business exception (art. 69 ust. 1a) |
| M9, M32 | PARTLY | The residence condition; any art. 66 title; EU, EFTA or UK |
| M10, M33 | PARTLY | Art. 73 pkt 4, 75 ust. 4, 66 ust. 2 |
| M11 | PARTLY | "Tells the payer within 7 days; the payer reports"; grandparents |
| M13, M52 | PARTLY | **90 days**; the art. 12 condition; the residence documents; children and pregnancy without the income test |
| M14, M36, M37 | PARTLY | Art. 67 ust. 6–7; whether the 4 months apply to a student on a voluntary agreement is a new OPEN-H12 |
| M17 | PARTLY | EU, EFTA or the UK; the NFZ page cited for the EHIC |
| M18 | PARTLY; label mismatch | Labelled INFERENCE; the family route added (with the residence question) |
| M19 | PARTLY | The art. 35 certificate |
| M21 | PARTLY; unsourced | "IKP needs a trusted profile, so a PESEL" labelled INFERENCE, with art. 50 ust. 2b |
| M23, M40 | PARTLY | **No age limit for a child with a severe-disability certificate** |
| M25, M44 | PARTLY | The order of the document and the statement; the primary care exclusion; 500 zł |
| M26 | PARTLY | Ust. 12 (one year) |
| M30 | PARTLY | "The PESEL of the person who must report the child" |
| M35 | PARTLY | "Or keep their voluntary agreement" replaced by an INFERENCE from art. 68 ust. 1 |
| M43 | PARTLY | The ZUS ZZA confirmation (NFZ page) |
| M45 | PARTLY | Ust. 12 (a missed emergency period) and ust. 18a (a statement made without the right because of a missing report) separated |
| M48 | CONFIRMED (wording) | "A temporary residence and work permit", not "a work permit" |
| M53 | Notes | The UK added to question 5; grandparents to question 4 |
| M55 | Unsourced | "One theirs" dropped |
| M56 | CONFIRMED | Ust. 22–23 added |
| M57 | Notes | The flow's family node adds disability and grandparents; the municipality node adds the art. 159 permit and the 90 days |
| M34, M58 | No FACT | — |

New differences between the NFZ page and the act are listed in the README: the page's art. 2 list, the poświadczenie's residence condition, the entry fee's "powyżej 3 miesięcy", "Dyrektor oddziału" for the waiver, and an age limit for students the act does not set.

## What the lab re-read before changing anything

From the downloads used for this folder and the agent's own (hashes below): art. 2 ust. 1, art. 5 pkt 3 lit. a, art. 15 ust. 2 pkt 1, art. 50 ust. 6, 12, 16, 18a, 22, 23, art. 52 ust. 1, art. 53 ust. 1–2, art. 54 ust. 2–8, art. 66 ust. 1 pkt 1 lit. c and ust. 2, art. 67 ust. 6–7, art. 68 ust. 3 and 11, art. 69 ust. 1a and 4, art. 73 pkt 4, art. 75 ust. 4, art. 79 ust. 1 and art. 188 ust. 4 pkt 9 of the health act; 2026/791 art. 3 (only ust. 1 pkt 1, ust. 2 opening and ust. 16 pkt 1 of art. 50 change); 2025/1537 art. 1 pkt 11 and art. 8; 2026/203 art. 17 pkt 17; the protection act art. 112c ust. 2 and 5; the special act art. 42r ust. 1. `touched.mjs DU/2004/2135 2025-09-25 --cite 2-5,12,15,49-54,66-69,73-76,79,81,188,240` was re-run: the same nine acts.

## Hashes (sha256, from the agent's report)

| Text | sha256 | Same as the lab's |
|---|---|---|
| DU/2025/1461 | 6b1219883e69636dd4c7c7d1a864297af574db11c9a1ea1adc58f6b330b652d3 | yes |
| DU/2026/791 | 5a563e9d53c94bcec5f7c95be37636c2c59fa2eabdbb693fd138677e4b9519e5 | yes |
| DU/2026/203 | 98b590c659b96b72c36f35e58532512e352dd5618f5351940a64f32173655275 | yes |
| DU/2026/862 | e9f82bc0e10ff1555b941f741667ee5a97fc0b5a7fe2320f4bf785e475c70701 | yes |
| DU/2025/1079 | 2d3492f82ae1a1ab936667bf4fac1a8544adf4d166db0d6904145bc6d74ad4e0 | yes |
| DU/2025/1083 | 5aef1115d6cd02e66b8e5ebe827f325a914deb6594776ad2ed02efe865a4a685 | — |
| DU/2025/1537 | d9fca682d47bff53a7e709fd6faa83e497cd939299f42c6078c20d135b0bd0da | — |
| DU/2025/1739 | d6c11b893a1f90753457275fd7e6bfb5a650381c7afe2e397d49297c3696de99 | — |
| DU/2026/26 | 538cc70751bc92c0d0473fd44ae46995b59559cc6006883ef52d128fd267b177 | — |
| DU/2026/972 | 9b7c8448d79fced190ce03634068e5a60e9226a68000b008c9f146123b3bcbf0 | — |
| DU/2026/986 | 264580830ac123153052ec42268ffde6cd45467206e9e40dd71a26b36fbc3de6 | — |
| DU/2026/1007 | 87d1aef8c24cd620cf4f2ca9939f2289e58e283e59a4cb63c21ba4a4fa057b72 | — |
| DU/2025/1794 | dd0580964c31c5d14805b0560aa3346d7ca5b57b1b56d3574861a2f3cd96be11 | — |
| DU/2026/1293 | 49648f140730f652a3dc37d480e5c72096f9f540ff75ae8e41c20679b66f4177 | — |
| MP/2026/370 | f4b7223353479968b7083516cf62ad9414e4c032803b6cb56d9400193448b85e | — |
| nfz.gov.pl, ubezpieczenia-w-nfz (html) | 6d3fc4a32baceba3f2cb89c727f0d9ef4df04b948f657ae10408c2fae621d53d | yes |
| pacjent.gov.pl, studencie-ubezpiecz-sie (html) | 746a5546369d2ab5e39317eed10c2263fc9a1ef91d971bd9e8f801133758c547 | yes |
| gov.pl/web/udsc/cukr-QA (html) | 8346ad37634a6ff8f91c99091d605e9e75dc72cb3f48be7699cc5a36f97c8b6b | yes |

## How the dates were counted (the agent)

Legal state dates from each announcement and the API (1461: 25.09.2025; 862: 18.05.2026; 1079: 23.07.2025; 1293: 8.09.2026). Each amending point dated by its act's own entry-into-force article: 791 published 16.06.2026, 14 days, so 1.07.2026; 203 fixed 5.03.2026; 1083 and 1537 pkt 11: 1.01.2026; 2026/26 art. 21: 1.01.2027; 1794 pkt 16 and 23: 27.04.2026 (M.P. 2026 poz. 370). No period (14, 7, 30, 90 days, 4 months) was computed; their counting stays OPEN-H10.
