# 06 — Verified procedure registry, planner and plan validator

## 1. What already exists (production, 504a210)

[FACT] Formalka already has most of the registry:
- procedure versions in PostgreSQL, immutable once published (ADR-0011);
- every value quote-backed against a stored snapshot of the official page (quote gate);
- verification levels (`auto_structured`, `checked`, `sources_disagree`, `source_changed`);
- withdrawals honoured at read time;
- change detection on tracked pages (`change_events`) and on legal acts (ELI watch, `law_changes`);
- conditions as machine-readable rules over a non-identifying fact catalogue;
- three-valued evaluation that shows unknowns;
- localization QA gate on translations.

Formalka Next adds three things on top: **case templates**, **task templates** and **form templates** (`schemas/registry-additions.sql`). It also needs a stricter publication bar for anything a planner may use.

## 2. The "plannable" bar

A guide being published does not make it safe to generate a plan from it. The October 2026 inventory found:
- 13 P0 and 187 P1 issues across the published guides;
- answer labels looser than the quoted condition (P0 meldunek, D-01);
- translations that added conditions.

A procedure becomes **plannable** only when all of these hold:

| # | Requirement | Checked by |
|---|---|---|
| P1 | No open P0/P1 inventory finding for the procedure | Owner + record |
| P2 | Every step has a task template (kind, completion evidence, allowed tools) | Validator (static) |
| P3 | Every deadline is a rule with a `from` event the user can record (e.g. "move-in date at this address"), or a fixed date | Validator |
| P4 | Every document, fee and deadline has a condition rule or none, and its fact keys exist in the catalogue | Existing `checkFactReferences` |
| P5 | The guide's translations are in the localization gate's scope with 0 open findings | `pnpm content:check` |
| P6 | No item shown as fact relies on a NEEDS SOURCE statement | Content audit record |
| P7 | Forms used by `fill_form` tasks have a reviewed form template (hash + field map) | Validator |
| P8 | Verification level `checked` (owner's editorial check), or `sources_disagree` with every position quoted | Existing level |

Address registration is the closest candidate (after D-01 and the redesign's phase 0); see 14 §2.

## 3. Rule representation

The existing `ProcedureVersion` already carries:
- identity, title, applicability rule + official conditions;
- steps with `dependsOn`, channels and office kind;
- documents with `alternativeTo`, fees with `optional`, deadlines (relative with `from`, or fixed), pitfalls (exceptions and warnings);
- variations by TERYT location (jurisdiction), outcome, handoff;
- `effectiveFrom/To`, `checkedAt`, `verificationLevel`, quotes per value.

Additions:

```ts
// Case template (new, versioned, public)
type CaseTemplate = {
  id: string; goal: LocalizedText;
  procedures: { procedureId: string; when?: Rule }[];
  links: { from: string /* procId:stepId */; to: string; type: "requires_done" | "produces_fact"; when?: Rule; ruleRef: string }[];
  // e.g. registration step "registered" produces fact pesel.assigned_on_registration (gov.pl quote) → PESEL route not needed
};

// Task template (new, one per procedure step, versioned with the procedure)
type TaskTemplate = { stepId: string; kind: TaskKind; doneEvidence: CompletionKind[]; tools: ToolId[] };

// Event types the planner understands (closed list; each maps to a deadline `from`)
type EventType = "move_in_date_set" | "arrival_in_poland_set" | "application_filed" | "letter_received" | "decision_received";
```

Uncertainty is first-class:
- `Condition.unsettled` and disagreement scopes (DISAGREE_IN) already exist;
- the planner carries them into the plan as `disputed`, never resolving them.

## 4. Planner (deterministic, pure function)

```
plan(template, facts, events, registry) → CandidatePlan
  for each procedure in template where when(facts) ≠ does_not_apply:
     sel = selectFor(procedureVersion, facts)            // existing packages/rules
     tasks += sel.steps   → task (id procId:stepId, kind from task template, deps from dependsOn)
     docs  += sel.documents (alternatives grouped)
     fees  += sel.fees; deadlines += sel.deadlines → due = event date + rule.days (only if the event is recorded)
     disputed/unknown items kept and labelled
  links: add cross-procedure deps; a "produces_fact" link may mark a whole procedure not_needed
  milestones: from template
  return plan with ruleRef on every item
```

Properties tested in the spike:
- the same inputs give the same plan (`inputsHash`);
- no item lacks a `ruleRef`;
- dates are computed only from recorded events.

## 5. Plan validator (independent)

A separate module with its own tests. It reads the plan and the registry, never the planner's internals. It runs:
- on the device before any plan is proposed;
- in CI on fixtures;
- at registry publish time on every case template (catching a template that can no longer produce a valid plan).

Checks map 1:1 to `schemas/validator-report.schema.json`:

| Code | Rule |
|---|---|
| NO_RULE_REF | Every task, document, fee, deadline and milestone references a registry item |
| RULE_NOT_PUBLISHED / RULE_WITHDRAWN | Referenced version is published and not withdrawn now |
| QUOTE_MISSING | The referenced item has at least one quote |
| DEADLINE_WITHOUT_BASIS | A due date exists only if its `from` event is recorded and the rule is relative/fixed |
| CYCLE / UNKNOWN_DEPENDENCY | The task graph is a DAG with known ids |
| FACT_NOT_IN_CATALOGUE / IDENTIFYING_FACT | Plan inputs use catalogue keys only, none identifying |
| STALE_SOURCE_DATE | A `source_changed` item is flagged stale, not presented as current |
| TRANSLATION_GATE_OPEN | Any item text in the case language has open gate findings → fail |
| TEMPLATE_NOT_PLANNABLE | Template or a procedure is below the bar (§2) |

**LLM proposals:** a companion may suggest "you should also get X". If X maps to a registry item, it becomes a proposed fact or replan; otherwise it can only be a *note* in the user's own words, visually distinct ("your note, not from an official source"), never a task, deadline or document requirement.

## 6. When things go wrong

| Situation | Behaviour |
|---|---|
| Source missing for something the user asks | "The official pages we use don't say. Ask [office] / free legal aid." No item created |
| Sources contradict | The item is `disputed`: each position with its source, plus one "what you can do" line (ask the office before the deadline) |
| Rule outdated (`source_changed`) | Tasks `stale`, no new dates derived, official link shown; the owner's re-check republishes |
| Insufficient user information | Branches shown; "answer X to narrow" |
| Procedure can't be determined | Case `paused` at intake with the handoff options; nothing invented |
| Active plan invalid after a change | Replan proposed with a diff; until approved, affected tasks show the warning |
| Withdrawal | Same as outdated, plus the withdrawal reason |

## 7. Questions needing qualified legal review (not product decisions)

1. **Address registration, visa-free stay:** documents (art. 43 ust. 3, Dz.U. 2025 poz. 1794) vs gov.pl vs Warsaw.
2. **Family members of Polish citizens:** the 30-day cases (art. 41 ust. 2a, with the 2006 act art. 2 pkt 4 lit. b).
3. **"Najpóźniej czwartego dnia":** whether the move-in day counts as day 1. It decides the reminder date.
4. **Legal stay while a residence-permit application is pending,** and the effect of formal gaps (for a later residence slice).
5. **Whether a filled official form generated by an app is acceptable as submitted:** it is the official file, signed by hand, but each office's practice is [OPEN].

Free outside help (law clinics, NGOs) is welcome but not on the critical path (ADR-0008). Until an answer exists, the product shows the official wording and the uncertainty.

## 8. Maintenance is the business

[INFERENCE] The registry decays without upkeep: official pages change, acts are amended, forms are re-issued (new hash).

Tooling that exists today:
- change detection;
- the ELI watch;
- quote re-checks on every worker run (currently paused by the owner).

H6 measures the human cost per plannable procedure. If it is too high, Formalka Next must stay narrow (few procedures) or find partners.
