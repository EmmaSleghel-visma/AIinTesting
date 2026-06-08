---
applyTo: "tests/**/*.spec.ts"
---

# Playwright Test File Instructions

When working with Playwright test files, follow these guidelines:

## Test Structure
- Use `test.describe()` to group related tests
- Always include `test.beforeEach()` to clear localStorage and ensure test isolation
- Follow the Arrange-Act-Assert pattern with comments

## Naming Convention
- Test names: `should [expected behavior] when [condition]`
- Be specific and descriptive

## Selectors (Priority Order)
1. `data-testid` attributes: `[data-testid="todo-input"]`
2. Role selectors: `page.getByRole('button', { name: 'Add' })`
3. Semantic selectors: `button[type="submit"]`
4. Avoid: XPath, complex CSS chains

## Assertions
- Always use auto-waiting assertions: `await expect(...).toHaveText()`
- Never use `page.waitForTimeout()` - use proper waits instead
- Be specific: prefer `toHaveText()` over `toContain()` when exact match expected

## Common Patterns for This Project

```typescript
// Clear state before each test
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// Add a todo
await page.fill('#todo-input', 'Test todo');
await page.click('button[type="submit"]');

// Check todo exists
await expect(page.locator('.todo-item')).toHaveCount(1);

// Toggle completion
await page.locator('.todo-item input[type="checkbox"]').check();

// Delete todo
await page.locator('.delete-btn').click();
```

## Accessibility Considerations
- Test keyboard navigation for critical flows
- Verify focus management after actions
- Check that interactive elements are accessible
