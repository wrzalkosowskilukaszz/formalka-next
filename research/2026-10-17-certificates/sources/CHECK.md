# Independent check: certificates for other procedures (the KRK certificate, an apostille), 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed on the branch (commit eb441a2; the matter 24 files are the same as at 9303236):
- the map `docs/formalka-next/maps/certificates.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with matters 19–26. It is read-only.
- It downloaded every act, EU text and page itself. All 16 hashes in the extract header match its downloads, and the 581 quoted lines were found in its own conversions (2 misses were page markers). The 8 page snapshots match its fetches, apart from the removed editors' names.
- It read the KRK act with Dz.U. 2026 poz. 421, 2025 poz. 1235, 2026 poz. 252 and 760; the three regulations and the 2023 one with the four acts that moved it, and the minister's consolidated text Dz.U. 2025 poz. 1109; the act of 2016 with its changes; the KPA; the stamp duty act with its changes; the e-delivery act; the Hague Convention and the 2005 statements; Regulations 2016/1191 and 2019/816; ST 11076/26; and the KRK, MSZ and HCCH pages.
- It scanned the 2026 statutes in Dz.U. for amendments and found no new regulation under KRK art. 21 and no Commission decision on ECRIS-TCN.

**Then:** each provision and page behind a correction was re-read here, from our own downloads (the hashes match the agent's):
- KRK art. 4 ust. 1a, 9, 19 ust. 2–4, and Dz.U. 2026 poz. 421 art. 1 pkt 4, 8, 16–19 and art. 10;
- the KPA art. 217–218;
- the act of 2016 art. 21 ust. 2, 6–9, art. 23, 23a–23c and 24a;
- the fee regulation § 7; the 2021 regulation § 13;
- the stamp duty act art. 7, 8 ust. 1, 12 ust. 1–2, annex part IV in full, and Dz.U. 2026 poz. 912 art. 76 and 98;
- Regulation 2016/1191 art. 1–4 and 7–8;
- the e-delivery act (Dz.U. 2026 poz. 3) art. 6, and its later changes through `touched.mjs`;
- the KRK pages "drogą tradycyjną" and "drogą elektroniczną" (fetched here twice, the same HTML; now snapshots), and the ECRIS, Kamilka, e-Doręczenia and MSZ snapshots;
- the HCCH status table (fetched here twice, the same HTML; now a snapshot).

Not re-read here, because no correction rests on them: Regulation 2019/816 art. 35 ust. 5–7, the Publications Office's records on amendments to Regulation 2016/1191 (OPEN-C4), Dz.U. 2025 poz. 1109, the KRK's "Warunki wydawania bezpłatnej informacji" and service-hall pages, the e-delivery FAQ, the NAWA act and the gov.pl portal notice.

The new text is in the extract (its header, 9 new blocks and annex part IV quoted in full), in three new snapshots (`ms-krk-droga-tradycyjna-2026-10-17.txt`, `ms-krk-droga-elektroniczna-2026-10-17.txt`, `hcch-apostille-status-2026-10-17.txt`), in the README and in the map. Every quoted line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a lawyer's review.
- No one at the KRK Bureau, the MSZ or NAWA was asked (OPEN-C3, C6).
- The agent could not reach e-KRK itself (a TLS failure through the proxy, then HTTP 503); its availability is not checked.
- The convention's objections and the depositary's own list were not read (OPEN-C2).

**The app:** the prototype has no certificate case, so none of the findings is in what it shows.

## Result in brief

- **The waiting time is set by law.** The files said the act sets none. KRK art. 23 makes the information a KPA certificate and art. 9 applies the KPA, so KPA art. 217 § 3 gives "nie później jednak niż w terminie siedmiu dni"; art. 218 § 2 allows an explanatory procedure. The KRK pages say the same, and longer when foreign registers are asked. OPEN-C5 is closed.
- **A third-country national can already reach other EU registers on request.** KRK art. 7 ust. 1a (from 14.04.2026) covers anyone who lives or lived in an EU state, for a state they live or lived in, and art. 4 ust. 1 pkt 5 makes the Bureau ask. The map said this waits for ECRIS-TCN; ECRIS-TCN only adds it to the certificate itself. The Kamilka page ("tylko w przypadku obywateli polskich lub państw członkowskich UE") is narrower than the act; the README called it a match.
- **The extract quoted KRK art. 19 and 20 ust. 1 as printed, while its header said the changes to the quoted articles were quoted.** Dz.U. 2026 poz. 421 art. 1 pkt 16 and pkt 17 lit. a–b were missing: the request and the information now carry the citizenships, or that the person is stateless or of unknown citizenship. Now quoted.
- **Work with children left out a step and a penalty.** Art. 21 ust. 6: where a state issues no certificate for this purpose, its ordinary register information; a statement only under ust. 7. Art. 23 ust. 3: not presenting them is punishable (arrest, restriction of liberty or a fine of at least 1000 zł). Art. 21 ust. 2, the employer's own check, is added too.
- **`touched.mjs --header` failed for the stamp duty act** on Dz.U. 2026 poz. 912 art. 76 (art. 7, which annex part IV names); the README said it passed. Now named.
- **"The Bureau does not ask third states" was too broad:** the ECRIS page says it asks the UK for UK citizens.
- **Canada (CS8) was not in the 2005 Dz.U. list of parties;** the HCCH table shows its accession in force from 11.01.2024. Now cited, with OPEN-C2 for objections.
- **Smaller points:** the fee regulation § 7 ust. 2 (a PDF proof of transfer when the system cannot take the payment); part IV's other exemptions and art. 8 ust. 1, 12 ust. 2 pkt 2 on where the 17 zł is paid; art. 19 ust. 4's exception in its own terms; the multilingual form's basis is art. 8 ust. 1; Regulation 2016/1191 art. 1 ust. 1 lets a person use an apostille anyway; the MSZ page leaves out registered partnerships and lists more documents needing prior certification; the KRK pages cite older consolidated texts; the e-KRK page names no personal signature. OPEN-C7 is closed by reading the e-delivery act art. 6.

## Verdicts and what changed

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Status | — | Checked |
| Why, bullet 1 (any foreigner; 30 or 20 zł) | CONFIRMED | The seven days (KPA art. 217 § 3) |
| Why, bullet 2 (EU registers only with ECRIS-TCN) | PARTLY | The request route of art. 7 ust. 1a |
| Why, bullet 3 (work with children) | PARTLY | Art. 21 ust. 6; art. 23 ust. 3 |
| Why, bullet 4 (apostille; EU) | CONFIRMED | None |
| Sources | PARTLY | The other later changes named in the header; KPA and EDOR added |
| §1 employer; German citizen | CONFIRMED | The German case: up to 20 working days (PAGES) |
| §1 work with children | PARTLY | Ust. 6; art. 23 ust. 3 |
| §1 Ukraine/India | PARTLY | The UK exception (PAGES) |
| §1 apostille; EU | CONFIRMED | Registered partnership; the person may still choose an apostille |
| §1 a third-country national who lived in another EU state | Not in the map | New row (art. 7 ust. 1a) |
| C1 | CONFIRMED (CL3 PARTLY) | FEES § 7 ust. 2; the page names no personal signature; the seven days |
| C2 | PARTLY | Ust. 6; art. 23 ust. 3 |
| C3 | CONFIRMED | CL6: EU art. 1 ust. 1 |
| Critical moment 1 (waiting not set by the act) | WRONG | Seven days, with the two extensions |
| Critical moment 2 (ECRIS-TCN) | CONFIRMED / OPEN | None |
| CS1, CS3–CS7 | CONFIRMED | CS1: the seven days and art. 7 ust. 1a |
| CS2 | PARTLY | Ust. 6; online with a qualified signature; before the start |
| CS8 | PARTLY | The HCCH table; OPEN-C2 |
| Change monitoring | CONFIRMED | The HCCH table added |
| The flow | — | The seven days; the separate EU query; ust. 6 in the children branch |

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| Who; EU citizen; third-country national later; how; online; account; foreign convictions; collecting; exempt; old requests; which online rules | CONFIRMED | Other EU registers: art. 4 ust. 1 pkt 5 and the consequence for third-country nationals |
| The request | OUTDATED | The new art. 19 ust. 3 wording (citizenships, stateless) |
| Gaps | PARTLY | The exception in its own terms (ust. 2 pkt 1) |
| What it shows | CONFIRMED | Pkt 1's new wording |
| Its nature | CONFIRMED | Art. 9; a new row on the seven days |
| Fee | PARTLY | § 7 ust. 2 |
| Work with children, ust. 6–8 | PARTLY | Ust. 6 and 7 apart; the clause of ust. 8; new rows on ust. 2 and art. 23 ust. 3 |
| Apostille rows | CONFIRMED | Part IV's other exemptions and where the 17 zł is paid; EU art. 1 ust. 1 and art. 3 pkt 4; a new row on the multilingual form |
| e-Doręczenia | Not in the files | A new FACT row (the e-delivery act art. 6) |
| Pages: ways to ask; paying online; ECRIS; UK; copies and printouts; how | CONFIRMED | None |
| Pages: waiting ("the act sets no time") | WRONG | Matches KPA art. 217 § 3; the channel pages quoted |
| Pages: power of attorney ("where to pay is the page's") | PARTLY | Stamp duty art. 8 ust. 1, 12 ust. 2 pkt 2 |
| Pages: e-Doręczenia ("not read") | Now checkable | Art. 6 read; the page names no point; its citation is outdated |
| Pages: Kamilka ("matches") | WRONG | Narrower than the act; its citation is outdated |
| Pages: the multilingual form's basis | PARTLY | Art. 8 ust. 1 |
| Pages: before the apostille | PARTLY | The page's full list |
| Pages: within the EU | CONFIRMED | Registered partnerships left out by the page |
| Pages: online signatures; the convention's parties | Not in the files | New rows |
| Inferences | Labels correct | The first one removed (a FACT); two revised for art. 7 ust. 1a and the UK |
| OPEN-C2, C4 | Narrowed | The HCCH table; the agent's search, not re-read |
| OPEN-C5, C7 | Closed | KPA art. 217 § 3; the e-delivery act art. 6 |
| The tools note | WRONG (stamp duty) | Rewritten |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| Extract: hashes and lines | CONFIRMED | Hashes for the KPA, the e-delivery act and Dz.U. 2026 poz. 912 |
| Extract: "the changes on the quoted articles are quoted" | WRONG | Dz.U. 2026 poz. 421 art. 1 pkt 16 and pkt 17 lit. a–b quoted; Dz.U. 2026 poz. 912 named |
| Extract: dates | CONFIRMED | Regulation 2016/1191: the agent's search noted |
| Page snapshots | CONFIRMED | None |

## Acts the files did not use, now quoted

In the extract:
- KRK art. 9; Dz.U. 2026 poz. 421 art. 1 pkt 16 and pkt 17 lit. a–b;
- the KPA art. 217–218;
- the act of 2016 art. 23;
- the stamp duty act art. 8 ust. 1, 12 ust. 1–2 and the rest of annex part IV;
- Regulation 2016/1191 art. 3 and 7–8;
- the e-delivery act art. 6.

As snapshots: the KRK pages "drogą tradycyjną" and "drogą elektroniczną", and the HCCH status table.

Named by the agent but not used here:
- Regulation 2019/816 art. 35 ust. 7 (the alphanumeric and fingerprint data may start on different days);
- Dz.U. 2025 poz. 1109 (the minister's consolidated text of the 2023 regulation, which also prints § 25 as a future date);
- the NAWA act art. 2 ust. 3 pkt 5 ("uwierzytelnianiem dokumentów"; OPEN-C3);
- the KRK's service-hall and "Warunki wydawania bezpłatnej informacji" pages, the e-delivery FAQ, the KRK news list and the gov.pl portal's overnight notice for 17/18.10.2026.

## The tools

- `touched.mjs --header` passes now for the KRK act, the act of 2016, the KPA, the stamp duty act (with art. 7, 8 and 12 cited) and the e-delivery act.
- `omitted.mjs` cannot follow KRK art. 9 and 23 into the KPA (another act); the seven days came from the agent's reading. On the act of 2016 it marks art. 24a ust. 2 (the employer's offence), which does not concern the person.
