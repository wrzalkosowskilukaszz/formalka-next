# 02 — Gate 1: product thesis, competition and what would prove us wrong

## 1. What we would build (one sentence)

**A private case workspace for Polish administration: the user says what they need, Formalka builds a plan from verified official rules, does the paperwork that can safely be done for them (an official form filled in, a checklist for the office, a dated reminder), keeps the plan current when their facts or the rules change, and says plainly what it does not know.**

What it is not:
- not a chatbot that explains administration (mObywatel and general assistants already do that);
- not an agent that files anything with an authority (no such integration exists for a private app, §4);
- not legal advice.

## 2. Why someone would use it instead of ChatGPT or Claude

The honest starting point: most of the vision's surface can be copied quickly.

| Capability in the vision | Do general assistants have it? | Defensible for Formalka? |
|---|---|---|
| Chat in the user's language, dynamic questions | Yes | No |
| Persistent context per topic, memory across weeks | Yes: projects, memory [FACT, secondhand: third-party summaries of OpenAI help pages, 2026; not verified on help.openai.com] | No, on its own |
| Scheduled reminders | Yes: scheduled tasks [same caveat] | No, on its own |
| Filling a PDF | Yes: code execution can fill AcroForm fields | No, on its own |
| A companion persona | Trivial to add | No |
| A journey map UI | Weeks to copy | Weakly |
| **Rules that are quote-backed, dated, withdrawn when the source changes, identical across four languages** | No: answers come from model weights and web pages, unverified per answer | **Yes**, if maintained (§5 R4) |
| **A plan that a deterministic validator checks against those rules before the user sees it** | No | **Yes**, if it measurably lowers critical errors (H1) |
| **Office registry (which office, hours, booking link) per municipality and procedure** | Partly (web search) | Moderately |
| **Knowing the exact official form version and its field map** | No (ad hoc each time) | Moderately: needs per-form upkeep |
| **No account, case kept on the device, minimal facts sent to AI** | No (accounts, server-side history) | **Yes** for users who fear sharing immigration data; to be validated (H4) |
| **Accountability: who checked which rule, when; a correction log** | No | Yes |

**Supported inference:** the defensible core is not "AI" but *verified operational knowledge plus a verified execution layer on top of it*. A general model with browsing produces plausible plans. Formalka's claim must be that its plans are measurably more correct on what hurts people (deadlines, documents, who must go in person, fees). The claim must also be safer to act on (official forms, the right office) and cheaper in effort. That claim is testable (H1, H3) and not yet proven.

**If LLM intelligence became nearly free:** fluency, summarising and question-asking stop being differentiators; correctness of current Polish rules, their maintenance, the form and office data, and trust (privacy, no government impersonation, a visible correction record) remain. The product should be designed so that the LLM is replaceable and the registry is the asset (ADR-0006 already pins models behind capability adapters).

**The free official competitor:** mObywatel's AI assistant went live for all users on 31 December 2025 [FACT, press reports: xyz.pl, imagazine.pl, android.com.pl, jakiwniosek.pl]. It runs on PLLuM and draws on gov.pl content. It explains procedures and finds forms, and per the ministry has no access to the personal data in mObywatel. It is free, official and in Polish; its language coverage for UK/RU/EN is [OPEN]. Formalka Next must not compete on "explaining". Its space is case continuity, multilingual equivalence, private execution and cross-procedure planning for foreigners. This is also where mObywatel's scope stops, as far as public reports say.

## 3. Market scan (desk research only; no interviews done)

