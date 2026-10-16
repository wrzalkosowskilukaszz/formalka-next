# Independent reference for the H1 benchmark (audit F6, 2026-10-16)

**Status:** none written yet.

`../engine-plans/` holds the engine's own output, so scoring the engine against it would only check the engine against itself. A fair benchmark needs a reference that the generator did not produce.

## Who writes it
The owner, or a person with expertise in the procedure. They work from the official sources the registry cites, without first reading the engine plan.

## What one reference holds, per scenario
- The steps in order, with what can run in parallel.
- The documents, with "albo" groups and who each one is for.
- The fees, with any exemption and its condition.
- The deadlines: the start event, the length, the counting rule and the date for the scenario's recorded events.
- The office.
- The warnings that matter for this person.

Every item cites the official page or act. One file per scenario: `<scenario-id>.md`.

## What both systems receive
The same description and the same facts, as listed at the top of each engine plan ("Fakty przyjęte w planie").

The scenario facts are richer than the description. For example, `citizenship.group: three_years` also asserts income and housing. A general chatbot must therefore get them too, or it is being tested on a different question.

## The first path
Address registration only (audit order, step 3): addr-01 to addr-04. The others follow only after those pass.
