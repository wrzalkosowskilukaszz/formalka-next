# Independent check: work, 17.10.2026

**What:** a check of every FACT in `README.md` (this folder), the extract and page headers, and the map `docs/formalka-next/maps/work.md` as committed in 5326734, against the law in force on 17.10.2026 and the official pages.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run at the owner's request ("Pamiętaj by zlecać sprawdzanie informacje zgodnie ze stanem faktycznym urzędowym"). It is read-only. It downloaded every text itself from api.sejm.gov.pl and the official pages. It ran the source tools on each act and scanned the 330 statutes published from 12.05.2025 to 15.10.2026 for amending articles. All 11 PDF hashes the lab had recorded matched its own.

**Then:** each provision behind a correction was re-read here from our own downloads. The new texts were downloaded again here, and their hashes match the agent's. The corrections were changed in the lab; not independently verified.

**Limits:** it is a second reading by the same kind of tool, not an expert's review. Two things could not be checked:
- mos.cudzoziemcy.gov.pl, unreachable (OPEN-W5);
- what the praca.gov.pl account shows (OPEN-W1), because the page is a script-only app.

## Result in brief

- **Three missing rules,** now added:
  - Dz.U. 2026 poz. 203 art. 41: for 3 years from 5.03.2026, Ukrainian citizens staying legally without temporary protection have free access with the employer's 7-day notice. zielonalinia.gov.pl says "do 5 marca 2029 r.".
  - The regulation Dz.U. 2026 poz. 1086: since 15.08.2026, citizens of Georgia, Colombia and Venezuela entering for work need a visa.
  - Dz.U. 2025 poz. 1794 art. 12 and 14: the old wording of WA art. 3 for cases opened earlier.
  - Also 203 art. 40: notices under the special act art. 22 given before 5.03.2026 continue.
- **One WRONG:** WS6 said "the stay must allow work". WA art. 3 ust. 6 and REG 2025/1620 § 1 need only "Cudzoziemiec uprawniony do pobytu".
- **Two inferences went too far:**
  - a change of employer: WA art. 18 ust. 1 pkt 2 and 69 pkt 2 need no new permit when the workplace passes to another employer;
  - "no trusted profile, so no account": art. 72 ust. 2, 5 and 6 give other methods and help at the office.
- **One conflict that is not one:** D2. The Petty Offences Code art. 24 § 1 and 48 cap the WA fines at 5 000 zł. This is the agent's reading and ours (INFERENCE).
- **Settled:** OPEN-W10 (PA art. 34 ust. 1). The tourist-visa point and "only the employer applies" are now FACT rows.
- **About 20 PARTLY:** a missing condition or exception, now added.
- **The flow** checked the visa before the regulation's exemptions; the exemptions now come first, and the Ukrainian rule has its own branch.
- **Why the tools missed the first finding:** `touched.mjs` listed only the articles an amending article changes. 203 art. 41 changes no wording; it applies the act. The tool now lists such articles (commit 18565c6; lesson `docs/solutions/2026-10-17-amendments-checked-only-for-expected-articles.md`).

## Verdicts and what changed

### Sources README

| Ids | Verdict | What the lab changed |
|---|---|---|
| R1 | CONFIRMED | Added: Swiss citizens are not outside the act (art. 3 ust. 1 pkt 4) |
| R2 | PARTLY | Pkt 6–11 granted "w Rzeczypospolitej Polskiej"; 1794 art. 12 and 14; a separate row for 203 art. 41 |
| R3 | CONFIRMED | PA art. 34 ust. 1–2 added (OPEN-W10 closed) |
| R4, R8, R11, R13, R15–R20, R27, R29–R31, R35, R36, R39, R40, R42, R43 | CONFIRMED | — |
| R5 | CONFIRMED | The research unit approved under FA art. 151 ust. 4–5 |
| R6 | PARTLY | "Polish" visa attributed to biznes.gov.pl 005940 (the act does not say it); the exceptions (art. 3 ust. 5–6, 203 art. 41); 1794 art. 12, 14 |
| R7 | CONFIRMED | Regulation 2026/1086 added |
| R9 | PARTLY | § 1 needs only a legal stay (art. 3 ust. 6); the teachers' condition (pkt 2); pkt 11, 18, 25 named |
| R10 | PARTLY | 203 art. 40 |
| R12 | CONFIRMED | The act names the labour market act's system; "praca.gov.pl" is the voivode's page's name |
| R14 | CONFIRMED | Art. 34 ust. 2 (temporary agency workers); art. 34 now in the extract |
| R21 | PARTLY | The exception covers only art. 19 pkt 1–2, not an early end |
| R22 | PARTLY | Gaps filled in time; the current permit's terms; the other residence permits and the EU long-term resident application (art. 21 ust. 1, 3) |
| R23 | PARTLY | FA art. 114 ust. 1, 126 ust. 1 and 3, 127 |
| R24 | CONFIRMED | "Unless special rules or the contract say otherwise" |
| R25 | CONFIRMED | WA art. 10 ust. 1, 63 ust. 1 now quoted |
| R26 | PARTLY | Ukrainians under 203 art. 41 |
| R28 | CONFIRMED | No KPA art. 37 prompt (art. 67 ust. 1, 7 ust. 4) |
| R32 | PARTLY | Gaps filled in time; not while suspended at a party's request (art. 71 ust. 2) |
| R33 | PARTLY | "After the certificate of entry was issued" |
| R34 | PARTLY | The scope condition of art. 59 ust. 1 |
| R37 | CONFIRMED | Art. 4 ust. 5 |
| R38 | CONFIRMED | Art. 72 ust. 5–6 |
| R41 | CONFIRMED | The 5 000 zł cap (INFERENCE from the Petty Offences Code art. 24 § 1, 48); new rows: the return decision (FA art. 302 ust. 1 pkt 4) and unpaid wages when staying illegally (act of 15.06.2012 art. 4) |
| D1 | PARTLY | FA art. 60 ust. 1 pkt 23; the REG 1620 cases that need no permit |
| D2 | WRONG (no conflict) | Rewritten: probably not a conflict, with the cap (INFERENCE) |
| D3–D6 | CONFIRMED | D6: the two pages also differ on the Ukrainian-language lines |
| I1 | Partly settled, partly contradicted | Now a FACT row (art. 3 ust. 3 pkt 1 and the page), with the art. 3 ust. 6 exception |
| I2 | Settled | Now a FACT row |
| I3 | Contradicted in part | Rewritten with the two exceptions (art. 18 ust. 1 pkt 2, 69 pkt 2; art. 58 ust. 1) |
| I4 | Contradicted in part | Rewritten: holds for permits and declarations only |
| OPEN-W10 | Settled | Closed |

