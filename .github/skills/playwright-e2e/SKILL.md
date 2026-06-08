---
description: "Playwright E2E testing patterns and best practices for web applications"
---

# E2E Testing with Playwright

## Overview

This skill provides comprehensive knowledge for writing end-to-end tests with Playwright. Use this when generating, reviewing, or debugging E2E tests.

## Project Setup

### Configuration (playwright.config.ts)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Selector Strategy (Priority Order)

### 1. Test IDs (Recommended)
```typescript
// In HTML: <button data-testid="submit-btn">Submit</button>
await page.click('[data-testid="submit-btn"]');
await page.locator('[data-testid="todo-item"]').first();
```

### 2. Role Selectors (Accessible)
```typescript
await page.getByRole('button', { name: 'Submit' });
await page.getByRole('textbox', { name: 'Add todo' });
await page.getByRole('checkbox', { name: /complete/i });
await page.getByRole('listitem').filter({ hasText: 'Buy milk' });
```

### 3. Text Selectors
```typescript
await page.getByText('Submit');
await page.getByLabel('Email address');
await page.getByPlaceholder('Enter your email');
```

### 4. CSS Selectors (Last Resort)
```typescript
// Only when above options aren't feasible
await page.locator('button[type="submit"]');
await page.locator('.todo-item:first-child');
```

## Test Patterns

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear state for isolation
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should do X when Y', async ({ page }) => {
    // Arrange
    const testData = 'test value';
    
    // Act
    await page.fill('#input', testData);
    await page.click('button[type="submit"]');
    
    // Assert
    await expect(page.locator('.result')).toHaveText(testData);
  });
});
```

### Page Object Pattern
```typescript
// pages/todo-page.ts
import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly input: Locator;
  readonly submitButton: Locator;
  readonly todoList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.locator('#todo-input');
    this.submitButton = page.locator('button[type="submit"]');
    this.todoList = page.locator('#todo-list');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTodo(text: string) {
    await this.input.fill(text);
    await this.submitButton.click();
  }

  async getTodoCount() {
    return await this.todoList.locator('.todo-item').count();
  }

  async clearStorage() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }
}

// Usage in test
test('should add todo', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  await todoPage.clearStorage();
  
  await todoPage.addTodo('Buy milk');
  
  expect(await todoPage.getTodoCount()).toBe(1);
});
```

### Fixture Pattern
```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { TodoPage } from './pages/todo-page';

export const test = base.extend<{ todoPage: TodoPage }>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.clearStorage();
    await use(todoPage);
  },
});

// Usage
test('should add todo', async ({ todoPage }) => {
  await todoPage.addTodo('Buy milk');
  expect(await todoPage.getTodoCount()).toBe(1);
});
```

## Assertions

### Auto-Waiting Assertions (Preferred)
```typescript
// These automatically retry until condition is met or timeout
await expect(page.locator('.item')).toHaveCount(3);
await expect(page.locator('.text')).toHaveText('Expected');
await expect(page.locator('.btn')).toBeVisible();
await expect(page.locator('.btn')).toBeEnabled();
await expect(page.locator('input')).toHaveValue('text');
await expect(page.locator('.item')).toHaveClass(/completed/);
await expect(page.locator('input')).toHaveAttribute('required', '');
await expect(page).toHaveURL(/dashboard/);
await expect(page).toHaveTitle('Todo App');
```

### Negation
```typescript
await expect(page.locator('.error')).not.toBeVisible();
await expect(page.locator('.item')).not.toHaveCount(0);
```

### Soft Assertions (Continue on Failure)
```typescript
await expect.soft(page.locator('.item1')).toHaveText('One');
await expect.soft(page.locator('.item2')).toHaveText('Two');
// Test continues even if above fail
```

## Handling Dynamic Content

### Waiting for Elements
```typescript
// Wait for element to appear
await page.waitForSelector('.loading', { state: 'hidden' });
await page.waitForSelector('.content', { state: 'visible' });

// Wait for network
await page.waitForResponse(resp => resp.url().includes('/api/'));
await page.waitForLoadState('networkidle');

// Wait for function
await page.waitForFunction(() => window.dataLoaded === true);
```

### Handling Animations
```typescript
// Disable animations for consistent tests
await page.emulateMedia({ reducedMotion: 'reduce' });
```

## localStorage and State

### Setting State
```typescript
await page.evaluate(() => {
  localStorage.setItem('key', 'value');
  localStorage.setItem('todos', JSON.stringify([
    { id: '1', text: 'Test', completed: false }
  ]));
});
await page.reload();
```

### Reading State
```typescript
const value = await page.evaluate(() => localStorage.getItem('key'));
const todos = await page.evaluate(() => {
  return JSON.parse(localStorage.getItem('todos') || '[]');
});
```

## Debugging

### Debug Mode
```bash
# Run with headed browser
npx playwright test --headed

# Run with UI mode
npx playwright test --ui

# Debug specific test
npx playwright test --debug todo.spec.ts

# Show trace viewer
npx playwright show-trace trace.zip
```

### In-Test Debugging
```typescript
// Pause execution
await page.pause();

// Take screenshot
await page.screenshot({ path: 'debug.png', fullPage: true });

// Log to console
console.log(await page.locator('.item').count());
console.log(await page.locator('.item').allTextContents());
```

## Common Patterns for Todo Apps

### Add Item
```typescript
async function addTodo(page: Page, text: string) {
  await page.fill('#todo-input', text);
  await page.click('button[type="submit"]');
  await expect(page.locator('.todo-item').last()).toContainText(text);
}
```

### Toggle Completion
```typescript
async function toggleTodo(page: Page, index: number) {
  const checkbox = page.locator('.todo-item input[type="checkbox"]').nth(index);
  await checkbox.click();
}
```

### Delete Item
```typescript
async function deleteTodo(page: Page, index: number) {
  const deleteBtn = page.locator('.delete-btn').nth(index);
  const countBefore = await page.locator('.todo-item').count();
  await deleteBtn.click();
  await expect(page.locator('.todo-item')).toHaveCount(countBefore - 1);
}
```

### Verify Persistence
```typescript
async function verifyPersistence(page: Page, expectedCount: number) {
  await page.reload();
  await expect(page.locator('.todo-item')).toHaveCount(expectedCount);
}
```
