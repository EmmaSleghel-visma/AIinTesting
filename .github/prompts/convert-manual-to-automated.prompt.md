---
description: "Convert manual test cases to automated Playwright tests"
mode: "agent"
---

# Convert Manual Tests to Automation

Transform manual test cases or test scripts into automated Playwright tests.

## Input Formats Accepted

### 1. Gherkin/BDD Format
```gherkin
Given I am on the todo page
When I enter "Buy milk" in the input field
And I click the Add button
Then I should see "Buy milk" in the todo list
```

### 2. Step-by-Step Manual Test
```
Test Case: TC001 - Add New Todo
Preconditions: User is on the todo app
Steps:
1. Enter "Buy groceries" in the input field
2. Click Add button
Expected Result: Todo "Buy groceries" appears in the list
```

### 3. User Story Format
```
As a user
I want to mark todos as complete
So that I can track my progress
```

## Conversion Rules

### Gherkin to Playwright
| Gherkin | Playwright |
|---------|------------|
| Given I am on X page | `await page.goto('/x')` |
| When I click X | `await page.click('selector')` |
| When I enter X in Y | `await page.fill('selector', 'X')` |
| Then I should see X | `await expect(page.locator('selector')).toHaveText('X')` |
| Then X should be visible | `await expect(page.locator('selector')).toBeVisible()` |

### Output Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('{{Feature Name}}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('{{test case name from manual test}}', async ({ page }) => {
    // Arrange - from preconditions
    
    // Act - from steps
    
    // Assert - from expected results
  });
});
```

## Example Conversion

**Manual Test:**
```
TC002: Mark todo as complete
1. Add a todo "Test task"
2. Click the checkbox next to the todo
3. Verify the todo text has strikethrough style
```

**Automated Test:**
```typescript
test('should mark todo as complete when checkbox clicked', async ({ page }) => {
  // Arrange
  await page.fill('#todo-input', 'Test task');
  await page.click('button[type="submit"]');
  
  // Act
  await page.click('.todo-item input[type="checkbox"]');
  
  // Assert
  await expect(page.locator('.todo-item .text')).toHaveClass(/completed/);
});
```

## Paste your manual test cases below:
