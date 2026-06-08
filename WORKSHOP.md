# AI in Testing Workshop - GitHub Copilot Demo

This project demonstrates GitHub Copilot's capabilities for AI-assisted testing using a simple Todo application.

## Quick Start

```bash
npm install
npm run dev        # Start the app at http://localhost:5173
npm test           # Run Playwright tests
npm run test:ui    # Run tests with Playwright UI
```

## Workshop Contents

This project includes comprehensive examples of Copilot customization for testing workflows:

| Feature | Location | Purpose |
|---------|----------|---------|
| Custom Instructions | `.github/copilot-instructions.md` | Project-wide testing standards |
| Custom Agents | `.github/agents/` | Specialized testing personas |
| Custom Prompts | `.github/prompts/` | Reusable testing workflows |
| Skills | `.github/skills/` | Domain knowledge for E2E and unit testing |
| Instructions | `.github/instructions/` | File-pattern-specific guidelines |

---

## Part 1: Ask Mode vs Agent Mode

### Ask Mode (Chat)
Best for questions, explanations, and quick guidance.

**Demo scenarios:**
1. "What testing patterns should I use for this todo app?"
2. "Explain the difference between toHaveText and toContain in Playwright"
3. "What edge cases should I test for the add todo feature?"

### Agent Mode
Best for multi-step tasks that require file creation, editing, and running commands.

**Demo scenarios:**
1. "Add tests for the delete functionality including edge cases"
2. "Create a Page Object pattern for the todo page"
3. "Add accessibility tests for keyboard navigation"
4. "Find and fix the potential XSS vulnerability in the render function"

---

## Part 2: Custom Agents

Located in `.github/agents/`. Invoke with `@agent-name` in chat.

### @test-critic
Reviews test scenarios for completeness.

**Try:**
- "Review the current test coverage for gaps"
- "Critique my test file for best practices"
- "What edge cases am I missing?"

### @bug-hunter
Finds potential bugs in code.

**Try:**
- "Hunt for bugs in main.js"
- "What security issues might exist?"
- "Are there any race conditions?"

### @test-generator
Creates comprehensive test suites.

**Try:**
- "Generate tests for the complete todo feature"
- "Create a smoke test suite"
- "Generate accessibility tests"

### @accessibility-tester
Checks WCAG compliance.

**Try:**
- "Audit the app for accessibility issues"
- "Check if keyboard navigation works"
- "What ARIA attributes are missing?"

---

## Part 3: Custom Prompts

Located in `.github/prompts/`. Access via `/` command or prompt picker.

### Available Prompts

| Prompt | Use Case |
|--------|----------|
| `analyze-coverage` | Find gaps in test coverage |
| `generate-edge-cases` | Create edge case tests |
| `create-test-plan` | Generate test plan for a feature |
| `debug-failing-test` | Diagnose test failures |
| `review-test-quality` | Review tests for best practices |
| `convert-manual-to-automated` | Convert manual tests to Playwright |

### Demo: Using Prompts

1. Open Command Palette (Cmd+Shift+P)
2. Type "Copilot: Use Prompt"
3. Select a prompt
4. Follow the prompt's instructions

---

## Part 4: Custom Instructions

Located in `.github/copilot-instructions.md`.

### What's Configured
- Testing framework standards (Playwright + Vitest)
- Naming conventions for tests
- Selector priority (data-testid > role > CSS)
- Best practices for test isolation
- Accessibility requirements

### Demo: Instructions in Action

1. Ask Copilot to generate a test - notice it follows the configured patterns
2. Compare with removing the instructions temporarily
3. Show how instructions create consistency across the team

---

## Part 5: Skills

Located in `.github/skills/`. Skills provide deep domain knowledge.

### playwright-e2e
Comprehensive Playwright patterns including:
- Selector strategies
- Page Object pattern
- Fixtures
- Auto-waiting assertions
- Debugging techniques

