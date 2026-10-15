# Design brief

## 1. The problem with the prototype's look

The first prototype looked like every AI landing page: oversized serif headline, muted green, rounded cards, reassuring filler copy, lots of empty space. It signalled "chatbot startup", not "the reliable reference you bring to the office". We are not iterating on it; we start from a brief.

## 2. What the identity must communicate

- **Reliable, not bureaucratic.** Precise like a good public-information publication, warmer than an office.
- **Independent, not official.** Clearly not the government. No state emblem, no white-red national palette used as branding, no `gov`-like naming or layout that could mislead (this is also a legal requirement, see `COMPLIANCE.md`).
- **Useful density.** People come to get something done; content starts above the fold, not a hero banner.
- **Calm under stress.** Many users are anxious, tired or in a queue. Clear hierarchy, no clutter, no alarm colours unless something is really urgent.

## 3. Principles

1. **Typography first.** One excellent typeface family carries the identity. It must cover Polish diacritics (ą ę ł ń ó ś ź ż), full Cyrillic (Ukrainian ґ є і ї, Belarusian ў, Russian), and have tabular numerals for fees and dates. Test real strings, not lorem ipsum.
2. **Restrained layout.** A strict grid; content width tuned for reading; lists, tables and steps as first-class layouts.
3. **Functional colour.** A small palette where every colour means something: action, verified, uncertain/under review, warning/deadline, Polish original term. Colour never the only signal (icons + text too).
4. **Distinct content objects.** Instructions, conditions, exceptions, documents, fees, deadlines, sources and uncertainty each have a consistent, recognisable treatment. A user should learn the visual grammar once and read any procedure fast.
5. **Bilingual by design.** Polish official terms sit next to the user's language in a stable pattern (e.g. term in the user's language, Polish original beneath in a distinct style), never as an afterthought in brackets.
6. **One input first, like America.gov.** The homepage leads with a single "What do you need to do in Poland?" field with rotating example questions ("How do I get a karta pobytu?", "I got married. How do I change my surname?"). The same field searches procedures and starts the assistant. Life-situation shortcuts and browsing sit right below it for people who prefer not to type.
7. **Mobile first, print second.** Most use is on phones; checklists must print well on one A4 page and work offline.
8. **Accessible from the start:** WCAG 2.2 AA as our own bar, keyboard and screen-reader tested, respects reduced motion, large tap targets, zoom to 200% without breaking.

## 4. Three directions to explore

> **Status (2026-10-01, CUKR-03):** the three-direction exploration was replaced by direct owner feedback on the first deployed version ("chaotic, text-heavy, paper background, not 2026"). The direction now in use is **"wayfinding, calm and exact"**, written down with its rules (R1–R16) and checks in [`UX-RULES.md`](UX-RULES.md): white surfaces, one modern sans (Geologica), colour only with a job, a hideable section map, one section in view. A preference test with newcomers is still planned (ROADMAP Phase 3 exit). The `packages/ui` design system is deferred until a second app needs the components; tokens live in `apps/web/app/globals.css`. The text below is kept as the original brief.

Each direction is explored on the **same real screens** with real content (PESEL and address registration): homepage, situation intake step, procedure page, checklist (mobile + print), assistant conversation with citations and uncertainty, office card, and a Ukrainian-language version of the procedure page. That exposes whether it works beyond a pretty hero.

| | A. "Public notice" | B. "Field manual" | C. "Bilingual ledger" |
|---|---|---|---|
| **Idea** | Swiss-style editorial rigour: the best-designed public information system you've seen | A practical manual: numbered steps, checkboxes and tabs; feels like a tool | Two languages side by side as the core visual motif; the product is a bridge between the user's language and Polish |
| **Type** | Neo-grotesque sans, strong size contrast, tight headings | Humanist sans + monospace accents for codes, form numbers, fees | Sans for the user's language, a contrasting face (e.g. a serif or slab) reserved for Polish originals |
| **Colour** | Near-black on off-white + one signal colour | Paper tones, high-contrast ink, status colours prominent | Two tones mapped to the two languages + status colours |
| **Layout** | Generous grid, big section numbers, rules and hairlines | Dense, card-free lists, sticky progress, step counters | Split columns on desktop, stacked pairs on mobile |
| **Risk** | Can feel cold | Can feel busy | Complexity on small screens |

Deliverable per direction: tokens (type scale, colour, spacing), the seven screens at mobile and desktop, one page of rationale. Then a decision with the owner, and ideally a quick preference and comprehension test with 5–8 newcomers.

