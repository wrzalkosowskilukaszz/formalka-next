# Independent check: temporary residence and the residence card, 17.10.2026

**What:** a check of every FACT in three files, against the law in force on 17.10.2026 and the official pages, as committed in a567995:
- the map `docs/formalka-next/maps/residence-temporary.md`;
- the draft reference `audit/2026-10-16-residence/RESIDENCE-REFERENCE-DRAFT.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run at the owner's request ("Tak", 17.10.2026, to checking the three maps that had no check). It is read-only.
- It downloaded every text itself from api.sejm.gov.pl and every official page.
- The six PDFs the lab cites have the same sha256 as its downloads. Every body line of every extract is a verbatim slice of its own conversion.
- All seven pages returned the same HTML hash as the lab's headers.

**Then:** each provision behind a correction was re-read here from our own downloads. The new acts were downloaded again here, and their hashes match the agent's. The new text is in `other-acts-residence-extract.txt`. The corrections are changed in the lab; not independently verified.

**Limits:** it is a second reading by the same kind of tool, not the migration lawyer's review that the draft still needs. Free legal aid as a handoff could not be checked: its only source is production's guide.

**The app:** none of the findings is in what the prototype shows. Its residence case shows production's registry content and the five lab restrictions; the restrictions make no claim on the points below.

## Result in brief

- **A missing rule: losing a job on a single permit.** UOC art. 121 ust. 1: the foreigner notifies the voivode "pisemnie", within 15 working days; filing a change application within that time also meets the duty (ust. 3); the employer notifies within 15 days (ust. 4). Art. 123: a timely notice protects the permit for 30 days, once per permit; art. 120 ust. 4 pkt 6: not notifying is a ground to refuse a change. The files cited only art. 113.
- **A contradicted inference:** the appeal stage's 90 days are not suspended by the special act art. 100d ust. 1, which applies "w postępowaniach prowadzonych przez wojewodę". The Szef UdSC decides appeals. Whether ust. 3–4 reach the appeal stage is left OPEN for the lawyer.
- **A wrong payee (RC1):** the stamp duty goes to the municipality where the voivode's office sits (stamp duty act art. 8 ust. 1, 12); only the card fee goes to the voivode (card fee regulation § 3).
- **A missing exclusion:** UOC art. 2 pkt 3 puts some spouses of Polish citizens outside the act. This covers a Polish citizen who lived for more than 3 months in another EU, EEA, Swiss or UK state just before coming back, married before or during that stay, and returns for good (act on EU citizens art. 2 pkt 4 lit. b).
- **A missing rule on fees:** UOC art. 113c, from 5.03.2026: no refund of the stamp duty after a refusal or a discontinuance. One header had called it "wave 3" only.
- **Two regulations listed as "not consulted"** are in force and now quoted:
  - the card fee regulation Dz.U. 2022 poz. 1583: 100 zł, paid when applying; the proof for the relief;
  - the application regulation Dz.U. 2026 poz. 553: four photos on the paper route; PESEL "(jeżeli został nadany)" on the form.
- **Dates:** two headers gave 1.01.2026 for points that apply from 27.04.2026 (1794 art. 19 pkt 2). Art. 228 pkt 2 is also from 27.04.2026, not 1.04.2026.
- **Other routes:** Dz.U. 2026 poz. 203 art. 45 lets a UKR status holder apply for an ordinary permit with special rules, so the CUKR card is not the only route.
- **Overclaims:**
  - "Mazowiecki: e-Doręczenia (FACT)" for calls: the page is of 20.04.2026, in the future tense, and an office without such an address delivers on paper (e-delivery act art. 4–5).
  - "QA 2 requires a trusted profile": the act accepts any method under the informatization act art. 20a ust. 1 (art. 225b ust. 2).
  - "A missed call ends the case": only the call to appear or for fingerprints does (art. 106i).
- **Two lab proposals for production were corrected too:** COMPARISON P2 (the account) and P7 (after the card).

## Verdicts and what changed

### Map

| Ids | Verdict | What the lab changed |
|---|---|---|
| M1 (§1 row 1) | CONFIRMED; "Covered: Yes" overstated | Business, seasonal work and short stay: channel and fee only |
| M3, M39 (UKR row, FS23) | CONFIRMED; route missing | 2026/203 art. 45 named; both routes, never a choice |
| M4 (§1 EU row) | PARTLY | UOC art. 2 pkt 2–4 cited, with the act on EU citizens art. 2 pkt 4 lit. b |
| M6, M7 (R1) | PARTLY | The act's login rule beside QA 2; "Mazowiecki asks for" an e-Doręczenia address |
| M12, M13 (R7, RL9, FS16) | PARTLY | Each call's own effect; art. 113c; the paper fallback |
| M17, M18, M33 (R11, RL14, FS17, level 10, Kalendarz) | PARTLY | Art. 121 (in writing), 121 ust. 4 (the employer), 123 (30 days), 120 ust. 4 pkt 6 |
| M19 (FS1) | PARTLY | The place of stay; the two payees |
| M20 (FS2) | CONFIRMED / CANNOT CHECK | Population register act art. 18 ust. 1a cited; free legal aid unchanged |
| M21 (FS4) | CONFIRMED | The proof for the relief (card fee regulation § 4 pkt 2) |
| M22 (FS5) | PARTLY | The art. 2 pkt 3 question first |
| M23 (FS6) | PARTLY | Four photos; fingerprints at the card application |
| M26 (FS9) | PARTLY | "File by Friday" labelled PROPOSED, a safety margin |
| M27 (FS10) | CONFIRMED | Art. 113c added |
| M37 (FS21) | PARTLY | Art. 106h ust. 2 (the parent shows the child's passport) |
| M38 (FS22) | PARTLY | "Reached the office before 27.04.2026" (KPA art. 61 § 3) |
| All other rows (M2, M5, M8–M11, M14–M16, M24, M25, M28–M32, M34–M36, M40–M42) | CONFIRMED | — |

### Draft reference

| Ids | Verdict | What the lab changed |
|---|---|---|
| D4 | PARTLY | The arrival condition (KPA art. 61 § 3) |
| D5, D19 (the account, OPEN-R1) | PARTLY / label right | The act's rule beside QA 2; OPEN-R1 gets the form's "(jeżeli został nadany)" and the in-person PESEL rule |
| D10 | PARTLY | "Wzywa", not "may" |
| D11, D27 | CONFIRMED; payee added | OS art. 6, 8, 12; card fee regulation § 3 |
| D18 | CONFIRMED as the page's words | The page date, its tense, the paper fallback |
| D24, D25 (card fee, OPEN-R2) | CONFIRMED | The regulation cited; "not consulted" removed; OPEN-R2 narrowed |
| D28 | PARTLY | KPA art. 261 § 4 |
| D29 (missing) | — | A row for art. 113c, and the refund-on-request rule from 1.10.2026 |
| D38 (appeal stage) | WRONG (the inference) | Rewritten: art. 100d ust. 1 does not suspend it; ust. 3–4 OPEN |
| D42, D59, D67 (end of the purpose, RC11) | PARTLY | A row for art. 121 and 123; RC11 rewritten |
| D56, D64 (first card, RC4) | CONFIRMED / PARTLY | Fingerprints (art. 246 ust. 1 pkt 1, 247); four photos; OPEN-R12 and R14 narrowed |
| D61 (RC1) | PARTLY / WRONG | The payees corrected |
| D62 (RC2) | PARTLY | The approved university, the paid-studies proof; the certificate of pkt 1 lit. a repealed from 27.04.2026 |
| D63 (RC3) | PARTLY | The art. 2 pkt 3 check first |
| D71 (Sources, AM row) | PARTLY | Art. 228 pkt 2 from 27.04.2026 |
| D72 (Sources, PRACA row) | PARTLY | 2026/203 art. 41 and 1794 art. 14 in the PRACA extract header |
| All other rows | CONFIRMED | — |

Not changed, as minor or already right: D45 (the certificate's conditions), D54 (art. 99, refusal to start), D57 ("aged 6 or more" at the filing date), D39 (the 7-day terms are Border Guard matters).

### Sources README and headers

| Item | Verdict | What the lab changed |
|---|---|---|
| S2 (1794 dates) | PARTLY | The points and their dates |
| S3 (2026/203 "wave 3") | PARTLY | Art. 113c and art. 45 |
| S5 (art. 100d) | CONFIRMED | "In proceedings before a voivode" |
| S7 (regulations not consulted) | OUTDATED as a gap | Now quoted |
| amendment-2025-1794-art104-120a, uoc-2025-1079-art98-112a | Wrong date | 27.04.2026 |
| uoc-2025-1079-art22-113-card-fees | PARTLY | Art. 113c for every permit; pkt 46's date and art. 231; the regulation named |
| praca-cudzoziemcow-2025-621-art3 | PARTLY | 2026/203 art. 41; 1794 art. 14 |
| uoc-2025-1079-purposes-and-card | PARTLY | 1794 pkt 23 and art. 13; 2026/203 art. 45 |
| amendment-2025-1794-card-art226-248 | CONFIRMED; one slip | Pkt 50 changes art. 279 |
| oplata-skarbowa-2025-1154 | CONFIRMED | All six later acts read; the refund rule from 1.10.2026; the payee |
| uw-maz-e-doreczenia | CONFIRMED | Its date, tense and the paper fallback |
| The other headers | CONFIRMED | — |

## Acts the files did not use, now in `other-acts-residence-extract.txt`

- UOC art. 2, 120 ust. 4, 121, 123, 144 ust. 1 pkt 1, 246–247.
- Dz.U. 2025 poz. 1794:
  - art. 1 pkt 23 and 48;
  - art. 19.
- Dz.U. 2026 poz. 203:
  - art. 12 pkt 5 (UOC art. 113c);
  - art. 29;
  - art. 45 ust. 1 and 5.
- The stamp duty act art. 8 ust. 1, art. 12 ust. 1 and ust. 2 pkt 1.
- Dz.U. 2026 poz. 846 art. 14 and 35.
- The card fee regulation Dz.U. 2022 poz. 1583.
- The application regulation Dz.U. 2026 poz. 553.
- The act on EU citizens art. 2 pkt 4 lit. b.
- The population register act art. 18 ust. 1a.
- The e-delivery act art. 4–5.

Named by the agent but not used here:
- the certificate template (Dz.U. 2026 poz. 386);
- the single-permit change form (Dz.U. 2026 poz. 464);
- the informatization act art. 20a (cited through art. 225b ust. 2);
- the days-off act.
