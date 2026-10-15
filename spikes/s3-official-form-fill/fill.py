"""Spike S3: fill the official gov.pl temporary-stay registration form with SYNTHETIC data.

Usage: python3 -I fill.py <official.pdf> <out.pdf>
Get the official file yourself into an empty directory (it is untrusted input):
  curl -sSfo <dir>/temporary.pdf https://www.gov.pl/attachment/606f2b47-0c11-4744-a2b4-9eab57c2fbb8
Needs pypdf (tested with 6.17.0). The production design fills on the device with pdf-lib; this
script only proves the file's own fields can be filled and read back. Never commit the output.
"""
import hashlib
import json
import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter

HERE = Path(__file__).resolve().parent
INVENTORY = json.loads((HERE / "field-inventory.json").read_text(encoding="utf-8"))
ORD = ["pierwsza", "druga", "trzecia", "czwarta", "piąta", "szósta", "siódma", "ósma",
       "dziewiąta", "dziesiąta", "jedenasta"]

# Synthetic person. Not a real PESEL (fails the checksum on purpose), not a real address.
PERSON = {
    "nazwisko": "TESTOWA", "imię (imiona)": "ANNA", "pesel": "00000000000",
    "kraj urodzenia": "UKRAINA", "miejsce urodzenia": "TESTOWO", "data urodzenia": "01011990",
    "kraj miejsca zamieszkania": "UKRAINA", "ulica": "TESTOWA", "numer domu": "1",
    "kod pocztowy": "00000", "miejscowość dzielnica": "TESTOWO", "gmina": "TESTOWO",
    "województwo": "MAZOWIECKIE", "data początkowa": "28102026",
}

# Reviewed by a person before production (08 §1 rule 3). Kept empty here on purpose:
# - the owner's statement ("oświadczenie właściciela ...") is the owner's to fill and sign;
# - consent checkboxes are the user's own decision, never pre-ticked;
# - "n" and "z" have no readable meaning in the file; mapping them needs a look at the page.
NEVER_FILL_PREFIXES = ("oświadczenie właściciela", "wyrażam zgodę")
UNMAPPED = {"n", "z"}


def digits(prefix: str, value: str, names: set[str]) -> dict[str, str]:
    """Spread a value over one-character fields; the form's own names are inconsistent."""
    out = {}
    for i, ch in enumerate(value):
        name = f"{prefix} {ORD[i]} cyfra"
        if name not in names:
            raise SystemExit(f"field map needs review: no field {name!r}")
        out[name] = ch
    return out


def date_fields(prefix: str, ddmmyyyy: str, names: set[str]) -> dict[str, str]:
    out = {}
    for part, chunk in (("dzień", ddmmyyyy[0:2]), ("miesiąc", ddmmyyyy[2:4]), ("rok", ddmmyyyy[4:8])):
        for i, ch in enumerate(chunk):
            # The file itself misspells two month fields ("miesiąć", "miesiac").
            spellings = (part, "miesiąć", "miesiac") if part == "miesiąc" else (part,)
            candidates = [f"{prefix} {s} {ORD[i]} cyfra" for s in spellings]
            name = next((c for c in candidates if c in names), None)
            if name is None:
                raise SystemExit(f"field map needs review: {prefix} {part} digit {i + 1}")
            out[name] = ch
    return out


def main(src: str, dst: str) -> None:
    data = Path(src).read_bytes()
    sha = hashlib.sha256(data).hexdigest()
    if sha != INVENTORY["sha256"]:
        raise SystemExit(f"hash mismatch ({sha}): the official file changed; filling disabled, template needs review")
    reader = PdfReader(src)
    fields = reader.get_fields() or {}
    names = set(fields)
    values = {k: PERSON[k] for k in ("nazwisko", "imię (imiona)", "kraj urodzenia", "miejsce urodzenia",
                                      "kraj miejsca zamieszkania", "ulica", "miejscowość dzielnica", "gmina", "województwo")}
    values.update({f"{ORD[i]} cyfra PESEL": ch for i, ch in enumerate(PERSON["pesel"])})
    values.update(date_fields("data urodzenia", PERSON["data urodzenia"], names))
    values.update(date_fields("data początkowa", PERSON["data początkowa"], names))
    values.update(digits("numer domu", PERSON["numer domu"], names))
    values.update(digits("kod pocztowy", PERSON["kod pocztowy"], names))
    for k in values:
        assert k in names, k
        assert not k.startswith(NEVER_FILL_PREFIXES) and k not in UNMAPPED, k

    writer = PdfWriter(clone_from=reader)
    for page in writer.pages:
        writer.update_page_form_field_values(page, values, auto_regenerate=False)
    writer.set_need_appearances_writer(True)
    with open(dst, "wb") as f:
        writer.write(f)

    back = PdfReader(dst).get_fields() or {}
    wrong = {k: (v, back[k].get("/V")) for k, v in values.items() if back[k].get("/V") != v}
    untouched = [k for k in back if k.startswith(NEVER_FILL_PREFIXES) or k in UNMAPPED]
    filled_forbidden = [k for k in untouched if back[k].get("/V") not in (None, "", "/Off")]
    print(json.dumps({"sha256": sha, "fields": len(names), "filled": len(values), "readBackMismatches": wrong,
                      "leftForOwnerOrUser": len(untouched), "forbiddenFilled": filled_forbidden}, ensure_ascii=False))
    if wrong or filled_forbidden:
        raise SystemExit(1)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
