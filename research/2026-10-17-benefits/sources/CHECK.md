# Independent check: the child benefit 800+ for foreigners, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed in f685fd4:
- the map `docs/formalka-next/maps/child-benefit-800.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with the next matters. It is read-only.
- It downloaded every text itself from api.sejm.gov.pl and every page, and the Polish text of the EU decision 2026/1912 from publications.europa.eu.
- The hashes of the 800+ act (Dz.U. 2026 poz. 508), Dz.U. 2025 poz. 1301 and the Ministry of Family's page match its downloads. The three other pages are dynamic: their html hashes differ, and their text is identical line for line.
- All 443 quoted lines of the extract, as committed, appear word for word in its own conversion.
- To confirm that nothing else amends the 800+ act, it read the API's list (no amending act after Dz.U. 2026 poz. 203) and scanned 16 candidate acts of 2026. None names the act or "świadczenie wychowawcze". The API's index ends at Dz.U. 2026 poz. 1340 (15.10.2026), so anything published on 16–17.10.2026 could not be checked.

**Then:** each provision behind a correction was re-read here from our own downloads, with the same hashes:
- Dz.U. 2026 poz. 203 art. 30, 31, 43 ust. 1;
- Dz.U. 2025 poz. 1301 art. 10 pkt 13, 23;
- the 800+ act art. 23 ust. 1a and 3b–3e, and art. 25 ust. 3, 6 and 10;
- the social insurance system act art. 6 ust. 1;
- Prawo oświatowe art. 31 ust. 4–5, 36 ust. 4–7;
- the protection act art. 109b ust. 1;
- the health care act art. 66 ust. 1 pkt 24.

The new text is in the extract. Every line of it was checked against our own conversion. Two open points were found here: OPEN-B6 and B7 in the README. The corrections are changed in the lab; not independently verified.

**Limits:** it is a second reading by the same kind of tool, not a social security lawyer's review. The EU coordination rules and the bilateral agreements were not read (OPEN-B3, CANNOT CHECK).

**The app:** the prototype has no 800+ case, so none of the findings is in what it shows.

## Result in brief

- **The dates differ by group.** The files said the conditions apply from 1.02.2026, first for the period from 1.06.2026, for everyone of lit. c–f.
  - **PESEL UKR holders (lit. ca):** the act as changed applies from 5.03.2026, to the period from 5.03.2026 (203 art. 30). From 1.02.2026 to 4.03.2026 the special act art. 26 ust. 1a applied the same work condition (1301 art. 10 pkt 13 lit. b, 29 pkt 2). Benefits under the old wording ran to 31.01.2026 (1301 art. 23). Benefits granted under the special act run to the end of their period if the conditions are met (203 art. 43 ust. 1). This closes OPEN-B2.
  - **Art. 23 ust. 3a** (payment withheld until the school register confirms the duty) is from Dz.U. 2026 poz. 203, not 1301, and applies to lit. c–f first for the period from 1.06.2026 (203 art. 31). Art. 23 ust. 1a–1b predate both acts.
- **Work activity was too narrow:**
  - someone on unemployment benefit or a labour-office stipend is active, with no threshold and no 3- or 6-month limit (art. 2 pkt 1a lit. b; the social insurance system act art. 6 ust. 1 pkt 9). The 3- or 6-month rule is only for a registered unemployed person without another title, insured under the health care act art. 66 ust. 1 pkt 24;
  - parental leave (lit. c) and maternity or sickness benefits (lit. e) count too;
  - the 30 % threshold of lit. e applies only to the lit. d group. An ordinary business is under lit. a, at 50 %.
  - This closes OPEN-B1.
- **Missing for PESEL UKR holders:** more than 30 days abroad ends temporary protection itself (the protection act art. 109b ust. 1 pkt 2). The start month is the application month, not earlier than the PESEL UKR month (art. 18 ust. 2e).
- **Missing conditions and rules:**
  - a disability exempts only with a certificate, or a moderate or severe degree; a light degree does not (art. 1 ust. 2a);
  - the exclusion is for those "przyjętych w celu podjęcia studiów", not for anyone who studies;
  - for an applicant, missing an in-person call leaves the application unexamined (art. 23 ust. 3c);
  - a letter counts as delivered when opened, or after 14 days (art. 13a ust. 6);
  - no interest when the grant followed ZUS's own error; no decision after 2 years; a waiver, a deferral or instalments (art. 25 ust. 3, 6, 10).
- **A wrong scenario:** BS9 had a child of 6 with a deferred school start. At 6 the child does the preschool year (Prawo oświatowe art. 31 ust. 4). The deferral is asked in the year the child turns 7 (art. 36 ust. 5), and the deferred child continues preschool (art. 36 ust. 7).
- **The inferences:**
  - the one on cards without the annotation was wrong: lit. c, e and f depend on the permit's type, and a student's card carries the annotation (UoC art. 244 ust. 1 pkt 11; the work act art. 3 ust. 1 pkt 14);
  - the one on permanent and EU long-term resident cards is supported by the law (OPEN-B4 narrowed to practice).

## Verdicts and what changed

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| Production has nothing on benefits; the files' versions and dates | CONFIRMED | — |
| PA as in force on 17.10.2026 | PARTLY | 203 art. 30, 31, 43 ust. 1 quoted |
| The amount; who receives it; lit. a–g; living in Poland; a similar benefit abroad | CONFIRMED | "Admitted for studies", not "students" |
| The dates of the extra conditions | PARTLY | Split by group (above) |
| The work condition and its exemptions | CONFIRMED | The degree condition stated |
| What counts as work activity | PARTLY | Lit. a–h with their thresholds; the social insurance system act art. 6 ust. 1 |
| Unemployed with health insurance | CONFIRMED | Unemployment benefit recipients are active under lit. b |
| The school duty; withholding; the monthly check | CONFIRMED | — |
| School not confirmed (art. 23 ust. 3a) | PARTLY (date) | From 203; first for the period from 1.06.2026 (203 art. 31) |
| Which periods | PARTLY | 203 art. 30 |
| PESEL UKR: the start month; the in-person call | CONFIRMED | — |
| Leaving Poland | CONFIRMED; one omission | The protection act art. 109b ust. 1 pkt 2 |
| The work and school conditions for PESEL UKR "per ZUS" | PARTLY | The acts themselves (OPEN-B2 closed) |
| Where; how; the data; attachments; the period; the month; a grant; letters; gaps; changes; appeal | CONFIRMED | — |
| Undue benefit | CONFIRMED | Art. 25 ust. 6 and 10 added |
| Pages against the act ("3 dni"; 4.03.2028) | CONFIRMED | Seafarers and "the month that counts" added |
| Inference on cards without the annotation | WRONG (labelled as an inference) | Rewritten |
| Inference on permanent and EU long-term resident cards | Supported by the law | OPEN-B4 narrowed |
| OPEN-B1, B2 | Answered by the texts | Closed |
| OPEN-B3 | CANNOT CHECK | Open |

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Why it matters: the dates | PARTLY | By group |
| Why it matters: online only, 14 days | PARTLY | Delivered when opened or after 14 days; in-person calls |
| Sources line | PARTLY | 203, 1301 art. 10 and 23, the social insurance system act, Prawo oświatowe |
| §1: a card with the annotation; a Blue Card; a Polish child | CONFIRMED | — |
| §1: EU citizens | CONFIRMED | Living in Poland (art. 1 ust. 3) still applies |
| §1: PESEL UKR | PARTLY | The application month; 203 art. 30; art. 109b |
| §1: seasonal, studies, visa | CONFIRMED (wording) | "Admitted for studies" |
| §1: a disability | PARTLY | The degree condition |
| B0, B1, B2, B4, B6; BL1, BL3, BL4, BL7–BL10, BL12, BL13 | CONFIRMED | BL10: art. 109b; BL12: an applicant's application left unexamined |
| B3, BL11, critical moment 1 | PARTLY | Lit. b, c, d, e; the 3- or 6-month rule only without another title |
| BS1, BS3, BS7, BS10, BS11, BS13, BS15 | CONFIRMED | — |
| BS2, BS4, BS6, BS8, BS16 | PARTLY | As above |
| BS5 | CONFIRMED; one omission | The 30-day limit |
| BS9 | WRONG as a case | Rewritten: a child of 7; the deferral and preschool |
| BS12 | CONFIRMED for lit. c–f; open for lit. ca | OPEN-B6 |
| BS14 | INFERENCE, labelled | — |
| BS17 | No source | The Polish language act art. 5 ust. 1; ZUS's form an INFERENCE |
| Intake | CONFIRMED as cited | Q1: lit. e, f, g; Q4: unemployment benefit |
| Handoffs | CONFIRMED | The labour office an INFERENCE |
| Flow node W3 | PARTLY | As B3 |
| "Changed three times in a year" | CONFIRMED | — |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| `pomoc-panstwa-2026-508-art1-28-extract.txt`: the act, its hashes, no later amendments | CONFIRMED | 203 art. 30, 31, 43 named |
| The same: the dates of 1301 art. 9 pkt 1, 3–5 | WRONG in part | Pkt 3 is art. 13 ust. 3, pkt 4 art. 14, pkt 5 art. 21 ust. 1a; art. 23 ust. 3a is from 203 |
| The same: the label of art. 23 | WRONG | Ust. 3a–3g all from 5.03.2026 |
| The four page files | CONFIRMED | — |

## Acts the files did not use, now quoted

In `pomoc-panstwa-2026-508-art1-28-extract.txt`:
- Dz.U. 2026 poz. 203 art. 30, 31 and 43 ust. 1;
- Dz.U. 2025 poz. 1301 art. 10 pkt 13 and art. 23;
- the 800+ act art. 25 ust. 3, 6 and 10;
- the social insurance system act, consolidated Dz.U. 2026 poz. 199, art. 6 ust. 1 pkt 1–9c and 19–21;
- Prawo oświatowe, consolidated Dz.U. 2026 poz. 820, art. 31 ust. 4–5 and 36 ust. 4–7.

Cited from the lab's other folders:
- the protection act art. 109b ust. 1 (`research/2026-10-17-ukr/sources/`);
- the health care act art. 66 ust. 1 pkt 24 (`research/2026-10-17-health/sources/`);
- the Polish language act art. 5 ust. 1 (`research/2026-10-17-permanent/sources/`).

Named by the agent but not used here:
- the special act's own art. 26 (Dz.U. 2025 poz. 337), the basis until 4.03.2026, and its consolidated text Dz.U. 2026 poz. 1293, where art. 26 is repealed;
- the ratified social security agreements with Albania (Dz.U. 2026 poz. 1100) and Japan (Dz.U. 2026 poz. 1326), for OPEN-B3;
- the UdSC page on the military-service rule, whose dates differ from the Polish text of the EU decision 2026/1912 (it bears on the UKR map, OPEN-C12, not on this one).

Not confirmed here: the agent wrote that Dz.U. 2026 poz. 187 gives Prawo oświatowe art. 36 a new wording from 19.05.2028. In Dz.U. 2026 poz. 820, art. 36 carries no footnote. `touched.mjs` lists 187 art. 144 only for art. 13, 14, 15 and 32.
