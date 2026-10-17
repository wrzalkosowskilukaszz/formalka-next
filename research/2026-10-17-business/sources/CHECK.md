# Independent check: registering a business (CEIDG) as a foreigner, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed on the branch (commit 2c7b808):
- the map `docs/formalka-next/maps/business.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with matters 19–26. It is read-only.
- It downloaded every act and page itself. All nine hashes in the extract header match its downloads, and all 443 quoted lines match its own conversion. The text hashes of the three page files match today's pages.
- It read the FE act, the CEIDG act, Dz.U. 2026 poz. 507, PP, the special act, the winding-down act, the act on foreigners with Dz.U. 2025 poz. 1794 and M.P. 2026 poz. 370, the act on population records, the 2027 minimum wage regulation and the e-delivery act's art. 152. It also read biznes.gov.pl pages ou736 and 03155 and one municipality's notice in its BIP.
- It scanned the 91 statutes published in 2026 after poz. 507, up to poz. 1340 (15.10.2026), for amending clauses. None changes FE art. 4, CEIDG art. 8 or 29, PP art. 5, poz. 507 itself, the special act's art. 23 or 42w, or UoC art. 108, 142, 186, 206 or 222a.
- Anything published on 16–17.10.2026 it marked CANNOT CHECK: the API's lists stop at 15.10.2026.

**Then:** each provision and page behind a correction was re-read here, from our own downloads (the hashes match the agent's):
- Dz.U. 2025 poz. 1794 art. 1 pkt 14, 32 and 39, art. 6, 12, 13, 14, 16, 17, 18 and 19, and M.P. 2026 poz. 370;
- UoC art. 108, 159, 160 and 206 (Dz.U. 2025 poz. 1079);
- the FE act art. 4 with its footnotes, and the obwieszczenie's pkt 2 ppkt 3;
- CEIDG art. 6, 6a, 7, 8 ust. 8 and 29, and the e-delivery act's art. 152 printed in its obwieszczenie;
- Dz.U. 2026 poz. 507 art. 1 pkt 2, 4, 5, 6, 13 and 54, art. 10, 14–31;
- PP art. 5 ust. 7; Dz.U. 2025 poz. 769 art. 35;
- UEL art. 16 and 18 with its footnote 14 (Dz.U. 2026 poz. 384);
- Dz.U. 2026 poz. 1213 § 1;
- the special act's art. 42w;
- the pages 00806, 00115 and 001466 (their HTML metadata), and ou736 and 03155, fetched here.

The municipality's notice was not re-read: page ou736 says the same. The weekdays and the 2027 limit were computed here (4950 zł × 225 % = 11 137,50 zł).

The new text is in the extract (its header, 15 new blocks, and all of CEIDG art. 6) and in two new page files (`biznes-gov-zarejestruj-ceidg-2026-10-17.txt`, `biznes-gov-ceidg-dla-przedsiebiorcow-2026-10-17.txt`). Every quoted line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a lawyer's review.
- No municipality and no CEIDG consultant was asked (OPEN-B5, B8, B9).
- The agent could not check publications of 16–17.10.2026.

**The app:** the prototype has no business case, so none of the findings is in what it shows.

## Result in brief

- **OPEN-B5 was wrong in its second half.** biznes.gov.pl does describe the 1.11.2026 change: the CEIDG service page ou736 ("Od 1 listopada 2026 roku wniosek o rejestrację działalności w CEIDG złożysz wyłącznie elektronicznie. Wyjątek dotyczy wniosku małoletniego przedsiębiorcy"), and page 03155, which lists the old forms as "obowiązywały do 13.10.2026 r.". Page 00806 does not, so the portal contradicts itself. OPEN-B5 is rewritten.
- **The passport stamp is outdated since 27.04.2026.** The voivode now issues a certificate (zaświadczenie) confirming a residence application, through MOS (UoC art. 108 ust. 1 pkt 1, 206 ust. 1 pkt 1, 222a ust. 1 pkt 1, from Dz.U. 2025 poz. 1794 by M.P. 2026 poz. 370). Cases begun before keep the old rules (1794 art. 12). An EU long-term resident case begun before, where the person has the stamp, keeps the old wording of FE art. 4 ust. 2 pkt 5 (1794 art. 14). BS12, the intake and the flowchart had the stamp.
- **Proof of temporary protection: the page the map relied on contradicts the act.** Page 001466 says no document on the legal stay is needed online, only passport scans. CEIDG art. 8 ust. 8 asks every FE art. 4 ust. 2 person for the status document, and page 00806's table names the temporary protection certificate. OPEN-B9 is added.
- **CUKR card holders fall outside the provisions that name only FE art. 4:** PP art. 5 ust. 7 (unregistered activity), CEIDG art. 8 ust. 8 (the status document) and art. 29 ust. 1 pkt 2 (deletion). The map had treated the card as an FE title. OPEN-B8 is added.
- **"Online only" missed the minors' exception** (507 art. 16 ust. 1–2). The README had it; the map did not.
- **Unregistered activity:** the map left out the 60 months without a business, a civil partnership and licensed activity (PP art. 5 ust. 1, 5, 44 ust. 3). The 2027 minimum wage is published (4950 zł), so the 2027 limit is 11 137,50 zł.
- **BL5 overstated the application.** It always includes REGON, the tax identification and the contribution payer notification (CEIDG art. 6 ust. 3). The person's own insurance registration and VAT are optional attachments (ust. 4).
- **The pages' update dates:** the pages show none, but their HTML metadata does (00806: 23.07.2026; 00115: 05.05.2026; 001466: 19.05.2026). Page 00806 was edited after Dz.U. 2026 poz. 507 was published and still describes the paper route without a PESEL.
- **The extract header understated what applies on 17.10.2026.** It is now complete: 507 art. 1 pkt 6, 13 lit. e and 54 (CEIDG art. 7 ust. 1a–1b, 15 ust. 4a, 66a–66d), the other tirets of pkt 4, pkt 2 lit. a (from 21.04.2026), and art. 10.
- **Missing from the application step:** the e-delivery data (CEIDG art. 6a; the e-delivery act art. 152 ust. 1).
- **The PESEL step cited the wrong article and missed attendance in person:** "any municipality" is UEL art. 18 ust. 1, and ust. 1a (from 1.01.2026) requires a non-EU foreigner to come in person.
- **The routes missed titles of the act:** FE art. 4 ust. 2 pkt 4 (EU citizens' family members) and pkt 6 (support programmes). Lit. g covers any temporary permit with a Polish spouse living in Poland, but the flowchart asked about marriage only on the work branch. A family permit under UoC art. 160 is not in lit. c.
- **31.10.2026 is a Saturday** (the agent's and our computation). A registered letter sent that day still counts (507 art. 14 ust. 1). Filing in person depends on the office's hours (INFERENCE).
- **Page 00115 lists US and Swiss citizens "bez ograniczeń"** inside its unregistered-activity section. PP art. 5 ust. 7 admits only FE art. 4 ust. 1–2 persons. Added to the pages table, under OPEN-B1.

## Verdicts and what changed

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Why, bullet 1 (the title decides; else companies) | PARTLY | Protection, the Karta Polaka, family membership, programmes, the CUKR card; "unless international agreements provide otherwise" |
| Why, bullet 2 (1.11.2026) | PARTLY | The minors' exception; page ou736 states the change, 00806 does not |
| Why, bullets 3–4 | CONFIRMED | — |
| Why, bullet 5 (deletion) | CONFIRMED | The CUKR gap (OPEN-B8); a bullet on the certificate since 27.04.2026 |
| §1 EU and EEA; permanent; refugee etc.; Karta Polaka; Polish spouse | CONFIRMED | Lit. g: whatever the permit's purpose |
| §1 Blue Card, studies, research, family | PARTLY | The permits named by article; art. 160 excluded |
| §1 work permit; business permit | INFERENCE (labelled correctly) | — |
| §1 UKR status | PARTLY | CEIDG art. 8 ust. 8; the pages' conflict (OPEN-B9) |
| §1 CUKR | CONFIRMED | OPEN-B8 |
| §1 a business from 2023 | CONFIRMED | — |
| §1 waiting for a decision | PARTLY | Art. 108, 206, 222a ust. 1 conditions; suspension at the person's request; the certificate; 1794 art. 12, 14 |
| §1 unregistered | PARTLY | 60 months, civil partnership, licences; the 2027 amount |
| §1 no title; US and Switzerland | CONFIRMED | "Unless international agreements provide otherwise" |
| — | — | Two rows added: EU citizens' family (pkt 4); support programmes (pkt 6) |
| B0 (BL1) | CONFIRMED | WD art. 54 cited for the date |
| B1 | PARTLY | UEL art. 18 ust. 1–1a |
| B2 | CONFIRMED | The e-delivery data (art. 6a); the municipality's scan (art. 66b) |
| B3 (BL5) | PARTLY | Art. 6 ust. 3 against ust. 4; the page's 7 days for ZUS |
| B4, B5 | CONFIRMED | BL8: OPEN-B8 and page 00115 |
| Critical moment 1 | CONFIRMED | Saturday; a registered letter that day; minors |
| BS1 | PARTLY | OPEN-B9 |
| BS2–BS9, BS11, BS13 | CONFIRMED | — |
| BS10 | PARTLY | The conditions; the 2027 amount |
| BS12 | PARTLY (outdated since 27.04.2026) | Rewritten with the certificate |
| Intake | PARTLY | The certificate or stamp; EU family card; programme; a marriage question for every temporary permit |
| Handoffs (CEIDG helpline; registry courts) | CONFIRMED | PESEL: UEL art. 18 ust. 1 |
| The flowchart | PARTLY | The marriage question for every temporary permit; pkt 4, 5, 6 branches; PESEL in person; the e-delivery data |
| Change monitoring | CONFIRMED | The 2027 minimum wage; the 1794 notices and transitional rules; the pages |

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| Who may: art. 3 pkt 6, 4 ust. 1, 2 (pkt 1–6), 3, 3a, 4–8 | CONFIRMED | Rows on what pkt 5's stay needs, the certificate, and 1794 art. 12, 14 |
| The CUKR card | CONFIRMED | Not an FE art. 4 title (OPEN-B8) |
| Registering: online, paper, status document, PESEL, online only, existing entries, 2a, data, entry, incorrect, free, start, changes, not started | CONFIRMED | — |
| Statements | PARTLY | Art. 7 ust. 1a–1b (507 art. 1 pkt 6) |
| What else it does | CONFIRMED | A row on what may be attached (art. 6 ust. 4, 9) |
| — | — | Rows added: the e-delivery address; the municipality's scan (art. 66b); a PESEL on application (UEL art. 18) |
| Applications in progress | CONFIRMED | — |
| Unregistered (ust. 1, 3–5, 7; art. 44 ust. 3; 2026 limit) | CONFIRMED | A 2027 row |
| Ukrainian citizens; losing the right; the first months | CONFIRMED | — |
| Pages vs act: without a PESEL | CONFIRMED (page) | Pages ou736 and 03155; the metadata date |
| Pages vs act: other rows | CONFIRMED | Rows added: the stamp; proof of temporary protection; US and Swiss citizens in unregistered activity; the page's 7 days for ZUS |
| Inferences | Labels correct | PESEL in person; CUKR deletion; Saturday 31.10; the certificate |
| OPEN-B5 | WRONG (second half) | Rewritten: answered in part |
| — | — | OPEN-B8 (CUKR), OPEN-B9 (proof of temporary protection) added |
| The tools | PARTLY | The transitional rules marked "read it by hand" are now listed; the new header check |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| The extract: hashes | CONFIRMED | Four sources added (1794, M.P. 370, 1213, UEL 384) |
| The extract: later amendments | PARTLY | 1794 art. 12, 13, 14, 16, 17, 18; 769 art. 35, 40–42, 46; 507 art. 17–21, 23–28, 30 |
| The extract: 507's dates | PARTLY (the dates were right) | What applies on 17.10.2026 with the general date, listed in full; pkt 2 lit. a from 21.04.2026 |
| Page files: HTML hashes | CANNOT CHECK | The HTML carries a session token and differs on each fetch; the headers now say to rely on the text hash |
| Page files: text hashes | CONFIRMED | — |
| Page files: "no update date" | PARTLY | The metadata dates added |

## Acts the files did not use, now quoted

In the extract:
- the FE obwieszczenie's Dz.U. 2025 poz. 1794 art. 12 and 14;
- Dz.U. 2025 poz. 1794 art. 1 pkt 32 lit. a and 39 (UoC art. 206 ust. 1 pkt 1, 222a ust. 1) and art. 19 pkt 2; M.P. 2026 poz. 370; UoC art. 206 ust. 2;
- CEIDG art. 6 in full, 6a and footnote 7; the e-delivery act's art. 152 ust. 1;
- Dz.U. 2026 poz. 507 art. 1 pkt 6, 13 lit. e and 54, and art. 10;
- UEL art. 18 ust. 1–1a and its footnote 14;
- Dz.U. 2026 poz. 1213 § 1.

UoC art. 108 ust. 1–2 with 1794 art. 1 pkt 14 lit. a was already quoted in the moving folder.

Named by the agent but not used here:
- the MSWiA regulations with the certificate's models (Dz.U. 2026 poz. 386, 387, 389): titles only;
- the special act's art. 100d (it suspends residence time limits until 4.03.2027; it sets no CEIDG time limit);
- UoC art. 142 ust. 5 (Turkish citizens; under OPEN-B1);
- Dz.U. 2026 poz. 734 (CEIDG art. 48a, from 20.06.2026), poz. 1206 (UEL art. 23m, 49a) and poz. 755 (data access): not about this matter;
- EUR-Lex on Regulation 2015/1501 (in force; under OPEN-B7).

## The tools

- **`touched.mjs` had listed the transitional rules, and the header still missed them.** The tool printed Dz.U. 2025 poz. 1794 art. 12, 14 and 17 for the FE act and Dz.U. 2025 poz. 769 art. 35 for PP, each marked "read it by hand". None reached the header, and nothing checked that it did. The tool now takes `--header <extract>` and fails when the header does not name a flagged change; changed in the lab, with a test, not independently verified. The lesson `docs/solutions/2026-10-17-amendments-checked-only-for-expected-articles.md` is extended. Run on 17.10.2026, it found more unnamed rules (507 art. 17–21, 23–28 and 30; 1794 art. 13, 16 and 18). All were read, and none changes a quoted rule; they are now listed. It passes for the FE act, the CEIDG act, PP and the UoC.
- `omitted.mjs`, run on the corrected extract against the CEIDG act, marks art. 15 ust. 2–3, 20 ust. 1, 34 ust. 3 and 50, as before (not about a new registration). It also marks art. 6 ust. 1, which is quoted: a misreading by the tool, left as it is.
