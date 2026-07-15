---
description: Convert manual test cases (Gherkin, step-by-step, or user story) to automated Playwright tests
argument-hint: <manual test case text, or path to a file containing it>
---

# Convert Manual Tests to Automation

Convert the following manual test case(s) into automated Playwright tests: 

$ARGUMENTS

If the argument is a file path, read the file. Follow tests/CLAUDE.md conventions.

## Accepted input formats

1. **Gherkin/BDD**: Given/When/Then steps
2. **Step-by-step manual test**: TC id, preconditions, numbered steps, expected result
3. **User story**: As a / I want / So that (derive the concrete scenario first, state your assumptions)

## Conversion rules

| Manual step | Playwright |
|---------|------------|
| Given I am on X page | `await page.goto('/x')` |
| When I click X | `await page.getByRole('button', { name: 'X' }).click()` |
| When I enter X in Y | `await page.fill('selector', 'X')` |
| Then I should see X | `await expect(page.locator('selector')).toHaveText('X')` |
| Then X should be visible | `await expect(page.locator('selector')).toBeVisible()` |

## Output template

```typescript
import { test, expect } from '@playwright/test';

test.describe('<Feature Name>', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('<test case name from manual test>', async ({ page }) => {
    // Arrange — from preconditions
    // Act — from steps
    // Assert — from expected results
  });
});
```

## Example conversion

Manual:
```
TC002: Mark todo as complete
1. Add a todo "Test task"
2. Click the checkbox next to the todo
3. Verify the todo text has strikethrough style
```

Automated:
```typescript
test('should mark todo as complete when checkbox clicked', async ({ page }) => {
  // Arrange
  await page.fill('#todo-input', 'Test task');
  await page.click('button[type="submit"]');

  // Act
  await page.locator('.todo-item input[type="checkbox"]').check();

  // Assert
  await expect(page.locator('.todo-item .text')).toHaveClass(/completed/);
});
```

Write the converted tests into an appropriately named spec file in `tests/`, preserve the
manual TC id as a comment, then run the new tests and report results. Flag any manual step
that cannot be automated faithfully rather than silently approximating it.
