# 13 — Estimates, pilot choice and roadmap

All estimates are **HYPOTHESES**. They are not calibrated against Formalka's own task history yet. That calibration is the first engineering action (00 §8).

- **Hours:** focused implementation hours at a solo-developer pace, whether Claude or a person writes the code.
- **Owner hours:** review, content checks and research, listed separately. In this project they are the binding constraint, because nothing ships without the owner's review.

## 1. Pilot choice

| Criterion | Address registration + PESEL | Temporary residence permit | Citizenship (grant by the President / recognition) |
|---|---|---|---|
| Frequency among target users | Very high: almost every newcomer, often first | High (most non-EU long stays) | Low; years after arrival |
| Hard deadlines a plan can track | **Yes**: 4 or 30 days from move-in; reminders matter | Some (apply before legal stay ends; respond to calls for documents) | Few; mostly open-ended waiting |
| Office and channel variation | Municipal; city variations exist (Warszawa, Kraków in the registry) | Voivodeship offices with very different booking reality | Voivode / President; uniform |
| Official form to fill | **Yes**, AcroForm, 110 fields, proven fillable (S3) | Long application, attachments, photos, fees | Long application, documents from abroad |
| Registry readiness (06 §2) | **Closest**: production guide exists; D-01 and redesign phase 0 in progress | Guide exists; open findings | Guides exist; discretionary outcome |
| Risk if we are wrong | Medium (a fine, a missed deadline) | High (illegal stay, work) | High (but slow, recoverable) |
| Length of the case | Days to weeks | Months | Months to years |
| Shows the "case" value (plan, deadline, form, office) | **All four** in one short case | All four, but with long waits and many unknowns | Mostly documents and waiting |

**Recommendation (ADR-N007):**
- **Slice 1 = address registration + PESEL** (template `arrive-register-address`).
  - It is short, frequent and deadline-driven.
  - It has an official fillable form and is the closest to the plannable bar.
  - It exercises the whole loop (intake → plan → form → office → reminder → done) in days, so it can be tested with real people quickly.
- **Slice 2 = temporary residence permit**, but only if all of these hold:
  - H1 holds on slice 1;
  - H6 holds, i.e. maintenance stays ≤4 h a month per procedure;
  - the residence guide clears the plannable bar.
- **Not citizenship as a pilot.** Few deadlines, a discretionary outcome and multi-year length make a weak test of the case model. It can come later as a document checklist case.

## 2. Effort by subsystem (hours: optimistic / realistic / pessimistic)

| # | Subsystem | Opt. | Real. | Pess. | Notes |
|---|---|---|---|---|---|
| 1 | `packages/case-engine` (planner, validator, diff, questions, deadline calculator) | 30 | 50 | 90 | From spike S1. The risk is in the rules for real procedures, not in the code |
| 2 | Registry additions (case/task/form templates), registry API, changes feed | 25 | 45 | 80 | Includes a production migration through the normal path, which needs the owner's approval |
| 3 | `packages/case-store` (event log, IndexedDB/OPFS + Capacitor storage, encryption, export/import) | 30 | 55 | 100 | Encryption-key handling and iOS storage are the uncertain parts |
| 4 | Case app UI: intake, plan/focus, task detail, Teczka, history, diff approval; 4 languages; mobile first | 80 | 140 | 240 | The largest item. Includes UI review rounds (WORKFLOW §1b) |
| 5 | Official form filling (pdf-lib port, appearance streams, template review tooling, device tests) | 20 | 40 | 80 | From spike S3 |
| 6 | Reminders (.ics reuse, Capacitor local notifications, permission flow, rescheduling) | 10 | 20 | 40 | |
| 7 | Android shell (Capacitor, signing, Play internal testing) | 15 | 30 | 60 | |
| 8 | Content: 2–3 procedures to the plannable bar, 1–2 form templates | 20 | 40 | 70 | Plus owner review time (§3) |
| 9 | Evaluation harness (structural: scenarios → plans → reference diff) | 15 | 25 | 45 | |
| 10 | Security/privacy: threat-model review, DPIA screening, privacy notice changes | 10 | 25 | 50 | |
| | **Slice 1 without AI (Phases 2–3)** | **255** | **470** | **855** | |
| 11 | LLM gateway + intake extraction + masking + schema checks | 30 | 55 | 100 | Off by flag until evaluated |
| 12 | Companion (brief builder, answer schema, proposals queue, audit log, caps) | 30 | 60 | 110 | |
| 13 | AI evaluation set (40 scenarios × 4 languages) + H1 benchmark | 15 | 25 | 45 | Plus native writers' time (unpaid, **OPEN**) |
| | **AI layer (Phase 4)** | **75** | **140** | **255** | |
| 14 | iOS shell + TestFlight | 20 | 40 | 80 | Apple fee (12 §4) |
| 15 | Alpha operations (invite flow, feedback without personal data, incident runbook) | 20 | 40 | 80 | |
| | **Private alpha (Phase 5)** | **40** | **80** | **160** | |
| | **Total to a private alpha** | **370** | **690** | **1,270** | |

## 3. Owner hours (not delegable)

| Work | Realistic |
|---|---|
| User research (Phase 1: 12–15 interviews, concept test, synthesis) | 45 h (30–70) |
| Decisions and reviews across Phases 2–5 (PRs, ADRs, UI reviews) | 60–100 h |
| Editorial check of plannable procedures and form templates | 15–30 h |
| Office calls/visits about filled-form acceptance (14 §6) | 3–6 h |

## 4. Calendar

