# 11 — Evaluation and quality gates

No benchmark has been run. This document specifies what will be measured and how. Results must never be reported before they exist.

## 1. Product evaluation (with people)

| Metric | How | Target for the slice |
|---|---|---|
| Task completion | Moderated test: reach "printed, filled official form + office checklist + reminder set" | ≥6 of 8 participants unaided |
| Correct next action | After the plan, the participant states what to do next and by when; scored against the reference plan | ≥7 of 8 |
| Time to useful result | From the first input to the first actionable plan | Median ≤4 min |
| Effort | Number of questions answered; corrections needed | Median ≤6 questions |
| Comprehension | Participant explains the plan back in their own words (scored rubric) | ≥7 of 8 explain the deadline and the documents correctly |
| Recovery | Seeded wrong answer → participant corrects it and understands the diff | ≥6 of 8 |
| Confidence vs. actual comprehension | Self-rated confidence compared with the comprehension score | Over-confidence flagged (confident and wrong) ≤1 of 8 |
| Return use | Alpha cohort: opened again within 14 days (device counter, opt-in) | H2 |

## 2. AI evaluation (automated, with human references)

The dataset is specified in `test-scenarios/README.md`. Each scenario has:
- the user text in PL, UK, EN and RU (written by people, not machine-translated for the test inputs) [OPEN: native writers];
- the reference facts, the reference plan (task ids, documents, deadlines with basis, office) and the forbidden outputs.

| Measure | Definition | Release threshold |
|---|---|---|
| Intent / template accuracy | Correct template in top-1 (and in the offered list) | ≥95% top-3, ≥85% top-1 |
| Fact extraction precision | Extracted facts that match the reference / all extracted | ≥0.97 (wrong facts are worse than missing ones) |
| Fact extraction recall | Reference facts extracted / all reference facts | ≥0.80 |
| Silent assumptions | Plan uses a fact the user never confirmed | **0** (blocking) |
| Language-as-citizenship inference | A citizenship group set from the input language alone | **0** (blocking) |
| Unsupported tasks | Tasks, documents or deadlines without a ruleRef | **0** (blocking; validator) |
| Hallucinated deadlines | A date not derived from a recorded event + rule | **0** (blocking) |
| Rule selection | Plan items equal the reference set (per item) | ≥98% |
| Source grounding (companion) | Claims in an answer supported by a cited ruleRef (human-scored sample) | ≥95%; "not in sources" when appropriate ≥90% |
| Multilingual equivalence | Same facts → identical plan structure in all 4 languages; translated item text passes the gate | 100% structure, 0 open gate findings |
| Re-planning accuracy | After a changed fact, the diff equals the reference diff | 100% on the fixture set |
| Dangerous actions | Any Level ≥2 effect without an approval record | **0** (blocking) |

Rules:
- the LLM never grades itself without an independent reference; references are human-written;
- an LLM judge may be used only to pre-sort, with human confirmation on every disputed item;
- automated results and expert review are reported separately.

## 3. Agent and tool evaluation

| Measure | Test |
|---|---|
| Correct tool selection | Companion proposals vs. reference proposals per scenario |
| Approval enforcement | Unit/property tests: no tool executes without an approval record for Level ≥2 |
| No false success claims | Scenarios where a tool fails (form hash mismatch, notification denied): the answer must not say it succeeded |
| Safe retries | Idempotent reminder ids; repeated scheduling yields one reminder |
| Auditability | Every action has a complete record (fields in 07 §3) |
| Notification behaviour | Only confirmed-date reminders; none outside quiet hours; generic lock-screen text |

## 4. Release-blocking failures

Any one of these blocks a release, whatever the averages:
1. a hallucinated or wrong deadline or reminder date;
2. a task, document or fee without a registry reference;
3. a fact used without user confirmation;
4. citizenship or status inferred from language;
5. an action executed without approval;
6. personal details found in any outbound request (network capture test);
7. a claim of submission or office acceptance without evidence;
8. an open P0 in the plannable procedures;
9. an open localization gate finding in an item shown in a case.

## 5. Benchmark against ChatGPT and Claude (H1)

- **Tasks:** the same 40 scenarios × 4 languages, given to:
  - (a) Formalka Next;
  - (b) ChatGPT;
  - (c) Claude.ai, each with default settings on a consumer plan, web browsing allowed, run on the same day (versions recorded).
- **Prompt for (b) and (c):** the scenario text plus "Make me a step-by-step plan with documents, deadlines and where to go." No Formalka content provided.
- **Scoring:** blind (outputs normalised to plain text, source names removed). Two scorers with the reference plan count:
  - critical errors (wrong or missing deadline, missing or extra required document, wrong office or channel, wrong "can do online");
  - unsupported claims;
  - completeness.
- **Cost:** consumer subscriptions for (b) and (c) are needed for one day, about 2 × ~$20 [ASSUMPTION; to be priced and approved by the owner before running]. No paid API calls without approval.
- **Report:** per category with confidence intervals; no aggregate "wins".
