# Brand: the Formalka logo

## The idea

*To tylko formalka*: "it's just a formality". Formalities are paperwork; Formalka puts the papers in order.

The mark is the letter **F made of three sheets of paper laid over each other**: the stem, the middle sheet and the top sheet, each a lighter red, each casting a soft shadow on the one below. The top sheet has a **folded corner**, the universal sign of a document. The F is the papers, already sorted.

Why this and not something else:
- **Not official.** No eagle, seal, stamp, flag colours or "gov" look (product rule 10). Paper is what every office runs on; we don't borrow the state's symbols.
- **Simple and ownable.** Three rectangles and a fold: it holds at 16 px and as one colour.
- **Honest to the product.** We don't create documents; we put official ones in order.

History: the first mark (an F drawn as a route with a station, 2026-10-01) was replaced at the owner's request ("looks cheap") by this paper direction, after the owner's reference "letter F, overlapping paper". Two directions were drawn (layered sheets, folded sheet); layered sheets is the recommendation, owner's choice pending.

## Construction

48-unit grid, corner radius 2.5. Stem x 9–21, y 7–42 (deep crimson `#8f1124`). Middle sheet x 9–31, y 22–31 (red `#b4182f`). Top sheet x 9–39, y 7–17 (light red `#d9384b`) with a 6-unit **white** folded corner: Polish red and white, without a flag. Under the middle and top sheets, a 3.5-unit shadow on the stem (black, 28 % to 0 %). One colour: the sheets merge into one ink F with the fold drawn as a line.

The wordmark is **"formalka" in Geist SemiBold** (the interface font), lowercase, tracking −0.03 em, converted to paths. In the lockup the wordmark's ascender height is 60 % of the mark's height, centred on it, 14 units after the mark (owner: the first lockup's wordmark was too big and too close).

Source: `apps/web/public/brand/` (SVG files) and `apps/web/components/brand/Logo.tsx` (same shapes; the wordmark takes the text colour, so it follows light and dark mode).

## Versions

| File | Use |
|---|---|
| `formalka-lockup.svg` | Primary: the sheets and an ink wordmark, on light |
| `formalka-lockup-reversed.svg` | On dark: the sheets and a white wordmark |
| `formalka-lockup-mono.svg`, `formalka-mark-mono.svg` | One colour (ink); the fold as a line |
| `formalka-mark.svg` | The mark alone, on light |
| `formalka-app-icon.svg` | Favicon and app icon: the sheets on a pale tile (radius 11 of 48) |
| (planned) split F | White above, red below, for dark backgrounds only (app icon on a dark tile, dark mode): on light backgrounds the white half disappears |

## Rules

- **Clear space:** at least the top sheet's height (10 units) on every side.
- **Minimum size:** mark 16 px; lockup 96 px wide (the header uses 28 px height).
- **Colours:** the three sheet reds and the white fold as above; wordmark ink `#12161b` (`--ink`) or white on dark.
- **Colour roles on the site:** red (`--go`) belongs to the mark, links, the current place on the route and brand moments, used sparingly; the primary action is ink (`--action`, the wordmark's ink), so red never reads as a big "go" button or as "approved" (UI-RULES V1).
- **Don't:** recolour the sheets, reorder them, remove the fold or the shadows in the colour version, stretch, rotate, outline, add effects; set the wordmark in another font or in capitals; pair it with state symbols or the words "official", "gov" or "urząd".

## Status

**2026-10-01: the owner is designing the final logotype himself and will hand it over.** Until then the current mark stays in place; the explorations below (paper F, Polish quotation marks „formalka”, highlighted "form") are background only.


Paper direction drawn 2026-10-01; owner chose layered sheets, then red and white instead of green ("green reminds of Excel"), version 1 red. The split F (white above, red below) is the candidate for dark backgrounds. A trademark search is pending with the domain (NAMING.md).
