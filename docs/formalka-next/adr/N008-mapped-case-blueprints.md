# ADR-N008: Cases are mapped once as blueprints over verified procedures

- **Status:** Proposed (built and tested in the lab, 2026-10-16)
- **Date:** 2026-10-16
- **Deciders:** Łukasz (owner: "zmapować te roadmapy dla różnych spraw"), Claude

## Context
The owner sees each case as a map of levels, like a game: locked levels that can be previewed, parallel levels where steps don't depend on each other, "wszystko zależy od sprawy". ADR-N004 already rules out a model inventing tasks or dates.

## Decision
- Each case type gets a **blueprint** (`blueprints/<case>.yaml`). The blueprint:
  - names the levels;
  - places every step, document, fee and deadline of the registry procedure(s) on exactly one level;
  - lets one level stand for alternative steps that the procedure's own conditions choose between;
  - declares the events the user can record;
  - links cases: a route condition can be met through another case, e.g. the language certificate for recognition.
- `checkBlueprint` must report no issues before a blueprint ships: nothing is lost and nothing is added.
- Locks come only from the procedure's step order, a route condition met through another case, or documents needed to submit. Each lock is shown with its reason and source.
- Level states: unconfirmed, locked, available, in progress, waiting for the office, returned, done.

## Consequences
- **Mapping is cheap** (20–40 min per case in the lab). The cost stays in making procedures verified (12 §5).
- **Order needs data.** A step order the registry doesn't hold can't be shown as a lock. If offices or the owner want an order, it has to be added to the procedure with a source first.
- **Game metaphor stays honest.** "Waiting for the office" and "returned" are states, not failures; there are no points or badges.

## Revisit when
A case needs loops the plan can't express (e.g. repeated summons), or blueprints start to duplicate procedure logic.
