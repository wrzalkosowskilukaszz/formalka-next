# Public questions: what people ask about registration and PESEL (desk collection, 16.10.2026)

**What this is:** questions people asked in public, and questions a public helpline's knowledge base answers. Each is paraphrased without names or usernames. The source is linked so the original can be read. These are **signals for the interview guide, not findings**: a handful of posts does not show how common a problem is.

**What could not be collected (a gap, not a finding):**
- Facebook groups, and Telegram or Viber channels, where many newcomers ask. They need a login and the group's consent; this tool cannot reach them.
- Reddit. It refuses this tool's requests (HTTP 403; the search tool reports the domain blocked).
- Helpline call logs (19115, Migrant Info Point, the voivodeship information lines). They are not public.

The collection protocol below is how a person on the team should fill this gap.

## Collected

| # | Journey stage | Question or signal (paraphrased) | Source, date | What it suggests (HYPOTHESIS until interviews) |
|---|---|---|---|---|
| Q1 | S3 owner, S9 residence | A non-EU person holding a temporary residence card moves into a partner's flat, which is leased to the partner's company. Her name is not on the lease. The owner agrees to the registration. Can she register without a lease in her name, and does that affect her residence card? No answer in the thread | e-prawnik.pl forum, "Meldunek obywatelki Ukrainy bez umowy najmu", undated (https://e-prawnik.pl/forum/zameldowanie-tymczasowe-dla-obcokrajowca-bez-umowy-najmu-1.html) | People think the lease, not the owner's confirmation, is what registration needs. They connect registration with their residence status and fear for it |
| Q2 | S2 group | A Polish-German dual citizen owns a flat in Poland but believes he cannot register there "as a foreigner". He has no Polish ID card because he has no registration. No answer in the thread | e-prawnik.pl forum, undated (https://e-prawnik.pl/forum/meldunek-obcokrajowca-z-eu-kraju-w-wroclawiu.html) | The "which rules apply to me" step fails for dual citizens; a Polish citizen follows the Polish citizens' rules (UEL ch. 4). Out of this app's scope, so the app must say so rather than route |
| Q3 | S3 owner | A landlord is renting to a couple, one of them a foreigner. She asks: must I check the visa? Am I at risk if he stays illegally? Will I be summoned? Can he register without my consent, and can I deregister him? She says a district office's registration desk told her by phone that nobody is registered without the owner's consent. A forum reply (author's qualifications unknown) cites NSA II OSK 1069/07 and WSA IV SA/Wa 1948/09: registration rests on the fact of stay, and the office establishes it when the owner will not confirm | dlajurysty.pl forum, 15.11.2023 (https://dlajurysty.pl/forum/post/5826/wynajem-mieszkania-cudzoziemcowi) | **The landlord is an actor in the service**, with fears of their own. An answer from an office by phone can differ from the act and from GOV's "Problem z zameldowaniem" |
| Q4 | S3 owner | Landlords reluctant to allow registration because they fear tenants gain rights to the flat (an expat forum, 2008; another commenter disputed it) | forums.eslcafe.com, 2008; seen only as a search-engine summary, the page returned HTTP 522 | Dated. Keep it only as a prompt for the interviews |
| Q5 | S3 owner | "Czy fakt zameldowania świadczy o uprawnieniu do lokalu?" and "Czy meldunek osoby nie będącej właścicielem może wpłynąć na sprzedaż mieszkania?" (titles of answered questions) | e-prawnik.pl, listed on the thread pages above | The same landlord fear, from the owner's side |
| Q6 | S4 form, S7 certificate, S9 moving | A helpline knowledge base answers these. They show what people ask the city: one form per person, including each child; the temporary-stay certificate is a separate request (17 zł); since 1.01.2026 an online certificate needs an e-Doręczenia box; a new temporary address replaces the old one automatically; no registration for stays up to 30 days; for non-EU people the declared period may not exceed their legal stay; there is no appeal | Warszawa 19115 (city contact centre), cards AO/02/07/K and AO/02/06/K, updated 06.07.2026 (`sources/`) | Several are steps outside the phone: children's forms, the certificate request, e-Doręczenia. The app does not cover them all |
| Q7 | S8 PESEL | The most common reason a PESEL application fails is the legal basis. Warsaw and gov.pl both say to write the actual legal basis, and that the institution requiring PESEL should give it | gov.pl PESEL card (updated 26.03.2026); Warszawa 19115 PESEL card (updated 04.03.2026) | People are sent to get a PESEL by an employer or a bank without a basis. The app cannot supply one (see `FORMS.md`) |
| Q8 | S8 PESEL, after | An employers' body writes to the minister: since 1.01.2026 a non-EU applicant must appear in person (art. 18 ust. 1a). That blocks foreign board members abroad, because PESEL and the trusted profile it unlocks are needed for KRS, tax e-filing, ePUAP, e-Doręczenia and PUE ZUS | Konfederacja Lewiatan, letter KL/326/93/NW/2026 of 15.05.2026 (https://lewiatan.org/wp-content/uploads/2026/05/KL-326-93-NW-2026.pdf, sha256 `2820fba3…14c14c`) | PESEL is a gateway to e-government. For this app's group, in person and no proxy is a hard constraint on when and how the person can act |
| Q9 | S8 PESEL | A draft amendment would not accept "confirming a trusted profile" as the only reason for a PESEL | A law commentary, January 2026, describing a draft (https://czasopismo.legeartis.org/2026/01/wniosek-nadanie-numeru-pesel-potwierdzenie-profilu-zaufanego-cudzoziemiec-slup-projekt-nowelizacji-ustawy-ewidencji-ludnosci/), seen only as a search summary | **OPEN:** draft status not verified. The app says nothing about it until a source in force says so |
| Q10 | Content upkeep | The gov.pl PESEL card, updated 26.03.2026, still cites the act as "Dz.U. z 2021 r. poz. 510". The consolidated text in force is Dz.U. 2026 poz. 384 | gov.pl card vs. api.sejm.gov.pl | Official pages lag. Each fact in the app needs its own source and check date (product rule 1); this is H6 maintenance work |

## Collection protocol (for a person on the team; before the interviews)

1. **Where.** Three to five public or semi-public groups and channels where newcomers ask, in Polish, Ukrainian, Russian and English, plus two helplines or NGO points (Warszawa 19115, a Migrant Info Point). Ask each group's admins for permission first, and say why.
2. **What.** The last 100 questions about registration or PESEL in a fixed window (for example, 60 days). Keep:
   - the question, paraphrased;
   - the date;
   - the language;
   - whether it was answered, and whether the answer agrees with the source.
3. **Never kept:** names, handles, photos, document numbers, addresses, screenshots.
4. **Coding.** Each question gets the journey stage (S0–S9 in doc 18) and the loss point it matches, or "new".
5. **Two coders** code a sample of 20 independently. Their agreement is reported.
6. **Use.** Counts per loss point decide the interview guide's emphasis. They do not decide features: what people ask in groups over-represents people who ask.
