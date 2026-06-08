# Todo Item Pink Background Color Test Plan

## Application Overview

The Todo application must apply a pink background color (#FFB6C1 / rgb(255, 182, 193)) to every todo list item, regardless of completion state. This test plan validates the acceptance criteria for that styling requirement, including initial render, dynamic addition, completed-state override prevention, localStorage persistence, and accessibility contrast. The app is a vanilla JS Todo app at http://localhost:5173 with items rendered as .todo-item list elements inside #todo-list.

## Test Scenarios

### 1. AC1 – Incomplete Todo Background Color

**Seed:** `tests/seed.spec.ts`

#### 1.1. should display #FFB6C1 background on a single incomplete todo item

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage to ensure a fresh state
    - expect: The todo list is empty
  2. Type 'Buy groceries' into the '#todo-input' field and click the 'Add' button
    - expect: One todo item appears in the list with the text 'Buy groceries'
  3. Read the computed CSS background-color of the '.todo-item' element
    - expect: The background-color computes to rgb(255, 182, 193) (#FFB6C1)

#### 1.2. should display #FFB6C1 background on every item when multiple incomplete todos exist

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage
    - expect: The todo list is empty
  2. Add three todos: 'First task', 'Second task', 'Third task'
    - expect: Three todo items are visible in the list
  3. Read the computed background-color of each of the three '.todo-item' elements
    - expect: All three items have background-color rgb(255, 182, 193)

### 2. AC2 – Completed Todo Background Color Not Overridden

**Seed:** `tests/seed.spec.ts`

#### 2.1. should retain #FFB6C1 background when a todo is marked as completed

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage
    - expect: The todo list is empty
  2. Add a todo 'Complete this task'
    - expect: One incomplete todo item is visible
  3. Check the checkbox on the '.todo-item' to mark it as completed
    - expect: The checkbox is checked and the text receives the 'completed' class with strikethrough styling
  4. Read the computed background-color of the '.todo-item' element
    - expect: The background-color is still rgb(255, 182, 193); the completed state has not overridden the pink background

#### 2.2. should retain #FFB6C1 background when a completed todo is toggled back to incomplete

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage
    - expect: The todo list is empty
  2. Add a todo 'Toggle task', check it to complete it, then uncheck it
    - expect: The todo is first completed (strikethrough), then back to incomplete (no strikethrough)
  3. Read the computed background-color of the '.todo-item' element after unchecking
    - expect: The background-color is rgb(255, 182, 193)

### 3. AC3 – Newly Added Todo Renders Immediately with Pink Background

**Seed:** `tests/seed.spec.ts`

#### 3.1. should apply #FFB6C1 background immediately when a new todo is added

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage
    - expect: The todo list is empty
  2. Type 'Immediate style test' into '#todo-input' and click 'Add'
    - expect: The new todo item appears in the list
  3. Without any further interaction, immediately read the computed background-color of the new '.todo-item'
    - expect: The background-color is rgb(255, 182, 193) — no flash of unstyled content; the style is present on first render

#### 3.2. should apply #FFB6C1 background to each todo as they are added sequentially

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage
    - expect: The todo list is empty
  2. Add the first todo 'Task A' and immediately check its background-color
    - expect: background-color is rgb(255, 182, 193)
  3. Add a second todo 'Task B' and check the background-color of both items
    - expect: Both items have background-color rgb(255, 182, 193)
  4. Add a third todo 'Task C' and check the background-color of all three items
    - expect: All three items have background-color rgb(255, 182, 193)

### 4. AC4 – Persistence After Page Reload

**Seed:** `tests/seed.spec.ts`

#### 4.1. should display #FFB6C1 background on todos restored from localStorage after reload

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage
    - expect: The todo list is empty
  2. Add two todos: 'Persisted task 1' and 'Persisted task 2'
    - expect: Two todo items are visible in the list
  3. Reload the page
    - expect: Both todos are restored from localStorage and visible in the list
  4. Read the computed background-color of both '.todo-item' elements
    - expect: Both restored todos have background-color rgb(255, 182, 193)

#### 4.2. should display #FFB6C1 background on a completed todo restored from localStorage after reload

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage
    - expect: The todo list is empty
  2. Add a todo 'Done task' and mark it as completed via its checkbox
    - expect: The todo is marked completed with strikethrough text
  3. Reload the page
    - expect: The completed todo is restored with its completed state intact
  4. Read the computed background-color of the restored completed '.todo-item'
    - expect: background-color is rgb(255, 182, 193) — completion state does not override the pink background after reload

### 5. AC5 – Accessibility: Text Contrast Against Pink Background

**Seed:** `tests/seed.spec.ts`

#### 5.1. should have sufficient text contrast ratio on an incomplete todo item against #FFB6C1 background

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage
    - expect: The todo list is empty
  2. Add a todo 'Contrast check task'
    - expect: The todo is visible in the list
  3. Read the computed color (foreground text) of the '.todo-item .text' element and the computed background-color of the '.todo-item' element. Calculate the WCAG relative luminance contrast ratio between the two colors
    - expect: The contrast ratio between the text color and #FFB6C1 background is ≥ 4.5:1, meeting WCAG AA for normal text

#### 5.2. should have sufficient text contrast ratio on a completed todo item against #FFB6C1 background

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage
    - expect: The todo list is empty
  2. Add a todo 'Contrast check completed' and mark it as completed
    - expect: The todo is completed with muted/strikethrough text
  3. Read the computed color of the '.todo-item .text.completed' element and calculate contrast ratio against #FFB6C1
    - expect: The contrast ratio of the muted completed-text color against #FFB6C1 is ≥ 3:1 (WCAG AA for large text / UI components), noting that completed items use a muted color (#6b7280) — document actual ratio as a finding if it fails

### 6. Risk: CSS Specificity – Completed State Override

**Seed:** `tests/seed.spec.ts`

#### 6.1. should not have a .todo-item.completed or higher-specificity rule that overrides #FFB6C1

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage. Add a todo and complete it
    - expect: The todo is marked completed
  2. Inspect the CSS cascade for the '.todo-item' element using browser DevTools or evaluate computed styles. Check whether any rule targeting '.todo-item' or a combination selector overrides the background-color to anything other than #FFB6C1
    - expect: No CSS rule with equal or higher specificity sets a different background-color on completed todo items — the pink background wins in all cases

### 7. Risk: Empty List Edge Case

**Seed:** `tests/seed.spec.ts`

#### 7.1. should render an empty list without errors when no todos exist

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage to ensure no todos exist
    - expect: The list '#todo-list' is empty and renders correctly
  2. Check the browser console for JavaScript errors
    - expect: No errors are thrown — the absence of '.todo-item' elements does not cause any CSS or JavaScript exceptions

#### 7.2. should correctly apply #FFB6C1 background after all todos are deleted and a new one is added

**File:** `tests/pink-background.spec.ts`

**Steps:**
  1. Navigate to the app and clear localStorage. Add a todo 'Temp task'
    - expect: One todo item is visible with pink background
  2. Click the 'Delete' button on the todo item
    - expect: The todo is removed and the list is empty
  3. Add a new todo 'New task after delete'
    - expect: The new todo item appears in the list
  4. Read the computed background-color of the new '.todo-item'
    - expect: background-color is rgb(255, 182, 193) — the pink background applies to freshly added items even after all previous todos were deleted
