# Independent check: buying real estate in Poland as a foreigner, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed on the branch (commit 0003c94; the matter 21 files are the same at 9303236):
- the map `docs/formalka-next/maps/real-estate.md`;
- `README.md` (this folder) and the header of each extract, transcription and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with matters 19–26. It is read-only.
- It downloaded every act and page itself. All six act hashes in the extract header, the 2005 list's PDF hash and both page HTML hashes match its downloads, and so do the three body hashes (the border list and the two pages). All 403 quoted lines matched its own conversion, each in the act its block names.
- It re-derived the 2005 border list with the lab's character table and got the same text. It compared the rendered PDF pages (11800–11801) for Gdańsk, Gdynia, Sopot, Szczecin, Świnoujście, Słupsk, Kołobrzeg, Przemyśl, Zgorzelec and Zakopane, and two odd entries. All match; Kraków is not on the list. No newer list is in the ELI API.
- It read REA with Dz.U. 2026 poz. 1099 and Dz.U. 2016 poz. 2175 (and poz. 1061 for the old wording of art. 7 ust. 2); the 2012 regulation; the border act with its amendments since 2005; the stamp duty act with Dz.U. 2026 poz. 846, 875 and 912; the KPA; the e-delivery act; the UoC art. 176 and 181; the special act's time-limit rules (Dz.U. 2026 poz. 1293); the accession statement (Dz.U. 2004 nr 90 poz. 864); the Withdrawal Agreement in Polish (from CELLAR: EUR-Lex returned a bot challenge); and MSWiA's permit, FAQ, "Obowiązki notariuszy" and "Akty prawne" pages.
- It found no suspension of time limits for REA permits, and no published fee or format regulation for the notaries' repository.

