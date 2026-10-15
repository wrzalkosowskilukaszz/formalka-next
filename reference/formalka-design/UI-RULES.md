# UI rules

How Formalka looks, as rules that can be checked. **Behaviour** (one question at a time, answer first, help in the same place, focus, targets) is in [`UX-RULES.md`](UX-RULES.md); this file is the **visual system**. The two together are the bar for every screen.

Sources: the design tokens in [`apps/web/app/tokens.css`](../../apps/web/app/tokens.css) (the only place a visual value is written down), the brand in [`BRAND.md`](BRAND.md), and three published design skills applied to our case: *taste-skill*, *redesign-skill* and *minimalist-skill* (github.com/leonxlnx/taste-skill, read 2026-10-01).

## Design read

> A trust-first public-information guide for stressed newcomers on phones; a redesign in overhaul mode; a calm, exact, modern sans language with one accent; native CSS tokens, no UI framework.

Dials (taste-skill): **variance 4** (mostly calm, one asymmetric hero), **motion 3** (feedback and state changes only), **density 4** (comfortable app spacing). Trust-first overrides "wow": nothing may look like a government service (product rule 10), and nothing may look like a template.

## Machine-checked rules (U)

`apps/web/lib/ui-lint.test.ts` runs with `pnpm test` and in CI. It reads `tokens.css`, every stylesheet, every component and every UI string.

| ID | Rule | Why |
|---|---|---|
| U1 | No raw colour (hex, rgb, hsl…) outside `tokens.css` | One palette, light and dark from the same names |
| U2 | Font sizes are `--t-xs` … `--t-2xl` | Few sizes, clear jumps (each ≥ 1.2×) |
| U3 | Font weights are `--w-regular`, `--w-medium`, `--w-strong` | Hierarchy by weight and colour, not by noise |
| U4 | Margins, paddings and gaps are `--s1` … `--s9` (1–3 px only for optical steps) | One rhythm: tight inside groups, generous between them |
| U5 | Radii follow the shape lock: `--r-control` (pills: buttons, switches), `--r-container` (16: panels, tiles), `--r-inner` (10: options, rows, chips) | One shape system (taste-skill "shape consistency lock") |
| U6 | Shadows are `--e1`–`--e3`, or 0-blur rings in token colours | Elevation only means "floats above the page" |
| U7 | z-index values are the layer tokens | No `z-index: 9999` arms race |
| U8 | Durations and easing are `--dur-fast`, `--dur`, `--dur-slow`, `--ease` | Motion is short and the same everywhere |
| U9 | One type family (Geist), set once | No mixed families |
| U10 | No uppercase labels, no wide tracking | Owner's direction; sentence case reads faster in every language |
| U11 | Icons only from Phosphor via `components/icons.tsx`; the only hand-drawn SVG is the logo | One icon family and weight (taste-skill) |
| U12 | No arrow or dash glyphs typed into components (→ ↗ — –) | Icons for arrows; typography isn't decoration |
| U13 | No em or en dashes in interface text; at most one middle dot per string | The most common AI-text tell; Ukrainian "X — Y" is rephrased, not dashed |
| U14 | Text tokens reach 4.5:1 and control borders 3:1 on every surface, in light and dark | WCAG 2.2 AA, from the tokens themselves |
| U15 | A component that moves takes every duration, easing and spring from `lib/motion.ts`, and uses only the lazy `m.*` components | ADR-0019, the motion system |

Official quotes are content, not interface text: they stay verbatim (product rule 3), dashes included.

## Reviewed rules (V)

Judged on rendered pages by the `ui-reviewer` agent (`.claude/agents/ui-reviewer.md`) at 390×844 and 1280×800, in PL, UK and EN, light and dark.

