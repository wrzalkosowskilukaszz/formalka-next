# Sources: civil status (birth, marriage, death, foreign records), doc 19 matter 14

Collected on 17.10.2026 by Claude, for the map `docs/formalka-next/maps/civil-status.md`. Level R1 under doc 19: sources only, with provenance. Production's registry has no guide for this matter. The PESEL guide only asks for "dokumenty … stanu cywilnego" when they are entered in the application (`reference/address-registration/procedure-pesel.yaml`). So nothing here can reach the app before production adds a guide (doc 19, wave 4 gate).

**Checked on 17.10.2026** by a separate agent (`.claude/agents/official-fact-checker.md`) against the official texts it downloaded itself; its verdicts, and what changed here in response, are in `CHECK.md`. The corrections were changed in the lab; not independently verified. That check is a second reading by the same kind of tool, not an expert's review.

| File | Source | Version |
|---|---|---|
| `pasc-2026-393-art2-113-extract.txt` | The act on civil status records (PASC), consolidated Dz.U. 2026 poz. 393 | Legal state of 9.03.2026; no later amendments (both source tools, 17.10.2026) |
| `kro-2026-236-art1-7-25-72-73-88-89-extract.txt` | Family and Guardianship Code (KRO), consolidated Dz.U. 2026 poz. 236 (with art. 75 § 1, added after the check) | Changes published before 19.02.2026; no later amendments |
| `pil-2023-503-art2-3-16-48-50-55-extract.txt` | Private international law act (PIL), consolidated Dz.U. 2023 poz. 503 | No later amendments |
| `uel-2026-384-art7-17-29-extract.txt` | Act on population records (UEL), consolidated Dz.U. 2026 poz. 384 (with art. 18 ust. 1–1a and 38, added after the check) | The text already includes Dz.U. 2025 poz. 1794; one later act (2026 poz. 1206, from 11.01.2027) touches other articles |
| `uoc-2025-1079-art160-195-202-child-extract.txt` | Foreigners act (FA), consolidated Dz.U. 2025 poz. 1079, with art. 202 as rewritten by Dz.U. 2025 poz. 1794 | Art. 202 new from 27.04.2026 |
| `oplata-skarbowa-2025-1154-civil-status-extract.txt` | Stamp duty act, consolidated Dz.U. 2025 poz. 1154: the civil-status items of its annex | Six later acts; their annex changes were read; none touches these items |
| `other-acts-civil-status-extract.txt` | KPA art. 129 § 1–2; KPC art. 508 § 1, 562; the cemeteries act art. 10 ust. 1, 3, art. 11 ust. 1–2; the e-delivery act art. 147 ust. 2; the citizenship act art. 14; the identity cards act art. 50 ust. 1; the regulation Dz.U. 2015 poz. 180 | Collected after the check; amendments listed in its header |
| `gov-zglos-urodzenie-dziecka-2026-10-17.txt` | gov.pl, "Zgłoś urodzenie dziecka" | The page's own date: 31.12.2025 |
| `mc-mobywatel-zglos-urodzenie-2026-10-17.txt` | gov.pl, Ministry of Digital Affairs news of 6.03.2026 on registering a birth in mObywatel | News item |
| `gov-wez-slub-cywilny-2026-10-17.txt` | gov.pl, "Weź ślub cywilny" | The page's own date: 21.11.2023 |
| `gov-zglos-zgon-2026-10-17.txt` | gov.pl, "Zgłoś zgon" | The page's own date: 27.01.2020 |

**Also read, not stored:** the Ombudsman's (RPO) page on the document a foreigner must show to marry: https://bip.brpo.gov.pl/pl/content/rpo-cudzoziemiec-malzenstwo-zaswiadczenie-problemy-mswia (published 4.10.2024, updated 5.03.2025). Its server refused a direct download, so it was read through a fetch tool on 17.10.2026 and has no hash. The quotes below are as that tool returned them; check them on the page before relying on them.

## What they say (FACT)

### Birth in Poland