**Then:** each provision behind a correction was re-read here, from our own downloads (the hashes match the agent's):
- REA art. 1 ust. 1a–1b, 1a ust. 4, 3b, 5, 7 ust. 2–3a, 8 ust. 1–3 and 8a, and the obwieszczenie's point 2 (Dz.U. 2016 poz. 2175 art. 5, 6 and 8);
- Dz.U. 2026 poz. 1099 art. 1–5 (art. 2 pkt 3 and art. 4 on Prawo o notariacie art. 92a);
- the 2012 regulation's title and § 1–5, 8 ust. 1 and 9;
- the stamp duty act art. 9 and 12 ust. 1–2 pkt 1, with Dz.U. 2026 poz. 846 art. 14 pkt 1, 31 and 35;
- the KPA art. 63 § 1;
- the border act art. 12 ust. 1–2 and 4;
- the accession statement's date, on its two-column page.

Not re-read here, because no correction rests on them: the Withdrawal Agreement (OPEN-R5 stays as it was), the rendered pages of the 2005 list, and Dz.U. 2026 poz. 875 and 912 (named in the header as the agent described them; neither concerns these fees).

The new text is in the extract: its header, 12 new blocks, and the 2012 regulation's block relabelled. Every quoted line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a lawyer's review.
- No notary, no one at MSWiA and no border municipality was asked (OPEN-R2 to R5, R7).
- The Civil Code was not read: counting the years (art. 112), the opening of a succession (art. 924) and whether "dziedziczenie" covers a will (art. 926) stay INFERENCE.
- The administrative court route and the agricultural act (OPEN-R1) were not read.
- The agent could not check publications of 16–17.10.2026.

**The app:** the prototype has no real estate case, so none of the findings is in what it shows.

## Result in brief

- **The drawn flow said "no permit" where one may be needed.** It sent every garage, every 5-year permanent resident and every Polish citizen's spouse to "Bez zezwolenia". It dropped three conditions of art. 8 ust. 1: the garage's link to housing needs (pkt 1a), living in Poland (pkt 2–3) and the spouses' joint property (pkt 3). It also had no branch for buying from someone one would inherit from by law (pkt 4), so that case ended at "a permit", against the table. This is the critical-error class of the map's §7. The flow is rebuilt.
- **"Rodzice sprzedają mi działkę" left out agricultural land over 1 ha** (art. 8 ust. 3). The app would have said "no permit" where one is needed.
- **A will's 2 years were described as "applied for within 2 years of the death".** Art. 7 ust. 3 asks that the permit is obtained on an application filed within 2 years of the opening of the succession; a refusal also passes the property to those who would inherit by law. That the opening is the death rests on KC art. 924, not read (INFERENCE). A legacy has its own rule (ust. 3a).
- **The extract header missed three later amendments to the stamp duty act** (Dz.U. 2026 poz. 846, 875 and 912), and `touched.mjs --header` failed on it. Poz. 846 rewrites the refund rule (art. 9) from 1.10.2026. So the fee refund, which the files gave as the page's, has a basis in the act.
- **The obwieszczenie's point 2 was not in the extract.** Dz.U. 2016 poz. 2175 art. 5 limits the current second sentence of art. 7 ust. 2 to successions opened from 17.08.2015.
- **The notary's repository rule from 19.11.2026 waits for two unpublished regulations:** the fee and storage period (REA art. 8a ust. 1d) and the format (Prawo o notariacie art. 92a § 7). Dz.U. 2026 poz. 1099 art. 4 ends the current format regulation (Dz.U. 2018 poz. 833) on that day. OPEN-R6 is extended; the app shows no fee.
- **The regulation has bases the files marked as the page's or left out:** sworn translations and certified copies (§ 9); a flat without its own land register (§ 3 ust. 2); 3 months, not 6, for company documents (§ 3 ust. 1 pkt 1 lit. b, § 4); and the money documents of § 5 bind only legal persons and companies, while a natural person states the source of the money in the application (§ 2).
- **REA does not define "strefa nadgraniczna".** Linking it to the border act's art. 12 and the 2005 list is a reading, now labelled INFERENCE.
- **The extension of the 14-day objection period has conditions** (art. 1 ust. 1a): particularly justified cases, at the objecting body's request, decided by the interior minister.
- **E-mail filings have an act basis** (KPA art. 63 § 1: left unexamined). An ePUAP filing, which the 01.10.2026 page still lists, is not settled by the texts read: OPEN-R7, not a pitfall.
- **The 2012 regulation is the Minister of Internal Affairs' (MSW), not MSWiA's.**
- **Housekeeping:** the permit page's header misdescribed its leftover menu lines; the header said the border act's check was "not run" (the agent ran it: no change since 2005 to art. 12).

## Verdicts and what changed

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Why, bullet 1 (void; the notary) | CONFIRMED in substance | Art. 5's words (no legal act, no land register entry); "learns late" labelled INFERENCE |
| Why, bullet 2 (a flat; the border list) | CONFIRMED; the zone's link PARTLY | The link to the border act labelled INFERENCE; the list's comparison with the rendered pages named |
| Why, bullet 3 (EEA; 2009 and 2016) | CONFIRMED; INFERENCE kept | The accession statement cited for 1.05.2004 |
| Why, bullet 4 (14 days, 2 months; 2–4 months) | PARTLY | The extension's conditions and start; the FAQ's date |
| Sources: REG | WRONG (name) | "the Minister of Internal Affairs (MSW)" |
| §1 EEA row | CONFIRMED | The states' names cited as PAGES |
| §1 flat rows | CONFIRMED | BORDER labelled INFERENCE as REA's zone |
| §1 permanent residence for 6 years | CONFIRMED, with a condition | "If the person lives in Poland" |
| §1 a Polish citizen's spouse | CONFIRMED | Joint property (wspólność ustawowa) named; living in Poland |
| §1 inheritance | CONFIRMED; PARTLY for sentence 2 | The 17.08.2015 transitional rule; legatees; "dziedziczenie" covering a will labelled INFERENCE |
| §1 a will | PARTLY | Obtained on an application filed within 2 years of the opening; a refusal; the opening at death INFERENCE; a flat outside the zone needs no permit (INFERENCE) |
| §1 from the parents | PARTLY | "Not agricultural land over 1 ha"; "under Polish law" |
| §1 UK citizens | CONFIRMED (the page's words) | None; OPEN-R5 stays |
| §1 company shares | CONFIRMED | None |
| R0, RL1, RL2 | CONFIRMED | BORDER labelled INFERENCE |
| R1 documents | PARTLY | A flat without its own land register; 3 months for company documents; certified copies; the money source stated by a person, certificates for companies; ties on REA art. 1a ust. 4 |
| RL3 | CONFIRMED for property documents; PARTLY otherwise | 6 and 3 months (REG § 3–4) |
| RL4 | PARTLY (the act has a basis) | REG § 9 ust. 2 as FACT |
| R2 | PARTLY | Warsaw's tax office through stamp duty art. 12 ust. 2 pkt 1; the page lists ePUAP (OPEN-R7) |
| RL5 | CONFIRMED (e-mail); beyond the act (ePUAP) | KPA art. 63 § 1 for e-mail; ePUAP moved to OPEN-R7 |
| R3 | CONFIRMED; the will point is PAGES | The seller's will current up to the decision, as PAGES |
| RL6, RS10 | PARTLY | Art. 3b's two grounds; the refund as FACT (stamp duty art. 9; Dz.U. 2026 poz. 846: within 2 months from 1.10.2026) |
| R4, RL7 | CONFIRMED | None |
| R5 | CONFIRMED as to the act; PARTLY | The two unpublished regulations (OPEN-R6); no fee shown |
| Critical moments 2 and 4 | PARTLY | 6 and 3 months; a will's 2 years from the opening, the permit obtained |
| RS1–RS3, RS5–RS8, RS12 | CONFIRMED (RS7 and RS12 labelled correctly) | None |
| RS4 | CONFIRMED, with the condition | Living in Poland; mazowieckie's two listed municipalities |
| RS9 | PARTLY | As the will row |
| RS11 | CONFIRMED | The permit's 1570 zł after the promesa |
| Intake Q5 | PARTLY (PROPOSED) | Asks about joint marital property, not buying "with" the spouse |
| Intake Q6 | Follows from the flow | Separates an inheritance or legacy from someone one would inherit from by law, a will or legacy from anyone else, and a purchase from someone one would inherit from |
| Teraz, Kalendarz, Teczka | Follow from RL3, RL4 | 6 and 3 months; sworn translations |
| The flow | PARTLY (PROPOSED); contradicted the table | Rebuilt: inheritance or legacy by someone entitled by law; a will's deadline; the zone and agricultural land; a flat; a garage tied to housing; 5 years living in Poland; a Polish spouse, 2 years and joint property; the seller one would inherit from, owner for 5 years |
| Handoffs: a refusal | CONFIRMED (reconsideration); CANNOT CHECK (court) | "The court route not read" |
| Change monitoring | — | The two regulations, the refunds, the page's channels |

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| The rule; a foreigner; buying; garage; companies; other cases | CONFIRMED | None |
| Those periods (2009, 2016) | INFERENCE, labelled correctly | The accession statement cited; the last day's counting left to KC (not read) |
| After 5 years; a spouse | CONFIRMED | "Living in Poland" kept in both |
| What the zone is | PARTLY | REA's link labelled INFERENCE; "adjacent to the sea shore" |
| The list | CONFIRMED | None (Słupsk, Kołobrzeg, Przemyśl and Zgorzelec appear as both a rural and a town municipality) |
| Inheritance | CONFIRMED; PARTLY for sentence 2 | The 17.08.2015 transitional rule |
| A will | PARTLY | Obtained, not applied for; the refusal; the legacy row added (art. 7 ust. 3a) |
| The documents | PARTLY | § 3 ust. 2; the 3 months; rows for § 4, § 5, § 8 ust. 1 and § 9 |
| Objections | PARTLY | The extension's conditions; ust. 1b (a refusal needs no request) |
| Fees | CONFIRMED | Rows for where the fee goes (art. 12 ust. 2 pkt 1) and the refund (art. 9 with poz. 846) |
| Filing | Not in the files | A row for KPA art. 63 § 1 |
| The notary | CONFIRMED as to the act; PARTLY | The unpublished fee and format regulations (OPEN-R6) |
| Pages: where to file | PARTLY | KPA art. 63 § 1; ePUAP under OPEN-R7 |
| Pages: time | CONFIRMED (the page's words) | The FAQ's date; the act names no ABW |
| Pages: fee refund; translations and copies | PARTLY (the act has a basis) | Stamp duty art. 9 and REG § 9 as FACT; who certifies and the spouses' single application stay PAGES |
| Pages: "nieprzerwanie", spouses' 1 ha, EEA in the zone, Polish companies, land with a flat, delivery, UK | CONFIRMED (the differences are real) | None |
| Inferences: the 5 years from the grant | CONFIRMED | Marked as a direct reading (FACT) |
| Inferences: a flat outside the zone; void and no deed | Labelled INFERENCE, FACT-level | Left as INFERENCE (the stricter label); a will that leaves such a flat added |
| OPEN-R2 | Partly closed | Narrowed to municipal changes since 2005 |
| OPEN-R6 | PARTLY | Extended to the format regulation; no fee shown |
| OPEN-R7 | New | Whether an ePUAP filing is an account filing under KPA art. 63 § 1 |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| Extract: hashes and lines | CONFIRMED | Hashes for Dz.U. 2026 poz. 846 and the KPA added |
| Extract: completeness | PARTLY | The obwieszczenie's point 2 quoted |
| Extract: stamp duty amendments | PARTLY; `--header` failed | Every later amendment named with its article (Dz.U. 2025 poz. 921, 1847, 1795; Dz.U. 2026 poz. 1206, 846, 875, 912; Dz.U. 2023 poz. 1688, whose points come later); it passes now |
| Extract: the border act "not run" | Superseded | None after 22.06.2026; art. 12 unchanged since 2005; Dz.U. 2021 poz. 2191 added art. 12a–12d |
| Extract: the KPA | Not in the files | Dz.U. 2025 poz. 769 named: it changes other articles, not art. 63 |
| The border list's transcription | CONFIRMED | None |
| The permit page | CONFIRMED; PARTLY | "Its first lines are the section's menu" |
| The FAQ page | CONFIRMED | None |

## Acts the files did not use, now quoted

In the extract:
- the obwieszczenie's point 2: Dz.U. 2016 poz. 2175 art. 5, 6 and 8;
- Dz.U. 2026 poz. 1099 art. 2 pkt 3 and art. 4;
- the stamp duty act art. 9 and 12 ust. 1–2 pkt 1, with Dz.U. 2026 poz. 846 art. 14 pkt 1, 31 and 35;
- the 2012 regulation § 5 (its opening and pkt 1), § 8 ust. 1 and § 9;
- the KPA art. 63 § 1.

Named by the agent but not used here:
- the Withdrawal Agreement art. 4, 10, 12, 23 and 126 (candidates for the UK exemption's basis; OPEN-R5);
- Dz.U. 2016 poz. 1061 (the old second sentence of art. 7 ust. 2, for successions opened before 17.08.2015): named, not quoted;
- the special act's time-limit suspension (Dz.U. 2026 poz. 1293): residence permits only, not REA permits;
- MSWiA's "Obowiązki notariuszy" page (it restates the 19.11.2026 change, without a fee) and "Akty prawne" page (it does not list the 2005 regulation).

## The tools

- `touched.mjs --header` now passes on the extract for REA, the stamp duty act (`--cite 9,12`), the 2012 regulation, the KPA (`--cite 63`) and the border act (`--cite 12`). Before the corrections it failed on the stamp duty act: the check added after matter 20's audit caught this extract's gap too, as the agent showed.
- `omitted.mjs`, run on the corrected extract, marks nothing for REA or the 2012 regulation.