## 5. After the decision

- Build the design system in `packages/ui`: tokens, typography, layout primitives, content objects (Step, Condition, Exception, DocumentItem, Fee, Deadline, SourceCitation, UncertaintyNote, PolishTerm, OfficeCard, HandoffCard), form controls with "I don't know" built in.
- Name and wordmark: **Formalka** (see `docs/product/NAMING.md`); the wordmark is designed in Phase 2. Trademark check before registering domains. The name must work in every target language and must not imply official status.
- Illustration and icons: a small, consistent icon set for documents and offices; no stock photography of smiling people at laptops.
- Voice and tone guide per language: plain language, second person, short sentences, no false reassurance ("don't worry!"), honest about uncertainty.

## 6. Quality bar: taste, not generic AI output

The owner's bar: the product must feel designed by someone with taste, not generated. Every screen is judged against this list before it ships (the `ui-reviewer` agent checks it, when WORKFLOW §1b's UI trigger applies, see `docs/plan/WORKFLOW.md`).

**Never:**
- Gradient hero sections, glassmorphism, glowing blobs, "sparkle" AI icons, emoji used as icons.
- A grid of identical rounded cards as the answer to every layout problem.
- Stock photos or generic 3D illustrations of smiling people and laptops.
- Filler copy ("Seamlessly navigate…", "Your journey starts here", "Don't worry!").
- Centred everything; oversized headlines with nothing useful above the fold.
- More than one accent colour competing for attention; colour without meaning.
- Chat bubbles as the main interface for structured information.

**Always:**
- Real content from the first sketch (real procedure names, fees, Polish terms, Cyrillic text), never lorem ipsum.
- A deliberate type scale (few sizes, clear hierarchy), a strict spacing scale, a grid.
- Every colour, icon and weight carries meaning (action, official quote, uncertainty, deadline).
- Microcopy written for a tired person in a queue: short, concrete, second person, honest.
- States designed, not left to defaults: empty, loading, offline, error, "I don't know", "sources disagree", "source changed".
- Motion only where it explains a change (≤ 200 ms, respects reduced motion).
- Touch targets ≥ 44 px, one primary action per screen on mobile, thumb-reachable.
- Accessibility (WCAG 2.2 AA) as a design input, not an audit at the end.

## 7. Journey design method

Before any screen is built, each journey gets:
1. **A journey map**: who (persona from VISION.md), the trigger, every step across our product *and* the real world (office, queue, post, MOS), what they feel and fear at each step, where they drop out today.
2. **The critical moments**: the 2–3 moments that decide success (e.g. choosing the right route, arriving with the right documents, understanding the letter afterwards). Design effort goes there first.
3. **A flow per situation branch**, including "I don't know" and "this doesn't apply to me".
4. **Content first**: the words and data on each screen are written before layout.
5. **A prototype tested with 3–5 real newcomers** (recruited free from community groups), in their language, on their phones. Findings change the design before code.

Journeys, in the order they're designed: CUKR (December), PESEL, address registration, office visit, then each new domain.

## 8. Office visit mode: the design benchmark

The flagship interaction, and the one that shows the product's taste. Designed and tested with more care than any other screen.

- **Context:** a crowded, noisy office; one hand on a phone, the other holding documents; low battery; poor signal; stress; a clerk who speaks only Polish.
- **Modes:** *prepare* (the evening before: checklist, what to expect, route to the office), *in the queue* (ticket number, what happens next, calm), *at the counter* (show-the-clerk screen).
- **Show-the-clerk screen:** large Polish text of what you came for; the documents you brought, named as the office names them; the clerk's likely questions with the answer the user prepared, in both languages; a "Please write it down for me" card. Readable at arm's length, high contrast, works in landscape.
- **Offline first:** everything for the visit is on the device before leaving home; no network needed at the office.
- **After the visit:** what you should have received, what to check on it, the next step and its deadline (into the calendar).
- **Tested in a real office** before launch (the owner or volunteers walk through a real visit with a prototype).

## 9. Formalka Plus surfaces (ADR-0015)
The Plus offer page and the "free allowance used" state of the assistant follow the same quality bar: no generic SaaS pricing table, no dark patterns (fake scarcity, countdowns, pre-ticked boxes, guilt wording). The "allowance used" state still shows the matching procedure pages, sources and the free-help handoff; it is never a dead end. The page says plainly that core information is always free.
