# Independent check: vehicles and the driving licence, 17.10.2026

**What:** a check of every FACT in `README.md` (this folder), the extract headers, and the map `docs/formalka-next/maps/vehicles-licence.md` as committed in d41b626, against the law in force on 17.10.2026 and the official pages.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run at the owner's request ("Pamiętaj by zlecać sprawdzanie informacje zgodnie ze stanem faktycznym urzędowym"). It is read-only: it downloaded every text itself from api.sejm.gov.pl and gov.pl, ran the lessons slice and the source tools, and changed nothing in the repository. Its full report is summarised below; its working files stayed in its own temporary folder and are not kept.

**Limits:** it is a second reading by the same kind of tool, not an expert's review. A lawyer or a starosta's office has not seen any of this. The corrections below were changed in the lab; not independently verified.

## How the dates were counted

"Po upływie N dni od dnia ogłoszenia": the day of publication is excluded, day 1 is the next day, and the provision takes effect the day after day N. "N miesięcy": the period ends on the same calendar day N months later, and the provision takes effect the next day. Every general date the agent computed matched the API's `entryIntoForce` field (a cross-check, not a source).

| Act | Published | Dates |
|---|---|---|
| Dz.U. 2025 poz. 1734 (PRD) | 9.12.2025 | 24.12.2025 (pkt 5, 17 and others); 10.06.2026 (the general date: pkt 2 lit. a, pkt 4 lit. a, lit. b as to ust. 1aa, pkt 7 lit. a, b, d, e, f); 18.01.2027 (online registration, art. 72 ust. 3b, 72a, 74 ust. 2da) |
| Dz.U. 2025 poz. 1676 (AVD) | 2.12.2025 | 17.12.2025 (art. 4 pkt 8: art. 14); 3.03.2026 (the general date: art. 4 pkt 7 lit. c, pkt 20); 3.09.2026 (art. 4 pkt 7 lit. a, b: art. 11 ust. 1 pkt 5, 1a, 1b) |
| Dz.U. 2026 poz. 1162 (LDR) | 2.09.2026 | 3.09.2026; § 1 pkt 8 on 4.09.2026; § 1 pkt 5 (§ 15 ust. 12) on 1.01.2027 |
| Dz.U. 2026 poz. 891 (RR) | 3.07.2026 | 4.07.2026 (the day after publication); § 1 pkt 9 a month later |
| Dz.U. 2025 poz. 953 (licence fees) | 17.07.2025 | 1.08.2025 |

## Verdicts and what changed

### Sources README, "What they say"

