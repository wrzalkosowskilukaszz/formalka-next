# ADR-N004: Plans come from code over the registry; an independent validator gates them

- **Status:** Proposed
- **Date:** 2026-10-15
- **Deciders:** Łukasz (owner), Claude

## Context
Product rules 1–3 apply: no invented facts, URLs only from the database, every value quote-backed. ADR-0003 already makes applicability a deterministic three-valued rules engine, with the LLM only extracting. A case adds tasks, deadlines and reminders: the items where an error causes harm.

## Decision
- A pure planner (`packages/case-engine`) builds the plan from the registry. The LLM never creates tasks, documents, fees, deadlines or dates.
- An independent validator reads only the plan and the registry and rejects:
  - items without a reference to a published item or a quote;
  - withdrawn versions;
  - due dates without a recorded event;
  - unknown dependencies and cycles;
  - facts outside the catalogue, values outside their options, and identifying facts.
- Validator failure blocks showing the plan. The release gates in 11 §4 apply.
- The next question is chosen deterministically from the facts the plan still depends on. "Nie wiem" is an answer and is never asked again.

## Consequences
- Spike S1 (14 tests, mutation-checked) shows the approach in about 390 lines with no dependencies.
- The planner can only be as right as the registry. The cost moves to editorial work (12 §5; H6).
- Coverage grows only as fast as procedures reach the plannable bar (06 §2).

## Alternatives considered
- **LLM-generated plans checked afterwards:** a good-looking plan can't be checked without a reference, and the reference is the registry anyway.
- **A workflow engine or DSL:** a second rule language to maintain.

## Revisit when
The plannable bar proves too costly to reach for most procedures (H6 fails).
