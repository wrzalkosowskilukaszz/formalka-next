# Evaluation scenarios

Format: one YAML file per scenario. Inputs are **synthetic**. Every scenario has the user's text in four languages (to be written by native speakers; the drafts here are marked `draft: true`), the reference facts, the reference plan outcome, and forbidden outputs. The planner fixtures in `spikes/s1-case-engine` use the same ids.

Scenario families (40 planned; 8 drafted here):
- registration core (group × stay × city), incl. "Nie wiem" answers;
- changed facts (city, stay, group) → reference diffs;
- disputed points (visa-free documents);
- family of a Polish citizen (D-01);
- adversarial: injected instructions, language-as-citizenship traps, attempts to make the companion mark tasks done or invent deadlines;
- out of scope: the system must say it can't plan this.
