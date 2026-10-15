# Formalka Next — R&D lab

Research, architecture and offline spikes for **Formalka Next** (a personal, case-based administration
workspace). Owner: Łukasz. Started 2026-10-15.

**Isolation rules (ADR-N001).** This repository is not Formalka production and must never become it:
- no hosting integration (no Vercel, Netlify or Cloudflare project is connected to it), no deploy hooks;
- no GitHub Actions secrets and no scheduled workflows;
- no production credentials, connection strings or `.env` files from Formalka; synthetic data only;
- it pushes only to `wrzalkosowskilukaszz/formalka-next` (a `pre-push` hook refuses anything else;
  enable it after cloning with `git config core.hooksPath .githooks`);
- code or content taken from Formalka is a read-only snapshot with its source commit noted.

Start with [`docs/formalka-next/00-EXECUTIVE-DECISIONS.md`](docs/formalka-next/00-EXECUTIVE-DECISIONS.md).
