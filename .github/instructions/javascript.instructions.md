---
applyTo: "*.js"
---

# JavaScript Source File Instructions

When working with JavaScript source files in this project:

## Code Style
- Use ES6+ features (const/let, arrow functions, template literals)
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)

## DOM Manipulation
- Always use `textContent` for user-provided strings (XSS prevention)
- Never use `innerHTML` with user input
- Use `querySelector` and `querySelectorAll` for element selection
- Add `data-testid` attributes to elements that need testing

## Event Handling
- Use event delegation where possible
- Always call `event.preventDefault()` for form submissions
- Validate input before processing

## localStorage
- Always wrap in try-catch for error handling
- Validate data when reading from storage
- Use a consistent key naming convention

## Testing Considerations
When writing code, consider testability:
- Export functions that need to be unit tested
- Use dependency injection for external dependencies
- Keep side effects isolated
- Add `data-testid` attributes for E2E testing

## Error Handling
```javascript
// Good pattern for localStorage
function loadData() {
  try {
    const raw = localStorage.getItem('key');
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}
```