| ID | Rule |
|---|---|
| V1 | **The primary action is ink-black** (`--action`, one per screen; owner, 2026-10-01, after the Shopify reference). **The accent is a deep Polish red** (`--go`, the name is historical), used sparingly: links, the current place on the route, brand marks, the first guide card on a topic page. Red and white without flag stripes, the eagle or gov.pl's look (rule 10). Never red for "yes" or "matches": those are neutral with a check icon. `--signal` only for "you are here". `--attention` (dark amber) only for "differs from your answer" and deadlines. `--done` (green) only for a plan task the reader marked done, always with a check icon and the word (owner, 2026-10-06). |
| V2 | **One primary action per screen** (a filled ink pill, `--action`). Everything else is quiet (well pill, text link). |
| V3 | **Elevation means something.** Raised surfaces only for: the start journey panel, the deadline tile, the guide link, the drawer, the pager bar. No card grids, no white boxes for the sake of boxes. |
| V4 | **Space separates, lines rarely.** No hairline on every row of a list; group with space, a well background, or one line above a group. |
| V5 | **No decorative dots, no disclaimer badges.** Dots only carry state (the route map's stations). The verification level is a plain footnote at the end of each section; only a real problem (the source changed, sources disagree) goes above the content, in words with an icon. |
| V6 | **Headlines:** the home question ≤ 2 lines on desktop; page titles ≤ 3 lines on a phone; sentence case; never an all-caps eyebrow above a heading. |
| V7 | **Lead text** ≤ ~25 words, ≤ 4 lines; body text within `--measure`. |
| V8 | **Theme lock:** one canvas per page (`--canvas`); sections never switch to a different background family; dark mode keeps the same hierarchy. |
| V9 | **Shape lock in practice:** pills are interactive; 16-radius containers hold content; 10-radius rows and options sit inside them. Nothing square next to something round without that reason. |
| V10 | **Icons** are Phosphor regular, sized by the text (`.icon`), in the text's colour or `--go`; never a coloured icon tile grid as decoration (topic icons sit in one soft tile style). |
| V11 | **Long strings fit:** Polish diacritics, Ukrainian Cyrillic and long German-style compounds don't overflow, truncate a meaning, or break a button onto two lines at desktop. |
| V12 | **Numbers** are tabular (`.tabular`) where they line up or change (dates, counts, amounts). |
| V13 | **Copy:** plain, specific, no "seamless/elevate/unlock", no exclamation marks, no cute wordplay; the same thing has the same name everywhere. |
| V14 | **Motion** only for feedback and state change (press, open, switch), with numbers from `lib/motion.ts` and the tokens only (U15, ADR-0019, `docs/design/MOTION.md`); nothing animates on first load; everything respects reduced motion. **One exception (owner, 2026-10-02):** the home ask bar's example questions rotate while the bar is empty and idle. They start only after load, pause on hover and focus, stop after two rounds, and are off under reduced motion (`docs/design/SEARCH-BAR.md`). |
| V15 | **Honest identity:** no state emblem, no government colours or naming, the independence line in the footer, the logo used per `BRAND.md`. |
| V16 | **No template tells:** no centred hero over a gradient, no three identical feature cards, no fake screenshots, no stock people, no emoji, no "trusted by" rows. |

## Token reference

| Family | Tokens | Use |
|---|---|---|
| Surfaces | `--canvas`, `--raised`, `--well`, `--well-strong`, `--scrim` | Page, floating panels, quiet fills and hovers, behind the drawer |
| Text | `--ink`, `--ink-2`, `--ink-3` | Primary, secondary, meta |
| Lines | `--line`, `--line-strong` | Dividers (rare), control borders |
| Meaning | `--go` deep red (+ `-strong`, `-soft`, `--on-go`), `--attention` dark amber (+ `-soft`), `--signal`, `--done` green (+ `-soft`, `--on-done`) | Action and links; differs and deadlines; you are here; the reader's own "done" |
| Type | `--t-xs` 13, `--t-sm` 15, `--t-md` 17, `--t-lg` 21, `--t-xl` 28–38, `--t-2xl` 36–56; `--w-*`; `--track-*`; `--leading-*` | |
| Space | `--s1` 4 · `--s2` 8 · `--s3` 12 · `--s4` 16 · `--s5` 24 · `--s6` 32 · `--s7` 48 · `--s8` 72 · `--s9` 96 | Inside a group s1–s3; between groups s4–s6; between sections s7–s9 |
| Shape | `--r-control`, `--r-container`, `--r-inner` | See U5, V9 |
| Elevation | `--e1`, `--e2`, `--e3` | Hairline lift, raised panel, drawer |
| Motion | `--dur-fast` 120, `--dur` 200, `--dur-slow` 260, `--ease` | |
| Layers | `--z-raised`, `--z-header`, `--z-bar`, `--z-drawer`, `--z-skip` | |
| Layout | `--measure`, `--container`, `--target` (44), `--focus` | |

## Changing the system

Change a token, not a component. A new token needs a reason in its comment and, for colours, passes U14. A new rule goes here first, then into the lint test (U) or the agent's checklist (V).
