# Independent check: inviting a foreigner, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed on the branch (commit ac240e2; the matter 23 files are the same as at 288ebd1):
- the map `docs/formalka-next/maps/invitation.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with matters 19–26. It is read-only.
- It downloaded every act and page itself. All four act hashes in the extract header match its downloads, and none of the 185 quoted lines was missing from its own conversion. The text of both voivode pages is identical to its fetch.
- It read UoC with Dz.U. 2023 poz. 547, Dz.U. 2025 poz. 1794 and Dz.U. 2026 poz. 203; the KPA with Dz.U. 2025 poz. 769; the regulation; the stamp duty act with its amendments since 2023; the special act (Dz.U. 2026 poz. 1293); Dz.U. 2022 poz. 2185; and the 2024 consolidated UoC (Dz.U. 2024 poz. 769).
- It found no newer regulation on invitations and no amending act to it.

**Then:** each provision behind a correction was re-read here, from our own downloads (the hashes match the agent's):
- UoC art. 49 ust. 2–3, 52 ust. 1a, 53, 56, 195 ust. 4, 302 ust. 1 pkt 4, 336–337 (with footnote 14) and 343;
- Dz.U. 2023 poz. 547 art. 1 pkt 48 and art. 10–13 (art. 336 ust. 1a);
- the KPA art. 35 § 2–5, 65 § 1–2 and 163c–163e; Dz.U. 2025 poz. 769 art. 48;
- the regulation § 3–5;
- the stamp duty act art. 9 and annex part I item 28 and part IV; Dz.U. 2026 poz. 846 art. 14, 31, 32 and 35; the stamp duty changes in Dz.U. 2025 poz. 921, 1847 and 1795, Dz.U. 2026 poz. 1206 and Dz.U. 2023 poz. 1688, by their articles;
- the special act art. 100d ust. 1, with the date changes in Dz.U. 2024 poz. 854, Dz.U. 2025 poz. 1301 and Dz.U. 2026 poz. 203 (none of the four texts holds the word "zaprosz");
- Dz.U. 2022 poz. 2185 art. 35 and 81;
- both voivode pages, against their snapshots.

Not re-read here, because no correction rests on them: UoC art. 225a and M.P. 2026 poz. 370 (the agent's reading for OPEN-I1), art. 429, Dz.U. 2025 poz. 1794's register points, and Dz.U. 2024 poz. 769.

The new text is in the extract (its header and 10 new blocks), in the README and in the map. Every quoted line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a lawyer's review.
- No voivode's office was asked (OPEN-I1, I2, I4).
- The agent could not read the MOS invitation page (a certificate error, then HTTP 503); OPEN-I1 stays open.
- The country of a scenario's guest rests on no official text for Uzbekistan (now an ASSUMPTION); for Ukraine, on the border agreement's title in the Sejm API.

**The app:** the prototype has no invitation case, so none of the findings is in what it shows.

## Result in brief

- **The flowchart sent people the wrong way on who may invite.** Art. 49 ust. 2 pkt 1 requires a Polish citizen to live in Poland, and an EU, EEA, Swiss or UK citizen to live in Poland with a right of residence; it also covers their family members of any citizenship. The node "obywatel PL, UE, EOG, CH → Możesz zaprosić" told a Polish citizen living abroad that he may invite (the map's own critical error), and sent UK citizens and family members to the 5-year test. "Only some foreigners may invite" ignored that the pkt 1 group are foreigners too. Rebuilt.
- **The costs of a return decision are not sued for.** Art. 56 excludes them. They are set only when the decision is enforced, by a Border Guard decision that names who pays (art. 336 ust. 1–2); the inviter bears them under art. 337 ust. 2, the employer for work without a permit (ust. 4). The map said the inviter "can be sued for them". New FACT row and scenario IS6.
- **The 5 years were judged by the age of a residence card.** Art. 49 ust. 2 pkt 2 counts any legal, unbroken stay right before the invitation, and ust. 3 applies the break rule of art. 195 ust. 4, which the files never stated. The intake now asks for the whole legal stay and its breaks.
- **The simplified procedure was stated too absolutely.** KPA art. 163e § 1 also admits what the office can establish from its own data; art. 163d moves the case out of the simplified procedure when new circumstances matter and would lengthen it; art. 163c § 4 bars new demands, not evidence. "What is not filed does not count later" is gone.
- **The time limit cited the wrong paragraph:** KPA art. 35 § 3a (one month in the simplified procedure), with § 5 on what is not counted. The special act's art. 100d suspends no invitation; the files now say so.
- **"Not for work" was a FACT on the act.** Art. 51 ust. 2 pkt 7 only requires a notice on the form; the bar comes from the ZP page. Relabelled PAGES, and the inference through art. 50 ust. 1 pkt 8 dropped.
- **The extract header had two errors:** Dz.U. 2025 poz. 769 art. 1 took effect on 13.07.2025, not 1.01.2026; and the stamp duty amendments were named without their articles, so `touched.mjs --header` failed.
- **Smaller points:** the voivode who made the entry annuls it (art. 52 ust. 1a); the pro rata rule applies only when the whole period is shorter than a month (§ 3 ust. 2); the paid hotel booking and "in person" are the offices'; "send it to the guest" had no source; IL1–IL3 described behaviour as FACT. Missing: 17 zł for a proxy's power of attorney with its exemptions, and the refund of the 27 zł.

## Verdicts and what changed

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Status: production has no invitation procedure | CONFIRMED | Status: checked |
| Why, bullet 1 (only some foreigners) | PARTLY | The four groups of art. 49 ust. 2, with "right before" and the break rule |
| Why, bullet 2 (promises; sued for return costs) | WRONG in part | Sued for stay and treatment, under art. 56's condition; return costs by a Border Guard decision (art. 336–337) |
| Why, bullet 3 (nothing counts later) | PARTLY | KPA art. 163d and 163e § 1 |
| Why, bullet 4 (proof of means) | CONFIRMED | None |
| §1 "6 lat … mamę" | PARTLY | The break rule and "right before"; OPEN-I2 |
| §1 "karta pobytu od 2 lat" | PARTLY | Ask for the whole legal stay and the breaks |
| §1 German citizen | CONFIRMED | None |
| §1 work | PARTLY | PAGES (ZP), with the form's notice as the FACT |
| §1 annulment | CONFIRMED | The voivode who made the entry |
| §1 a family member; a Polish citizen abroad | Not in the map | New rows (art. 49 ust. 2 pkt 1) |
| I0; IL1 | CONFIRMED (basis); label wrong | Art. 195 ust. 4; IL1 is a HYPOTHESIS |
| I1; IL2 | PARTLY | The paid booking and the consent are PAGES; IL2 rewritten and a HYPOTHESIS |
| I2; IL3 | PARTLY | KPA art. 35 § 3a and § 5; art. 100d does not apply; IL3 a HYPOTHESIS, with the forwarding rule (KPA art. 65 § 1) |
| I3 | PARTLY | "In person" is WM's; "pass it to the guest" an INFERENCE from art. 49 ust. 1; the 17 zł and its exemptions |
| IL4 | CONFIRMED | None |
| IS1 | CONFIRMED | "The ticket's price, at least 2500 zł"; the country an ASSUMPTION |
| IS2 | PARTLY | Living in Poland (pkt 1), a seat in Poland (pkt 3); the whole legal stay |
| IS3 | CONFIRMED | No divisor in the regulation (OPEN-I4); the amounts worked out; the border agreement |
| IS5 | PARTLY | Art. 56's condition |
| IS6 | Not in the map | New: an enforced return decision's costs |
| Handoffs | CONFIRMED | The Border Guard and the return-decision map added |
| The flow | WRONG | Rebuilt with the residence conditions, the family and UK branch, the break rule and "nie wiem" |

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| Versions | PARTLY | The header rewritten: every change by article; `touched.mjs --header` passes for each act |
| WM, ZP dates; the KPA from the residence folder | CONFIRMED | KPA art. 35 § 3a–5 now in this extract |
| What it is for; who may invite; refusal; validity; the form; the documents; close family; the return; the fee | CONFIRMED | Who may invite: a new row on the unbroken stay (art. 195 ust. 4) |
| Where | PARTLY | Art. 52 ust. 1a |
| Collecting | CONFIRMED | The 17 zł in a new row |
| The procedure | PARTLY | Art. 163d, 163e § 1; art. 55b covers the entry case only |
| If promises are broken | PARTLY | Art. 56's condition; a new row on art. 336–337 |
| The inviter's money | PARTLY | "When the whole period is shorter than a month" |
| Time, suspension, the wrong office, refund, a power of attorney | Not in the files | New rows (KPA art. 35 § 3a, § 5, 65; SPEC art. 100d; FEES art. 9 and part IV; Dz.U. 2026 poz. 846) |
| Pages: not for work | CONFIRMED (the quote); weak inference | The inference dropped; the bar is PAGES |
| Pages: § 4, bank statements, hotel | CONFIRMED | The hotel: "made and fully paid by the inviter" |
| Pages: the owner's consent | PARTLY | ZP's rented-flat rule; WM's form |
| Pages: time | PARTLY | § 3a |
| Pages: the simplified procedure's date | CONFIRMED | Marked as checked (Dz.U. 2022 poz. 2185 art. 35, 81); "only formal gaps" goes beyond art. 163d–163e |
| Pages: collecting since 1.01.2025 | CANNOT CHECK (the date) | The date and "in person" are the office's |
| Pages: what it does; the legal basis | Not in the files | New rows: ZP's "konsul wydaje wizę" overstates art. 49 ust. 1; ZP cites older consolidated texts |
| Inferences | Correctly labelled | The temporary permit one rewritten (the whole stay); four new ones |
| OPEN-I1 to I3 | OPEN, correctly labelled | OPEN-I4 new (the pro rata divisor) |
| The tools note | CONFIRMED | `omitted.mjs` missed art. 195 ust. 4 and art. 336–337 |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| Extract: hashes and lines | CONFIRMED | Hashes for Dz.U. 2026 poz. 846 and 1293, and for the acts read for the dates |
| Extract: amendments | PARTLY (the 769 date WRONG) | 13.07.2025; each stamp duty change by article; Dz.U. 2023 poz. 547 on art. 336; the special act's date changes |
| WM page | CONFIRMED | None |
| ZP page | CONFIRMED | None ("names removed" refers to nothing there, which is harmless) |

## Acts the files did not use, now quoted

In the extract:
- UoC art. 195 ust. 4 and art. 336–337;
- the KPA art. 35 § 3a–5 and art. 65 § 1–2;
- the stamp duty act art. 9 and annex part IV; Dz.U. 2026 poz. 846 art. 14 pkt 1, 31 and 35;
- the special act art. 100d ust. 1.

Named by the agent but not used here:
- UoC art. 225a and M.P. 2026 poz. 370 (residence applications through MOS; no article from 49–57 named: the agent's INFERENCE that invitations stay on paper; OPEN-I1 stays open);
- UoC art. 429 ust. 2 (who keeps the register) and Dz.U. 2025 poz. 1794 art. 1 pkt 59–61 (other registers);
- KPA art. 64 § 2 (formal gaps);
- the stamp duty act art. 6 ust. 1 pkt 1 (the fee is due on filing).

## The tools

- `omitted.mjs` listed only the articles that name a quoted one. It now also lists the articles a quoted paragraph names but the extract leaves out, marking those it applies ("stosuje się"); on the first extract it prints art. 49 ust. 3 naming art. 195 (`tools/sources/omitted.test.mjs`; the lesson `docs/solutions/2026-10-16-read-the-whole-article.md`). Art. 336–337 name no quoted article, so only the agent found them.
- `touched.mjs --header` failed for the stamp duty act with an article cited, because the header named Dz.U. 2025 poz. 921 and 1847 without their articles. It passes now for UoC (art. 49–57, 195, 336–337), the KPA (art. 35, 65, 163b–163g), the regulation, the stamp duty act (art. 9 and the annex) and the special act (art. 100d).
