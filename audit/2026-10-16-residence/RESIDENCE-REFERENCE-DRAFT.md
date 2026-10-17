# Temporary residence permit and first residence card: draft reference (NOT independent)

**Status: DRAFT. It needs a migration lawyer's review before any use as a benchmark (doc 19, level R5).**
- **Checked on 17.10.2026** by the separate agent `.claude/agents/official-fact-checker.md`, at the owner's request (`research/2026-10-16-residence/sources/CHECK.md`). It found a missing rule (losing a job on a single permit, art. 121 and 123), one contradicted inference (the appeal stage is not suspended by art. 100d ust. 1), a wrong payee (the stamp duty goes to the municipality), a missing exclusion (some spouses of Polish citizens, art. 2 pkt 3) and a missing rule on fees (art. 113c). Each was re-read here and corrected; changed in the lab, not independently verified. A second reading by the same kind of tool is not the lawyer's review.
- **Who wrote it:** Claude, on 16.10.2026, for wave 2 of doc 19. Claude built the case engine and the prototype that this draft will be compared with. In an earlier session it read the engine's residence blueprint and evaluation scenarios, so the draft is **not independent and not blind**.
- **How it was written:**
  - only from the primary sources in `research/2026-10-16-residence/sources/` (retrieved 16.10.2026, each with its URL and checksum);
  - not from the engine's output or Formalka's registry snapshot (`reference/residence/`);
  - the comparison with the engine (`COMPARISON.md`) is made afterwards.
- **Scope:** an application filed by a foreigner in Poland through MOS, for these purposes:
  - work (the single permit, art. 114);
  - study (art. 144);
  - a family member of a Polish citizen (art. 158);
  - family reunification, filed on paper by the family member in Poland for a person abroad (art. 159, 106l).

  It also covers the first residence card. Not covered: intra-company transfer, the Blue Card, business, research, seasonal work, art. 181, permanent residence, EU long-term residence, Ukrainian citizens' special rules (wave 3), and replacing a card.

Labels: FACT (quoted or read from a source below), INFERENCE, OPEN (the sources do not settle it), ASSUMPTION. Fictional dates only.

## Sources

