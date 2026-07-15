# Playwright E2E conventions (tests/)

Applies to all `*.spec.ts` files in this directory.

## Structure

- Group related tests with `test.describe()`.
- Always include `test.beforeEach()` that clears localStorage — tests must be independent and runnable in any order.
- Arrange–Act–Assert, marked with comments.

## Naming

- `should [expected behavior] when [condition]` — specific and descriptive.

## Selectors (priority order)

1. `data-testid` attributes: `[data-testid="todo-input"]`
2. Role selectors: `page.getByRole('button', { name: 'Add' })`
3. Semantic selectors: `button[type="submit"]`
4. Avoid: XPath, complex CSS chains, text that is likely to change

## Assertions

- Auto-waiting assertions only: `await expect(locator).toHaveText(...)`.
- Never `page.waitForTimeout()` — use proper waits or let assertions retry.
- Be exact: prefer `toHaveText()` over `toContain()` when an exact match is expected.

## Common patterns for this project

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

// Seed state directly (faster than UI for preconditions)
await page.evaluate(() => {
  localStorage.setItem('todo-items', JSON.stringify([
    { id: '1', text: 'Seeded todo', completed: false },
  ]));
});
await page.reload();
```

## Accessibility

- Test keyboard navigation for critical flows.
- Verify focus management after actions (e.g. after delete).
- Interactive elements must be reachable and operable without a mouse.
