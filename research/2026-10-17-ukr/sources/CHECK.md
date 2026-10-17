# Independent check: the UKR status, PESEL UKR and the CUKR card, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as last changed in 7ce207e:
- the map `docs/formalka-next/maps/cukr-ukr.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run at the owner's request ("Tak", 17.10.2026, to checking the three maps that had no check). This was the second of the three. It is read-only.
- It downloaded every text itself from api.sejm.gov.pl and every official page.
- The four PDFs the lab cites have the same sha256 as its downloads. Every body line of every extract is a verbatim slice of its own conversion.
- The two UdSC CUKR pages returned the same HTML hash and text as the lab's headers.
- It ran `amendments.mjs`, `touched.mjs --cite` and `entry-dates.mjs` on every act and read each transitional article they flagged.

**Then:** each provision behind a correction was re-read here from our own downloads. The new acts and the UdSC page of 06.08.2026 were downloaded again here, and their hashes match the agent's. The new text is in `other-acts-ukr-extract.txt` and `udsc-przedluzenie-ochrony-czasowej-2028-2026-10-17.txt`. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a migration lawyer's review.
- The EU decision itself could not be read: EUR-Lex returned HTTP 202 with an empty body for its HTML, PDF and ELI addresses. Later on 17.10.2026 its Polish text was read through publications.europa.eu content negotiation (`eu-2026-1912-pl-2026-10-17.txt`): art. 1 confirms 4.03.2028; art. 2–3 give other dates than UdSC's page (OPEN-C12 in the map; production's `ukr-military` note quotes UdSC's). The extension and the new condition rest on UdSC's page of 06.08.2026 and the Ministry of Family's material of 14.09.2026. For the wording, the agent read the Commission's proposal COM(2026) 345 (Council document ST 11011/26).

**The app:** the prototype has no UKR or CUKR case, so none of the findings is in what it shows. Its PESEL case shows production's registry notes on UKR. One of them, `ukr-military`, already quotes UdSC's page on the extension to 4.03.2028; this folder had missed it.

## Result in brief

- **Outdated: the status's end.** The EU extended temporary protection to **4.03.2028**: Council Implementing Decision (EU) 2026/1912 of 30.07.2026, in force 5.08.2026 (UdSC 06.08.2026: "do 4 marca 2028 r."). Under the protection act art. 106 ust. 1, the legal stay lasts "do dnia, w którym ta decyzja zachowuje moc obowiązującą". The files rested on the CUKR Q&A, "status UKR będzie ważny tylko do 04.03.2027 r.", which UdSC has not updated. No Polish act changed for this, so the source tools could not see it.
- **A missing condition for new arrivals.** Since 5.08.2026, temporary protection is granted only to those who have met their military obligations in Ukraine, "po przedstawieniu w stosownych przypadkach, odpowiedniego dowodu". It does not apply to those protected on and before 4.08.2026 without a break (UdSC 06.08.2026).
- **Art. 42x is not a filing deadline.** It makes the stay legal for those who file by 4.03.2027. The end of filing on that date is UdSC's statement only ("będziesz mógł złożyć do 04.03.2027 r."). Art. 42c pkt 2 needs the UKR status on the filing day, and the status now runs to 4.03.2028. Whether filing stays possible after 4.03.2027 is OPEN-C8. The map keeps 4.03.2027 as the safe date, attributed to UdSC.
- **Who may apply:** the act names only a Ukrainian citizen ("Obywatelowi Ukrainy", art. 42c). The former art. 1 ust. 2 counted a non-Ukrainian spouse and minor children as "obywatel Ukrainy". W203 art. 17 pkt 1 repealed it from 5.03.2026. No transitional rule keeping it was found. UdSC still names family members, which is a question for a lawyer (OPEN-C9). The intake now asks about citizenship as a condition of the law, never inferred (rule 4).
- **Two WRONG claims, both copied from UdSC's pages:**
  - The personal signature. Under art. 42f ust. 5 the applicant signs with a qualified signature or a trusted profile; a personal signature is allowed only for the representative of a person without full legal capacity.
  - What art. 42i ends. It ends only a temporary residence permit case started on the person's application. It does not end a work permit, a permanent residence or a long-term-resident case.
- **The 180 days are in the act** (art. 42l, from 4.05.2026; before, 90 days), not only UdSC's expectation.
- **The employer's notice for CUKR holders is unsettled.**
  - The act's old sentence saying no notice is needed was deleted from 4.05.2026 (W203 art. 17 pkt 30).
  - W203 art. 41 could be read to cover CUKR holders.
  - The official pages say no notice is needed. This is OPEN-C11, for a lawyer.
- **Dates:**
  - "Four later entry dates" is wrong: the date set by an announcement passed on 4.05.2026 (M.P. 2026 poz. 371). Three remain (1.01.2027, 5.03.2027, 1.09.2027), and none touches this map.
  - CU12's day 60 is a Saturday, 30.01.2027.
- **Fees, partly settled:**
  - The card fee is in the regulation Dz.U. 2022 poz. 1583: 100 zł. A replacement costs 200 zł only for a culpable loss or damage, and 300 zł for a repeated one. The Q&A's 200 zł for theft overstates this (OPEN-C4 closed).
  - Whether the stamp duty act's exemptions reach the art. 42s duty is OPEN-C10.
- **Monitoring:** a weekly run of the source tools would also have missed the EU decision. So the upkeep now also needs UdSC's news page and Monitor Polski's announcements. This is PROPOSED; setting it up is the owner's decision.

## Verdicts and what changed

### Map

| Claim (where) | Verdict | What the lab changed |
|---|---|---|
| The CUKR window closes on 4.03.2027 (status line, §5 `cukr-window`, level 5, U7) | PARTLY | 4.03.2027 is UdSC's filing date; art. 42x protects the stay of those who file by then; art. 42x also covers the card's cancellation and a discontinuance; OPEN-C8 |
| Critical moment 2: the status ends on 4.03.2027 | OUTDATED | 4.03.2028, EU 2026/1912 (EXT, UdSC 06.08.2026) |
| Ukrainian citizens and some family members (§1) | PARTLY | Art. 42c and the repeal of the old art. 1 ust. 2; OPEN-C9; intake question 6a |
| UKR covers other foreigners since 5.03.2026 (§1) | CONFIRMED | Population register act art. 8 pkt 24a lit. d cited |
| PESEL UKR within 30 days (§1, U0, CU1) | PARTLY | The military-obligations condition and its exception |
| U1: what the PESEL UKR application needs | PARTLY | In person, on paper; a photo; no fingerprints under 6; a signature specimen from 12 (UEL art. 44a ust. 3, 6, 9, 11, 19) |
| U3, intake Q5, the flowchart: art. 42i ends "a pending ordinary application" | PARTLY | A temporary residence permit case only |
| CU4: a work permit case ended by art. 42i | WRONG | A temporary residence and work permit case; a work permit alone is not ended |
| U4: four conditions | PARTLY | Three in art. 42c pkt 1–3; "on the day the card is issued" attributed to UdSC; citizenship added |
| U5: a personal signature | WRONG | Only for the representative of a person without full legal capacity (art. 42f ust. 5) |
| U5: W203 art. 23 | Missing | A trusted profile held on 4.03.2026 counts (PROT art. 110c) |
| U6, CU7: no exemption, no relief | PARTLY / CANNOT CHECK | The card-fee relief is excluded (art. 42k); the stamp duty exemptions are OPEN-C10 |
| U7: paper or e-mail left unexamined | CONFIRMED | Art. 42f ust. 7 cited |
| U8, CU11: 180 days as UdSC's expectation | PARTLY | Art. 42l cited; still no date; OPEN-C6 |
| U9: valid 3 years | PARTLY | A child's card lasts as long as the mother's (art. 42p) |
| CU12: collect by 30.01.2027 | PARTLY | A Saturday: go by Friday 29.01.2027; whether KPA art. 57 § 4 moves it is OPEN-C3 |
| CU13: a new application after a refusal | PARTLY | Only after the case ends (art. 42g ust. 5); the stamp duty is not refunded (art. 42s ust. 3) |
| CU16: six months abroad ends the permit | PARTLY | The voivode can withdraw it by a decision (art. 42t ust. 2) |
| CU18: no employer's notice | PARTLY | Art. 42v, W203 art. 17 pkt 30 and art. 41, the official reading; OPEN-C11 |
| CU19, OPEN-C4: the replacement fee | CONFIRMED / PARTLY | The card fee regulation § 2 and § 5; OPEN-C4 closed |
| §6: four later entry dates | WRONG | Three remain, none relevant; the EU decision named |
| Q1: the status "shows in mObywatel or on the PESEL confirmation" | Label overclaim | Now OPEN-C5 |
| Level 2: health care on UKR (PROT art. 112c) | CONFIRMED | Points to the extract in `research/2026-10-17-health/sources/` |
| OPEN-C7 | Answerable | Narrowed to the unread EU text |
| All other rows (among them U2, UL4, the NUE rows, art. 42d, the fees and payees, U8's travel and move, U9's pickup, address notice and appeal) | CONFIRMED | Some now cite the act beside the Q&A |

Not changed, as minor: U2's name of the work act. The map calls it "the act on employing foreigners"; the agent suggested its full title.

### Sources README and headers

| Item | Verdict | What the lab changed |
|---|---|---|
| The 2026 paragraph; art. 42c–42x from 4.05.2026; art. 100d | CONFIRMED | Art. 100d "in proceedings before a voivode"; a paragraph on the EU extension |
| When protection ends | CONFIRMED; one omission | Art. 109b ust. 3 (protection resumes after an international-protection case) |
| PESEL with the UKR status | PARTLY | The military-obligations condition |
| CUKR card: who | PARTLY | "Obywatelowi Ukrainy"; the repeal; UdSC's family members for a lawyer |
| CUKR card: how | WRONG | The signature; art. 42f ust. 7; the amounts' own sources (the stamp duty act's annex, the card fee regulation) |
| CUKR card: deadline | PARTLY | A discontinuance; art. 42x does not close filing; art. 42l |
| CUKR card: effect | PARTLY | A temporary residence permit case only |
| CUKR card: duties | CONFIRMED | The withdrawal is the voivode's decision |
| The status's end | OUTDATED | 4.03.2028 |
| How this meets the lab | Incomplete | The registry's `ukr-military` note named |
| Four later entry dates | WRONG | Three |
| Monitoring of four acts (PROPOSED) | Incomplete | UdSC's news and Monitor Polski added |
| OPEN-U1, U2, U3 | Answerable | U1 narrowed; U2 and U3 closed |
| ochrona-2026-862 header | CONFIRMED; one slip | Art. 112–113g are not in the README; art. 112c's extract named; the EU decision's effect on art. 106 |
| specustawa-2026-1293 header | CONFIRMED | — |
| uel-2026-384 header | PARTLY | M.P. 2026 poz. 370; lit. c and e in force since 4.05.2026; 1206 checked (in the README's file table) |
| wygaszenie-2026-203 header | CONFIRMED; omits art. 23, 32, 41 | In `other-acts-ukr-extract.txt`; the announcement date in the README |
| udsc-cukr-procedura, udsc-cukr-qa | CONFIRMED as the pages' words | Neither has an update date of its own, only the parent title "04.05.2026 r."; the Q&A's end of status is outdated. Where the pages differ from the act, the map now follows the act: the signature, "co najmniej 6 miesięcy", the 200 zł for theft, family members |

## Acts the files did not use, now in `other-acts-ukr-extract.txt`

- The special act's former art. 1 ust. 2 (consolidated Dz.U. 2025 poz. 337), for its history only.
- Dz.U. 2026 poz. 203:
  - art. 17 pkt 1, 27, 30 and 31;
  - art. 23, 32 and 41.
- M.P. 2026 poz. 371.
- The special act art. 42g (Dz.U. 2026 poz. 1293).
- The population register act art. 8 pkt 24a.
- The card fee regulation Dz.U. 2022 poz. 1583 § 5.

Also added: UdSC's page "Przedłużenie ochrony czasowej do 4 marca 2028 r." of 06.08.2026.

Named by the agent but not used here:
- the Ministry of Family's material of 14.09.2026 (same content as UdSC's page);
- Dz.U. 2025 poz. 1301 art. 10 and 1794 art. 8 (earlier changes to art. 42c, 42f, 42g and 42x, all in the consolidated text);
- KPA art. 41, 57 and 129;
- the regulation Dz.U. 2026 poz. 1180 under the protection act art. 110d ust. 7, which may bear on OPEN-C5.