### 4a. Calibration against Formalka's own history (2026-10-15, supersedes the solo figures in 4b)
The hours in §2 are at a hand-coding pace. Formalka's real pace with Claude writing the code is much faster [FACT, from the repository]:
- the first ADRs are dated 2026-09-30;
- by 2026-10-15, `main` has 297 commits, 71 merges, about 52,000 lines of TypeScript in `apps/` and `packages/`, 17 procedures with quotes, 4 languages and 480 e2e tests;
- that is about 2.5 weeks of calendar time.

Slice 1 plus the AI layer is smaller than what was already built.

**Recalibrated calendar [HYPOTHESIS; one data point, and that pace used many parallel agents, which the owner has since reduced to save usage]:**

| | Engineering | What doesn't compress |
|---|---|---|
| Slice 1 without AI | about 2–4 weeks | Owner review of every PR; content to the plannable bar |
| AI layer | about 1–2 weeks | The evaluation set needs native writers |
| Private alpha (Android, invites) | about 1–2 weeks | Play internal-testing setup |
| Phase 1 validation | — | Recruiting and running 12–15 interviews: about 3–6 weeks of real time |
| H6 measurement | — | 2 months of real time, by definition |

**Path to a private alpha: about 2–3 months.**
- The binding constraints are the research, the owner's review time and usage limits, not the coding.
- The coding can run in parallel with Phase 1 only for work that Phase 1 can't invalidate:
  - the case engine on real content;
  - the pdf-lib port.

### 4b. Hand-coding pace (original estimate, kept for comparison)

The owner's weekly capacity is not known [**OPEN**: owner].
- **Formula:** weeks = (engineering hours + owner hours) / weekly capacity, with review as the gate.
- **Solo (owner + Claude):**
  - at 15 h/week of directed work, the realistic path to a private alpha is about 690 + ~150 owner hours ≈ **55–60 weeks**;
  - at 25 h/week it is **about 34 weeks**;
  - slice 1 without AI alone is about **35 weeks at 15 h/week** [HYPOTHESIS].
- **Small team** (2 engineers + a part-time designer, with the owner as product owner and editor): realistic about **12–16 weeks** to a private alpha. The constraint shifts to editorial review and research, which a team doesn't speed up.
- **Cutting scope is the strongest lever:**
  - Phase 3 without the Android shell, using `.ics` reminders only, saves about 50–100 h;
  - Phase 4 with intake extraction only, no companion, saves about 60–110 h.

## 5. Phases and exit criteria

| Phase | What | Exit (all required) |
|---|---|---|
| **0. R&D (now)** | This lab: blueprint, ADR drafts, spikes S1 and S3 | The owner reviews the architecture and slice 1 (gate before any product code) |
| **1. Validate** | Interviews + concept test (03 §2); owner answers the day-count question (06 §7 Q3) and the "Nie wiem" reminder rule; 2–3 offices asked about filled forms | H4 and H7 signals; the pilot confirmed or changed; no product code |
| **2. Engine + registry** | PRs 1–4 below: case-engine, registry templates, plannable address registration + PESEL, validator in `content:check` | reg-01…05 pass in CI; the validator blocks bad plans; the existing site unchanged |
| **3. Slice 1 (no AI)** | PRs 5–9: registry API/feed, form filler, case app (web), case store, reminders (.ics; Android internal test) | Moderated test H3 met (n≥8); comprehension metrics (11 §1); 0 release-blocking failures (11 §4) |
| **4. AI layer** | PRs 10–12: evaluation set, LLM gateway (extraction), companion (capped) | AI thresholds (11 §2) met; H1 benchmark run and reported |
| **5. Private alpha** | Invite-only web + Android internal (+ iOS TestFlight); DPIA screening; privacy notice | H2 and H6 measured over 2 months; no incident |
| **6. Decide** | Slice 2 (residence permit) or stop/pivot | The decision rule in 02 §5 (H1 and H3; H2 or H5; H6) |

## 6. Pull request sequence (in the Formalka monorepo, after the owner approves Phase 2)

The lab never merges into Formalka. Code moves only as reviewed PRs into Formalka's repository, under its rules (WORKFLOW §1b, `pnpm verify`, the owner merges).

| PR | Content | Review triggers |
|---|---|---|
| 1 | ADRs accepted into `docs/architecture/adr/` (case model, local-first store, platform) | plan-guardian |
| 2 | `packages/case-engine` from spike S1, pure, with tests | code-reviewer |
| 3 | Registry schema: `case_templates`, `task_templates`, `form_templates` (migration; production run only by the normal path, with the owner's approval) | code-reviewer, security-reviewer |
| 4 | `content/`: address registration + PESEL to the plannable bar; validator in `content:check` | content-auditor, localization gate |
| 5 | Registry API + public changes feed (read-only JSON, behind a flag) | code-reviewer, security-reviewer |
| 6 | Form templates + device-side filler (pdf-lib, appearances) | code-reviewer, security-reviewer |
| 7 | `apps/case`: static shell, intake + plan + focus (no AI), protected deployment | ui-reviewer, copywriter |
| 8 | `packages/case-store`: event log, encryption, export/import | code-reviewer, security-reviewer |
| 9 | Reminders: `.ics` + Capacitor local notifications; Android internal build | code-reviewer, ui-reviewer |
| 10 | Evaluation harness + scenario set | code-reviewer |
| 11 | LLM gateway: extraction behind a flag, masking tests, no content logs | security-reviewer, code-reviewer |
| 12 | Companion behind a flag, capped | security-reviewer, ui-reviewer, copywriter |

## 7. What would change these estimates
- **Interviews show that people want an account and sync (H4 fails):** local-first changes, and a server case store adds roughly 150–300 h plus a privacy redesign. ADR-0009 would need superseding, which is an owner decision.
- **Offices reject software-filled forms:** S3's value drops. Keep the checklist and drop filling (saves about 40 h).
- **H6 fails** (maintenance over 15 h/month per procedure): stop at slice 1.
