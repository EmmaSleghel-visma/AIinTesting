# AI in Testing — Claude Code Workshop Run-Book

Full-day advanced workshop (~7h) for testers who already use Claude day-to-day. Target: leave
with a working mental model of context engineering, Claude Code customization, agentic test
pipelines with human gates, and headless/CI automation — all demonstrated against this repo's
todo app.

The app is deliberately trivial. Every technique shown scales to real systems; the app just
keeps demos under a minute.

## Facilitator prep (do this the day before)

```bash
npm install
npx playwright install chromium
npm test                     # suite must be green before you start
claude                       # in repo root
```

Inside Claude Code, verify:

- `/agents` lists: requirement-critic, test-planner, test-generator, test-reviewer, test-healer, bug-hunter, accessibility-tester
- `/mcp` shows `playwright-test` connected
- Typing `/` shows the six project commands (analyze-coverage, create-test-plan, ...)
- `/memory` shows `CLAUDE.md`

Attendee prerequisites: Claude Code installed and authenticated, Node 20+, this repo cloned,
`npm install` done. Send this list out a week ahead; budget zero workshop time for setup.

---

## Agenda

| Time | Block |
|------|-------|
| 09:00–09:30 | Welcome + testing recap |
| 09:30–10:45 | Block 1 — Context engineering for testing |
| 10:45–11:00 | Break |
| 11:00–12:30 | Block 2 — The customization toolbox |
| 12:30–13:15 | Lunch |
| 13:15–15:00 | Block 3 — The agentic testing pipeline |
| 15:00–15:15 | Break |
| 15:15–16:30 | Block 4 — Automation at scale |
| 16:30–17:00 | Wrap-up — risks, pitfalls, blindspots |

---

## 09:00–09:30 — Welcome + testing recap

No slides needed beyond the agenda. Points to land:

- AI does not change *why* we test (risk reduction, information for decisions). It changes
  the *cost curve*: generating tests is nearly free, so the scarce skills shift to
  specifying intent, reviewing output, and knowing what NOT to automate.
- The failure mode of cheap generation is cheap garbage at scale: green suites that assert
  nothing, tests that mirror bugs instead of catching them.
- Today's throughline: **you are the quality gate**. Every block adds machinery; every block
  also adds a place where a human must say "approved".
