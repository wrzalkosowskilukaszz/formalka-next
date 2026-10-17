# Independent check: the Karta Polaka, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed on the branch (HEAD 2f5b2be):
- the map `docs/formalka-next/maps/karta-polaka.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with the next matters. It is read-only.
- It downloaded every act itself from api.sejm.gov.pl, and every page. Every hash the lab gives matches its download, and all 290 quoted lines of the extract match its conversion.
- It scanned the full text of all 149 statutes of 2026 (to 15.10.2026), and every 2026 statute and regulation by its API references, for changes to the Karta Polaka act. It found none.
- It also read the KPA, the act on foreigners, the work act, the act on the entry of EU citizens, the form and benefit regulations, the 2026 budget act and the interior ministry's notices.
- It found the minister's notice of 14.01.2026 that stops the settlement benefit.

**Then:** each provision and page behind a correction was re-read here from our own downloads, with the same hashes:
- KP art. 2 ust. 1 pkt 2 and ust. 4, 4, 5a, 6 ust. 1 pkt 5, 8a, 8b, 8c ust. 2, 9, 12, 13 ust. 1 pkt 4, 16, 17 ust. 2–4 and 7, 18 ust. 3, 19a, 20 ust. 1a and 3, 21, 22–24d;
- REG § 1–2, and the date of its 2022 change (Dz.U. 2022 poz. 1498, in force 30.07.2022);
- the KPA art. 19, 21 § 1, 37 § 1–3, 65 § 1;
- UoC art. 196 ust. 1 pkt 6, 229 ust. 7;
- the work act art. 3 ust. 3 and 5, with Dz.U. 2025 poz. 1794 art. 11;
- the act on the entry of EU citizens art. 48 ust. 1–2;
- the special act art. 100d ust. 2;
- Dz.U. 2026 poz. 676 art. 1 pkt 2 and 13;
- the form regulation Dz.U. 2016 poz. 1382 and the benefit regulation Dz.U. 2016 poz. 2274 § 3;
- M.P. 2025 poz. 264's list (49 states, none in Poland);
- `reference/citizenship/facts-recognition.yaml`;
- the minister's notice of 14.01.2026 and its attachment, the ministry's notices list (pages 1–3), the Świętokrzyskie office's notice, and the current Podlasie and the Opole pages.

The new text is in the extract and in three new page files. Every quoted line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a lawyer's review.
- The consulates' pages were not fetched (OPEN-K4).
- Three offices' pages could not be read by the agent (the Mazovian booking site gave an empty reply; the Poznań and Małopolska sites' certificate chains could not be verified, and it did not bypass verification).
- Its scans of new acts end at 15.10.2026.

**The app:** the prototype has no Karta Polaka case, so none of the findings is in what it shows.

## Result in brief

- **The settlement benefit is on hold, and neither file said so.**
  - The interior minister's notice of 14.01.2026, under KP art. 24c ust. 2: the 2026 reserve is 55 000 000 zł, 75 % is 41 250 000 zł, and the applications reached it.
  - Applications filed from 15.01.2026 are not examined until the budget act secures funds.
  - A voivode's office says they are still accepted and will be examined in order of receipt.
  - The ministry's list shows no later notice on the benefit up to 29.09.2026.
- **The card is returned before the residence card is issued.**
  - The holder returns the card within 14 days of the permanent residence decision becoming final, to the voivode of the place of stay (KP art. 20 ust. 3 pkt 2). The files had counted the 14 days from the document.
  - The residence card is issued after the card is returned (UoC art. 229 ust. 7). The inference "applying ends the card's use" was wrong in its wording.
- **A minor's renewal is filed after coming of age** (art. 17 ust. 4). KS7 left that out.
- **Which office:**
  - the consul is the one for the applicant's place of residence (art. 12 ust. 2), so "a consul abroad" fits only someone who still lives abroad (§1, KS2);
  - REG § 2 names stateless persons of the three states too, conditions nothing on stay in Poland, and is an option ("mogą");
  - the KPA applies (KP art. 4 ust. 1), so the voivode is the one for the place of residence in Poland, else of stay (KPA art. 21 § 1 pkt 3; INFERENCE). OPEN-K1 is narrowed, not closed.
- **"Work without a permit" has a condition:** the holder must stay on a basis of the work act's art. 3 ust. 3 or visa-free (its art. 3 ust. 5).
- **"Karta stałego pobytu" was the wrong term.** It is an EU citizen's family member's card (EU entry act art. 48 ust. 2). The refusal ground is the permanent residence permit (KP art. 19 pkt 4), and it is a refusal decision, not a refusal "z mocy ustawy".
- **Smaller corrections:**
  - the security check counts from the application's entry in the register, and a missing report counts as none;
  - a benefit decision is appealed to the interior minister (art. 8b ust. 4);
  - the starosta pays the benefit, and only family members staying in Poland count (art. 8b ust. 2, 8c ust. 2);
  - the organisations list has only foreign organisations, and "only listed ones count" is an INFERENCE;
  - Opole's online booking is suspended, and Podlasie takes no registrations now;
  - REG's change applied from 30.07.2022, not 1.08.2022 (the Mazovian page);
  - production's registry does mention the card, in the citizenship facts.
- **OPEN-K2 answered** by the form regulation (Dz.U. 2016 poz. 1382): the form is filled in in Polish, with a photo 35 x 45 mm.
- **No amendments** to the Karta Polaka act, REG or the two regulations since the texts quoted.

## Verdicts and what changed

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| Line 3: the registry has nothing | PARTLY | "No Karta Polaka procedure"; the citizenship facts named |
| The sources table | CONFIRMED | Three page files added |
| The conditions | CONFIRMED | The voivode's designated worker |
| Not for; Polish origin; language; evidence | CONFIRMED | — |
| The organisations | CONFIRMED | 49 states, none in Poland |
| A minor | CONFIRMED | No parental authority; the joint application |
| Who; which voivodes | CONFIRMED | Residence abroad; stateless; an option; the KPA rule |
| The form | CONFIRMED | The form regulation |
| Fees; procedure; what it is; the rights; showing it; how long; annulment | CONFIRMED | The rights: the work act's condition |
| The checks | PARTLY | From the entry in the register; silence; the ponaglenie |
| No suspension | PARTLY | Art. 100d ust. 2 for permanent residence; the benefit's stop in its own row |
| Appeal | CONFIRMED | The benefit's appeal to the minister |
| Visas and citizenship | CONFIRMED | "Nadanie" |
| Settling | PARTLY | Family in Poland; the starosta pays; the BIP; art. 24a–24c quoted; a row "Now: on hold" |
| A minor's card | PARTLY | "After coming of age" |
| Changes, loss | PARTLY | Ust. 2a and 3 apply |
| Lapse by law | PARTLY | The 14 days from the final decision; UoC art. 229 ust. 7 |
| Pages vs acts: Opole's list | CONFIRMED | — |
| Pages vs acts: Mazovia | PARTLY | The KPA rule; two rows added (REG's date, the booking pages) |
| Inference 1 (waiting) | Supported | The suspended booking; the benefit |
| Inference 2 (temporary protection) | Supported | No condition of stay |
| Inference 3 (applying ends the card's use) | Contradicted in its wording | Rewritten: the card stays in use while the case runs |
| — | — | Three inferences added: the voivode by residence; listed organisations; the benefit appeal's 14 days |
| OPEN-K1 to K4 | Narrowed, answered, unchanged, unchanged | Rewritten |

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Why, bullet 1 | CONFIRMED | — |
| Why, bullet 2 | PARTLY | Stateless persons; the KPA rule (INFERENCE); OPEN-K1 |
| Why, bullet 3 | CONFIRMED | "Or a Polish school certificate" |
| Why, bullet 4 | PARTLY | The work act's condition; the benefit's stop; the return before the residence card |
| §1 rows 1–2 | PARTLY | Residence; stateless persons; OPEN-K1 |
| §1 row 3 | PARTLY | The permanent residence permit; a refusal decision; "karta stałego pobytu" explained |
| §1 row 4 | PARTLY | The benefit's stop |
| §1 row 5; K1 evidence; K2; KL4; KL8; critical moment 2 | CONFIRMED | — |
| KL1, KL2 | CONFIRMED / PARTLY | The permit's name; stateless persons |
| K1 apostilles | PARTLY | Opole's words |
| KL3 | PARTLY | Labelled INFERENCE; the list is foreign |
| K3 | PARTLY | The form regulation; the booking stops |
| K4 | PARTLY | From the entry in the register; the ponaglenie |
| K5 | PARTLY | The ID for some rights; the work act's condition |
| K6, KL9 | PARTLY | The return's 14 days; after coming of age |
| Critical moments 3–4 | CONFIRMED / PARTLY | The 65+ and minor cards; the benefit's stop and the return |
| KS1, KS2, KS5 | PARTLY | The KPA rule; residence; the consul's limit |
| KS3 | CONFIRMED | Wording |
| KS4 | PARTLY | The 3 years; the INFERENCE labelled |
| KS6, KS11–KS13 | CONFIRMED | — |
| KS7, KS8, KS9 | PARTLY | Rewritten |
| KS10 | CONFIRMED | The international agreement added |
| KS14 | CONFIRMED | The form regulation cited |
| Intake 1, 3 | PARTLY | Stateless persons; the permit's name |
| Kalendarz | PARTLY | "From delivery" |
| Handoffs | CONFIRMED | The benefit's appeal |
| The flowchart | PARTLY | A refusal decision; "nie wiem"; residence; stateless persons; the benefit's stop |
| Change monitoring | CONFIRMED | The budget act and the notices added |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| `karta-polaka-2026-76-extract.txt`: the act, hashes, no amendments | CONFIRMED | — |
| The same: Dz.U. 2026 poz. 676 | PARTLY | Its hash and the dates of its points |
| The same: what it quotes | Missing art. 22–24d | Added, with the provisions of other acts listed above |
| Opole | CONFIRMED | The suspended booking recorded in the README |
| Mazovia | CONFIRMED | REG's date recorded |
| Podlasie 2024 | CONFIRMED | The current page added |
| The foreign ministry | CONFIRMED | — |

## Acts the files did not use, now quoted

- In `karta-polaka-2026-76-extract.txt`:
  - KP art. 22–24d;
  - UoC art. 196 ust. 1 pkt 6 and 229 ust. 7;
  - the KPA art. 19, 21 § 1, 37 § 1–3 and 65 § 1;
  - the act on the entry of EU citizens art. 48 ust. 1–2;
  - the form regulation Dz.U. 2016 poz. 1382 (§ 1–2 and two lines of the form);
  - the benefit regulation Dz.U. 2016 poz. 2274 § 3.
- New page files:
  - `mswia-wstrzymanie-swiadczenia-2026-01-14.txt`;
  - `uw-swietokrzyski-wstrzymanie-swiadczenia-2026.txt`;
  - `uw-podlaski-karta-polaka-2026-10-17.txt`, with the office's phone numbers removed.

Named by the agent but not used here:
- the 2026 budget act (Dz.U. 2026 poz. 62, annex 2, reserve item 28): the minister's notice gives the amount;
- Dz.U. 2016 poz. 2275 (the reserve's distribution);
- Dz.U. 2025 poz. 1779 (the Council's internal organisation).

## The tools

`tools/sources/omitted.mjs` (new on 17.10.2026; `audit/2026-10-17-omitted-sweep/README.md`), run on the extract before the agent reported, marked nothing. The gap the agent found (art. 24a–24d cited, not quoted) is a citation in the README without its text, which the tool does not compare. It was added to the extract.