| Product | What it is | Relevance | Source quality |
|---|---|---|---|
| mObywatel virtual assistant | Government app's AI assistant (PLLuM), explains procedures, finds forms | Free benchmark for "explain"; sets user expectations | Press, Dec 2025–Jan 2026 |
| ChatGPT / Claude | General assistants with projects, memory, scheduled tasks, file handling | Main substitute | Vendor docs not checked first-hand (open) |
| Caselink (Berlin) | AI case management for immigration, B2B (companies, universities), plus a relocation service with a human expert per case | Shows B2B demand and the human-in-the-loop pattern | Company and directory pages; claims self-reported |
| Jobbatical | Employer-paid relocation and immigration with automated assessments, alerts, document management | B2B2C model; employer pays | Company pages |
| Mira (Netherlands) | Relocation via an AI agent on WhatsApp for individuals | Consumer AI relocation exists | One promotional article |
| Polish legalisation consultancies | Paid help with residence permits ("several hundred złoty" per consultation per one older article) | Willingness to pay exists for residence matters | Weak, dated; to be researched |
| NGOs and free legal aid | Free help with applications | Trust anchor and referral partner, not a competitor | Known |
| "Working and living in Poland" (MRPiPS) | Planned state portal for foreigners, incl. remote formalities | Possible future free competitor | Press, status unknown |

No claim of market uniqueness is made. Not found: a Polish consumer product that builds a verified, multi-case plan for foreigners. That is "not found in a short search", not "does not exist".

## 4. What a private app cannot do (constraints, not features)

- **Filing:** no public API exists for private apps to file residence (MOS), registration or PESEL applications on a user's behalf [INFERENCE: none found; MOS and gov.pl services are user-facing portals]. Formalka prepares; the person files.
- **Identity:** login.gov.pl (Węzeł Krajowy) integrations are documented for public-service systems. External integrators appear in COI documents, but no current public procedure for a private consumer app was found [OPEN: ask Integracje.WK@coi.gov.pl]. Do not design on it.
- **Bookings:** voivodeship and municipal booking systems have no public booking API found [ASSUMPTION]. Formalka links to the official booking page; a reminder is never an appointment.
- **Status tracking:** official case status lives in MOS or letters; Formalka knows only what the user tells it or uploads.

## 5. Falsifiable hypotheses and kill criteria

| # | Hypothesis | Measure | Continue if | Stop or rethink if |
|---|---|---|---|---|
| H1 | Plans from the verified registry with a validator have fewer critical errors than ChatGPT/Claude on the same scenarios | Blind-scored benchmark, 40 scenarios × 4 languages, critical error = wrong deadline, missing/extra required document, wrong office, wrong "can do online" (11-EVALUATION) | ≥50% fewer critical errors, no category worse | Difference <20% or any category worse |
| H2 | People return to a case without being chased | Share of alpha cases opened again within 14 days (device-local counter, opt-in export) | ≥40% | <15% |
| H3 | Formalka removes real work, not just explains it | Moderated test (n≥8): time to a correct, printed registration form + checklist vs. doing it with the official page alone | ≥10 min saved, 0 field errors, preferred by ≥6/8 | Users prefer doing it themselves or errors occur |
| H4 | "Your case stays on your phone, no account" is understood and accepted | Comprehension check + choice when told about loss risk without sync | ≥70% understand; ≤30% would refuse without an account | Most users expect and demand an account |
| H5 | Someone pays | Interviews with recent applicants (residence permits): stated price + an honest "Plus" offer when real features exist (ADR-0015: no pre-selling) | ≥20% of target users accept 29–49 zł for a case pass | <5%, or only B2B interest |
| H6 | One person can keep plannable rules current | Hours per month spent on change events for the pilot procedures, over 2 months | ≤4 h/month per procedure | >15 h/month per procedure |
| H7 | Intake reaches a plan with few questions without guessing | Questions asked vs. decision-relevant facts; wrong assumptions per case | Median ≤6 questions, 0 silent assumptions | Users abandon intake or wrong facts are inferred |

Evidence to justify building beyond the vertical slice:
- H1 and H3 met;
- H2 or H5 met;
- H6 met.

If H1 fails, the "verified" story has no measurable value, and Formalka should stay a guide site that improves its existing guides.
