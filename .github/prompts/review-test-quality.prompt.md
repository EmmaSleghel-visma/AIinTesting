---
description: "Review test code for best practices and improvements"
mode: "ask"
---

# Review Test Quality

Review test code for quality, maintainability, and best practices.

## Review Checklist

### Test Structure
- [ ] Descriptive test names following "should X when Y" pattern
- [ ] Proper use of describe blocks for grouping
- [ ] beforeEach/afterEach for setup/cleanup
- [ ] Tests are independent (no shared state)

### Assertions
- [ ] Using Playwright's auto-waiting assertions
- [ ] Specific assertions (toHaveText vs toContain)
- [ ] Single logical concept per test
- [ ] Meaningful error messages

### Selectors
- [ ] Prefer data-testid or semantic selectors
- [ ] Avoid fragile CSS/XPath selectors
- [ ] No reliance on text that might change

### Performance
- [ ] No arbitrary waits (setTimeout, waitForTimeout)
- [ ] Efficient setup (reuse where possible)
- [ ] Parallel test execution considered

### Maintainability
- [ ] DRY - repeated code extracted to helpers
- [ ] Page Object pattern for complex pages
- [ ] Clear arrange-act-assert structure
- [ ] Comments for non-obvious logic

## Output Format

### Overall Score: X/10

### ✅ Good Practices Found
- List of positive patterns

### 🔧 Improvements Needed
1. **Issue**: Description
   - **Current**: Code snippet
   - **Suggested**: Improved code
   - **Why**: Explanation

### 📋 Refactoring Suggestions
- Larger structural improvements

## Example Review

```typescript
// ❌ Before
test('test1', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000);  // Bad: arbitrary wait
  await page.click('div.form > button');  // Bad: fragile selector
  expect(await page.locator('.item').count()).toBe(1);  // Bad: not auto-waiting
});

// ✅ After
test('should add todo when form submitted', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="todo-input"]', 'New todo');
  await page.click('[data-testid="submit-btn"]');
  await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(1);
});
```
