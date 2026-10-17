# Independent check: moving, deregistering and leaving Poland, 17.10.2026

**What:** a check of every FACT in two sets of files, against the law in force on 17.10.2026 and the official pages, as committed on the branch (commit 5f6f854):
- the map `docs/formalka-next/maps/moving.md`;
- `README.md` (this folder) and the header of each extract and page file.

**Who:** a separate agent defined in `.claude/agents/official-fact-checker.md`, run when the map was made, at the owner's request to continue with matters 19–26. It is read-only.
- It downloaded every act and page itself. Every quoted line of the UEL extract matches its download. The hashes match too, except the Warsaw page's HTML, whose text matches.
- It read the forms regulation (Dz.U. 2022 poz. 2070), the special act, the act on foreigners, the KPA, the road traffic act, the stamp duty act, the informatization act and the e-delivery act. It also read the PESEL registration regulation (Dz.U. 2018 poz. 2484) and the 2022 text of UEL (Dz.U. 2022 poz. 1191).
- It searched for a notice that stops the online services and found none. A search can miss one, so it marked this CANNOT CHECK.

**Then:** each provision and page behind a correction was re-read here from our own downloads, with the same hashes:
- UEL art. 25, 33, 34 ust. 3, 36, 40, 41, 42 ust. 2, 59;
- the forms regulation § 1–3, and the notes of forms EL/ZPS/1, EL/ZC/1, EL/WPS/2, EL/WPC/2, EL/ZW/3 and EL/ZP/4, read on the rendered pages because the PDF's text layer garbles them;
- the special act art. 42m and 42q;
- UoC art. 108 ust. 1–2 with Dz.U. 2025 poz. 1794 art. 1 pkt 14 lit. a, and UoC art. 244 and 245;
- the informatization act art. 20a ust. 1 and 20c ust. 1;
- the e-delivery act art. 147 ust. 2;
- Dz.U. 2025 poz. 1006 art. 4 and 11, and Dz.U. 2024 poz. 854 art. 7 and 35;
- the gov.pl deregistration pages (the day of moving out).

The new text is in `other-acts-moving-extract.txt` and in the UEL extract (art. 34 ust. 3 and its header). Every quoted line was checked against our own conversion. The corrections are changed in the lab; not independently verified.

**Limits:**
- It is a second reading by the same kind of tool, not a lawyer's review.
- The PESEL registration regulation and the 2022 UEL text were read by the agent, not here.
- The forms' notes are quoted from the rendered pages, not from a text layer.
- No municipality was asked (OPEN-M2, M5).

**The app:** the prototype has no moving case, so none of the findings is in what it shows.

## Result in brief

- **A CUKR card shows no address, so a move does not require exchanging it.** The special act's art. 42m pkt 3 (from 4.05.2026) says such a card does not show the registered address. MS1, M2, the flowchart and the 14-day moment had sent every card holder to exchange the card. UoC art. 244 ust. 4 is a second exception that the map did not name.
- **Registering at a new address does not always end the old registration.**
  - UEL art. 33 ust. 3 says "może wymeldować się", and art. 34 ust. 3 puts it on the registration form.
  - The forms: registering a permanent stay ends the old permanent one automatically, and a temporary one only if its box is ticked. Registering a temporary stay works the other way round.
- **A departure for more than 6 months does end the temporary registration.** The forms say so (the departure form and the temporary deregistration form), and so does the gov.pl page. The README had read only the act.
- **The return's 30 days have no basis** in the act or the return form. OPEN-M2 is narrowed.
- **"By the day of moving out" is the pages' rule.** UEL art. 33 ust. 1 names no day.
- **The 30-day exemption counts the whole stay in Poland,** not the stay at one address (UEL art. 42 ust. 2).
  - MS9 is rewritten, and MS9a added for a foreigner who lives in Poland and stays a few weeks elsewhere. On the act's words, that person registers from the fourth day (INFERENCE; OPEN-M5).
  - The README's "the duty starts after 30 days of stay" was wrong in its wording.