| Topic | Content | Basis |
|---|---|---|
| Where | The civil registry office (USC) of the place of birth | PASC art. 13 ust. 1, 14 |
| The birth card | The healthcare provider ("podmiot wykonujący działalność leczniczą") sends it to the USC electronically within 3 days of drawing it up; a stillbirth card within 1 day, and none if the child's sex cannot be determined. gov.pl: "osoba, która odebrała poród – na przykład lekarz lub położna" | PASC art. 53 ust. 1, 54 ust. 1, 3–4; gov.pl page |
| The deadline | Report the birth **within 21 days of the birth card** (a stillbirth within 3 days). Otherwise the USC registers the birth ex officio from the card and **chooses the name itself** | PASC art. 55, 56 ust. 2 |
| Who reports | The mother or father with full legal capacity; a parent of 16 or over with limited capacity; otherwise the mother's legal representative or guardian. By proxy too | PASC art. 57 |
| Online | A parent with full capacity, through the minister's e-service after logging in (INF art. 20a ust. 1). The gov.pl page: a trusted profile, an e-ID or a qualified signature; **"Od 1 stycznia 2026 r. tę sprawę załatwisz już tylko za pośrednictwem e-Doręczeń"**. Since 5.03.2026 also in mObywatel, with an e-Doręczenia box | PASC art. 58a; gov.pl page; news of 6.03.2026 |
| When the record is made | The day of the report in person; the next working day when reported online or at the person's place of stay (art. 17: illness, disability or another insurmountable obstacle). It is drawn up on the basis of the birth card | PASC art. 52 ust. 1, 53 ust. 1, 17 |
| What the protocol holds | The parents' data and PESEL numbers if they have them; the child's and the parents' citizenship; the place and designation of the parents' marriage record, or of each parent's birth record (online: "jeżeli są znane") | PASC art. 58 pkt 1, 5, 6, 8; art. 58a ust. 2 pkt 8 |
| Names | At most two. No diminutives, nothing ridiculous or indecent. "Niezależnie od obywatelstwa i narodowości rodziców dziecka wybrane imię lub imiona mogą być imionami obcymi". A name that does not show the child's sex may be chosen if in common meaning it belongs to one sex; a name that does not show the sex is refused. If refused, the USC chooses a name by a decision with immediate effect; appeal to the voivode within 14 days of delivery, lodged through the USC head | PASC art. 59 ust. 1–4; art. 11 ust. 2, art. 12 ust. 1 with KPA art. 129 § 1–2 |
| The father, if not married to the mother | His data go in the record only after recognition of paternity or a court ruling. Recognition: he declares before any USC head (also before a court, or abroad a consul when a parent is Polish), and the mother confirms at the same time or **within three months** | PASC art. 61, 18; KRO art. 73 § 1, 4 |
| The child's surname (Polish law) | Married parents: their common surname, or the one they chose, or else both joined (mother's first). After recognition: as the parents state; else both joined | KRO art. 88, 89 |
| PESEL | The USC asks for a PESEL ex officio for children born in Poland of Polish citizens **and of foreigners living in Poland** ("cudzoziemców zamieszkujących na terytorium Rzeczypospolitej Polskiej") | UEL art. 17 ust. 1 pkt 1 with art. 7 ust. 1 pkt 1, 3; PASC art. 20 ust. 1 |
| Residence registration | **The USC registers the newborn's residence ex officio only for children of Polish citizens living in Poland** (art. 7 ust. 1 pkt 1), on the day the birth record is drawn up. The gov.pl page says the USC "zamelduje je", then lists the confirmation "(jeśli dziecko zostało zameldowane)" | UEL art. 29; gov.pl page |
| Cost | Drawing up a birth or death record is exempt from stamp duty. One short copy is issued ex officio. The gov.pl page: "Usługa jest bezpłatna" | Stamp duty annex part I item 2, column 4; PASC art. 47 ust. 1 |
| What the parent receives | A short copy of the birth record; the PESEL notice (if one was assigned); the registration confirmation (if the child was registered) | gov.pl page; PASC art. 58a ust. 2 pkt 11 |

### The child's residence (foreign parents)

