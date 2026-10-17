# Independent check: permanent residence and the EU long-term resident permit, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed in cd11136:
- the map `docs/formalka-next/maps/permanent-residence.md`;
- `README.md` (this folder), the header of each extract and page file, and the residence-folder files the README relies on.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with the next matters and to confirm every fact against the official state. It is read-only.
- It downloaded every text itself from api.sejm.gov.pl and every page.
- Every hash the lab gives matches its download, and every quoted line of the extracts appears in its own conversion.
- To confirm that nothing else amends the cited articles, it scanned the text of 290 statutes (Dz.U. 2025 from poz. 1040, and 2026 to poz. 1340). It found only Dz.U. 2025 poz. 1794 and 2026 poz. 203 after Dz.U. 2025 poz. 1079.

**Then:** each provision behind a correction was re-read here from our own downloads, with the same hashes. The new text is in `other-acts-permanent-extract.txt` and the foreigners act extract. Every line of both was checked against our own conversion. One more change was found here: Dz.U. 2026 poz. 912 art. 76 adds a point to the stamp duty act art. 7 (metropolitan unions), which does not touch the exemption cited. The corrections are changed in the lab; not independently verified.

**Limits:** it is a second reading by the same kind of tool, not a migration lawyer's review. MOS's own pages (mos.cudzoziemcy.gov.pl) could not be reached through the proxy, so the national page and the form's language are CANNOT CHECK (OPEN-P1).

**The app:** the prototype has no permanent residence case, so none of the findings is in what it shows.

## Result in brief

- **The no-refund rule is narrower.** Art. 207b and 223a apply only to stamp duty paid with an application filed from 5.03.2026 (Dz.U. 2026 poz. 203 art. 29). Many older cases are still pending under the art. 100d suspension. Where a refund is due, from 1.10.2026 it is paid only on request (the stamp duty act art. 9 ust. 2, as rewritten by Dz.U. 2026 poz. 846 art. 14).
- **Fees, missing exemptions and relief:**
  - the stamp duty act art. 7 pkt 5: anyone showing a certificate of social assistance because of poverty;
  - no card fee for the first card of a repatriate's close family member, or on the UK route (UoC art. 236 ust. 1 pkt 1a, 1c);
  - a 50 % relief for hardship, for upper-secondary or university students, and for under-16s (art. 237);
  - the card fee is tied to issuing the card (art. 235 ust. 1), not to filing.
- **The Karta Polaka:** on any ground of the permanent permit, it loses validity by law on the day the permit's document is issued. It goes back to the voivode within 14 days of the final decision (the Karta Polaka act art. 20 ust. 1a, 3 pkt 2).
- **A missing condition:** a child of a Polish citizen qualifies only "pozostającym pod jego władzą rodzicielską" (art. 195 ust. 1 pkt 2).
- **The in-person exemptions are not the end of it.** For a child under 6, the voivode calls the parent to show the child's documents. For someone a specialist's certificate (issued no earlier than 3 months before filing) says cannot come, it calls for certified copies and a signature specimen (art. 203h ust. 2–3, 219h ust. 2–4).
- **A page against the act for its own case:** Podlaski's child page gives the last-day deadline with no exception. Art. 202 ust. 3 exempts that child.
- **Wording:**
  - the visa in art. 196 and 212 is a Schengen visa valid only for Poland, issued under art. 60 ust. 1 pkt 23, not any "humanitarian visa";
  - half counts for studies **or vocational training**;
  - the guardian is no longer "court-appointed" in the new art. 202 ust. 2;
  - the applicant signs with a trusted signature, not "a trusted profile";
  - the legal stay arises by law (art. 206 ust. 1 pkt 2), and the certificate confirms it.
- **Added, from the agent's list:**
  - the appeal's higher authority (UoC art. 22 ust. 2);
  - the 30 days of legal stay after temporary protection ends (art. 299 ust. 6a, 7, from Dz.U. 2026 poz. 203);
  - the fine for not reporting a lost card (art. 465 ust. 1 pkt 5);
  - the 3-yearly verification of the income criteria (the social assistance act art. 9 ust. 1, 8a);
  - the decision's language (the Polish language act art. 5 ust. 1).

