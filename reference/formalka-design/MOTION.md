# Motion

How Formalka moves, and why. Engine and rules: ADR-0019. Numbers: `apps/web/lib/motion.ts` (mirrors `app/tokens.css`).

## Principles
1. **Motion explains a change the reader made.** Nothing moves on load, and nothing moves on its own. The ask bar's example questions are the one exception (UI-RULES V14).
2. **Direction carries meaning.** Forward comes from the right and back from the left. Things the reader sends somewhere travel there (an answer becomes a chip).
3. **Springs for movement, tweens for opacity.** `snappy` is for what the reader moves; `soft` is for what arrives. Both settle within about 350 ms with no visible wobble.
4. **Calm, not showy.** One authored moment per interaction. Small distances (8–32 px). Reduced motion turns movement off; fades remain.

## The start questions (home)
| Moment | Motion |
|---|---|
| Tap an answer | The button gives under the finger (CSS `scale: 0.98`). The answers row eases open and the new chip settles in (scale 0.92 → 1, `snappy`). A shared-element morph from the wide answer to the small chip was tried and dropped, because it stretched the text over the next question (UI review 2026-10-02). |
| Next question | The old question fades out (120 ms). The new one slides in from the right (32 px, `soft`). Its answers follow one after another (20 ms apart). The panel eases to the new height (`snappy`). |
| Back, or tap a chip | The same, from the left. The chips after it fade out and the row closes. |
| Progress | A hairline track under "Question 2 of 3" fills with a spring. |
| Last answer | The plan takes the questions' place at once (`popLayout`, so the page never collapses). It rises 8 px into place while the questions fade, and its cards arrive in turn. It shows the answers as chips, each one a way to change just that answer. |
| Mark as done | The tick pops (0.6 → 1.15 → 1, `snappy`). The card doesn't move under the finger; done tasks go last on the next visit. |
| Returning reader | The plan is simply there. Nothing arrives. |

## Not yet (candidates, each must explain a change)
- Swipe between questions on phones (Capacitor apps).
- View Transitions between a guide's sections and between pages.
- The assistant: streaming text and the source cards arriving.

## Loading
Motion isn't part of the page's first load. It arrives on the reader's first scroll, touch, pointer move or key press (ADR-0019). Until then everything works and nothing moves, and its arrival changes nothing visible.
