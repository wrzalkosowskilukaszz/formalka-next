# Response to the external audit of Formalka Next v4 (16.10.2026)

**Audit:** "Niezależny audyt Formalka Next v4", 16.10.2026, given to the owner, Łukasz. It reviewed commit `895a6aa`.
**This response:** prepared by Claude for the owner on 16.10.2026. The repository state it describes is `main` after the commits listed below.

Labels:
- **FACT:** checked, with its source or command;
- **INFERENCE:** follows from facts;
- **HYPOTHESIS:** to be tested;
- **ASSUMPTION:** not verified;
- **OPEN:** a decision or work not yet done.

## 1. The verdict is accepted

The audit gave:
- **GO** for problem interviews, from now;
- **conditional GO** for moderated tests of the prototype on fictional cases;
- **NO-GO** for any study in which a participant relies on the app in their own case.

We accept all three without change.
- Nothing below lifts the NO-GO.
- The fixes make the conditional GO reachable for **one path, address registration**. They do not make the five procedures correct (INFERENCE from the audit's §"Przegląd wszystkich 17 planów", which certifies none of them).

Work was split between two lab sessions:
- **Engine session:** `packages/`, `blueprints/`, the evaluation set and the slice.
- **Prototype session:** this one. It covers `prototype/`, the test script, this response, ADR-N010 and the STATUS errata.

Neither session wrote to the production repository.

## 2. Findings

| | Finding | Reproduced? | Owner | Status | Commits |
|---|---|---|---|---|---|
| F1 | The validator does not check content | FACT: yes, 4 of the 5 mutations, on `85688fd`. A fee of 999 999 zł, an invented task, all tasks and fees removed, and an invented office each returned `ok: true` with no violations | Engine; prototype wording | Fixed | `19c1619` (engine), `a97ce20`, `e0a03a6` (prototype) |
| F2 | Wrong decision events and outcomes | FACT: yes, both. cit-06 counted the appeal and the court complaint from the same `decision_delivered`. A refused residence decision left the card level `available` | Engine | Fixed | `1532bbe` |
| F3 | A missing exemption rule became a granted exemption | FACT: yes. res-02 showed "zwolnienie" instead of 340 zł | Engine; prototype display | Fixed | `1532bbe` (engine), `e0a03a6` (prototype) |
| F4 | Address registration mixes document groups; a process variant becomes a lock | Reported reproduced by the engine session (doc 16 §6c); not repeated here | Engine | Fixed | `35f22bf` |
| F5 | The reader accepts ambiguous consent and negated actions | FACT: yes, all five inputs in the audit's table | Prototype | Fixed | `a97ce20` |
| F6 | The 17 plans are not an independent reference | FACT: yes. `eval/run.ts` made them with the same engine | Engine (rename, facts); owner (the reference) | Partly fixed. The independent reference is OPEN | `f3dc5da` |
| F7 | Privacy is described too broadly | FACT: yes. The typed PESEL was put in the chat before the filter ran. The repository is public | Prototype; owner (visibility) | Fixed in the prototype. Repository visibility is OPEN (owner) | `a97ce20`, `e0a03a6`, this response §3 |
| F8 | Promises and metrics can reward apparent success | INFERENCE: agreed on every point | Prototype; engine (dates, manifest) | Fixed, except the measures that need the independent reference | `1532bbe`, `f3dc5da` (engine), `a97ce20`, `e0a03a6`, the test script in `prototype/README.md` |

### F1. Content check
- **Engine (`19c1619`).** `verifyContent` is a second check, kept apart from the structural `validatePlan`. It checks:
  - amounts, exemptions, start events, dates and offices against the registry and the recorded events;
  - the whole plan against one recomputed from the same inputs.

  `E.validate` returns both checks, and `ok` only when both pass. `test/verify.test.ts` holds 8 mutations that keep valid references. Each passes the structural check and is caught by the content check:
  - the audit's fee, task, removed items and invented office;
  - a changed office address;
  - an exemption granted without a rule;
  - a moved due date;
  - an unlocked level.
- **Prototype.** "Plan sprawdzony" is gone from the prototype and the slice. The plan card now says:
  - "Plan zgodny z przewodnikami Formalki";
  - "Silnik sprawdza źródło każdego elementu oraz kwoty, terminy i urzędy względem przewodników. To nie jest weryfikacja prawna: przewodniki mogą być niepełne."

  The status layer says the same in short. FACT: e2e scenario F asserts this wording and the absence of "Plan sprawdzony".
- **Still true:** the check compares the plan with the registry. It cannot find an error that is in the registry itself (INFERENCE). The engine session found five such errors and proposed fixes to production without applying them (`docs/formalka-next/PRODUCTION-CONTENT-PROPOSALS-2026-10-16.md`).

### F2. Decision instances and outcomes
- Decision events now carry an instance:
  - `decision_delivered` is instance 1;
  - `appeal_decision_delivered` is the Minister's decision, instance 2.
- The court complaint runs from the Minister's decision, counted under PPSA art. 83. The blueprint may correct the registry's start event only with words quoted from the rule itself ("od otrzymania decyzji Ministra"), and `checkBlueprint` enforces that.
- The residence card level has `requires: granted`. It is gone after a refusal.
- Counter-examples:
  - cit-06 now ends at the appeal;
  - the new cit-07 covers the Minister's refusal;
  - both are in the evaluation set (18/18).
- **Still open:** user statements stay apart from legal effects only where a level needs an outcome. "Złożyłem" still completes a level; it does not prove that the earlier requirements were met (the audit's last point under F2). This is noted for the engine session.

### F3. Exemptions
- **Engine.** An exemption with no rule has outcome `unknown`, never `applies`. The full fee is counted, and the evaluation compares the effective amount.
- **Prototype.** The fee card and the "Ile to kosztuje?" answer quote the exemption as something to check:

  > Przewodnik przewiduje też zwolnienie z opłaty: „…”. Z Twoich odpowiedzi to nie wynika, więc liczę pełną kwotę.

### F4. Address registration
- `onlyIf`: the EU family member's card shows as conditional, with who it is for ("Tylko jeśli jesteś członkiem rodziny obywatela UE, EFTA lub Szwajcarii."). FACT: the engine plan for `citizen_group: eu_efta` on `e0a03a6` marks the card `unknown` with this label, and the content check passes.
- `optionalAfter`: filing no longer waits for the owner's confirmation, per the guide's own words ("nadal możesz złożyć formularz meldunkowy"). The guide's notes on the route without confirmation sit on the filing level.
- "A albo B" is kept together in the plan text.
- **Still open:**
  - no model of the online channel;
  - the label is not in the voice of someone else's case ("jesteś" stays for a case handled for another person). It is noted for the engine session.

### F5. Reader
All five inputs from the audit are unit tests now (`prototype/test/understand.test.mjs`, 13 tests):

| Input | Before | Now |
|---|---|---|
| "Tak, nie zgadzam się" | yes | unclear; asks |
| "Chyba tak" (strict) | yes | unclear; asks |
| "Nie złożyłem wniosku" | filed | not filed |
| "22.10.2028" | 22.10.2026 | 22.10.2028 |
| "Jutro nie mogę, w piątek o 10" | tomorrow at 10 | Friday at 10 |

- Approvals with consequences (the plan, a change after approval) take only a short whitelist of complete answers ("tak", "zatwierdzam", "akceptuję plan", and a few like them). Anything else asks for the button.
- Hedges and contradictions are never read as consent.
- A confirmation always shows the full date with the year.
- When two days remain, the reader asks.
- We did not add a language model to hide these errors (the audit's advice).

### F6. Reference
- `eval/reference-plans/` is now `eval/engine-plans/`: the generator's own output, regression snapshots only.
- Each engine plan lists the facts it assumed, so a chatbot in a comparison gets the same facts.
- `eval/independent/README.md` defines the independent reference and its format:
  - who writes it: the owner or an expert, from the official sources, without reading the engine plan first;
  - what it holds;
  - the first path: addr-01 to addr-04.
- **OPEN (owner):** who writes it, and when. Until it exists:
  - session measure 1 (the right next step) cannot be scored;
  - no H1 benchmark runs.

### F7. Privacy
- **Echo.**
  - Personal numbers are masked before the text reaches the chat: PESEL, IBAN, ID card, passport, phone, e-mail.
  - The reply says what kind of number was hidden and does not repeat it. It carries no actions.
  - The same masking applies to every place the prototype repeats the person's words: the chat bubble and the "Twoje słowa" note on confirmation cards.
  - The patterns are narrow (a name or an address is not caught). Sessions therefore use fictional data, and the study notice says so.
  - The mock form asks for a name, a surname and a date of birth and keeps them in the Teczka draft until reset. It says "Wpisuj dane przykładowe" and offers sample data. Its fields are not masked.
  - The form used to say that its answers could be changed in the chat. After approval they cannot (§6), so that sentence is removed.
- **Memory.**
  - The prototype's memory is named for what it is: "Co … pamięta w tej sesji. Tylko na tym telefonie i tylko do odświeżenia strony albo resetu."
  - The README no longer says "On-device memory".
  - The last hour is shared by all cases in one session (`S.learned.hour`). The README says so.
- **Claims.**
  - The home footer now says that the prototype's code sends no case data, and that links open outside pages. It replaces "nothing leaves the phone".
  - The matrix in §3 sets the limits for each environment.
- **Disclosure.** The first case in a session says that the prototype uses no language model. The study notice says it too.
- **Repository.** FACT: on 16.10.2026, `GET https://api.github.com/repos/wrzalkosowskilukaszz/formalka-next` without a token returned `"private": false, "visibility": "public"`. ADR-N001 says "A separate git repository, `formalka-next`, private."
  - The repository therefore differs from the owner's own decision.
  - Claude cannot and did not change the setting.
  - All data in the lab is synthetic (CLAUDE.md), but anyone can read the code, the documents and this audit trail.
  - **OPEN (owner), first decision.**

### F8. Promises and measures
- **"Asystent AI".** Each assistant still says it is an AI assistant (rule 6). The prototype now also says that it uses no language model.
- **"An action after every reply".**
  - It is now "replies that answer propose the next step".
  - A reply that is unsure, refused, or about personal numbers asks to clarify or stops, with no action.
  - FACT: e2e scenario A asserts the not-sure reply has no actions.
- **Named assistants.** They are a hypothesis. No more personas are added; the continuity of the case comes first.
- **The ChatGPT question is removed.** The test script follows the audit's Phase 1 section:
  - a concrete goal and a fictional identity;
  - study mode, and a separate browser profile;
  - disclosure of what is simulated;
  - observation without leading;
  - four scripted moments: a correction, "Nie wiem", no owner confirmation, a return after a break;
  - the audit's five measures;
  - a plain checklist compared before a chatbot;
  - the gate after the round.

  H2 is not claimed to be measured by time travel.
- **Dates.**
  - KPA and PPSA deadlines show one legal date, with the reason for a weekend shift.
  - Only the open "najpóźniej w N dniu" reading keeps two dates.
  - A deadline without a verified counting rule is `plain`: one date, never later (`1532bbe`).
- **Manifest.**
  - The engine's `dist/manifest.json` and `E.manifest` replace `builtAt` (`f3dc5da`).
  - The prototype's `dist/manifest.json` (`e0a03a6`) holds:
    - a build id hashed from every input;
    - the engine and registry versions;
    - the sha256 of both outputs.
  - The home footer shows the build id and the engine hash.
  - FACT: two builds of the same inputs give the same sha256.
- **H6.** It is not measured yet. The test script points to a maintenance log, which is OPEN.

## 3. What is true where (claims matrix)

| Claim | Local HTML (`prototype/dist/index.html`) | Private Artifact | Slice (`slice/`) | Future product |
|---|---|---|---|---|
| Case data is kept | In memory only; gone on reload or reset (FACT: code, e2e) | The same code (FACT) | In `localStorage`, unencrypted, until cleared (FACT, audit F7) | The encrypted on-device store of ADR-N002: HYPOTHESIS. Storage, keys, backups, deletion and device loss are not verified |
| The page's code makes no requests | FACT: e2e `page.on('request')`, 6 scenarios, both motion modes | NOT VERIFIED: the hosting platform loads the page and may log; we only tested `file://` | Not tested by this session | Registry updates will need requests (doc 09); case content must not travel (ADR-0009): HYPOTHESIS until tested |
| Links to official pages, booking and maps | An outside connection when tapped; the site gets connection metadata | Same | Same | Same; needs its own notice |
| Personal numbers typed | Masked in the chat before shown; narrow patterns (FACT: unit tests, e2e A). The mock form's name and birth date are not masked; sample data only | Same code | Not checked (OPEN) | Needs one gate for every input, filtering before echo, tests for each exit (audit F7) |
| Memory | Session only, until reload or reset | Same | Until `localStorage` is cleared | Lasting memory: not built; ADR-N010 level 1 only after the store is verified |
| Language model | None | None | None | OPEN (Phase 4), behind the intake contract (doc 16 §9a) |
| Plan check | Structure and content against the registry; not a legal verification | Same | Same (the slice wording changed in `19c1619`) | Same, plus the independent reference before any benchmark |

## 4. Errata to `STATUS.md`

`STATUS.md` stays as sent, so the audit can be traced to it. These points in it are wrong or too broad:
1. **"private lab"** is false. The repository is public (F7 above).
2. **"Plan sprawdzony"** overstated the check. Since `19c1619` the content check exists; the wording is in F1 above.
3. **"Nothing leaves the device"** holds only for the prototype's own code in the local tests (§3).
4. **"On-device memory"** is session memory.
5. **"31 tests and 17 scenarios"** are not additive: the scenarios run inside one of the tests. Today:
   - the engine has 39 tests, with the 18 scenarios inside them;
   - spike S1 has 14 tests;
   - the prototype has 13 unit tests and 6 e2e scenarios.
6. **"24 injected faults caught"** cannot be reproduced from the package: there is no runner and no log per fault. The 8 F1 mutations are now tests (`verify.test.ts`); the rest of the 24 claim stays unproven (OPEN for the engine session: add a runner or withdraw the number).
7. **Commit identity.** The package named `895a6aa`, its logs `e186333`, and the messages `9b3c66f`. From now on:
   - one commit per evidence set;
   - the build manifests identify the bytes.
8. **"Reference plans"** were the engine's own output (F6).
9. **"Every reply ends with an action"** is withdrawn (F8).

## 5. Decisions for the owner

In order of urgency:
1. **Repository visibility.** It is public; ADR-N001 says private.
   - Recommendation: make it private in the GitHub settings.
   - Claude cannot change this setting.
2. **The study path and its timing.**
   - Problem interviews can start now; they need no prototype.
   - Moderated sessions: address registration only (study mode). Before the first session:
     - the independent reference addr-01 to addr-04;
     - the plain checklist for the comparison;
     - your approval of the test script in `prototype/README.md`.
3. **Who writes the independent reference** (you or an expert), and when.
4. **Review of the second-person wording.** `packages/case-engine/src/voice.ts` rewrites 14 questions; the meaning must not change.
5. **Named assistants.** Keep them as a hypothesis to test (doc 00, task 7: named vs. unnamed), or drop them from the study.
6. **ADR-N010, as the audit proposes:**
   - level 1, session memory: GO in this limited Phase 1;
   - level 2, sending phrases: NO-GO now;
   - level 3, counters: NO-GO now.

   The ADR now carries this as a proposal (its "Audit" section).
7. **Production content proposals** (`docs/formalka-next/PRODUCTION-CONTENT-PROPOSALS-2026-10-16.md`): yours to take to Formalka production, outside this lab.

## 6. Open work (not decisions)

- **After approval, an answer already given cannot be changed.** The reader proposes only facts not yet answered (`intake` rejects `ANSWERED`). Before approval, "Popraw odpowiedzi" asks again. The test script keeps the correction moment before approval.
  - Changing an answered fact after approval needs:
    - a proposal card, like ADR-N003;
    - an engine rule for when a typed answer may replace a confirmed one.
  - This is a design question for both sessions. It is not built now: the audit says no new features before the sessions.
- **Engine session:**
  - the `onlyIf` label in someone else's voice;
  - user statements kept apart from legal effects (F2, last point);
  - the online channel for registration (F4);
  - the 24-fault claim (§4.6).
- **Slice:** masking and a privacy notice for its `localStorage` (§3).
- **The plain checklist** for the comparison.
- **The H6 maintenance log.**

## 7. Evidence on this commit

- `evidence/*.txt` is regenerated on the commit that carries this response. `evidence/clean-checkout.txt` builds and tests a fresh clone of that commit.
- The audit's own evidence file stays with the owner. It is not copied here.
