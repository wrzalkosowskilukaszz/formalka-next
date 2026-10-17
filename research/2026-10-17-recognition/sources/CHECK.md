# Independent check: recognition of a foreign diploma or school certificate, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed on the branch (commit b55b2f6; the matter 22 files are the same at d348255):
- the map `docs/formalka-next/maps/recognition.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with matters 19–26. It is read-only.
- It downloaded every act and page itself. All six act hashes in the extract header match its downloads, and all 532 quoted lines matched its own conversion. The text of the four NAWA snapshots is identical to its fetch.
- It read PSWN with Dz.U. 2025 poz. 622 and Dz.U. 2026 poz. 203, USO, both regulations, Prawo oświatowe (Dz.U. 2026 poz. 820), the nursing act (Dz.U. 2026 poz. 15) with its later changes, the professor's salary regulation with Dz.U. 2026 poz. 525, the NAWA act, and NAWA's and the ministry's pages, among them the page on recognition agreements.
- It found no newer consolidated text of PSWN or USO, no amendment to either regulation, and no notice that stops NAWA's service.

**Then:** each provision behind a correction was re-read here, from our own downloads (the hashes match the agent's):
- Dz.U. 2025 poz. 622 art. 7, 10 pkt 2, 3 and 5, and art. 39;
- PSWN art. 22 ust. 4, 69 ust. 2, 323 ust. 1, 326 ust. 1–3, 327 and 328 (Dz.U. 2024 poz. 1571), and the change of art. 323 ust. 1 pkt 2 by Dz.U. 2024 poz. 1897 art. 13;
- USO art. 93a (both wordings), 93b, 93f and 93g;
- the 2018 regulation § 4 and § 9–15; the 2025 regulation § 6 and § 9;
- Dz.U. 2026 poz. 525 § 1–3;
- Prawo oświatowe art. 165 ust. 5a, with Dz.U. 2026 poz. 203 art. 14 and Dz.U. 2024 poz. 854 art. 9;
- the nursing act art. 35a ust. 1–6 and 28–30, with Dz.U. 2024 poz. 854 art. 8 and 30, Dz.U. 2025 poz. 1301 art. 8, and Dz.U. 2026 poz. 203 art. 11 and 50;
- NAWA's page "Świadectwo szkoły średniej" and the ministry's agreements page, fetched here and now kept as snapshots.

Not re-read here, because no correction rests on them: the doctors' act art. 7 (OPEN-Q7), NAWA's FAQ and its refugees page (named below, not snapshotted), and the NAWA act.

The new text is in the extract (its header and 11 new blocks), in two new page files (`nawa-swiadectwo-szkoly-sredniej-2026-10-17.txt`, `mnisw-umowy-uznawalnosc-2026-10-17.txt`), in the README and in the map. Every quoted line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a lawyer's review.
- No one at NAWA, a university or a school superintendent's office was asked (OPEN-Q2 to Q4, Q6).
- OECD membership and the agreements' own texts were not read (OPEN-Q2, Q3).
- The agent could not check publications of 16–17.10.2026.

**The app:** the prototype has no recognition case, so none of the findings is in what it shows.

## Result in brief

- **NAWA's information was called optional; for university admission it is required.** Since 1.07.2025 a first-cycle or long-cycle candidate with a certificate outside PSWN art. 326a ust. 1 is admitted only on that certificate "potwierdzone zgodnie z art. 326a ust. 4", that is, with NAWA's written information (art. 69 ust. 2 pkt 4). NAWA's own page says the same. Stage Q1, row "matura z zagranicy" and QS4 said otherwise.
- **The same amending point added conditions for foreigners the files left out:** a language document of at least B2 (art. 70 ust. 5a, 5c, 5e); with a certificate outside art. 326a ust. 1, NAWA's information and an entrance exam (ust. 5b); for second-cycle studies with an unrecognised diploma outside art. 326 ust. 1, NAWA's information (ust. 5d); and the admission decision only with these (art. 323 ust. 1a–1d). The extract header named Dz.U. 2025 poz. 622 art. 10 for art. 326a only, so `touched.mjs --header` could not see the gap.
- **"Without documents" was too broad and mixed two routes.** USO art. 93a and PSWN art. 327 ust. 3 cover closed groups, and art. 93a requires that producing or authenticating the document meets obstacles hard to remove. The university route has a fee (art. 327 ust. 6; regulation 2018 § 14); only the superintendent's route has the art. 93a exemption. The interview belongs to the superintendent; the university procedure (regulation 2018 § 9–15, now quoted) has documents, a statement, possible exams or practice and 90 days.
- **A nurse from outside the EU has a route without prior recognition:** the nursing act art. 35a (the minister of health's consent for a set scope, period and place of work; the right to practise from the regional council after a B1 document). QS8 and the row "Jestem pielęgniarką" said "first the diploma".
- **The denounced-agreement rule missed its condition** (art. 326a ust. 6 applies only in the case of USO art. 93a pkt 1a). The ministry's page says Belarus's 2005 agreement lost force on 3.11.2023.
- **The interview fee was overstated as "at least 600 zł":** the commission has 3 to 5 persons including the chair, the act lists the chair apart from the members, and only members are paid 200 zł. Now OPEN-Q6 (400 to 1000 zł, plus the translator).
- **Agreements were left out of the school route and the flow:** USO art. 93 ust. 2–3; the flow sent "nie wiem" straight to nostrification. Rebuilt.
- **Prawo oświatowe art. 165 ust. 5a was missing:** a post-secondary school for a non-Polish citizen needs a Polish certificate of at least B1, from 1.09.2025.
- **The nostrification maximum can now be stated:** PSWN art. 22 ust. 4 defines the professor's salary, and Dz.U. 2026 poz. 525 sets 9650 zł for pay due from 1.01.2026, so at most 4825 zł. NAWA's FAQ still says "obecnie 4685 zł" (the 9370 zł before the change).
- **Labels:** "the superintendent no longer decides the right to apply" was an INFERENCE but is the text of USO art. 93 ust. 3 (now a FACT row only); "level, not title" is a FACT; the 2025 regulation is the Minister of Education's, not "MEN".

## Verdicts and what changed

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Why, bullet 1 (EU/OECD by law; others; fee) | PARTLY | The art. 326 ust. 1 conditions and ust. 3 exclusions; "any foreign diploma, an EU one too" for the title; the 4825 zł maximum |
| Why, bullet 2 (level vs title) | CONFIRMED | None |
| Why, bullet 3 (1.07.2025) | CONFIRMED; incomplete | NAWA's information required; B2 and the entrance exam |
| Why, bullet 4 (refugees and others) | PARTLY | The closed groups and the obstacle condition; the current wording's date; the fee for studies |
| Sources | PARTLY | Art. 69, 70, 323; the Minister of Education; PO; the nursing act; the agreements page |
| §1 Germany/USA | CONFIRMED (with OPEN-Q2) | The ust. 3 caveat |
| §1 Ukraine/Belarus/India | CONFIRMED | Further study (art. 326 ust. 2), NAWA's information (ust. 4), the agreements page |
| §1 Polish magister | CONFIRMED | None |
| §1 foreign matura | PARTLY | Required information, B2, the entrance exam |
| §1 a superintendent's decision | Not in the files | New row: art. 12 ust. 2–3 against NAWA's broader page |
| §1 secondary education | PARTLY | Agreements; the B1 rule for post-secondary schools |
| §1 fled, no documents | PARTLY | The groups, the obstacle condition, the paid university route, "unless the documents show the level" |
| §1 doctor or nurse | PARTLY | The nursing act's route; a doctor's not read (OPEN-Q7) |
| Q0 | CONFIRMED | None |
| Q1 "(optional)" | WRONG for admission | Renamed; required for admission in those cases; B2 and the exam; QL3 |
| Q2 | CONFIRMED | Sworn translations only in particularly justified cases |
| Q3 | PARTLY | Without residence in Poland; the legalisation and apostille wording; the translators; the fee and the chair (OPEN-Q6); "notify", not "cancel" |
| Q4 | PARTLY | Split into the university and the superintendent routes; QL8 |
| Critical moments | PARTLY | The admission dates; "notify" |
| QS1, QS3, QS5, QS9 | CONFIRMED | QS1: the ust. 3 caveat |
| QS2 | CONFIRMED | The agreements page; the 4825 zł maximum |
| QS4 | PARTLY | Required information, B2, the exam; ust. 6 only with obstacles |
| QS6 | CONFIRMED with an exception | "Unless the documents show the level" |
| QS7 | CONFIRMED | The fee and the 90 days |
| QS8 | PARTLY | The nursing act's route |
| QS10 | CONFIRMED | B2 for a non-EU foreigner |
| Intake | PARTLY | "Nie mieszkam w Polsce"; a superintendent's decision as a document; citizenship only for the B2 rule |
| Handoffs | CONFIRMED | The admissions office; the minister of health and the regional council |
| The flow | PARTLY | The agreement checks on both routes; further study; "nie wiem" to the agreements list; the closed groups and the fee |
| Change monitoring | PARTLY | USO did not change on 5.03.2026; the salary regulation; the agreements page |

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| By law (diploma) | CONFIRMED | The wording of pkt 3 |
| Further study | CONFIRMED | Any foreign diploma; postgraduate studies |
| Not; NAWA's information; who runs it; formal gaps; differences; time; paying | CONFIRMED | None |
| Other diplomas | PARTLY | Any diploma, an agreement "on equivalence" |
| Fee | CONFIRMED | The definition and the 4825 zł maximum |
| Without a diploma | CONFIRMED | The earlier wording noted |
| Translations (2018) | PARTLY | Particularly justified cases, pkt 2 documents |
| Degrees | PARTLY | The EUI doctorate; ust. 3a |
| 326a ust. 1–5 | CONFIRMED | Ust. 2 only for ust. 1 pkt 1 or 4 documents |
| Denounced agreements | PARTLY | The art. 93a pkt 1a condition |
| Admission, B2, the exam, the decision, the notice | Not in the files | New rows (art. 69, 70, 323) |
| USO art. 93, 93b–93f; art. 12 | CONFIRMED | Art. 93a: the exclusion of first-cycle and long-cycle admission |
| Its fee | PARTLY | The chair (OPEN-Q6); "may be refunded"; instalments on a condition; the translator |
| The documents; translations (2025) | CONFIRMED | None |
| A post-secondary school | Not in the files | New row (PO art. 165 ust. 5a) |
| A regulated profession | Not in the files | New section: the nursing act art. 35a |
| Pages | CONFIRMED (the page words) | New rows: certificate information, agreements; regulated professions against the nursing act |
| Inferences | One FACT, one doubtful | The superintendent row removed (a FACT); the 600 zł row moved to OPEN-Q6; the agreements inference rewritten from the ministry's page; two new ones |
| OPEN-Q5 | Closed | Regulation 2018 § 9–15 quoted |
| OPEN-Q6, Q7 | New | The chair's pay; the doctors' route |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| Extract: hashes and lines | CONFIRMED | Hashes for Dz.U. 2026 poz. 15, 525 and 820 added |
| Extract: amendments | PARTLY | Dz.U. 2025 poz. 622 art. 10's changes to art. 69, 70 and 323; Dz.U. 2024 poz. 1897 art. 13 on art. 323 ust. 1 pkt 2; every later change to PO art. 165 and the nursing act's art. 35a, by article; `touched.mjs --header` passes for PSWN, USO, PO, the nursing act and the three regulations |
| Extract: the regulation's name | WRONG (name only) | "the regulation of the Minister of Education" |
| NAWA snapshots | CONFIRMED (text); the HTML hashes cannot be reproduced | The README says so; the new snapshots' headers too |

## Acts the files did not use, now quoted

In the extract:
- Dz.U. 2025 poz. 622 art. 7 and 10 pkt 2, 3 and 5;
- PSWN art. 22 ust. 4 and 323 ust. 1;
- Dz.U. 2026 poz. 525 § 1–3;
- the 2018 regulation § 9–15;
- Prawo oświatowe art. 165 ust. 5a (Dz.U. 2026 poz. 820);
- the nursing act art. 35a ust. 1, 3 and 28 (Dz.U. 2026 poz. 15).

Named by the agent but not used here:
- NAWA's FAQ ("obecnie 4685 zł"; any superintendent's decision valid) and its page "Uznanie wykształcenia uchodźców", which leaves out temporary protection and Polish citizens against art. 327 ust. 3 as worded from 5.03.2026: read by the agent, not snapshotted;
- the NAWA act art. 2 ust. 3 pkt 3a (Dz.U. 2025 poz. 622 art. 8) and its change by Dz.U. 2026 poz. 676 (from 1.01.2027, not on recognition);
- Dz.U. 2025 poz. 622 art. 38 (a spending limit for NAWA's task, with a cost-lowering mechanism; it does not stop the service).

## The tools

- `touched.mjs --header` passed before this check, because the header named Dz.U. 2025 poz. 622 art. 10, and the tool checks the act and the article, not every article that the point changes. Rerun with art. 69, 70 and 323 cited, it flagged Dz.U. 2024 poz. 1897 art. 13 (art. 323 ust. 1 pkt 2), which the header did not name and the agent listed among the acts that do not touch art. 323. It passes now.
- `omitted.mjs` on the nursing act marks art. 35a ust. 5 and the transitional Dz.U. 2024 poz. 854 art. 30 (now named in the header). The route is a pointer, so the rest of art. 35a is not mapped.
