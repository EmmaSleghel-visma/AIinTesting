# AIinTesting

Simple todo list web app for demonstrating AI-assisted testing with Claude Code.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in terminal (usually `http://localhost:5173`).

## Testing

```bash
npm test           # Run all Playwright tests
npm run test:ui    # Run tests with interactive UI
```

## Features

- Add todos
- Mark todos as completed
- Delete todos
- Toggle between light and dark mode
- Todos are saved in browser localStorage

## Claude Code customizations

This project is fully configured for Claude Code — run `claude` in the repo root.

| Customization | Location | Purpose |
|---------------|----------|---------|
| Project memory | `CLAUDE.md`, `tests/CLAUDE.md` | Project-wide and tests-scoped standards, always/contextually loaded |
| Subagents | `.claude/agents/` | Testing pipeline (`requirement-critic` → `test-planner` → `test-generator` → `test-reviewer`), plus `test-healer`, `bug-hunter`, `accessibility-tester` |
| Slash commands | `.claude/commands/` | `/analyze-coverage`, `/create-test-plan`, `/generate-edge-cases`, `/debug-failing-test`, `/review-test-quality`, `/convert-manual-to-automated` |
| Skills | `.claude/skills/` | On-demand Playwright E2E and Vitest unit-testing knowledge |
| Hooks & permissions | `.claude/settings.json` | Blocks `waitForTimeout` in specs, pre-approves test commands |
| MCP server | `.mcp.json` | `playwright-test` server — agents drive a real browser |

See [WORKSHOP.md](WORKSHOP.md) for the full-day workshop run-book with demos and exercises.
