# Spike S3: fill an official form's own fields

**Run:**
1. Download the official file into an empty directory of its own. It is untrusted input.
2. Run `python3 -I fill.py <that>/temporary.pdf <out>.pdf` (pypdf 6.17.0).
3. Never commit the PDFs (`.gitignore`).

## Hypothesis
Formalka can produce the *official* registration form already filled with the user's details, on the device, without recreating the form. It should hold four properties:
- the official file's own AcroForm fields;
- a reviewed field map;
- a hash check that disables filling when gov.pl changes the file;
- the owner's statement and the consent boxes left for people to fill.

## Input
- The official form: "formularz zgłoszenia pobytu czasowego", `https://www.gov.pl/attachment/606f2b47-0c11-4744-a2b4-9eab57c2fbb8`, the link in `content/procedures/zameldowanie.yaml`. Downloaded on 2026-10-15; SHA-256 `04ab2fbb…2b24`.
- A synthetic person (`TESTOWA ANNA`, PESEL `00000000000`, which fails the checksum on purpose).

## Expected behaviour
1. The file is an AcroForm, not XFA, not encrypted, and its fields can be listed.
2. Filling the person's fields and reading them back gives the same values.
3. These stay empty:
   - the owner's statement ("oświadczenie właściciela …");
   - the three consent checkboxes ("wyrażam zgodę …");
   - two fields of unknown meaning ("n", "z").
4. A file with a different hash is refused: "filling disabled, template needs review".
5. The output renders with the values in a standard viewer.

## Test and result (2026-10-15)
| Check | Result |
|---|---|
| Structure | 110 fields (106 text, 4 checkboxes), 3 pages, no XFA, not encrypted (`field-inventory.json`) |
| Fill + read back | 42 fields filled, **0 mismatches** |
| Left for the owner/user | 14 fields untouched, **0 forbidden fields filled** |
| Hash mismatch (one byte appended) | Refused, exit 1 |
| Render (poppler `pdftoppm`, page 1) | Values visible in the right boxes: surname, names, PESEL digits, country, birth date, place |

## What the field map review found (why a person must review every template)
- The file's own field names have typos: "miesiąć", "miesiac", "siedemansta".
- The fields are not in reading order (the postcode digits run 2, 3, 4, 1, 5).
- Two fields are opaque ("n", a text field, and "z", a checkbox). Their meaning has to be read off the page.
- PESEL, dates, phone, house and flat numbers are one field per character, so a long house number like "12A/3" needs a rule.
- Consent to pass contact data to the register is the user's legal choice, so it is never pre-ticked.

## Limitations
- **Tool:** this used pypdf in Python, while production would use pdf-lib in the web view or Capacitor. Not tested on a phone [S3b, 13 §PR-6].
- **Rendering:** the appearance relies on `NeedAppearances`. Some viewers, iOS Quick Look among them [UNVERIFIED], may not regenerate appearances, so production should generate appearance streams.
- **Scope:** one form. The permanent-stay form and other offices' forms are not inventoried.
- **Office acceptance:** whether offices accept a printed form filled by software is **OPEN**. Ask 2–3 offices (14 §6).
- **Letters:** whether diacritics and capital letters ("WYPEŁNIAJ WIELKIMI LITERAMI") need handling: upper-casing is done by the caller here, and the font's Polish glyph coverage is not checked.

## Decision consequence
- Official-form filling is feasible for this form. Keep it in slice 1 as Level 1 (draft) and Level 2 (export).
- A form template = URL + SHA-256 + reviewed field map + a list of never-fill fields. A hash change disables filling (08 §1).
- Phase 1 must include a pdf-lib port with generated appearances, tested on Android WebView and iOS Safari, before the slice is called done.
