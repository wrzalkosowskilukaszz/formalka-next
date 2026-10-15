-- Formalka Next: device-local case store (SQLite dialect). Proposal, not applied anywhere.
-- Lives only on the user's device (ADR-N002). Encrypted at rest by the platform store or by
-- an app-level key (09 §3). No table here is ever synced to a server by default.

PRAGMA foreign_keys = ON;

CREATE TABLE cases (
  id            TEXT PRIMARY KEY,            -- random UUID, never derived from personal data
  template_id   TEXT NOT NULL,               -- registry case template, e.g. 'arrive-register-address'
  goal_text     TEXT,                        -- the user's own words; never sent unmasked
  language      TEXT NOT NULL CHECK (language IN ('pl','uk','en','ru')),
  status        TEXT NOT NULL CHECK (status IN ('draft','active','paused','closed','archived')),
  companion     TEXT,                        -- JSON: { name?, tone? } presentation only
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

-- Append-only: the source of truth. Current state is a fold over these rows.
CREATE TABLE events (
  seq           INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id       TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,               -- fact_changed | move_in_date_set | letter_received | rule_changed
                                             -- | rule_withdrawn | plan_proposed | plan_approved | task_status_changed
                                             -- | artifact_added | action_done | reminder_scheduled | user_note
  at            TEXT NOT NULL,               -- ISO instant
  origin        TEXT NOT NULL CHECK (origin IN ('user','system','registry','companion_proposal_accepted')),
  payload       TEXT NOT NULL                -- JSON, validated by Zod on write
);
CREATE INDEX events_case ON events(case_id, seq);

-- Materialised: latest assertion per fact (rebuilt from events if lost).
CREATE TABLE facts (
  case_id       TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  key           TEXT NOT NULL,               -- fact catalogue key, non-identifying only (checked)
  value         TEXT NOT NULL,               -- JSON value or '"__unknown__"'
  origin        TEXT NOT NULL CHECK (origin IN ('user_answer','user_confirmed_extraction','extracted_unconfirmed','derived')),
  asserted_at   TEXT NOT NULL,
  PRIMARY KEY (case_id, key)
);

-- Identifying data for form filling only. Separate table, separate key, never in events,
-- never in an AI brief, wiped on demand or after export (setting).
CREATE TABLE personal_details (
  case_id       TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  field         TEXT NOT NULL,               -- e.g. 'surname', 'pesel', 'birth_date'
  value_enc     BLOB NOT NULL,               -- encrypted with the device key
  PRIMARY KEY (case_id, field)
);

CREATE TABLE plan_versions (
  case_id         TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  no              INTEGER NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('proposed','active','superseded','rejected')),
  inputs_hash     TEXT NOT NULL,             -- sha256 of facts + registry version ids + events used
  planner_version TEXT NOT NULL,
  plan            TEXT NOT NULL,             -- JSON: milestones, tasks, deps, docs, fees, deadlines, ruleRefs
  validator       TEXT NOT NULL,             -- JSON report; only 'pass' plans may be proposed
  created_at      TEXT NOT NULL,
  approved_at     TEXT,
  PRIMARY KEY (case_id, no)
);

-- Task state survives plan versions (stable task ids).
CREATE TABLE task_state (
  case_id       TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  task_id       TEXT NOT NULL,               -- 'procedureId:stepId[:variant]'
  status        TEXT NOT NULL CHECK (status IN ('blocked','ready','in_progress','waiting_external','done','not_needed','cancelled')),
  completion    TEXT,                        -- JSON: { kind: user_confirmed|system_confirmed|authority_evidence, evidenceIds: [] }
  reason        TEXT,                        -- for not_needed / cancelled
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (case_id, task_id)
);

CREATE TABLE artifacts (
  id            TEXT PRIMARY KEY,
  case_id       TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('official_blank','filled_official','generated_draft','user_upload','checklist')),
  title         TEXT NOT NULL,
  template      TEXT,                        -- JSON: { formId, version, sha256, fieldMapVersion }
  status        TEXT NOT NULL CHECK (status IN ('needed','draft','ready','used','superseded')),
  file_ref      TEXT,                        -- app-private file path; never a server URL
  provenance    TEXT NOT NULL,               -- JSON: how it was made, from which inputs
  created_at    TEXT NOT NULL
);

CREATE TABLE evidence (
  id            TEXT PRIMARY KEY,
  case_id       TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('user_confirmation','artifact','official_reference','photo')),
  refs          TEXT NOT NULL,               -- JSON
  at            TEXT NOT NULL
);

CREATE TABLE actions (
  id            TEXT PRIMARY KEY,
  case_id       TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  tool_id       TEXT NOT NULL,
  level         INTEGER NOT NULL CHECK (level BETWEEN 0 AND 3),
  request       TEXT NOT NULL,               -- JSON
  preconditions TEXT NOT NULL,               -- JSON: what was checked
  permission    TEXT,                        -- JSON: who approved, when, what exactly
  result        TEXT,                        -- JSON: actual outcome
  status        TEXT NOT NULL CHECK (status IN ('requested','approved','done','failed','reverted')),
  at            TEXT NOT NULL
);

-- Scheduled local reminders (device notification ids), derived from confirmed dates only.
CREATE TABLE reminders (
  id              TEXT PRIMARY KEY,
  case_id         TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  task_id         TEXT NOT NULL,
  fire_at         TEXT NOT NULL,
  basis           TEXT NOT NULL,             -- JSON: which confirmed date + which rule produced it
  platform_id     TEXT,                      -- id returned by the OS scheduler
  status          TEXT NOT NULL CHECK (status IN ('scheduled','fired','cancelled'))
);
