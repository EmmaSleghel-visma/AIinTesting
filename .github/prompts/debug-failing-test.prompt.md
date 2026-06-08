---
description: "Debug a failing test and suggest fixes"
mode: "agent"
---

# Debug Failing Test

Help diagnose and fix a failing Playwright test.

## Debugging Process

### 1. Understand the Failure
- What is the error message?
- Which assertion failed?
- Is it consistent or flaky?

### 2. Common Playwright Issues

#### Timing Issues
```typescript
// ❌ Bad - might fail if element takes time to appear
await page.click('.button');
expect(await page.textContent('.result')).toBe('Success');

// ✅ Good - waits for assertion
await page.click('.button');
await expect(page.locator('.result')).toHaveText('Success');
```

#### Selector Issues
```typescript
// ❌ Fragile - relies on DOM structure
await page.click('div > div > button');

// ✅ Better - semantic selector
await page.click('button[type="submit"]');

// ✅ Best - test ID
await page.click('[data-testid="submit-btn"]');
```

#### State Issues
```typescript
// ❌ Bad - test depends on previous test state
test('should show existing todos', async ({ page }) => {
  await page.goto('/');
  // Assumes todos exist from previous test
});

// ✅ Good - test sets up its own state
test('should show existing todos', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('todo-items', JSON.stringify([
      { id: '1', text: 'Test todo', completed: false }
    ]));
  });
  await page.reload();
});
```

### 3. Debugging Tools

```typescript
// Pause test for debugging
await page.pause();

// Take screenshot
await page.screenshot({ path: 'debug.png' });

// Log element state
console.log(await page.locator('.element').count());
console.log(await page.locator('.element').textContent());

// Check if element exists
const exists = await page.locator('.element').count() > 0;
```

### 4. Fix Categories
- **Timing**: Add proper waits/assertions
- **Selector**: Make selectors more specific
- **State**: Ensure proper test isolation
- **Logic**: Fix the test or application code

## Input Required
Please provide:
1. The failing test code
2. The error message
3. Whether it's consistent or flaky
