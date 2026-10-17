# Independent check: EU and UK citizens in the register of voters, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed on the branch (commit 1c180e9; the matter 25 files last changed at 59be7dd):
- the map `docs/formalka-next/maps/voters.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with matters 19–26. It is read-only.
- It downloaded every act and page itself. All 5 act hashes in the extract header match its downloads, and all 297 quoted lines were found in its own conversion. The 4 page HTML hashes match and were the same in two requests; the page texts and dates match.
- It read the Code with its amendments (and all 51 statutes published in Dz.U. 2026 from July to 15.10.2026), Dz.U. 2023 poz. 497, 1513 and 1514, UEL with its amendments, the forms regulation, the Poland–UK agreement and its statement, the e-delivery act, the informatisation act, the act on days off work, Directives 93/109/EC and 94/80/EC, the 2026 election orders, a Ministry of Digital Affairs news item and a PKW page.

**Then:** each provision and page behind a correction was re-read here, from our own downloads (the hashes match the agent's):
- the Code art. 5 pkt 6 and 9, 6, 7, 9, 18a § 4, 19a § 1–5, 20, 32 § 6, 37 and 51 § 1–4;
- Dz.U. 2023 poz. 497 art. 16 and 18; Dz.U. 2024 poz. 1907 art. 193 and 212; Dz.U. 2026 poz. 178 art. 1 (opening) and art. 4; Dz.U. 2025 poz. 1792 art. 7 and 19; the obwieszczenie's list of folded changes;
- UEL art. 8 pkt 24a and the changes to it in Dz.U. 2024 poz. 854 art. 7, Dz.U. 2025 poz. 1794 art. 5 and Dz.U. 2026 poz. 203 art. 9; Dz.U. 2023 poz. 497 art. 9 (art. 17 ust. 1 pkt 2a);
- the forms regulation (Dz.U. 2023 poz. 1495), annex 2 and § 8;
- the Poland–UK agreement (Dz.U. 2023 poz. 237) art. 1, 2 and 8, on its page images (it has no text layer), and the statement (poz. 238);
- the election orders Dz.U. 2026 poz. 1024, 1147, 1190, 1215, 1255, 1337 and 1338, § 1–2;
- the act on days off work (Dz.U. 2025 poz. 296) art. 1;
- Directive 94/80/EC art. 8 (EUR-Lex, consolidated 01.07.2013);
- the e-delivery act art. 147 (from the certificates folder's download);
- the gov.pl pages' no-PESEL list and whose-data wording, and the ministry's news of 10.12.2025 (fetched here twice, the same HTML; now a snapshot).

The filing margins were computed here with our own script under art. 9 § 2 and the act on days off; they match the agent's.

Not re-read here, because no correction rests on them: Directive 93/109/EC, the informatisation act art. 20a, the PKW page "Wyjaśnienia dotyczące rejestru wyborców", and the online service itself.

The new text is in the extract (its header and 18 new blocks), in a new snapshot (`gov-mc-e-doreczenia-od-2026-2026-10-17.txt`), in the README and in the map. Every quoted line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a lawyer's review.
- No gmina office was asked (OPEN-V2, V5).
- Whether art. 9 § 2 covers the wójt's own limits, and how days are counted, is a reading of general words (ASSUMPTION: the day of the event not counted, as in the agent's count).
- Council by-elections ordered by voivodes are in voivodeship journals, which neither the agent nor the lab searched.
- The online service could not be tested without logging in.

**The app:** the prototype has no voter case, so none of the findings is in what it shows.

## Result in brief

- **The filing margins ignored Code art. 9.** A limit that ends on a Saturday or a statutory day off ends on the next working day (§ 2), and a document counts on the day it is lodged at the office or the court (§ 1). For a Sunday election the latest safe filing day is the 8th day before without a discrepancy and the 16th with one (not the 15th); a refusal and a complaint need 18 to 23 days. The PROPOSED "3 weeks" did not cover a complaint; it is now 4 weeks.
- **Elections are already ordered.** Five local elections in which EU and UK citizens living there vote fall between 25.10 and 6.12.2026; the Kraków election of VS1's city was on 27.09.2026. OPEN-V4 is closed, and VS7 shows the margin for the nearest one.
- **Rules the files did not mention:** art. 6 (all electoral matters are free, which is the basis of "free", not art. 19a), art. 7 (sworn translations), art. 9, art. 37 (a complaint about the list: 2 days), art. 51 (only voters on the list vote; the station adds only a person left out by mistake), art. 5 pkt 6 and 9.
- **Without a PESEL, only sex and status are required,** the rest "jeżeli są dostępne"; the PESEL comes after a positive decision. The form offers UE or NUE only; the gov.pl page lists everything as required and adds CUE.
- **"Into the register only on application" was too broad:** art. 18a § 4 keeps EU and UK citizens not in part B in the residents part by their registered address. The application decides part B, the district and the lists.
- **The extract header** misdated Dz.U. 2024 poz. 1907 art. 193 (1.01.2025, not 1.01.2027), left out Dz.U. 2026 poz. 178 art. 1 pkt 1 and Dz.U. 2025 poz. 1792 art. 7, and did not cover UEL's amendments. All named now; `touched.mjs --header` passes for the Code, UEL, the forms regulation and the act on days off. (The agent wrote that the tool exits 0 on unnamed changes; run here, it exits 1.)
- **OPEN-V1 and V3 are closed** (the Poland–UK agreement in force from 10.12.2022 for an indefinite period; the forms regulation, unamended); **OPEN-V2 is narrowed** (the ministry's news and the e-delivery act art. 147 ust. 2).
- **Moving gmina:** Directive 94/80/EC art. 8 ust. 3 says such voters are entered in the new unit on the same terms as nationals; the Code has no rule for part B. Kept as an INFERENCE with a new OPEN-V5.

## Verdicts and what changed

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Status | — | Checked |
| Why, bullet 1 (who votes) | PARTLY | Age 18, permanent residence, "wójt" includes a burmistrz and a city president; the UK agreement |
| Why, bullet 2 (only on application) | PARTLY | Part B, the district and the lists; art. 18a § 4 |
| Why, bullet 3 (5 days) | PARTLY | 12 with a discrepancy; art. 9 § 2; art. 51 § 2 |
| Why, bullet 4 (free; no PESEL) | PARTLY (basis) | Art. 6; only sex and status required; the PESEL after a positive decision |
| §1 Spanish, UK, Ukrainian citizen; old register | CONFIRMED | None |
| §1 family member | INFERENCE, labelled correctly | None |
| §1 standing | PARTLY | Art. 11 § 2 |
| §1 moved | INFERENCE, labelled correctly | Directive 94/80/EC art. 8 ust. 3; OPEN-V5 |
| V0, VL1 | CONFIRMED | None |
| V1 | PARTLY | The passport number; logging in; the optional data; art. 6 and 7; VL2 a HYPOTHESIS on behaviour |
| V2 | PARTLY | 3 days from delivery, lodged at the office; art. 9; VL3 a HYPOTHESIS |
| V3 | CONFIRMED | Art. 37 and 51 added; VL4 a HYPOTHESIS |
| Critical moments | PARTLY | From delivery; a new moment for filing in time |
| VS1 | PARTLY | 5 or 12 days; the Kraków election is past |
| VS2, VS6 | CONFIRMED | None |
| VS3 | PARTLY | Only sex and status; the PESEL after the decision |
| VS4 | CONFIRMED | From delivery; lodged at the office; free |
| VS5 | INFERENCE | OPEN-V5 |
| VS7 | Not in the map | New: the nearest ordered election |
| The flow | Labelled PROPOSED; incomplete | 12 days, free, 4 weeks; the complaint from delivery |

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| Who may vote and stand | CONFIRMED | Art. 5 pkt 6 and 9; the UK agreement row |
| The register rows | CONFIRMED | Not automatic: art. 18a § 4; the application: the required and optional data and the form |
| How | CONFIRMED | The authentication |
| The decision, the PESEL, leaving, the old register, a complaint, the home state | CONFIRMED | "After the positive decision"; new rows on art. 9, 6 and 7 |
| At election time | CONFIRMED | New rows on art. 37, 32 § 6 and 51 |
| Elections ordered | Not in the files | New section from the orders |
| Pages: online | CONFIRMED | The ministry's news and art. 147 ust. 2 (INFERENCE on the reason) |
| Pages: without a PESEL ("not matched item by item") | Now matched | The page's list against art. 19a § 4 and the form; CUE |
| Pages: services | CONFIRMED | Art. 32 § 6 quoted |
| Pages: whose data | Not in the files | New row: the check-data card against art. 18a § 4 |
| Inferences | Labelled correctly; the margin PARTLY | The margin recomputed under art. 9 § 2; a new one on polling day; the move with the directive |
| OPEN-V1 to V4 | Labelled correctly | V1, V3, V4 closed; V2 narrowed; V5 new |
| The tools | CONFIRMED | Art. 37 § 2; the UEL header check; omitted.mjs's new marks |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| Extract: hashes and lines | CONFIRMED | Hashes for the new texts |
| Extract: Dz.U. 2024 poz. 1907 art. 193 | WRONG (the date) | 1.01.2025 under its art. 212 |
| Extract: Dz.U. 2026 poz. 178 | PARTLY | Art. 1 pkt 1 (art. 103d–103p) named; folded into the consolidated text |
| Extract: Dz.U. 2023 poz. 497 transitional rules | PARTLY | Art. 16 and 18 named |
| Extract: UEL | Not covered | Every change to art. 8 and 17 named, by article |
| Page snapshots | CONFIRMED | None |

## Acts the files did not use, now quoted

In the extract: the Code art. 5 pkt 6 and 9, 6, 7, 9, 32 § 6, 37 and 51; UEL art. 8 pkt 24a lit. a–b; the statement Dz.U. 2023 poz. 238; the forms regulation annex 2 and § 8; the seven election orders, § 1–2; the act on days off work art. 1; Directive 94/80/EC art. 8.

As a snapshot: the Ministry of Digital Affairs' news of 10.12.2025.

Named by the agent but not used here:
- Directive 93/109/EC art. 9 ust. 2 lit. c and ust. 4 (the declaration to vote only in the state of residence, which art. 19a § 2 does not ask for);
- the informatisation act (Dz.U. 2025 poz. 1703) art. 20a ust. 1;
- Dz.U. 2026 poz. 1206 art. 20 (UEL art. 23m and 49a, from 11.01.2027);
- the past order Dz.U. 2026 poz. 1119 (Kamionka, 11.10.2026);
- the PKW page that still describes the register before 4.08.2023 (the app should not link it).

## The tools

- `touched.mjs --header` passes now for the Code (art. 5–11, 18–37, 51, 52), UEL (art. 8 and 17), the forms regulation and the act on days off. The UEL check failed before the header named its amendments; it exits 1 in that case.
- `omitted.mjs` (with its new list of articles a quoted paragraph names) marks art. 18a § 3 naming art. 28a, 29, 34 and 35, and art. 51 § 4 naming art. 12: other places of voting, not entering the register.
