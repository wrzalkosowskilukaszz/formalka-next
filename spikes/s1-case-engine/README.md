# Spike S1: deterministic case engine

**Run:** `npm test` (or `node --test "test/*.test.ts"`). Needs Node 22.18+ and has no dependencies. Synthetic data only; nothing touches the network or a database.

## Hypothesis
A pure TypeScript function can turn (case template, confirmed facts, recorded events, registry snapshot) into a task plan that meets six properties:
- every task, document, fee and deadline carries a reference to a published registry item;
- an independent validator can reject anything that doesn't;
- the next intake question can be chosen deterministically from what the plan still depends on;
- a changed fact gives a reviewable diff that never undoes completed work;
- reminders come only from user-confirmed dates;
- all of it runs on a phone with no server and no LLM.

## Input
- `src/fixture.ts` is a reduced snapshot of `content/procedures/zameldowanie.yaml` and `content/facts/zameldowanie.yaml` at formalka@504a210.
  - **Verbatim from production:** the quotes, ids and the 4-day and 30-day deadlines.
  - **Synthetic, marked in the file:** the `zameldowanie.can_register` fact, the template's PESEL branch and the PESEL quotes.
- The scenarios are reg-01…reg-04 and adv-02 from `docs/formalka-next/test-scenarios/scenarios.yaml`, plus property cases.

## Expected behaviour
1. **reg-01** (non-EU, temporary stay, Kraków, move-in 2026-10-28):
   - 4 tasks in dependency order, each with a `procedure@version:kind:item` ruleRef;
   - documents including the disputed visa-free item, marked as disputed;
   - the 4-day deadline due on 31 Oct (day 1 = move-in day) or 1 Nov (day 1 = the day after);
   - the Kraków office;
   - the validator passes.
2. **No move-in date:** no due date and no reminder.
3. **"Nie wiem" on citizenship (reg-02):** both deadline branches stay in the plan, marked `unknown`. No reminder fires and the question is not asked again.
4. **Question order:** citizenship group, then stay type, then whether registration is possible, then location. Intake stops when no remaining fact can change the plan, or at the cap of 12. Identifying fields are never asked.
5. **The validator rejects** each of these:
   - a task without a ruleRef;
   - a ruleRef to an invented item;
   - a dependency on a missing task;
   - a due date without a recorded event;
   - a fact outside the catalogue;
   - an identifying fact;
   - a value outside the allowed options (e.g. a nationality guessed from the input language);
   - a dependency cycle;
   - a withdrawn procedure version.
6. **reg-03 (city change):** only the visit task's office changes.
7. **reg-04 (stay change after the form is done):** the documents swap; the done task stays done.
8. **Route change (cannot register):**
   - the PESEL task is added;
   - done work is kept as history;
   - in-progress work is flagged "may no longer be needed" and left for the user;
   - open work becomes `not_needed` only through an approved diff;
   - even a tampered diff cannot undo `done`.
9. **Reminders:**
   - one per confirmed deadline, the day before the earlier reading, at 09:00 Europe/Warsaw;
   - generic lock-screen text;
   - a stable id, so rescheduling is idempotent; a new move-in date gives a new id.
10. **Day arithmetic:** correct across month ends, leap days and the October 2026 DST change, using calendar days only.

## Test
`test/engine.test.ts`: 14 tests.

Mutation check (2026-10-15). Nine targeted faults were injected one at a time:
- byNthDay off by one;
- reminders for `unknown` deadlines;
- dropping the done-history branch;
- dropping the done guard in `applyApproved`;
- re-asking "Nie wiem";
- dropping the due-date basis check;
- treating "Nie wiem" as a value;
- planning from a withdrawn version;
- no office on visits.

Each fault fails at least one test. The `applyApproved` guard survived at first; a tampered-diff assertion was added, and now it fails.

## Result
**14/14 pass**, on Node 22.22.0, 2026-10-15. The hypothesis holds for this slice:
- the plan, validation, questions, diff and reminders need no LLM and no server;
- the code is about 390 lines with no dependencies.

## Limitations
- **One procedure and a toy template.** It does not show how many real procedures meet the plannable bar (06 §2). That is the main open cost driver.
- **The rule language is the production one plus a `prefix` shorthand for TERYT.** Production uses place layers, not prefixes.
- **The day-count reading is unresolved (06 §7 Q3).** The spike computes both readings and reminds on the earlier one. Which reading is legally right is OPEN.
- **"Nie wiem" gives no reminder at all.** Design choice to confirm: remind on the earliest candidate date with neutral text ("sprawdź termin"), or show only the in-app attention list (03 F4).
- **The question weights are a design guess.** The order is plausible here; it needs the user test (03 §2).
- **No persistence, encryption, sync or UI.** The diff covers tasks, documents and offices, but not fees or deadline-rule changes.
- **The validator checks references and structure, not truth.** A wrong quote in the registry passes.
- **The FNV-1a hash is for the spike only;** production would use SHA-256.

## Decision consequence
- Build `packages/case-engine` as a pure package from this shape (ADR-N004). Extend the existing `packages/rules` rather than add a workflow engine.
- Make "the plan validator passes" a release gate, and make the identifying-fact and allowed-value checks part of it.
- Before Phase 1, the owner answers 06 §7 Q3 (the day count) and the "Nie wiem" reminder question.
- Re-run this suite against a template with two real procedures (address registration + PESEL with verified quotes) before committing to the slice estimate.
