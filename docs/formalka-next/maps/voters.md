# Map: EU citizens in the register of voters

**Status:** a lab map by Claude, 17.10.2026. It is not independent, and nothing in it is built or shown to people. Doc 19 matter 25 (wave 6). Production's registry has no voter procedure. **Checked by the separate checking agent on 17.10.2026** (`research/2026-10-17-voters/sources/CHECK.md`); its corrections are changed in the lab, after each provision and page was re-read, and not independently verified.

**Why it matters:**
- **An EU citizen aged 18 by election day and living permanently in Poland may vote in the European Parliament elections, and, living permanently in the gmina, for its council and wójt (or burmistrz, or city president);** a UK citizen in the local ones only, under the Poland–UK agreement (FACT, Code art. 10 § 1–2, 5 pkt 6; Dz.U. 2023 poz. 237–238).
- **It is not automatic:** EU and UK citizens get into part B and a voting district, and so onto the lists of voters, only on their own application to the gmina office (FACT, Code art. 19a § 1, 18a § 4), unlike Polish citizens, who are entered by their registered address (FACT, art. 19 § 2).
- **The decision takes up to 5 days, or 12 with a discrepancy, later if a limit ends on a Saturday or a day off,** and the list for an election follows the register as it stands on the 3rd day before (FACT, Code art. 20 § 1, 19a § 9, 9 § 2, 26 § 9). A late applicant misses the election and cannot be added on polling day (INFERENCE from art. 51 § 2).
- **Free** (FACT, Code art. 6), **online or at the office;** without a PESEL the application still works, with only sex and status required, and the gmina asks for a PESEL after a positive decision (FACT, Code art. 19a § 4–5; UEL art. 17 ust. 1 pkt 2a).

**Sources:** `research/2026-10-17-voters/sources/` (README there), cited as Code (the Electoral Code, consolidated Dz.U. 2026 poz. 1261), 497 (Dz.U. 2023 poz. 497), UEL (the act on population records), FORMS (Dz.U. 2023 poz. 1495), the election orders (Dz.U. 2026), Directive 94/80/EC and PAGES (gov.pl).

Labels: FACT, INFERENCE, ASSUMPTION, OPEN (OPEN-V1 to V5 in the sources README; V1, V3, V4 closed), PROPOSED.

**Content rules for this matter (PROPOSED):**
- **Citizenship is the rule itself here** (Code art. 10), so the app asks for it, by the passport; it never infers it from language or name (rule 4).
- **No political content:** the app names the elections and the steps, never parties, candidates or advice on how to vote.
- **No action claimed:** never "jesteś wpisany do rejestru"; the person checks it themselves (Code art. 36).

## 1. Who it is for

| The person says | Route | Basis |
|---|---|---|
| "Jestem obywatelem Hiszpanii, mieszkam w Polsce na stałe" | May vote for the European Parliament and the gmina council and wójt, after an application to the gmina | Code art. 10 § 1 pkt 2, 3 lit. a, 4; 19a (FACT) |
| "Jestem obywatelem Wielkiej Brytanii" | The gmina council and wójt only, after an application | Code art. 10 § 1 pkt 3 lit. a, 4; 19a (FACT) |
| "Jestem z Ukrainy z kartą stałego pobytu" | No vote in Polish elections | Code art. 10 (FACT) |
| "Jestem żoną obywatela Francji, sama mam obywatelstwo Indii" | No vote: the right follows the person's own citizenship | Code art. 10 (INFERENCE that family membership does not count) |
| "Chcę kandydować do rady gminy" | A voter for the council may stand, unless banned at home or barred by a conviction or a lustration ruling | Code art. 11 § 1 pkt 5, § 2–3 (FACT); nomination rules not mapped |
| "Przeprowadziłem się do innej gminy" | A new application there, to be safe; whether the gmina moves the entry itself is open | Code art. 18a § 3 pkt 7, 19a § 1 (INFERENCE); Directive 94/80/EC art. 8 ust. 3; OPEN-V5 |
| "Byłem dopisany dawno temu, nie mam PESEL" | A new art. 19a application | 497 art. 14 (FACT) |

## 2. The journey (stages V0–V3)

| Stage | Goal | Steps (phone / **off the phone**) | Basis | Where people get lost |
|---|---|---|---|---|
| **V0** May I vote? | Know which elections | Phone: citizenship by passport; permanent residence in the gmina | Code art. 10 (FACT); PAGES | **VL1:** thinks a residence card gives a vote (FACT that it does not) |
| **V1** The application | Entered in part B | Phone: online, after logging in, with a trusted profile or a qualified signature (the page also asks for an e-Doręczenia address). **Off: the form at the gmina office, with the passport number on it (the page says to bring the passport); without a PESEL, sex and status, the rest only if available; documents not in Polish with a sworn translation; free** | Code art. 6, 7, 19a § 2–5; FORMS annex 2 (FACT); PAGES; OPEN-V2 | **VL2:** assumes the residence registration did it (HYPOTHESIS on behaviour; art. 19a § 1 asks for an application, FACT) |
| **V2** The decision | Entered, or a complaint | Phone: the decision within 5 days (12 with a discrepancy; a limit ending on a Saturday or a day off moves to the next working day); a refusal: the complaint to the district court within 3 days of the decision's delivery, lodged at the gmina office during office hours | Code art. 9, 19a § 9, 20 (FACT) | **VL3:** misses the 3 days (HYPOTHESIS) |
| **V3** Before an election | On the list | Phone: check online, or ask the wójt by the 5th day before; an error in the list: a complaint to the wójt, decided in 2 days; at the polling station, an identity document | Code art. 26 § 9, 36, 37, 51, 52 § 1 (FACT) | **VL4:** applies days before the election (HYPOTHESIS); then too late, since the station adds only a person left out by mistake (INFERENCE from art. 51 § 2) |

