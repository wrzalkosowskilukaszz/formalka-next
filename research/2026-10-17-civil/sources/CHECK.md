# Independent check: civil status, 17.10.2026

**What:** a check of every FACT in `README.md` (this folder), the extract and page headers, and the map `docs/formalka-next/maps/civil-status.md` as committed in 5326734, against the law in force on 17.10.2026 and the official pages.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run at the owner's request ("Pamiętaj by zlecać sprawdzanie informacje zgodnie ze stanem faktycznym urzędowym"; "Tak", 17.10.2026, to running it on the earlier maps). It is read-only: it downloaded every text itself, ran the lessons slice and the source tools, and changed nothing in the repository. It also scanned every statute in Dz.U. 2026 (149) and in Dz.U. 2025 after 15.07.2025 (152) for amendments the API might not link: none changes a cited article beyond what the lab named (FA art. 202 from 27.04.2026).

**Limits:** it is a second reading by the same kind of tool, not an expert's review. The corrections below were changed in the lab; not independently verified.

## Result in brief

- **One WRONG:** scenario CS23. PASC art. 104 ust. 5 makes transcription mandatory only for a citizen who "posiada akt stanu cywilnego potwierdzający zdarzenia wcześniejsze sporządzony na terytorium Rzeczypospolitej Polskiej"; a citizen born abroad has none. The scenario now uses a citizen born in Poland who married abroad; the born-abroad case is OPEN-S14.
- **No OUTDATED.** About 27 PARTLY: a missing condition or exception, or an imprecise basis.
- **The hashes match** for the six consolidated acts and the four gov.pl pages; every body line of the six extracts is in the agent's own `pdftotext` output.
- **Four open questions answered at least in part:** OPEN-S4 (the court for an exemption), S5 (the 1 000 zł fee, now closed), S8 (who reports a death), S10 (a likely e-Doręczenia basis).

## Verdicts and what changed

### Sources README (rows R0–R44; differences D1–D4)

