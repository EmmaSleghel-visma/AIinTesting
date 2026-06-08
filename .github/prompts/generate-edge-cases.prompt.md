---
description: "Generate edge case and boundary tests for a feature"
mode: "agent"
---

# Generate Edge Case Tests

Generate comprehensive edge case tests for the specified feature or component.

## Edge Case Categories

### Input Boundaries
- Empty strings
- Single character
- Maximum length (test with 1000+ chars)
- Unicode characters (emojis, RTL text, special symbols)
- HTML/script tags (XSS prevention)
- Whitespace only
- Leading/trailing whitespace

### Numeric Boundaries (if applicable)
- Zero
- Negative numbers
- Very large numbers
- Decimal precision

### State Boundaries
- Empty state (no todos)
- Single item
- Many items (100+ todos)
- All items completed
- Mixed completed/incomplete

### Timing/Async
- Rapid successive operations
- Operations during page load
- Concurrent modifications

## Test Template

```typescript
test.describe('Edge Cases: {{FEATURE}}', () => {
  test('should handle empty input', async ({ page }) => {
    // Test implementation
  });

  test('should handle very long input', async ({ page }) => {
    const longText = 'a'.repeat(1000);
    // Test implementation
  });

  test('should handle special characters', async ({ page }) => {
    const specialChars = '<script>alert("xss")</script>';
    // Test with XSS attempt
  });

  test('should handle emoji input', async ({ page }) => {
    const emoji = '✅ Todo with emoji 🎉';
    // Test implementation
  });
});
```

Generate tests for: {{input}}