| # | Claim | Verdict | What the lab changed |
|---|---|---|---|
| R1 | Who registers | CONFIRMED | — |
| R2 | 30 days; an inheritance 60 days | PARTLY | "Buying" became "acquiring (nabycie)"; new rows for art. 73aa ust. 2a (a vehicle withdrawn from traffic), ust. 3 (dealers, 90 days), ust. 7 (no duty when sold on before the term ends), ust. 5a, 6, 6a |
| R3 | Penalties | CONFIRMED, with additions | Added art. 140mb ust. 3, 4, 7 and a row on art. 140n ust. 5, 6, 7 with KPA art. 189d–189f |
| R4 | Documents | CONFIRMED | — (the optional additions were not made) |
| R5 | No inspection certificate when the result is in the central register (10.06.2026) | CONFIRMED | — |
| R6 | Temporary registration | PARTLY | Added art. 74 ust. 2b, 2f and the plates' return office (ust. 5); a new row for ust. 2d and 2g (no temporary registration when the number is kept, a permit on request), with RR § 18 ust. 3 |
| R7 | Without residence (10.06.2026) | CONFIRMED | Added ust. 1a (a trip from the place of purchase) |
| R8 | Keeping the plates "since 10.06.2026" | PARTLY | Reworded: keeping the number existed before; new since 10.06.2026 are the statement and the end of re-legalising the old plates |
| R9 | Online registration from 18.01.2027 | CONFIRMED, with an addition | A new row: electronic applications through an e-Doręczenia address since 4.07.2026 (RR § 20 as given by 891) |
| R10 | Translations | CONFIRMED | Cited RR § 5 and its exceptions |
| R11 | Fees | CONFIRMED | — |
| R12 | Insurance (GOV) | CONFIRMED (the page) | — |
| R13 | Refusal, SKO | CONFIRMED | Cited PRD art. 73 ust. 1e |
| R14 | A sale | CONFIRMED | — |
| R15 | Changed data | CONFIRMED | — |
| R16 | Valid foreign licences | CONFIRMED, with an addition | A new row for AVD art. 4 ust. 3 (not recognised when retained or withdrawn) |
| R17 | Six months | CONFIRMED, with a note | "Pojazdem silnikowym": a moped is not covered (AVD art. 2 pkt 1; PRD art. 2 pkt 32, both now in the extracts) |
| R18 | International licence | CONFIRMED | Made explicit that art. 5 ust. 3 concerns the Polish international licence; the foreign one is OPEN-V12 |
| R19 | Exchange (17.12.2025) | PARTLY | "Model and scope of data"; a new row for an expired licence (art. 14 ust. 1a, 2a: the residence condition and the documents to extend validity) |
| R20 | Residence condition | CONFIRMED, with additions | The statement existed before 3.09.2026; the exam-day timing applies only to AM, A1, A2, A, B1, B, B+E and T |
| R21 | Confirming the data | PARTLY | Added the issuing state's portal (§ 14 ust. 8) and a new row for § 14 ust. 12 (who needs no confirmation; temporary protection is not listed) |
| R22 | Documents for an exchange | CONFIRMED, with an addition | A new row for LDR § 14 ust. 4 (the statement; a foreigner's right-of-stay document or study certificate) |
| R23 | Refusal (art. 14 ust. 2e) | CONFIRMED | — |
| R24 | Fee 100 zł | CONFIRMED | — |
| R25 | GOV's list for a foreigner | CONFIRMED (the page), with a note | A new row in "Where the pages and the acts differ": the regulation names right-of-stay documents, not an address registration |

### Sources README, "Where the pages and the acts differ"

| # | Point | Verdict | What the lab changed |
|---|---|---|---|
| D1 | The registration page's 60-day note | CONFIRMED | Cited the basis for calling it stale: the COVID act art. 31ia (consolidated 2025 poz. 764) and Dz.U. 2023 poz. 1118 § 1; noted that the old extension also covered the sale notice. New extract `covid-2025-764-art31ia-2023-1118-extract.txt` |
| D2 | "The regulation still names both conventions" | PARTLY and OUTDATED | Corrected: since 3.09.2026 § 5 ust. 6 names only the 1968 convention; § 14 ust. 1 pkt 5 and 7 still name both |
| D3 | The licence page's 2016 basis | CONFIRMED | — |
| D4 | The certificate page's fees | CONFIRMED | — |
| D5 | The sale page's basis | CONFIRMED | — |
| D6 | "kartę pobytu" at the sale notice | CONFIRMED for PRD | Noted RR § 15 ust. 1 (read by the agent only); OPEN-V9 kept |

### Extract headers

| Extract | Verdict | What the lab changed |
|---|---|---|
| prd-2024-1251 | CONFIRMED | Noted 1734's changes to art. 71 ust. 4 and the new art. 72a; added art. 2 pkt 32 and art. 140n |
| amendment-2025-1734 | CONFIRMED | — |
| kierujacy-2025-1226 | CONFIRMED | Re-ran `touched.mjs` with art. 2 and 91; corrected the file name it points to; added art. 2 pkt 1 |
| amendment-2025-1676 | CONFIRMED | Added art. 4 pkt 20 (art. 91 ust. 1–4, the probation period, 3.03.2026) |
| fees | CONFIRMED | — |
| licence-documents-2025-1073 | **WRONG** | The header said 1162 changed "§ 5 (the residence statement)" and "§ 14 ust. 12 (the exchange code)" and not the quoted parts. In fact 1162 changes § 5 ust. 6 itself ("lit. a i b" becomes "lit. b") and § 14 ust. 4; the exchange code is § 15 ust. 12 (1.01.2027); § 14 ust. 12 is the exemptions list. The header was rewritten; § 14 ust. 4 and 12 and the 1162 points were added |

### The map (as in d41b626)

| Row | Verdict | What the lab changed |
|---|---|---|
| Intro: 30 days, penalties, sale | CONFIRMED | Added that the office cannot waive the penalty with a warning |
| Intro: "a licence from outside the EU valid 6 months" | PARTLY | "A convention licence from outside the EU, EEA and Switzerland … a motor vehicle" |
| Intro: "in practice an address registration" | An INFERENCE without its label | Labelled INFERENCE (OPEN-V1) |
| Content rule on the 30 days | CONFIRMED | Added the COVID basis |
| Sources: LDR | OUTDATED | "With Dz.U. 2026 poz. 1162"; RR and KPA added |
| §1 rows on buying, importing, selling, moving, inheriting, no residence, a non-convention licence | CONFIRMED | Added art. 73aa ust. 7; the documents for an EU car; "or pickup" |
| §1 an EU licence | PARTLY | "Valid while the licence is valid" (art. 5 ust. 6) with art. 4 ust. 3; the exchange of an expired one needs residence |
| §1 a licence from outside the EU | PARTLY | Which convention licences; mopeds; treaty licences (art. 5a) |
| §1 an international licence | PARTLY | The basis corrected; OPEN-V12 |
| §2.1 V2, VL3–VL8, V4 | CONFIRMED | V2: e-Doręczenia; V4: within 30 days of filing |
| §2.1 V3 | PARTLY | Not every registration gets a temporary permit (art. 74 ust. 2d, 2g) |
| §2.2 L1–L4, LL3, LL6, LL7 | CONFIRMED | L1: LDR § 14 ust. 4; LL3 reworded; L3: § 14 ust. 12; L4: the probation period |
| §2.2 LL4 | PARTLY | The statement existed before; new is the condition's deadline |
| VS1, VS4–VS7, VS9–VS11, VS13, VS17, VS18 | CONFIRMED | VS4: no waiver; VS9: "or pickup" |
| VS2 | PARTLY | Added the previous certificate and the conformity document |
| VS3 | PARTLY | Added the inspection certificate; the "Never" made consistent with art. 74 ust. 2a |
| VS8 | PARTLY | Residence labelled INFERENCE |
| VS12 | CONFIRMED | Added § 14 ust. 12, and that temporary protection is not in it |
| VS14 | CONFIRMED | Added art. 4 ust. 3 and art. 5 ust. 6 |
| VS15 | PARTLY | OPEN-V12 |
| VS16 | CONFIRMED | Cites § 14 ust. 8–10 |
| §5.1 licence question 2 ("wiedeńskiej lub genewskiej") | PARTLY / WRONG | Split into "national or international" and "on the 1968 model"; questions on the residence document and the protection statuses added |
| §5.4 handoffs | CONFIRMED | Added the e-Doręczenia address |
| §5.5 node H | PARTLY | Made conditional on keeping the number |
| §6 "PRD changed twice in 2025" | WRONG | Corrected: 820, 1006, 1676, 1734, 1843, 1872 in 2025; 180, 875, 1073 in 2026 |
| §7 | — | Points to this file |

A new scenario VS21 (subsidiary protection, no data confirmation) and new OPEN items V11 (which states count as having an armed conflict) and V12 (a foreign international licence) came out of the check.

## What the lab re-read before changing anything

Each correction above was made only after the lab read the official words itself, from its own downloads (hashes below):
- PRD art. 2 pkt 32, 73 ust. 1a, 73aa (all of it), 74 ust. 1a, 2–5, 140mb, 140n; 1734 pkt 4, 5, 7.
- AVD art. 2 pkt 1, 4, 5, 5a, 11 ust. 1, 14 ust. 1–2f; 1676 art. 4 pkt 7, 8, 20 and art. 22.
- LDR § 14 ust. 4, 8–12; 1162 § 1 pkt 1, 4, 5, 6 and § 3.
- RR § 5, § 18 ust. 2–6, § 20–23; 891 § 1 pkt 4, 6, 7, 8 and § 2; 939 (it touches only § 27, 31, 32).
- The COVID act art. 31ia (with `touched.mjs` on its five later amendments: none touches it); Dz.U. 2023 poz. 1118 § 1–2; a title search of Dz.U. 2024–2026 found no later declaration of an epidemic threat (not exhaustive).
- KPA art. 189d–189f (no later amendments).
- `amendments.mjs` on PRD (ten acts since 21.06.2024) and RR (two); `touched.mjs` on AVD with art. 2, 4, 5, 11, 14, 91 (only 1676 touches them).

The new extracts are `registration-2024-1709-par5-18-20-23-extract.txt`, `covid-2025-764-art31ia-2023-1118-extract.txt` and `kpa-2025-1691-art189d-189f-extract.txt`.

**Why the extract header was wrong, and the change that follows.** `tools/sources/touched.mjs` read only acts and threw "not an act title" for a regulation, so 1162 was read by hand and only for the points expected. The tool now also reads regulations and lists the paragraphs (§) each amending paragraph changes, with two tests that fail on the old version; on the live texts it lists 1162's changes to § 5, 6, 13, 14, 15, 16, 21, 23, 27, 30, 37 and an annex, and 891's to § 18, 20, 21, 22 among others. The lesson `docs/solutions/2026-10-17-amendments-checked-only-for-expected-articles.md` records it. Changed in the lab; not independently verified.

## Amendments and acts the files did not mention (from the agent)

- **PRD:** 2024/834 (art. 20; 1.07.2024); 2025/820 and 1006 (art. 80c, 100ah); 2025/1872 (art. 60, 65j, 65ja, 135, 135a; 29.01.2026); 2025/1676 art. 1 (art. 6, 20, 32, 33, 33d, 53, 53a, 100aa, 100ac, 129, 129ja, 135, 135a, 137, 140d, 148a); 2026/180 (art. 2 pkt 37, 6, 53, 66; 18.05.2026); 2025/1843 (art. 140mc; its art. 3 changes the compulsory insurance act, relevant to OPEN-V4); 2026/875 (art. 53; 1.01.2027); 2026/1073 (art. 80b, 80ba; 11.05.2027). None changes a cited rule.
- **Announcements:** Dz.U. 2025 poz. 1313 (art. 73 ust. 3 certificates; 1.10.2025 and 1.02.2026) and 2026 poz. 743 (driver-record data; 4.09.2026). Neither touches a cited rule. Not read by the lab.
- **AVD:** 2026/180 (art. 5b, 10a, 50, 100, 109, 109a, 110), 2025/1872 art. 6 (art. 102; the agent counts 30.03.2026 where the API gives 30.06.2026 for AVD, not cited here), 2026/982 (art. 26–104a; 6.08.2026), 2026/187 (art. 87–88; 2028). None touches art. 2, 4, 5, 11, 14 or 91.
- **Within 1676:** art. 4 pkt 20 (now in the extract) and the transitional art. 11–12 (not read by the lab).

## Not checked

- GOV's statement on UK licences issued until 31.12.2020 (the files make no claim about it).
- The 14-day appeal to the SKO rests on GOV only; the KPA's appeal article was not read.
- No gov.pl page was found for VS9 and VS10; unknown gov.pl URLs return a soft 404.
- RR § 15 ust. 1 and the forms in RR's annexes were read by the agent only, not in full.

## Hashes (sha256)

The agent's hashes match the lab's recorded ones for 1251, 1226, 1676, 1734, 553, 953, 1073, 1162 and the four gov.pl pages. The lab's own downloads of 1709, 891, 939, 764, 1118 and 180 match the agent's. KPA 2025/1691 was downloaded by the lab only.

| Text | sha256 |
|---|---|
| DU/2024/1251 | de6c1f33e4c8cc9079f6307ea5c559d07013539a9985e6f8d63a792d2371fccb |
| DU/2025/1226 | 0f639b9ec403518fc6052d0ce29181cda37e0e715b35fedc74a82ee61175b29b |
| DU/2025/1734 | 5bbb4ab4f33fed20668c6a2a67b20fefc6b7b2b50967dfeb7001ecc17a27d9c9 |
| DU/2025/1676 | 2fe188c01ce4018fde03bb6e5b679064eeca41d3a84c490248387205d9c19e19 |
| DU/2025/553 | 7436d6643bf9a6b6e9067d6b451c1848f7db8ea061bb405b068b44b5a5d7674d |
| DU/2025/953 | 9af7275443bada7a6dcc830010d235cb7620d8f625628341bd45cbc7c7e929a8 |
| DU/2025/1073 | 03908567db837161ed0971e4d3ebd395ebc0b52c730a444a09ae0257e2773085 |
| DU/2026/1162 | 50ca12a5c533e8bb90187cedd20e5cad4ebce54d19afcac2cb7c6fb7719c8401 |
| DU/2025/1843 | c6a64517867a18fb546b9f99913fa74bbff5c731e6cb98d84ced97ad8065d7bb |
| DU/2025/1872 | 97d2a9e8993d414d84c1e8a8d59ba0780a4f975e9aaf39497a41b6f35dae7a62 |
| DU/2026/180 | 85e288c5d4f74b2df58d851fe6627cf9beed76439e4c5a32838242d6b9872a25 |
| DU/2026/875 | 4fd1512a8df1c2334dc4a15040892eb724fe640a844ff1cead27e8a53c6fdf8e |
| DU/2026/1073 | 9ac35f7fa7c2d6e6157c0ec2e43ea0b53cfa706566252eacff3cd6b4eb33e156 |
| DU/2025/820 | 9ac1bb198851d86c52b856b5596d00a87d227abf6cf26b9e3845262e772b5a92 |
| DU/2025/1006 | 205826343299a62efa0c9ff4a3afadc5e64726c242379e068f2ed60eab73bdef |
| DU/2024/834 | f41734f3bf511e7809795f261896f53755ad1fa70957dcce3ea1da16c02701d7 |
| DU/2023/1394 | 0cac11a1cd4fa22cecc35f2b5eff2e9ca71c8a2805c178279345cb4d7a903251 |
| DU/2025/1313 | a9870831f548423cad72db4868a0817e3bc111d41a9d45785d473cff74d1e01a |
| DU/2026/743 | 694ec40394f47cd811dff9e1c40d1e1d53af79ae4310854f279e115cdcd4f33e |
| DU/2024/1709 | 2e2d5abc4f2a4c17fc87899affc571c7bbebf6451fd38e52aa80af9902c6abf6 |
| DU/2025/939 | e481196f57c9867618c32be1a5d4679a98ef3ba9691474e4cdd878a8618e5582 |
| DU/2026/891 | 5c1e2576203acc972fae27afbf1b10725852bde4f1a2f29a87ff5450d0aad787 |
| DU/2025/764 | f4343ac06e8784603f3e63eb3b3b193e1da31a42a566a657149c75a8989c10d9 |
| DU/2023/1118 | 3c0e07df2d79fcea1a0ef441592e3b4173bea290fc9703d63351cb5ec241b400 |
| DU/2026/1293 | 49648f140730f652a3dc37d480e5c72096f9f540ff75ae8e41c20679b66f4177 |
| DU/2025/1691 (KPA; the lab) | 152f0830dee854451929d1482ecb83e9d053bc7b339973f78cfe0ea98fca348b |
| gov.pl: zarejestruj-pojazd (07.04.2025) | 1c0d52087f0c97de0a33d01654ba7d324401021f4fc191122a114e850d46f803 |
| gov.pl: zglos-zbycie… (14.01.2026) | 4371e3140de23703d5b5f45d69e64bd61b8fe9a7d82af57508930121d92f139f |
| gov.pl: wymien-dowod… (19.01.2022) | 8009f430b78dd6a4034579037a727f0b43465321d6af96e0094ebe6b9941ec7b |
| gov.pl: wymien-zagraniczne-prawo-jazdy… (10.08.2023) | 271d385612ad9936c00c9b6ad649f57ccaab57183ddd51469aa6d46dd5d3475e |
