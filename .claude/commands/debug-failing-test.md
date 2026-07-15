---
description: Debug a failing Playwright test and fix the root cause
argument-hint: <test name, file, or error message>
allowed-tools: Read, Edit, Grep, Glob, Bash(npx playwright test*), Bash(npm test*)
---

# Debug Failing Test

Diagnose and fix: **$ARGUMENTS**

Available tests in the project:

!`npx playwright test --list --reporter=line 2>/dev/null | head -40`

## Debugging process

### 1. Reproduce
Run the failing test in isolation first (`npx playwright test -g "<name>"`). Note whether the
failure is consistent or flaky — flaky failures are almost always timing or isolation issues.

### 2. Classify the failure

**Timing** — assertion ran before the UI settled:
```typescript
// ❌ not auto-waiting
expect(await page.textContent('.result')).toBe('Success');
// ✅ auto-waiting
await expect(page.locator('.result')).toHaveText('Success');
```

**Selector** — fragile or stale locator:
```typescript
// ❌ fragile         // ✅ better                    // ✅ best
'div > div > button'  'button[type="submit"]'         '[data-testid="submit-btn"]'
```

**State** — test depends on leftover state from another test:
```typescript
// ✅ each test seeds its own state
await page.evaluate(() => {
  localStorage.setItem('todo-items', JSON.stringify([
    { id: '1', text: 'Test todo', completed: false },
  ]));
});
await page.reload();
```

**Logic** — the test is right and the app is wrong. Do not "fix" the test to match broken
behavior; report the app bug instead.

### 3. Fix and verify
Apply the smallest fix that addresses the root cause (per CLAUDE.md: no waitForTimeout, keep
selector priority). Re-run the test, then run the full suite to check for collateral damage.

### 4. Report
State root cause, fix applied, and whether the same defect pattern exists in other tests.

For deep interactive debugging, suggest the `test-healer` agent, which can pause the test and
inspect the live browser.
