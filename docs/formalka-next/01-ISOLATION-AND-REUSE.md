# 01 — Gate 0: isolation and what Formalka already has

Status: done (2026-10-15). Evidence: inspection of `wrzalkosowskilukaszz/formalka` at `main` 504a210 (the merge of PR #84), its workflows, deployment config, ADRs and packages.

Labels used in every document: **[FACT]** verified (source or code named), **[INFERENCE]** supported by evidence, **[HYPOTHESIS]** a design bet to test, **[OPEN]** open question, **[ASSUMPTION]** unverified.

## 1. What could leak from R&D into production

| Channel | What happens today | Risk for R&D work | Evidence |
|---|---|---|---|
| Git remote | One remote, `origin` = the production repo | Any branch pushed there is part of production's repo | [FACT] `git remote -v` |
| Vercel Git integration | Project `formalka-web` (root `apps/web`) builds every pushed branch; previews sit behind Vercel Authentication and use the Preview env (its own `DATABASE_URL`, the `formalka-preview` database) | A pushed R&D branch becomes a (protected) preview deployment with a database connection | [FACT] `apps/web/vercel.json`; STATUS.md "Production and operations"; PR #84 got a preview build within seconds |
| Netlify | Builds only branch `stage` (`ignore` command) | None unless `stage` is moved | [FACT] `netlify.toml` |
| GitHub Actions: CI | `push` to `main`, `pull_request`, manual | An R&D PR into the production repo runs CI with its secrets context | [FACT] `.github/workflows/ci.yml` |
| GitHub Actions: TLS chains | `push` to `main` and `claude/**` touching `content/**` | Fires on R&D branches that touch content | [FACT] `tls-chains.yml` |
| GitHub Actions: Worker | `schedule` (every 4 h, default branch only) and manual; holds `DATABASE_URL` (production) and Cloudflare credentials | Not triggered by branches; currently disabled by the owner | [FACT] `worker.yml`; workflow state `disabled_manually` |
| Withdraw / preview-db / tester-content | Manual only | None | [FACT] their `on:` blocks |
| Local environment of this cloud session | `DATABASE_URL` = `localhost` (session hook), no Vercel/Netlify/Neon CLI credentials, GitHub token scoped by the session; the Neon MCP connector is disconnected | Low; but the session's GitHub access reaches the production repo | [FACT] env names checked (values never printed); `.claude/hooks/session-start.sh` |
| `.env` files | None committed; `.env.example` lists names only | None | [FACT] |

## 2. Options for the lab

| | A. Separate local clone, isolated branches | B. Separate private repository | C. Git worktree with safety controls |
|---|---|---|---|
| Can it deploy by accident? | Yes, if a branch is pushed to `origin` (Vercel preview + preview DB) | No: no hosting integration, no secrets | Yes, same remote and same `.git` as production |
| Survives this ephemeral session | Only if pushed somewhere | Yes | Only if pushed |
| Shares credentials | Same remote, same token | Its own repo; session token scoped per repo | Same |
| Reuse of Formalka code | `git` history available | Read-only snapshots with provenance (source commit noted) | Full |
| Effort | Low | Low (owner creates the repo) | Low |
| Accident surface | Medium | **Lowest** | Highest (shared refs, hooks, stash) |

**Recommendation: B, a separate private repository** (`wrzalkosowskilukaszz/formalka-next`), approved by the owner 2026-10-15. ADR-N001.

Controls in place now (local repository `formalka-next`, created 2026-10-15):
- no remote until the owner's repository exists; then exactly one remote;
- a `pre-push` hook that refuses any URL other than `formalka-next` — **tested**: a push to `wrzalkosowskilukaszz/formalka` was refused by the hook;
- `.gitignore` for `.env*`, `.vercel/`, `.netlify/`;
- no workflows, no `vercel.json`, no `netlify.toml`; synthetic data only;
- code or content taken from Formalka is copied as a read-only snapshot with the source commit (504a210) stated.

Blocked: the session's GitHub integration cannot create repositories (HTTP 403, 2026-10-15). The owner creates the empty private repository; the lab is then attached and pushed. Until then the work exists only in this session's scratchpad.

When Formalka Next is approved for implementation, it moves into the main monorepo as new packages and an app (§4), built behind a feature flag and a separate deployment target the owner configures; the lab stays the research record.

## 3. Constraint that shapes everything: ADR-0009

[FACT] `docs/architecture/adr/0009-no-personal-data.md` (Accepted): no accounts, nothing stored on the server, conversations disappear when the tab closes, no uploads, no server-side reminders (deadline alarms go to the user's calendar via `.ics`, ADR-0015), personal data masked in the browser before any AI call, AI providers only with zero-data-retention terms.

The Formalka Next vision (persistent cases, a "Teczka" with documents, proactive notifications, a companion that remembers) contradicts ADR-0009 if built the usual way (accounts + server database). This is the first architecture decision, not a detail. The recommendation in `09-SYSTEM-ARCHITECTURE-AND-PLATFORM.md` is **local-first**: the case lives on the user's device, the server holds only public, verified knowledge, and AI calls carry minimal, masked, purpose-specific facts. That keeps ADR-0009's promise and avoids a server-side store of sensitive immigration data that a two-person team cannot safely run. Anything beyond it (sync, server push with content) needs a superseding ADR, a DPIA and the owner's decision.

## 4. Reuse assessment (actual code)

| Asset | Where | Verdict for Formalka Next | Why |
|---|---|---|---|
| Three-valued rules engine (`evaluate`, `selectFor`, `missingFacts`, traces) | `packages/rules/src/evaluate.ts`, `select.ts` | **Reuse** (core of planner and next-question selection) | Already decides which questions matter ("facts whose answers could still change the outcome") and never hides unknowns (rule 6) |
| Procedure model: steps with `dependsOn`, conditions, documents with `alternativeTo`, fees with `optional`, relative/fixed deadlines with `from`, pitfalls, handoff, `outcome`, `effectiveFrom/To` | `packages/domain/src/knowledge/procedure.ts` | **Reuse, extend** | It is most of a verified procedure registry; missing: task templates with completion evidence, cross-procedure links with conditions, event types (e.g. "a letter from the office") |
| Quote-backed values, snapshots, quote gate, verification levels, withdrawals, change detection, legal-act watch | `packages/domain/src/sources`, `apps/worker`, DB tables `quotes`, `snapshots`, `withdrawals`, `change_events`, `law_changes` | **Reuse as-is** | The reliability layer the validator depends on; nothing comparable exists in a general assistant |
| Fact catalogue (non-identifying questions with `whyWeAsk`, `unknownHelp`, kinds) | `content/facts/*.yaml`, `packages/domain/src/knowledge/facts.ts` (identifying keys rejected) | **Reuse, extend** | Intake asks only decision-relevant, non-identifying facts; form filling needs a separate, device-only "personal details" store (§10) |
| Journeys (goal-level composition of procedures with `when` rules) | `packages/domain/src/knowledge/journey.ts` | **Extend** into case templates | Seed of cross-case planning |
| Deadline status | `packages/rules/src/deadline.ts` | **Extend** | Needs "by the Nth day from event X" with the event date the user confirms |
| Privacy masking (PESEL, document numbers, phone, email, IBAN, addresses) | `packages/domain/src/privacy/mask*.ts` | **Reuse** before every LLM call | Already tested |
| Localization QA gate + termbase | `packages/i18n/src/qa`, `content/terminology/termbase.yaml` | **Reuse** for every generated or authored text | Catches added/dropped conditions mechanically |
| Smart search (Cloudflare bge-m3, hybrid ranking) | `packages/retrieval`, `apps/web/lib/smart-*` | **Reuse** for intent → procedure matching candidates | Measured: combined list top-3 93% on 96 questions (production index) |
| Device memory of answers | `apps/web/lib/memory.ts` | **Replace** with an encrypted local case store | Today page/device memory only, no structure for cases |
| Web app (Next.js App Router, per-request rendering with CSP nonce) | `apps/web` | **Isolate**: a new app (`apps/case` or similar), not a rewrite of the guide pages | Guides stay public, cacheable, SEO; the case workspace is an app shell |
| An LLM assistant | ADR-0006 describes capability adapters; **no assistant package exists** | **Build** (small) | Only design exists; nothing to migrate |
| Accounts, sync, server notifications | none (by ADR-0009) | **Do not build by default** | See §3 |

Not reusable as-is:
- [FACT] the 17 published guides were written as reading material. Several are not complete enough to generate a full case plan: the inventory (`docs/quality/INVENTORY-2026-10.md` in the production repo) found 13 P0 and 187 P1 issues, and the meldunek redesign lists 21 statements that still need a source.
- [INFERENCE] a planner must run only on guides that pass a stricter "plannable" bar (§06).
