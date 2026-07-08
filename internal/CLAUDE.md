# CLAUDE.md — The Misfits

## Project Overview
The Misfits is a webring platform where makers submit their personal sites, receive auto-generated embeddable widgets, and get listed in a shared discovery network. It connects indie makers and their projects through a structured, navigable web of sites.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styles:** CSS Modules
- **Animation:** GSAP
- **Database:** Neon Postgres
- **Hosting / Edge:** Cloudflare

## How to Work in This Project

### Read First
- **Read PLANS.md first, before anything else.** It is the master plan for the project — check what is done (strikethrough) and what is still pending. Resume from the next pending item unless the user says otherwise.
- Read this file at the start of every session, no exceptions.
- Read DESIGN.md before touching any frontend code.
- Read CHANGELOG.md to understand what has already been done.
- Read RELEASES.md before pushing any public update — it tracks all versioned public releases.
- See Internal Docs/ for architecture reference, user flows, and component registry.

### Before Making Changes
- For any major change (new feature, schema change, routing change, auth change, deleting files): stop, explain what you're about to do in plain simple terms, and wait for confirmation before proceeding.
- "Major change" means anything that affects more than one file or changes existing behavior.
- Small fixes (typos, CSS tweaks, copy changes) can proceed without confirmation.
- **Always make a plan first.** Show the steps clearly, numbered, before touching any code. Execute one step at a time.

### How to Work
- Make the minimal change necessary to complete the task.
- Do not refactor unrelated code.
- Do not rename variables or restructure files unless specifically asked.
- Do not add comments that weren't asked for.
- **Always explain things in the simplest possible way** — assume no prior knowledge of the specific thing being discussed.

### Metric Changes (Font Size, Padding, Width, Spacing, etc.)
- Never guess a single value for metric changes.
- When asked to adjust any metric (font size, padding, margin, width, height, gap, border-radius, line-height, etc.), always pause and present 3 options before touching any code:
  - Option A — [conservative / subtle]
  - Option B — [balanced / recommended]
  - Option C — [bold / pronounced]
- Show the actual CSS values for each option. Wait for the user to choose one before implementing anything.
- This applies even if the user says "a little bigger" or "slightly more padding" — still show 3 options.

### Committing Rules
- **Never push to the remote repository** — only commit locally. The user will push when ready.
- **Bundle commits** — group related changes into one meaningful commit. Do not micro-commit single-line changes.
- A good commit covers a complete unit of work: one feature, one fix, one refactor — not individual file saves.
- Write clear commit messages that describe what changed and why.
- Auto-commit after completing a task unless the user says otherwise.

### Token and Time Discipline
- If you are spending more than 2–3 back-and-forths figuring something out, stop.
- Summarize what you know, what you're uncertain about, and ask one specific question.
- Do not think in loops. Analyze → decide → act.
- If a task feels unclear, ask before starting, not after writing 200 lines of code.

### After Every Task
- Update CHANGELOG.md. Every completed task gets a row. No exceptions.
- If the task built or significantly changed a component → update Internal Docs/COMPONENTS.md.
- If the task added a new screen or changed an existing one → update Internal Docs/SCREENS.md.
- If the task changed the database schema → update Internal Docs/SCHEMA.md.
- If the task added, changed, or removed an API endpoint → update Internal Docs/API.md.
- If the task changed the auth flow or user roles → update Internal Docs/AUTH.md.
- If a non-obvious technical or design decision was made → log it in Internal Docs/DECISIONS.md.
- Do these updates immediately. Do not batch them for later.

### Maintaining Internal Docs

Internal Docs/ must always reflect the real state of the project. A stale doc is worse than no doc.

**Update triggers — act on these immediately:**
- New component built → COMPONENTS.md
- New screen or view added → SCREENS.md
- Architectural change (new service, database, major dependency) → ARCHITECTURE.md
- Key decision made (technical or design) → DECISIONS.md — include: what was decided, what alternatives were considered, and why this choice was made
- Database schema changes → SCHEMA.md
- API endpoint added, changed, or removed → API.md
- Auth flow or user roles change → AUTH.md

**Formatting rules for all Internal Docs files:**
- Use tables for any list of items that have attributes (components, screens, endpoints, fields).
- Use numbered steps for sequential flows (user journeys, auth steps, data pipelines).
- H2 for major sections, H3 for subsections — no deeper nesting.
- Keep entries short — one clear sentence or one short paragraph per item.
- Never leave placeholder text. If a section is not yet applicable, write "Not yet defined."
- Sort component and screen tables alphabetically by name.
- When updating a table, always update the full row — never leave a column blank unless the value is genuinely unknown.

### Release Check

After completing any feature or meaningful set of changes, ask:

> "Should this go out as a public update? If yes, I'll log it in RELEASES.md."

If yes:
- Suggest a version number based on the nature of changes (MAJOR / MINOR / PATCH) and explain the reasoning.
- Ask for a release title if not obvious from the work done.
- Write the release entry — version, date, time, title, and bullet-point changes written in plain user-facing language (not technical language).
- Add the new version to the top of the Release Index table in RELEASES.md.
- Do not add a release entry without asking first.

**Ask after:**
- A new feature or user-visible addition is complete.
- A meaningful batch of bug fixes is done.
- The user says anything involving: deploying, pushing, shipping, launching, or going live.

**Do not ask after:**
- CSS tweaks, copy edits, or single-file fixes.
- Refactors with no visible change for the user.
- Work the user has explicitly marked as internal or in-progress.

## Project-Specific Rules
- **Never change the database schema without explicit permission.** Always explain the proposed change and wait for a clear yes before touching anything schema-related.
- **Never push to the remote repository.** Commits only — the user pushes when they decide to.
- **Bundle commits.** No micro-commits. Group related work into one meaningful commit.
- **Always plan first.** Before any implementation, show the steps. Execute one at a time.
- **Explain simply.** No jargon without explanation. Treat every explanation as if the specific thing is being heard for the first time.

## Folder Structure
No fixed structure defined — build folders as needed and document them here as the project grows.
