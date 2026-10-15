# 12 — Cost model

Labels: **FACT** (read on a vendor page on the date given), **HYPOTHESIS** (a usage guess to measure), **OPEN**.
- The script is `tools/cost-model.mjs`; change its numbers and re-run `node tools/cost-model.mjs`.
- No paid API was called for this model.

## 1. Prices used (FACT, read 2026-10-15)

| Item | Price | Source |
|---|---|---|
| Claude Haiku 5.5 | $0.10 / $0.50 per M tokens in/out (prompts ≤100K; cache hit $0.01) | Anthropic pricing page |
| Claude Sonnet 5.5 | $2 / $10 (cache hit $0.10) | Anthropic pricing page |
| Claude Opus 5.5 | $4 / $20 | Anthropic pricing page |
| Batch API | −50% | Anthropic pricing page |
| Mistral Small 4 / Medium 3.5 | $0.15 / $0.60 and $1.5 / $7.5 | mistral.ai pricing, via search |
| Cloudflare Workers AI | 10,000 neurons/day free, then $0.011 per 1,000 neurons; bge-m3 $0.012 per M tokens | Cloudflare docs |
| Apple Developer Program | $99/year | Apple |
| Google Play developer account | $25 once | Google |
| Vercel Pro | $20/month incl. $20 usage credit | Vercel pricing |
| Neon | Launch $0.106/CU-hour, Scale $0.222/CU-hour, storage $0.35/GB-month | secondhand summary, **to re-check** on neon.tech |

Production today (FACT, from ADR-0016):
- Vercel **Hobby**, which is non-commercial only;
- Neon in Frankfurt;
- an owner budget cap of **about €10/month**.

ADR-0016 already says Vercel Pro is needed before anything is sold.

**Cache writes:** the cache-write premium was not read first-hand, so cached prompts are modelled only in the low scenario, as hits. The base and high scenarios assume no caching, which is conservative.

## 2. Usage hypotheses (per monthly active user)

| | Low | Base | High |
|---|---|---|---|
| AI intake extractions per month | 1 | 2 | 4 |
| Tokens per extraction (in/out) | 2,500 / 250 | 3,000 / 300 | 4,000 / 400 |
| Companion answers per month | 2 | 8 | 25 |
| Tokens per answer (in/out; the brief + registry excerpts + system) | 5,000 / 400 | 6,000 / 500 | 9,000 / 700 |
| Prompt caching | 60% of input cacheable, 70% hit rate | none | none |

Everything else in the product costs no AI tokens:
- structured questions;
- the plan, the validator and the diff;
- deadlines and reminders;
- form filling;
- the changes feed.

**AI is optional:** a user who never types free text costs $0 in AI.

## 3. Result: AI cost per month (USD)

| Extraction / companion model | Scenario | Per MAU | 100 MAU | 1,000 MAU | 10,000 MAU |
|---|---|---|---|---|---|
| Haiku 5.5 / Sonnet 5.5 | low | 0.020 | 2 | 20 | 204 |
| | base | 0.137 | 14 | 137 | 1,369 |
| | high | 0.627 | 63 | 627 | 6,274 |
| Haiku 5.5 / Haiku 5.5 | low | 0.001 | 0.14 | 1.40 | 14 |
| | base | 0.008 | 0.77 | 7.70 | 77 |
| | high | 0.034 | 3.36 | 34 | 337 |
| Mistral Small 4 / Medium 3.5 | low | 0.022 | 2 | 22 | 215 |
| | base | 0.103 | 10 | 103 | 1,033 |
| | high | 0.472 | 47 | 472 | 4,721 |

What drives the totals:
1. **The companion is about 99% of the AI bill**, and its model choice moves the total by about 18×. Extraction is negligible on any small model.
2. **Within the €10/month cap**:
   - a mid-size companion model (Sonnet- or Medium-class) fits only about 70–100 MAU at base usage;
   - a small model fits about 1,000 MAU.

   So before any public alpha, the companion must be one or more of:
   - **(a)** on a small model, if the evaluation (11 §2) shows it is good enough;
   - **(b)** capped per device per day, as smart search already is (ADR-0023);
   - **(c)** paid through Plus (ADR-0015);
   - **(d)** off.
3. **Per-device daily cap.** For example, 10 answers per day bounds the high scenario for heavy users. A global daily cap in the database, as smart search has, bounds the month at a chosen amount. Past the cap, the product keeps working without the companion.

## 4. Fixed and per-release costs

| Item | Amount | When |
|---|---|---|
| Vercel Pro | $20/month (absorbs small function and bandwidth use) | Before any sale; possibly before a larger public alpha (Hobby is non-commercial) |
| Neon | Today's plan **OPEN** (not read). The case store is on the device, so the server database grows only with the registry, which is small | — |
| Google Play | $25 once | Android internal testing (Phase 3) |
| Apple Developer | $99/year | iOS TestFlight (Phase 5) |
| Cloudflare embeddings | Already in production; inside the free daily allowance at current volumes [INFERENCE from ADR-0023 counters] | — |
| Domain | Existing | — |
| Paid consumer chatbots for the H1 benchmark | About 2 × $20 for one month [ASSUMPTION; to price and approve] | Phase 2, once |
| Legal review | No budget (ADR-0008). Free clinics/NGOs where possible; otherwise an **owner decision** | Before public release (10 §4) |

**Infrastructure scaling.** No server holds case data, so 10k MAU adds no database rows per user. Server load is limited to two things:
- registry requests, which are cacheable at the CDN, with ETag;
- changes-feed polls: about 1 small JSON request per device per day.

At 10k MAU that is about 300k cached requests per month [HYPOTHESIS], well inside Vercel Pro's included usage [INFERENCE; check the Pro limits page before relying on it].

## 5. The real cost: people's time (no cash, but the binding constraint)

| Work | Unit | Estimate [HYPOTHESIS] |
|---|---|---|
| Make one existing guide "plannable" (06 §2 bar P1–P8) | per procedure | 6–16 h owner + Claude: task templates, deadline rules with basis, office routing, quotes for each item, owner review |
| Keep a plannable procedure current | per procedure per month | 0.5–2 h (change alerts already exist; plannable items add task/deadline checks) |
| Review a form template (field map, never-fill list) | per form | 2–4 h; repeat when the hash changes |
| Native-reader check of a case's UI strings | per language per slice | 3–6 h, unpaid (community, NGO) **OPEN** |

**Consequence.** Slice 1 needs about 2–3 plannable procedures and 1–2 form templates, which is affordable. "All procedures as cases" is a maintenance job that grows linearly with coverage, and it is the real long-term cost. It is also why the plannable bar must stay strict and coverage must grow only where the evaluation shows value.

## 6. Unit economics against Plus (ADR-0015; illustrative)

ADR-0015's price hypothesis is 19–29 zł per 30-day pass, not validated.
- At base usage on Haiku/Sonnet, AI costs about $0.14 per active user per month.
- Even a 1% conversion at 19 zł covers it at 1k MAU, before payment fees, VAT and the merchant of record [HYPOTHESIS; fees not modelled; ADR-0015 says to model them first].
- The cost risk is heavy free users of the companion, not the average. Hence the cap in §3.

## 7. What to measure in the alpha (to replace hypotheses)
- tokens per extraction and per companion answer (gateway counters, no content);
- companion answers per active device per day (distribution, not the mean);
- share of users who use AI at all;
- registry and feed requests per device per day;
- editorial hours per plannable procedure (time log).