| Topic | Content | Basis |
|---|---|---|
| A temporary permit for the child | May be granted to a minor child of a foreigner staying on a national visa or a temporary permit, born while it was valid, if the parent meets art. 159 ust. 1 pkt 2 and 3 (insurance, income, a place to live) | FA art. 160 pkt 2 |
| A permanent permit for the child | For a child of a permanent or EU long-term resident born after that permit, or during the parent's temporary permit, humanitarian or tolerated stay, or refugee or subsidiary protection | FA art. 195 ust. 1 pkt 1 |
| Its deadline | Any permanent permit application is due by the last day of legal stay, **except** for a child born in Poland of a permanent or EU long-term resident, and a child of a Polish citizen "które pozostaje pod władzą rodzicielską tego obywatela". Cases begun before 27.04.2026 follow the old rules (1794 art. 12). If the online system fails, the application is filed by the 3rd working day after the fix (new art. 225c ust. 1) | FA art. 202 ust. 1, 3 and art. 225c (from 27.04.2026); 1794 art. 12 |
| UKR status and CUKR | A child born in Poland of a temporary protection beneficiary has legal stay, unless the child is a Polish or other EU citizen. The CUKR card for such a child only if, on the day of the application, the child has the UKR status and the mother has been issued her card | PA art. 106 ust. 2; special act art. 42d pkt 1–3 (`research/2026-10-17-ukr/sources/`) |

### Marriage in Poland

| Topic | Content | Basis |
|---|---|---|
| The start | Each person in person shows an identity document and signs the written "zapewnienie" (no known impediment) at the chosen USC | PASC art. 15 ust. 1, 76 ust. 1 |
| The wait | Not before **one month** from the zapewnienie; the USC may allow it sooner for important reasons (a written permit, stamp duty 39 zł) | KRO art. 4; PASC art. 76 ust. 10; stamp duty part III item 1 |
| Validity | The zapewnienie is valid 6 months | PASC art. 76 ust. 9 |
| A foreigner also files | A copy of the birth record (and, after an earlier marriage, its record with the end noted, or the documents of its end) if the other documents do not give the data; and **a document stating that under the applicable law the person may marry**, unless PIL makes Polish law apply | PASC art. 79 ust. 1 |
| Which law | Capacity to marry: each person's national law at the time of the marriage. Form: the law of the place. When the nationality cannot be established, the person has none, or **the content of the national law cannot be established**: the law of domicile, else of habitual residence; the same for a person granted protection in a state other than their own because their ties to it were permanently broken | PIL art. 48, 49 ust. 1; art. 3 ust. 1–2 |
| If that document cannot be had | A court may exempt the foreigner, on their application, and decides under the applicable law whether they may marry. The court is that of the applicant's place of residence, or of stay if they have none (gov.pl says the same); example on gov.pl: war in the country of origin | PASC art. 79 ust. 2; KRO art. 3 § 2; KPC art. 562 with 508 § 1; gov.pl page |
| Witnesses | Two adult witnesses; the statements are made in public | KRO art. 7 § 1 |
| Interpreter | The couple must bring an interpreter or expert if they or the witnesses cannot communicate with the USC head | PASC art. 32 ust. 2 |
| Translations | Foreign-language documents with an official Polish translation by a sworn translator (Polish list or an EU/EEA one) or a consul | PASC art. 31 ust. 1 |
| Fees | The marriage record 84 zł, due on filing. Outside the office on request, at a place that keeps the ceremony's form and everyone's safety, an extra fee of **1 000 zł** (the regulation; gov.pl gives the same figure); none when the person's life or health is in danger or they are deprived of liberty (art. 85 ust. 4). One free short copy | Stamp duty part I item 1, art. 6 ust. 1 pkt 1; PASC art. 85 ust. 4–5, 8, 11; regulation Dz.U. 2015 poz. 180 § 2; art. 47 ust. 1 |
| Surnames | Each spouse declares their surname: a common one, their own, or both joined (two parts at most); with no statement, each keeps theirs. The children's surname is declared at the same time | KRO art. 25, 88 |
| A refusal | Notice on paper or electronically; within 14 days, a written application to the court of the USC's seat. None lies against a refusal based on a court ruling | PASC art. 89 ust. 1–3 |
| Practice (RPO) | Some USCs refused a foreigner's certificate because it did not name the other spouse. The RPO: "Z polskich przepisów nie wynika wprost, że takie zaświadczenie musi zawierać dane drugiego z nupturientów". MSWiA "dostrzega problem"; it asked the Ministry of Justice (7.10.2024) | RPO page (read through a fetch tool) |

### Death

