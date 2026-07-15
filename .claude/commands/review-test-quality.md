---
description: Review test code for best practices and improvements
argument-hint: "[test file path — defaults to tests/todo.spec.ts]"
allowed-tools: Read, Grep, Glob
---

# Review Test Quality

Review the test file for quality, maintainability, and best practices. Target: **$ARGUMENTS**
(if no argument was given, review the default suite injected below).

Default suite: @tests/todo.spec.ts

Project standards are in CLAUDE.md and tests/CLAUDE.md — review against them, not generic
advice.

## Review checklist

### Test structure
- [ ] Descriptive names following `should X when Y`
- [ ] Proper `describe` grouping; `beforeEach` for setup/cleanup
- [ ] Tests independent (no shared state)

### Assertions
- [ ] Auto-waiting assertions (`await expect(locator)...`)
- [ ] Specific matchers (toHaveText vs toContain)
- [ ] One logical concept per test

### Selectors
- [ ] data-testid or semantic selectors preferred
- [ ] No fragile CSS/XPath chains
- [ ] No reliance on copy text likely to change

### Performance & reliability
- [ ] No arbitrary waits (waitForTimeout, setTimeout)
- [ ] Efficient setup (seed via localStorage, not UI, where the UI isn't under test)

### Maintainability
- [ ] Repeated code extracted to helpers
- [ ] Clear Arrange–Act–Assert structure
- [ ] Comments only where logic is non-obvious

## Output format

### Overall score: X/10

### ✅ Good practices found

### 🔧 Improvements needed
1. **Issue**: description
   - **Current**: code snippet
   - **Suggested**: improved code
   - **Why**: explanation

### 📋 Refactoring suggestions
Larger structural improvements (helpers, fixtures, page objects) — only if the suite's size
justifies them.

Do not edit anything; this is a review. Offer to apply the fixes as a follow-up.