| Id | Source | Version and file (`research/2026-10-16-residence/sources/`) |
|---|---|---|
| UOC | Ustawa z 12.12.2013 o cudzoziemcach, consolidated text Dz.U. 2025 poz. 1079 | Legal state of 25.07.2025. `uoc-2025-1079-art98-112a-extract.txt`, `uoc-2025-1079-purposes-and-card-extract.txt`, `uoc-2025-1079-art22-113-card-fees-extract.txt` |
| AM | Ustawa z 21.11.2025 o zmianie ustawy o cudzoziemcach, Dz.U. 2025 poz. 1794 | `amendment-2025-1794-art104-120a-extract.txt`, `amendment-2025-1794-mos-art225a-225h-extract.txt`, `amendment-2025-1794-card-art226-248-extract.txt`. Entry into force by point (its art. 19): the MOS rules (art. 104–106l, 108 ust. 1 pkt 1 and 3–10, 112a ust. 2 pkt 3, 120a, 225a–225i, 248) and art. 228 pkt 2 from **27.04.2026**; the other changes to art. 226–229 from **1.04.2026** (corrected after the check of 17.10.2026) |
| PRACA | Ustawa z 20.03.2025 o warunkach dopuszczalności powierzania pracy cudzoziemcom, Dz.U. 2025 poz. 621 | Art. 3, with its change by AM art. 11 (from 27.04.2026); later amendments checked, none touches art. 3. `praca-cudzoziemcow-2025-621-art3-extract.txt`. Added on 17.10 (§9) |
| SA | Ustawa z 12.03.2022 o pomocy obywatelom Ukrainy, consolidated text Dz.U. 2026 poz. 1293 | Legal state of 8.09.2026; no later amendments (16.10.2026). Art. 100d only: `specustawa-ua-2026-1293-art100d-extract.txt`. Added after the comparison (§9) |
| MP | Komunikat MSWiA, M.P. 2026 poz. 370 | Sets 27.04.2026 for the points listed in AM art. 17. `audit/2026-10-16-round2/reference/sources/uel-amendment-2025-1794-art5-and-mp-2026-370.txt` |
| KPA | Kodeks postępowania administracyjnego, Dz.U. 2025 poz. 1691 | Art. 35–37, 57–58, 64, 127–130, 261. No later amendments listed by api.sejm.gov.pl on 16.10.2026. `kpa-2025-1691-art35-37-57-58-64-127-130-261-extract.txt` |
| OS | Ustawa o opłacie skarbowej, Dz.U. 2025 poz. 1154 | Part III items 2–4. `oplata-skarbowa-2025-1154-residence-fees-extract.txt` (its header lists the later amendments and what was checked) |
| MOS | UdSC, "Informacja na temat systemu MOS" | `udsc-info-mos-2026-10-16.txt` |
| QA | UdSC, "MOS – pytania i odpowiedzi" (65 questions) | `udsc-mos-qa-2026-10-16.txt`, cited by question number |
| FEES | UdSC, "Informacje o opłatach" | `udsc-oplaty-2026-10-16.txt` |
| UWWM | Warmińsko-Mazurski UW, "Zezwolenia na pobyt czasowy", version 46.0 of 27.04.2026 | `uw-wm-pobyt-2026-10-16.txt` (one voivode's page, used only for what it adds) |
| UWMAZ | Mazowiecki UW, "Jak sprawdzić status sprawy"; "Załóż konto do e-Doręczeń" (20.04.2026) | `uw-maz-status-2026-10-16.txt`, `uw-maz-e-doreczenia-2026-10-17.txt` (the second added on 17.10) |

**Not consulted (OPEN: a reviewer should add them):**
- the regulation on the application forms and attachments (UOC art. 107 ust. 1);
- the regulation on the card fee (UOC art. 239 ust. 1). The 100 zł amount here comes from FEES and MOS;
- gov.pl's pages for each purpose, and the voivodes' lists of supporting documents;
- the profil zaufany rules (gov.pl/web/profilzaufany);
- the act on days off work, for public holidays.

## 1. Rules for every in-country application

| Rule | Content | Basis |
|---|---|---|
| Who decides | The voivode competent for the foreigner's place of stay, by decision | UOC art. 104 ust. 1 as amended by AM (FACT) |
| When to file | "nie później niż w ostatnim dniu jego legalnego pobytu" | UOC art. 105 ust. 1 as amended (FACT). Not for family reunification abroad (art. 106j, FACT) |
| How to file | Only electronically, through MOS, on the MOS form. Filed any other way, the application is left unexamined, except intra-company transfers (106k) and family members abroad (106l) | UOC art. 106c ust. 1 and 5 (FACT). Since 27.04.2026 (MP, MOS, QA 9). "Nawet jeśli wydrukujesz i wyślesz do wojewody papierowy wniosek, zostanie on pozostawiony bez rozpoznania" (QA 9, FACT). E-mail or e-Doręczenia do not count either (QA 28, FACT) |
| Cases started before 27.04.2026 | Continue under the old rules; no new MOS application is needed. Started means the application reached the office before that day; the posting date does not count | AM art. 12 (FACT); KPA art. 61 § 3 (FACT); QA 53 ("wpłynął", FACT) |
| The account | The person opens their own MOS account through login.gov.pl. QA 2 says "Osoby te muszą posiadać profil zaufany."; the act asks only for authentication by the methods of the informatization act art. 20a ust. 1 (art. 225b ust. 2), and QA 3 speaks of "wybranej przez Ciebie metody uwierzytelnienia". A proxy may not use the person's account or open one for them; a proxy may sit with the person while they fill it in. The account form asks for, among other data, the "numer ewidencyjny … (PESEL)". The voivode helps to set up the account | QA 2, 3, 5 (FACT); UOC art. 225b ust. 2–4 as added by AM, from 27.04.2026 (FACT) |
| Unsigned drafts | An application not signed is deleted 45 days after the last change | UOC art. 225h (FACT); QA 20 (FACT) |
| Signature | A qualified electronic signature or a trusted signature (podpis zaufany); for a minor, a parent signs, and a personal signature is also allowed | UOC art. 106d ust. 3 (FACT). MOS: "konieczne jest posiadanie profilu zaufanego, kwalifikowanego podpisu elektronicznego lub podpisu osobistego" (FACT) |
| Attachments the person adds | The purpose's attachments; a current photo; a digital copy of **all** pages of a valid travel document | UOC art. 106d ust. 1 (FACT); QA 25, 26 (photo: JPG, at least 684 × 883 px, up to 2.5 MB; other files up to 10 MB, 50 MB in total, QA 23) |
| Attachments a third party fills in | Work: the employer. Study: the university. Traineeship or volunteering: the organiser. MOS e-mails them a link, valid 30 days; they sign it electronically; MOS blocks filing without it | UOC art. 106 ust. 2, 5, 7, art. 106c ust. 3, art. 106d ust. 4 (FACT); QA 30, 32 (FACT) |
| Supporting documents | The person **may** attach documents confirming the data and the purpose, as electronic documents or scans. For documents attached as scans, the voivode calls for the originals ("wzywa") | UOC art. 106d ust. 2, art. 106f (FACT) |
| Fees | Paid before filing, outside MOS, to separate accounts; proof attached. The stamp duty goes to the municipality where the voivode's office sits; the card fee to the voivode. See §2 | FEES (FACT); "pod rygorem zwrotu wniosku" (UWWM, FACT); KPA art. 261 (FACT); OS art. 6, 8 ust. 1, 12 (FACT); card fee regulation Dz.U. 2022 poz. 1583 § 3 (FACT) |
| When it counts as filed | When the application and attachments are signed and the person receives the UPO (urzędowe poświadczenie odbioru) | UOC art. 106d ust. 6 (FACT). QA 41: "uznany za złożony w momencie wysłania go do urzędu wojewódzkiego" (FACT) |
| No undo | A sent application cannot be withdrawn or edited in MOS | QA 40 (FACT) |
| Help | "Wojewoda zapewnia cudzoziemcowi pomoc przy składaniu wniosku". Without a computer: "możesz uzyskać pomoc w urzędzie wojewódzkim, do którego zamierzasz złożyć wniosek" | UOC art. 106d ust. 7 (FACT); QA 14 (FACT) |
| No booking | No appointment is needed to file; the voivode calls the person in later | QA 12, 44, 47 (FACT) |
| In person | Only for fingerprints, the signature specimen and the original passport, on the voivode's call | UOC art. 106b, 106e (FACT); QA 11 (FACT) |
| Fingerprint and appearance exceptions | No fingerprints under 6; no signature specimen under 13; no call to appear under 6 or with a specialist's certificate (at most 3 months old) | UOC art. 106b ust. 2–3, art. 106h ust. 1 (FACT) |
| Talking to the office | MOS is not a channel to the voivode, and it does not report calls or case status. Changes after filing (employer, work terms, address, purpose) go by a letter, on paper or to the voivode's e-Doręczenia address | QA 42, 43, 49, 50 (FACT) |
| Case status | By phone: Mazowiecki runs a Migrant Contact Center at (22) 695 67 73, which reads out a case's status from its number | UWMAZ (FACT, one voivode) |
| One voivode's practice after MOS (Mazowiecki) | Cases filed through MOS are conducted only electronically. An e-Doręczenia box is needed for calls, appointment information and the card pickup date, and for sending missing documents. The page's steps: get a PESEL, set up a trusted profile, then an e-Doręczenia address. Paper originals must first be certified electronically by a notary, legal adviser or advocate; the desk takes only fingerprints and checks the passport | UWMAZ e-Doręczenia page (FACT as the page's words, one voivode, 20.04.2026: written before MOS opened, in the future tense). Without an e-Doręczenia address an office delivers by the hybrid (paper) service (e-delivery act art. 4–5, FACT), so the box is the office's request, not the only channel |

**INFERENCE (wave 1 meets wave 2):** the MOS account form asks for a PESEL number (art. 225b ust. 3 pkt 6, FACT), and QA 2 requires a trusted profile. The PESEL guide's public questions record that PESEL "unlocks" the trusted profile (`research/2026-10-16-service/PUBLIC-QUESTIONS.md` Q8). A newcomer without PESEL is therefore, very likely, unable to open a MOS account and so to file. **OPEN-R1** (high harm: they find out on the last day of legal stay): whether PESEL is strictly required, and what a person without one does.

## 2. Fees

| What | Amount | Basis |
|---|---|---|
| Single permit (art. 114 ust. 1 and 1a), and art. 127, 137a, 139a ust. 1, 139o ust. 1 | 440 zł | OS item 2b (FACT); UWWM (FACT) |
| Every other temporary permit, including study (art. 144) and family (art. 158, 159) | 340 zł | OS item 2 (FACT); UWWM: "podjęcie nauki, podjęcie studiów; pobyt/połączenie z rodziną" (FACT) |
| Exempt from the stamp duty | Permits under art. 160 pkt 4, 5 or 6, art. 176, art. 186 ust. 1 pkt 8 and 9; permits for people under temporary protection | OS item 2, column 4 (FACT) |
| Seasonal work (art. 185a) | 170 zł | OS item 2c (FACT). Out of scope |
| Art. 181 ust. 1 pkt 1 and 3 | 85 zł | OS item 2a (FACT). Out of scope |
| Changing a single permit (art. 120 ust. 1) | 220 zł | OS item 2d (FACT) |
| Issuing the residence card | 100 zł, paid when applying, at the issuing office's cash desk or to its account | Card fee regulation Dz.U. 2022 poz. 1583 § 2 pkt 1 lit. a, § 3 (FACT, in force 29.07.2022, no amendments); FEES, MOS (FACT) |
| Card fee relief | 50%: for a person in a difficult financial situation; for a person whose purpose is study at a secondary school or university; for a minor under 16 on the day of the permit application (for the first card) | UOC art. 237 ust. 1–2 (FACT). **INFERENCE:** 50 zł for a student. **OPEN-R2:** whether the relief applies by itself or needs a request, and what proof MOS expects |
| Card fee exemptions | First card for a refugee, subsidiary protection, humanitarian stay; permits under art. 186 ust. 1 pkt 8 or 9; others | UOC art. 236 ust. 1 (FACT) |
| Account numbers | Each voivode's own, on its website | FEES (FACT). The app must link to the voivode's page and never show an account number |
| If the stamp duty is not paid in advance | A call to pay within 7–14 days; unpaid, the application is returned by an order (postanowienie), which can be challenged (zażalenie). The office must still deal with it when social reasons or the party's important interest require, when filing meets a final deadline (termin zawity), or when the filer lives abroad | KPA art. 261 § 1–4 (FACT); UWWM (FACT) |
| After a refusal or a discontinuance | The stamp duty paid is not refunded (for applications filed from 5.03.2026) | UOC art. 113c, added by Dz.U. 2026 poz. 203 art. 12 pkt 5; its art. 29 (FACT; added after the check of 17.10.2026). From 1.10.2026 any refund of stamp duty follows only a request (OS art. 9 ust. 2 as given by Dz.U. 2026 poz. 846 art. 14, FACT) |

## 3. Deadlines and their legal basis

| Deadline | Content | Basis | What the app may say |
|---|---|---|---|
| Filing | No later than the last day of legal stay | UOC art. 105 ust. 1 (FACT) | The date only if the person gives it. Plan to file well before: the third party's attachment can take long (MOS, QA 9, FACT) |
| Filing when MOS is down on the last day | "najpóźniej w 3. dniu roboczym następującym po dniu, w którym usunięto nieprawidłowości"; the filing date is the outage's first day. The Szef UdSC announces the repair on its website | UOC art. 225c ust. 1–2 as added by AM (FACT); QA 17 (FACT). OPEN-R3 resolved after the comparison (§9) | The rule and the date, once the person gives the repair date |
| Last day on a weekend or holiday | Does KPA art. 57 § 4 move the "last day of legal stay"? | **OPEN-R4.** INFERENCE: it is the end of a stay, not an office's time limit, and MOS accepts filings on any day (QA 12–13) | Never move the date. Tell the person to file before it |
| Call to appear | At least 7 days from delivery | UOC art. 106e ust. 1 (FACT) | The date in the letter. Count it only if the person gives the delivery date and the number of days (KPA art. 57 § 1, 4) |
| Call for documents | At least 14 days; the voivode weighs how long the document takes to obtain; originals of attached scans | UOC art. 106f (FACT) | As above |
| Call to remedy formal defects | At least 7 days, or the application is left unexamined | KPA art. 64 § 2 (FACT), named in UOC art. 106e ust. 2 | As above |
| Call to pay the fee | 7 to 14 days | KPA art. 261 § 1 (FACT) | As above |
| Decision | 60 days, from the last of: an application without formal defects (or remedied); the documents under 106f filed, or that deadline lapsed. **Until 4.03.2027 the voivode's time limits in these cases do not run** (they do not start, and a running one is suspended) | UOC art. 112a ust. 1–2 as amended (FACT). Ust. 2 pkt 1 (personal appearance) repealed by AM from 27.04.2026 (FACT). KPA art. 35 § 5 (FACT). SA art. 100d ust. 1 (FACT), added after the comparison (§9) | **No date.** Until 4.03.2027 there is no running time limit at all; after it, the start depends on events only the office knows (INFERENCE) |
| Appeal stage | 90 days for the Szef UdSC. Art. 100d ust. 1 does not suspend it: it applies "w postępowaniach prowadzonych przez wojewodę", and the appeal is decided by the Szef UdSC (corrected after the check of 17.10.2026; the earlier INFERENCE was contradicted by the text). Whether ust. 3–4 (no inactivity remedies) reach the appeal stage: OPEN, a lawyer | UOC art. 112a ust. 4, art. 22 ust. 1 pkt 1, ust. 2 (FACT); SA art. 100d ust. 1, 3, 4 (FACT) | No date, as above |
| Appeal | 14 days from delivery of the decision | KPA art. 129 § 2 (FACT). INFERENCE: UOC sets no other term for a voivode's residence decision. Searched the whole UOC text and AM (lines joined) for an appeal term "w terminie … dni": the 7-day terms are all Border Guard matters (art. 245 ust. 7a, 277 ust. 3a, 321 ust. 2, 341 ust. 2, 355 ust. 3, 357 ust. 4), and the 14-day terms are requests for re-examination of visa decisions (art. 42, 76, 93); none concerns a voivode's permit decision | The date, if the person gives the delivery date; the KPA rules for counting |
| Restoring a missed deadline | Request within 7 days of the cause ending, doing the act at the same time; only if not at fault | KPA art. 58 (FACT) | The rule; a lawyer for the person's own case |
| Ponaglenie | Only after the deadline (art. 35 or a special one) has passed; filed earlier, it is left unexamined. **Until 4.03.2027** the provisions on inactivity do not apply to these cases, and delays in that period cannot ground remedies for inactivity or excessive length | KPA art. 37 § 1, 3a (FACT); SA art. 100d ust. 3–4 (FACT) | Not as an available step until 4.03.2027; the special act's rule, and free legal aid or a lawyer for the person's own case |
| End of the purpose | Notify the voivode who granted the permit within 15 working days of the reason ceasing | UOC art. 113 ust. 1 (FACT). **OPEN-R5:** when counting starts, and what counts as a working day | "Zawiadom od razu", without a computed date |
| Losing a job on a single permit (residence and work) | Notify the voivode who granted the permit **in writing**, within 15 working days, of losing the job with any employer named in the permit; filing a change application within that time also meets the duty. The employer notifies too, within 15 days. If the person shows they notified, the permit is not revoked for the purpose ceasing for 30 days from losing the job (once per permit). Not notifying in time is a ground to refuse a change of the permit | UOC art. 121 ust. 1, 3, 4; art. 123 ust. 1–2; art. 120 ust. 4 pkt 6 (FACT; added after the check of 17.10.2026) | "Zawiadom na piśmie od razu", without a computed date |
| Card replacement | Within 14 days of the reason (for example, a change of data) | UOC art. 230 ust. 1 (FACT). Filed on paper (QA 54, FACT). Out of scope | Mention only |

KPA counting, for an office's deadline (FACT, KPA art. 57):
- the day of the event is not counted (§ 1);
- a deadline that ends on a Saturday or a statutory day off moves to the next day that is neither (§ 4);
- it is kept if, before it ends, the letter is posted at a Polish post office of the designated operator, or sent to the authority's e-Doręczenia address and the sender receives the proof of receipt (§ 5).

Example, fictional: a call for documents delivered on Tuesday 27.10.2026, with 14 days, ends on Tuesday 10.11.2026. Had it ended on a Saturday, it would move to the next day that is neither a Saturday nor a day off.

## 4. During the case

| Topic | Content | Basis |
|---|---|---|
| The certificate that the application was filed | After an official checks the application, the person downloads it from MOS. It replaces the passport stamp. It carries a QR code; it is free; it can also be handed over at the in-person visit | UOC art. 108 ust. 1 pkt 1, ust. 3–7 as amended (FACT); QA 35, 48 (FACT) |
| Legal stay while waiting | "pobyt cudzoziemca … uważa się za legalny od dnia złożenia wniosku do dnia, w którym decyzja … stanie się ostateczna", if the filing deadline was kept and the application has no formal defects (or they were remedied in time). Not if the case is suspended at the party's own request | UOC art. 108 ust. 1 pkt 2, ust. 2 (FACT; not changed by AM) |
| During an appeal | INFERENCE: a first-instance decision under appeal is not final, so the legal stay continues until the appeal is decided | UOC art. 108 ust. 1 pkt 2 with KPA art. 127, 130 (INFERENCE). Lawyer to confirm |
| Work while waiting | It depends on the basis before filing:
- free access to the labour market while staying under art. 108 ust. 1 pkt 2, if immediately before filing the person met the conditions of art. 3 ust. 1 pkt 14–17 (among them a permit for study, for family reunification, or as the spouse of a Polish citizen);
- with a work permit or a registered declaration, work may go on while staying under art. 108 ust. 1 pkt 2 if, immediately before filing, the person was entitled to work in Poland;
- some highly qualified, intra-company and research cases are listed separately.

Applying this to one person's history is for a lawyer or the voivode (OPEN-R6, narrowed) | PRACA art. 3 ust. 1 pkt 18, ust. 2 pkt 6, ust. 3 pkt 2 as amended by AM art. 11 (FACT) |
| Travel abroad while waiting | **OPEN-R7.** Not in our sources | — |
| Not appearing | The case is discontinued (umorzenie) if the person does not appear on a proper call, or appears but gives no fingerprints, signature or passport. Exceptions for the under-6 and medical cases | UOC art. 106i (FACT) |
| How calls arrive | MOS does not tell the person; "poinformuje Cię pracownik urzędu wojewódzkiego". The decision goes to the address for service the person gave | QA 43, 51 (FACT). **OPEN-R8:** the channel for calls (post, e-Doręczenia, e-mail) |
| Delay | Normally: the office must say why and give a new date (KPA art. 36), and the person may file a ponaglenie to the higher authority, through the voivode; the voivode forwards it within 7 days; the higher authority decides within 7 days. **Until 4.03.2027 neither applies to residence cases** (SA art. 100d ust. 3 pkt 1: no duty to notify, no inactivity provisions) | KPA art. 36, 37 § 3–5 (FACT). The higher authority is the Szef Urzędu do Spraw Cudzoziemców (UOC art. 22 ust. 2, FACT). SA art. 100d (FACT) |
| Not through MOS | A ponaglenie, an appeal and any letter go on paper or to the voivode's e-Doręczenia address | QA 42, 49, 52 (FACT for letters and appeals). INFERENCE for a ponaglenie |

## 5. Decision, appeal, card, and after

| Topic | Content | Basis |
|---|---|---|
| Permit period | What the purpose needs, at most 3 years | UOC art. 98 ust. 2 (FACT) |
| Refusal | Grounds in art. 100 and, for work, art. 117–117a. Not extracted in full here | UOC (FACT that they exist). The app must hand a refusal to a lawyer or an NGO |
| Appeal | To the Szef UdSC, through the voivode, within 14 days of delivery; no detailed reasons needed; filing on time stops the decision being carried out | KPA art. 127, 128, 129 § 1–2, 130 § 2 (FACT); UOC art. 22 ust. 2 (FACT); not through MOS (QA 52, FACT) |
| First card | Issued ex officio (no separate application), **except** that it is issued on the person's application when, among others, the permit was for family reunification (or art. 160 pkt 1, 3, 4, 6) and the person was abroad on the day the application was filed. Issued by the voivode who granted the permit | UOC art. 229 ust. 2 (FACT; already in the base text, AM pkt 45 only adds the European return document from 1.04.2026); art. 229 ust. 4 pkt 1, 1c (FACT), added after the comparison (§9); art. 245 ust. 1 (FACT) |
| Collecting the card | In person, showing a valid travel document (or, exceptionally, another identity document). Not in person when the call to appear was waived under art. 106h. For a child under 13, a parent collects it; a child aged 6 or more must be present | UOC art. 248 ust. 1, 2, 2a, 4, 5 as amended, from 27.04.2026 (FACT) |
| When the card is ready, and how the person learns | **OPEN-R9.** Not in our sources | — |
| Card validity | The permit's period | UOC art. 243 ust. 1 pkt 1 (FACT) |
| End of the purpose | Notify the voivode within 15 working days (art. 113); for a lost job on a single permit, in writing under art. 121, with the 30-day protection of art. 123. The permit is revoked when its purpose has ceased (art. 101 pkt 1) | UOC art. 113, 121, 123, 101 (FACT). The app says to notify and to get advice; it never predicts revocation |
| Changing a single permit | The person may apply to change it, on paper, for 220 zł; some changes need no new permit (art. 119) | UOC art. 120, 120a ust. 1 as amended (FACT); OS 2d (FACT). **OPEN-R10:** which changes of job need a change; art. 119 not extracted in full |

## 6. Reference cases (fictional)

Each case gives what a correct plan must contain. "Never" lists what a plan must not say.

### RC1. Work: single permit, in Poland on a national visa

- **Facts:** the visa (legal stay) ends Monday 30.11.2026; a job offer from a Warsaw employer; no PESEL.
- **Office:** the Mazowiecki voivode, by place of stay (art. 104 ust. 1).
- **Channel:** MOS only.
- **Before filing:**
  1. A trusted profile, or the first step towards one (OPEN-R1).
  2. A MOS account (QA 2).
  3. The employer's attachment through the link: give the employer's e-mail; the link lasts 30 days (QA 30).
  4. A photo and a scan of all passport pages.
  5. Pay 440 zł stamp duty (to the municipality where the voivode's office sits, OS art. 8 ust. 1, 12) and 100 zł for the card (to the voivode, card fee regulation § 3), and attach both proofs. (Corrected after the check: it said "the voivode's two accounts".)
- **Filing:** by 30.11.2026 at the latest; the plan says to start early because of the employer's attachment (MOS). The UPO is the proof of filing.
- **After:** the certificate from MOS; a call to appear (≥7 days); maybe a call for documents (≥14 days); a decision within 60 days of the later event (no date); the card collected in person.
- **Never:**
  - a decision date;
  - "Twój pobyt jest legalny" without the conditions of art. 108;
  - an account number;
  - "złożyliśmy wniosek".

### RC2. Study: a university student in Kraków

- **Facts:** the legal stay ends on a date the person gives; admitted to a university.
- **Office:** the Małopolski voivode.
- **Channel:** MOS; the university's attachment (art. 106 ust. 7).
- **Fees:** 340 zł stamp duty. The card is 100 zł, or 50 zł with the art. 237 relief (INFERENCE; OPEN-R2); the proof for the relief is a certificate of study (card fee regulation § 4 pkt 2, FACT).
- **Conditions the person must meet (art. 144 ust. 1):** a university approved by the minister (unless it need not be, and is not barred); for paid studies, proof that the fee for the semester or year is paid (pkt 1 lit. b); health insurance or proof of cover; sufficient means. The university certificate of pkt 1 lit. a was repealed from 27.04.2026 (AM art. 1 pkt 23). The plan names them; it does not judge them.
- **Never:** a fixed 100 zł with no mention of the relief; a statement that the means are enough.

### RC3. Spouse of a Polish citizen, in Poland

- **Facts:** married to a Polish citizen; in Poland on a visa.
- **First check (added after the check of 17.10.2026):** the act on foreigners does not apply to the spouse when the Polish citizen lived for more than 3 months in another EU, EEA, Swiss or UK state just before coming back, married before or during that stay, and returns to live in Poland for good, or was before a citizen of such a state (UOC art. 2 pkt 3 with the act on EU citizens art. 2 pkt 4 lit. b, FACT). Then the EU citizens' rules apply instead. The plan asks.
- **Office:** the voivode of the place of stay.
- **Channel:** MOS. Art. 158 is not among the paper exceptions (art. 106c ust. 5 with 106k–106l; QA 9). No third-party attachment.
- **Fees:** 340 zł plus 100 zł.
- **Documents:** the act lists none for this purpose beyond the form. The voivode may ask (106f). **OPEN-R11:** the voivodes' document lists.
- **Never:** "nie musisz nic dołączać"; a list of documents from model memory.

### RC4. Family reunification, the family member abroad

- **Facts:** a foreigner living in Poland on a permit that qualifies under art. 159 ust. 1 pkt 1 applies for a spouse who lives abroad.
- **Who files, and how:** the family member in Poland, **on paper**, on the art. 106l form.
  - Attachments: a copy of the spouse's travel document, four photos of the spouse (application regulation Dz.U. 2026 poz. 553 § 5, FACT), and the spouse's consent on the official form (unless the filer is the spouse's legal representative), plus the documents confirming the data and the circumstances.
  - If the first three are missing, the voivode calls for them with at least 14 days.
  - Art. 106l ust. 1–5 (FACT).
- **Office:** the voivode of the place of stay of the family member in Poland (art. 104 ust. 1b, FACT).
- **No filing deadline under art. 105** (art. 106j, FACT); no fingerprints from the person abroad (106l ust. 7, FACT).
- **The 60 days** run from the later of a complete application and the documents (art. 112a ust. 3a, FACT), but not until 4.03.2027 (SA art. 100d).
- **The first card is issued on the person's application**, not ex officio (art. 229 ust. 4 pkt 1, FACT). The office takes the person's fingerprints at that application, and refuses to start the card case without them (art. 246 ust. 1 pkt 1, art. 247, FACT). **OPEN-R14:** where that application is made.
- **Fees:** 340 zł; the card 100 zł, paid when applying for the card, to the issuing office (card fee regulation § 3, FACT). **OPEN-R12:** narrowed to the practice on the paper route.
- **OPEN-R13:** how the paper application is delivered ("na dotychczasowych zasadach": in person, by post, or both), and how the spouse later enters Poland and collects the card.
- **Never:** a MOS step, or "you file it yourself".

### RC5. The last day of legal stay falls on a Sunday

- **Facts:** the legal stay ends Sunday 29.11.2026.
- **Plan:** file by Friday 27.11.2026, or earlier. MOS accepts filings any day (QA 12–13), but the date is not moved (OPEN-R4). If MOS is down on the last day, the QA 17 rule applies, citing QA 17.
- **Never:** "masz czas do poniedziałku".

### RC6. A call for documents, then a call to appear

- **Facts:** a call for documents delivered on Tuesday 27.10.2026, with 14 days; a call to appear, combined with it (art. 106e ust. 2).
- **Plan:**
  - the documents by Tuesday 10.11.2026 (KPA art. 57 § 1);
  - the appointment as set in the letter;
  - missing the appointment discontinues the case (art. 106i);
  - a missed deadline can be restored only under KPA art. 58.
- **Never:** a date computed when the person has not given the delivery date.

### RC7. Waiting, and the question "czy mogę wyjechać?"

- **Plan:**
  - the certificate in MOS;
  - legal stay under art. 108 ust. 1 pkt 2, with its conditions;
  - for travel while waiting: "Nie wiem. Nasze źródła tego nie rozstrzygają" (OPEN-R7), and where to ask: the voivode's information line (UWWM, UWMAZ) or a lawyer;
  - for work while waiting: that it depends on the basis on which the person was staying or working just before filing (PRACA art. 3), and that their own case is for the voivode or a lawyer.
- **Never:** "możesz spokojnie wyjechać", or "nie możesz wyjechać".

### RC8. No decision after a long time

- **Plan (on 16.10.2026):**
  - until 4.03.2027 the voivode's time limits do not run, and the inactivity provisions do not apply (SA art. 100d);
  - the 60-day rule (art. 112a) and when it starts, without a date, for after that day;
  - a ponaglenie is not offered as a step before 4.03.2027; free legal aid or a lawyer for the person's own case;
  - the status line (UWMAZ) where one exists.
- **Never:** "decyzja powinna już być", a ponaglenie date, or a ponaglenie as an easy fix.

### RC9. A refusal

- **Plan:**
  - the appeal within 14 days of delivery (KPA art. 129 § 2), to the Szef UdSC through the voivode;
  - not through MOS (QA 52);
  - a lawyer or an NGO for the grounds;
  - legal stay during the appeal is an INFERENCE for a lawyer to confirm.
- **Never:** an assessment of the chances, or a draft appeal.

### RC10. The card

- **Plan:**
  - the card is issued ex officio (art. 229 ust. 2), except in the art. 229 ust. 4 cases (RC4);
  - collected in person with the passport (art. 248 ust. 1, 4);
  - the child rules (art. 248 ust. 2–2a);
  - when it is ready is OPEN-R9: "urząd Cię poinformuje", without a date.
- **Never:** "złóż wniosek o kartę"; a pickup date.

### RC11. The job ends after the permit was granted

- **Plan:**
  - on a single permit, notify the voivode who granted the permit in writing within 15 working days of losing the job (art. 121 ust. 1), right away; the employer notifies too (ust. 4); a timely notice protects the permit for 30 days (art. 123);
  - a lawyer for what follows (art. 101);
  - a new job may need a change of the permit (art. 120, OPEN-R10).
- **Never:** a computed date (OPEN-R5); "Twoje zezwolenie wygaśnie".

### RC12–RC15. The other purposes (added on 17.10)

| Case | Channel and attachments | Stamp duty | Never |
|---|---|---|---|
| RC12. Traineeship or volunteering | MOS; the organiser's attachment, through the MOS link (art. 106 ust. 5, 106c ust. 3) | 340 zł (OS item 2; not among item 2b's purposes) | — |
| RC13. Business | MOS. An employer's attachment **only** when the purpose is work on the board of a limited or joint-stock company the person set up or holds shares in, as a general partner, or as a commercial proxy (art. 106 ust. 2); otherwise none | 340 zł (OS item 2) | An employer's attachment for every business |
| RC14. Seasonal work (art. 185a) | MOS (not among the paper exceptions) | 170 zł (OS item 2c) | — |
| RC15. A short stay (art. 181 ust. 1) | MOS | **One of** 85 zł (art. 181 ust. 1 pkt 1 and 3) or 340 zł (pkt 2) (OS item 2a) | Both amounts added up |

The card fee is 100 zł in each case (FEES). Art. 181 and 185a themselves were not extracted: OPEN-R15.

## 7. Open questions, their harm, and the restriction until they are settled

| Id | Question | Harm if guessed wrong | Restriction in the app until a source settles it |
|---|---|---|---|
| OPEN-R1 | Can a newcomer without PESEL open a MOS account? QA 2 says a trusted profile is needed; the act asks for authentication under the informatization act art. 20a ust. 1 (art. 225b ust. 2). The account form lists PESEL (225b ust. 3 pkt 6), while the application form asks for it "(jeżeli został nadany)" (application regulation Dz.U. 2026 poz. 553, annex 1, item 18). A non-EU foreigner applies for a PESEL in person (population register act art. 18 ust. 1a) | **High:** the person learns on the last day that they cannot file | The plan names the trusted profile as the first step and says "sprawdź to wcześniej"; it never says the account takes minutes |
| OPEN-R2 | Is the 50% card relief automatic or on request? Narrowed after the check: the card fee regulation § 4 names the proofs (for a student, a certificate of study) | Low–medium: a wrong amount, a call to pay more | Show 100 zł and the relief as a possibility with art. 237, not a fixed 50 zł |
| OPEN-R3 | Resolved after the comparison: UOC art. 225c (§9) | — | — |
| OPEN-R4 | Does the last day of legal stay move off a weekend or holiday? | **High:** illegal stay | Never move it; reminders before it |
| OPEN-R5 | When the 15 working days of art. 113 start, and which days count | Medium | No computed date: "zawiadom od razu" |
| OPEN-R6 | Narrowed (17.10): the rules are in PRACA art. 3; what remains open is how they apply to one person's history | **High:** illegal work, or work stopped for nothing | The rule that it depends on the basis before filing, plus where to ask; never "możesz pracować" or "nie możesz" |
| OPEN-R7 | Travel abroad while the case is pending | **High** | "Nie wiem", plus where to ask |
| OPEN-R8 | How calls arrive (post, e-Doręczenia, e-mail). Mazowiecki asks for an e-Doręczenia box (its page of 20.04.2026); by the e-delivery act art. 4–5 an office without such an address delivers by the hybrid (paper) service. Other voivodes not checked | **High:** a missed call discontinues the case | Say that MOS does not report calls (QA 43) and that the address for service matters (QA 51) |
| OPEN-R9 | When the card is ready and how the person learns. Mazowiecki: the pickup date comes to the e-Doręczenia box (17.10) | Low | No date |
| OPEN-R10 | Which changes of job need a change of the single permit (art. 119–120) | **High** | A lawyer; no rule from the app |
| OPEN-R11 | Supporting documents per purpose | Medium: delay, a call for documents | No document list beyond what the act and MOS name; the voivode's page as a link |
| OPEN-R12 | The card fee on the paper route (106l) | Low | Show the fee with "sprawdź u wojewody" |
| OPEN-R13 | How the 106l paper application is delivered, and the person's later entry and card pickup | Medium | Name the filer and the office; say the delivery route is to be checked with the voivode |
| OPEN-R14 | How the person who was abroad applies for the first card (art. 229 ust. 4) | Medium | Say that the card is on application, and to ask the voivode who granted the permit |
| OPEN-R15 | The conditions of art. 181 (short stay) and 185a (seasonal work), not extracted | Medium | Fees only, from the stamp duty act; no conditions |

## 8. Reviewer sheet

For each line, the reviewer marks agree, disagree (with the right answer and a source), or cannot tell.

1. §1: each rule and its basis, especially art. 106c ust. 5 (left unexamined) and art. 106d ust. 6 (when it counts as filed).
2. §1 INFERENCE on PESEL and the trusted profile (OPEN-R1).
3. §2: every amount, the exemptions, and the reading of art. 237 for students (OPEN-R2).
4. §3: every deadline, the KPA counting, and the search for a special appeal term.
5. §4: art. 108 and the INFERENCE that legal stay continues during an appeal.
6. §5: art. 229 ust. 2 and 4, and art. 248 from 27.04.2026.
7. §6: each reference case's plan and its "never" list.
8. §7: whether each restriction is enough, and the answer to any open question the reviewer can settle, with its source.

Reviewer: name, role (migration lawyer; a voivode's office; an NGO adviser), date, and the sources they used.

## 9. Corrections after the engine comparison (16.10.2026)

The comparison (`COMPARISON.md`) read the registry's notes, which cite provisions this draft had missed: three it had not extracted, one it had extracted but not read. Each was checked in the primary text before the draft changed; none was taken from the registry on trust.

| # | What the draft said | What the source says | Source now in `sources/` |
|---|---|---|---|
| K1 | The 3-working-day outage rule had no legal basis in our sources (OPEN-R3) | UOC art. 225c ust. 1, added by AM | `amendment-2025-1794-mos-art225a-225h-extract.txt` |
| K2 | The PESEL link to the MOS account was an INFERENCE from a public question | The account form asks for PESEL (art. 225b ust. 3 pkt 6); OPEN-R1 narrowed | the same |
| K3 | The 60-day limit and the ponaglenie applied as in KPA | Until 4.03.2027 the limits do not run and the inactivity provisions do not apply (SA art. 100d) | `specustawa-ua-2026-1293-art100d-extract.txt` |
| K4 | The first card is always ex officio; RC4 said nothing on the card | Art. 229 ust. 4: on application for family reunification from abroad and others | Already in `uoc-2025-1079-purposes-and-card-extract.txt`; the draft had read only the amended ust. 2 |

Lessons: `docs/solutions/2026-10-16-time-limits-suspended-by-another-act.md` and `docs/solutions/2026-10-16-read-the-whole-article.md`.

**Added on 17.10, from further sources:**
- the act on employing foreigners, art. 3 as amended by AM art. 11, narrows OPEN-R6 (work while waiting). The engine has no note on it: COMPARISON D17 and finding P9;
- the Mazowiecki voivode's e-Doręczenia page narrows OPEN-R8 and R9 for that office, and adds a second source for the PESEL condition of OPEN-R1 (its steps start with "Uzyskaj numer PESEL").
