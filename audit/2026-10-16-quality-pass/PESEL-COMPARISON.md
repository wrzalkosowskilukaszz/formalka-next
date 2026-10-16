# The engine's PESEL-on-application plan against the sources (16.10.2026)

**Not independent.** Claude, who built the prototype, made this comparison. It finds candidates for a person to confirm.

**Sources** (extracts in `research/2026-10-16-service/sources/`):
- UEL art. 16–18 and 21;
- the gov.pl card "Uzyskaj numer PESEL – usługa dla cudzoziemców" (updated 26.03.2026);
- the Warszawa 19115 card on PESEL on application (updated 04.03.2026).

**Engine state compared:** a non-EU applicant, stay ≤ 30 days, filing recorded. Printed with the browser bundle on `lab/quality-pass`.

## Where they agree

| Item | Engine | Source |
|---|---|---|
| Register instead when staying over 30 days | The first question is the stay; the related case is address registration | gov.pl: "Dostaniesz numer PESEL z urzędu – jeśli zameldujesz się … na pobyt powyżej 30 dni" (FACT) |
| Where to file | Any municipal office | UEL art. 18 ust. 1: "do dowolnego organu gminy"; gov.pl (FACT) |
| In person for non-EU/EFTA/CH/UK applicants | Note `in-person`, important, on the filing step | UEL art. 18 ust. 1a, since 1.01.2026 (FACT) |
| The legal basis | Note `legal-basis` on the route **and, since `d568186`, on the application step** | gov.pl "Pamiętaj! … wpisz faktyczną podstawę prawną" (FACT) |
| A gap in the application | 7-day deadline `fix-missing` from the office's request; note `missing-items` | UEL art. 18 ust. 3 (FACT) |
| Documents | The application; a travel document **albo** another identity document; originals confirming the other data | gov.pl; 19115 "items 3–5" (FACT) |
| Fees | The application is free; the register certificate 17 zł, optional | gov.pl "Usługa jest bezpłatna" (FACT) |
| No appeal | Note `no-appeal` | 19115 "W tej sprawie nie możesz się odwołać" (FACT) |

## Gaps (candidates; none blocks Phase 1, where PESEL is out of the study)

| Id | What the sources say | What the engine shows | Restriction |
|---|---|---|---|
| P1 | The application asks how the notification is delivered: paper, or electronic to an ePUAP box (form EL/W/1 §6; UEL art. 21) | "Odbierz powiadomienie o nadaniu numeru PESEL", with no word on the choice | None needed in the app. Noted for the registry: a person without ePUAP should choose paper (HYPOTHESIS; `FORMS.md`) |
| P2 | An EU, EFTA, Swiss or UK applicant may use a proxy; the power of attorney costs 17 zł, free for close family (19115) | Not shown | None. Production content proposal |
| P3 | gov.pl's legal-basis section still cites the act as "Dz.U. z 2021 r. poz. 510" | The registry quotes gov.pl | None. The upkeep signal is recorded in `PUBLIC-QUESTIONS.md` Q10 |
| P4 | A draft would refuse "confirming a trusted profile" as the only reason for a PESEL (Q9) | Nothing | Nothing said until a source in force says so |
