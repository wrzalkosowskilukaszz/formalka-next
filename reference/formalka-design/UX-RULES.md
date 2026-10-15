# UX rules: what every screen must satisfy

Written 2026-10-01 after the owner's review of the first CUKR page: "chaotic, text-filled, not organised, not modern". Every design decision in `apps/web` must point to a rule here. A rule is either a published, tested standard or research finding (cited), or a constraint of our users. "It looks nice" is not a reason; "it lowers what the reader must hold in mind (R3)" is.

## Who we design for

A foreigner dealing with a Polish office: often stressed, tired, on a phone, reading in a second language, sometimes in a queue. Stress and scarcity measurably reduce working-memory capacity (Mullainathan & Shafir, *Scarcity*, 2013). So the bar is not "usable by a calm expert at a desk" but "usable by a worried person with half their attention".

## The rules

| # | Rule | Source |
|---|---|---|
| R1 | **Answer first.** The page opens with what it is, the decisive facts (deadline, cost, where) and one obvious next action. Detail comes after. | Inverted pyramid; GOV.UK content design ("put the most important information first"); NN/g "F-shaped pattern" scanning research |
| R2 | **One thing per screen** when we ask something. One question at a time, with a visible "question 2 of 5", a back link, and a summary at the end. | GOV.UK Design System, *Question pages* ("start by asking one question per page"), tested at scale |
| R3 | **Show less, reveal on request** (progressive disclosure). Official quotes, details and links stay one tap away, never on screen by default, but always available. | NN/g, *Progressive Disclosure* (Nielsen, 2006); Hick–Hyman law (choice time grows with options) |
| R4 | **A map of the whole task, always reachable.** Numbered sections the reader can jump between, showing where they are. Collapsible, never hiding content for good. | GOV.UK *Step by step navigation* pattern; Nielsen heuristic 6 (recognition rather than recall) |
| R5 | **Visibility of status.** Where am I (current section highlighted, position "3 of 9"), what did I answer, what does it mean, next to each official condition. | Nielsen heuristic 1 (visibility of system status) |
| R6 | **Never a verdict.** Results say "matches / differs from what you told us" next to the official wording, with free help visible. | Our rule 9; GOV.UK guidance on eligibility checkers |
| R7 | **"I don't know" everywhere,** treated as an answer, with what to do next. | Our rule 6; GOV.UK *Question pages* ("if users might not know the answer, allow them to say so") |
| R8 | **Consistent help.** "Where to get help" is in the same place on every screen. | WCAG 2.2 SC 3.2.6 *Consistent Help* |
| R9 | **Targets for thumbs.** Tap targets at least 44×44 px, primary actions at the bottom of the screen on phones, never side-by-side tiny links. | WCAG 2.2 SC 2.5.8 (24 px minimum, we use the 44 px AAA size of SC 2.5.5); Fitts's law; Hoober's thumb-zone studies |
| R10 | **Plain language, short lines.** Sentences under ~20 words, second person, one idea per sentence, 50–75 characters per line. | ISO 24495-1:2023 *Plain language*; Baymard / typographic measure research |
| R11 | **Familiar patterns.** Navigation, menus, accordions and buttons behave as people expect from the apps they use daily. No novel controls. | Jakob's law (NN/g) |
| R12 | **Calm visual hierarchy.** One primary action per screen, a neutral white surface, colour only for meaning (action, matches, differs, deadline), depth through space and soft shadow rather than lines and boxes. | Nielsen heuristic 8 (aesthetic and minimalist design); our DESIGN-BRIEF §6 |
| R13 | **Accessible by construction.** Semantic landmarks and headings, focus moves to the new content when a section changes, visible focus, no information by colour alone, works at 200 % zoom and with reduced motion. | WCAG 2.2 AA (1.4.1, 1.4.4, 2.4.3, 2.4.7, 2.4.11, 2.3.3) |
| R14 | **Motion only to explain change,** tweens ≤ 250 ms and springs settling within about 350 ms, eased, off when the system asks for reduced motion (ADR-0019, `docs/design/MOTION.md`). The one exception is the ask bar's rotating example questions (UI-RULES V14). | WCAG 2.3.3; Material motion guidance on duration |
| R15 | **Works without JavaScript** for reading: every section is a real link and renders on the server. Known exception (COPY-01, 2026-10-02): "page not found" is drawn in the browser, because Next.js 16 sends an empty error shell when the root layout sits under `[locale]`; to be fixed with the ADR-0018 decision (`globalNotFound` or a route handler). | GOV.UK service manual, *progressive enhancement* |
| R16 | **Bilingual without clutter.** The reader's language first; the Polish official wording one tap away, labelled, `lang="pl"`. | Our rule 4; WCAG 3.1.2 *Language of Parts* |

