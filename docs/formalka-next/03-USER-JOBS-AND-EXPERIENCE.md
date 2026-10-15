# 03 — User jobs and the experience

All of this is **desk research and design reasoning**. No interviews or usability tests have been run for Formalka Next. Earlier Formalka evidence that does exist:
- an agent dry run and owner walkthroughs;
- the October 2026 inventory's four-persona journey walk (`docs/quality/` in the production repo).

These are simulations, not users.

## 1. Jobs to be done

| # | Situation | Job ("When…, I want…, so I can…") | Desired outcome | Today's alternatives | Where it fails | Trust needs | Return use | Willingness to pay [HYPOTHESIS] |
|---|---|---|---|---|---|---|---|---|
| J1 | Knows what to file | When I know I must register my address, I want the right form filled in and the list of what to bring, so I go to the office once | One visit, accepted | gov.pl card, office page, a friend | Wrong form (temporary vs permanent), missing owner signature, 4-day deadline missed | Official form, official wording one tap away | Low (days) | Low; free core |
| J2 | Knows the outcome, not the procedure | When I start a job in Poland, I want to know which procedures apply, in what order | A correct ordered plan | Employer HR, Facebook groups, ChatGPT | Confusing permit vs. registration vs. PESEL; wrong order | Every step traceable to an official source | Medium (weeks) | Medium |
| J3 | Unsure which obligations apply | When I arrive, I want to know what I must do and by when | No missed obligation | Word of mouth | Hidden short deadlines (4 days) | "We don't know" said plainly | Medium | Low–medium |
| J4 | Already started | When I filed in MOS, I want to know what comes next and what I may do meanwhile | Not losing legal stay, no missed summons | MOS, consultants | The waiting period is opaque; letters with short deadlines | Exact source, dates | High (months) | **Highest** (residence) |
| J5 | Hit an obstacle | When the owner won't confirm my address, I want my options | Still registered | Office, NGO | Users don't know the official fallback exists | Official steps, not tips | Low | Low |
| J6 | Got a letter | When the office sends a request to supplement, I want to know what it asks, by when, and how to respond | Respond in time, completely | Lawyer, consultant | Missing the deadline, misreading the request | No invented remedies; human help pointed to | High | **High** |
| J7 | Several procedures at once | When I need registration, PESEL, a permit and a doctor, I want one view of what blocks what | Correct order, nothing forgotten | Notes, spreadsheets | Dependencies unknown | Each dependency sourced | High | Medium |
| J8 | Returning after weeks | When I come back, I want to see where I am without re-reading everything | Resume in under a minute | Re-asking ChatGPT, own notes | Context lost, rules changed meanwhile | "Changed since you were here" shown | High | Medium |

