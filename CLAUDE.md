# Todo App — AI in Testing Workshop

Vanilla-JS todo app (add / complete / delete, light–dark theme, localStorage persistence) used as the target system for AI-assisted testing exercises. No framework, no build step beyond Vite, no backend.

## Commands

- `npm run dev` — Vite dev server at http://localhost:5173 (Playwright starts it automatically via `webServer`)
- `npm test` — run all Playwright tests
- `npm run test:ui` — Playwright UI mode

## Layout

- `index.html`, `main.js`, `style.css` — the entire app. State lives in localStorage under `todo-items` (validated todo array) and `theme-preference`.
- `tests/*.spec.ts` — Playwright E2E tests. Detailed conventions load from `tests/CLAUDE.md` when working in that directory.
- `specs/` — test plans saved by the test-planner agent.

## Testing standards

- Test names: `should [expected behavior] when [condition]`.
- Selector priority: `data-testid` > role selectors (`getByRole`) > semantic CSS (`button[type="submit"]`). Never XPath or deep CSS chains.
- Isolation: every test clears localStorage in `beforeEach` (`goto` → `evaluate(() => localStorage.clear())` → `reload`). No shared state between tests.
- Auto-waiting assertions only (`await expect(locator).toHaveText(...)`). Prefer exact matchers: `toHaveText` over `toContain`.
- Never `page.waitForTimeout()` — a PreToolUse hook blocks any edit that introduces it into a spec file.
- One logical assertion per test; Arrange–Act–Assert with comments.

## JS source rules (`main.js`)

- `textContent` for user-provided strings, never `innerHTML` (XSS prevention).
- Wrap all localStorage reads in try-catch and validate parsed data (see `isValidTodo`).
- ES6+, small single-purpose functions. Add `data-testid` to any new interactive element.

## Customizations available

- **Agents** (`.claude/agents/`): pipeline `requirement-critic` → `test-planner` → `test-generator` → `test-reviewer`, plus `test-healer`, `bug-hunter`, `accessibility-tester`. Pause for human review between pipeline stages.
- **Commands** (`.claude/commands/`): `/analyze-coverage`, `/create-test-plan`, `/generate-edge-cases`, `/debug-failing-test`, `/review-test-quality`, `/convert-manual-to-automated`.
- **Skills** (`.claude/skills/`): `playwright-e2e`, `vitest-unit`.
- **Hooks & permissions**: `.claude/settings.json` (explained in WORKSHOP.md).
- **MCP**: `playwright-test` server configured in `.mcp.json`.

## Using this repo in Claude Cowork (no-code participants)

Cowork loads this file but does NOT auto-load `.claude/agents/`, `.claude/commands/`, `.claude/skills/`, or `.mcp.json`. Bridge rules when running in Cowork:

- When the user asks to "use" or "run" a pipeline agent (requirement-critic, test-planner, test-generator, test-reviewer, test-healer, bug-hunter, accessibility-tester), first read the matching file in `.claude/agents/` and follow its role, process, and output format exactly. Same for `/command` requests → `.claude/commands/<name>.md`, and testing conventions → `.claude/skills/playwright-e2e/SKILL.md`.
- Pause for explicit human approval between pipeline stages — never chain stages without it.
- Agent frontmatter lists Playwright MCP tools that are unavailable in Cowork: use Claude in Chrome for live exploration instead, or analyze the source. Respect the intent of tool restrictions — where an agent is read-only (bug-hunter, test-reviewer), do not modify files.
- Non-code deliverables preferred: save plans, charters, bug reports, and summaries as files (docx/md/xlsx) in this folder.
- `page.waitForTimeout()` remains banned in specs even though the hook doesn't run here.
