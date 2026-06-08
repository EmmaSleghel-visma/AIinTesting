# AIinTesting

Simple todo list web app for demonstrating AI-assisted testing with GitHub Copilot.

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

## Workshop Demo

This project includes comprehensive GitHub Copilot customizations for testing:

- **Custom Agents**: `@test-critic`, `@bug-hunter`, `@test-generator`, `@accessibility-tester`
- **Custom Prompts**: Coverage analysis, edge case generation, test plans, debugging
- **Skills**: Playwright E2E and Vitest unit testing knowledge
- **Instructions**: File-pattern-specific testing guidelines

See [WORKSHOP.md](WORKSHOP.md) for full demo guide.
