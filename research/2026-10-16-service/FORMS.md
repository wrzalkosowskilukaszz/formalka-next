# The official forms on this journey: what they ask, and where a person can go wrong

The PDFs are not committed, following the S3 spike rule. Each is named by its URL and SHA-256, downloaded on 16.10.2026. A field's label is read from the form itself. Where a field is hard, the reason is marked FACT (in the form or a source) or HYPOTHESIS (to test with people).

| Form | URL | SHA-256 (16.10.2026) | Pages |
|---|---|---|---|
| Formularz zgłoszenia pobytu czasowego (EL/ZC/1) | https://www.gov.pl/attachment/606f2b47-0c11-4744-a2b4-9eab57c2fbb8 | `04ab2fbb…2b24` | 3 |
| Formularz zgłoszenia pobytu stałego (EL/ZPS/1) | https://www.gov.pl/attachment/82958602-cf7d-4d31-8911-627a1566075f | `bfc5293f…c6e6` | 3 |
| Wniosek o nadanie numeru PESEL (EL/W/1) | https://www.gov.pl/attachment/2098ee8f-6401-4bf6-b046-626377a446a9 | `1a9a51a4…dc65` | 4 |

FACT: the temporary-stay form's hash is the one spike S3 recorded on 15.10. The template has not changed since.

## Formularz zgłoszenia pobytu czasowego (110 fields; field inventory in `spikes/s3-official-form-fill/field-inventory.json`)

| Part | Fields | Where a person can go wrong |
|---|---|---|
| Instructions | "WYPEŁNIAJ WIELKIMI LITERAMI", how to tick a box, black or blue ink | FACT: the instructions are in Polish with an English line; no other language. HYPOTHESIS: a person who does not read Polish fills it with a helper, or at the desk |
| The person | Surname, first names, PESEL (11 boxes), date of birth, country of birth, place of birth | FACT: PESEL is asked, but a newcomer does not have one yet. HYPOTHESIS: people leave it empty, or think they need a PESEL first (the order is the reverse: registration assigns it, UEL art. 17 ust. 1 pkt 2) |
| Country of residence | "kraj miejsca zamieszkania" | HYPOTHESIS: unclear for a newcomer whether this means Poland or the home country |
| The address | Voivodeship, municipality, town or district, street, house number (9 boxes), flat number, postcode (5 boxes) | FACT: one box per character (S3), so "12A/3" needs a rule. HYPOTHESIS: the voivodeship and "gmina" fields are unknown to newcomers |
| The period | "data początkowa", "data końcowa" | FACT: for non-EU people, the declared period may not exceed their legal stay (UEL art. 41 ust. 4; warszawa19115.pl card AO/02/07/K). HYPOTHESIS: people write the lease's end date, not the visa's |
| The owner's statement | Owner's place, date and signature: the owner or another title holder confirms the stay (point 6 per warszawa19115.pl) | FACT: the owner's signature is needed on the paper form (art. 28 ust. 2), and without it there is a separate route (GOV "Problem z zameldowaniem"). OPEN-12: whether a tenant with a lease still needs it |
| The person's statement | Place, date, signature | — |
| Contact data | E-mail, mobile phone (20 boxes), and three consent boxes to pass contact data to the register | FACT: optional; the consent is the person's own choice, so it is never pre-ticked (S3). HYPOTHESIS: people think the consent is required |
| Proxy | The proxy's name | FACT: a non-EU person without PESEL must come in person (art. 40 ust. 3) |
| Unclear | Text field "n", checkbox "z" | FACT: their meaning cannot be read from the field names (S3). It must be read off the page |

The **permanent-stay form** has the same structure; its fields are not inventoried (S3 limitation).

## Wniosek o nadanie numeru PESEL (EL/W/1)

| Section | What it asks | Where a person can go wrong |
|---|---|---|
| 1. Applicant | Name and correspondence address of whoever files | HYPOTHESIS: confused with section 2 when filing for oneself |
| 2. The person | Names, surname, sex, date of birth, country of birth, country of residence, citizenship ("polskie", "bezpaństwowiec", "inne"), a Polish passport, or a foreign travel document with its number and expiry | — |
| 3. Additional data and parents | Birth surname, place of birth, the birth certificate's reference and civil registry office, parents' names | FACT: "Wypełnij, jeżeli dane są dostępne i wynikają z przedstawionych dokumentów". Warsaw asks for documents confirming items 3–5 (warszawa19115.pl, PESEL card). HYPOTHESIS: people do not know which foreign documents count, or whether they need translation (OPEN) |
| 4–5. Civil status and the last marriage event | Status; spouse's name and PESEL; the event, its date, the act or court reference | HYPOTHESIS: hard to fill from foreign civil documents |
| 6. Notification | Paper or electronic; for electronic, an ePUAP box address | FACT: this is how the person learns the number (UEL art. 21). HYPOTHESIS: newcomers have no ePUAP box and pick electronic by mistake |
| 7. Legal basis | "wskazanie przepisu, z którego wynika obowiązek posiadania numeru PESEL" | FACT: gov.pl says to write the actual legal basis, and that the office requiring PESEL (ZUS, the tax office) should give it. FACT: a missing element gets a 7-day notice to fix, then the application is left unexamined (art. 18 ust. 3). **The app must never suggest a legal basis**; it cannot know the person's obligation |
| 8. Signature | Place, date, handwritten signature | FACT: a paper application signed by hand, at any municipal office (art. 18 ust. 1). In person for non-EU/EFTA/CH/UK applicants since 1.01.2026 (art. 18 ust. 1a) |

## What this means for the app

- Filling an official form stays a mock with sample data until offices confirm they accept software-filled forms. That question is OPEN, from spike S3.
- The PESEL application's legal basis is never pre-filled or suggested.
- The declared end date on the temporary form is the riskiest field for non-EU people (art. 41 ust. 4). Interviews should ask what people wrote there.
