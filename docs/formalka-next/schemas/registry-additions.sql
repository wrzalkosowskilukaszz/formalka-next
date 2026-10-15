-- Formalka Next: additions to the existing public registry (PostgreSQL, production schema in
-- packages/db/src/schema.ts at 504a210). Proposal only; no migration exists or may be run from the lab.
-- Everything here is public knowledge, versioned like procedure_versions (ADR-0011).

-- A case template: the reusable recipe behind a case (extends the existing `journeys` idea).
CREATE TABLE case_templates (
  id            text NOT NULL,
  version_no    integer NOT NULL,
  status        text NOT NULL CHECK (status IN ('draft','gate_failed','published','superseded','withdrawn')),
  content       jsonb NOT NULL,   -- { goal{pl,en,uk,ru}, procedures[{procedureId, when: Rule}], links[{from, to, type, when}] }
  plannable     boolean NOT NULL, -- passed the stricter "plannable" bar (06 §2)
  checked_at    date,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, version_no)
);

-- Per procedure step: how a task is presented and what counts as done (lives with the procedure
-- version so a rule change re-versions both).
CREATE TABLE task_templates (
  procedure_id  text NOT NULL,
  version_no    integer NOT NULL,
  step_id       text NOT NULL,
  kind          text NOT NULL CHECK (kind IN ('prepare','get_document','fill_form','visit','pay','wait','respond','decide')),
  done_evidence jsonb NOT NULL,   -- which completion kinds are meaningful, e.g. ['user_confirmed','authority_evidence']
  tools         jsonb NOT NULL,   -- allowed tool ids for this task (07 §2)
  PRIMARY KEY (procedure_id, version_no, step_id)
);

-- Official form versions Formalka can fill: the exact file, its hash and a reviewed field map.
CREATE TABLE form_templates (
  form_id         text NOT NULL,  -- e.g. 'zgloszenie-pobytu-czasowego'
  version         text NOT NULL,  -- official version label or download date
  source_url      text NOT NULL,  -- must exist in the source registry (rule 2)
  sha256          text NOT NULL,  -- the exact official file; a different hash = a new version to review
  field_map       jsonb NOT NULL, -- personal-detail field -> PDF field name(s), formats, digit splitting
  reviewed_by     text,           -- role, never a name
  reviewed_at     date,
  status          text NOT NULL CHECK (status IN ('draft','reviewed','withdrawn')),
  PRIMARY KEY (form_id, version)
);
