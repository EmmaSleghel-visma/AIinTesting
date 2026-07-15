---
emoji: 📊
description: Daily summary of repository activity posted as a GitHub issue
on:
  schedule: daily
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
  actions: read
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
safe-outputs:
  mentions: false
  allowed-github-references: []
  create-issue:
    title-prefix: "Daily Activity Report:"
    labels: [report]
    close-older-issues: true
    expires: 30
---

# Daily Activity Report

## Task

Generate a concise daily activity report for the **EmmaSleghel-visma/AIinTesting** repository covering the **last 24 full hours ending at workflow start (UTC)**.

Use `gh` commands to collect the following data for the window:

1. **Commits** — commits pushed to the default branch
2. **Issues** — issues opened and closed
3. **Pull Requests** — PRs opened, merged, and closed
4. **Workflow Runs** — CI/CD runs that completed (pass/fail summary)

## Report Format

Post the report as a new issue using `create-issue`. Structure the body using GitHub-flavored markdown:

- Start with a `### Summary` section listing key counts (commits, issues opened/closed, PRs opened/merged, workflow runs passed/failed)
- Use `> [!WARNING]` if any workflow runs failed
- List commits with author and short message under `### Commits`
- Wrap issues, PRs, and workflow run details in `<details><summary>...</summary>` blocks for progressive disclosure
- Format workflow run IDs as linked references: `[§RUN_ID](https://github.com/EmmaSleghel-visma/AIinTesting/actions/runs/RUN_ID)`
- Use `### ` (h3) for main sections and `#### ` (h4) for subsections — never use h1 or h2

## No-op Behavior

Call `noop("No repository activity in the last 24 full hours (WINDOW_START to WINDOW_END UTC)")` when there are zero commits, issues, pull requests, and workflow runs in the window.