Variation to design for (never inferred from each other, rule 5):
- Polish proficiency (none to fluent), and reading ability in the UI language;
- administrative knowledge, digital skills and confidence;
- accessibility (screen readers, low vision, cognitive load);
- device (low-end Android over mobile data is common; desktop for form printing);
- family situation (helping a parent, a child's case);
- legal situation (EU, UK WA, UKR status, CUKR, visa, visa-free, no valid stay).

Nationality never sets tone, persona or assumptions.

## 2. Lean validation plan (before Phase 2 code)

1. **Recruit 12–15 people** with a procedure in the last 6 months: 6 address registration and PESEL, 6 residence permit, plus 2–3 helpers who did it for someone. Channels: NGOs (with permission), university international offices, community groups. Paid with a voucher; consent; **no personal documents collected** (ADR-0009).
2. **Interviews (45 min, in the person's language with an interpreter where needed):** last procedure walked through on a timeline; where they lost time; what they paid for; what they would never share with an app.
3. **Concept test (paper or clickable wireflow, no AI):** the plan and focus view for J1/J4; comprehension of "your case stays on your phone".
4. **Synthesis:** every quote tagged to a job above; jobs re-ranked by evidence. Interviews are reported as interviews, never mixed with desk research.
5. **Decision:** confirm or change the pilot (13 §1) and H2, H4, H5.

## 3. Three experience models

| Criterion | A. Chat-first | B. Structured guided | C. Hybrid: conversation in, structure out |
|---|---|---|---|
| First use for a stressed newcomer | Easy to start, hard to know when you're done | Clear but can feel like a form | Starts as one question, then shows structure |
| Accuracy of collected facts | Free text → extraction errors; ambiguous answers | High (options) | Options for decision facts, free text accepted and confirmed |
| "I don't know" | Awkward | Native | Native |
| Plan comprehension | Plan buried in messages | Clear | Clear: a plan view the conversation feeds |
| Returning after weeks (J8) | Scroll history | Clear | Clear: plan + "what changed" |
| Accessibility (screen reader, cognitive load) | Long streams are hard | Good | Good if the plan is a real list, the map an enhancement |
| Low literacy / low Polish | Needs good writing | Needs good labels | Both; the companion rephrases |
| Error recovery (wrong answer) | Hidden in history | Edit an answer | Edit a fact; the plan shows a diff |
| Effort to build | Low for a demo, high for reliability | Medium | Medium–high |
| Differentiation vs. ChatGPT | None | Some | Most: the structure is the product |

**Recommendation: C**, with the rule "**conversation collects, structure decides**". Facts are confirmed as structured chips before they change the plan. The plan, tasks and documents are structured objects. The companion explains and drafts, but never owns state.

## 4. Information architecture

```
Start ("Co dziś załatwiamy?")          ← one input + recent cases
└─ Intake (conversation + fact chips)   ← per new goal
   └─ Plan proposal (review, correct, approve)
      └─ Case
         ├─ Plan            (milestones, tasks; map view = enhancement of the list)
         ├─ Task focus      (one task: why, how, documents, actions, evidence of done)
         ├─ Teczka          (forms, drafts, checklists; local files)
         ├─ Companion       (sheet over any view, knows the current case and screen)
         └─ History         (every change, who/what caused it, diffs)
Dashboard (all cases: needs attention, upcoming confirmed dates, blocked, done recently, links between cases)
Settings (language, reminders, data on this device: export, wipe)
```

Navigation rules:
- every screen has one primary action;
- the companion never replaces navigation; its answers link to the object they talk about (task, document, source);
- deep links exist for every task, so a reminder opens the exact task.

## 5. Key flows (wireflow descriptions)

**F1 First use → plan**
1. Start: "Co dziś załatwiamy?" The input accepts any language.
2. Intake: the system states what it understood as chips, for example "Goal: register address", "City: Kraków (?)", "Stay: temporary (?)". Chips marked (?) are unconfirmed.
3. One question at a time, chosen by the planner (05). Each question has options, "Nie wiem", and a "why we ask" fold.
4. A preliminary plan appears as soon as the goal and one deciding fact are known: "6 steps, 2 still depend on your answers".
5. When the termination criteria are met, the plan proposal shows milestones, tasks, documents, dates, fees and sources, with uncertain items marked. The user corrects facts, then taps "Zapisz plan" (save the plan); the plan becomes version 1.

**F2 Task execution (J1, the slice):** Task focus "Fill in the form" → "Fill it for me" → a device-only form asks only the fields the official form needs, never sent anywhere → the official PDF is filled on the device and saved to Teczka → "Print or save" → the task asks "Did you print and sign it?". The user confirms, and the task becomes done (user-confirmed).

**F3 Returning (J8):** Dashboard card "Since you were here: the 4-day deadline is tomorrow; the official page for Kraków changed on 12 Nov (one task affected)" → open the diff → accept or keep.

**F4 Changed circumstances:** The user edits the fact "City" from Kraków to Warszawa. The plan recomputes into a *proposed* plan v2 with a diff: 1 task changed (office), 0 removed. Completed tasks are never removed; inapplicable ones are marked "no longer needed (because …)". The user approves, and v2 becomes active.

**F5 Uncertainty:** A decision fact is unknown → the plan shows both branches, labelled, never one silently. If sources disagree, the item shows each position with its source (as Formalka guides do), and a "what you can do" line pointing to the office.

**F6 Failure:** The AI is unavailable → intake continues with structured questions only; the companion is "temporarily unavailable"; nothing else breaks. If a source is withdrawn, its tasks are marked "the official rule is being re-checked" and show the official link. No new plan is generated from that source until it is published again.

## 6. Screen-state contract (applies to every case view)

| State | Shown when | Must show | Must not |
|---|---|---|---|
| Empty | No case | One input, example goals, privacy line | A dashboard of nothing |
| Building | Intake in progress | Confirmed vs. unconfirmed facts, what's still needed | Fake progress, artificial delays |
| Proposed | Plan not yet approved | Sources, uncertain items, "approve" | Reminders (none until approved) |
| Active | Approved plan | Next action first, then the rest | Gamified pressure |
| Changed | Rules or facts changed | Diff, reason, accept/keep | Silent rewrites |
| Stale | Source changed and not re-checked | Warning + official link | New derived dates |
| Done | All required tasks confirmed | What was confirmed by whom (user/system) | "Approved by the office" unless evidence exists |

Visual delight:
- the journey map is an optional rendering of the same task list;
- motion follows `prefers-reduced-motion` (ADR-0019, motion engine);
- no animation is used as a loading disguise.

Mobile first: one-hand reach, bottom sheet for the companion, list before map on narrow screens. Desktop is two-pane, plan and focus side by side, for form printing and long reading.
