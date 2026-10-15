# Formalka Next: functional slice (engine-driven)

This is the advisor's step 3, "functional vertical slice": the Living Case experience with **real logic and no script**.
- **What comes from the engine:** every question, level, state, lock reason, fee, deadline, office and reminder on screen comes from `packages/case-engine` (`FormalkaEngine`), i.e. from Formalka's verified content (`reference/`, formalka@04057ef) and the case blueprints (`blueprints/`).
- **What it is not:** it has no AI, no network and no storage (state is in memory), and it is not product code.
- **The other prototype:** the design-led experience prototype is `prototype/` (scripted). The two are meant to be compared: the prototype shows how it should feel; the slice shows that the logic behind it holds.

## Run
```bash
node packages/case-engine/tools/build-browser.mjs --locales pl   # engine + data (committed bundle; rebuild after engine changes)
node slice/build.mjs                                            # slice/dist/index.html: one self-contained file
```
Open `slice/dist/index.html` in any browser, or use the private Artifact link from the session report. The build reuses the prototype's vendored Geist font and icons (licences in `prototype/vendor/`) and Formalka's tokens.

## What you can do
1. **Start a case.** Use "Co dziś załatwiamy?" (keywords: obywatelstwo, karta pobytu, zameldowanie, certyfikat, PESEL) or a chip. Five cases come from five blueprints.
   - **Describe it in your own words** ("Mieszkam w Polsce od pięciu lat na pobycie stałym, mam certyfikat B1, chcę obywatelstwo"). A card shows what was understood: your words, the official question and the option. Confirm or reject each one; only confirmed facts enter the plan, and only the rest is asked. This runs on the device, without AI (`FormalkaEngine.intake`).
2. **Answer the questions.** They are the official ones from Formalka's fact catalogue, in the content's own order, only as many as the plan needs. "Nie wiem" is always there, with "Dlaczego pytamy?".
3. **Choose a route** when several fit (citizenship: recognition or grant). The differences shown come from the sources. A route reachable through another case (recognition without B1) says so.
4. **Pick a city** (Warszawa, Kraków, …) so the plan can show the office from the registry's office layer: quoted addresses, opening hours and the booking link. Other cities get an honest "nie mamy w źródłach".
5. **Approve the plan,** optionally with the one per-case consent ("Maciek/Asia może sam dodawać przypomnienia").
6. **Work the case:**
   - **Teraz:** the current level's tasks with their sources and "albo" alternatives; fees; deadlines (record the date they count from); the office; "Mam umówioną wizytę"; "Przypomnij, żeby zadzwonić" (honest wording: no booking is claimed).
   - **Mapa:** every level with its state, lock reason and parallel levels.
   - **Teczka:** every document of the case in one checklist, with "albo" alternatives grouped, the source and "Mam" / "Nie dotyczy". Documents can be gathered while their level is locked; ticking them never unlocks a step. Below it: the fees in this case (examples) and the case history (recorded dates). Nothing is uploaded.
   - **Maciek/Asia działa:** what the advisor will do by itself, and when.
7. **Move time** with the tester strip (+1/+3/+7 dni). The advisor's notifications appear on a simulated lock screen (generic text by default); its messages land in the chat. "Jak poszło?" answers update the plan.
8. **Open the related case** from a task (citizenship → language certificate), or write "karta pobytu" in the chat to start a second case with Asia.

## Checked (2026-10-16)
A headless walk at 390×844, in light, dark and reduced motion, went through:
- the citizenship route choice;
- the address registration with Warsaw: deadline, offices, visit, time travel, lock screen, follow-up, plan update;
- intake from a description (three candidates; two confirmed, one rejected and then asked), a second case started from the home screen, and the PESEL redirect to address registration;
- the Teczka for address registration with Warsaw (grouped alternatives, a document ticked while its level is locked; the level stays locked).

It found 0 errors, 0 network requests and no horizontal scroll.

**Fixed on 2026-10-16:** once a case had been opened, a description typed on the home screen was lost. The case view's change handler outlived the view and re-rendered the page before the form could submit. Each render now clears the previous view's handlers.

## Limits
- **Values.** They are examples from Formalka's guides as of 15.10.2026. Citizenship and temporary residence have open inventory findings.
- **Office data.** No office phone numbers exist in the registry, and municipal offices only for Warsaw and Kraków.
- **Free text.** The first description is read for facts by a narrow Polish baseline (no AI). Later chat messages recognise only the case keywords. Real conversation (AI) is Phase 4.
- **Simulated features.** The forms, the PDF filling, real notifications and the calendar are not in the slice; they are simulated or covered by spike S3.
