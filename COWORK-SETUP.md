# Cowork Setup — No-Code Track (participant handout)

Goal: run the same agentic testing pipeline as the developers, with zero terminal use.
Time: ~10 minutes. Do steps 1–4 before the workshop if possible.

## 1. Install and open Cowork

1. Install the **Claude desktop app** and sign in with your work account.
2. Switch to **Cowork** (research preview) from the app's mode picker.

## 2. Get the workshop folder

You need the workshop folder on your machine — no git required:

- Easiest: ask the facilitator for the folder as a zip, unzip it anywhere (e.g. Documents/AIinTesting).
- If you have a tech buddy: they can clone the repo for you.

## 3. Point Cowork at the folder

When starting a Cowork session, **select the AIinTesting folder**. This matters:
the folder's `CLAUDE.md` loads automatically and teaches Claude the project,
the testing standards, and how to run the pipeline agents without code.

**Verify it worked** — ask:

> What are the testing standards in this project?

You should get the naming/selector/isolation rules back. If not, you selected the wrong folder.

## 4. Install the Claude in Chrome extension

This replaces the developers' Playwright MCP: it lets Claude drive a real browser,
explore the app, and report findings.

1. Install **Claude in Chrome** from the Chrome Web Store and sign in.
2. You'll need the todo app running in a browser tab — pair with a developer
   (they run `npm run dev`) or use the hosted URL the facilitator shares.

## 5. Run the pipeline — no code

The agents are described in `.claude/agents/`; `CLAUDE.md` tells Claude to read and
follow them when you ask. Use exactly these phrasings:

**Stage 1 — critique** (gate: you answer the open questions)

> Use the requirement-critic agent on this requirement: "Add a 'Clear completed'
> button that removes all completed todos. It should be quick and the user
> shouldn't lose anything important."

**Stage 2 — plan** (gate: open the doc, delete one scenario, say why)

> Use the test-planner agent on the approved acceptance criteria. Save the plan
> as a Word document in this folder.

**Stage 3 — charters instead of code** (gate: pick which charter to run)

> Turn the plan into manual test charters: step-by-step instructions with
> expected results, plus a test-data spreadsheet.

**Stage 4 — explore live**

> Open the app in Chrome and explore it like a hostile user for 5 minutes.
> Report findings as a session log with severity.

**Stage 5 — report**

> Draft a bug report for the worst finding, and a 150-word stakeholder summary.
> Save both as files in this folder.

## 6. Optional extras

- **Connectors** (Settings → Connectors): add Jira or Slack so bug reports land
  where your team works.
- **Skills** (Settings → Capabilities): install team skills so your conventions
  travel with you.
- **Scheduled tasks**: just ask — "Every weekday at 07:00, summarize the latest
  test results in this folder as a morning briefing."

## What does NOT transfer from the developers' setup

Be aware (this is also on the slides):

- `.claude/agents`, `.claude/commands`, `.claude/skills` are **not auto-loaded** —
  the `CLAUDE.md` bridge makes them work when you ask by name.
- Hooks and permission rules in `.claude/settings.json` do **not** run in Cowork —
  the human gates are your guardrails here.
- Playwright MCP is replaced by **Claude in Chrome**.

One rule carries over unchanged: **you are the quality gate.** Approve between
stages; never let outputs chain unreviewed.