## Verdicts and what changed

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| What it is; the grounds (pkt 1, 2, 4–6, 8–10); refusal; withdrawal; expiry | CONFIRMED | Pkt 3: art. 5 ust. 1 and 6 ust. 1–2 of the repatriation act; art. 195 ust. 3 added |
| Unbroken stay (permanent) | PARTLY | Art. 195 ust. 2c for the UK route |
| Refusal to start (permanent); what does not count (EU) | PARTLY (wording) | The Schengen visa of art. 60 ust. 1 pkt 23 |
| The EU long-term resident: what it is, conditions, income, Polish, transitional, unbroken stay, refusal to start, refusal, withdrawal, expiry | CONFIRMED | — |
| What counts toward the 5 years | PARTLY | "Studies or vocational training" |
| Who decides; when to file; how; what to attach; the flat; when filed; outage; documents; discontinuance; certificate; time limits; suspension | CONFIRMED | Certificate: art. 222a ust. 1–9 |
| For a child | PARTLY | "Court-appointed" removed |
| Signing | CONFIRMED | "Trusted signature" |
| In person | PARTLY | The replacement calls and the certificate conditions |
| Fees | PARTLY | Due on filing; the poverty exemption; 2026/203 art. 29; refunds on request; the card fee's timing, exemptions and relief |
| Cases before 27.04.2026 | CONFIRMED | "Started and not finished" |
| The card: validity, next card, Karta Polaka, lost card | CONFIRMED | The Karta Polaka act art. 20; the fine of art. 465 |
| Pages against the acts | CONFIRMED, incomplete | The child page's deadline; two photos for children |
| Inference on temporary protection | Label | It is a FACT (art. 213); the open part stays OPEN-P3 |
| OPEN-P2, P5 | Open; partly informed | The textual pointer (INFERENCE); art. 465 ust. 1 pkt 4 does not name the next card |
| Also used (MOS, stamp duty part III, card fee, art. 100d, the work act) | CONFIRMED | — |

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Why it matters (4 points) | CONFIRMED | — |
| Sources: "1794 from 27.04.2026" | PARTLY | Its card points 42–46 from 1.04.2026 |
| Content rule on amounts | PARTLY | The exemptions and the relief |
| §1: 5 years, spouse, Polish origin, a child born in Poland, protection, profession, studies | CONFIRMED | — |
| §1: Karta Polaka | CONFIRMED; one omission | "Valid"; the Karta Polaka act art. 20 ust. 1a, 3 |
| §1: a child of a Polish citizen | PARTLY | The parental-authority condition |
| §1: temporary protection | CONFIRMED | — |
| §1: EU citizens | CONFIRMED | UoC art. 2 pkt 2 cited |
| PL1, PL3–PL5, PL8–PL11, PL13, PL16; P4, P5, P7, P8 | CONFIRMED | P4: "trusted signature"; P8: art. 22 ust. 2 |
| PL6 | PARTLY | Only a certificate obtained by 30.06.2025 |
| P3 | PARTLY | The fees' timing, exemptions and relief |
| P6, PL12 | PARTLY | The replacement calls; 203i ust. 2; no refund only from 5.03.2026 |
| PL14 | PARTLY (wording) | The legal stay of art. 206 ust. 1 pkt 2 |
| Critical moment 2 | PARTLY | As PL12 |
| PS1, PS2, PS5, PS6, PS8, PS9, PS11, PS13, PS14, PS16, PS17, PS19 | CONFIRMED | — |
| PS3 | PARTLY | Refugee, subsidiary or humanitarian status also count for the 2 years |
| PS4 | CONFIRMED; one omission | The Karta Polaka act |
| PS7 | PARTLY | Universities exempt from approval; the course condition |
| PS10 | Label | The PESEL need labelled INFERENCE |
| PS12 | Wording | The stay is legal by law; the certificate confirms it |
| PS15 | PARTLY | Art. 29; refunds on request; art. 22 ust. 2 |
| PS18 | Missing | Art. 299 ust. 6a, 7 |
| PS20 | FACT without source | The Polish language act art. 5 ust. 1; MOS's form CANNOT CHECK |
| §6: re-verified every 3 years | CONFIRMED, no source | The social assistance act art. 9 ust. 1, 8a |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| `uoc-2025-1079-art140-195-243-extract.txt` | PARTLY | 2026/203 art. 29; the 1794 card points' dates; art. 22, 235–237 and 465 added |
| `amendment-2025-1794-art196-223-extract.txt` | CONFIRMED | — |
| `other-acts-permanent-extract.txt` | CONFIRMED; one gap | Art. 29 and the other new provisions added |
| The five page files | CONFIRMED | The child page's contradiction is in the README's table |

## Acts the files did not use, now quoted

In `other-acts-permanent-extract.txt`:
- Dz.U. 2026 poz. 203 art. 12 pkt 9 and art. 29;
- the stamp duty act art. 6 and art. 7 pkt 5;
- Dz.U. 2026 poz. 846 art. 14 pkt 1;
- the Karta Polaka act art. 20 ust. 1a–3;
- the social assistance act art. 9 ust. 1 and 8a;
- the Polish language act art. 5 ust. 1.

In the foreigners act extract: UoC art. 22 ust. 2, 235–237 and 465 ust. 1 pkt 4–5.

Named by the agent but not used here:
- the UdSC page on MOS subaccounts for children (07.10.2026);
- the UdSC fee page, which cites the repealed card fee regulation of 2014;
- Dz.U. 2026 poz. 676, which changes the Polish language act art. 11a ust. 3–7 but not ust. 2 (the certificate on the B1 list).