- **The fine does not apply** to a family member of an EU, EEA or Swiss citizen (UEL art. 59 ust. 2). The map had left this out.
- **A Polish citizen's family member also has 30 days** (UEL art. 41 ust. 2a). The map and the flowchart had left this out.
- **Smaller corrections:**
  - KPA art. 41 sets no form for the notice, so "in writing" is now PROPOSED;
  - "a time limit can pass unseen" is INFERENCE;
  - MS4 now carries UoC art. 108's conditions, and the certificate since 27.04.2026;
  - MS10 now carries the e-delivery condition, and a passport for the office;
  - the voivode who exchanges a card is the one of the place of stay (UoC art. 245 ust. 3; CUKR: SA art. 42q); for a humanitarian stay, the Border Guard;
  - in M1, the reading of art. 40 ust. 3 is labelled INFERENCE;
  - that art. 25 ust. 4's 3 months reach EU citizens is labelled INFERENCE.
- **OPEN-M1 answered** (the forms regulation read). **OPEN-M4 narrowed** (the informatization act art. 20a, 20c).
- **The extract header** now lists Dz.U. 2025 poz. 1006 (from 30.06.2026) and 2024 poz. 854 art. 7 (from 4.05.2026). Neither touches a quoted article. `touched.mjs` had missed both (see "The tools").

## Verdicts and what changed

### Map

