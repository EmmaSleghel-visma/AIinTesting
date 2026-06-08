import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display the todo app with empty list', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveText('Todo List');
    await expect(page.locator('#todo-input')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Add');
    await expect(page.locator('#todo-list')).toBeEmpty();
  });

  test('should add a new todo', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', 'Buy groceries');
    await page.click('button[type="submit"]');

    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-item .text')).toHaveText('Buy groceries');
  });

  test('should add multiple todos', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', 'First todo');
    await page.click('button[type="submit"]');

    await page.fill('#todo-input', 'Second todo');
    await page.click('button[type="submit"]');

    await page.fill('#todo-input', 'Third todo');
    await page.click('button[type="submit"]');

    await expect(page.locator('.todo-item')).toHaveCount(3);
  });

  test('should not add empty todo', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', '   ');
    await page.click('button[type="submit"]');

    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('should mark todo as completed', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', 'Complete this task');
    await page.click('button[type="submit"]');

    const checkbox = page.locator('.todo-item input[type="checkbox"]');
    await checkbox.check();

    await expect(checkbox).toBeChecked();
    await expect(page.locator('.todo-item .text')).toHaveClass(/completed/);
  });

  test('should unmark completed todo', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', 'Toggle this task');
    await page.click('button[type="submit"]');

    const checkbox = page.locator('.todo-item input[type="checkbox"]');
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    await expect(page.locator('.todo-item .text')).not.toHaveClass(/completed/);
  });

  test('should delete a todo', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', 'Delete me');
    await page.click('button[type="submit"]');

    await expect(page.locator('.todo-item')).toHaveCount(1);

    await page.click('.delete-btn');

    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('should persist todos after page reload', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', 'Persistent todo');
    await page.click('button[type="submit"]');

    await page.reload();

    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-item .text')).toHaveText('Persistent todo');
  });

  test('should persist completed state after reload', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', 'Check persistence');
    await page.click('button[type="submit"]');

    await page.locator('.todo-item input[type="checkbox"]').check();
    await page.reload();

    await expect(page.locator('.todo-item input[type="checkbox"]')).toBeChecked();
    await expect(page.locator('.todo-item .text')).toHaveClass(/completed/);
  });

  test('should clear input after adding todo', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', 'New todo');
    await page.click('button[type="submit"]');

    await expect(page.locator('#todo-input')).toHaveValue('');
  });

  test('should add todo with Enter key', async ({ page }) => {
    await page.goto('/');

    await page.fill('#todo-input', 'Enter key todo');
    await page.press('#todo-input', 'Enter');

    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-item .text')).toHaveText('Enter key todo');
  });
});