| Ids | Verdict | What the lab changed |
|---|---|---|
| R0, R1, R3–R5, R7, R9–R11, R13–R16, R19–R22, R24–R29, R31, R34–R40, R42, R44; D1–D4 | CONFIRMED (some with an addition) | R24: KPC art. 562 with 508 § 1 cited for the court; R28: the regulation Dz.U. 2015 poz. 180 § 2 (1 000 zł), art. 85 ust. 4–5, the fee due on filing (OS art. 6 ust. 1 pkt 1); R36: UEL art. 38 and the identity cards act art. 50 ust. 1 cited; D1: "living in Poland"; D3: volunteers and the municipality fallback; D4: the e-delivery act art. 147 ust. 2 as a likely basis |
| R2 | PARTLY | "The healthcare provider", electronically, 3 days from drawing up the card; no stillbirth card when the sex cannot be determined; "midwife" attributed to gov.pl |
| R6 | PARTLY | The art. 17 case (a report at the person's place of stay) and the birth card as the record's basis |
| R8 | PARTLY | The gender rule (art. 59 ust. 3–4); the decision has immediate effect; KPA art. 129 § 1–2 for the 14 days and lodging through the USC head |
| R12 | PARTLY | "Children of Polish citizens living in Poland" |
| R17 | PARTLY | The parental-authority condition in art. 202 ust. 3; 1794 art. 12 (old cases, old rules); art. 225c (filing after a system failure) |
| R18 | CONFIRMED | Cited PA art. 106 ust. 2 instead of production's guide; the child's UKR status as a condition of SA art. 42d |
| R23 | PARTLY | Citation corrected (PIL art. 48, 49 ust. 1; art. 3 ust. 1–2); the third case of art. 3 ust. 1 (the content of the national law cannot be established) |
| R30 | PARTLY | Paper or electronic notice; no court application against a refusal based on a court ruling (art. 89 ust. 3) |
| R32 | PARTLY | The 24 hours run from the death |
| R33 | PARTLY | Art. 93 ust. 3–4 and the cemeteries act art. 10 ust. 1, 3 (now collected) |
| R41 | PARTLY | "Or only with serious difficulty"; a civil-status record under the local law |
| R43 | PARTLY | Art. 45 ust. 7 and 49 ust. 7 (not available when the records are not in the register) |
| Inferences I1–I6 | Labels correct | I4: a place to live added, and the cases where no title is needed (a Polish child by birth; legal stay under PA art. 106 ust. 2) |
| OPEN-S1–S12 | Labels correct | S4, S8, S10, S11 updated; S5 closed; S13 and S14 added |

### Extract and page headers

| Id | Verdict | What the lab changed |
|---|---|---|
| E1 PASC, E2 KRO, E3 PIL, E5 FA, E6 OS, P1–P4 | CONFIRMED | KRO now also quotes art. 75 § 1; OS also art. 6 ust. 1–2 |
| E4 UEL | PARTLY | The text already includes 1794 (from 27.04.2026); only 2026 poz. 1206 is later (from 11.01.2027). The conclusion stands. UEL now also quotes art. 18 ust. 1–1a and 38 |

### The map (as in 5326734)

| Ids | Verdict | What the lab changed |
|---|---|---|
| §1 rows on a birth, unmarried parents, PESEL UKR, marriage, no certificate, foreign records, copies, divorce abroad; B2–B5; M0a–M5; D2; F0; CS1–CS4, CS6–CS9, CS11, CS12, CS14–CS20, CS22, CS25 | CONFIRMED | CS6: KPA art. 129; CS12: the child's UKR status; CL17: 1 000 zł as a FACT; CL19: art. 89 ust. 3 |
| §1 stateless or protected | CONFIRMED | When PIL art. 3 leads to Polish law, no capacity document (PASC art. 79 ust. 1 pkt 3) is a FACT, not OPEN |
| Why now: PESEL, health, residence (M1a–c) | PARTLY | "Living in Poland"; "the person obliged to report the child, while it has no PESEL"; the residence-title statement narrowed and labelled (citizenship act art. 14 pkt 1; PA art. 106 ust. 2) |
| §1 death; D1; CS21 | PARTLY | 24 hours from the death; the municipality fallback |
| B0 | PARTLY | KRO art. 75 § 1 (recognition of a conceived child); PIL art. 55 ust. 4 |
| B1 / CL2 | PARTLY | The healthcare provider; the home birth case is OPEN-S13 |
| M0 | PARTLY | The capacity document's issuer is not named in the act; the birth and marriage records only if the other documents do not give the data |
| D0 | PARTLY | The cemeteries act art. 11 ust. 1–2 (who establishes the death) |
| F1 | PARTLY; one detail CANNOT CHECK | "The original" is not in PASC art. 31, 104 or 105: now "the foreign document with a sworn translation" |
| §3 item 4 | No label, no source | "It can take months" labelled HYPOTHESIS |
| CS5 | PARTLY | Art. 59 ust. 2–4 |
| CS10 | PARTLY | A place to live; SA art. 100d (the voivode's decision time suspended until 4.03.2027) |
| CS13 | PARTLY | As M1b |
| **CS23** | **WRONG** | Rewritten; OPEN-S14 |
| CS24 | PARTLY | Art. 49 ust. 7 |
| §5–§7 | PROPOSED, labelled | §5.5: KPA art. 129 |

## What the lab re-read before changing anything

In the agent's downloads (its hashes below match the lab's for every text the folder already had): PASC art. 17, 52, 53, 54, 59, 79, 85 ust. 4–5, 8, 11, 89, 93, 104 ust. 5, 109 ust. 1, 45 ust. 7, 49 ust. 7; KRO art. 75 § 1; PIL art. 3 ust. 1–2, 49, 55 ust. 4; UEL art. 7 ust. 1, 18 ust. 1a, 38; FA art. 202 ust. 3 and art. 225c ust. 1, 1794 art. 12; KPA art. 129 § 1–2; KPC art. 508 § 1, 562; the cemeteries act art. 10 ust. 1, 3, art. 11 ust. 1–2; the e-delivery act art. 147 ust. 2; the citizenship act art. 14; the identity cards act art. 50 ust. 1; the regulation Dz.U. 2015 poz. 180 § 1–2; the stamp duty act art. 6 ust. 1–2; PA art. 106 ust. 2 and SA art. 42d (in `research/2026-10-17-ukr/sources/`). `touched.mjs` was re-run by the lab for the citizenship act, the cemeteries act, the identity cards act, KPC and the e-delivery act; the results are in `other-acts-civil-status-extract.txt`.

## Amendments and acts the files did not mention (from the agent)

- PASC executive regulation Dz.U. 2026 poz. 667 (in force 23.08.2026): new annexes for the marriage copies and the data certificate. No claim depends on it.
- Stamp duty regulation Dz.U. 2026 poz. 1271 (in force 1.10.2026): proof of payment filed within 3 days of the duty arising. Not read by the lab.
- Dz.U. 2015 poz. 180 (now in the extract); FA 1794 art. 12 and art. 225c (now in the README); SA art. 100d (now in CS10).
- No suspension of USC time limits was found in PASC, KPA, SA, the flood act (Dz.U. 2025 poz. 1402) or PA. That covers only the acts searched.

## Hashes (sha256, from the agent's report)

| Text | sha256 |
|---|---|
| DU/2026/393 PASC | a9e5469bd32bc2d89c2c2294dd5001f09455193ead2ed04a8866377424c45d51 (same as the lab's) |
| DU/2026/236 KRO | d3e352a605afa1e54861b5eb5d30c157ec60b79ee4b806aa5f2b58e75e54ca7e (same) |
| DU/2023/503 PIL | ad04a1f2308714530add21325fd157761f616076c106f11920f99195871acfbf (same) |
| DU/2026/384 UEL | 16ad0c30f3a26aa1e91f4e2b46e3a71146bbf2da755af030c58cd67dec39abfb (same) |
| DU/2025/1079 FA | 2d3492f82ae1a1ab936667bf4fac1a8544adf4d166db0d6904145bc6d74ad4e0 (same) |
| DU/2025/1154 OS | fedc2319bca74759d01fde3546137eda57263d5f9a63b36b59da781fc53fb2ac (same) |
| DU/2025/1794 | dd0580964c31c5d14805b0560aa3346d7ca5b57b1b56d3574861a2f3cd96be11 (same) |
| MP/2026/370 | f4b7223353479968b7083516cf62ad9414e4c032803b6cb56d9400193448b85e |
| DU/2026/203 | 98b590c659b96b72c36f35e58532512e352dd5618f5351940a64f32173655275 |
| DU/2024/1688 | 89854d19054d51aaec4b426a7b8b3bbc037b745663b9056a109fcccfffbe4871 |
| DU/2025/1006 | 205826343299a62efa0c9ff4a3afadc5e64726c242379e068f2ed60eab73bdef |
| DU/2025/897 | a28bc48b5589386efc89e523ac44d8f19ec17379e861d918b61b1388db9f85f2 |
| DU/2025/1847 | 76951576e9ecd4798a5c06655f342c304ffead1cfbe4433c053987b20c977e2a |
| DU/2025/1795 | fd0bf249ab8309e7574dcb659e89e8f130263b49af43edb192b2062a8ed23e55 |
| DU/2026/912 | 0f00278fd6cedc198fdf46304c9b823ae8db28be34bbc087d40a5cbbdf4f3353 |
| DU/2026/846 | 7bfabbeca53808bca583e8027b8b1e9c3c7e28c24f83fec18977ff51417b24e2 |
| DU/2026/875 | 4fd1512a8df1c2334dc4a15040892eb724fe640a844ff1cead27e8a53c6fdf8e |
| DU/2026/1206 | 9b1cefbd26b7fdf95542dd9287e2bbb51c08df9c432450ed58e2853b2937c655 |
| DU/2026/1271 | 86ba6e18c2cbebcdc00a8f5377909d6eff8eb77511c7c7c13284751d944aad82 |
| DU/2026/1241 (informatization act) | d57ff9c488b88b26a9b2841bf6f71ca684848a845c7c82bb1ae4512ea232f54d |
| DU/2026/3 (e-delivery act) | 47f3509d15ca7b371f2a84824922bbd573803b769b3093992250f5efcff458c1 |
| DU/2026/1293 SA | 49648f140730f652a3dc37d480e5c72096f9f540ff75ae8e41c20679b66f4177 |
| DU/2026/862 PA | e9f82bc0e10ff1555b941f741667ee5a97fc0b5a7fe2320f4bf785e475c70701 |
| DU/2025/1461 HA | 6b1219883e69636dd4c7c7d1a864297af574db11c9a1ea1adc58f6b330b652d3 |
| DU/2026/791 | 5a563e9d53c94bcec5f7c95be37636c2c59fa2eabdbb693fd138677e4b9519e5 |
| DU/2025/1691 KPA | 152f0830dee854451929d1482ecb83e9d053bc7b339973f78cfe0ea98fca348b |
| DU/2026/468 KPC | 97db38e9635dc6db23e46aa618a52fc7089790b6592858ddc5f5e521d6692003 |
| DU/2025/1590 (cemeteries act) | b92aa0944ec89c25f6da15ee473833148c218dcdede2936b6f7450d0caeec2ed |
| DU/2025/1611 (citizenship act) | 3bbfd467879b5628e0a3301c76c1f0e09c19a757d207ce4c151cd24c060a3d61 |
| DU/2025/1753 (identity cards act) | b53fa36033ad18ef7363eb178f34d78a1e929c67a0bf826b149ccd19980972fa |
| DU/2025/1402 (flood act) | 0ed224de988b8c9559b8028ea9ef170d8fd9502e4c86c9000b6ee31ea0b99df4 |
| DU/2015/180 | 738d071f31ef2e532ae2efb6b08d13ad3fe16f4fa1a0e329da70d307f94366df |
| DU/2023/2733 | abd40f53a7045c8f2e9aad1c88f81ea81eec2a43ff55cdcfcbcff8b7c7e9d6e8 |
| DU/2026/667 | c2986801b2313025636e07b52e04375a426964116082c4ee552340b3dd3a6a81 |
| gov.pl zglos-urodzenie-dziecka | 58497033879a6acaa996ddab2bad34800f4b274ade716b7c576e1efd58a35ebc (same) |
| gov.pl mObywatel news | 43cc9f2279605ca90953ad1692b22a9d90823974c58936ae1d86af67fb1ad704 (same) |
| gov.pl wez-slub-cywilny | 2394d69245deecb2dd3f3535b73b86a89e079a1e247b57ae0c8671dac5239038 (same) |
| gov.pl zglos-zgon | 61bf76dc1bcc3b8d18e554654ee43b2493735d4fe05978edf536442ec6a8265d (same) |
| RPO page | not downloadable (an Incapsula block page); read through a fetch tool, as before |

## How the dates were counted (the agent)

The cut-off of each consolidated text from its own announcement, including the acts it says it contains; `touched.mjs` from that cut-off; for each change touching a cited article, the date of that point from the amending act's own entry-into-force article; where a point waits for an announcement, the announcement itself (M.P. 2026 poz. 370: 27.04.2026 for FA art. 202–203i and for UEL art. 8, 10, 23i, 23j and 43). No period was computed.
