---
description: Generate edge case and boundary tests for a feature
argument-hint: <feature or component, e.g. "add todo">
---

# Generate Edge Case Tests

Generate comprehensive edge case tests for: **$ARGUMENTS**

Follow the conventions in tests/CLAUDE.md (isolation, selectors, auto-waiting assertions).

## Edge case categories to cover

### Input boundaries
- Empty strings; whitespace only; leading/trailing whitespace
- Single character; maximum length (1000+ chars)
- Unicode (emojis, RTL text, special symbols)
- HTML/script tags (XSS prevention — verify rendered as text, not markup)

### State boundaries
- Empty state (no todos); single item; many items (100+)
- All items completed; mixed completed/incomplete

### Timing / async
- Rapid successive operations
- Operations during page load
- Reload mid-flow (persistence)

## Test template

```typescript
test.describe('Edge Cases: <feature>', () => {
  test('should handle empty input', async ({ page }) => { /* ... */ });

  test('should handle very long input', async ({ page }) => {
    const longText = 'a'.repeat(1000);
    // ...
  });

  test('should render script tags as inert text', async ({ page }) => {
    const payload = '<script>alert("xss")</script>';
    // Verify the payload appears as literal text and no dialog fires
  });

  test('should handle emoji input', async ({ page }) => {
    const emoji = '✅ Todo with emoji 🎉';
    // ...
  });
});
```

Write the tests to a new spec file in `tests/`, then run them and report results.
