# Formalka Next: status for the auditor, round 2

**Date:** 16.10.2026, the same day as the external audit.
**Repository:** `wrzalkosowskilukaszz/formalka-next`, branch `main`. The commit is named in the package's file name and in `MANIFEST.sha256`.
**Prepared by:** Claude for the owner, Łukasz.
**Your audit reviewed:** `895a6aa`.

Labels: FACT (checked, with its source or command), INFERENCE, HYPOTHESIS, ASSUMPTION, OPEN.

## Package contents

| Path | What |
|---|---|
| `README.md` (this file), `STATUS.pdf` | This report |
| `RESPONSE.md` | The answer to each finding (F1–F8), the claims matrix per environment, errata to the first report |
| `JOURNEYS.md` | The nine user journeys, step by step, with their screenshots |
| `screens/` | 38 screenshots from the automated runs on this commit (390×844; E04 at 1280×900) |
| `BETA-DESIGN-BACKLOG.md` | What is left to design before a beta (doc 17) |
| `evidence/` | Raw test outputs on this commit, and a clean reproduction from the source archive |
| `source/` | The full repository at this commit (`git archive`) |
| `MANIFEST.sha256` | A checksum for every file in the package |

## 1. What we ask you to judge now

1. **Closing the findings.** Are the answers to F1–F8 enough to start moderated sessions on fictional cases, with address registration only (study mode)? What still blocks that? (RESPONSE §2)
2. **The session script.** The test script follows your Phase 1 section (`source/prototype/README.md`, "Test script"). Does it fit?
   - a concrete goal and a fictional identity;
   - four scripted moments;
   - your five measures;
   - a plain checklist compared before a chatbot.
3. **What is new since your audit.** These five changes came from the owner's own tests. Do they add risks?
   - **The reader's reply when no option fits (F03).** It names what it noticed and offers one-word answers. It still picks nothing.
   - **Waiting for the office (G01–G02).** "Przyspieszyć wydanie karty" gets the registry's own content on a ponaglenie, with the art. 100d caveat quoted and attributed, and no conclusion of our own. Is that caveat right for people in this situation, or too complex?
   - **The home input (H01).** It now always leads into the chat.
   - **Assumed and skipped steps (F04).** "Zakładamy, że zrobione" marks a step done only by inference; "Pominięte" marks one the guide lets the person skip.
   - **Less on a case's first screens (S01–S03).**
4. **The independent reference.** Is its format right (`source/packages/case-engine/eval/independent/README.md`)? Who should write it: the owner or an expert?
5. **The road to a beta.** `BETA-DESIGN-BACKLOG.md` lists what is left to design, with priorities and gates. What is missing or wrongly ordered? What would you require before people use it in real cases, and what should a re-audit cover?

## 2. What changed since `895a6aa`

Two lab sessions worked in parallel: the engine session, and the prototype session (this one). There are 33 commits up to `04a233a`, not counting evidence refreshes. Neither session wrote to production.

