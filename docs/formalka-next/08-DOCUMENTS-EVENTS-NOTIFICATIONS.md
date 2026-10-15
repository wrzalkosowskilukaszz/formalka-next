# 08 — Documents (Teczka), events and notifications

## 1. The Teczka

| Kind | What | Stored | Trust label in the UI |
|---|---|---|---|
| A. Official source document | The official blank form or page (link + hash; optionally a cached copy of the exact file) | Link always; file cached on the device only after download | "Official form, downloaded from gov.pl on …" |
| B. User-generated draft | Checklists, letter drafts from registry templates | Device | "Draft from Formalka, check before use" |
| C. User upload | Photos/scans of letters, decisions, stamps | **Not in the first slice.** Later: opt-in, device only, never synced | "Your file" |
| D. Completed official artifact | The official PDF filled on the device from a reviewed form template | Device | "Official form filled by you with Formalka; print, sign and bring it". Never "submitted" or "accepted" |

### Filling official forms safely

[FACT, spike S3, 2026-10-15] The gov.pl temporary-stay registration form linked from the address-registration guide:
- is an AcroForm PDF with 110 named fields (106 text, 4 checkboxes), no XFA, not encrypted;
- writing synthetic values into its fields and reading them back works (pypdf 6.17).

The field inventory is in `spikes/s3-official-form-fill/field-inventory.json`, with the file's SHA-256.

Rules:
1. **Never recreate an official form** for visual convenience. Fill the official file's own fields.
2. **Form template = (form id, official URL from the source registry, SHA-256, reviewed field map).** If the downloaded file's hash differs, the template is "needs review": filling is disabled and the official link is shown.
3. **Field map reviewed by a person:**
   - PESEL is one field per digit;
   - dates are split into digits;
   - checkboxes have export values;
   - the owner's confirmation section is **left empty**: the owner fills and signs it, Formalka never does.
4. **Fill on the device** (pdf-lib in the web view; no server, no LLM). Personal details come from the device-only `personal_details` table.
5. Fields stay editable, so the user can correct by hand. The output is labelled "to print and sign by hand". Whether offices accept printed filled forms is [OPEN], to verify with 2–3 offices (14 §6).
6. **Template versioning:** form templates are versioned registry rows; a superseded version keeps old artifacts readable and marks them `superseded`.

Uploaded documents (later phase): default to no persistent scans. If added, choose on-device OCR first [OPEN: availability and quality of OS text recognition through Capacitor plugins, to be spiked]. Otherwise send masked text only after explicit consent, and keep the image out of any server.

## 2. Events

| Event | Origin | Deterministic consequence | LLM needed? |
|---|---|---|---|
| `move_in_date_set` | User | Due date of the registration deadline = date + rule days (Europe/Warsaw calendar days) | No |
| `fact_changed` | User | Replan proposal + diff | No |
| `task_status_changed` | User / system | Unblocks dependants | No |
| `artifact_added` | System | Task may become ready / done candidate | No |
| `rule_changed` / `rule_withdrawn` | Registry (public changes feed) | Affected tasks stale; banner "official rule changed" | No |
| `letter_received` (later) | User | Candidate notice analysis; the response deadline comes from a rule | Optional (extraction) |
| `deadline_due` | Derived from a confirmed date | Reminder | No |

Registry changes reach the device through a **public changes feed**: a list of procedure versions published or withdrawn since a timestamp. The device polls it with no user data and matches it locally against its cases. The server never learns which procedures a user tracks. ETag caching is assumed; polling interval [OPEN].

## 3. Notifications

Constraints verified on 2026-10-15:
- **iOS/iPadOS web apps:** Web Push only after the site is added to the Home Screen (iOS 16.4+), with a manifest `display: standalone|fullscreen`, and permission requested from a user gesture [FACT: WebKit blog "Web Push for Web Apps on iOS and iPadOS"].
- **Scheduled local notifications on the web (Notification Triggers):** Chrome's status shows the origin trial completed and launch "not started"; not in Safari [FACT: developer.chrome.com, read 2026-10-15]. So a PWA cannot reliably schedule a reminder on the device; it needs a server push.
- **Capacitor Local Notifications:** schedules notifications on the device at a date and time with no server [FACT: capacitorjs.com docs]. Android 12+ needs the exact-alarm permission for exact timing; otherwise inexact, and `allowWhileIdle` is limited to once per 9 minutes per app.
- **Calendar export (.ics with alarms):** already exists in Formalka (ADR-0015); works everywhere, no permission, no server.

Design:

| Channel | Where | Server knowledge | Phase |
|---|---|---|---|
| In-app "needs attention" | All | None | Slice |
| `.ics` export with alarms | All | None | Slice |
| Local notification (Capacitor) | Android app (internal test), later iOS app | None | Slice (Android) |
| Web Push (content-free payload) | Installed PWA incl. iOS | A push subscription + a fire time + a random id; nothing about the case | Later, needs an ADR amending ADR-0009 and a privacy review |
| Email | — | Would need an address | Not planned (ADR-0009) |

Rules:
- **Only confirmed dates notify:** a recorded event (move-in date) plus a registry rule; never a guessed date, never an LLM date.
- **Lock-screen privacy by default:** "Formalka: masz jutro jedno zadanie" (no procedure names). Detailed text is opt-in.
- **Idempotent scheduling:** reminder id = hash(case, task, basis). A replan cancels and reschedules; one reminder per task per day at most; nothing outside 08:00–20:00 local time.
- **Opt-in:** permission is asked when the user approves a plan with a confirmed date, from a button, never on first launch.
- **Usefulness metrics** (device-local, opt-in export only):
  - share of reminders followed by the task done within 48 h;
  - opt-out rate after the first reminder;
  - **wrong-date reminders = 0** (release-blocking, 11 §4).

An LLM is never needed for scheduling, deduplication or deadlines. It is optional only for the conversational "what changed" explanation, and that can also be templated.
