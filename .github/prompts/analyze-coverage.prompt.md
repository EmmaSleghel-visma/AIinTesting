---
description: "Analyze test coverage gaps and suggest missing tests"
mode: "ask"
---

# Analyze Test Coverage

Look at the current test suite and the application code to identify gaps in test coverage.

## Context
- Application: Todo list with add, complete, delete, and persistence features
- Test files location: `tests/` directory
- Source files: `main.js`, `index.html`

## Analysis Required

1. **List all features** in the application
2. **Map existing tests** to features
3. **Identify gaps** - features without tests
4. **Suggest priority** - which gaps are most critical

## Output Format

| Feature | Tested? | Test File | Priority to Add |
|---------|---------|-----------|-----------------|
| Add todo | ✅ | todo.spec.ts | - |
| Delete todo | ✅ | todo.spec.ts | - |
| Edge case X | ❌ | - | High |

## Focus Areas
- Edge cases (empty input, long text, special characters)
- Error scenarios (localStorage full, unavailable)
- Accessibility (keyboard nav, screen readers)
- Performance (many todos, rapid operations)