### Extract and page headers

| Id | Verdict | What the lab changed |
|---|---|---|
| E1 WA extract | PARTLY | Art. 4 (whole), 7 ust. 4, 10 ust. 1, 34, 46, 58 ust. 1, 62 ust. 1, 63 ust. 1 and 72 ust. 5–6 added; the header names the transitional rules |
| E2 amendments extract | PARTLY | The transitional articles are in the new `other-acts-work-extract.txt` |
| E3 regulations, E4 FA, E5 PA | CONFIRMED | 2026/1086 added to the new extract |
| E6–E10 pages | CONFIRMED | Text identical to the agent's fetch; most HTML hashes differ between fetches (the pages are dynamic) |

### Map

| Ids | Verdict | What the lab changed |
|---|---|---|
| M1 (why it matters, 1) | Label right; contradicted in part | Narrowed to permits and declarations; the exceptions named |
| M2–M4, M7–M9, M11–M13, M18, M21, M25, M29, M31, M33–M35, M39, M44, M45 | CONFIRMED | M3: the cap, the return decision, art. 65 ust. 1 pkt 3. M7: "granted in Poland". M8: 203 art. 40. M39 (WS19): the 2012 act |
| M5 (content rules) | PARTLY | 203 art. 41 and 2026/1086 |
| M6 | PARTLY | Granted in Poland; another Schengen state's card: art. 3 ust. 3 pkt 5 |
| M10 | PARTLY | "Only" labelled; PA art. 34 ust. 1 |
| M14–M16 | PARTLY | The exceptions; Ukrainians; 2026/1086 |
| M17 | Consistent | — |
| M19, M20 (WL2, WL3) | Settled | Now FACT |
| M22 (W3) | PARTLY | The act sets no time for handing the document over; the times it does set are named; art. 64 ust. 2 |
| M23, M36 (WL7, WS11) | Contradicted in part | The transfer exception |
| M24, M38 (WL8, WS16) | PARTLY | The scope of art. 59 ust. 1 |
| M26, M40 (WL11, WS20) | Contradicted | Rewritten as a HYPOTHESIS about what people think, with art. 72 ust. 2, 5, 6 |
| M27 (§3) | Items 1, 2, 4 confirmed; item 3 unlabelled | Item 1 without the timing; item 3 labelled, with the exception |
| M28 (WS1) | PARTLY | FA art. 116 pkt 5: no residence and work application on that visa |
| M30 (WS3) | PARTLY | 2026/1086 |
| M32 (WS6) | WRONG | Any legal stay is enough (art. 3 ust. 6) |
| M37 (WS14, WS15) | PARTLY | The conditions of art. 21 and 71 |
| M41 (WS21) | Consistent | — |
| M42 (WS22) | CONFIRMED; one unsourced claim | "GOV pages mostly Polish" removed |
| M43 (§5 flow) | Legal errors | Redrawn: exemptions first, a Ukrainian branch, CUKR as an exemption from the permit |
| New | — | WS23 (a Ukrainian citizen without temporary protection) |

**Labels:** "Production's registry has nothing on this matter" cannot be checked against an official text; it is the lab's own reading of `reference/`.

## Sources the agent named that this map does not use

- Dz.U. 2026 poz. 734 art. 6: the second contract system is launched by a minister's notice within 3 years. Whether that notice has appeared could not be checked: it is in the minister's own journal, not on api.sejm.
- Dz.U. 2026 poz. 1085: Georgian diplomatic and service passports (marginal).
- The labour market act art. 26 ust. 1 pkt 7 and 432 ust. 6 (the system's name). The special act art. 100d (it suspends voivodes' residence decision terms, not work permits).
