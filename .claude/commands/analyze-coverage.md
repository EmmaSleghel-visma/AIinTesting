---
description: Analyze test coverage gaps and suggest missing tests
allowed-tools: Read, Grep, Glob, Bash(npx playwright test --list*)
---

# Analyze Test Coverage

Identify gaps between what the application does and what the test suite verifies.

## Context

Currently discovered tests:

!`npx playwright test --list --reporter=line 2>/dev/null | head -40`

Application source: @main.js

## Analysis required

1. **List all features** in the application (including theme toggle and persistence)
2. **Map existing tests** in `tests/` to features
3. **Identify gaps** — features and behaviors without tests
4. **Suggest priority** — which gaps are most critical, and why

## Output format

| Feature / behavior | Tested? | Test file | Priority to add |
|--------------------|---------|-----------|-----------------|
| Add todo           | ✅      | todo.spec.ts | - |
| Edge case X        | ❌      | -         | High |

## Focus areas

- Edge cases (empty input, long text, special characters, XSS payloads)
- Error scenarios (localStorage full, unavailable, corrupted JSON)
- Accessibility (keyboard nav, screen readers)
- Persistence (reload behavior for todos and theme)
- Performance (many todos, rapid operations)

End with the top 3 tests to write next, as `should X when Y` titles.
