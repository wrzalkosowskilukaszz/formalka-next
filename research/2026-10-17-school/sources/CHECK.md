# Independent check: school and preschool for a child from abroad, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed in c25bd5e:
- the map `docs/formalka-next/maps/school.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with the next matters. It is read-only.
- It downloaded every text itself from api.sejm.gov.pl and every page.
- Every hash the lab gives matches its download, and every quoted line of the extracts appears in its own conversion.
- It also read the system of education act, the regulation of 21.03.2022 on Ukrainian pupils and its amendments, the regulation on the organisation of schools, the recruitment regulation, the act on financing educational tasks and the civil code. It found the Minister of Education's letter of 29.06.2026 on the Opole superintendent's page.

**Then:** each provision behind a correction was re-read here from our own downloads, with the same hashes:
- Prawo oświatowe art. 31 ust. 8–11, 33, 39, 40 ust. 2, 130 ust. 3, 150 ust. 7, 154 ust. 1, 165 ust. 13, 166;
- the regulation § 2 pkt 3, § 5, § 6 pkt 3, § 11, § 12;
- the system of education act art. 44q, 44zw, 44zx, 44zz, 44zzr;
- Dz.U. 2026 poz. 203 art. 47–49 and poz. 504 art. 6;
- the 2022 regulation's § 11ab, § 11ac and § 15 with Dz.U. 2024 poz. 1302, 2025 poz. 1195 and 2026 poz. 245;
- the special act art. 50, 51, 54, 55, 55b;
- the Minister's letter;
- the act on financing educational tasks art. 52 and the civil code art. 25–26.

The new text is in the extracts and in `other-acts-school-extract.txt`. Every line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not an education lawyer's review.
- One amendment of the 2022 regulation (Dz.U. 2025 poz. 1324) was not read here; it does not bear on any rule in force.
- The indexed preschool fee and the nurseries were not checked.

**The app:** the prototype has no school case, so none of the findings is in what it shows.

## Result in brief

- **An exception to admission by law.** Where admitting pupils who need Polish lessons requires organisational changes, the local government may name another school; the district school's admission by law then does not apply (Prawo oświatowe art. 166 ust. 3; the regulation § 5). Every statement of "the district school admits by law" now carries it.
- **The written duty to name a preschool place is narrower.** It covers children reported in the recruitment, before the supplementary round (art. 31 ust. 10). For a child who arrives later, only the municipality's general task remains (ust. 8–9). The map had applied it to a late arrival (SL4, SS3, SS14).
- **Who sets the dates:** the running body for preschools and grade I; the education superintendent for upper-secondary, adult primary and post-secondary schools (art. 154 ust. 1). The map had said "each municipality".
- **Not all special rules ended on 31.08.2026:**
  - the special act's art. 55 ust. 2–5 and 55b ust. 1a–4 carry no date;
  - extra locations created under art. 51 run to the end of their resolution's period (203 art. 47);
  - the regulation of 21.03.2022 on Ukrainian pupils kept force only to 31.08.2026 (203 art. 49 ust. 2).
- **The "4 hours" on MEN's 2024 page** came from that regulation (§ 11ab, 2024/2025 only; then 2 hours under § 11ac), not from the special act.
- **OPEN-S1 closed** by the Minister's letter of 29.06.2026: from 1.09.2026 Ukrainian pupils are in the general system; at least 2 hours of Polish, for at most 24 months.
- **Finishing primary school:**
  - the exam has exemptions (some disabilities, olympiad laureates, a director's exemption in special cases);
  - the special classification rule covers non-citizens only;
  - the accommodations for limited Polish are now quoted.
- **Smaller corrections:**
  - the 30 September notice is for the school duty and the preschool year (art. 33, 40);
  - the transport refund needs the district school and parents who take the child;
  - districts are set by locality and street, older ones remain (504 art. 6), and some schools have none;
  - the head needs the running body's consent where admission costs extra (art. 130 ust. 3);
  - REG § 11 does not cover grade I;
  - the interview is held in the child's language when the child does not know Polish;
  - the statement of years of schooling only complements a school document;
  - recognition is needed for second-stage vocational and post-secondary schools;
  - the reasons for a refusal under the regulation are due in 5 days;
  - the running body organises the Polish lessons.

## Verdicts and what changed

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| Preschool ages; the right at 3–5; the preschool year; free hours; compulsory education; an earlier start; a deferral; education outside school; the parents' duties; who checks; 50 % absence; the way to preschool | CONFIRMED | — |
| No place | PARTLY | Children reported in the recruitment; art. 31 ust. 8–9 for others |
| School abroad: the 30 September notice | PARTLY | Art. 33 ust. 1 pkt 3, 40 ust. 2 |
| The way to school | PARTLY | The district school; parents who take the child; the carer to age 7 |
| The district school | PARTLY | Localities; 504 art. 6; art. 39 ust. 5d |
| On what terms; when status matters; B1; preschool admission; upper-secondary; the documents; refusal under REG; the application; the notification; the recruitment refusal; extra Polish; assistants; the preparatory class; the language of origin | CONFIRMED | — |
| Grade I; grades II–VIII | CONFIRMED, with an exception | Art. 166 ust. 3; REG § 5 |
| Recruitment | PARTLY | Art. 130 ust. 3; art. 166 ust. 3 |
| Dates | CONFIRMED (for preschools and grade I) | The superintendent for the other schools |
| Another school | PARTLY | Its conditions, the superintendent's place, ust. 3 |
| Finishing primary school | PARTLY | The exemptions; non-citizens only; the accommodations added |
| Most special rules ended | PARTLY | The undated paragraphs; 203 art. 47–49 |
| Art. 54 | PARTLY | "From 24.02.2022", legal stay, the exception |
| 36 months | CONFIRMED (the text) | "zgodnie z ust. 1" quoted |
| Removal; the intercultural assistant | CONFIRMED | — |
| MEN page "outdated on two points" | WRONG (inside the file) | "Several points" |
| Page vs act: Ukrainian pupils | PARTLY | The 2022 regulation named; the online exception and art. 58b |
| Inferences | Supported | The Ukrainian one completed; the online one tied to OPEN-S7 |
| OPEN-S1 | Answered | Closed |
| OPEN-S2, S3, S4, S6, S7 | Narrowed or partly answered | Rewritten |

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Foreigners on Polish terms | CONFIRMED | — |
| "Status matters only for adult and post-secondary schools" | PARTLY | The full list of art. 165 ust. 3, 5 |
| The district school admits by law | PARTLY | Art. 166 ust. 3; REG § 11 from grade II |
| Each municipality sets the dates | PARTLY | Art. 154 ust. 1 pkt 1–2; "a late arrival meets places already filled" labelled INFERENCE |
| Special rules ended; art. 55c | PARTLY | The regulation; the letter; art. 55c's words |
| 800+ | PARTLY | Dz.U. 2026 poz. 508 art. 1 ust. 2d, 23 ust. 3a; lit. c–f |
| The ages; Polish citizens; S4, SL5–SL7; critical moment 5; SS4, SS5, SS9, SS10, SS15 | CONFIRMED | — |
| The online school | PARTLY, presented as FACT | INFERENCE; art. 33 |
| SL2 | PARTLY | Localities; 504 art. 6 |
| SL3 | PARTLY | REG § 6 pkt 3–4 |
| SL4, SS3 | WRONG for that case | Rewritten |
| S6, SL10, SS13 | PARTLY | The exemptions; the accommodations |
| Critical moment 3 | PARTLY | 5 days for the reasons |
| SS2 | PARTLY | REG § 2 pkt 3 lit. b; § 12 |
| SS6 | PARTLY | Art. 166 |
| SS14 | PARTLY | Parents who take the child; reported in the recruitment |
| SS16 | PARTLY | "Is held", not "may be" |
| Intake question 6 | PARTLY | The act's words |
| Handoffs | PARTLY | The running body; the superintendent after the local government |
| Change monitoring | CONFIRMED | 1123 art. 19 pkt 1 added |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| `prawo-oswiatowe-2026-820-extract.txt`: legal state, hashes, the SO date | CONFIRMED | — |
| The same: later amendments | PARTLY | 1123 art. 19 pkt 1 (art. 13, from 1.01.2028) |
| `rozporzadzenie-cudzoziemcy-2023-2301-2026-1139-extract.txt` | CONFIRMED | § 5 and § 6 pkt 3 lit. a added |
| `specustawa-2026-1293-edukacja-extract.txt`: legal state, no amendments | CONFIRMED | — |
| The same: the dated and repealed articles | PARTLY | Rewritten (art. 50 ust. 4, 5c; 58a–64b) |
| The MEN pages | CONFIRMED / PARTLY | The 2024 page's header names the regulation |

## Acts the files did not use, now quoted

- In `prawo-oswiatowe-2026-820-extract.txt`: art. 33 ust. 1–2, 39 ust. 5b–5d, 40 ust. 2, 150 ust. 7, 154 ust. 1 pkt 2; Dz.U. 2026 poz. 504 art. 6.
- In `rozporzadzenie-cudzoziemcy-2023-2301-2026-1139-extract.txt`: § 5 and § 6 pkt 3 lit. a.
- In `other-acts-school-extract.txt`:
  - the system of education act art. 44q ust. 1 and 3, 44zw, 44zx ust. 1, 44zz ust. 2, 44zzr ust. 6–9;
  - Dz.U. 2026 poz. 203 art. 47–49;
  - the 2022 regulation's § 11ab, § 15 (Dz.U. 2024 poz. 1302), § 11ac (Dz.U. 2025 poz. 1195), and Dz.U. 2026 poz. 245;
  - the act on financing educational tasks art. 52 ust. 1–4;
  - the civil code art. 25–26 § 1.
- New page file: `kuratorium-opole-list-men-2026-07-06.txt`.

Named by the agent but not used here:
- the regulation on the organisation of public schools (Dz.U. 2023 poz. 2736) § 5, on class sizes when a district pupil is admitted during the year;
- the recruitment regulation (Dz.U. 2025 poz. 464, amended by Dz.U. 2026 poz. 1008);
- the 2022 regulation's amendment Dz.U. 2025 poz. 1324.

## The tools

The agent noted two tool gaps. Both changed in the lab, with tests (`tools/sources/*.test.mjs`, 14/14):
- `touched.mjs` called the API's date "its general date", but for Dz.U. 2026 poz. 982 it is the date of the point that changes the act;
- `entry-dates.mjs` did not find a regulation's "§ 2. Rozporządzenie wchodzi w życie".
