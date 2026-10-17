# Independent check: e-government access (PESEL, the trusted profile, e-Doręczenia), 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed in 3f4a540 (unchanged in 8d4fbe1):
- the map `docs/formalka-next/maps/e-government-access.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run at the owner's request ("Tak", 17.10.2026, to checking the three maps that had no check). This was the third and last. It is read-only.
- It downloaded every text itself from api.sejm.gov.pl and every official page.
- The PDFs the lab cites have the same sha256 as its downloads, and every extract line occurs in its own conversion.
- The two gov.pl pages, and the files used from other folders, returned the same HTML hash as the lab's headers.

**Then:** each provision behind a correction was re-read here from our own downloads (17 acts; every hash the agent recorded matches ours). Art. 3 pkt 14 and 20a–20cb of the informatization act were compared word by word between the old and the new consolidated text. The new text is in `other-acts-egov-extract.txt`; every line of it was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:** it is a second reading by the same kind of tool, not an expert's review. Two things were left open:
- what a confirmation point accepts in practice (OPEN-E1);
- the terms of the e-Doręczenia mailbox in mObywatel (OPEN-E3).

**The app:** the prototype has no e-government case, and production's registry has no guide for it, so none of the findings is in what it shows.

## Result in brief

- **Both consolidated texts were out of date.** The informatization act is now Dz.U. 2026 poz. 1241 (legal state 6.08.2026), not 2025 poz. 1703. The e-delivery act is now 2026 poz. 3, not 2024 poz. 1045. The API marks both old texts "wygaśnięcie aktu". The cited articles read the same, so only the citations changed.
- **Why the tools missed it:** `amendments.mjs` listed the amendments after the old texts' dates and never said a newer text existed. It now warns and names the newest; a test covers it. A scan of the 40 Dz.U. texts cited in the lab found one more: the act on EU citizens, 2025 poz. 1164, replaced by 2026 poz. 1065. Its art. 2 pkt 3–4, which the lab cites, reads the same. Both headers now say so.
- **WRONG: "the MOS account needs a trusted profile".** UoC art. 225b ust. 2 asks for any means under the informatization act art. 20a ust. 1. UdSC's QA 2 says otherwise, and its own QA 3 contradicts it. The residence check had found this too; it had not reached this map.
- **WRONG: a citation and a rule.**
  - "ED art. 7 ust. 1, 4": art. 7 has only ust. 1 and 2. The delivery rule is art. 4 ust. 1.
  - "Never: 'Nie musisz'" (EG6): the act makes an address optional for a private person ("może posiadać", art. 10). Without one, the paper (hybrid) service is used (art. 5 pkt 1; KPA art. 39 § 2 pkt 1). The rule is now "never a flat 'Musisz' or 'Nie musisz'".
- **Rules and dates that were missing, now added:**
  - a letter not opened counts as delivered on the day after 14 days from its arrival (art. 41–42);
  - since 1.01.2026 an ePUAP box no longer counts for letters to or from a person (art. 147 ust. 2–3);
  - government bodies, among them the voivode, deliver this way from 1.01.2025; courts, bailiffs and prosecutors from 1.10.2029 (art. 155);
  - the exceptions of art. 6;
  - CEIDG: the duty from 1.10.2026, earlier entries by 30.09.2026 (art. 9 ust. 1 pkt 9, 152, 166).
- **Settled from the trusted profile regulation** (Dz.U. 2023 poz. 2551; neither later amendment touches these paragraphs):
  - **validity (OPEN-E2 closed):** 3 years, extendable (§ 11, § 13);
  - **documents at a point (OPEN-E1 narrowed):** any identity document that identifies a person who has a PESEL; one without the number is foreseen (§ 4 ust. 2, § 12 ust. 1 pkt 4);
  - **a new step:** an application not confirmed within 30 days is deleted (§ 3 ust. 2).
- **mObywatel (OPEN-E3 narrowed):** the app is open to anyone logged in with a means that holds the PESEL (mObywatel act art. 4 ust. 1 pkt 1).
- **Dates:**
  - 1841's points on art. 11, 13, 14 and 15 apply from 1.06.2025, not 1.01.2025 (its art. 7 pkt 1);
  - the outage on 17/18.10 is announced as possible ("mogą wystąpić"), and 18.10.2026 is a Sunday (KPA art. 57 § 4).
- **Where the lab went further than the check:** the map's "in person for non-EU since 1.01.2026" had no source here. The agent cited the act on population records art. 18 ust. 1a and said it covers only the PESEL application. Re-reading Dz.U. 2025 poz. 1301 art. 6 here showed it also added art. 40 ust. 3: registering without a PESEL is in person too, with the exceptions of art. 41 ust. 1–2a. The map now cites both.

## Verdicts and what changed

### Map

| Ids (where) | Verdict | What the lab changed |
|---|---|---|
| M1 (MOS asks for a PESEL) | CONFIRMED | Art. 225b ust. 3 pkt 6 cited |
| M2 (MOS needs a trusted profile, QA 2) | WRONG | The act's rule (art. 225b ust. 2, art. 20a ust. 1); QA 2 quoted as the page's words, with QA 3 |
| M3 (Mazowiecki) | PARTLY | "Asks for" an address for MOS cases; the page's date and tense |
| M5 (Sources) | OUTDATED | 2026 poz. 1241 and 2026 poz. 3; the regulation, UEL and the new extract named |
| M6 (§1) | CONFIRMED / PARTLY | Legal capacity (art. 3 pkt 14); MOS takes permit applications (art. 225a ust. 1); a parent for a minor (art. 225b ust. 1 pkt 2) |
| M7 (no profile without a PESEL) | Label right | The regulation § 4 ust. 2 added; still INFERENCE |
| M8 (row 29, the routes) | PARTLY | Every route with its condition; the Polish ID card for the personal profile and video; the minister's approval for banks; the 30-day step |
| M10 (CEIDG, KRS) | CONFIRMED; dates missing | The dates (art. 152, 166, the communiqué) |
| M11 (E1, in person) | PARTLY, no source | UEL art. 18 ust. 1a and art. 40 ust. 3, with their exceptions |
| M13 (E2) | CONFIRMED / PARTLY | The 30-day step; NFZ staff only for their own patients (art. 20c ust. 2b) |
| M14 (EL3) | CONFIRMED; label right | The qualified-signature route; the ID card act art. 6 ust. 1 and the regulation § 6 ust. 4 |
| M15 (E3) | PARTLY | "Unless a law says otherwise"; only while the profile is valid (art. 20ae ust. 1) |
| M18 (E4 "or required by an office's practice") | PARTLY (overclaim) | "Optional for a private person; an office may ask for it" |
| M19 (EL6, "art. 7 ust. 1, 4") | WRONG citation | Art. 4 ust. 1, 7 ust. 1, KPA art. 39 § 1; art. 6; art. 41–42; art. 147 |
| M21, M32 (E5, EG12) | Answerable | Validity and extension from the regulation; an expired profile is confirmed again (INFERENCE) |
| M22 (EL8, the outage) | CONFIRMED (wording) | "May be unavailable"; the e-Doręczenia windows; the agent found no act that moves a deadline for such an outage, only MOS's own rule (art. 225c) |
| M25 (EG3) | CONFIRMED / PARTLY | "No Polish ID card" in the situation; the documents from § 4 ust. 2 |
| M28 (EG6 "Nie musisz") | WRONG (rule) | Never a flat "Musisz" or "Nie musisz" |
| M29 (EG7) | PARTLY / OPEN answerable | Art. 41 ust. 1 pkt 3, 42 ust. 2 |
| M30 (EG9) | CONFIRMED / PARTLY | The regulation § 9 pkt 1 |
| M31 (EG10, 18.10) | PARTLY | A Sunday; KPA art. 57 § 4 for a KPA deadline |
| M33 (§4.1, "quoted") | PARTLY | The act's own words of art. 20ad ust. 1 |
| M34 (OPEN-E4 used twice) | Label mismatch | The list of points is now OPEN-E5 |
| EL2 ("public questions Q8") | Minor | The file is named (`research/2026-10-16-service/PUBLIC-QUESTIONS.md`) |
| All other rows (M4, M9, M12, M16, M17, M20, M23, M24, M26, M27) | CONFIRMED | — |

### Sources README and headers

| Item | Verdict | What the lab changed |
|---|---|---|
| R1 (the informatization text) | OUTDATED | Marked superseded; 1241 named; the wording compared |
| R2 (1841's date) | PARTLY | The date per point; 2026 poz. 3 named |
| R3, R4, R6–R8, R11, R12 | CONFIRMED | R8: art. 20a ust. 2 (other technologies); R11: art. 15 ust. 1a from 1.06.2025 |
| R5 (the points) | CONFIRMED; minor | "Branches of credit institutions"; ust. 2b |
| R9 (who must, who may) | CONFIRMED; dates missing | The dates |
| R10 (effect of an address) | PARTLY | Art. 6, 41–42, 147, 155 |
| R13 (inferences) | Labels right | Inference 2: art. 19 ust. 4; inference 3: the ID card act and the regulation, still INFERENCE |
| R14–R16 (OPEN-E1 to E3) | Answerable in part | E1 and E3 narrowed; E2 closed |
| R17 (OPEN-E4) | Label conflict | OPEN-E5 added for the list of points |
| New rows | — | Legal capacity; the profile's validity; PESEL in person; mObywatel |
| informatyzacja-2025-1703 header | PARTLY | 2026 poz. 160 adds art. 4aa and 19ad (it does not change 19ac); what 2320 art. 105 repeals; superseded by 1241 |
| doreczenia-2024-1045 header | PARTLY | 1841's date per point; superseded by 2026 poz. 3; the texts of art. 9's footnotes 3 and 5 |
| The two gov.pl pages | CONFIRMED | — |
| Files from other folders (the MOS extract, the Mazowiecki page, the protection act, the UdSC Q&A) | CONFIRMED | — |

## Acts the files did not use, now in `other-acts-egov-extract.txt`

- The e-delivery act, consolidated Dz.U. 2026 poz. 3:
  - art. 6, 7, 9 ust. 1 pkt 9 with its footnote, 19 ust. 4;
  - art. 41 ust. 1, 42;
  - art. 147 ust. 2–3, 152 ust. 1–3, 155 ust. 1, 5a, 7, 9, 11, 166.
- Dz.U. 2024 poz. 1841 art. 7; the communiqué Dz.U. 2024 poz. 1078; Dz.U. 2026 poz. 507 art. 10.
- The trusted profile regulation, Dz.U. 2023 poz. 2551: § 3, 4 ust. 2, 6 ust. 4, 9, 11 ust. 1–2, 12 ust. 1 pkt 1–4, 13 ust. 1.
- The ID card act, Dz.U. 2025 poz. 1753: art. 2 ust. 1 pkt 1 and 10, art. 6 ust. 1.
- The mObywatel act, Dz.U. 2026 poz. 1232: art. 2 pkt 8, 4 ust. 1 pkt 1.
- KPA art. 39 § 1–2, 57 § 4.

Cited from other folders, not repeated: UoC art. 225a–225c; the act on population records art. 18 ust. 1a and 40 ust. 3.

Named by the agent but not used here:
- the communiqués Dz.U. 2023 poz. 1077, 2540 and 2764 (replaced by 2024 poz. 1078);
- e-delivery act art. 11 pkt 2 lit. b, 13 and 23;
- the gov.pl page "najważniejsze informacje dla obywatela" (art. 147 says the same).
