# The ask bar (home page search)

Owner, 2026-10-02: "the search bar should look great, like on america.gov, but better, more modern." This page defines the look and the behaviour, and records where each idea comes from.

## References studied

- **america.gov's AI search** (owner's screenshot). A white pill with a firm black outline, a question as the placeholder ("Try 'How do I register my new business?'") and a round navy arrow button. Its strengths are confidence and one obvious action.
- **60fps.design** (owner's reference for motion). Its index of about 100 search and input interactions from real apps:
  - Perplexity: a gradient stroke draws around the input when it becomes active;
  - Google Gemini: an ambient glow behind the focused input;
  - Swiggy: the suggestion list fades and slides up as you type;
  - Grok and Perplexity: prompt suggestions as pills;
  - Swiggy and Blinkit: an auto-cycling placeholder ticker;
  - Google AI Mode: the bar morphs into a full-screen answer view.
- **Collect UI** (owner's reference) and Dribbble could not be read. Both render their galleries with scripts, and Dribbble refuses scripted access. America.gov's own page answers 403 to scripts.

## What we took, and what we made better

| Idea | Ours |
|---|---|
| Firm outline pill (america.gov) | A 2px `--ink` outline and a `--r-control` pill, 72px (`--s8`) tall. It rests on `--e2` and lifts to `--e3` on hover and focus. |
| Round arrow button (america.gov) | A 48px (`--s7`) `--action` circle with a bold arrow. It is the same black as our primary buttons, so the bar and the buttons read as one family. Enter or the arrow moves the reader onto the first answer; Enter there opens it (F12, owner, 2026-10-03: never open a guess). With nothing typed, the arrow puts the cursor in the bar. |
| Question placeholder (america.gov) | "Try 'How do I get a PESEL?'" in each language. **Better:** the search understands such questions. Filler words in EN/PL/UK are ignored ("how do I", "jak", "як"), endings are trimmed ("zameldować" finds "zameldowanie"), and when no item has every word, the items with the most words are shown. A question never dead-ends. (`lib/search.ts`, tests in `search.test.ts`.) |
| Active stroke (Perplexity) | **Our one authored moment:** on focus, a 3px `--go` ring opens outward from the ink outline (outline offset 0 → 3px, 200ms, `--ease`). It is red, so it reads as a separate signal and not as a doubled outline. It is feedback, so UI-RULES V14 allows it. It doubles as the visible focus ring (R13). The caret is `--go`. |
| Results slide up (Swiggy) | Answers rise 8px out of the bar and fade in (200ms) as you type. Each row has a small icon for its kind: guide (book), matter (document) or topic (compass). The arrow nudges on hover. Down and Up arrows move between the bar and the answers. Escape returns to the bar and clears it. |
| Auto-cycling placeholder (Swiggy, Blinkit) | **Adopted 2026-10-02** (owner left it to us). An empty bar doesn't show what you can ask; five real questions in turn show the range (PESEL, address, residence card, driving licence, citizenship).
<br><br>How it behaves:<ul><li>A question changes every 3.5s, and the new one rises into place (260ms).</li><li>It starts only after load, so nothing moves on first paint.</li><li>It runs only while the bar is empty. It pauses on hover and focus and while the tab is hidden.</li><li>It stops after two rounds, on the first question.</li><li>It is off under reduced motion.</li><li>Screen readers hear only the input's fixed placeholder.</li></ul>A test (`search-index.test.ts`) checks that every example question finds its answer in PL/UK/EN. This is the one exception to UI-RULES V14. |
| Suggestion pills (Grok, Perplexity) | Five short examples under the bar; two on phones, so they fit one row beside the label. One tap fills the bar. |

## Deliberately not taken

- **Microphone and attachment buttons** (america.gov has both). We take no voice and no files (product rule 8, ADR-0009). Nothing typed leaves the device either.
- **Morph into a full-screen answer view** (Google AI Mode). This belongs to the assistant, when it exists (Phase 3).
- **Gradient strokes and glows.** Gradients and colour halos are outside our design system (UI-RULES; impeccable craft floor). The ring gives the same "now it's listening" feeling in ink.

## Rules it keeps

Every value is a token (U1–U9 pass). Motion is feedback only and is off under reduced motion (globals.css). Touch targets are at least 44px. Contrast follows the tokens. Light and dark come from the same tokens.

## Smart search mode (SRCH-1, off by default)

Where `FORMALKA_SMART_SEARCH` is on (`docs/architecture/SMART-SEARCH.md`), the same bar invites a situation instead of a keyword: the placeholder and label read "Briefly describe what you need" (PL "Opisz krótko, czego potrzebujesz"), the rotating examples stay off, and a short note under the bar says what not to type, that the question goes to our server and to an AI service run by a US company, that we don't store it, with a link to Privacy. Typing still shows the instant keyword answers. Enter or the arrow sends the question (F12 still holds: nothing opens by itself); the answer takes the keyword answers' place in the same raised panel: up to three cards with "Why this may help" and the guide's verification level, then the keyword answers not already shown, labelled as word matches (smart search complements the keywords: together they find the most); or an honest "not sure" with pill links to all topics and free legal aid, then the word matches; or a one-line fallback notice above the keyword answers. Editing the question returns to the keyword answers. Every value is a token; the level pill uses `--attention` only for "sources disagree" and "source changed", always with the words.
