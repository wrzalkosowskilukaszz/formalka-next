# Independent check: registering as unemployed, for a foreigner, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed in 213ea9a:
- the map `docs/formalka-next/maps/unemployment.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with the next matters. It is read-only.
- It downloaded every act itself from api.sejm.gov.pl, into an empty folder, and every page.
- Every act's hash the lab gives matches its download. The four psz.praca.gov.pl HTML hashes did not: two of its own fetches of one page differed too. The extracted text matched.
- It also read the KPA, the special act on Ukrainians and its winding-up act (Dz.U. 2026 poz. 203), the health care act, the 800+ act, the social insurance act, the Labour Code art. 55, two regulations under the act and the announcement M.P. 2026 poz. 370. It scanned the API records of all 369 statutes of 2025–2026 for further amendments and found none.

**Then:** each provision behind a correction was re-read here from our own downloads, with the same hashes:
- the labour market act art. 32 ust. 1 pkt 11, 34, 35, 38 ust. 1 pkt 14, 39 ust. 2, 44 ust. 1, 63, 66, 88, 218 ust. 5, 219, 222, 225 ust. 3, 228 ust. 1, 239 ust. 3, 246, 432 ust. 6, 433 ust. 6–7, 436, and its "w drodze rozporządzenia" in art. 1–100 and 218–239;
- Dz.U. 2025 poz. 1794 art. 1 pkt 23, 12, 14, 17, 19, and M.P. 2026 poz. 370;
- Dz.U. 2026 poz. 203 art. 41 and 54, with the work act art. 3 ust. 1;
- Dz.U. 2026 poz. 451 art. 28 and Dz.U. 2026 poz. 1123 art. 48;
- the KPA art. 129–130 (Dz.U. 2025 poz. 1691);
- the 800+ act art. 1 ust. 2a–2c;
- the psz pages "Utrata statusu", "Profil zaufany" and "Konto użytkownika", the last two fetched here.

The new text is in the extract and in two new page files. After the check, a new tool found two more provisions (art. 72, 225 ust. 2; see "The tools"). Every quoted line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a labour lawyer's review.
- Regulation 883/2004 and the bilateral agreements were not read (OPEN-U2).
- The regulations under art. 26 and 98 were read by the agent only; it found no rule on registration, the status or the benefit.

**The app:** the prototype has no labour office case, so none of the findings is in what it shows.

## Result in brief

- **No consolidated text of the act exists, and every amendment date is right:**
  - 1794 art. 10 applies from 27.04.2026 (its art. 19 pkt 2; M.P. 2026 poz. 370);
  - 507 art. 11 applies from 14.10.2026;
  - no amendment touches the other quoted articles.
- **A late report is not a removal ground (the map said so).**
  - Art. 65 ust. 1 does not list it. A benefit paid after the right ended is undue if the person had been told of the circumstances, and must be repaid (art. 246).
  - The loss is not "quiet" either: the starosta decides (art. 65 ust. 1; art. 38 ust. 1 pkt 14 lit. b).
- **The flow sent a notice by the worker to "a later start".** It means no benefit (art. 219 ust. 1 pkt 1); only an agreement delays the start (art. 220).
- **The appeal:**
  - the KPA inference is supported: through the deciding authority, within 14 days (KPA art. 129);
  - with an individual account, appeals go through it (art. 44 ust. 1);
  - where periods abroad matter, the marshal decides and the minister for social security is the higher authority (art. 34 ust. 2, 35 ust. 1).
- **Exceptions in later paragraphs were missing:**
  - art. 66: no removal for a pregnancy-related illness or a parent's care;
  - art. 219 ust. 2 and pkt 3;
  - art. 225 ust. 3: a shorter benefit period;
  - art. 433 ust. 7: the 3 years run from 1.06.2025;
  - art. 436: old-act benefits keep their amounts.
- **"PESEL UKR" was equated with temporary protection.**
  - Lit. j names temporary protection only.
  - Dz.U. 2026 poz. 203 art. 41 deals with Ukrainians staying legally without it; its rule is about work.
- **The page comparison:**
  - the act does name a decision granting the status (art. 38 ust. 1 pkt 14 lit. a);
  - the psz page "Utrata statusu" wrongly lists a suspended business and a business not yet started as loss grounds (art. 2 pkt 1 lit. c–e are alternatives).
- **The open points:**
  - OPEN-U3 answered: no regulation on registration, the status or the benefit;
  - OPEN-U2's route answered (art. 35, 222);
  - OPEN-U1 partly answered (the psz pages on the trusted profile and the qualified certificate);
  - OPEN-U4 supported.

## Verdicts and what changed

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| Which foreigners may be unemployed; job seeker only; steady income; one office | CONFIRMED | Pkt 5 noted under "job seeker only" |
| Family members (pkt 5) | PARTLY | The stamp basis removed from 27.04.2026; 1794 art. 12, 14 |
| The other conditions | PARTLY | Lit. m: compulsory social insurance, and the UK |
| How, data, documents, statements, from which day, refusals, signatures | CONFIRMED | — |
| The account | CONFIRMED | Art. 432 ust. 6 added |
| Letters | CONFIRMED | "Where an individual account was set up" |
| Who decides | PARTLY | "Jeżeli ustawa nie stanowi inaczej"; art. 39 ust. 2; art. 38 ust. 1 pkt 14; new rows on periods abroad and the appeal |
| How long | PARTLY | Art. 63 ust. 2–3; 433 ust. 7 |
| Changes | CONFIRMED | Art. 232's wording from 14.10.2026; a new row on not reporting (art. 246) |
| Moving; abroad; illness | CONFIRMED | Art. 239 ust. 3 added |
| Removal | PARTLY | By decision; a new row on art. 66 |
| Health insurance; the amounts; 180 or 365 days; income; job search in the EU | CONFIRMED | Art. 228 ust. 1 and 436 added to the amounts |
| The benefit: who | CONFIRMED | Art. 218 ust. 1 "z wyjątkiem art. 219 i art. 220"; ust. 5 |
| Not at all (art. 219) | PARTLY | Ust. 1 pkt 3 and ust. 2 |
| Later (art. 220) | PARTLY | Art. 225 ust. 3 |
| Pages vs act: which act, proof of address, signatures, conditions | CONFIRMED | — |
| "A decision is not named there" | PARTLY | Art. 38 ust. 1 pkt 14 lit. a named |
| The portal "matches the act on every point" | PARTLY | The "Utrata statusu" error and the old CEIDG wording recorded |
| Inferences: no PESEL, no meldunek, no residence protection, 800+ | Supported | The online signature added; the 800+ scope added; two inferences added (Ukrainians without protection; titles outside art. 1 ust. 3) |
| OPEN-U1 to U4 | Partly answered, answered, answered, supported | Rewritten |

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Why, bullet 1 | CONFIRMED | Art. 2 pkt 1 cited; the pkt 5 exception |
| Why, bullet 2 | PARTLY | The art. 219–220 exceptions |
| Why, bullet 3 | WRONG (the late report) | Rewritten: a decision; repayment under art. 246 |
| Why, bullet 4 | No label, no source here | Labelled; the 800+ act's articles |
| §1: permanent, refugee, applicant, single permit, study, family, EU | CONFIRMED | — |
| §1: "Ochrona czasowa (PESEL UKR)" | PARTLY | Ask about temporary protection; 203 art. 41 |
| §1: seasonal work | PARTLY | Phrased by residence basis; a seasonal work visa is lit. o |
| §1: no route for other titles or "nie wiem" | Design note | Two rows added (INFERENCE, PROPOSED) |
| U0, UL1, UL2, U2, UL4, UL7, U4, UL8, UL9, U5, UL10, UL11 | CONFIRMED | UL7: art. 225 ust. 3; UL8: "with an individual account" |
| U1: the residence document | PARTLY | Labelled INFERENCE |
| UL6 | PARTLY | Art. 219 exceptions |
| U6 | PARTLY | The account route; the coordination route; KPA art. 129 |
| US1, US2, US6–US9, US11, US12 | CONFIRMED | — |
| US3 | PARTLY | Temporary protection, not PESEL UKR |
| US4, US5, US10, US13 | PARTLY | Art. 219 ust. 2; 225 ust. 3; 44 ust. 1; 66 ust. 1 and 239 ust. 3 |
| US15 | PARTLY | The marshal; the minister on appeal |
| Intake question 4 | Design note | Days, not months; periods abroad |
| Flow node S | WRONG | Split: notice (none), agreement (90 days); "nie wiem" routes added |
| Flow nodes X and N | Design note | "Nie wiem" no longer leads to a definite outcome |
| §6 change monitoring | PARTLY | Dz.U. 2026 poz. 1123 art. 26; art. 228 ust. 1 |
| US17 (new) | — | Art. 433 ust. 7, 436 |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| `rynek-pracy-2025-620-extract.txt`: no consolidated text, hashes, dates | CONFIRMED | — |
| The same: the amendments line | PARTLY | 1794 art. 12 and 14 described; 451 art. 28; the act's art. 432–436; M.P. 2026 poz. 370 quoted |
| The same: UoC opening lines | PARTLY | 1794 art. 1 pkt 23 (from 27.04.2026) noted |
| The four psz pages | CONFIRMED (dates); hashes not reproducible | The hash of the extracted text added |
| `gov-zglos-sie-do-urzedu-pracy-2020-01-24.txt` | CONFIRMED | — |

## Acts the files did not use, now quoted

- In `rynek-pracy-2025-620-extract.txt`:
  - the labour market act art. 32 ust. 1 pkt 11, 34 ust. 2, 35 ust. 1, 38 ust. 1 pkt 14 lit. a–b, 39 ust. 2, 66, 218 ust. 5, 219 ust. 2, 225 ust. 3, 239 ust. 3, 246 ust. 1–2 pkt 1–2, 432 ust. 6, 433 ust. 6–7, 436 ust. 1–3;
  - Dz.U. 2025 poz. 1794 art. 12, 14 and 19 pkt 1–2, and M.P. 2026 poz. 370 pkt 6;
  - Dz.U. 2026 poz. 203 art. 41;
  - the KPA art. 129 and 130 § 1–3.
- New page files: `psz-profil-zaufany-2026-10-17.txt`, `psz-konto-uzytkownika-2026-10-17.txt`.

Named by the agent but not used here:
- Dz.U. 2026 poz. 842 (IT systems) and Dz.U. 2025 poz. 1549 (placement and counselling), regulations under the act;
- the act's art. 46 and 88 (read for OPEN-U3; art. 88 is cited);
- Dz.U. 2025 poz. 1083 art. 4 (it changes the health care act's art. 66 ust. 1 pkt 1 only).

## The tools

- The agent noted that `touched.mjs` lists 1794 art. 17 as naming art. 222, 228 and 246 of this act. Read by hand, those are articles of the act on foreigners; only art. 17 ust. 1 pkt 7 concerns this act. The tool already says "read it by hand" for such rules, so it was not changed.
- Missed exceptions in later paragraphs were found a third time (`docs/solutions/2026-10-16-read-the-whole-article.md`), so a check was added, with tests (`tools/sources/*.test.mjs`, 20/20): `node tools/sources/omitted.mjs <ELI> <extract>`. It lists the paragraphs an extract leaves out of each quoted article, and the articles that name a quoted one, marking those with an exception word.
  - On the extract as first committed, it lists art. 218 ust. 5, 219 ust. 2, 225 ust. 2–3, 35 ust. 1, 66 ust. 1 and 433 ust. 7: six of the agent's findings.
  - On the corrected extract, it also listed art. 72 (the forms of help: lit. k, m, n and p without the education loan and the training stipend; lit. o only for seasonal work) and art. 225 ust. 2 (a longer benefit after a birth). Both were read here and added to the extract, the README and US2; the agent had not named them.
  - What it still lists was read and left out, as it bears on no rule here: art. 35 ust. 6 (the KPA's art. 37 does not apply to coordination cases), art. 51 (data shared with the minister), art. 234 ust. 8 (the training stipend) and art. 252 (claims end on the debtor's death).
  - It does not see a rule that names no quoted article (art. 246 and 436 were found by the agent), so it does not replace the agent's reading.