| Topic | Content | Basis |
|---|---|---|
| Deadline | The death card is filed **within 3 days** of its issue; after an infectious disease, within 24 hours of the death | PASC art. 93 ust. 1 |
| Who | The person entitled to bury the deceased: the spouse, descendants, ascendants, relatives to the 4th degree, in-laws of the 1st degree, and anyone who undertakes it voluntarily. For a body given to science, an authorised university employee. If no one reports, the municipality of the place of death, which then buries | PASC art. 93 ust. 2–4; cemeteries act art. 10 ust. 1, 3 |
| Where | The USC of the place of death | PASC art. 13 ust. 2, 16 |
| Record and cost | Drawn up on the day; free; one short copy ex officio | PASC art. 92 ust. 1, 47; stamp duty part I item 2 |
| After | The death report at the USC replaces deregistration of the deceased; the ID card is cancelled on the holder's death (gov.pl, 2020, says the same) | UEL art. 38; identity cards act art. 50 ust. 1; gov.pl page |

### Foreign records and documents from the register

| Topic | Content | Basis |
|---|---|---|
| Transcription | A foreign civil-status document "może zostać przeniesiony" to the register: a faithful, literal transfer, without changing the spelling of names. It must be a civil-status document with official force where it was issued, issued by the competent body, beyond doubt | PASC art. 104 ust. 1–3 |
| When it is mandatory | **Only for a Polish citizen** who has an earlier Polish record and asks for a civil-status act, a Polish identity document or a PESEL | PASC art. 104 ust. 5 |
| Refusal | Not a civil-status document, not official, doubtful; a transcription made in a third state; contrary to basic principles | PASC art. 107 |
| Foreign judgments | A divorce or other ruling is noted after recognition (code of civil procedure, treaties, EU law); a refusal points to the court | PASC art. 108 |
| Reconstruction | When the foreign document is a civil-status record under the local law and a copy cannot be obtained, **or only with serious difficulty**, its content is reconstructed from a document or a certified copy | PASC art. 109–112 |
| Copies and certificates | Full and short copies; a certificate of civil status (valid 6 months, for the person concerned); fees 33 zł (full), 50 zł (full after transcription), 39 zł (after registration of a foreign event or reconstruction), 22 zł (short), 38 zł (civil status certificate; also "zgodnie z prawem polskim można zawrzeć małżeństwo"), 24 zł (data certificate). Column 4 lists exemptions | PASC art. 44, 49; stamp duty part II item 1 |
| Online | The person, spouse, children and parents may ask for copies after logging in (INF art. 20a); the online data and civil-status certificates are free. Not available when the records have not been moved to the register or the data differ from PESEL | PASC art. 45 ust. 2, 6, 7; 49 ust. 4, 6, 7 |
| Appeals | From a USC decision to the voivode | PASC art. 11 ust. 2 |

## Where the pages and the act differ

| Point | Page | Act | What the map does |
|---|---|---|---|
| The newborn's residence registration | "Kierownik urzędu … zamelduje je" (birth page, opening) | Ex officio only for children of Polish citizens living in Poland (UEL art. 29 with art. 7 ust. 1 pkt 1) | Says the parent registers the child's residence, unless the parent is a Polish citizen (INFERENCE); links the address-registration case |
| Who may report in person | "ukończone 16 lat i nie zostali pozbawieni zdolności do czynności prawnych" | Full capacity; at 16 or over, limited capacity; otherwise the mother's representative (PASC art. 57 ust. 1) | Follows the act |
| Who reports a death | The family and their proxy (2020) | The person entitled to bury, including a volunteer (PASC art. 93 ust. 2; cemeteries act art. 10 ust. 1); the municipality if no one does (art. 93 ust. 4) | Follows the act |
| The online route | Only through e-Doręczenia from 1.01.2026 | Not in PASC art. 58a. A likely basis: the e-delivery act art. 147 ust. 2 made ePUAP delivery from a person to a public body equivalent only until 31.12.2025; it does not say "only" (OPEN-S10) | States the page's wording, with its date |

## Inferences (to be confirmed)

