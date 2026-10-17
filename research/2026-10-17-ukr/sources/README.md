# Sources for wave 3: the UKR status, temporary protection and the CUKR card (doc 19, level R1)

Collected on 16–17.10.2026 by Claude. **Sources only.** Doc 19 sets wave 3 at R1: the rules move too fast for a draft reference that would not go stale, and the gate needs a change-monitoring routine first. Nothing here reaches the prototype.

## What changed in 2026, in one paragraph (FACT, from the acts below)

The act of 23.01.2026 (Dz.U. 2026 poz. 203, in force 5.03.2026 with exceptions) wound the special act down. It moved temporary protection into the act on granting protection (art. 106–119), and PESEL with the UKR status into the act on population records (chapter 5a). The special act keeps, among others:
- the CUKR card (art. 42c–42x, from 4.05.2026);
- the suspension of the voivode's time limits until 4.03.2027 (art. 100d), which applies to every foreigner (`research/2026-10-16-residence/sources/`).

## Files

| File | Act or page | Version |
|---|---|---|
| `ochrona-2026-862-art106-111-116-extract.txt` | Ustawa o udzielaniu cudzoziemcom ochrony, consolidated Dz.U. 2026 poz. 862 | Legal state 18.05.2026; no amendments since (`tools/sources/amendments.mjs DU/2003/1176 2026-05-18`, 17.10.2026) |
| `uel-2026-384-rozdzial-5a-pesel-ukr-extract.txt` | Ustawa o ewidencji ludności, consolidated Dz.U. 2026 poz. 384, chapter 5a | Legal state 10.03.2026; later: 1794 (outside chapter 5a), 2026/1206 (from 11.01.2027, not checked) |
| `specustawa-2026-1293-art42c-42x-cukr-extract.txt` | The special act, consolidated Dz.U. 2026 poz. 1293, art. 42c–42x | Legal state 8.09.2026; no amendments since (16.10.2026). Art. 42c–42w from 4.05.2026 (M.P. 2026 poz. 371, per its footnote 68) |
| `wygaszenie-2026-203-art20-26-45-54-extract.txt` | The winding-down act, Dz.U. 2026 poz. 203: transitional art. 20–26 and 45; entry into force art. 54 | As published. Its art. 54 (`tools/sources/entry-dates.mjs DU/2026/203`): 5.03.2026, except points from 1.01.2027, 5.03.2027, 1.09.2027 and a date set by an announcement |
| `udsc-cukr-procedura-2026-10-17.txt` | UdSC, "Informacja dotycząca procedury wydania karty pobytu CUKR" | Retrieved 17.10.2026 |
| `udsc-cukr-qa-2026-10-17.txt` | UdSC, "Pytania i odpowiedzi - karta pobytu CUKR" (over 60 questions) | Retrieved 17.10.2026 |

Each file names its URL and SHA-256. The PDFs are not committed.

## What the sources say (FACT unless marked)