| Area | Change | Commits |
|---|---|---|
| Engine: content check (F1) | `verifyContent` apart from the structural check; `E.validate` returns both; 8 mutations with valid references are caught | `19c1619` |
| Engine: decisions and dates (F2, F8) | Decision instances (the Minister's decision); the court complaint from it (PPSA); the card only after a positive decision; one legal date for KPA/PPSA; `plain` counting where the basis is not verified | `1532bbe` |
| Engine: exemptions (F3) | No rule, no exemption: "sprawdź, czy Cię dotyczy" and the full fee | `1532bbe` |
| Engine: address registration (F4) | The EU family card only "Tylko dla członka rodziny…"; filing does not wait for the owner's confirmation; "A albo B" kept; the skipped confirmation is `skipped` | `35f22bf`, `f4ead1f`, `4ff614e` |
| Engine: reference and manifest (F6, F8) | `reference-plans` renamed `engine-plans` (not a reference); facts listed per plan; `eval/independent/` defined; a content-hash manifest instead of `builtAt` | `f3dc5da` |
| Engine: evidence | A mutation runner: `npm run mutate`, 36 faults, each alone; the "24 faults" number withdrawn | `f4ead1f`, `4ff614e` |
| Engine: implied levels (F2 follow-up) | A level done only because a later step was recorded is `implied` | `6b982ca` |
| Engine: voice and copy | Questions speak to the person ("Czy mieszkasz…"); the registry's wording for someone else's case; a shorter intro | `34a57f6`, `2408a10`, `e410225` |
| Prototype: audit (F1, F5, F7, F8) | "Plan sprawdzony" withdrawn; strict typed consent; negation, explicit year, refused day; numbers masked before echo; session memory named; no-LLM disclosure; actions only after real answers; study mode; build manifest | `a97ce20`, `e0a03a6`, `39890f3` |
| Prototype: owner's tests | Whose case; the reader's reply when no option fits; waiting for the office; assumed and skipped steps; less at once; the chat from the top; the home input never dead-ends; the map says whose case it is | `97a8fe0`, `f60d4cf`, `bdd803f`, `7d05f1f`, `3dbd45c`, `53e34b7`, `dac718b`, `06a85af`, `04a233a` |
| Docs | `RESPONSE.md`; the Phase 1 test script; ADR-N010 audit section; doc 16 §6c; production content proposals (not applied); doc 17 | `5406c11` and others |

## 3. The findings, in short

The full answer is in `RESPONSE.md` §2. Reproduction before fixing:
- F1, F2, F3, F5, F6 and F7 were reproduced by this session;
- F4 was reproduced by the engine session;
- F8 was accepted on its reasoning.

| | Status | Still open |
|---|---|---|
| F1 | Fixed | The check compares with the registry; errors in the registry itself need the independent reference |
| F2 | Fixed | User statements vs. legal acceptance: implied levels are marked; legal acceptance stays a separate event where the procedure has one |
| F3 | Fixed | — |
| F4 | Fixed in the lab | The online channel is not modelled; five registry errors are proposed to production, not applied |
| F5 | Fixed | The reader is still a matcher (FACT: 15 unit tests); real phrasing will miss |
| F6 | Partly | The independent reference is not written (OPEN: who) |
| F7 | Fixed in the prototype | The repository is public; ADR-N001 says private (OPEN: the owner) |
| F8 | Fixed | H2 and H6 are not measured; the plain checklist for the comparison is not prepared |

## 4. Evidence on this commit

All of these are FACT, from `evidence/` on the reported commit, Node 22.22.0:

| Check | Result | File |
|---|---|---|
| Engine tests (including 18 evaluation scenarios and the content check) | 39/39 | `engine-tests.txt` |
| Evaluation scenarios | 18/18; output identical to the archive | `clean-checkout.txt` |
| Mutation runner (each fault alone, whole suite) | 36/36 caught; `MUTATIONS.md` unchanged | `engine-mutations.txt` |
| Spike S1 | 14/14 | `s1-tests.txt` |
| Engine bundle | Rebuilt byte for byte; matches the committed file and its manifest | `bundle.txt` |
| Prototype unit tests (the reader) | 15/15 | `prototype-unit.txt` |
| Prototype lint | Clean, 12 modules | `prototype-lint.txt` |
| Prototype e2e, reduced motion | 8/8 | `e2e-reduced-motion.txt` |
| Prototype e2e, full motion | 8/8 | `e2e-motion.txt` |
| Prototype build | Two builds byte-identical; the build id is a hash of the inputs | `prototype-build.txt` |
| Clean reproduction from `git archive` in an empty folder | All of the above pass; the same `index.html` sha256 | `clean-checkout.txt` |

Not independently established:
- what the hosting platform of the private Artifact logs (RESPONSE §3);
- that offices accept software-filled forms (spike S3 shows only that the PDF fills).

## 5. Limits that still hold

- **The plan.** It is computed from Formalka's guides (snapshot formalka@04057ef). Fees, dates and offices are examples, labelled with the check date.
- **The reader.** It is deterministic word matching on the phone. There is no language model.
- **Simulated:**
  - memory lasts only for the session;
  - notifications, the lock screen and calendar writes;
  - the interactive form is a mock.
- **Coverage:** offices with addresses exist only for Warsaw and Kraków; Polish only.
- **Correcting answers.** After approval, an answer already given cannot be changed (owner decision, RESPONSE §6).

## 6. Decisions waiting on the owner

1. Repository visibility: public today; ADR-N001 says private.
2. Who writes the independent reference for address registration, and when.
3. Review of the second-person wording (`packages/case-engine/src/voice.ts`).
4. ADR-N010: your three decisions (level 1 GO as session memory; levels 2 and 3 NO-GO).
5. Named assistants: test them as a hypothesis, or drop them from the sessions.
6. Correcting a confirmed answer after approval. The engine supports it; the UI permission is the owner's call.
7. The production content proposals, to be taken to Formalka production outside the lab.
8. The map's final design (the owner asked for a more attractive, better placed map on 16.10).
9. What "beta" means (doc 17 §0): the assumption is the roadmap's private alpha with slice 1.

## 7. How to reproduce

From `source/`, with Node 22:

```
cd packages/case-engine && npm ci && npm test && npm run eval && npm run mutate
cd ../../spikes/s1-case-engine && npm test
cd ../.. && node prototype/build.mjs && node --test prototype/test/*.test.mjs && node prototype/test/lint.mjs
node prototype/test/e2e.mjs            # add --motion for full animations, --shots <dir> for screenshots
```

Playwright and ESLint come from a global install (`npm i -g playwright eslint`). The engine bundle is rebuilt from `packages/case-engine` with `node tools/build-browser.mjs --locales pl`.

The prototype itself is `prototype/dist/index.html` after the build: one file that works offline. The owner can share the private link.
