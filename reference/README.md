# Reference snapshots from Formalka (read-only)

These are copied from `wrzalkosowskilukaszz/formalka` at **04057ef** (2026-10-15, after the D-01 merge), as ADR-N001 allows. Never edit them here, and never copy anything back. When production changes, take a new snapshot and note the new commit.

| Folder | From | Use |
|---|---|---|
| `formalka-design/tokens.css` | `apps/web/app/tokens.css` | Colours, type, spacing, radius, motion. The prototype's visual values come from here |
| `formalka-design/*.md` | `docs/design/` | Design brief (quality bar, "never generic AI look", §6), UX rules, UI rules, motion, search bar, copy glossary, brand |
| `formalka-design/brand/` | `apps/web/public/brand/` | The logo (mark, lockups, app icon). Usage rules are in `BRAND.md` |
| `citizenship/procedure-recognition.yaml`, `facts-recognition.yaml` | `content/procedures/obywatelstwo.yaml`, `content/facts/obywatelstwo.yaml` | Citizenship by recognition (uznanie, voivode): steps, documents, fees, conditions, each with its official quote and URL |
| `citizenship/procedure-grant.yaml`, `facts-grant.yaml` | `content/procedures/obywatelstwo-nadanie.yaml`, `content/facts/obywatelstwo-nadanie.yaml` | Citizenship by grant (nadanie, President) |
| `address-registration/procedure-zameldowanie.yaml`, `facts-zameldowanie.yaml` | `content/procedures/zameldowanie.yaml`, `content/facts/zameldowanie.yaml` | Address registration for foreigners, incl. D-01 |
| `address-registration/procedure-pesel.yaml`, `facts-pesel.yaml` | `content/procedures/pesel.yaml`, `content/facts/pesel.yaml` | PESEL application |
| `language-certificate/procedure-certyfikat-polski.yaml`, `facts-certyfikat-polski.yaml` | `content/procedures/certyfikat-polski.yaml`, `content/facts/certyfikat-polski.yaml` | State certificate in Polish. The citizenship language proof links here (cross-case). Its exam-date quotes failed the gate on 2026-10-15 because the official page changed, so treat its dates as stale |

**Caveat.** The October 2026 quality inventory checked the citizenship guides only in a first pass, without a second verification. A prototype may show their values only as clearly labelled examples ("przykład z przewodnika Formalki, stan na 15.10.2026"), never as advice to a real person.