- **Foreign parents without a PESEL cannot register the birth online.** The online route needs a login under INF art. 20a and, per the page, e-Doręczenia. The trusted profile and an e-Doręczenia address both need a PESEL (`research/2026-10-17-egov/sources/README.md`). They report in person, with a passport (gov.pl lists "dowód osobisty lub paszport").
- **The child of foreigners gets a PESEL at registration only if the parents "live" in Poland** (UEL art. 7 ust. 1 pkt 3). What the USC takes as living in Poland is OPEN-S1.
- **The child of foreigners is not registered at an address by the USC.** The parent registers the child's residence under the general rules (UEL art. 29 covers only children of Polish citizens). This links back to wave 1.
- **The child's own residence title is a separate case** (FA art. 160 pkt 2, art. 195), with the parent's insurance, income and a place to live as conditions. It does not apply to a child who is a Polish citizen by birth (citizenship act art. 14 pkt 1: a Polish parent), and a child of a temporary protection beneficiary has legal stay (PA art. 106 ust. 2). When it must be filed is OPEN-S7.
- **A foreigner does not need transcription to marry or to register a child.** It is mandatory only for some Polish citizens (PASC art. 104 ust. 5); the foreign document with a sworn translation is the evidence (art. 31). Whether offices still ask for it is OPEN-S9.
- **Recognition of paternity of a foreign child follows the child's national law** (PIL art. 55 ust. 3), so a USC may need to know that law. A lawyer's question.

## Open

| Id | Question |
|---|---|
| OPEN-S1 | What the USC checks for "cudzoziemcy zamieszkujący na terytorium Rzeczypospolitej Polskiej" before asking for the newborn's PESEL |
| OPEN-S2 | Which law sets a foreign child's surname (PIL art. 16 ust. 1 speaks of personal rights; the name is not named), and how the USC applies foreign law to names and to recognition (PIL art. 55 ust. 3) |
| OPEN-S3 | Which documents a USC asks foreign parents to bring for the birth report (their marriage or birth records, translations, apostille). The act names data, not documents (PASC art. 22, 58 pkt 8) |
| OPEN-S4 | What a USC accepts as the "dokument stwierdzający, że zgodnie z właściwym prawem może zawrzeć małżeństwo"; the MSWiA circular of 28.02.2025 named on the RPO page is not collected; the court exemption's fee and time. (The court itself is now sourced: KPC art. 562 with 508 § 1.) |
| OPEN-S5 | **Closed by the check:** the regulation Dz.U. 2015 poz. 180 § 2 sets 1 000 zł, with no amendments (`other-acts-civil-status-extract.txt`) |
| OPEN-S6 | Legalisation or an apostille of foreign documents for a USC (not in PASC); the stamp duty act lists an apostille issued in Poland (60 zł), which is the other direction |
| OPEN-S7 | The newborn's legal stay and the deadline for the child's own permit (FA art. 160 pkt 2): not found in the articles read. A residence question |
| OPEN-S8 | Moving a body abroad. Not collected. (Who may bury and so report a death is now sourced: cemeteries act art. 10 ust. 1, 3; PASC art. 93 ust. 4.) |
| OPEN-S9 | Whether offices (USC, the PESEL desk, the voivode) ask foreigners for transcription in practice |
| OPEN-S10 | The legal basis for "only through e-Doręczenia" (a likely one: the e-delivery act art. 147 ust. 2, ePUAP equivalence until 31.12.2025) for the online birth report since 1.01.2026; and whether the paper copy and PESEL notice can still be collected in person after an online report (the mObywatel news says they can) |
| OPEN-S11 | How the 21-day, 3-day and one-month periods are counted (PASC art. 55, 93; KRO art. 4), and what happens on a day the office is closed. PASC art. 12 points to the code of administrative procedure for what it does not regulate; KPA art. 57 is in the check's downloads, but whether it applies to these periods is not settled here |
| OPEN-S12 | Whether UEL art. 29 (the USC registers the newborn's residence) applies when only one parent is a Polish citizen living in Poland ("dzieci osób, o których mowa w art. 7 ust. 1 pkt 1") |
| OPEN-S13 | Who sends the birth card after a birth at home without a healthcare provider: the act names the provider (PASC art. 53 ust. 1); gov.pl names "osoba, która odebrała poród" (found by the check, 17.10.2026) |
| OPEN-S14 | Whether a Polish citizen born abroad, with no earlier Polish record, must transcribe the foreign birth record to get an ID or a PESEL: PASC art. 104 ust. 5 does not cover them, and the check found no such rule in the identity cards act or UEL (found by the check, 17.10.2026) |
