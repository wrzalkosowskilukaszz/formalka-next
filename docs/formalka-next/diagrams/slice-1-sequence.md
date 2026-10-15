# Slice 1: address registration + PESEL (no AI)

The system architecture is in 09 §1, and the task state machine in 04.

```mermaid
sequenceDiagram
  autonumber
  actor U as User (phone)
  participant App as Case app (device)
  participant Eng as case-engine (device)
  participant Reg as Registry API (public, cached)
  participant OS as OS notifications / calendar
  U->>App: "Chcę się zameldować" (start from the guide or the app)
  App->>Reg: GET template bundle arrive-register-address (no user data)
  Reg-->>App: procedures@versions, facts catalogue, form template (URL + SHA-256)
  loop until nextQuestion() = null (cap 12)
    Eng->>App: next fact (deterministic)
    U->>App: answer or "Nie wiem"
  end
  App->>Eng: plan(template, facts, events)
  Eng->>Eng: validate(plan) — fail closes the plan view
  App->>U: plan + focus "do this next" (sources, check dates, disputed items)
  U->>App: move-in date (confirmed event)
  Eng->>App: deadline (earliest/latest reading), office for TERYT
  U->>App: approve plan; allow reminders (button, not on launch)
  App->>OS: local notification day before earliest date, 09:00, generic text / .ics
  U->>App: enter personal details (device only)
  App->>App: download official PDF, check SHA-256, fill own fields (owner part empty)
  App->>U: "wypełniony formularz do podpisania" + office checklist
  U->>App: mark "file" done (user_confirmed)
  App->>Reg: daily version check of the case's procedures (no case id)
  Reg-->>App: unchanged / changed → affected tasks marked stale, banner
```
