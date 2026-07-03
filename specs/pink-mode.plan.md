# Pink Mode Test Plan

## Application Overview

A vanilla JavaScript Todo application with light and dark theme modes. Pink mode is a third theme added alongside light and dark. Theme state is stored in localStorage under the key 'theme-preference', applied as a data-theme attribute on the root html element (data-theme="pink"), and controlled via the #theme-toggle button which cycles through all three modes (light → dark → pink → light). Pink mode applies a pink colour palette to the page and panel backgrounds, and sets every .todo-item background to #FFB6C1 (rgb(255, 182, 193)) regardless of completion state. All acceptance criteria are derived from the requirement critique conducted prior to this plan.

## Test Scenarios

### 1. Mode Activation

**Seed:** `tests/seed.spec.ts`

#### 1.1. should activate pink mode when cycling through from dark mode

**File:** `tests/pink-mode/activation.spec.ts`

**Steps:**
  1. Navigate to the app with clean localStorage (no stored theme).
    - expect: data-theme is 'light' on the html element
    - expect: button text is 'Dark mode'
    - expect: aria-pressed is 'false'
  2. Click the #theme-toggle button once.
    - expect: data-theme is 'dark'
    - expect: button text is 'Light mode'
    - expect: aria-pressed is 'true'
  3. Click the #theme-toggle button a second time.
    - expect: data-theme is 'pink' on the html element
    - expect: the button label clearly communicates the current or next mode
    - expect: the page background is visually distinct from both light (#f3f4f6) and dark (#111827) modes

#### 1.2. should complete the full mode cycle: light → dark → pink → light

**File:** `tests/pink-mode/activation.spec.ts`

**Steps:**
  1. Start with clean localStorage. Verify the initial state.
    - expect: data-theme is 'light'
    - expect: button text is 'Dark mode'
  2. Click the toggle button — first click.
    - expect: data-theme is 'dark'
  3. Click the toggle button — second click.
    - expect: data-theme is 'pink'
  4. Click the toggle button — third click.
    - expect: data-theme returns to 'light', completing the full cycle
    - expect: button text matches the light mode label
    - expect: aria-pressed is 'false'

#### 1.3. should activate pink mode when set directly via localStorage on reload

**File:** `tests/pink-mode/activation.spec.ts`

**Steps:**
  1. Set localStorage key 'theme-preference' to 'pink' and reload the page.
    - expect: data-theme is 'pink' on the html element immediately after load
    - expect: the page background renders in pink styling with no flash of light mode styles

### 2. DOM and CSS Correctness

**Seed:** `tests/seed.spec.ts`

#### 2.1. should set data-theme to 'pink' on the html element when pink mode is active

**File:** `tests/pink-mode/css.spec.ts`

**Steps:**
  1. Cycle the toggle to pink mode.
    - expect: document.documentElement.dataset.theme === 'pink'
    - expect: no 'dark' or 'light' value is simultaneously present on data-theme

#### 2.2. should remove all dark mode CSS variables when switching to pink mode

**File:** `tests/pink-mode/css.spec.ts`

**Steps:**
  1. Activate dark mode first, then cycle once more to pink mode.
    - expect: data-theme is 'pink' — not 'dark'
    - expect: computed background-color of body is NOT the dark-mode value (#111827)
    - expect: computed background-color of .app is NOT the dark-mode panel value (#1f2937)

#### 2.3. should remove pink mode CSS variables when cycling away from pink mode

**File:** `tests/pink-mode/css.spec.ts`

**Steps:**
  1. Cycle to pink mode, then click the toggle one more time to return to light mode.
    - expect: data-theme is 'light'
    - expect: computed background-color of body returns to the light-mode page background (#f3f4f6)
    - expect: no pink custom-property values remain active on the root element

#### 2.4. should apply a pink page background distinct from light and dark modes

**File:** `tests/pink-mode/css.spec.ts`

**Steps:**
  1. Cycle to pink mode and read the computed background-color of the body element.
    - expect: The computed background-color value differs from the light-mode page bg (rgb(243, 244, 246))
    - expect: The computed background-color value differs from the dark-mode page bg (rgb(17, 24, 39))
    - expect: The computed value is a recognisable pink hue (red channel ≥ 240, blue channel ≥ 180, green channel ≤ 200 as a rough guide)

### 3. Todo Item Styling

**Seed:** `tests/seed.spec.ts`

#### 3.1. should display #FFB6C1 background on a single incomplete todo item in pink mode

**File:** `tests/pink-mode/todo-items.spec.ts`

**Steps:**
  1. Navigate to the app with clean localStorage and cycle to pink mode.
    - expect: data-theme is 'pink'
  2. Type 'Buy groceries' into #todo-input and click Add.
    - expect: One todo item appears in the list with the text 'Buy groceries'
  3. Read the computed CSS background-color of the .todo-item element.
    - expect: background-color computes to rgb(255, 182, 193) (#FFB6C1)

#### 3.2. should display #FFB6C1 background on every item when multiple incomplete todos exist in pink mode

**File:** `tests/pink-mode/todo-items.spec.ts`

**Steps:**
  1. Navigate with clean localStorage, cycle to pink mode, then add three todos: 'First task', 'Second task', 'Third task'.
    - expect: Three .todo-item elements are visible
  2. Read the computed background-color of each of the three .todo-item elements.
    - expect: All three items have background-color rgb(255, 182, 193)

#### 3.3. should retain #FFB6C1 background when a todo is marked as completed in pink mode

**File:** `tests/pink-mode/todo-items.spec.ts`

**Steps:**
  1. Cycle to pink mode, add todo 'Complete this task', then check its checkbox to mark it completed.
    - expect: The checkbox is checked
    - expect: the .text span receives the 'completed' class with strikethrough styling
  2. Read the computed background-color of the .todo-item element.
    - expect: background-color is still rgb(255, 182, 193) — the completed state has not overridden the pink background

#### 3.4. should retain #FFB6C1 background when a completed todo is toggled back to incomplete

**File:** `tests/pink-mode/todo-items.spec.ts`

**Steps:**
  1. Cycle to pink mode, add 'Toggle task', check it to complete it, then uncheck it.
    - expect: Todo is first completed (strikethrough), then back to incomplete (no strikethrough)
  2. Read the computed background-color of the .todo-item element after unchecking.
    - expect: background-color is rgb(255, 182, 193)

#### 3.5. should apply #FFB6C1 background immediately when a new todo is added in pink mode

**File:** `tests/pink-mode/todo-items.spec.ts`

**Steps:**
  1. Cycle to pink mode, type 'Immediate style test' into #todo-input, and click Add.
    - expect: New todo item appears in the list
  2. Without any further interaction, immediately read the computed background-color of the new .todo-item.
    - expect: background-color is rgb(255, 182, 193) — no flash of unstyled content; the style is applied on first render

#### 3.6. should NOT apply #FFB6C1 background to todo items when not in pink mode

**File:** `tests/pink-mode/todo-items.spec.ts`

**Steps:**
  1. Ensure the app is in light mode (clean localStorage). Add a todo 'Light mode task'. Read the computed background-color of the .todo-item.
    - expect: background-color is NOT rgb(255, 182, 193)
  2. Cycle to dark mode. Read the computed background-color of the .todo-item.
    - expect: background-color is NOT rgb(255, 182, 193)

### 4. Accessibility and Contrast

**Seed:** `tests/seed.spec.ts`

#### 4.1. should meet WCAG AA contrast for primary text on the pink page background

**File:** `tests/pink-mode/accessibility.spec.ts`

**Steps:**
  1. Cycle to pink mode. Compute the contrast ratio between the --text-primary CSS custom property value and the --page-bg value.
    - expect: Contrast ratio is ≥ 4.5:1 for normal-weight body text (WCAG AA)

#### 4.2. should meet WCAG AA contrast for muted/completed text on the #FFB6C1 todo item background

**File:** `tests/pink-mode/accessibility.spec.ts`

**Steps:**
  1. Cycle to pink mode. Add a todo and mark it as completed so the .text.completed span is visible.
    - expect: The completed text and its #FFB6C1 background are visible
  2. Compute the contrast ratio between the computed color of .text.completed and rgb(255, 182, 193).
    - expect: Contrast ratio is ≥ 4.5:1 (WCAG AA)

#### 4.3. should not trigger any axe accessibility violations in pink mode

**File:** `tests/pink-mode/accessibility.spec.ts`

**Steps:**
  1. Cycle to pink mode. Inject axe-core and run an accessibility audit on the full page.
    - expect: axe reports zero violations at WCAG AA level

#### 4.4. should suppress any CSS transition animation in pink mode when prefers-reduced-motion is active

**File:** `tests/pink-mode/accessibility.spec.ts`

**Steps:**
  1. Enable the 'prefers-reduced-motion: reduce' media emulation in the browser. Cycle to pink mode.
    - expect: No CSS transition or animation plays on background-color or any other property during the theme switch
    - expect: The page immediately reflects the pink theme without an animated transition

### 5. Persistence

**Seed:** `tests/seed.spec.ts`

#### 5.1. should persist pink mode selection in localStorage

**File:** `tests/pink-mode/persistence.spec.ts`

**Steps:**
  1. Cycle to pink mode.
    - expect: data-theme is 'pink'
  2. Read localStorage.getItem('theme-preference').
    - expect: Value is 'pink'

#### 5.2. should restore pink mode on page reload

**File:** `tests/pink-mode/persistence.spec.ts`

**Steps:**
  1. Cycle to pink mode, then reload the page.
    - expect: After reload, data-theme is 'pink' on the html element
    - expect: the page background renders in pink styling without a flash of light mode styles
    - expect: button text and aria attributes reflect pink mode

#### 5.3. should persist pink mode after todos are added and page is reloaded

**File:** `tests/pink-mode/persistence.spec.ts`

**Steps:**
  1. Cycle to pink mode. Add todos 'Task A' and 'Task B'. Reload the page.
    - expect: After reload, data-theme is 'pink'
    - expect: Both todos are present in the list
    - expect: Both .todo-item elements have computed background-color rgb(255, 182, 193)

#### 5.4. should fall back to light mode when localStorage contains a corrupt or unrecognised theme value

**File:** `tests/pink-mode/persistence.spec.ts`

**Steps:**
  1. Set localStorage 'theme-preference' to an invalid value such as 'hotpink' and reload the page.
    - expect: Page loads in light mode — data-theme is 'light'
    - expect: No JavaScript error is thrown to the console
    - expect: The toggle button shows 'Dark mode'

#### 5.5. should overwrite the previous theme in localStorage when cycling away from pink mode

**File:** `tests/pink-mode/persistence.spec.ts`

**Steps:**
  1. Cycle to pink mode, then click toggle once more to return to light mode.
    - expect: localStorage.getItem('theme-preference') is 'light', not 'pink'
    - expect: data-theme is 'light'

### 6. Regression – Existing Themes

**Seed:** `tests/seed.spec.ts`

#### 6.1. should still toggle correctly from light to dark mode after pink mode is introduced

**File:** `tests/pink-mode/regression.spec.ts`

**Steps:**
  1. Start in light mode. Click the toggle once.
    - expect: data-theme is 'dark'
    - expect: button text is 'Light mode'
    - expect: aria-pressed is 'true'
    - expect: background-color of body is rgb(17, 24, 39)

#### 6.2. should still toggle correctly from dark back to light mode

**File:** `tests/pink-mode/regression.spec.ts`

**Steps:**
  1. Set localStorage to 'dark', reload, then click the toggle once to advance past dark mode through pink mode to light.
    - expect: After cycling through all modes the app eventually returns to data-theme 'light'

#### 6.3. should not display pink todo item backgrounds in light mode

**File:** `tests/pink-mode/regression.spec.ts`

**Steps:**
  1. Ensure app is in light mode. Add a todo. Read the computed background-color of .todo-item.
    - expect: background-color is NOT rgb(255, 182, 193)

#### 6.4. should not display pink todo item backgrounds in dark mode

**File:** `tests/pink-mode/regression.spec.ts`

**Steps:**
  1. Cycle to dark mode. Add a todo. Read the computed background-color of .todo-item.
    - expect: background-color is NOT rgb(255, 182, 193)

#### 6.5. should preserve todos stored before pink mode was activated

**File:** `tests/pink-mode/regression.spec.ts`

**Steps:**
  1. Add three todos in light mode. Cycle to pink mode.
    - expect: All three todos are still present in the list
    - expect: All three .todo-item elements have background-color rgb(255, 182, 193)
