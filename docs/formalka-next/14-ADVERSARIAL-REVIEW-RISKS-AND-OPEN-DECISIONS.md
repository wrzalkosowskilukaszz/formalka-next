# 14 — Adversarial review, risks and open decisions

This is the strongest case against Formalka Next that the author could build. Its sources:
- desk research (02 §3);
- the production repo at 504a210;
- the October quality inventory;
- spikes S1 and S3.

**No interviews have been done**, so every "users want" claim below is unproven.

## 1. The ten load-bearing assumptions

| # | Assumption | For | Against | Evidence today | Gap | Cheapest validation | Kill if |
|---|---|---|---|---|---|---|---|
| A1 | People want an ongoing **case** (plan, state, reminders), not one good answer | Procedures span days to months; people lose context (J8); deadlines carry fines | Most people ask once, act, leave. ChatGPT memory and projects already "remember" | None about our users | Whether people come back | Concept test (03 §2); return rate in alpha (H2) | <15% return within 14 days (H2) |
| A2 | Plans from the verified registry are **measurably more correct** than ChatGPT/Claude (H1) | The October inventory shows how subtle the rules are (e.g. D-01: a Pole's family picks "EU"). General models miss these | General models with browsing are good and improving monthly. Our own guides had 13 P0 findings in October, so "verified" was not error-free | Anecdotal; no benchmark | The whole H1 benchmark | 40 scenarios × 4 languages, blind (11 §5) | <20% fewer critical errors, or any category worse |
| A3 | One person (+ Claude) can keep plannable rules current (H6) | Change detection, quote gates and the worker exist and run | the published guides produced 475 findings in October (13 P0, 187 P1, 275 P2); plannable adds deadline rules, task templates and form hashes per procedure | Inventory volume | Hours per procedure per month | Time log on 2 pilot procedures for 2 months | >15 h/month per procedure |
| A4 | **Local-first, no account** is acceptable | ADR-0009; immigration data is sensitive; it is a real differentiator | Phone loss or a reinstall loses the case. People expect sync. Export/backup is friction few use | None | Comprehension and acceptance | Concept test with a loss-risk explanation (H4) | Most users refuse without an account and sync |
| A5 | **Deadline reminders** add value for address registration | 4-day deadline, fines (art. 41) | **By the time a newcomer finds Formalka, the 4 days may be gone.** Many register via employer, landlord or university help | None | When people learn about meldunek relative to move-in | Ask in interviews: "When did you first hear you must register, and how many days after moving?" | Most learn after day 4. Then reminders matter less than "what to do if late", and slice 1 should lead with that |
| A6 | **Filling the official form** saves real effort, and offices accept it | S3: 110 fields, fill and read-back work, owner part left empty | Offices may hand out their own forms or fill them at the desk. Some may distrust printed forms | S3 technical only | Office practice | Call or visit 2–3 offices (§6) | Offices refuse; then drop filling and keep the checklist |
| A7 | **AI intake** beats structured questions alone | Free text is natural; users describe situations, not categories | Structured intake with "Nie wiem" already works in production. AI adds cost (12), injection risk and extraction errors | Production structured intake works | Whether AI raises completion or accuracy | A/B in the concept test: structured only vs. free text first | No gain in completion or accuracy, so ship structured only |
| A8 | A **companion persona** ("Maciek", "Asia") helps comprehension or trust | Named guides help some audiences | It can read as gimmicky or as a person, which risks rule 10 (honest identity) and AI Act transparency | None | Effect on comprehension and trust | Named vs. unnamed in the concept test | No comprehension gain, or confusion about who is speaking |
| A9 | The money works: someone pays, and costs stay under the cap (H5, 12) | Plus passes (ADR-0015); AI is optional and capped | A €10/month cap; a mid-size companion fits only about 70–100 MAU; no lawyer budget; payment fees unmodelled | Cost model only | Willingness to pay | Interviews + the honest Plus offer when real (no pre-selling) | <5% accept a price that covers costs |
| A10 | People will **find** the case app | Guides already rank on official topics; a guide can offer "track this as a case" | A separate app splits traffic; app-store discovery is weak for niche topics | Guide-site traffic not measured publicly (cookieless counters only) | Conversion from guide to case | A "start a case" link on the address-registration guide in the alpha (counter only) | <2% of guide readers start a case |

**Most dangerous: A5 and A2.**
- **A5 can quietly hollow out the pilot.** The deadline may be gone before people arrive. Learning this costs one interview question.
- **A2 is the product's reason to exist.** If general models are as good on the critical items, the case layer is a nice UI and not a defensible product.

## 2. Over-engineering review (what to cut from slice 1)

| Proposed | Needed for slice 1? | Verdict |
|---|---|---|
| Task DAG with a general dependency graph | Slice 1 is linear (4 steps + a PESEL branch). But production steps already carry `dependsOn`, so the DAG costs little | Keep, as the existing `dependsOn`; no graph library |
| Event-sourced case store | An event log makes undo and history easy, but a state snapshot + an append-only history list is enough | **Simplify:** state + history list; full event sourcing only if sync arrives |
| Encryption at rest beyond the OS | The OS already encrypts device storage; app-level encryption adds key management and recovery problems | **Defer:** OS protection + optional app lock; encrypted export file only |
| Changes feed | Needed to mark tasks stale when rules change; a simple "template bundle version" check per open case does the same | **Simplify:** version check per open case's procedures |
| Action levels framework, audit table | Slice 1 has three actions (fill form, export calendar, schedule reminder) | Keep the levels as a rule in code review; a minimal audit list (what, when, approved) |
| Companion | Not needed to test A1, A5, A6 | **Cut from slice 1** (Phase 4, optional) |
| AI intake | Not needed to test the case value | **Cut from slice 1**; test A7 in the concept test first |
| iOS app | Web build covers iOS for the alpha (with export) | Defer to Phase 5 |
| Validator as a separate module | Yes: it is the safety claim, and S1 shows it is small | Keep |
| Question selector with weights | Slice 1 has 4 facts; a fixed order would do | Keep (≈40 lines, proven in S1); it pays off from slice 2 |

**After the cuts:**
- slice 1 = structured intake → validated plan → focus view → official form fill → `.ics` and Android local reminders → done/history;
- this removes roughly 150–250 h from the realistic estimate (13 §2, items 3, 11, 12, 14).

## 3. Risk register

| Risk | L | I | Mitigation | Owner |
|---|---|---|---|---|
| Wrong deadline or reminder date | M | H | Rules only; both day-count readings; earliest reading for reminders; release-blocking metric | Claude (code), owner (Q3 answer) |
| Content drift after rule changes | H | H | Change detection exists; plannable items marked stale; a version check per case | Owner + worker |
| Scope creep into an "all procedures" OS | H | H | Plannable bar; slices only after the H1/H6 gates | Owner |
| Lab leaks into production (credentials, deploys) | L | H | ADR-N001: separate repo, push guard, no secrets, no hosting link | Claude + owner |
| Data loss on device | H | M | Export/import, warning at plan approval, Capacitor storage | Claude |
| Looks official (rule 10) or a persona read as a person | M | H | Design review; AI disclosure; independence statement | Owner |
| AI cost overrun | M | M | Optional AI, small model by evaluation, per-device and global caps | Claude |
| App-store rejection (government information) | M | M | Independence statement and official links (ADR-0010) | Owner |
| Owner capacity (single point of failure) | H | H | Cut scope (§2); phases with stop rules; documentation | Owner |
| Legal exposure (advice vs. information) | M | H | Rule 9: official wording, handoff, no advice; free legal review where possible | Owner |

## 4. What this blueprint does not claim
- That users want it (no interviews yet).
- That it beats ChatGPT or Claude (no benchmark yet).
- That offices accept software-filled forms.
- That the costs hold (usage figures are guesses).
- That the estimates are calibrated.

## 5. Open decisions for the owner

| # | Decision | Options | Recommendation |
|---|---|---|---|
| O1 | Proceed to Phase 1 (validation, no product code)? | Yes / no / change scope | Yes; it costs mostly your time and answers A1, A4, A5, A7, A8 |
| O2 | Pilot | Address registration + PESEL / residence permit / citizenship | Address registration + PESEL (13 §1) |
| O3 | Platform | PWA only / React Native / web + Capacitor | Web + Capacitor; Android internal test first (09 §3) |
| O4 | Local-first, no account (keeps ADR-0009) | Keep / allow optional sync later | Keep for slice 1; revisit only if H4 fails |
| O5 | AI in slice 1 | None / extraction only / extraction + companion | None in slice 1; extraction in Phase 4 if A7 holds; companion capped and optional |
| O6 | Day-count reading (06 §7 Q3) | Ask a free law clinic / ask an office / keep both readings | Keep both readings (reminder on the earlier), and ask an office and a clinic in Phase 1 |
| O7 | "Nie wiem" on the deadline-deciding fact | No notification / a neutral "check your deadline" reminder at the earliest candidate | A neutral reminder at the earliest candidate date, as the safer option; confirm in the concept test |
| O8 | The private GitHub repository for the lab | Create `formalka-next` (private) / keep it local | Create it. Claude can't create repositories with its access; you create it and grant the Claude GitHub app access |
| O9 | Budget | Stay at €10/month / allow Vercel Pro and app-store fees when Phase 3–5 need them | Decide at the Phase 3 gate, not now |
| O10 | Your weekly capacity | A number | Needed to turn hours into dates (13 §4) |

## 6. Validation actions before any product code (Phase 1)
1. **Interviews (12–15):**
   - ask the A5 timing question first ("when did you learn about meldunek, how many days after moving?");
   - the A4 loss-risk question;
   - willingness to pay (A9);
   - which offices people used.
2. **Concept test (paper or clickable):**
   - structured vs. free-text intake (A7);
   - named vs. unnamed companion (A8);
   - comprehension of the plan and of "stays on your phone".
3. **Offices:**
   - ask 2–3 municipal offices by phone or e-mail about printed forms filled by software and signed by hand (A6);
   - ask how they count "najpóźniej w 4 dniu" (O6). Record answers as interviews, not as sources.
4. **Benchmark prep (no paid runs yet):**
   - write 10 of the 40 scenarios with native writers;
   - price the consumer subscriptions for the owner's approval (12 §4).
5. **Calibrate the estimates** against Formalka's task history (BUILD-PLAN, git log) and update 13 §2.