### vitest-unit
Unit testing knowledge including:
- Mock patterns
- Assertion matchers
- Timer mocking
- Coverage configuration
- DOM testing

### Demo: Skills in Action

1. Ask "How do I mock localStorage in a unit test?"
2. Ask "Show me the Page Object pattern for this app"
3. Notice Copilot references the skill documentation

---

## Part 6: Scoped Instructions

Located in `.github/instructions/`. Apply to specific file patterns.

| File | Pattern | Instructions |
|------|---------|--------------|
| `playwright-tests.instructions.md` | `tests/**/*.spec.ts` | E2E test conventions |
| `unit-tests.instructions.md` | `**/*.test.ts` | Unit test conventions |
| `javascript.instructions.md` | `*.js` | Source code standards |

### Demo: Scoped Instructions

1. Open a `.spec.ts` file - Playwright instructions apply
2. Open a `.test.ts` file - Vitest instructions apply
3. Ask Copilot to generate code - it follows the relevant pattern

---

## Demo Scripts

### Demo 1: Full Testing Workflow (5 min)

```
1. Show the todo app running
2. "Generate a test plan for the todo app" (use prompt)
3. "Create tests for the uncovered scenarios" (agent mode)
4. Run the tests with --headed
```

### Demo 2: Bug Hunting (3 min)

```
1. "@bug-hunter analyze main.js for potential issues"
2. Show the identified vulnerabilities
3. "Fix the issues and add tests for them"
```

### Demo 3: Test Review (3 min)

```
1. Open existing tests
2. "@test-critic review this test file"
3. Apply the suggested improvements
```

### Demo 4: Accessibility (3 min)

```
1. "@accessibility-tester audit the todo app"
2. "Generate accessibility tests based on the findings"
3. Run the new tests
```

### Demo 5: Convert Manual to Automated (2 min)

```
1. Use the convert-manual-to-automated prompt
2. Paste this manual test:
   "Test: Add and complete a todo
    1. Open the app
    2. Enter 'Buy milk' in the input
    3. Click Add
    4. Click the checkbox
    5. Verify strikethrough appears"
3. Show the generated Playwright test
```

---

## File Structure

```
AIinTesting/
├── .github/
│   ├── copilot-instructions.md      # Project-wide instructions
│   ├── agents/
│   │   ├── test-critic.md           # Test review agent
│   │   ├── bug-hunter.md            # Bug finding agent
│   │   ├── test-generator.md        # Test creation agent
│   │   └── accessibility-tester.md  # A11y checking agent
│   ├── prompts/
│   │   ├── analyze-coverage.prompt.md
│   │   ├── generate-edge-cases.prompt.md
│   │   ├── create-test-plan.prompt.md
│   │   ├── debug-failing-test.prompt.md
│   │   ├── review-test-quality.prompt.md
│   │   └── convert-manual-to-automated.prompt.md
│   ├── skills/
│   │   ├── playwright-e2e/SKILL.md
│   │   └── vitest-unit/SKILL.md
│   └── instructions/
│       ├── playwright-tests.instructions.md
│       ├── unit-tests.instructions.md
│       └── javascript.instructions.md
├── tests/
│   └── todo.spec.ts                 # Playwright E2E tests
├── index.html                       # Todo app HTML
├── main.js                          # Todo app logic
├── style.css                        # Styling
├── playwright.config.ts             # Playwright configuration
└── package.json
```

---

## Tips for the Workshop

### Show Mode Differences
- Ask mode: Quick Q&A, explanations
- Agent mode: Multi-step tasks, file changes

### Highlight Customization Value
- Without instructions: Generic output
- With instructions: Project-specific, consistent output

### Emphasize Practical Use
- These aren't just demos - they're real testing workflows
- Attendees can copy this setup to their projects

### Interactive Elements
- Let attendees try prompts themselves
- Have them create their own test scenarios
- Challenge them to find bugs the agents miss