- Tour the repo (5 min): `index.html` + `main.js` (the whole app), `tests/`, `.claude/`
  (today's subject), `.mcp.json`.

---

## 09:30–10:45 — Block 1: Context engineering for testing

**Thesis:** the quality of AI-generated tests is a function of the context you engineer, not
the prompt you type.

### Demo 1.1 — The CLAUDE.md effect (10 min)

Show the memory hierarchy first: enterprise policy → `~/.claude/CLAUDE.md` (user) →
`<repo>/CLAUDE.md` (project, committed) → `CLAUDE.local.md` (personal, gitignored) →
directory-scoped files like `tests/CLAUDE.md` that load only when Claude works there.
Run `/memory` to show what is loaded right now.

Now prove it matters. Temporarily hide the memory:

```bash
mv CLAUDE.md /tmp/CLAUDE.md && mv tests/CLAUDE.md /tmp/tests-CLAUDE.md
```

In Claude Code (fresh session, `/clear`):

```
Write a Playwright test that verifies deleting a todo works.
```

**Expected:** plausible but generic — likely text selectors, maybe a waitForTimeout, no
localStorage isolation. Restore memory:

```bash
mv /tmp/CLAUDE.md CLAUDE.md && mv /tmp/tests-CLAUDE.md tests/CLAUDE.md
```

`/clear`, same prompt. **Expected:** `should X when Y` naming, `beforeEach` clearing
localStorage, selector priority respected, auto-waiting assertions. Diff the two outputs on
screen — this is the whole argument for context engineering in one diff.

### Demo 1.2 — Examples beat rules (10 min)

Open `tests/CLAUDE.md`. Point at the "Common patterns" code block. A rule ("ensure test
isolation") is interpreted; an example (`beforeEach` with `localStorage.clear()`) is copied.
When output drifts, the fix is usually a better example, not a longer rule. Show the `#`
shortcut: type `# prefer getByRole over CSS selectors when both work` in Claude Code and show
it offering to persist the note to memory.

### Exercise 1A — Requirement analysis (20 min)

Hand out this deliberately bad requirement:

> "Users should be able to edit their todos easily. Editing should feel fast and intuitive.
> The edited todo is saved."

Task, individually:

```
Analyze this requirement for testability. What is ambiguous, what is missing,
what cannot be verified as written? Rewrite it as numbered Given/When/Then
acceptance criteria. Requirement: <paste>
```

**Expected outcomes to surface in debrief:** "easily/fast/intuitive" are untestable; no
trigger defined (double-click? edit button?); no cancel/escape behavior; no empty-edit rule;
no persistence statement; no keyboard path. Compare a few attendees' acceptance criteria —
the variance IS the lesson: without sharp criteria, five testers test five different features.
(This same job is automated by the `requirement-critic` agent in Block 3 — tell them that,
and that the agent is only as good as this skill they just practiced.)

### Exercise 1B — Test data generation (20 min)

```
Generate a test data set for todo text input: 15 values covering boundaries,
unicode, emoji, RTL text, HTML/script injection payloads, whitespace variants,
and a 1000-character string. Output as a TypeScript array of {value, category,
expectedBehavior} objects I can drop into a parameterized test.
```

Then have them push back — this is the real skill:

```
Which three of these values are most likely to find a real bug in main.js, and
why? Read the source before answering.
```

**Expected:** Claude reads `main.js`, notices `textContent` rendering (XSS payloads render
inert), the `trim()` guard (whitespace rejected), and no length limit (the 1000-char case is
genuinely untested). Debrief: generation is trivial; *prioritization against the actual
implementation* is where the model earns its keep — and where it needs the source in context.

### Wrap block 1 (5 min)

Memory files are a team artifact: committed, reviewed, versioned. The instant a convention
changes, CLAUDE.md is where it changes first.

---

## 11:00–12:30 — Block 2: The customization toolbox

**Thesis:** stop retyping your good prompts. Package them as commands, knowledge as skills,
personas as subagents, and hard rules as hooks.

### Demo 2.1 — Slash commands (10 min)

Commands = parameterized prompt files in `.claude/commands/`. Open `analyze-coverage.md`,
point out: frontmatter (`description`, `argument-hint`, `allowed-tools`), `$ARGUMENTS`
substitution, `` !`command` `` pre-execution (the test list is injected before Claude sees the
prompt), `@file` injection. Run:

```
/analyze-coverage
```

**Expected (~2 min):** feature/test matrix; gaps flagged for theme persistence, XSS,
localStorage corruption; top-3 recommendation. Then:

```
/create-test-plan mark all todos as complete at once
```

**Expected:** a risk-prioritized plan for a feature that doesn't exist yet — plans are
cheaper than code; review happens before generation. (This is Exercise "risk-based test
planning" folded into a command: attendees run it again later with their own feature.)

### Demo 2.2 — Skills (10 min)

Open `.claude/skills/playwright-e2e/SKILL.md`. Skills are on-demand knowledge: only the
`description` sits in context permanently; the body loads when relevant (progressive
disclosure — this is why skills can be long while CLAUDE.md must stay short). Trigger it:

```
Refactor tests/todo.spec.ts to use a Page Object.
```

**Expected:** the TodoPage pattern from the skill, not an invented one.

### Demo 2.3 — Subagents (10 min)

Run `/agents`. Open `.claude/agents/bug-hunter.md`: frontmatter `name` /
`description` / `tools` / `model`. Three points for an advanced room:

1. The `description` drives **automatic delegation** — write it as "Use this agent when...".
2. `tools` is a capability boundary: bug-hunter is Read/Grep/Glob only — it *cannot* "helpfully
   fix" the bug it found. Least privilege as test-design tool.
3. Subagents get their own context window and **cannot call other subagents** — the main
   agent orchestrates; each agent's prompt ends with a handoff note telling the main agent
   what comes next. (Foreshadows Block 3.)

```
Use the bug-hunter agent to analyze main.js.
```

**Expected:** severity-ranked findings — `saveTodos()` lacks try-catch (quota/private mode),
`crypto.randomUUID()` availability, no input length limit.

### Demo 2.4 — Hooks and permissions (10 min)

CLAUDE.md is advice; hooks are law. Open `.claude/settings.json`:

- `permissions.allow`: `npm test`, `npx playwright test`, `npm run` pre-approved (no
  confirmation fatigue for the safe loop); `git push` asks; `.env` reads denied.
- `PreToolUse` on `Edit|Write`: inline python reads the tool input JSON from stdin; if the
  file is a `.spec.ts` and the new content contains `waitForTimeout`, it exits 2 — the edit
  is **blocked** and the stderr message is fed back to Claude, which self-corrects.
- `PostToolUse`: prints a reminder to run the suite after any spec edit (kept instant —
  never run a full test suite inside a hook).

Live-fire it:

```
Add a test to tests/todo.spec.ts that uses page.waitForTimeout(500) to wait
before asserting.
```

**Expected:** the edit is blocked, Claude reads the hook message and rewrites with an
auto-waiting assertion. Deterministic guardrail vs probabilistic instruction — that contrast
is the demo.

### Exercise 2A — Build your own subagent (25 min)

Each attendee creates `.claude/agents/<name>.md` for a persona from their real job. Menu of
suggestions (or invent):

- **risk-reviewer** — reads a git diff, outputs a risk table: area touched → tests to run →
  regression risk (they will reuse this in Block 4's CI exercise)
- **test-data-generator** — the Exercise 1B prompt, productized
- **api-contract-checker**, **flake-detective**, **release-notes-tester**...

Requirements: `description` that states *when* to use it, minimal `tools` (justify each), a
structured output format, a handoff note to the main agent. Meta-move to demonstrate: have
Claude Code write the agent —

```
Create .claude/agents/risk-reviewer.md following the structure of
.claude/agents/bug-hunter.md. It should <spec>. Give it read-only tools.
```

Then test it on a real prompt. Debrief 2–3 volunteers' agents on screen.

### Exercise 2B — Build a skill (15 min)

Create `.claude/skills/<name>/SKILL.md` capturing knowledge their team re-explains weekly:
test-environment quirks, tricky selectors on their product, API auth for test setup, flake
triage playbook. Emphasize: the `description` determines triggering — write it as "Use
when...", test it by asking a question that *should* trigger it (watch the skill load) and
one that shouldn't.

### Wrap block 2 (5 min)

Decision heuristic: repeated prompt → command; reference knowledge → skill; persona +
tool boundary + separate context → subagent; non-negotiable rule → hook.

---

## 13:15–15:00 — Block 3: The agentic testing pipeline

**Thesis:** chain specialized agents with a human gate between every stage. The pipeline:

```
requirement-critic → [HUMAN GATE] → test-planner → [HUMAN GATE]
      → test-generator → [HUMAN GATE] → test-reviewer → sign-off
                                              ↘ (fixes loop back to generator)
test-healer: on call whenever the suite breaks
```

Subagents can't invoke each other — the main agent orchestrates, and each stage's output ends
with a handoff note telling the main agent (and you) what's next. The gates are not
ceremony: each one is where you stop compounding errors. A vague requirement becomes a wrong
plan becomes fifty wrong tests.

### Demo 3.1 — Full pipeline run (40 min, the centerpiece)

Requirement under test (paste as-is, flaws included):

> "Add a 'Clear completed' button that removes all completed todos. It should be quick and
> the user shouldn't lose anything important."

**Stage 1 — critique:**

```
Use the requirement-critic agent on this requirement: <paste>
```

**Expected (~3 min):** "quick" and "important" flagged untestable; open questions (button
placement? visible when zero completed? confirmation? undo?); numbered Given/When/Then
acceptance criteria; risk surface (persistence after clear, all-completed case, empty list).
**GATE:** answer the open questions yourself, out loud, editing the criteria in the chat.
This is the demo of the human'S job.

**Stage 2 — plan:**

```
Invoke the test-planner agent with the approved acceptance criteria above. Have
it explore the running app first, then save the plan to specs/.
```

**Expected (~5 min):** agent drives the real browser via the playwright-test MCP server,
discovers the button does not exist yet, and plans against the criteria anyway (point out:
planning against acceptance criteria, not implementation, is test-first). Plan lands in
`specs/`. **GATE:** open the plan, delete one low-value scenario on camera, say why.

**Stage 3 — implement + generate:** first let the main agent add the feature (5 min — it's a
todo app), then:

```
Invoke the test-generator agent with the approved plan in specs/. One test per
scenario.
```

**Expected (~10 min):** generator executes each scenario live in the browser, then writes
specs from the recorded log — show that the selectors come from reality, not imagination.
**GATE:** skim one generated file, run `npm test`.

**Stage 4 — review:**

```
Invoke the test-reviewer agent on the generated tests, with the acceptance
criteria and the plan.
```

**Expected (~5 min):** CHANGES REQUIRED with a concrete fix list (typically: missing
persistence-after-clear check or weak count assertions), or APPROVED with sign-off. If
changes: show the loop — main agent re-invokes generator with only the fix list.

Debrief: total wall-clock ~30 min for critique → plan → feature → tests → review. Ask the
room what their team's cycle time for that is today. Then ask which gate they'd be most
tempted to skip — that's the one that will burn them.

### Demo 3.2 — Exploratory testing with Playwright MCP (10 min)

The MCP server isn't only for the pipeline — it's an exploratory instrument:

```
Open the app and explore it like a hostile user for 5 minutes. Try to break
add, complete, delete, and the theme toggle. Try keyboard-only operation.
Report anything surprising as a session log: what you tried, what you observed,
severity.
```

**Expected:** a charter-style session report; typically finds the missing max-length limit
and focus-loss after delete. Frame it properly: this is session-based exploratory testing
with an inexhaustibly patient junior — it does not replace human exploration, it feeds it.

### Exercise 3A — MCP exploration (20 min)

Attendees run their own charter. Assign different ones per table: keyboard-only, data
extremes, persistence abuse (reload mid-action, two tabs), accessibility (or run the
`accessibility-tester` agent and verify one of its findings by hand). Deliverable: three
observations, each with repro steps and a severity, pasted into the shared doc. Debrief:
which observations would have been cheaper WITHOUT the AI? (Honest answer: some.)

### Exercise 3B — Break it, heal it (25 min)

Sabotage round. Each attendee edits `index.html` — rename `id="todo-input"` to
`id="task-input"` (or change the Add button text, or the delete button class). Run
`npm test`, watch it burn. Then:

```
Use the test-healer agent to fix the failing tests.
```

**Expected:** healer runs the suite, debugs the failure live, uses `browser_generate_locator`
against the changed DOM, patches selectors, re-runs to green. Watch for the trap and discuss
it explicitly: the healer must decide whether the TEST or the APP is wrong. Here the app
change was intentional, so healing the test is correct — but if the healer "fixes" a test
around a genuine regression, your suite now certifies the bug. That's why healer output with
`test.fixme()` markers goes to a human (or bug-hunter), never straight to merge. Revert the
sabotage afterwards (`git checkout index.html` if needed — tests were healed to the new DOM,
so re-heal or `git checkout tests/` too; cleanest is a scratch branch for this exercise).

---

## 15:15–16:30 — Block 4: Automation at scale

**Thesis:** everything before lunch was interactive. The same machinery runs headless, in CI,
and in parallel.

### Demo 4.1 — Headless Claude (`claude -p`) (15 min)

```bash
claude -p "Run /analyze-coverage and output only the markdown table" > coverage-report.md
```

One flag turns any workflow from a conversation into a pipeline step. Structured output:

```bash
claude -p "List the three highest-risk untested behaviors in this repo as JSON:
[{behavior, risk, suggestedTest}]" --output-format json
```

Mention the knobs that matter for CI: `--allowedTools` to constrain capabilities,
`--permission-mode` for non-interactive runs, `--output-format stream-json` for logs.

### Exercise 4A — Bug triage, headless (15 min)

Give the room this bug report (or use one of their real ones):

```bash
claude -p "Triage this bug report against main.js and the test suite:
'Sometimes when I add a todo really fast after reloading, it disappears.'
Output: likely root cause, affected code path, severity, whether an existing
test should have caught it, and a proposed regression test title." 
```

**Expected:** a defensible triage note referencing the load/save flow. Debrief: this is a
5-second-per-bug pre-triage layer for your backlog — with the explicit caveat that it
*proposes*, a human *disposes*.

### Exercise 4B — Test report generation (10 min)

```bash
npx playwright test --reporter=json > results.json 2>/dev/null
claude -p "Read results.json and write a stakeholder summary: overall health,
what is covered, notable gaps, one recommendation. No jargon, 150 words max."
```

**Expected:** the report your PM actually reads. Point: raw pass/fail data → decision-ready
information is a testing deliverable, and it's now free.

### Demo 4.2 — CI and GitHub Actions (15 min)

Two integration levels (show, don't build live — network and secrets eat workshops):

1. **Interactive**: the Claude GitHub App — comment `@claude fix the failing test in this PR`
   on a pull request; it runs the healer workflow in an Action and pushes a commit for review.
2. **Programmatic**: a workflow step running `claude -p` on every PR.

### Exercise 4C — risk-reviewer in CI (on paper / in pairs, 10 min)

Sketch (YAML skeleton below) a workflow that runs the risk-reviewer agent from Exercise 2A on
every PR diff and posts the risk table as a PR comment:

```yaml
on: pull_request
jobs:
  risk-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: |
          git diff origin/${{ github.base_ref }}... > pr.diff
          claude -p "Use the risk-reviewer agent on pr.diff. Output the risk
          table as markdown." > review.md
      - run: gh pr comment ${{ github.event.number }} --body-file review.md
        env: { GH_TOKEN: ${{ secrets.GITHUB_TOKEN }} }
```

Discussion: what must be true before you trust this? (Deterministic permissions, pinned
model, a human still owning the merge button, and a plan for the day it's confidently wrong.)

### Demo 4.3 — Parallelism and the SDK (10 min)

- **Git worktrees**: `git worktree add ../todo-a11y` — run one Claude per worktree
  (accessibility tests here, edge cases there), same repo, zero collisions. This is how you
  run the pipeline on three features simultaneously.
- **Agent SDK** (mention, don't demo): everything used today — subagents, hooks, MCP,
  permissions — is programmable in TypeScript/Python. When a workflow outgrows the CLI, you
  ship it as a product: a test-triage bot in Slack, a nightly exploratory-session service.
  Same primitives, no new concepts.

---

## 16:30–17:00 — Wrap-up: risks, pitfalls, blindspots

Run as discussion, seeded with these:

**Pitfalls you saw today (name them from the day's own artifacts):**
- **Confident garbage**: the Block 1 no-context test looked fine and was worse. Review effort
  must scale with generation volume, or quality silently inverts.
- **Healer moral hazard** (Exercise 3B): auto-fixing tests can certify regressions. Healing
  is a diagnosis tool; merging is a human act.
- **Assertion theater**: generated tests that execute much and verify little. Reviewer agent
  helps; reading the assertions yourself helps more.
- **Context rot**: CLAUDE.md nobody maintains becomes actively harmful — the model follows
  your stale conventions faithfully.
- **Prompt-injection surface**: agents that read web pages/tickets/PR text ingest untrusted
  instructions. Least-privilege `tools` in agent frontmatter and deny-rules in settings are
  the mitigation, not vibes.

**Blindspots that remain yours:**
- The model optimizes for plausible, not true. It will invent a selector before admitting
  ignorance — ground it in real DOM (MCP) and real source (context).
- Coverage of the *specified* is not coverage of the *needed* — requirement-critic moves
  this earlier but a human still owns "we built the wrong thing".
- Ethics/compliance: your test data, your users' data, your license to send code to a model —
  know your org's answer before Monday.

**Closing exercise (10 min):** each attendee writes down the ONE workflow from today they
will implement next week, and the first gate they will put a human at. Go around the room.

---

## File structure

```
AIinTesting/
├── CLAUDE.md                        # Project memory — always loaded
├── .mcp.json                        # playwright-test MCP server (npx playwright run-test-mcp-server)
├── .claude/
│   ├── settings.json                # Permissions + hooks (waitForTimeout blocker, post-edit reminder)
│   ├── agents/
│   │   ├── requirement-critic.md    # Pipeline stage 1 — sharpen requirements
│   │   ├── test-planner.md          # Stage 2 — explore app, write plan to specs/
│   │   ├── test-generator.md        # Stage 3 — execute scenarios live, emit specs
│   │   ├── test-reviewer.md         # Stage 4 — final gate, read-only critique
│   │   ├── test-healer.md           # On call — debug & fix failing tests
│   │   ├── bug-hunter.md            # Read-only code analysis
│   │   └── accessibility-tester.md  # WCAG audit, static + live browser
│   ├── commands/
│   │   ├── analyze-coverage.md      # /analyze-coverage
│   │   ├── create-test-plan.md      # /create-test-plan <feature>
│   │   ├── generate-edge-cases.md   # /generate-edge-cases <feature>
│   │   ├── debug-failing-test.md    # /debug-failing-test <test>
│   │   ├── review-test-quality.md   # /review-test-quality [file]
│   │   └── convert-manual-to-automated.md
│   └── skills/
│       ├── playwright-e2e/SKILL.md  # E2E patterns — loads on demand
│       └── vitest-unit/SKILL.md     # Unit test patterns — loads on demand
├── tests/
│   ├── CLAUDE.md                    # Directory-scoped memory — E2E conventions
│   └── *.spec.ts                    # Playwright tests
├── specs/                           # Test plans saved by test-planner
├── index.html / main.js / style.css # The app
├── playwright.config.ts
└── package.json
```

## Timing safety valves

Running long? Cut in this order: Exercise 2B (skills), Demo 4.3, Exercise 4B. Never cut the
Block 3 gates discussion or the wrap-up — they carry the workshop's actual message.