## Aesthetic direction: "wayfinding, calm and exact"

Formalka gets people through offices, so the visual language is **wayfinding**: the signage of a good airport or metro, where a stressed stranger finds the way without reading much. Not "clean and modern", which is the absence of a direction (design-for-ai, *AI Design Tells*).

- **The route line** is the one memorable element: the guide's sections and the procedure's steps are stations on a line, only the current one marked (F16, owner, 2026-10-03: the others stay neutral, so none looks read or done). It exists because the product is about routes and order (VISION), not as decoration.
- **Type:** Geologica, a geometric-humanist sans with signage-like clarity, full Polish and Ukrainian Cyrillic, tabular numerals. Not Inter/Roboto/Space Grotesk (named AI defaults).
- **Colour from purpose:** white surfaces and cool greys; ink-black for the primary action; a deep Polish red used sparingly for links, the route and brand marks (superseded the first green-teal, 2026-10-01; see UI-RULES V1); neutral with a check icon for "matches"; amber for "your answer differs"; signal yellow only for "you are here". No state emblem, flag stripes, navy or gov.pl look (rule 10), no purple gradients, no cream "paper" (the first draft fell into the cream+serif cluster that design-for-ai lists as an AI default).
- **Composition:** left-aligned and asymmetric (route map on the left, one section on the right), generous space between groups and tight space within them, depth from layered shadows that differ by elevation, not identical cards everywhere.
- **Motion:** sections slide in a few pixels with a drawer easing, 200 ms, none under reduced motion.

Checked against design-for-ai's *AI Design Tells* review criteria and ui-ux-pro-max's pre-delivery checklist (both reviewed 2026-10-01).

## What that means for the CUKR guide

| Decision | Rules |
|---|---|
| The guide is an app shell: a section map on the left (desktop, can be hidden) or in a drawer (phone), and **one section in view at a time**, with Back / Next at the bottom | R4, R5, R3, R9, R11 |
| The first section is an **overview**: title, one-sentence summary, three fact tiles (last day + days left, fees, how to apply), one primary button "Check your situation" | R1, R12 |
| "Your situation" is a **one-question-at-a-time check** with progress and back, "I don't know" on every question, then a **summary**: each official condition with what you answered and whether it matches, plus help | R2, R5, R6, R7 |
| Steps are a **numbered list of collapsed steps**: title and channel visible, details and official wording on tap | R3, R10 |
| Official wording sits behind a quiet "Official wording" toggle everywhere; translations are labelled | R3, R16 |
| "Where to get help" is a fixed entry in the section map and at the end of every section | R8 |
| White surface, cool greys, ink primary buttons, red used sparingly (never a government look), large confident headings, rounded surfaces with soft shadow, pill buttons | R12, our rule 10 (no government look-alike) |
| Section links are real URLs (`?s=steps`) rendered on the server; JavaScript only makes switching instant and moves focus | R13, R15 |

## How we check

- `ui-reviewer` checks substantial UI changes against this file and DESIGN-BRIEF §6, when WORKFLOW §1b's UI trigger applies (it took over the design reviewer's checklist, REV-1).
- Playwright tests assert the structural rules: one section in view, focus moves to the section heading, every control ≥ 44 px, no cookies or third-party requests, works in PL/UK/EN at phone and desktop widths.
- Before launch: 5 newcomers try the guide on their own phones (ROADMAP Phase 3 exit). Their behaviour overrides any rule here.
