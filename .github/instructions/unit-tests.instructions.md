---
applyTo: "**/*.test.ts"
---

# Unit Test File Instructions

When working with unit test files (Vitest), follow these guidelines:

## Test Structure
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Module/Function Name', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should [expected behavior] when [condition]', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Naming Convention
- Describe blocks: Name of module or function being tested
- Test names: `should [expected] when [condition]`

## Mocking
- Use `vi.fn()` for function mocks
- Use `vi.spyOn()` for spying on methods
- Use `vi.mock()` for module mocks
- Always restore mocks in `afterEach` or `beforeEach`

## localStorage Mocking
```typescript
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key) => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => { localStorageMock.store[key] = value; }),
  clear: vi.fn(() => { localStorageMock.store = {}; }),
};

beforeEach(() => {
  vi.stubGlobal('localStorage', localStorageMock);
});
```

## Assertions
- Use specific matchers: `toBe()` for primitives, `toEqual()` for objects
- Test edge cases: null, undefined, empty strings, arrays
- Test error conditions with `toThrow()`

## Coverage
- Test happy path first
- Then add edge cases
- Then add error cases