## 3. The critical moments

1. **The 3rd day before an election** (V3): the list follows the register as it stands then (FACT, art. 26 § 9).
2. **The 5th day before an election:** the last day to ask the wójt for one's data (FACT, art. 36 § 6).
3. **3 days from the refusal's delivery** (V2): the complaint to the court, lodged at the gmina office (FACT, art. 20 § 4, 9 § 1).
4. **Filing in time** (V1): for a Sunday election, at the latest the 8th day before without a discrepancy, the 16th with one, the 23rd to leave room for a refusal and a full complaint (INFERENCE, computed in the sources README under art. 9 § 2; ASSUMPTION on counting). The app suggests at least 4 weeks (PROPOSED).

## 4. Scenarios (fictional)

| # | Situation | Stage | The app should | Never |
|---|---|---|---|---|
| VS1 | An Italian citizen, registered for permanent stay in Kraków for 3 years, never applied | V0–V1 | Not yet on the list; an art. 19a application to the Kraków office; 5 days, or 12 with a discrepancy (the early election of the city president on 27.09.2026 is past) | "Jesteś wpisany automatycznie" |
| VS2 | A UK citizen asks about the European Parliament elections | V0 | No: local elections only (art. 10 § 1) | — |
| VS3 | A Czech citizen without a PESEL | V1 | Paper application with the passport number, sex and status UE, the other data only if available; after a positive decision the gmina asks for a PESEL (art. 19a § 4; FORMS annex 2; UEL art. 17 ust. 1 pkt 2a) | "Najpierw zdobądź PESEL" as a condition |
| VS4 | Refused because the office doubts the address | V2 | The complaint to the district court within 3 days of delivery, lodged at the gmina office; free (art. 20 § 4, 9 § 1, 6) | Legal advice beyond the steps |
| VS5 | Moved from Gdańsk to Sopot | V1 | A new application in Sopot, to be safe (INFERENCE; OPEN-V5) | — |
| VS7 | A French citizen living in Górowo Iławeckie on 17.10.2026 asks about the wójt election of 25.10.2026 | V1–V3 | Filed on 17.10.2026 (a Saturday: online), the decision without a discrepancy is due by Thursday 22.10.2026, the register's day; with a discrepancy it would come after the election. Whether a Saturday online filing counts that day is OPEN (art. 9 § 3: office hours) (the order Dz.U. 2026 poz. 1147; art. 9, 20 § 1, 26 § 9; INFERENCE on the dates) | "Zdążysz na pewno" |
| VS6 | A Ukrainian citizen with permanent residence asks to vote for the wójt | V0 | No vote (art. 10) | Any suggestion that a permit gives one |

## 5. User flow (PROPOSED)

**One case:** "Głosowanie w Polsce (obywatel UE)", short, with a reminder before each election the person can vote in, from the orders in Dz.U. (and, for council by-elections, the voivode's journal), at least 4 weeks before (PROPOSED).

Intake (each with "Nie wiem"): citizenship by passport (EU, UK, other); the gmina of permanent residence; whether the person already applied, and when; PESEL and a trusted profile.

Handoffs: the gmina office (the application, a complaint); the district court (a refusal); the e-government map (PESEL, trusted profile).

```mermaid
flowchart TD
  A[Chcę głosować w Polsce] --> B{Obywatelstwo według paszportu}
  B -- inne niż UE i UK --> N[Brak prawa głosu w polskich wyborach]
  B -- UK --> L[Rada gminy i wójt]
  B -- UE --> E[Parlament Europejski, rada gminy i wójt]
  L --> W{Złożony wniosek z art. 19a w tej gminie?}
  E --> W
  W -- nie / nie wiem --> F[Wniosek w urzędzie gminy albo online, bezpłatnie; decyzja w 5 dni, do 12 przy rozbieżnościach; najlepiej co najmniej 4 tygodnie przed wyborami]
  W -- tak --> C[Sprawdź swoje dane w CRW]
  F --> D{Decyzja}
  D -- odmowa --> S[Skarga do sądu rejonowego w 3 dni od doręczenia, złożona w urzędzie gminy]
  D -- ujęcie --> C
```

## 6. What production would need (PROPOSED)

- **A small procedure in the registry:** art. 19a's application, the 5-day decision, the complaint, with the elections each citizenship opens.
- **Change monitoring:** election orders (dates; Dz.U. and the voivodeship journals); the Code's amendments to art. 9, 10, 19a, 20, 26, 37 and 51; the forms regulation; the gov.pl service page (it still lists CUE and every no-PESEL item as required).

## 7. Validation

- **The independent check:** done on 17.10.2026 (`CHECK.md`); run again after any change to its facts.
- **Thresholds** as doc 18 §6.1: 0 critical errors (a vote promised to someone who has none; "entered automatically"; political content; an action claimed).
- **Confirmers:** a gmina office's voter register desk (OPEN-V2, V5).