| Row | Verdict | What the lab changed |
|---|---|---|
| Why, bullet 1 (fourth day, 30 days; old registration; fine) | PARTLY | Art. 41 ust. 2a; the form and the kind of stay; art. 59 ust. 2 |
| Why, bullet 2 (the card) | PARTLY | The CUKR card and art. 244 ust. 4; the 14 days from the new registration (INFERENCE) |
| Why, bullet 3 (a pending case) | CONFIRMED | "A time limit can pass unseen" labelled INFERENCE |
| Why, bullets 4–5 | CONFIRMED | — |
| §1 "Wyprowadzam się bez nowego adresu" | PARTLY | The day is the pages' |
| §1 "A stay of 30 days or less" | PARTLY | "In Poland" |
| §1 other rows | CONFIRMED | — |
| M0 (ML1) | CONFIRMED | — |
| M1 (ML2) | PARTLY | The form and the kind of stay; the art. 40 ust. 3 reading labelled |
| M2 | PARTLY | The CUKR card (ML7); art. 244 ust. 4; art. 245 ust. 3 |
| M3 | PARTLY | "Written" made PROPOSED |
| M4 | CONFIRMED | — |
| M5 | PARTLY | The temporary registration's end on a >6-month departure; OPEN-M2 |
| Critical moment 2 | PARTLY | From the new registration; not a CUKR card |
| MS1 | PARTLY (wrong for a CUKR card) | Rewritten: which card |
| MS2, MS5, MS7, MS8, MS12 | CONFIRMED | — |
| MS3 | PARTLY | "In writing" PROPOSED |
| MS4 | PARTLY | Art. 108's conditions; the certificate |
| MS6 | CONFIRMED | The temporary registration's end added |
| MS9 | PARTLY (wrong as a resident's 3-week stay) | Rewritten; MS9a added |
| MS10 | PARTLY | The e-delivery condition; a passport at the office |
| MS11 | PARTLY | Art. 59 ust. 2 |
| Intake | — | The CUKR card; the family question (2a) |
| Handoffs | PARTLY | Art. 245 ust. 3–4; SA art. 42q |
| The flowchart | PARTLY | The family of a Polish citizen; the kind of stay; the card with an address; the pages' day; the >6-month departure |
| Change monitoring | PARTLY | The full list of UEL changes; the forms; the CUKR card |

### Sources README

| Row | Verdict | What the lab changed |
|---|---|---|
| For foreigners (art. 40) | PARTLY | Art. 41 ust. 1–2a; the 3 months labelled INFERENCE |
| Not for (art. 42) | CONFIRMED | "In Poland" quoted |
| Registering at the new address (art. 41) | CONFIRMED | — |
| The declared period; in person; the documents | CONFIRMED | — |
| The old address (art. 33 ust. 3) | PARTLY | "Może"; art. 34 ust. 3; the forms |
| The certificate; doubts | CONFIRMED | — |
| Deregistering: when | PARTLY | The act names no day; the pages' day |
| Deregistering: how; a child; by decision; a death | CONFIRMED | — |
| Leaving for good; by when | CONFIRMED | — |
| Leaving for more than 6 months | PARTLY | The forms: the temporary registration ends |
| The fine | CONFIRMED | — |
| The residence card | PARTLY | The CUKR card; who exchanges it |
| A pending case; a vehicle | CONFIRMED | — |
| Pages vs act: the end of a temporary registration | CONFIRMED (no step in the act) | The forms read too |
| Pages vs act: a departure for more than 6 months | PARTLY (it read only the act) | The page matches the forms |
| Pages vs act: the return's deadline | CONFIRMED | The return form read; OPEN-M2 narrowed |
| Pages vs act: online | PARTLY | The informatization act; the e-delivery act |
| Pages vs act: which temporary stay | Contradicted in its wording | Rewritten; OPEN-M5 |
| Pages vs act: the act's text; the certificate | CONFIRMED | — |
| Inferences 1, 2, 4, 5 | Supported | — |
| Inference 3 (a move means a new card) | PARTLY | The CUKR card; art. 244 ust. 4; counted from the new registration |
| — | — | Two inferences added: art. 108's conditions; a resident's short stay elsewhere |
| OPEN-M1 to M4 | Answered, narrowed, unchanged, narrowed | Rewritten; OPEN-M5 added |

### Headers

| File | Verdict | What the lab changed |
|---|---|---|
| `uel-2026-384-art24-43-59-extract.txt`: the act, hashes, the 27.04.2026 date | CONFIRMED | — |
| The same: amendments | Incomplete | Dz.U. 2025 poz. 1006 and 2024 poz. 854 art. 7 added; 1206's date (11.01.2027) |
| The page files: hashes and dates | CONFIRMED | — |

## Acts the files did not use, now quoted

- In `other-acts-moving-extract.txt`:
  - the special act art. 42m and 42q;
  - UoC art. 108 ust. 1–2, with Dz.U. 2025 poz. 1794 art. 1 pkt 14 lit. a; art. 244 ust. 4; art. 245 ust. 3–4;
  - the informatization act art. 20a ust. 1 and 20c ust. 1;
  - the e-delivery act art. 147 ust. 2;
  - the forms regulation § 1–3 and the EL/WPS/2 note (the other notes are quoted in the README).
- In the UEL extract: art. 34 ust. 3.

Named by the agent but not used here:
- the special act art. 100d (it suspends the voivode's time limits until 4.03.2027; it does not change the registration duties, the card's 14 days or KPA art. 41);
- the PESEL registration regulation (Dz.U. 2018 poz. 2484): it names no step at a temporary registration's end, by the agent's reading;
- the ministry's news of 27.05.2022 ("Zmiany w e-usługach").

## The tools

- **`touched.mjs` missed two amending acts.** Their general dates fall before the extract's legal state (10.03.2026), but some of their points apply later (Dz.U. 2025 poz. 1006 art. 4 pkt 2, 4, 5 from 30.06.2026; Dz.U. 2024 poz. 854 art. 7 from 4.05.2026 by announcement). The tool lists acts by their general date only. Neither touches a quoted article. The tool is to be changed so that it lists them (task C14), with a test and the lesson extended.
- `omitted.mjs`, run on the corrected UEL extract, marks nothing. The gap the agent found sits in art. 34 ust. 3, which does not name art. 33, and in the forms of a regulation, which the tool does not read.
