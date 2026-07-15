---
name: vitest-unit
description: JavaScript unit testing patterns with Vitest. Use when writing or reviewing unit tests for functions and modules — mocking (functions, modules, timers, localStorage), assertion matchers, DOM testing with jsdom, async testing, and coverage configuration.
---

# Unit Testing with Vitest

## Overview

This skill provides knowledge for writing unit tests with Vitest. Use this when testing individual functions, modules, or business logic in isolation.

## Project Setup

### Installation
```bash
npm install -D vitest @vitest/coverage-v8
```

### Configuration (vite.config.ts or vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // For DOM testing
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
});
```

### Package.json Scripts
```json
{
  "scripts": {
    "test:unit": "vitest",
    "test:unit:coverage": "vitest run --coverage",
    "test:unit:ui": "vitest --ui"
  }
}
```

## Test Structure

### Basic Test File
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { functionToTest } from './module';

describe('functionToTest', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
    vi.restoreAllMocks();
  });

  it('should return expected result when given valid input', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });

  it('should throw error when given invalid input', () => {
    expect(() => functionToTest(null)).toThrow('Invalid input');
  });
});
```

## Assertions

### Common Matchers
```typescript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).toStrictEqual(expected);  // Deep + type equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3, 5);      // For floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(array).toEqual(expect.arrayContaining([1, 2]));

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('nested.key', 'value');
expect(obj).toMatchObject({ key: 'value' });

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('message');
expect(() => fn()).toThrow(ErrorType);
```

## Mocking

### Function Mocks
```typescript
import { vi } from 'vitest';

// Create mock function
const mockFn = vi.fn();
mockFn.mockReturnValue('default');
mockFn.mockReturnValueOnce('first call');
mockFn.mockResolvedValue('async result');
mockFn.mockImplementation((x) => x * 2);

// Verify calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('lastArg');
```

### Module Mocks
```typescript
// Mock entire module
vi.mock('./module', () => ({
  exportedFn: vi.fn(() => 'mocked'),
}));

// Mock with factory
vi.mock('./api', () => {
  return {
    fetchData: vi.fn().mockResolvedValue({ data: 'mocked' }),
  };
});

// Partial mock (keep some real implementations)
vi.mock('./utils', async () => {
  const actual = await vi.importActual('./utils');
  return {
    ...actual,
    specificFn: vi.fn(),
  };
});
```

### Spies
```typescript
const obj = {
  method: (x: number) => x * 2,
};

const spy = vi.spyOn(obj, 'method');
obj.method(5);

expect(spy).toHaveBeenCalledWith(5);
expect(spy).toHaveReturnedWith(10);
```

### Timer Mocks
```typescript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should handle timeout', () => {
  const callback = vi.fn();
  setTimeout(callback, 1000);
  
  vi.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalled();
});
```

## Testing Patterns for Todo App

### Pure Function Tests
```typescript
// src/utils/todo-utils.ts
export function isValidTodo(todo: unknown): boolean {
  return (
    typeof todo === 'object' &&
    todo !== null &&
    'id' in todo &&
    'text' in todo &&
    'completed' in todo
  );
}

export function filterCompleted(todos: Todo[]): Todo[] {
  return todos.filter(todo => todo.completed);
}

// src/utils/todo-utils.test.ts
describe('isValidTodo', () => {
  it('should return true for valid todo', () => {
    const todo = { id: '1', text: 'Test', completed: false };
    expect(isValidTodo(todo)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isValidTodo(null)).toBe(false);
  });

  it('should return false for missing properties', () => {
    expect(isValidTodo({ id: '1' })).toBe(false);
    expect(isValidTodo({ id: '1', text: 'Test' })).toBe(false);
  });
});

describe('filterCompleted', () => {
  it('should return only completed todos', () => {
    const todos = [
      { id: '1', text: 'Done', completed: true },
      { id: '2', text: 'Pending', completed: false },
      { id: '3', text: 'Also done', completed: true },
    ];
    
    const result = filterCompleted(todos);
    
    expect(result).toHaveLength(2);
    expect(result.every(t => t.completed)).toBe(true);
  });

  it('should return empty array when no completed todos', () => {
    const todos = [{ id: '1', text: 'Pending', completed: false }];
    expect(filterCompleted(todos)).toEqual([]);
  });
});
```

### localStorage Mocking
```typescript
describe('todo persistence', () => {
  const localStorageMock = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      localStorageMock.store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete localStorageMock.store[key];
    }),
    clear: vi.fn(() => {
      localStorageMock.store = {};
    }),
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should save todos to localStorage', () => {
    const todos = [{ id: '1', text: 'Test', completed: false }];
    saveTodos(todos);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'todo-items',
      JSON.stringify(todos)
    );
  });

  it('should load todos from localStorage', () => {
    const todos = [{ id: '1', text: 'Test', completed: false }];
    localStorageMock.store['todo-items'] = JSON.stringify(todos);
    
    const result = loadTodos();
    
    expect(result).toEqual(todos);
  });

  it('should return empty array when localStorage is empty', () => {
    expect(loadTodos()).toEqual([]);
  });

  it('should handle invalid JSON gracefully', () => {
    localStorageMock.store['todo-items'] = 'invalid json';
    expect(loadTodos()).toEqual([]);
  });
});
```

### DOM Testing
```typescript
import { beforeEach, describe, it, expect } from 'vitest';

describe('todo rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <ul id="todo-list"></ul>
    `;
  });

  it('should render todo item correctly', () => {
    const todo = { id: '1', text: 'Test todo', completed: false };
    renderTodo(todo);
    
    const item = document.querySelector('.todo-item');
    expect(item).not.toBeNull();
    expect(item?.textContent).toContain('Test todo');
  });

  it('should mark completed todos with class', () => {
    const todo = { id: '1', text: 'Done', completed: true };
    renderTodo(todo);
    
    const text = document.querySelector('.text');
    expect(text?.classList.contains('completed')).toBe(true);
  });
});
```

### Async Testing
```typescript
describe('async operations', () => {
  it('should handle async function', async () => {
    const result = await asyncFunction();
    expect(result).toBe('expected');
  });

  it('should handle promises', () => {
    return expect(asyncFunction()).resolves.toBe('expected');
  });

  it('should handle rejected promises', () => {
    return expect(failingFunction()).rejects.toThrow('error');
  });
});
```

## Code Coverage

### Running Coverage
```bash
npx vitest run --coverage
```

### Coverage Thresholds
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

## Test Organization

### File Structure
```
src/
├── utils/
│   ├── todo-utils.ts
│   └── todo-utils.test.ts     # Co-located tests
├── services/
│   ├── storage.ts
│   └── storage.test.ts
└── __tests__/                  # Shared test utilities
    └── setup.ts
```

### Test Utilities
```typescript
// src/__tests__/factories.ts
export function createTodo(overrides = {}): Todo {
  return {
    id: crypto.randomUUID(),
    text: 'Default todo',
    completed: false,
    ...overrides,
  };
}

// Usage in tests
const todo = createTodo({ text: 'Custom text', completed: true });
```