| Topic | Content | Basis |
|---|---|---|
| Legal stay | A temporary protection beneficiary who came legally in the period of the EU Council decision stays legally from entry for as long as that decision is in force, unless the act says otherwise; also a child born in Poland to a beneficiary | Protection act art. 106 ust. 1–2 |
| Who is not covered | Holders of a residence permit, refugee or subsidiary protection, tolerated or humanitarian stay; applicants for international protection; protection in another EU state; EU citizens; small border traffic | Protection act art. 109a |
| PESEL with the UKR status | On application at any municipal office, **within 30 days of crossing the Polish border** | Protection act art. 110a ust. 1–2; act on population records art. 44a |
| When protection ends | Among others: no PESEL application within those 30 days; **leaving Poland for more than 30 days**; a written renunciation; a residence permit or another status; an application for international protection; protection in another EU state; Polish or EU citizenship. It ends on the day of the event | Protection act art. 109b ust. 1–2 |
| Work | Without a work permit, under the act of 20.03.2025; business under the act of 6.03.2018 | Protection act art. 116 |
| CUKR card: who | UKR status on 4.06.2025, on the day of the application, and unbroken for at least 365 days; a child born in Poland under art. 42d | Special act art. 42c–42d; UdSC adds that the status must also be current on the day the card is issued |
| CUKR card: how | Only online, through MOS. Signed with a trusted profile, a qualified or a personal signature. Fees: 340 zł stamp duty and 100 zł for the card, to separate accounts | Special act art. 42f, 42n, 42s; UdSC |
| CUKR card: deadline | If filed by 4.03.2027, the stay is legal until the card is collected or cancelled, or a refusal becomes final. UdSC: "wniosek o wydanie karty pobytu CUKR będziesz mógł złożyć do 04.03.2027 r." | Special act art. 42x; UdSC |
| CUKR card: effect | On collection, the protection becomes a temporary residence permit for the card's 3 years. A pending ordinary residence application ends by law when a CUKR application is filed | Special act art. 42p, 42r ust. 1, 42i |
| CUKR card: duties | Collect it within 60 days of the office's notice, or the card is cancelled and the fees are not refunded. Notify the voivode of every change of the place of stay within 15 working days. The permit is withdrawn after leaving Poland for at least 6 months | Special act art. 42r ust. 2, 42u, 42t ust. 1 pkt 3 |
| Travel while a CUKR application is pending | UdSC: filing does not end the UKR status, so the person may leave Poland, "jednak nie dłużej niż na 30 dni"; the status ends on collecting the card | UdSC CUKR Q&A; consistent with protection act art. 109b ust. 1 pkt 2 (INFERENCE) |
| The status's end | UdSC: "z obecnie dostępnych informacji wynika, że status UKR będzie ważny tylko do 04.03.2027 r." | UdSC (its own wording, hedged). The EU Council decision itself is not in our sources: OPEN-U1 |

## How this meets what the lab already holds

- **The PESEL guide in `reference/`:**
  - its notes `ukr-deadline` and `ukr-deadline-missed` quote the protection act Dz.U. 2026 poz. 862, the same 30 days (art. 110a ust. 2);
  - production's guide is consistent with these sources on that point (INFERENCE, not an independent review).
- **The residence guide in `reference/`:**
  - `wait-cukr-ends-case` quotes art. 42i;
  - `decision-time-suspended` quotes art. 100d;
  - both agree with these sources (INFERENCE).
- **Wave 1 meets wave 3.** A Ukrainian newcomer's PESEL is a different procedure: the UKR application, not the general one the prototype leads. Doc 18's journey covers the general route only. The prototype must not route a UKR beneficiary into the general PESEL application (OPEN-U5).

## Open (the sources do not settle these)

| Id | Question |
|---|---|
| OPEN-U1 | The EU Council decision on temporary protection, and its current end date. Not collected |
| OPEN-U2 | The definitions of the UKR and CUKR statuses (act on population records art. 8 pkt 24a; lit. c and e changed from 4.05.2026 per M.P. 2026 poz. 371). Not extracted |
| OPEN-U3 | Whether Dz.U. 2026 poz. 1206 (from 11.01.2027) changes chapter 5a |
| OPEN-U4 | The Ukrainian version of UdSC's CUKR pages (gov.pl/web/udsc-ua/cukr), and gov.pl's PESEL UKR page. Not collected. The Polish Q&A is in this folder |
| OPEN-U5 | How the prototype tells a UKR beneficiary that the general PESEL route is not theirs, without choosing by nationality (product rule 4: by status, which the person states) |

## Upkeep (doc 19's gate for wave 3)

- The special act has been amended many times. Its consolidated text of 17.09.2026 lists five amending acts since the previous one.
- The 2026/203 act has four later entry dates, up to 1.09.2027 and one set by an announcement.
- **A monitoring routine could run `tools/sources/amendments.mjs` and `tools/sources/entry-dates.mjs` weekly on these four acts and report any change** (DU/2022/583, DU/2003/1176, DU/2010/1427, DU/2013/1650). Setting up such a scheduled run is the owner's decision.
