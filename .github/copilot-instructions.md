# Copilot Instructions for Todo App Testing

## Project Overview
This is a vanilla JavaScript Todo application used for demonstrating AI-assisted testing. The app supports adding, completing, and deleting todos with localStorage persistence.

## Testing Standards

### Test Framework
- **E2E Tests**: Playwright (`tests/` directory)
- **Unit Tests**: Vitest (when added, `src/__tests__/` directory)

### Naming Conventions
- Test files: `*.spec.ts` for Playwright, `*.test.ts` for unit tests
- Test descriptions: Use "should [expected behavior] when [condition]"
- Use descriptive variable names that indicate test purpose

### Test Structure
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup - always clear state
  });

  test('should [do something] when [condition]', async ({ page }) => {
    // Arrange - setup test data
    // Act - perform action
    // Assert - verify outcome
  });
});
```

### Best Practices
1. **Isolation**: Each test should be independent - clear localStorage before each test
2. **Selectors**: Prefer `data-testid` attributes, then semantic selectors (`role`, `label`)
3. **Assertions**: Use specific assertions (`toHaveText` over `toContain` when exact match expected)
4. **Waits**: Never use arbitrary timeouts, use Playwright's auto-waiting or explicit wait conditions

### Code Style
- Use TypeScript for all test files
- Prefer `async/await` over `.then()` chains
- Extract repeated setup into helper functions
- Keep tests focused - one logical assertion per test

### Accessibility
- All interactive elements must have accessible names
- Test keyboard navigation for critical flows
- Verify ARIA attributes are correct

## When Generating Tests
1. Always consider edge cases (empty input, special characters, long text)
2. Test both happy path and error scenarios
3. Include persistence tests (reload behavior)
4. Consider race conditions for async operations
