# 17. What is left to design before a beta

**Date:** 16.10.2026. **Prepared by:** Claude for the owner, Łukasz, at his request ("lista, co mamy do zaprojektowania, aby dostać finalną wersję beta").

Labels: FACT, INFERENCE, HYPOTHESIS, ASSUMPTION, OPEN.

## 0. What "beta" means here

**ASSUMPTION, for the owner to confirm:** the beta is the roadmap's **private alpha** (doc 13 §5, Phase 5). It means:
- invite-only;
- web, Android and iOS (ADR-N006 amendment);
- slice 1: address registration and PESEL (ADR-N007).

It is the first time people use Formalka Next **in their own real cases**. The external audit of 16.10 is NO-GO for that today. So the beta needs two things:
1. the designs below;
2. the gates that lift the NO-GO: §6 and doc 13 §5, Phases 1–4.

Status in the tables:
- **Proto:** in the experience prototype (`prototype/`) as a working design, but on synthetic data, with simulation where noted;
- **Part:** partly designed (in a document, a spike or the slice), with no final design;
- **None:** not designed yet.

Priority for the beta:
- **Must:** the beta cannot start without it;
- **Should:** expected, but the beta can start without it;
- **Later:** after the beta.

## 1. Product screens and flows (UX/UI)

| # | Area | Status | Priority | What is left to design | Source |
|---|---|---|---|---|---|
| 1 | Start: one input, case types, recent cases | Proto | Must | The final visual direction (DESIGN-BRIEF §4: three directions, then a decision); the input in four languages | 03 §4, DESIGN-BRIEF |
| 2 | First use and trust | None | Must | What Formalka is and is not; the AI disclosure (AI Act art. 50); where data lives (on this device); the language choice; no government look-alike | 10 §3, §5; rule 6 |
| 3 | Intake: questions, "Nie wiem", typed answers, whose case | Proto | Must | Correcting an answer after approval (owner decided on 16.10: allowed with a diff, approval and history; built on `lab/round2-correction`, needs design review); fact chips with "?" for unconfirmed facts; the four-language versions of the second-person questions (`voice.ts` is Polish only) | 03 §5 F1, 05 |
| 4 | Plan proposal and approval | Proto | Must | Final wording of the check; how uncertain items and both branches show (F5 Uncertainty) | 03 §5, §6 |
| 5 | **Case map** (live while building; timeline when active) | Proto (simplified) | Must | The owner asked for a more attractive map, placed better (16.10). Options are in the session report; the owner chooses. Also needed: parallel levels, locks with reasons, waiting, "Zakładamy", "Pominięte" | 03 §4, 15 §4, 16 |
| 6 | Teraz (focus): next action first | Proto | Must | The task-focus screen (why, how, documents, actions, evidence of done) as a full screen, not only cards | 03 §4, §6 |
| 7 | Changes: rules or facts changed (diff, accept or keep) | Proto (facts) | Must | A rule changed in the registry (F3 Returning: "the official page changed"); "Stale" state with the official link | 03 §5 F3, F4, §6; ADR-N003 |
| 8 | Teczka (documents) | Proto (mock) | Must | Real files on the device: photos and scans, import, preview, share and print, expiry dates; the "albo" alternatives | 08 §1 |
| 9 | Official form filling | Part (spike S3) | Must | Field review before filling; the never-fill list shown; preview; print and sign guidance; what if the office rejects a filled form (H7) | 08 §1, S3 |
| 10 | Reminders and notifications | Proto (simulated) | Must | The OS permission flow; quiet hours and one per day as settings; lock-screen privacy; `.ics` export; what happens on "Nie wiem" deadlines (O7) | 08 §3, ADR-N009 |
| 11 | Events: dates and outcomes (filing, decision, office's request) | Proto | Must | Typed decisions with instance and outcome (engine has them); entering a letter from the office (wezwanie) with its delivery date; evidence of done vs. "zakładamy" | 08 §2, audit F2 |
| 12 | Visits and calls | Proto | Should | What to bring (from documents); an office-visit mode (the brief's design benchmark); offices without data in the registry; never claiming a booking | DESIGN-BRIEF §8, 07, rule 6 |
| 13 | Waiting for the office (decision, card) | Proto | Should | Content review with the owner (art. 100d caveat), card-stage design, a status check path. The ponaglenie stays the official template, never drafted by us | registry `wait-*`; G journey |
| 14 | Hand-off and "Nie wiem" | Proto | Must | Free legal aid and other help per city; what the app says when no route fits | 05, rule 3 |
| 15 | Dashboard (all cases) and links between cases | Proto | Should | "Needs attention", upcoming confirmed dates, blocked, done; one assistant or many (personas are a hypothesis, audit F8) | 03 §4 |
| 16 | History and undo | Proto | Should | Who or what caused each change; export of the history | 03 §4, 07 §3 |
| 17 | Settings and data | None | Must | Language; reminders; data on this device: export, import (backup), delete a case, delete everything; consent per case | 03 §4, 10 §3 |
| 18 | Empty, error and offline states | Part (03 §6) | Must | Offline; registry update failed; a procedure not covered; a city without office data; app update; AI unavailable (F6 Failure) | 03 §5 F6, §6 |
| 19 | Accessibility and low digital skills | Part | Must | Screen reader labels across flows; dynamic type; contrast in both themes; tested with people of lower digital skill (audit, Phase 1) | DESIGN-BRIEF, audit |
| 20 | Four languages (PL, UK, RU, EN) | None (PL only) | Must | Copy in each language by native writers; layout with longer strings; the registry's translations shown where they exist | 05, 11 §2 |
| 21 | Desktop and tablet layout | Part (frame) | Later | A real wide layout beyond the phone frame | ADR-N006 |
| 22 | Companion (the assistant answering anything) | Proto (matcher) | Later | Only if the AI layer is approved: what it may answer, caps, the "proposals only" contract | 07, ADR-N005 |

## 2. Content and rules (what the plan stands on)

| # | Item | Status | Priority | What is left |
|---|---|---|---|---|
| 23 | Address registration and PESEL at the plannable bar | Part | Must | Fixes from the audit are in the lab (F4). Production content proposals are not applied (`PRODUCTION-CONTENT-PROPOSALS-2026-10-16.md`); the online channel is not modelled |
| 24 | Independent reference for the beta procedures | None | Must | Written by the owner or an expert, outside the engine (`eval/independent/README.md`); addr-01–04 first |
| 25 | Day-count reading for registration (06 §7 Q3) | OPEN | Must | Ask an office and a law clinic; until then both readings stay |
| 26 | Office data for every beta city | Part (Warsaw, Kraków) | Must | Addresses, hours and booking links for the other cities, or an honest "no data" |
| 27 | Maintenance routine (H6) | None | Must | A change log, time to detect and fix, the plans each change affects, time to republish |
| 28 | Other procedures (residence, citizenship, certificate) | Part | Later | Out of the beta; the audit found errors there |

## 3. System design

| # | Item | Status | Priority | What is left |
|---|---|---|---|---|
| 29 | Case store on the device | Part (ADR-N002) | Must | Encryption and keys, backup and export, deletion, device loss, the test of "deleting a case deletes its memory" |
| 30 | Registry delivery and versions | Part (manifest) | Must | Version check (ETag), offline copy, what a new version does to an active plan (diff, ADR-N003) |
| 31 | Notifications | None | Must | Capacitor local notifications; `.ics` |
| 32 | Apps | Part (ADR-N006) | Must | Capacitor shells; signing; Play internal testing; TestFlight |
| 33 | Form filler | Part (S3) | Must | pdf-lib port with appearance streams; tests on Android WebView and iOS Safari |
| 34 | AI layer | Part (contract) | Later | Only after the owner's decision (O5) and the AI thresholds (11 §2); the reader stays until then |
| 35 | Learning from use (ADR-N010) | Part | Later | Level 1 as session memory now; levels 2 and 3 NO-GO (audit) |

## 4. Trust, privacy and legal

| # | Item | Status | Priority | What is left |
|---|---|---|---|---|
| 36 | DPIA screening | None | Must | Doc 10 §4.1 |
| 37 | Privacy notice | None | Must | What stays on the device, what leaves (registry requests, outside links), no analytics or which |
| 38 | AI Act art. 50 disclosure | Part (in the UI) | Must | Final text; check against the regulation's text first-hand (10 §4.3) |
| 39 | Independence statement and official links | Proto | Must | App store listings too (10 §4.4) |
| 40 | Claims per environment | Part (RESPONSE §3) | Must | The same matrix for the beta build |
| 41 | Repository visibility | OPEN | Must | Public today; ADR-N001 says private |

## 5. Operations for the beta

| # | Item | Status | Priority | What is left |
|---|---|---|---|---|
| 42 | Invite flow | None | Must | Who is invited, how, how many |
| 43 | Feedback without personal data | None | Must | A channel that never asks for case details; what to do when someone sends them anyway |
| 44 | Incident runbook | None | Must | A wrong date or fee reported: how fast it is checked and fixed; who tells the people affected |
| 45 | Support boundaries | None | Should | What Formalka answers and what goes to legal aid |

## 6. Gates before the beta (not design, but they decide it)

- **Phase 1:** problem interviews (GO now) and moderated tests on fictional cases (conditional GO, address registration only; `prototype/README.md` test script).
- **The audit's NO-GO is lifted** only with:
  - the independent reference passing;
  - the content of the beta procedures verified;
  - the case store designed and tested;
  - the privacy work in §4 done.
- **The owner's decisions:**
  - repository visibility;
  - the beta's languages and platforms;
  - AI in the beta or not (O5);
  - personas;
  - ADR-N010 levels;
  - budget for store fees (O9).

## 7. Suggested order

1. **Now (Phase 1):** interviews; the visual direction (item 1); the map (item 5); settings and trust screens on paper (items 2, 17); the independent reference (item 24).
2. **After the moderated sessions:** fix what they show; then items 3–11 to final design; the case store (29) and notifications (31).
3. **Before invites:**
   - four languages (20);
   - accessibility (19);
   - privacy and legal (36–41);
   - operations (42–45);
   - an external re-audit.
